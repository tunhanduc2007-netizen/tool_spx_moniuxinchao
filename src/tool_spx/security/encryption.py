"""AES-256-GCM Encryption utilities for sensitive credentials."""

import base64
import os
import hashlib
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from tool_spx.config import settings

def _get_aes_key() -> bytes:
    """Derive a 32-byte key from master encryption key."""
    return hashlib.sha256(settings.MASTER_ENCRYPTION_KEY.encode()).digest()

def encrypt_secret(plain_text: str) -> str:
    """Encrypt plain text string using AES-256-GCM. Returns base64 encoded string."""
    if not plain_text:
        return ""
    key = _get_aes_key()
    aesgcm = AESGCM(key)
    nonce = os.urandom(12)  # 96-bit nonce for AES-GCM
    cipher_bytes = aesgcm.encrypt(nonce, plain_text.encode("utf-8"), None)
    # Combine nonce + ciphertext
    combined = nonce + cipher_bytes
    return base64.b64encode(combined).decode("utf-8")

def decrypt_secret(cipher_text_b64: str) -> str:
    """Decrypt base64 encoded AES-256-GCM cipher text."""
    if not cipher_text_b64:
        return ""
    try:
        key = _get_aes_key()
        aesgcm = AESGCM(key)
        combined = base64.b64decode(cipher_text_b64.encode("utf-8"))
        nonce = combined[:12]
        ciphertext = combined[12:]
        decrypted = aesgcm.decrypt(nonce, ciphertext, None)
        return decrypted.decode("utf-8")
    except Exception:
        return ""

def mask_secret(secret: str, visible_start: int = 4, visible_end: int = 4) -> str:
    """Mask sensitive string (e.g. 'spk_12345678abcdef' -> 'spk_****cdef')."""
    if not secret:
        return "Chưa cấu hình"
    if len(secret) <= (visible_start + visible_end):
        return "********"
    return f"{secret[:visible_start]}****{secret[-visible_end:]}"
