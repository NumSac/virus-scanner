import { Request } from "express";
import multer, { FileFilterCallback } from "multer";

import { magicBytesMap } from "./types/types";

// Adjusted to return an array of strings
const checkMagicBytes = (buffer: Buffer): string[] | null => {
  const hexString = buffer.toString("hex", 0, 4);
  for (const [magicBytes, fileTypes] of Object.entries(magicBytesMap)) {
    if (hexString.startsWith(magicBytes)) {
      return fileTypes;
    }
  }
  return null;
};

// Override multer's file-handling function to use with memory storage
const fileFilter = async (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  // Add file extensions here to enable upload
  const allowedExtensions: string[] = [
    "pdf",
    "jpg",
    "docx",
    "png",
    "exe",
    "so",
    "dll",
    "ps1",
    "txt",
  ];

  // Check file extension
  const fileExtension = file.originalname.split(".").pop()?.toLowerCase();
  if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
    return cb(new Error("Invalid file extension"));
  }

  // Optionally check the magic bytes for additional validation
  if (file.buffer) {
    const fileType = checkMagicBytes(file.buffer);
    if (!fileType) {
      return cb(new Error("File type not allowed"));
    }
  }

  cb(null, true);
};

// Create the multer instance with memory storage to access the buffer
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: fileFilter,
});

export default upload;
