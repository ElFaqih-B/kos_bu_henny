
import heic2any from "heic2any";

export const IMAGE_UPLOAD_ACCEPT =
  "image/jpeg,image/png,image/webp,image/avif,image/heic,image/heif";

export function isHeicFile(file: File): boolean {
  return (
    file.type === "image/heic" ||
    file.type === "image/heif" ||
    /\.(heic|heif)$/i.test(file.name)
  );
}

export async function prepareUploadFile(
  file: File,
): Promise<File> {
  if (!isHeicFile(file)) {
    return file;
  }

  const converted = await heic2any({
    blob: file,
    toType: "image/jpeg",
    quality: 0.9,
  });

  const jpegBlob = Array.isArray(converted)
    ? converted[0]
    : converted;

  if (!jpegBlob) {
    throw new Error(
      "Gagal mengonversi gambar HEIC.",
    );
  }

  return new File(
    [jpegBlob],
    file.name.replace(/\.(heic|heif)$/i, ".jpg"),
    {
      type: "image/jpeg",
    },
  );
}
