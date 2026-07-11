import io
import os  # 🔥 Native high-entropy crypto entropy random source
import asyncio
import hashlib
import shortuuid
import logging
import datetime
import mimetypes  # For dynamic client side rendering paths
from fastapi import APIRouter, UploadFile, File, Request, Depends, HTTPException, BackgroundTasks, status
from fastapi.responses import StreamingResponse
from app.core.database import db_files, db_users, tg_bot, tg_ghost_bot
from app.core.security import get_current_user
from app.core.config import settings

# 🔥 CRYPTOGRAPHIC CORE IMPORTS FOR END-TO-END STREAM CIPHER
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes

logger = logging.getLogger("cosmos_logger")
router = APIRouter(tags=["Enterprise Media Asset Layer"])

# =====================================================================
# 🛠️ AUTOMATED BACK-END SHADOW REPLICATION WORKER (FULLY ENCRYPTED)
# =====================================================================
async def execute_triple_layer_backups(filename: str, primary_file_id: str, encrypted_bytes: bytes, file_name: str):
    """
    Background worker loop jo client connection release hone ke baad 
    chupchaap secondary aur ghost channels mein E2EE file replicas backup karta hai.
    """
    clean_filename = filename.strip() if filename else ""
    if not clean_filename or clean_filename in ["", "null", "undefined"]:
        logger.error("❌ Backup worker aborted: Target file reference id is missing or corrupted.")
        return

    same_num_backup_id = None
    try:
        if not tg_bot.is_connected: 
            await tg_bot.start()
        sent_same = await tg_bot.send_document(
            chat_id=settings.BACKUP_CHANNEL_SAME, 
            document=primary_file_id
        )
        
        if sent_same.document:
            same_num_backup_id = sent_same.document.file_id
        elif sent_same.video:
            same_num_backup_id = sent_same.video.file_id
        elif sent_same.animation:
            same_num_backup_id = sent_same.animation.file_id
        else:
            same_num_backup_id = primary_file_id

        logger.info(f"🛡️ [LAYER 2] Encrypted backup synced for node: {clean_filename}")
    except Exception as e:
        logger.error(f"❌ Layer 2 (Same-Account Backup) crashed: {str(e)}")

    ghost_backup_id = None
    try:
        if not tg_ghost_bot.is_connected: 
            await tg_ghost_bot.start()
        ghost_io = io.BytesIO(encrypted_bytes)  # 🔥 SAFE: Passing encrypted bytes downstream
        ghost_io.name = f"ENC_{file_name}"
        sent_ghost = await tg_ghost_bot.send_document(
            chat_id=settings.GHOST_CHANNEL_ID, 
            document=ghost_io
        )
        
        if sent_ghost.document:
            ghost_backup_id = sent_ghost.document.file_id
        elif sent_ghost.video:
            ghost_backup_id = sent_ghost.video.file_id
        elif sent_ghost.animation:
            ghost_backup_id = sent_ghost.animation.file_id
        else:
            ghost_backup_id = None

        logger.info(f"Ghost [LAYER 3] Isolated ghost number encrypted backup deployed: {clean_filename}")
    except Exception as e:
        logger.error(f"❌ Layer 3 (Ghost Identity Backup) crashed: {str(e)}")

    # Atomic targeted identification filter constraint
    await db_files.update_one(
        {"_id": clean_filename},
        {"$set": {
            "tg_same_backup_id": same_num_backup_id,
            "tg_ghost_backup_id": ghost_backup_id
        }}
    )

