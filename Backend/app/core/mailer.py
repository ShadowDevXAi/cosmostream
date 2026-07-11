import logging
import httpx
from app.core.config import settings

logger = logging.getLogger("cosmos_logger")

async def send_real_gmail_verification(email: str, token: str, username: str):
    """Dispatches verification links using secure HTTPS endpoints over Resend Port 443."""
    verification_link = f"{settings.BASE_URL}/verify-email?token={token}"
    
    url = "https://api.resend.com/emails"
    headers = {
        "Authorization": f"Bearer {settings.RESEND_API_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "from": "Cosmos Cloud <onboarding@resend.dev>",
        "to": [email],
        "subject": "🔐 Secure Your Cosmos Media Cloud Account Node",
        "html": f"""
        <html>
            <body style="font-family: Arial, sans-serif; background-color: #0d0e12; color: #ffffff; padding: 20px;">
                <div style="max-width: 500px; margin: 0 auto; background: #161920; padding: 30px; border-radius: 12px; border: 1px solid #262933;">
                    <h2 style="color: #a855f7; text-align: center;">Welcome to Cosmos Cloud, {username}!</h2>
                    <p style="color: #94a3b8; font-size: 14px; text-align: center;">Click the validation link below to verify your email address:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="{verification_link}" style="background: linear-gradient(135deg, #a855f7 0%, #6366f1 100%); color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; display: inline-block;">Verify Email</a>
                    </div>
                </div>
            </body>
        </html>
        """
    }
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=payload, headers=headers)
            if response.status_code in [200, 201]:
                logger.info(f"📧 Verification mail successfully dispatched via Resend HTTP API to: {email}")
                return True
            logger.error(f"❌ Resend API Gateway Refusal: {response.text}")
            return False
    except Exception as e:
        logger.error(f"❌ HTTP Mailer Engine Exception: {str(e)}")
        return False
