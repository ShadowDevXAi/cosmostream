# app/api/converter.py

import os
import re
import uuid
import json
import asyncio
import base64
import logging
import urllib.request  # Native standard library to guarantee Python 3.14 stability
import urllib.parse
from datetime import datetime, date
from fastapi import APIRouter, HTTPException, status, Request
from pydantic import BaseModel
import yt_dlp
from app.core.database import db_users, db_files  # Points to your Motor/MongoDB instances

logger = logging.getLogger("cosmos_logger")
router = APIRouter(prefix="/converter", tags=["Cosmos Stream Ingestion Engine"])

class URLConversionRequest(BaseModel):
    url: str

# 🧠 ADULT/RESTRICTED CONTENT DOMAIN SPECTRUM
ADULT_DOMAINS = [
    "pornhub.com", "xvideos.com", "xnxx.com", "xhamster.com", 
    "redtube.com", "youporn.com", "onlyfans.com", "chaturbate.com",
    "brazzers.com", "naughtyamerica.com", "xhamster2.com"
]

# 📊 HARD-CODED SUBSCRIPTION DOWNLOAD QUOTA MATRIX
PLAN_DOWNLOAD_LIMITS = {
    "free": 5,          # Pulsar Free Plan
    "test": 15,         # Spark Plan
    "weekly": 50,       # Orbit Weekly Plan
    "monthly": 250,     # Nebula Monthly Plan
    "twomonths": 600,   # Galaxy Plan
    "fourmonths": 1500,  # Quasar Plan
    "sixmonths": 4000,   # Supernova Premium
    "yearly": 99999     # Infinity Plan (Effectively Unlimited)
}

# =====================================================================
# 🛠️ UTILITY CORE HELPERS
# =====================================================================

def is_adult_content(url: str) -> bool:
    clean_url = url.lower().strip()
    return any(domain in clean_url for domain in ADULT_DOMAINS)

def calculate_exact_age(dob_string: str) -> int:
    if not dob_string:
        return 0
    try:
        birth_date = datetime.strptime(dob_string.strip(), "%Y-%m-%d").date()
        today = date.today()
        return today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))
    except Exception:
        return 0

def sanitize_filename(title: str) -> str:
    clean = re.sub(r'[\\/*?:"<>|]', "", title)
    return clean.strip().replace(" ", "_")[:40]

def extract_youtube_video_id(url: str) -> str:
    """Helper macro to parse video ID or Shorts ID from any inbound YouTube link structure"""
    pattern = r'(?:v=|\/shorts\/|\/embed\/|\/v\/|youtu\.be\/)([a-zA-Z0-9_-]{11})'
    match = re.search(pattern, url)
    return match.group(1) if match else None

# =====================================================================
# 🔒 ULTRA-SECURE CONTEXT INTERCEPTOR (NO MORE TESTER LEAKS)
# =====================================================================
async def get_authenticated_user(request: Request):
    """
    🔒 CENTRALIZED SECURE ACCOUNT ROUTER
    Intercepts empty, null, or missing telemetry strings before MongoDB lookup 
    to permanently block accidental data leakage onto the 'tester' profile node.
    """
    client_api_key = request.headers.get("X-Cosmos-API-Key") or request.headers.get("X-API-Key")
    client_api_secret = request.headers.get("X-Cosmos-API-Secret")
    auth_header = request.headers.get("Authorization")
    
    token = None
    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header.replace("Bearer ", "").strip()
        
    clean_key = client_api_key.strip() if client_api_key else None
    clean_secret = client_api_secret.strip() if client_api_secret else None
    clean_token = token.strip() if token else None
    
    if not clean_key and not clean_token:
        raise HTTPException(
            status_code=401, 
            detail="Authentication footprint missing. Access context rejected."
        )
        
    if clean_key in ["", "null", "undefined", "None"] and clean_token in ["", "null", "undefined", "None"]:
        raise HTTPException(
            status_code=401, 
            detail="Invalid credential configurations evaluated. Request cancelled."
        )
        
    user = None
    if clean_key:
        query_selector = {"sub_api_key": clean_key}
        if clean_secret:
            query_selector["sub_api_secret"] = clean_secret
        user = await db_users.find_one(query_selector)
        
    elif clean_token:
        user = await db_users.find_one({"active_sessions": clean_token})
        
    if not user:
        raise HTTPException(
            status_code=401, 
            detail="Active session expired or invalid credentials configuration."
        )
        
    if user.get("username") == "tester" and clean_key != user.get("sub_api_key"):
        raise HTTPException(
            status_code=403,
            detail="Security Lockout: Cross-account data conversion leak vector blocked."
        )
        
    return user