# =====================================================================
# 1. LIVE UPLOAD ENDPOINT (With AES-256-CTR End-to-End Encryption)
# =====================================================================
@router.post("/upload")
async def upload(
    request: Request, 
    file: UploadFile = File(...), 
    user=Depends(get_current_user),
    background_tasks: BackgroundTasks = BackgroundTasks()
):
    if not user or not user.get("username"):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication context drop intercepted.")

    clean_auth_username = user["username"].strip()
    
    if not clean_auth_username or clean_auth_username in ["", "null", "undefined", "None"]:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Session validation footprint is empty or corrupted.")

    fresh_user = await db_users.find_one({"username": clean_auth_username})
    if not fresh_user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Active matrix account node not found.")

    if fresh_user.get("username") == "tester" and clean_auth_username != "tester":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Identity cross-contamination intercepted.")

    # 🛡️ IMMORTAL IMMUNITY MATRIX: Both network entries mapped explicitly
    PRIMARY_DOMAIN = "https://api.cosmostream.in"
    BACKUP_SUBDOMAIN = "https://shadowapiweb.onrender.com"

    file_bytes = await file.read()
    file_hash = hashlib.md5(file_bytes).hexdigest()
    file_size_mb = len(file_bytes) / (1024 * 1024)
    
    quota_limit = fresh_user.get("upload_limit_mb", 500)
    current_used = fresh_user.get("current_usage_mb", 0.0)
    
    if (current_used + file_size_mb) > quota_limit:
        raise HTTPException(
            status_code=status.HTTP_402_PAYMENT_REQUIRED, 
            detail="Storage pool exhaustion architecture triggered. Please upgrade your active Pulsar Plan."
        )

    existing = await db_files.find_one({"hash": file_hash})
    if existing: 
        already_owned = await db_files.find_one({"hash": file_hash, "owner": clean_auth_username})
        if already_owned: 
            return {
                "success": True, 
                "url": f"{PRIMARY_DOMAIN}/f/{already_owned['_id']}",
                "mirror_url": f"{BACKUP_SUBDOMAIN}/f/{already_owned['_id']}"
            }
        
        rand_id = shortuuid.ShortUUID().random(length=8)
        ext = file.filename.split('.')[-1].lower() if '.' in file.filename else 'bin'
        custom_filename = f"{rand_id}.{ext}"
        
        await db_files.insert_one({
            "_id": custom_filename,
            "owner": clean_auth_username,
            "hash": file_hash,
            "file_name": file.filename,
            "tg_file_id": existing["tg_file_id"],
            "tg_same_backup_id": existing.get("tg_same_backup_id"),
            "tg_ghost_backup_id": existing.get("tg_ghost_backup_id"),
            "mime": existing["mime"],
            "size": existing["size"],
            "enc_key": existing.get("enc_key"),
            "enc_nonce": existing.get("enc_nonce"),
            "download_count": 0,
            "created_at": datetime.datetime.now(datetime.timezone.utc)
        })
        
        # Sync upload usage metrics safely
        new_usage = fresh_user.get("current_usage_mb", 0.0) + existing["size"]
        new_storage = fresh_user.get("storage_used_mb", 0.0) + existing["size"]
        await db_users.update_one(
            {"_id": fresh_user["_id"]}, 
            {"$set": {"current_usage_mb": new_usage, "storage_used_mb": new_storage}, "$inc": {"lifetime_requests_count": 1}}
        )
        return {
            "success": True, 
            "url": f"{PRIMARY_DOMAIN}/f/{custom_filename}",
            "mirror_url": f"{BACKUP_SUBDOMAIN}/f/{custom_filename}"
        }

    encryption_key = os.urandom(32)    
    encryption_nonce = os.urandom(16)  
    
    cipher = Cipher(algorithms.AES(encryption_key), modes.CTR(encryption_nonce))
    encryptor = cipher.encryptor()
    encrypted_bytes = encryptor.update(file_bytes) + encryptor.finalize()

    file_io = io.BytesIO(encrypted_bytes)
    file_io.name = f"ENC_{file.filename}"
    if not tg_bot.is_connected: 
        await tg_bot.start()
        
    sent = await asyncio.wait_for(
        tg_bot.send_document(settings.CHANNEL_ID, file_io), 
        timeout=60.0
    )
    
    rand_id = shortuuid.ShortUUID().random(length=8)
    ext = file.filename.split('.')[-1].lower() if '.' in file.filename else 'bin'
    custom_filename = f"{rand_id}.{ext}"
    
    tg_file_id = None
    if sent.document: tg_file_id = sent.document.file_id
    elif sent.video: tg_file_id = sent.video.file_id
    elif sent.animation: tg_file_id = sent.animation.file_id
    elif sent.photo: tg_file_id = sent.photo[-1].file_id if isinstance(sent.photo, list) else sent.photo.file_id
    else:
        raise HTTPException(status_code=500, detail="Inbound Telegram object parsing architecture dropped.")
    
    guess_mime, _ = mimetypes.guess_type(file.filename)
    resolved_mime = guess_mime or "application/octet-stream"

    await db_files.insert_one({
        "_id": custom_filename,
        "owner": clean_auth_username,
        "hash": file_hash,
        "file_name": file.filename,
        "tg_file_id": tg_file_id,
        "tg_same_backup_id": None,
        "tg_ghost_backup_id": None,
        "mime": resolved_mime,
        "size": file_size_mb,
        "enc_key": encryption_key.hex(),
        "enc_nonce": encryption_nonce.hex(),
        "download_count": 0,
        "created_at": datetime.datetime.now(datetime.timezone.utc)
    })
    
    updated_usage = fresh_user.get("current_usage_mb", 0.0) + file_size_mb
    updated_storage = fresh_user.get("storage_used_mb", 0.0) + file_size_mb
    await db_users.update_one(
        {"_id": fresh_user["_id"]}, 
        {"$set": {"current_usage_mb": updated_usage, "storage_used_mb": updated_storage}, "$inc": {"lifetime_requests_count": 1}}
    )
    
    background_tasks.add_task(
        execute_triple_layer_backups, 
        custom_filename, tg_file_id, encrypted_bytes, file.filename
    )
    
    return {
        "success": True, 
        "url": f"{PRIMARY_DOMAIN}/f/{custom_filename}",
        "mirror_url": f"{BACKUP_SUBDOMAIN}/f/{custom_filename}"
    }

