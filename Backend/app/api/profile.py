# app/api/profile.py

from fastapi import APIRouter, HTTPException, status, UploadFile, File, Request
from pydantic import BaseModel, Field
from typing import Optional
import os
import shutil
import logging
from app.core.database import db_users, db_files  # Mapped to your MongoDB Motor instances

logger = logging.getLogger("cosmos_logger")
router = APIRouter(prefix="/profile", tags=["User Profile Management Engine"])

# 📐 REGULATORY DATA VALIDATION SCHEMAS
class ProfileUpdateRequest(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=50)
    username: Optional[str] = Field(None, min_length=3, max_length=20)
    mobile: Optional[str] = Field(None, pattern=r"^\+?[0-9]{10,15}$")
    dob: Optional[str] = Field(None, pattern=r"^\d{4}-\d{2}-\d{2}$")  # Enforces YYYY-MM-DD strict verification

# =====================================================================
# 🧠 CORE SECURITY GATEWAY: DIRECT MONGO ACTIVE SESSION VERIFIER
# =====================================================================
async def get_live_authenticated_user(request: Request):
    """ Ensures strict real-time cluster checks against session arrays and API keys. """
    token = request.headers.get("X-API-Key")
    if not token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.replace("Bearer ", "").strip()
            
    # Clean whitespace and isolate literal string interpretations
    clean_token = token.strip() if token else None

    # 🚨 GUARD 1: Intercept empty or uninitialized authentication signatures instantly
    if not clean_token or clean_token in ["", "null", "undefined", "None"]:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Missing authorization node credentials footprint."
        )
        
    # Strict selector lookup context loops
    user = await db_users.find_one({"active_sessions": clean_token}) or await db_users.find_one({"sub_api_key": clean_token})
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Active matrix user account session not found or invalid."
        )
        
    # 🚨 GUARD 2: Intercept loose empty token leakage matching default tester fields
    if user.get("username") == "tester" and clean_token != user.get("sub_api_key") and clean_token not in user.get("active_sessions", []):
        raise HTTPException(
            status_code=403,
            detail="Security Lockout: Cross-contamination state mismatch blocked."
        )
        
    return user

# =====================================================================
# 📝 ROUTE 1: Update Textual Information (Name, Username, Mobile, & DOB)
# =====================================================================
@router.post("/update-info")
async def update_profile_info(payload: ProfileUpdateRequest, request: Request):
    user = await get_live_authenticated_user(request)
    update_payload = {}
    
    old_username = user.get("username", "").strip() if user.get("username") else ""
    
    # Anti-Leak Shield: Drop processing if active session account details return blank properties
    if not old_username or old_username in ["", "null", "undefined"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Action Intercepted: Current user identification footprint is corrupted or empty."
        )

    new_username = None

    # 1. Evaluate legal identity mapping (Full Name)
    if payload.name and payload.name.strip():
        update_payload["name"] = payload.name.strip()

    # 2. Strict unique checkpoint for username modifications
    if payload.username and payload.username.strip() != old_username:
        new_username = payload.username.strip()
        
        # Anti-Leak Shield: Block loose string injections during rename query evaluations
        if new_username in ["", "null", "undefined", "None"]:
            raise HTTPException(status_code=400, detail="Target username conversion format is invalid.")
            
        duplicate_check = await db_users.find_one({"username": new_username})
        if duplicate_check:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail="Identity Conflict: This username has already been registered by another node matrix."
            )
        update_payload["username"] = new_username

    # 3. Handle mobile routing loops
    if payload.mobile and payload.mobile.strip():
        update_payload["mobile"] = payload.mobile.strip()

    # 4. Handle Age-Gate Verification Token (DOB)
    if payload.dob and payload.dob.strip():
        update_payload["dob"] = payload.dob.strip()

    # 🚨 STRICT REJECTION: Throw 400 Bad Request if update package remains empty
    if not update_payload:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="No parameters modified. System state configuration remains unchanged."
        )

    # 🔥 CASCADE DATA TRANSFER OPERATION (Strictly Isolated Queries Context)
    if new_username:
        try:
            # Shield execution: Never process data cascades if boundaries aren't distinct non-empty values
            await db_files.update_many(
                {"owner": old_username},
                {"$set": {"owner": new_username}}
            )
            logger.info(f"🔄 Cascaded file ownership transfer from {old_username} to {new_username}")
        except Exception as file_err:
            logger.error(f"❌ Failed mapping cascade file ownership: {str(file_err)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
                detail="Internal ownership migration crashed during database loop."
            )

    # Commit payload configuration changes strictly to the active user unique matching instance row
    await db_users.update_one({"_id": user["_id"]}, {"$set": update_payload})
    return {"success": True, "message": "Profile parameters customized successfully."}

