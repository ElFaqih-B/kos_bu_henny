from __future__ import annotations

import base64
import hashlib
import hmac
import os
from datetime import datetime, timedelta, timezone
from typing import Annotated

import jwt
from fastapi import Cookie, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.models import Admin


PBKDF2_ITERATIONS = 310_000
bearer_scheme = HTTPBearer(auto_error=False)
COOKIE_NAME = "kos_omah_subardiman_admin"


def hash_password(password: str) -> str:
    salt = os.urandom(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, PBKDF2_ITERATIONS)
    return (
        f"pbkdf2_sha256${PBKDF2_ITERATIONS}$"
        f"{base64.b64encode(salt).decode('ascii')}$"
        f"{base64.b64encode(digest).decode('ascii')}"
    )


def verify_password(password: str, encoded: str) -> bool:
    try:
        scheme, iterations_raw, salt_b64, digest_b64 = encoded.split("$", 3)
        if scheme != "pbkdf2_sha256":
            return False
        actual = hashlib.pbkdf2_hmac(
            "sha256",
            password.encode("utf-8"),
            base64.b64decode(salt_b64),
            int(iterations_raw),
        )
        return hmac.compare_digest(actual, base64.b64decode(digest_b64))
    except (ValueError, TypeError, base64.binascii.Error):
        return False


def create_access_token(admin: Admin) -> str:
    now = datetime.now(timezone.utc)
    return jwt.encode(
        {
            "sub": str(admin.id),
            "username": admin.username,
            "iat": now,
            "exp": now + timedelta(minutes=settings.access_token_expire_minutes),
        },
        settings.secret_key,
        algorithm="HS256",
    )


def get_current_admin(
    db: Annotated[Session, Depends(get_db)],
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer_scheme)],
    cookie_token: Annotated[str | None, Cookie(alias=COOKIE_NAME)] = None,
) -> Admin:
    token = credentials.credentials if credentials else cookie_token
    error = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Sesi tidak valid atau sudah berakhir.",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if not token:
        raise error
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=["HS256"])
        admin_id = int(payload.get("sub", "0"))
    except (jwt.PyJWTError, ValueError, TypeError):
        raise error

    admin = db.get(Admin, admin_id)
    if admin is None or not admin.aktif:
        raise error
    return admin
