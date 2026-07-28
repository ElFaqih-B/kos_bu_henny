from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


BACKEND_ROOT = Path(__file__).resolve().parent.parent


class Settings(BaseSettings):
    # Application
    app_name: str = "Kos Bu Henny API"
    app_env: str = "development"
    api_prefix: str = "/api/v1"

    # Security
    secret_key: str
    access_token_expire_minutes: int = 720

    # CORS
    cors_origins: str = "http://localhost:3000"

    # Admin Seed
    seed_admin_username: str | None = None
    seed_admin_password: str | None = None

    # Upload & Media
    upload_dir: str = "uploads"
    max_upload_mb: int = 6
    media_base_url: str = "http://localhost:8000"

    # Database
    database_url: str

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # CORS
    @property
    def cors_origin_list(self) -> list[str]:
        return [
            origin.strip()
            for origin in self.cors_origins.split(",")
            if origin.strip()
        ]

    # Upload Path
    @property
    def upload_path(self) -> Path:
        path = Path(self.upload_dir)

        if path.is_absolute():
            return path

        return BACKEND_ROOT / path

    # Admin Seed
    @property
    def seed_admin_enabled(self) -> bool:
        return bool(
            self.seed_admin_username
            and self.seed_admin_password
        )


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()