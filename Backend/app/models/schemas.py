# app/models/schemas.py

from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class UserRegisterSchema(BaseModel):
    email: EmailStr = Field(..., description="Valid standard infrastructure email vector")
    username: str = Field(..., min_length=3, max_length=20, pattern=r"^[a-zA-Z0-9_-]+$")
    password: str = Field(..., min_length=6, description="Cryptographic secure raw user password")
    confirm_password: str = Field(..., min_length=6, description="Verification match password")
    
    # 🔥 ALIGNED FIX: Added missing Telegram parameters strictly required by the auth register router
    telegram_id: int = Field(..., description="Raw numerical integer Telegram ID node")
    telegram_username: str = Field(..., min_length=2, description="Explicit Telegram text handle string context")
    
    name: str = Field(..., min_length=2, max_length=50, description="Legal identity first name")
    surname: str = Field(..., min_length=2, max_length=50, description="Legal identity last name")
    mobile: str = Field(..., pattern=r"^\+?[0-9]{10,15}$", description="E.164 compliant cellular connection numbers")
    dob: str = Field(..., pattern=r"^\d{4}-\d{2}-\d{2}$", description="Strict age-gate validation token format (YYYY-MM-DD)")

class UserLogin(BaseModel):
    # 🚨 ANTI-LEAK SHIELD: Enforces min_length to kill empty string or loose parameter injections early
    identifier: str = Field(..., min_length=3, max_length=50, description="Email or Username input fallback parameter context")
    password: str = Field(..., min_length=1, description="Account security credential password reference")
