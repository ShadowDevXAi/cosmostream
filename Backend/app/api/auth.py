# app/api/auth.py

import io
import asyncio
import datetime
import bcrypt
import secrets
import logging
import shortuuid
import traceback
from typing import Optional
from fastapi import APIRouter, HTTPException, Header, Form, File, UploadFile, Request, Depends, status
from app.models.schemas import UserLogin
from app.core.database import db_users, tg_bot
from app.core.security import hash_pass, get_current_user
from app.core.config import settings
# 🔥 Pulls email core directly from the standalone mailer utility
from app.core.mailer import send_real_gmail_verification

logger = logging.getLogger("cosmos_logger")
router = APIRouter(tags=["Industrial Authentication Layer"])

# 🚨 SECURITY & ANTI-FRAUD THREAT MATRIX
DISPOSABLE_DOMAINS = [
    "mailinator.com", "10minutemail.com", "tempmail.com", "yopmail.com", 
    "dispostable.com", "sharklasers.com", "guerrillamailblock.com"
]

# =====================================================================
# 🌐 PIPELINE AUTHENTICATION CONTROLLERS
# =====================================================================
@router.post("/register")
async def register(
    request: Request,
    email: str = Form(...),
    username: str = Form(...),
    password: str = Form(...),
    confirm_password: str = Form(...),
    telegram_id: int = Form(...),         # Raw numerical integer ID
    telegram_username: str = Form(...),   # Explicit telegram text handle
    name: str = Form(...),
    surname: str = Form(...),
    mobile: str = Form(...),
    dob: str = Form(...),
    profile_pic: UploadFile = File(None)   # Optional Profile Picture Ingestion
):
    # 🚨 STRICT REJECTION: Initial validation checks
    if password != confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match!")

    clean_email = email.strip() if email else ""
    clean_username = username.strip() if username else ""

    # Anti-Leak Guard: Intercept initialization requests with corrupted string states
    if not clean_email or clean_email in ["", "null", "undefined"] or not clean_username or clean_username in ["", "null", "undefined"]:
        raise HTTPException(status_code=400, detail="Bhai, Email aur Username payload dimensions valid hona zaroori hai.")

    # Anti-Fraud Layer 1: Disposable Domain Check
    if clean_email.split("@")[-1].lower() in DISPOSABLE_DOMAINS:
        raise HTTPException(status_code=400, detail="Temporary email vectors are strictly prohibited.")

    # Anti-Fraud Layer 2: IP Rate Limiting Firewall
    client_ip = request.client.host
    one_hour_ago = datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(hours=1)
    
    # 🧠 DIRECT MONGO CHECK: Real-time IP log validation count
    recent_requests = await db_users.count_documents({"client_ip": client_ip, "created_at": {"$gte": one_hour_ago}})
    if recent_requests >= 3:
        raise HTTPException(status_code=429, detail="Security lockout: Too many signups from this IP node.")

    # 🧠 DIRECT MONGO CHECK: Unique identifier collision checks
    if await db_users.find_one({"email": clean_email}): 
        raise HTTPException(status_code=400, detail="Email already registered")
    if await db_users.find_one({"username": clean_username}): 
        raise HTTPException(status_code=400, detail="Username already taken")

    # Safe Profile Picture Storage Archiver (Telegram Channel Asset Backup Loop)
    tg_profile_pic_id = None
    if profile_pic:
        try:
            pic_bytes = await profile_pic.read()
            if not tg_bot.is_connected:
                logger.info("🔄 Telegram client wasn't initialized on loop. Re-attaching handle dynamically...")
                await tg_bot.start()
                
            sent_pic = await asyncio.wait_for(
                tg_bot.send_document(
                    settings.CHANNEL_ID, 
                    io.BytesIO(pic_bytes), 
                    file_name=f"AVATAR_{clean_username}_{profile_pic.filename}"
                ), 
                timeout=60.0
            )
            tg_profile_pic_id = sent_pic.document.file_id
            logger.info(f"📸 Profile picture securely backed up for node: {clean_username}")
        except Exception as e:
            logger.error(f"⚠️ Non-critical avatar upload dropped: {str(e)}")

    email_token = shortuuid.uuid()
    mobile_otp = shortuuid.ShortUUID(alphabet="0123456789").random(length=6)

    # 🔥 GENERATED EXACTLY DURING ACCOUNT GENERATION STAGE (PERMANENT)
    generated_api_key = f"cosmos_ak_{secrets.token_hex(16)}"
    generated_api_secret = f"cosmos_sk_{secrets.token_hex(32)}"

    user_payload = {
        "email": clean_email, 
        "username": clean_username, 
        "password": hash_pass(password),
        "telegram_id": telegram_id,
        "telegram_username": telegram_username.replace("@", "").strip() if telegram_username else "User",
        "name": name, "surname": surname, "mobile": mobile.strip() if mobile else "", "dob": dob,
        "profile_pic_tg_id": tg_profile_pic_id, 
        "client_ip": client_ip,
        "is_verified": True,         # KYC AUTOMATIC BYPASS
        "email_verified": False, 
        "mobile_verified": False,
        "email_verify_token": email_token, "mobile_otp_code": mobile_otp,
        "upload_limit_mb": 500, "current_usage_mb": 0.0,
        "lifetime_requests_count": 0, "bandwidth_used_gb": 0.0,
        "sub_api_key": generated_api_key,       # Permanent User API Key
        "sub_api_secret": generated_api_secret, # Permanent User API Secret
        "custom_api_key": None, "custom_app_secret": None,
        "plan_name": "Pulsar Free",
        "active_sessions": [],       # Array initialization matching schema
        "created_at": datetime.datetime.now(datetime.timezone.utc)
    }
    await db_users.insert_one(user_payload)

    # Dispatches email async using the isolated core service layer
    await send_real_gmail_verification(clean_email, email_token, clean_username)
    return {
        "success": True, 
        "message": "Account initialized. Verification link routed to your email inbox.",
        "api_key": generated_api_key,
        "api_secret": generated_api_secret
    }


