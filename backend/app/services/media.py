from __future__ import annotations

from pathlib import Path
from uuid import uuid4

from fastapi import HTTPException, UploadFile, status

from app.config import settings


ALLOWED_MIME = {"image/jpeg", "image/png", "image/webp", "image/avif"}
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".avif"}


def detect_image_mime(header: bytes) -> str | None:
    """Detect the supported image type from file signatures, not only client headers."""
    if header.startswith(b"\xff\xd8\xff"):
        return "image/jpeg"
    if header.startswith(b"\x89PNG\r\n\x1a\n"):
        return "image/png"
    if len(header) >= 12 and header[:4] == b"RIFF" and header[8:12] == b"WEBP":
        return "image/webp"
    if len(header) >= 16 and header[4:8] == b"ftyp":
        brands = header[8:32]
        if b"avif" in brands or b"avis" in brands:
            return "image/avif"
    return None


class MediaService:
    def __init__(self) -> None:
        self.root = settings.upload_path
        self.max_bytes = settings.max_upload_mb * 1024 * 1024

    async def save_image(self, upload: UploadFile, folder: str = "images") -> tuple[str, str]:
        declared_type = (upload.content_type or "").lower()
        extension = Path(upload.filename or "").suffix.lower()

        if declared_type not in ALLOWED_MIME or extension not in ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Format gambar harus JPG, PNG, WEBP, atau AVIF.",
            )

        header = await upload.read(32)
        detected_type = detect_image_mime(header)
        if detected_type is None or detected_type != declared_type:
            await upload.close()
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Isi file tidak sesuai dengan format gambar yang didukung.",
            )
        await upload.seek(0)

        folder_path = (self.root / folder).resolve()
        if self.root not in folder_path.parents and folder_path != self.root:
            await upload.close()
            raise HTTPException(status_code=400, detail="Folder upload tidak valid.")
        folder_path.mkdir(parents=True, exist_ok=True)

        filename = f"{uuid4().hex}{extension}"
        destination = (folder_path / filename).resolve()
        if folder_path not in destination.parents:
            await upload.close()
            raise HTTPException(status_code=400, detail="Path upload tidak valid.")

        total = 0
        try:
            with destination.open("wb") as target:
                while chunk := await upload.read(1024 * 1024):
                    total += len(chunk)
                    if total > self.max_bytes:
                        raise HTTPException(
                            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                            detail=f"Ukuran gambar maksimal {settings.max_upload_mb} MB.",
                        )
                    target.write(chunk)
        except Exception:
            destination.unlink(missing_ok=True)
            raise
        finally:
            await upload.close()

        relative = destination.relative_to(self.root).as_posix()
        path = f"/media/{relative}"
        url = f"{settings.media_base_url.rstrip('/')}{path}"
        return path, url

    def delete_if_managed(self, value: str | None) -> None:
        if not value:
            return

        marker = "/media/"
        if marker not in value:
            return

        relative = value.split(marker, 1)[1]
        candidate = (self.root / relative).resolve()
        if self.root not in candidate.parents:
            return
        candidate.unlink(missing_ok=True)


media_service = MediaService()