# =====================================================================
# 🌐 PHASE 3: DECENTRALIZED INVIDIOUS ENGINE (THE UNSTOPPABLE BACKUP)
# =====================================================================
def download_via_invidious_matrix(video_id: str, unique_id: str, storage_dir: str) -> dict:
    """Fallback Engine that targets open scraping proxies to pull direct streams cleanly"""
    logger.info(f"🔮 Phase 3 Decentralized Invidious Engine triggered for Video ID: {video_id}")
    
    invidious_instances = [
        "https://yewtu.be",
        "https://invidious.nerdvpn.de",
        "https://iv.melmac.space",
        "https://invidious.perennialte.ch"
    ]
    
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
    
    for instance in invidious_instances:
        try:
            api_url = f"{instance}/api/v1/videos/{video_id}"
            req = urllib.request.Request(api_url, headers=headers)
            with urllib.request.urlopen(req, timeout=15) as response:
                if response.status == 200:
                    data = json.loads(response.read().decode("utf-8"))
                    
                    streams = data.get("formatStreams", [])
                    if not streams:
                        continue
                        
                    direct_stream_url = streams[-1].get("url")
                    if direct_stream_url:
                        clean_title = sanitize_filename(data.get("title", "Cosmos_Asset"))
                        compiled_filename = f"vault_{unique_id}_{clean_title}.mp4"
                        final_filepath = os.path.join(storage_dir, compiled_filename)
                        
                        download_req = urllib.request.Request(direct_stream_url, headers=headers)
                        with urllib.request.urlopen(download_req, timeout=60) as down_stream:
                            if down_stream.status == 200:
                                with open(final_filepath, "wb") as file_buffer:
                                    while True:
                                        chunk = down_stream.read(1024 * 64)
                                        if not chunk: break
                                        file_buffer.write(chunk)
                                        
                        if os.path.exists(final_filepath) and os.path.getsize(final_filepath) > 0:
                            file_size_mb = round(os.path.getsize(final_filepath) / (1024 * 1024), 2)
                            return {"success": True, "file_name": compiled_filename, "file_size_mb": file_size_mb}
        except Exception as e:
            logger.warning(f"⚠️ Invidious Node {instance} bypassed: {str(e)}")
            continue
            
    return {"success": False, "error": "All resilient open-source decentralized layers declared failure state."}

# =====================================================================
# 🌐 PHASE 2: GLOBAL COBALT CLUSTER (UPDATED REFRACTORED HEADERS)
# =====================================================================
def sync_fallback_global_extractor(video_url: str, unique_id: str, storage_dir: str) -> dict:
    logger.info(f"🔄 Phase 2 Gateway triggered via Standard Core for URL: {video_url}")
    
    fallback_endpoints = [
        "https://api.cobalt.tools/api/json",
        "https://cobalt.xyz/api/json",
        "https://cobalt.soundgasm.net/api/json"
    ]
    
    headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Origin": "https://cobalt.tools",
        "Referer": "https://cobalt.tools/"
    }
    
    payload = {"url": video_url}
    json_data = json.dumps(payload).encode("utf-8")
    
    for api_url in fallback_endpoints:
        try:
            req = urllib.request.Request(api_url, data=json_data, headers=headers, method="POST")
            with urllib.request.urlopen(req, timeout=20) as response:
                if response.status == 200:
                    resp_payload = json.loads(response.read().decode("utf-8"))
                    direct_stream_url = resp_payload.get("url") or resp_payload.get("picker", [{}])[0].get("url")
                    
                    if direct_stream_url:
                        clean_title = sanitize_filename(resp_payload.get("filename", "Universal_Asset"))
                        compiled_filename = f"vault_{unique_id}_{clean_title}.mp4"
                        final_filepath = os.path.join(storage_dir, compiled_filename)
                        
                        download_req = urllib.request.Request(direct_stream_url, headers={"User-Agent": headers["User-Agent"]})
                        with urllib.request.urlopen(download_req, timeout=60) as download_stream:
                            if download_stream.status == 200:
                                with open(final_filepath, "wb") as file_buffer:
                                    while True:
                                        chunk = download_stream.read(1024 * 64)
                                        if not chunk: break
                                        file_buffer.write(chunk)
                                        
                        if os.path.exists(final_filepath) and os.path.getsize(final_filepath) > 0:
                            file_size_mb = round(os.path.getsize(final_filepath) / (1024 * 1024), 2)
                            return {"success": True, "file_name": compiled_filename, "file_size_mb": file_size_mb}
        except Exception as e:
            logger.warning(f"⚠️ Failover node {api_url} missed target mapping: {str(e)}")
            continue
            
    return {"success": False, "error": "Cobalt arrays returned exhausted telemetry frames."}

