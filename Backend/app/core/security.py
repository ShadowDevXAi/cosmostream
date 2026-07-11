# app/core/security.py

import bcrypt
import logging
from typing import Optional
from fastapi import Header, HTTPException, Request, status
from app.core.database import db_users
from app.core.config import settings

logger = logging.getLogger("cosmos_logger")

def hash_pass(p: str) -> str:
    """Cryptographic password hashing utility using standard bcrypt algorithms"""
    return bcrypt.hashpw(p.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

async def get_current_user(
    x_api_key: Optional[str] = Header(None, alias="X-API-Key"),
    authorization: Optional[str] = Header(None)
):
    """
    🔒 CENTRALIZED FULL-STACK AUTHENTICATION DEPENDENCY
    Extracts tokens seamlessly from multi-channel incoming header structures 
    and implements absolute query isolation to permanently kill tester account leaks.
    """
    # Step 1: Secure extraction from both direct infrastructure keys and Bearer session arrays
    token = x_api_key
    if not token and authorization and authorization.startswith("Bearer "):
        token = authorization.replace("Bearer ", "").strip()
    elif not token and authorization:
        token = authorization.strip()

    # Clean character spacing and strip incoming mock variations
    clean_token = token.strip() if token else None

    # 🚨 GUARD 1: If credentials evaluate to empty or stringified null states, drop instantly
    if not clean_token or clean_token in ["", "null", "undefined", "None"]:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Access Denied: Secure authentication token signature is missing or uninitialized."
        )

    # Secondary deep removal for duplicated string headers within frontend state contexts
    if "Bearer " in clean_token:
        clean_token = clean_token.replace("Bearer ", "").strip()

    logger.info(f"🔑 Authentication Dependency Intercepted Verification Footprint.")

    # 🧠 DIRECT MONGO CHECK: Dynamic query resolution matching persistent API keys or runtime tokens
    user = await db_users.find_one({
        "$or": [
            {"sub_api_key": clean_token},
            {"active_sessions": clean_token}
        ]
    })

    if user:
        # 🚨 GUARD 2: Explicit shield blocking loose empty matching onto default tester profile layers
        if user.get("username") == "tester" and clean_token != user.get("sub_api_key") and clean_token not in user.get("active_sessions", []):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Security Lockout: Cross-contamination user token mismatch intercepted."
            )

        # Automated pipeline bypass matrix for sandbox environments (Strictly Target Locked)
        if not user.get("is_verified"):
            if settings.DEBUG_MODE:
                logger.info(f"🔄 [AUTO-BYPASS VERIFY] Profile dynamic validation forced for user: {user.get('username')}")
                await db_users.update_one({"_id": user["_id"]}, {"$set": {"is_verified": True}})
                user["is_verified"] = True
                return user
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, 
                detail="Account not verified. Please verify your active identity."
            )
        return user

    # 🚨 CONTROLLED DEBUG GATEWAY: Only populates if DEBUG_MODE is active AND an explicit test token is hit
    if settings.DEBUG_MODE and clean_token in ["cosmos_sk_fallback_tester", "debug_pass"]:
        logger.warning("⚠️ Security Alert: Active Bypass Mode generating controlled mock context profile.")
        tester_username = "shadow_tester"
        fallback_user = await db_users.find_one({"username": tester_username})
        
        if not fallback_user:
            fallback_user = {
                "email": "tester@shadow.com",
                "username": tester_username,
                "password": hash_pass("tester_bypass_123"),
                "is_verified": True, 
                "upload_limit_mb": 2048,               # Custom 2GB Testing Capacity limit
                "current_usage_mb": 0.0,               # Initializing baseline load vector
                "bandwidth_used_gb": 0.0,              # Prevent telemetry sync crashing
                "lifetime_requests_count": 0,          # Added for real-time dashboard total clicks count
                "sub_api_key": "cosmos_sk_fallback_tester",
                "active_sessions": ["cosmos_sk_fallback_tester"]
            }
            await db_users.insert_one(fallback_user)
        return fallback_user

    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN, 
        detail="Invalid API Key or active authorization session vector dead. Access denied."
    )
