# app/core/database.py

import logging
from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

logger = logging.getLogger("cosmos_logger")

# =====================================================================
# 💾 DATABASE CONNECTIVITY & SHIELD PROTECTION MATRIX
# =====================================================================
# Anti-Leak Configuration Guard: Verify target connection URI constraints explicitly
mongo_uri_str = settings.MONGO_URI.strip() if settings.MONGO_URI else ""
if not mongo_uri_str or mongo_uri_str in ["", "null", "undefined", "None"]:
    critical_err = "💥 [Cosmos Database Guard] Critical Configuration Drop: MONGO_URI string value is missing or corrupted."
    logger.critical(critical_err)
    raise RuntimeError(critical_err)

# Initializing secure connection nodes targeting the cluster pool instances
mongo_client = AsyncIOMotorClient(mongo_uri_str)
db = mongo_client["tg_catbox_secure"]

db_files = db["files"]
db_users = db["users"]


# =====================================================================
# 🤖 MULTI-TENANT PYROGRAM LAZY-LOADING PROXY FOR LOOP ALIGNMENT
# =====================================================================
class PyrogramClientProxy:
    def __init__(self, session_name: str, bot_token: str):
        """
        Dynamic parameter passing taaki multiple bots safely initialize ho sakein 
        without breaking runtime asyncio event execution parameters.
        """
        self._client = None
        self.session_name = session_name.strip()
        self.bot_token = bot_token.strip() if bot_token else ""

    def _get_client(self):
        """
        Runtime par jab pehli baar koi method call hogi, 
        tabhi client active loop se binary state configurations bind karega.
        """
        if self._client is None:
            # Shield Rejection: Break deployment execution early if security keys evaluate to blank properties
            if not self.bot_token or self.bot_token in ["", "null", "undefined"]:
                logger.error(f"⚠️ [Cosmos Bot Proxy] Aborted engine assignment: Token descriptor for '{self.session_name}' maps to dead states.")
                raise ValueError(f"Credentials parameter vector missing for Pyrogram Client Proxy: {self.session_name}")

            from pyrogram import Client
            logger.info(f"⚡ [Cosmos Core] Dynamically binding Pyrogram Client '{self.session_name}' to Uvicorn's active running loop...")
            
            self._client = Client(
                self.session_name,  
                api_id=settings.API_ID, 
                api_hash=settings.API_HASH, 
                bot_token=self.bot_token,
                workdir="."
            )
        return self._client

    def __getattr__(self, name):
        """
        Saari execution methods (start, stop, send_document, is_connected) 
        real underlying client handler block par route ho jayengi.
        """
        return getattr(self._get_client(), name)

    def __dir__(self):
        """
        🔥 CRITICAL PYTHON 3.14 INTROSPECTION FIX
        Allows strict inspection wrappers and runtime diagnostic loops to resolve proxy 
        namespaces cleanly without triggering initialization failures or AttributeError crashes.
        """
        try:
            return list(set(dir(self.__class__) + dir(self._get_client())))
        except Exception:
            return dir(self.__class__)


# =====================================================================
# 🚀 EXPORTING BOTH BOT PROXY INSTANCES SEAMLESSLY
# =====================================================================
# 🟢 Primary Main Bot (Number 1 Account Network Gateway)
tg_bot = PyrogramClientProxy("media_proxy_worker", settings.BOT_TOKEN)

# 🔴 Ghost Backup Bot (Number 2 Isolated Account Network Gateway)
tg_ghost_bot = PyrogramClientProxy("ghost_proxy_worker", settings.GHOST_BOT_TOKEN)