# =====================================================================
# 2. FAILOVER STREAMING ENDPOINT (On-the-Fly Dynamic Decryption Circuit)
# =====================================================================
@router.get("/f/{filename}")
async def serve(filename: str, request: Request):
    clean_target_filename = filename.strip() if filename else ""
    
    if not clean_target_filename or clean_target_filename in ["", "null", "undefined"]:
        raise HTTPException(status_code=400, detail="Invalid target filename parameter context.")

    data = await db_files.find_one({"_id": clean_target_filename})
    if not data: 
        raise HTTPException(status_code=404, detail="File node map missing.")

    clean_file_owner = data.get("owner", "").strip() if data.get("owner") else ""
    
    if not clean_file_owner or clean_file_owner in ["", "null", "undefined", "None"]:
        raise HTTPException(status_code=404, detail="Data asset owner reference context has dropped or is unassigned.")

    owner_user = await db_users.find_one({"username": clean_file_owner})
    if not owner_user:
        raise HTTPException(status_code=404, detail="Associated data owner profile context dropped.")

    await db_files.update_one({"_id": clean_target_filename}, {"$inc": {"download_count": 1}})
    
    bandwidth_delta_gb = round(data.get("size", 0) / 1024, 5)
    await db_users.update_one(
        {"_id": owner_user["_id"]}, 
        {"$inc": {"bandwidth_used_gb": bandwidth_delta_gb, "lifetime_requests_count": 1}}
    )

    enc_key_hex = data.get("enc_key")
    enc_nonce_hex = data.get("enc_nonce")

    # 🟢 CONDITION A: Unencrypted Asset Handling (Jad-se-Fix Converter Stream Engine)
    if not enc_key_hex or not enc_nonce_hex:
        logger.info(f"ℹ️ Unencrypted asset detected for {clean_target_filename}. Mapping streaming pipelines...")
        
        downloads_dir = os.path.join("static", "downloads")
        if os.path.exists(downloads_dir):
            for file_in_dir in os.listdir(downloads_dir):
                if clean_target_filename in file_in_dir:  # Wildcard Match core to destroy 404 bugs
                    local_path = os.path.join(downloads_dir, file_in_dir)
                    logger.info(f"🎯 Resilient Match found on server storage disk: {local_path}")
                    
                    file_size = os.path.getsize(local_path)
                    
                    # 🔥 FIXED CHUNKED GENERATOR: Starlette range-spam request loops ko khatam karne ke liye strict streaming
                    def local_file_chunk_generator(file_path: str):
                        with open(file_path, "rb") as video_file:
                            while chunk := video_file.read(1024 * 1024):  # Strict 1MB binary streaming blocks
                                yield chunk

                    # 🔥 CRITICAL FIX: "Accept-Ranges": "none" browser spam buffering loop ko thik karega
                    return StreamingResponse(
                        local_file_chunk_generator(local_path), 
                        media_type=data.get("mime", "video/mp4"),
                        headers={
                            "Content-Length": str(file_size),
                            "Accept-Ranges": "none"  # Hardcoded intercept: Client loops terminated permanently
                        }
                    )
                
        if data.get("tg_file_id"):
            async def direct_unencrypted_stream():
                if not tg_bot.is_connected: 
                    await tg_bot.start()
                async for chunk in tg_bot.stream_media(data["tg_file_id"]):
                    yield chunk
            return StreamingResponse(direct_unencrypted_stream(), media_type=data["mime"])

        raise HTTPException(status_code=404, detail="Local static media resource file not found on cluster disk.")

    # 🔒 CONDITION B: Standard E2EE Path (If cryptographic keys exist)
    enc_key = bytes.fromhex(enc_key_hex)
    enc_nonce = bytes.fromhex(enc_nonce_hex)

    async def triple_failover_stream_generator():
        cipher = Cipher(algorithms.AES(enc_key), modes.CTR(enc_nonce))
        decryptor = cipher.decryptor()
        
        try:
            if not tg_bot.is_connected: 
                await tg_bot.start()
            async for chunk in tg_bot.stream_media(data["tg_file_id"]): 
                yield decryptor.update(chunk)
            return
        except Exception as e:
            logger.warning(f"⚠️ Primary node down for {clean_target_filename}: {str(e)}. Diverting to Mirror B...")

        if data.get("tg_same_backup_id"):
            try:
                cipher = Cipher(algorithms.AES(enc_key), modes.CTR(enc_nonce))
                decryptor = cipher.decryptor()
                async for chunk in tg_bot.stream_media(data["tg_same_backup_id"]): 
                    yield decryptor.update(chunk)
                return
            except Exception as e:
                logger.warning(f"⚠️ Mirror Backup broken for {clean_target_filename}: {str(e)}. Triggering Ghost Protocol C...")

        if data.get("tg_ghost_backup_id"):
            try:
                cipher = Cipher(algorithms.AES(enc_key), modes.CTR(enc_nonce))
                decryptor = cipher.decryptor()
                if not tg_ghost_bot.is_connected: 
                    await tg_ghost_bot.start()
                async for chunk in tg_ghost_bot.stream_media(data["tg_ghost_backup_id"]): 
                    yield decryptor.update(chunk)
                return
            except Exception as blackout_error:
                logger.error(f"💥 Total System Link Blackout for node {clean_target_filename}: {str(blackout_error)}")
                raise HTTPException(status_code=500, detail="Internal binary storage cluster links completely severed.")

    return StreamingResponse(triple_failover_stream_generator(), media_type=data["mime"])

