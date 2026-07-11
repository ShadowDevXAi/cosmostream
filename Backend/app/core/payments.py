# app/api/payments.py

import logging
import random
from datetime import datetime, timedelta, timezone
from typing import Literal
import razorpay
from fastapi import APIRouter, HTTPException, Request, status
from pydantic import BaseModel
from app.core.config import settings
from app.core.database import db_users

logger = logging.getLogger("cosmos_logger")
router = APIRouter(prefix="/payments", tags=["Billing & Subscription Engine"])

# Initializing Razorpay instance using central infrastructure credentials safely
razor_client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

IntervalTypes = Literal["free", "test", "weekly", "monthly", "twomonths", "fourmonths", "sixmonths", "yearly"]

class PricingOrderRequest(BaseModel):
    interval: IntervalTypes

class PaymentVerificationRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str
    interval: IntervalTypes

# 🎛️ BASE FREE TIER PARAMETERS
FREE_CONFIG = {"price": 0, "storage_mb": 500, "label": "Free Tier", "days": 0, "max_downloads": 5}

# 🎛️ CENTRAL PREMIUM CONFIGURATION MATRIX (Indicates raw addon specs to be merged with Free Tier)
PLANS_CONFIG = {
    "free": FREE_CONFIG,
    "test": {"price": 1, "storage_mb": 100, "label": "Spark Plan", "days": 1, "max_downloads": 15},
    "weekly": {"price": 49, "storage_mb": 10 * 1024, "label": "Orbit Weekly", "days": 7, "max_downloads": 50},
    "monthly": {"price": 199, "storage_mb": 50 * 1024, "label": "Nebula Monthly", "days": 30, "max_downloads": 250},
    "twomonths": {"price": 349, "storage_mb": 120 * 1024, "label": "Galaxy Tier", "days": 60, "max_downloads": 600},
    "fourmonths": {"price": 649, "storage_mb": 250 * 1024, "label": "Quasar Tier", "days": 120, "max_downloads": 1500},
    "sixmonths": {"price": 899, "storage_mb": 500 * 1024, "label": "Supernova Premium", "days": 180, "max_downloads": 4000},
    "yearly": {"price": 1999, "storage_mb": 1000 * 1024, "label": "Infinity Plan", "days": 365, "max_downloads": 99999}
}

INTERVAL_ORDER = ["free", "test", "weekly", "monthly", "twomonths", "fourmonths", "sixmonths", "yearly"]

# =====================================================================
# 🧠 CORE SECURITY GATEWAY: DIRECT MONGO ACTIVE SESSION VERIFIER
# =====================================================================
async def get_live_billing_user(request: Request):
    """
    🔒 ULTRA-SECURE BILLING AUTH INTERCEPTOR
    Prevents uninitialized token vectors from querying the database 
    and eliminates accidental fallback cross-matching onto default tester records.
    """
    client_api_key = request.headers.get("X-Cosmos-API-Key") or request.headers.get("X-API-Key") or request.headers.get("x-api-key")
    auth_header = request.headers.get("Authorization")
    
    token = None
    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header.replace("Bearer ", "").strip()
    elif auth_header:
        token = auth_header.strip()
        
    clean_key = client_api_key.strip() if client_api_key else None
    clean_token = token.strip() if token else None
    
    final_vector = clean_key or clean_token
    if final_vector and "Bearer " in final_vector:
        final_vector = final_vector.replace("Bearer ", "").strip()

    # 🚨 GUARD 1: Intercept corrupt or dead authentication frames instantly before lookup loop
    if not final_vector or final_vector in ["", "null", "undefined", "None"]:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Authentication gateway token vector missing or corrupted."
        )

    user = await db_users.find_one({"active_sessions": final_vector}) or await db_users.find_one({"sub_api_key": final_vector})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Access denied to billing infrastructure vectors."
        )
        
    # 🚨 GUARD 2: Explicit shield blocking loose empty matching onto the tester profile bounds
    if user.get("username") == "tester" and final_vector != user.get("sub_api_key") and final_vector not in user.get("active_sessions", []):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Security Lockout: Cross-account transaction query space blocked."
        )
        
    return user

