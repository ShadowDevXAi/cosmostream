import os
import logging
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("cosmos_logger")

def safe_parse_channel_id(env_name: str, default=0):
    """
    Fail-safe helper: Agar variable numerical ID hai toh int banayega,
    agar alpha-numeric handle hai (jaise @shadowamvstorage) toh str rehne dega.
    """
    val = os.getenv(env_name)
    if not val:
        return default
    try:
        # Agar user ne numeric ID di hai (-100xxxxxxxxx)
        return int(val)
    except ValueError:
        # Agar user ne handle diya hai (@username)
        return str(val)

class Settings:
    MONGO_URI: str = os.getenv("MONGO_URI")
    API_ID: int = int(os.getenv("API_ID", 0))
    API_HASH: str = os.getenv("API_HASH")
    BOT_TOKEN: str = os.getenv("BOT_TOKEN")
    CHANNEL_ID: str = os.getenv("CHANNEL_ID")
    BASE_URL: str = os.getenv("BASE_URL", "https://shadowapiweb.onrender.com")
    ADMIN_SECRET: str = os.getenv("ADMIN_SECRET")
    DEBUG_MODE: bool = os.getenv("DEBUG_MODE", "True").lower() == "true" 
    
    # GMAIL SMTP CONFIGURATION CORES
    GMAIL_USER: str = os.getenv("GMAIL_USER")
    GMAIL_APP_PASSWORD: str = os.getenv("GMAIL_APP_PASSWORD")

    # 🔥 NEW MAIL GATEWAY ENCRYPTION VECTOR
    RESEND_API_KEY: str = os.getenv("RESEND_API_KEY")

    # TRIPLE-LAYER TELEGRAM REDUNDANCY CORES (SAFE PARSING)
    BACKUP_CHANNEL_SAME = safe_parse_channel_id("BACKUP_CHANNEL_SAME", 0)
    GHOST_BOT_TOKEN: str = os.getenv("GHOST_BOT_TOKEN")
    GHOST_CHANNEL_ID = safe_parse_channel_id("GHOST_CHANNEL_ID", 0)

    # 💳 RAZORPAY SUBSCRIPTION BILLING INTEGRATION CORES
    RAZORPAY_KEY_ID: str = os.getenv("RAZORPAY_KEY_ID")
    RAZORPAY_KEY_SECRET: str = os.getenv("RAZORPAY_KEY_SECRET")

settings = Settings()