# =====================================================================
# 🤖 ON-DEMAND CONTROLLED TELEGRAM OTP SIGNAL DISPATCH
# =====================================================================
@router.post("/trigger-telegram-otp")
async def trigger_telegram_otp(username: str = Form(...)):
    clean_app_username = username.strip() if username else ""
    
    if not clean_app_username or clean_app_username in ["", "null", "undefined"]:
        raise HTTPException(status_code=400, detail="Username string parameter cannot be empty or null.")

    user = await db_users.find_one({"username": clean_app_username})
    
    if not user:
        raise HTTPException(status_code=404, detail="Target identity block not found.")

    otp = user.get("mobile_otp_code")
    target_tg_id = user.get("telegram_id")
    tg_handle = user.get("telegram_username", "User")

    if not target_tg_id:
        raise HTTPException(
            status_code=400, 
            detail="Bhai, is account ke sath koi numerical Telegram ID linked nahi hai. Please re-register."
        )
        
    try:
        if not tg_bot.is_connected:
            await tg_bot.start()
            
        await tg_bot.send_message(
            chat_id=int(target_tg_id),
            text=(
                f"🔒 *Cosmos Media Cloud — Security Checkpoint*\n\n"
                f"Hello @{tg_handle},\n"
                f"Your 6-digit secure activation OTP code is:\n\n"
                f"🎯 ` {otp} `\n\n"
                f"_Do not expose this code to secondary nodes._"
            )
        )
        logger.info(f"🤖 Telegram DM OTP routed to numerical target core: {target_tg_id}")
        return {"success": True, "message": "OTP successfully routed to your Telegram DM."}
        
    except Exception as e:
        error_name = type(e).__name__
        logger.error(f"❌ Bot DM Gateway routing failed: {error_name} - {str(e)}")
        
        if "ChatWriteForbidden" in error_name or "PeerIdInvalid" in error_name:
            raise HTTPException(
                status_code=403, 
                detail=f"Bhai, @{tg_handle} ne bot par /start nahi dabaya hai! Pehle Telegram open karke bot ko start kijiye."
            )
        raise HTTPException(status_code=500, detail=f"Telegram Gateway connection dropped: {error_name}")