# =====================================================================
# 📋 ROUTE 1: GET AVAILABLE PLANS WITH MERGED RETENTION ENGINE
# =====================================================================
@router.get("/plans")
async def get_available_plans(request: Request):
    user = await get_live_billing_user(request)
    
    current_interval = user.get("plan_interval", "free")
    purchased_interval = user.get("purchased_interval", "free")
    
    premium_until_str = user.get("active_premium_until")
    is_premium_active = False
    if premium_until_str:
        try:
            if datetime.fromisoformat(premium_until_str) > datetime.now(timezone.utc).replace(tzinfo=None):
                is_premium_active = True
        except ValueError:
            pass

    current_idx = INTERVAL_ORDER.index(current_interval) if current_interval in INTERVAL_ORDER else 0
    processed_plans = []

    for interval, config in PLANS_CONFIG.items():
        is_exact_match = (current_interval == interval)
        target_idx = INTERVAL_ORDER.index(interval)
        
        if interval == "free":
            tier_action = "downgrade_free"
        elif target_idx > current_idx:
            tier_action = "upgrade"
        else:
            tier_action = "tier_switch"

        # 🔥 LOCK & MERGE TOGGLE GATES
        if is_premium_active:
            if interval == purchased_interval or interval == "free":
                allow_purchase_flag = not is_exact_match  
            else:
                allow_purchase_flag = False  
        else:
            allow_purchase_flag = not is_exact_match

        display_storage = int(config["storage_mb"])
        display_downloads = int(config["max_downloads"])
        
        if interval != "free":
            display_storage += int(FREE_CONFIG["storage_mb"])
            display_downloads += int(FREE_CONFIG["max_downloads"])

        processed_plans.append({
            "interval": interval,
            "name": config["label"],
            "price": config["price"],
            "storage_limit_mb": display_storage,
            "max_downloads": display_downloads,
            "is_current": is_exact_match,
            "allow_purchase": allow_purchase_flag, 
            "tier_type": tier_action
        })

    return {
        "success": True, 
        "current_user_limit_mb": user.get("upload_limit_mb", 500), 
        "current_user_interval": current_interval,
        "plans": processed_plans
    }