# =====================================================================
# ⚡ PHASE 1 LOGIC: SYSTEM LOCAL YT-DLP CORE CONTEXT (ANTI-BOT ARMORED)
# =====================================================================
def sync_yt_dlp_downloader(video_url: str, unique_id: str, storage_dir: str) -> dict:
    output_template = os.path.join(storage_dir, f"pending_{unique_id}_%(title)s.%(ext)s")
    runtime_cookie_file = None

    ydl_opts = {
        'format': 'best',
        'outtmpl': output_template,
        'quiet': True,
        'no_warnings': True,
        'ignoreerrors': False,
        'nocheckcertificate': True,
        'geo_bypass': True,
        'http_headers': {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
        },
        # 🔥 PURE MOBILE/TV CLIENT SHIFTING BYPASS
        # Obsolete OAuth keys deleted. Strictly enforces native app vectors to shred firewalls.
        'extractor_args': {
            'youtube': { 
                'player_client': ['android', 'ios', 'tvhtml5', 'mweb'] 
            }
        }
    }

    # Netscape string decoding layer remains intact as a structural backup pipeline
    raw_cookies_string = os.getenv("YT_COOKIES")
    if raw_cookies_string:
        clean_token = raw_cookies_string.strip().strip("'\"")
        runtime_cookie_file = os.path.join(storage_dir, f"cookies_vault_{unique_id}.txt")
        clean_cookies = ""
        
        if not clean_token.startswith("# Netscape"):
            try:
                missing_padding = len(clean_token) % 4
                if missing_padding: clean_token += '=' * (4 - missing_padding)
                clean_cookies = base64.b64decode(clean_token).decode("utf-8")
            except Exception: pass
        
        if not clean_cookies or not clean_cookies.startswith("# Netscape"):
            clean_cookies = raw_cookies_string.replace("\\n", "\n")

        if clean_cookies.startswith("# Netscape"):
            with open(runtime_cookie_file, "w", encoding="utf-8") as file_buffer:
                file_buffer.write(clean_cookies.strip())
            ydl_opts['cookiefile'] = runtime_cookie_file

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(video_url, download=True)
            raw_title = info.get("title", "Cosmos_Media_Asset")
            clean_title = sanitize_filename(raw_title)
            detected_ext = info.get("ext", "mp4")
            
            compiled_filename = f"vault_{unique_id}_{clean_title}.{detected_ext}"
            final_filepath = os.path.join(storage_dir, compiled_filename)
            
            for transient_file in os.listdir(storage_dir):
                if transient_file.startswith(f"pending_{unique_id}_"):
                    os.rename(os.path.join(storage_dir, transient_file), final_filepath)
                    break

            if os.path.exists(final_filepath):
                file_size_mb = round(os.path.getsize(final_filepath) / (1024 * 1024), 2)
                return {"success": True, "file_name": compiled_filename, "file_size_mb": file_size_mb}
            raise FileNotFoundError("Local file dropped.")
    except Exception as yt_err:
        return {"success": False, "error": str(yt_err)}
    finally:
        if runtime_cookie_file and os.path.exists(runtime_cookie_file):
            try: os.remove(runtime_cookie_file)
            except Exception: pass

