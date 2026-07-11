# main.py

import logging
import os  # Handles programmatic folder creation layout
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles  # Imported to mount media storage directory
from contextlib import asynccontextmanager

from app.core.config import settings
from app.core.database import tg_bot, tg_ghost_bot  # Synchronized failover pairs

# 🔥 FULLY ALIGNED ROUTER INGESTION SCHEMAS
from app.api import auth, files, user, profile, converter
from app.core import payments, mailer, security

logger = logging.getLogger("cosmos_logger")

@asynccontextmanager
async def lifespan_handler(app: FastAPI):
    logger.info("🚀 System Kernel: Bootstrapping asynchronous event loops...")
    
    # =====================================================================
    # 🟢 PRIMARY BOT STARTUP ENGINE
    # =====================================================================
    try:
        # Check dynamic connection flags via clean proxy interface attribute handling
        is_bot_online = False
        try:
            is_bot_online = getattr(tg_bot, "is_connected", False)
        except Exception:
            pass

        if not is_bot_online:
            logger.info("🔄 Launching Primary Bot client loop pipeline...")
            await tg_bot.start()
            logger.info("🟢 Primary Bot instance linked successfully and online.")
    except Exception as primary_err:
        logger.error(f"❌ [CRITICAL] Primary Bot startup sequence failure: {str(primary_err)}", exc_info=True)

    # =====================================================================
    # 🔴 GHOST FAILOVER BOT STARTUP ENGINE (Isolated Isolation Guard)
    # =====================================================================
    try:
        is_ghost_online = False
        try:
            is_ghost_online = getattr(tg_ghost_bot, "is_connected", False)
        except Exception:
            pass

        if not is_ghost_online:
            logger.info("🔄 Launching Ghost Backup Bot client loop pipeline...")
            await tg_ghost_bot.start()
            logger.info("🔴 Ghost Backup Bot instance activated successfully and online.")
    except Exception as ghost_err:
        logger.error(f"⚠️ [WARNING] Ghost failover layer dropped: {str(ghost_err)}. System running in non-redundant state.")

    logger.info("🤖 Master Core: Active token stream channels verification finalized.")
    
    yield  # FastAPI starts accepting inbound API calls safely right here
    
    # =====================================================================
    # 🛑 DEPLOYMENT DE-PROVISIONING GRACEFUL SHUTDOWN
    # =====================================================================
    logger.info("🛑 System Kernel: Destroying active thread channels gracefully...")
    
    try:
        is_bot_online = False
        try: is_bot_online = getattr(tg_bot, "is_connected", False)
        except Exception: pass
        
        if is_bot_online:
            await tg_bot.stop()
            logger.info("🔌 Primary network socket closed cleanly.")
    except Exception as stop_err:
        logger.error(f"Failed to cleanly disconnect primary telemetry link: {str(stop_err)}")

    try:
        is_ghost_online = False
        try: is_ghost_online = getattr(tg_ghost_bot, "is_connected", False)
        except Exception: pass
        
        if is_ghost_online:
            await tg_ghost_bot.stop()
            logger.info("🔌 Ghost proxy network socket closed cleanly.")
    except Exception as stop_ghost_err:
        logger.error(f"Failed to cleanly disconnect ghost proxy link: {str(stop_ghost_err)}")
        
    logger.info("🔌 Core Cluster environment event loop down transitions complete.")


# 🔥 ENTERPRISE FASTAPI CORE FRAMEWORK INSTANCE
app = FastAPI(
    title="Cosmos Media Cloud API",
    version="2.0.0",
    lifespan=lifespan_handler
)

# 🌐 CORS Middleware Routing Grid Configurations
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://cosmostream.in",               # 🔥 New Production Main Domain
        "https://www.cosmostream.in",           # 🔥 World-Wide-Web Target Variant
        "https://shadowapiwebfo.onrender.com",  # Production Lovable Frontend Node
        "http://localhost:5173",                # Local Vite/React Development Node
        "http://localhost:3000"                 # Fallback Alternate Node
    ], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 📁 Programmatic folder auto-generation checkpoint rules
os.makedirs("static", exist_ok=True)
os.makedirs("static/avatars", exist_ok=True)
os.makedirs("static/downloads", exist_ok=True)  # Safeguards yt-dlp binary dump tracks

# 🖼️ Mount static files directory to resolve media load logs cleanly
app.mount("/static", StaticFiles(directory="static"), name="static")

# 🌐 Mount Sub-Router Endpoint Matrices
app.include_router(auth.router)
app.include_router(files.router)
app.include_router(payments.router)  # Points securely to billing infrastructure logic router
app.include_router(user.router)
app.include_router(profile.router)
app.include_router(converter.router)  # Mounted cleanly to bypass the URL Extraction routing drop holes

# 🛠️ Isolated configuration layers kept clean from route inclusion overhead to prevent AttributeError build loop crashes
# app.include_router(mailer.router)
# app.include_router(security.router)

# =====================================================================
# 🌟 MONITORING CHECKPOINTS (Root & Health Nodes)
# =====================================================================
@app.get("/", tags=["System"])
async def root_health_check():
    """🔥 Base Root Endpoint: Returns clean JSON to intercept UptimeRobot pings and eliminate 404 logs"""
    return {
        "status": "healthy",
        "service": "Cosmos Media Cloud API Engine",
        "message": "Gateway structural channel links are fully operating."
    }

@app.get("/health", tags=["System"])
async def system_health_status():
    """Returns baseline ecosystem status parameters safely"""
    bot_connected = False
    ghost_connected = False
    try: bot_connected = getattr(tg_bot, "is_connected", False)
    except Exception: pass
    try: ghost_connected = getattr(tg_ghost_bot, "is_connected", False)
    except Exception: pass

    return {
        "status": "healthy", 
        "environment": "production", 
        "debug_mode": getattr(settings, "DEBUG_MODE", False),
        "primary_bot_active": bot_connected,
        "ghost_bot_active": ghost_connected
    }


# 🔥 INTELLIGENT GLOBAL CRASH INTERCEPTOR
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"💥 Kernel Core Crash Intercepted: {str(exc)}", exc_info=True)
    
    error_message = str(exc) if getattr(settings, "DEBUG_MODE", False) else "Internal Cluster Server Exception"
    
    return JSONResponse(
        status_code=500, 
        content={"success": False, "detail": f"Kernel Crash Intercepted: {error_message}"}
    )
