from __future__ import annotations

from pathlib import Path
from urllib.parse import urlparse
from uuid import uuid4

from fastapi import HTTPException, UploadFile, status
from vercel.blob import AsyncBlobClient, BlobClient
from vercel.blob.errors import BlobError

from app.config import settings


ALLOWED_MIME = {
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/avif",
}

ALLOWED_EXTENSIONS = {
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
    ".avif",
}

MIME_EXTENSIONS = {
    "image/jpeg": {".jpg", ".jpeg"},
    "image/png": {".png"},
    "image/webp": {".webp"},
    "image/avif": {".avif"},
}


def detect_image_mime(header: bytes) -> str | None:
    """Mendeteksi tipe gambar dari signature file."""
    if header.startswith(b"\xff\xd8\xff"):
        return "image/jpeg"

    if header.startswith(b"\x89PNG\r\n\x1a\n"):
        return "image/png"

    if (
        len(header) >= 12
        and header[:4] == b"RIFF"
        and header[8:12] == b"WEBP"
    ):
        return "image/webp"

    if len(header) >= 16 and header[4:8] == b"ftyp":
        brands = header[8:32]

        if b"avif" in brands or b"avis" in brands:
            return "image/avif"

    return None


class MediaService:
    def __init__(self) -> None:
        self.max_bytes = (
            settings.max_upload_mb
            * 1024
            * 1024
        )

        self.async_blob = AsyncBlobClient()
        self.blob = BlobClient()

    async def save_image(
        self,
        upload: UploadFile,
        folder: str = "images",
    ) -> tuple[str, str]:
        declared_type = (
            upload.content_type or ""
        ).lower()

        extension = Path(
            upload.filename or ""
        ).suffix.lower()

        # Validasi format
        if (
            declared_type not in ALLOWED_MIME
            or extension not in ALLOWED_EXTENSIONS
        ):
            await upload.close()

            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=(
                    "Format gambar harus JPG, "
                    "PNG, WEBP, atau AVIF."
                ),
            )

        # Baca signature
        header = await upload.read(32)

        detected_type = detect_image_mime(
            header
        )

        if (
            detected_type is None
            or detected_type != declared_type
            or extension
            not in MIME_EXTENSIONS[detected_type]
        ):
            await upload.close()

            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=(
                    "Isi file tidak sesuai dengan "
                    "format gambar yang didukung."
                ),
            )

        await upload.seek(0)

        # Validasi folder
        clean_folder = (
            folder.strip("/")
            .replace("\\", "/")
        )

        if (
            not clean_folder
            or ".." in clean_folder.split("/")
        ):
            await upload.close()

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Folder upload tidak valid.",
            )

        # Baca file
        total = 0
        chunks: list[bytes] = []

        try:
            while True:
                chunk = await upload.read(
                    1024 * 1024
                )

                if not chunk:
                    break

                total += len(chunk)

                if total > self.max_bytes:
                    raise HTTPException(
                        status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                        detail=(
                            "Ukuran gambar maksimal "
                            f"{settings.max_upload_mb} MB."
                        ),
                    )

                chunks.append(chunk)

        finally:
            await upload.close()

        file_bytes = b"".join(chunks)

        filename = (
            f"{uuid4().hex}{extension}"
        )

        pathname = (
            f"{clean_folder}/{filename}"
        )

        # Upload ke Vercel Blob
        try:
            uploaded = await self.async_blob.put(
                pathname,
                file_bytes,
                access="public",
                content_type=detected_type,
            )

        except BlobError as exc:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=(
                    "Gagal menyimpan gambar "
                    "ke Vercel Blob."
                ),
            ) from exc

        except Exception as exc:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=(
                    "Terjadi kesalahan saat "
                    "mengunggah gambar."
                ),
            ) from exc

        # URL Blob adalah source of truth media.
        #
        # path dan url sengaja sama-sama URL absolut
        # agar frontend lama maupun baru tetap aman.
        return uploaded.url, uploaded.url

    def delete_if_managed(
        self,
        value: str | None,
    ) -> None:
        if not value:
            return

        # Jangan pernah menghapus URL arbitrary.
        if not self._is_vercel_blob_url(value):
            return

        try:
            self.blob.delete(value)

        except BlobError:
            # Penghapusan media tidak boleh membuat
            # operasi CRUD utama gagal.
            return

        except Exception:
            return

    @staticmethod
    def _is_vercel_blob_url(
        value: str,
    ) -> bool:
        try:
            parsed = urlparse(value)

            hostname = (
                parsed.hostname or ""
            ).lower()

            return (
                parsed.scheme == "https"
                and (
                    hostname.endswith(
                        ".public.blob.vercel-storage.com"
                    )
                    or hostname.endswith(
                        ".blob.vercel-storage.com"
                    )
                )
            )

        except ValueError:
            return False


media_service = MediaService()