# =====================================================================
# 🖼️ ROUTE 2: Upload Dynamic Profile Picture (Avatar)
# =====================================================================
@router.post("/update-avatar")
async def update_profile_avatar(request: Request, file: UploadFile = File(...)):
    user = await get_live_authenticated_user(request)
    
    clean_username = user.get("username", "").strip() if user.get("username") else ""
    if not clean_username or clean_username in ["", "null", "undefined"]:
        raise HTTPException(status_code=400, detail="Unable to map avatar upload context. Account state dead.")

    # Validate file extension criteria
    allowed_extensions = ["jpg", "jpeg", "png", "webp"]
    if not file.filename or "." not in file.filename:
        raise HTTPException(status_code=400, detail="Invalid filename parameters provided.")
        
    file_ext = file.filename.split(".")[-1].lower()
    if file_ext not in allowed_extensions:
        raise HTTPException(
            status_code=400, 
            detail="Invalid extension vector. Only JPG, PNG, and WEBP formats are supported."
        )

    STORAGE_DIR = "static/avatars"
    os.makedirs(STORAGE_DIR, exist_ok=True)

    # Naming the profile file uniquely behind the strictly isolated username variable
    secure_filename = f"avatar_{clean_username}.{file_ext}"
    target_destination = os.path.join(STORAGE_DIR, secure_filename)

    try:
        with open(target_destination, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as io_err:
        logger.error(f"❌ Storage write failure for avatar: {str(io_err)}")
        raise HTTPException(status_code=500, detail="Failed to save structural avatar node to storage disk.")

    static_avatar_url = f"https://shadowapiweb.onrender.com/static/avatars/{secure_filename}"
    
    # Atomic execution locked directly on the specific item ID pointer mapping
    await db_users.update_one({"_id": user["_id"]}, {"$set": {"avatar_url": static_avatar_url}})
    return {"success": True, "avatar_url": static_avatar_url}

# =====================================================================
# 🚨 ROUTE 3: CASCADING ATOMIC PURGE (PERMANENT ACCOUNT & DATA DELETION)
# =====================================================================
@router.delete("/purge-account")
async def purge_account_permanently(request: Request):
    """ Wipes the user data node and cleans out all registered files mapped to them. """
    user = await get_live_authenticated_user(request)
    username = user.get("username", "").strip() if user.get("username") else ""
    
    # 🚨 ULTRA SECURE MAPPING GUARD: Stop execution if account parsing references are blank strings
    if not username or username in ["", "null", "undefined", "tester"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Purge Command Intercepted: System default or corrupted user states cannot be dynamically nuked."
        )
        
    try:
        # Step 1: Real-time cascading purge - drop asset records from db_files belonging strictly to this user
        files_purge = await db_files.delete_many({"owner": username})
        
        # Step 2: Nuke the explicit profile row inside db_users database strictly matching the atomic primary key
        await db_users.delete_one({"_id": user["_id"]})
        
        logger.info(f"💥 Cascade wipe complete for user node: {username}")
        return {
            "success": True,
            "message": "Your entire environment matrix profile and database logs have been purged permanently.",
            "purged_assets_count": files_purge.deleted_count
        }
    except Exception as e:
        logger.error(f"❌ Core Purge Engine Intercepted Failure: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=f"Purge sequence crashed at kernel layer: {str(e)}"
        )