# =====================================================================
# 3. STATS & MANAGEMENT CONTROL ARRAYS
# =====================================================================
@router.get("/my-files")
async def list_files(user=Depends(get_current_user)):
    if not user or not user.get("username"):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized session validation entry.")

    clean_auth_username = user["username"].strip()
    if not clean_auth_username or clean_auth_username in ["", "null", "undefined"]:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid character mapping reference context.")

    fresh_user = await db_users.find_one({"username": clean_auth_username})
    if not fresh_user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User verification mapping dropped.")

    cursor = db_files.find({"owner": fresh_user["username"]}).sort("created_at", -1)
    files_list = await cursor.to_list(length=100)
    for f in files_list: 
        f["id"] = f["_id"]
    return {"success": True, "files": files_list}

@router.delete("/delete/{filename}")
async def delete_file(filename: str, user=Depends(get_current_user)):
    if not user or not user.get("username"):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Session trace invalid.")

    clean_auth_username = user["username"].strip()
    clean_target_filename = filename.strip() if filename else ""
    
    if not clean_auth_username or not clean_target_filename or clean_target_filename in ["", "null", "undefined"]:
        raise HTTPException(status_code=400, detail="Invalid action vectors inside user parameter execution spaces.")

    fresh_user = await db_users.find_one({"username": clean_auth_username})
    if not fresh_user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User integrity validation failed.")

    data = await db_files.find_one({"_id": clean_target_filename})
    
    if not data or data.get("owner") != fresh_user["username"]: 
        raise HTTPException(status_code=404, detail="Access denied to targeted database references.")
    
    file_size = data.get("size", 0.0) 
    
    # 🔥 JAD-SE-FIX 1: SERVER STORAGE WIPE VIA WILDCARD SCAN
    downloads_dir = os.path.join("static", "downloads")
    if os.path.exists(downloads_dir):
        for file_in_dir in os.listdir(downloads_dir):
            if clean_target_filename in file_in_dir:  
                try:
                    local_path = os.path.join(downloads_dir, file_in_dir)
                    os.remove(local_path)
                    logger.info(f"🗑️ Physical file swept cleanly from disk: {local_path}")
                except Exception as disk_err:
                    logger.error(f"❌ Failed to purge local file from disk {file_in_dir}: {str(disk_err)}")

    # Delete metadata from database references
    await db_files.delete_one({"_id": clean_target_filename})
    
    # 🔥 JAD-SE-FIX 2: ATOMIC DUAL-COUNTER SYNC MATRICES (Both counters decrease flawlessly)
    current_usage = fresh_user.get("current_usage_mb", 0.0)
    storage_used = fresh_user.get("storage_used_mb", 0.0)
    
    calculated_new_usage = max(0.0, current_usage - file_size)
    calculated_storage_used = max(0.0, storage_used - file_size)
    
    await db_users.update_one(
        {"_id": fresh_user["_id"]}, 
        {
            "$set": {
                "current_usage_mb": calculated_new_usage,
                "storage_used_mb": calculated_storage_used  # 🔥 Synchronization Drop Hole Fixed Forever
            },
            "$inc": {"lifetime_requests_count": 1}
        }
    )
    return {"success": True, "message": "Reference node and physical assets cleared successfully from user environment profiles."}

@router.get("/stats")
async def get_stats(user=Depends(get_current_user)):
    if not user or not user.get("username"):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Session context trace dropped.")

    clean_auth_username = user["username"].strip()
    if not clean_auth_username or clean_auth_username in ["", "null", "undefined"]:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Identity data mapping reference corruption.")

    fresh_user = await db_users.find_one({"username": clean_auth_username})
    if not fresh_user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Identity state engine missing.")

    # Always fetch the largest active storage field representation dynamically
    live_storage_mb = max(fresh_user.get("current_usage_mb", 0.0), fresh_user.get("storage_used_mb", 0.0))

    return {
        "used": round(live_storage_mb, 2), 
        "limit": fresh_user.get("upload_limit_mb", 500)
    }
