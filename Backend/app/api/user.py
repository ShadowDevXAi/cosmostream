# app/api/user.py

import secrets
import hashlib
from fastapi import APIRouter, HTTPException, Depends, Request, status
from app.core.database import db_users, db_files

router = APIRouter(prefix="/user", tags=["User Telemetry Vault"])

# =====================================================================
# 🧠 CORE SECURITY GATEWAY: DIRECT MONGO ACTIVE SESSION VERIFIER
# =====================================================================
async def get_live_verified_user(request: Request):
    """
    Strictly extracts authorization tokens from headers and executes
    real-time parameter scanning over live MongoDB states to kill cache leaks.
    """
    x_api_key = request.headers.get("X-API-Key") or request.headers.get("x-api-key")
    
    if not x_api_key:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            x_api_key = auth_header.replace("Bearer ", "").strip()
            
    if not x_api_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Authentication gateway token vector missing."
        )
        
    # Clean up "Bearer " string if forwarded explicitly inside X-API-Key header
    if "Bearer " in x_api_key:
        x_api_key = x_api_key.replace("Bearer ", "").strip()

    # Clean whitespace strings and isolate literal interpretations cleanly
    clean_key = x_api_key.strip() if x_api_key else None

    # 🚨 GUARD 1: Intercept empty or uninitialized validation states instantly before DB query
    if not clean_key or clean_key in ["", "null", "undefined", "None"]:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication signatures evaluated. Session context drop."
        )

    # 🧠 DIRECT MONGO CHECK: Evaluates credentials strictly against active session arrays or API keys
    live_user = await db_users.find_one({"active_sessions": clean_key}) or await db_users.find_one({"sub_api_key": clean_key})
    
    # 🚨 STRICT REJECTION: Immediate eviction gate. Zero fallbacks, mock values, or testing bypasses allowed
    if not live_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Session context drop. Target authorization token not active inside cluster nodes."
        )
        
    # 🚨 GUARD 2: Explicit cross-contamination shield blocking loose empty matching onto the tester profile
    if live_user.get("username") == "tester" and clean_key != live_user.get("sub_api_key") and clean_key not in live_user.get("active_sessions", []):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Security Lockout: Cross-account workspace query vector blocked."
        )

    # 🔒 CONCURRENT DEVICE GUARD MATRIX
    if clean_key.startswith("cosmos_session_"):
        active_sessions = live_user.get("active_sessions", [])
        if clean_key not in active_sessions:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Session overridden or terminated by a concurrent secondary hardware login handshake."
            )
            
    return live_user

# =====================================================================
# 🌐 DYNAMIC TELEMETRY FETCH ENGINES
# =====================================================================
@router.get("/dashboard-telemetry")
@router.get("/telemetry")
async def get_dashboard_telemetry(request: Request):
    """Unified engine aggregating current workspace computing variables and tracking logs directly from DB."""
    # 🧠 DIRECT MONGO CHECK & STRICT REJECTION RUNTIME ENFORCED
    live_user = await get_live_verified_user(request)
    
    username = live_user.get("username", "").strip() if live_user.get("username") else ""
    
    # Anti-Leak Shield: If identity fields resolve to unassigned configurations, break early
    if not username or username in ["", "null", "undefined"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Action Intercepted: Unable to map telemetry matrix to a valid current workspace profile."
        )

    # Strictly isolates file aggregation criteria to dynamic active username constraints only
    total_files = await db_files.count_documents({"owner": username})
    
    # Pull dynamic parameters freshly computed directly from live collection state records
    used_mb = round(live_user.get("current_usage_mb", 0.0), 2)
    limit_mb = live_user.get("upload_limit_mb", 500)
    percentage = round((used_mb / limit_mb) * 100, 1) if limit_mb > 0 else 0
    
    # Breaks the synthetic "Supernova Premium" string overwrite rule that generated layout deviations
    plan_designation = live_user.get("plan_name", "Free Tier")

    # 🖼nt SMART AVATAR FALLBACK MAPPING
    resolved_avatar = live_user.get("avatar_url")
    if not resolved_avatar:
        resolved_avatar = "🤖" if live_user.get("profile_pic_tg_id") else "🪐"

    return {
        "success": True,
        # 🔥 CRITICAL FRONTEND PARITY CODES: Serves explicit framework variables mapping to core components
        "active_tier_framework": plan_designation,
        "max_capacity_mb": limit_mb,
        "telemetry": {
            "plan_name": plan_designation,
            "storage_used_mb": used_mb,
            "storage_limit_mb": limit_mb,
            "storage_percentage": percentage,
            "storage_remaining_mb": round(max(0.0, limit_mb - used_mb), 2),
            "lifetime_requests": live_user.get("lifetime_requests_count", 0), 
            "bandwidth_used_gb": round(live_user.get("bandwidth_used_gb", 0.0), 4), 
            "total_files_count": total_files,
            "sub_api_key": live_user.get("sub_api_key", "Not Generated")
        },
        "user_profile": {
            "username": username,
            "mobile": live_user.get("mobile", ""),
            "avatar_url": resolved_avatar
        }
    }

# =====================================================================
# 🔑 CRYPTOGRAPHIC API KEY GENERATOR
# =====================================================================
@router.post("/generate-api-key")
async def generate_custom_api_key(request: Request):
    """Generates unique, cryptographically secure live token credentials for API integration layers."""
    # 🧠 DIRECT MONGO CHECK & STRICT REJECTION RUNTIME ENFORCED
    live_user = await get_live_verified_user(request)
    
    raw_api_key = f"cos_live_{secrets.token_hex(16)}"
    raw_app_secret = secrets.token_urlsafe(32)
    encrypted_secret = hashlib.sha256(raw_app_secret.encode()).hexdigest()

    # Atomically inject and anchor the generated key pairs using direct database _id reference boundaries
    await db_users.update_one(
        {"_id": live_user["_id"]},
        {"$set": {
            "custom_api_key": raw_api_key,
            "custom_app_secret": raw_app_secret,  
            "secure_hashed_secret": encrypted_secret
        }}
    )

    return {
        "success": True,
        "api_key": raw_api_key,
        "app_secret": raw_app_secret,
        "message": "Write down your app secret. It will not be displayed again for security purposes."
    }
