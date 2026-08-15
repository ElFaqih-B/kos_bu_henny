export const IMAGE_UPLOAD_ACCEPT =
  "image/jpeg,image/png,image/webp,image/avif,image/gif,image/heic,image/heif";

export function isHeicFile(file: File): boolean {
  return (
    file.type === "image/heic" ||
    file.type === "image/heif" ||
    /\.(heic|heif)$/i.test(file.name)
  );
}

export function isSupportedImageFile(
  file: File,
): boolean {
  if (isHeicFile(file)) {
    return true;
  }

  return file.type.startsWith("image/");
}

export async function prepareUploadFile(
  file: File,
): Promise<File> {
  if (!isHeicFile(file)) {
    return file;
  }

  if (typeof window === "undefined") {
    throw new Error(
      "Konversi HEIC hanya dapat dilakukan di browser.",
    );
  }

  try {
    const { default: heic2any } = await import(
      "heic2any"
    );

    const converted = await heic2any({
      blob: file,
      toType: "image/jpeg",
      quality: 0.9,
    });

    const jpegBlob = Array.isArray(converted)
      ? converted[0]
      : converted;

    if (!(jpegBlob instanceof Blob)) {
      throw new Error(
        "Hasil konversi HEIC tidak valid.",
      );
    }

    const filename = file.name.replace(
      /\.(heic|heif)$/i,
      ".jpg",
    );

    return new File(
      [jpegBlob],
      filename,
      {
        type: "image/jpeg",
        lastModified: Date.now(),
      },
    );
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        `Gagal mengonversi HEIC: ${error.message}`,
      );
    }

    throw new Error(
      "Gagal mengonversi gambar HEIC.",
    );
  }
}