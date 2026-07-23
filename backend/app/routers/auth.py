from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.models import Admin
from app.schemas import AdminOut, LoginRequest, LoginResponse
from app.security import COOKIE_NAME, create_access_token, get_current_admin, verify_password


router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=LoginResponse)
def login(payload: LoginRequest, response: Response, db: Annotated[Session, Depends(get_db)]):
    admin = db.scalar(select(Admin).where(Admin.username == payload.username))
    if admin is None or not admin.aktif or not verify_password(payload.password, admin.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Username atau password salah.")

    token = create_access_token(admin)
    response.set_cookie(
        key=COOKIE_NAME,
        value=token,
        httponly=True,
        secure=settings.app_env == "production",
        samesite="lax",
        max_age=settings.access_token_expire_minutes * 60,
        path="/",
    )
    return LoginResponse(username=admin.username)


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(response: Response):
    response.status_code = status.HTTP_204_NO_CONTENT
    response.delete_cookie(COOKIE_NAME, path="/")
    return response


@router.get("/me", response_model=AdminOut)
def me(current_admin: Annotated[Admin, Depends(get_current_admin)]):
    return current_admin