# =====================================================================
# 🎛️ GLOBAL INBOUND CONTROLLER ROUTE
# =====================================================================
@router.post("/process-link")
async def process_social_link(payload: URLConversionRequest, request: Request):
    user = await get_authenticated_user(request)
    username = user.get("username")
    
    user_tier = user.get("plan_interval", "free")
    downloads_cap = PLAN_DOWNLOAD_LIMITS.get(user_tier, 5)
    current_downloads = user.get("downloads_used", 0)

    if current_downloads >= downloads_cap:
        raise HTTPException(
            status_code=400,
            detail=f"Download limits exhausted for your tier ({current_downloads}/{downloads_cap}). Upgrade your orbit plan now!"
        )

    if is_adult_content(payload.url):
        user_dob = user.get("dob")
        if not user_dob or calculate_exact_age(user_dob) < 18:
            raise HTTPException(
                status_code=403,
                detail="Access Denied: Content from this platform is restricted to users aged 18 and older."
            )

    storage_limit = user.get("upload_limit_mb", 500)
    storage_used = user.get("storage_used_mb", 0)
    if storage_used >= storage_limit:
        raise HTTPException(
            status_code=400,
            detail="Bhai, aapka cloud storage vault full ho chuka hai! Please upgrade your orbit tier to extend capacity."
        )

    asset_id = str(uuid.uuid4())[:12]
    STORAGE_DIR = "static/downloads"

    # ⚡ PHASE 1: Primary Local Download Try (Hardened against YouTube bot filter firewall blockades)
    download_job = await asyncio.to_thread(sync_yt_dlp_downloader, payload.url, asset_id, STORAGE_DIR)
    
    # ⚡ PHASE 2: Cobalt Cluster Failover Switch
    if not download_job["success"]:
        logger.warning(f"⚠️ Primary engine blocked by target host firewall. Initiating Phase 2 Native Failover Cluster...")
        download_job = await asyncio.to_thread(sync_fallback_global_extractor, payload.url, asset_id, STORAGE_DIR)
        
    # ⚡ PHASE 3: Decentralized Invidious Scraper Switch
    if not download_job["success"]:
        video_id = extract_youtube_video_id(payload.url)
        if video_id:
            logger.warning(f"⚠️ Phase 2 Cluster exhausted. Initiating Layer 3 Invidious Matrix Channel...")
            download_job = await asyncio.to_thread(download_via_invidious_matrix, video_id, asset_id, STORAGE_DIR)
        
    if not download_job["success"]:
        raise HTTPException(
            status_code=422,
            detail=f"Cosmos ingestion engine dropped stream loops across all redundant nodes. Reason: {download_job.get('error', 'Firewall Blockades Everywhere')}"
        )

    file_size_mb = download_job["file_size_mb"]

    if (storage_used + file_size_mb) > storage_limit:
        file_cleanup_path = os.path.join(STORAGE_DIR, download_job["file_name"])
        if os.path.exists(file_cleanup_path):
            os.remove(file_cleanup_path)
        raise HTTPException(
            status_code=400,
            detail="This specific video asset file size dimensions exceed your remaining cloud storage quota limit allocations."
        )

    cloud_access_url = f"https://shadowapiweb.onrender.com/static/downloads/{download_job['file_name']}"
    
    new_asset_document = {
        "_id": asset_id, 
        "file_name": download_job["file_name"],
        "size": file_size_mb,
        "mime": "video/mp4", 
        "download_count": 0,
        "owner": username,
        "source_url": payload.url,
        "cloud_storage_url": cloud_access_url,
        "created_at": datetime.now().isoformat()  # Clean modern uniform time string formatting
    }
    
    await db_files.insert_one(new_asset_document)
    await db_users.update_one(
        {"_id": user["_id"]},
        {"$inc": {"storage_used_mb": file_size_mb, "downloads_used": 1}}
    )

    return {
        "success": True,
        "message": "Asset completely extracted and mirrored to cloud sync storage clusters.",
        "remaining_downloads": downloads_cap - (current_downloads + 1),
        "asset": {
            "asset_id": asset_id,
            "file_name": new_asset_document["file_name"],
            "file_size_mb": file_size_mb,
            "owner": username,
            "cloud_url": cloud_access_url
        }
    }
