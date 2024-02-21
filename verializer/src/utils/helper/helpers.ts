import crypto from "crypto";
export function generateUniqueFileName(
  originalName: string,
  sha256checksum: string
) {
  const timestamp = Date.now().toString();

  const extension = originalName.split(".").pop();
  // Either use shaChechsum or randomBytes
  const uniqueFileName = `${timestamp}-${sha256checksum}.${extension}`;

  return uniqueFileName;
}

export function generateDownloadZipName(): string {
  return crypto.randomBytes(16).toString("hex");
}
