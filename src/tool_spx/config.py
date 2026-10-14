"""Configuration settings for Shopee Seller Pro."""

from pathlib import Path
from pydantic import BaseModel
import os
from dotenv import load_dotenv

# Base Directory
BASE_DIR = Path(__file__).resolve().parent.parent.parent
DATA_DIR = BASE_DIR / "data"
DATA_DIR.mkdir(exist_ok=True)

# Load environment variables
load_dotenv(BASE_DIR / ".env")

class Settings(BaseModel):
    PROJECT_NAME: str = "Shopee Seller Pro"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", f"sqlite:///{DATA_DIR / 'shopee_pro.db'}")
    
    # JWT Authentication
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "shopee-pro-super-secret-jwt-key-2026-production")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_HOURS: int = 8
    
    # Master Encryption Key for secrets (AES-256 requires 32 bytes)
    MASTER_ENCRYPTION_KEY: str = os.getenv("MASTER_ENCRYPTION_KEY", "shopee-pro-master-encryption-key-32b!")
    
    # Host & Port
    HOST: str = os.getenv("HOST", "127.0.0.1")
    PORT: int = int(os.getenv("PORT", "8000"))
    
    # Default Registration
    ALLOW_REGISTRATION: bool = os.getenv("ALLOW_REGISTRATION", "true").lower() == "true"

settings = Settings()
