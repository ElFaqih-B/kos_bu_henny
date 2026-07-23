from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


BACKEND_DIR = Path(__file__).resolve().parent.parent
ENV_FILE = BACKEND_DIR / ".env"


class Settings(BaseSettings):
    app_name: str = "Kos Bu Henny API"
    app_env: str = "development"
    api_prefix: str = "/api/v1"

    secret_key: str
    access_token_expire_minutes: int = 720
    database_url: str
    cors_origins: str = "*"

    seed_admin_username: str = "admin"
    seed_admin_password: str
    seed_dummy_data: bool = True

    upload_dir: str = "uploads"
    max_upload_mb: int = 6
    media_base_url: str = "http://localhost:8000"

    model_config = SettingsConfigDict(
        env_file=ENV_FILE,
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=False,
    )

    @property
    def cors_origin_list(self) -> list[str]:
        return [item.strip() for item in self.cors_origins.split(",") if item.strip()]

    @property
    def upload_path(self) -> Path:
        path = Path(self.upload_dir).expanduser()
        if not path.is_absolute():
            path = BACKEND_DIR / path
        path = path.resolve()
        path.mkdir(parents=True, exist_ok=True)
        return path


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