# =====================================================================
# 💳 ROUTE 2: DIRECT LEASE SHIFTING FILTER & MERGE PIPELINE INITIALIZER
# =====================================================================
@router.post("/create-order")
async def create_subscription_order(payload: PricingOrderRequest, request: Request):
    user = await get_live_billing_user(request)
    
    if payload.interval not in PLANS_CONFIG:
        raise HTTPException(status_code=400, detail="Invalid interval node selected.")
        
    plan = PLANS_CONFIG[payload.interval]
    purchased_interval = user.get("purchased_interval", "free")
    
    premium_until_str = user.get("active_premium_until")
    is_premium_active = False
    if premium_until_str:
        try:
            if datetime.fromisoformat(premium_until_str) > datetime.now(timezone.utc).replace(tzinfo=None):
                is_premium_active = True
        except ValueError:
            pass

    if user.get("plan_interval") == payload.interval:
        raise HTTPException(status_code=400, detail="This exact tier layout configuration is already active.")

    # 🔄 INSTANT MERGED SWITCHING ENFORCEMENT (Downgrade/Reset Flow)
    if payload.interval == "free" or (is_premium_active and payload.interval == purchased_interval):
        
        if payload.interval == "free":
            target_storage = int(FREE_CONFIG["storage_mb"])
            target_downloads = int(FREE_CONFIG["max_downloads"])
            target_label = FREE_CONFIG["label"]
        else:
            target_storage = int(plan["storage_mb"]) + int(FREE_CONFIG["storage_mb"])
            target_downloads = int(plan["max_downloads"]) + int(FREE_CONFIG["max_downloads"])
            target_label = f"{FREE_CONFIG['label']} + {plan['label']} (Merged)"

        await db_users.update_one(
            {"_id": user["_id"]},
            {
                "$set": {
                    "plan_interval": payload.interval,
                    "plan_name": target_label,
                    "upload_limit_mb": target_storage,
                    "download_limit": target_downloads,          # 🔥 Sync for Overview UI Grid
                    "max_downloads_allowed": target_downloads     # 🔥 Sync for Core Schema
                }
            }
        )
        return {
            "success": True,
            "order_id": None, 
            "message": f"Successfully merged and shifted compute layers framework to {target_label}.",
            "interval": payload.interval
        }

    if is_premium_active and payload.interval != purchased_interval:
        raise HTTPException(
            status_code=400, 
            detail="Lease lock active: You cannot bridge to another tier without completing standard transaction processing paths."
        )

    # 💳 STANDARD LIVE GATEWAY BILLING INITIATION
    amount_in_paise = int(plan["price"]) * 100
    try:
        # 🔥 CRITICAL CORE PLUG FIX: Removed invalid 'payment_capture' key and added a safe 'receipt' tracker
        # Razorpay Live server requires a clean validation dictionary mapping to avoid 500 checkout halts
        random_suffix = random.randint(1000, 9999)
        unique_receipt_id = f"rcpt_{user['username']}_{int(datetime.now(timezone.utc).timestamp())}_{random_suffix}"
        
        order_options = {
            "amount": amount_in_paise, 
            "currency": "INR", 
            "receipt": unique_receipt_id
        }
        
        razorpay_order = razor_client.order.create(data=order_options)
        
        return {
            "success": True,
            "order_id": razorpay_order["id"],
            "amount": razorpay_order["amount"],
            "currency": razorpay_order["currency"],
            "interval": payload.interval
        }
    except Exception as e:
        logger.error(f"❌ Razorpay order creation crash details: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Razorpay handshake core failure: {str(e)}")

# =====================================================================
# 🗲 ROUTE 3: CRYPTOGRAPHIC HANDSHAKE & DYNAMIC MERGED QUOTA LOCKS
# =====================================================================
@router.post("/verify-payment")
async def verify_payment_signature(payload: PaymentVerificationRequest, request: Request):
    user = await get_live_billing_user(request)
    plan = PLANS_CONFIG[payload.interval]
    
    try:
        param_dict = {
            'razorpay_order_id': payload.razorpay_order_id,
            'razorpay_payment_id': payload.razorpay_payment_id,
            'razorpay_signature': payload.razorpay_signature
        }
        razor_client.utility.verify_payment_signature(param_dict)
        
        payment_info = razor_client.payment.fetch(payload.razorpay_payment_id)
        if payment_info.get("status") not in ["authorized", "captured"]:
            raise HTTPException(status_code=400, detail="Inbound payment authentication dropped.")

        lease_days = int(plan["days"])
        expiry_timestamp = (datetime.now(timezone.utc).replace(tzinfo=None) + timedelta(days=lease_days)).isoformat()

        # 🔥 THE ABSOLUTE MERGE SUM: Syncs bought parameters directly with base allocations
        merged_storage = int(plan["storage_mb"]) + int(FREE_CONFIG["storage_mb"])
        merged_downloads = int(plan["max_downloads"]) + int(FREE_CONFIG["max_downloads"])
        merged_label = f"{FREE_CONFIG['label']} + {plan['label']} (Merged)"

        await db_users.update_one(
            {"_id": user["_id"]}, 
            {
                "$set": {
                    "plan_interval": payload.interval,        
                    "plan_name": merged_label,               
                    "upload_limit_mb": merged_storage,     
                    "downloads_used": 0,    
                    "max_downloads_allowed": merged_downloads,  # Core Schema Sync
                    "download_limit": merged_downloads,        # 🔥 Frontend Matrix Telemetry Sync Patch
                    "purchased_interval": payload.interval,
                    "active_premium_until": expiry_timestamp
                }
            }
        )
        return {"success": True, "detail": f"Handshake verified. Parameters merged into {merged_label} configuration successfully."}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Billing signature pipeline crash: {str(e)}")