# =====================================================================
# 🌐 SYSTEM AUTH AUXILIARIES (LOGIN & VERIFICATIONS)
# =====================================================================
@router.post("/login")
async def login(credentials: UserLogin):
    # 🚨 STRICT REJECTION: Empty Query Trap Guard
    clean_identifier = credentials.identifier.strip() if credentials.identifier else ""
    
    if not clean_identifier or clean_identifier in ["", "null", "undefined"] or not credentials.password:
        raise HTTPException(status_code=400, detail="Bhai, login identification payload empty nahi ho sakta.")

    user = await db_users.find_one({"$or": [{"email": clean_identifier}, {"username": clean_identifier}]})
    
    if not user: 
        raise HTTPException(status_code=401, detail="Invalid Credentials Architecture.")

    if not bcrypt.checkpw(credentials.password.encode('utf-8'), user["password"].encode('utf-8')):
        raise HTTPException(status_code=401, detail="Invalid Credentials Architecture.")

    if not user.get("email_verified", False) and not settings.DEBUG_MODE:
        return {
            "success": False,
            "email_verification_pending": True,
            "detail": "Please verify your email via the clearance tracking link inside your registered inbox."
        }

    if not settings.DEBUG_MODE:
        if not user.get("mobile_verified"): 
            raise HTTPException(status_code=403, detail="Please complete your 2FA OTP verification.")
        if not user.get("is_verified"): 
            raise HTTPException(status_code=403, detail="Account pending verification review.")

    # 🔥 FIXED PERSISTENCE LAYER: Pull the account's existing keys instead of overwriting them
    existing_api_key = user.get("sub_api_key")
    existing_api_secret = user.get("sub_api_secret")

    # Fallback Generation Loop (Sirf un purane accounts ke liye jinki keys pehle create nahi hui thi)
    if not existing_api_key or existing_api_key in ["", None]:
        existing_api_key = f"cosmos_ak_{secrets.token_hex(16)}"
        existing_api_secret = f"cosmos_sk_{secrets.token_hex(32)}"
        await db_users.update_one(
            {"_id": user["_id"]},
            {"$set": {"sub_api_key": existing_api_key, "sub_api_secret": existing_api_secret}}
        )

    plan_name = user.get("plan_name", "Pulsar Free")
    limit_mb = user.get("upload_limit_mb", 500)
    
    max_devices = 5 if limit_mb > 1024 or "Premium" in plan_name else 1
    
    active_sessions = user.get("active_sessions", [])
    if not isinstance(active_sessions, list):
        active_sessions = []
        
    if len(active_sessions) >= max_devices:
        active_sessions.pop(0)  
        
    new_session_token = f"cosmos_session_{secrets.token_hex(32)}"
    active_sessions.append(new_session_token)
    
    # Update active tracking runtime session token
    await db_users.update_one(
        {"_id": user["_id"]},
        {"$set": {"active_sessions": active_sessions}}
    )

    return {
        "success": True, 
        "token": new_session_token, 
        "api_key": existing_api_key,        # Strictly returns user's original account key
        "api_secret": existing_api_secret,  # Strictly returns user's original account secret
        "user": {"username": user["username"], "email": user["email"]}
    }

@router.get("/verify-email")
async def verify_email(token: str):
    clean_token = token.strip() if token else ""
    
    if not clean_token or clean_token in ["", "null", "undefined"]:
        raise HTTPException(status_code=400, detail="Token validation parameter missing or invalid.")

    user = await db_users.find_one({"email_verify_token": clean_token})
    if not user: 
        raise HTTPException(status_code=400, detail="Invalid token parameters.")
        
    await db_users.update_one({"_id": user["_id"]}, {"$set": {"email_verified": True}})
    return {"success": True, "message": "Email address verified successfully!"}

@router.post("/verify-mobile")
async def verify_mobile(mobile: str = Form(...), otp: str = Form(...)):
    clean_mobile = mobile.strip() if mobile else ""
    clean_otp = otp.strip() if otp else ""
    
    if not clean_mobile or clean_mobile in ["", "null", "undefined"] or not clean_otp or clean_otp in ["", "null", "undefined"]:
        raise HTTPException(status_code=400, detail="Mobile or OTP parameter vectors cannot be empty.")

    user = await db_users.find_one({"mobile": clean_mobile, "mobile_otp_code": clean_otp})
    if not user: 
        raise HTTPException(status_code=400, detail="Token verification signature failed.")
        
    await db_users.update_one({"_id": user["_id"]}, {"$set": {"mobile_verified": True}})
    return {"success": True, "message": "Mobile validation transaction absolute!"}

@router.post("/admin/verify-user")
async def verify_user(username: str, secret_code: str = Header(...)):
    if secret_code != settings.ADMIN_SECRET:
        raise HTTPException(status_code=401, detail="Unauthorized admin access token signature.")
        
    clean_username = username.strip() if username else ""
    
    if not clean_username or clean_username in ["", "null", "undefined"]:
        raise HTTPException(status_code=400, detail="Username parameter cannot be empty or null.")

    user = await db_users.find_one({"username": clean_username})
    if not user: 
        raise HTTPException(status_code=404, detail="Target user node not found.")
        
    await db_users.update_one({"_id": user["_id"]}, {"$set": {"is_verified": True}})
    return {"success": True, "message": f"User {clean_username} has been successfully verified and activated by Admin."}
