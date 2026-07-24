import multer, { StorageEngine, FileFilterCallback } from 'multer';
import path from 'path';
import { Request } from 'express';

// ─────────────────────────────────────────────────────────────────────────────
// Multer Upload Configuration
// File upload implementation will occur in future phases
// ─────────────────────────────────────────────────────────────────────────────

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const ALLOWED_DOCUMENT_TYPES = ['application/pdf'];
const MAX_FILE_SIZE_MB = 10;

// Memory storage (for processing before saving to cloud storage)
const memoryStorage: StorageEngine = multer.memoryStorage();

// File filter for images
const imageFilter = (
  _req: Request,
  file: Express.Multer.File,
  callback: FileFilterCallback,
): void => {
  if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(new Error(`File type '${file.mimetype}' is not allowed. Only images are accepted.`));
  }
};

// Image upload middleware (placeholder — implementation pending future phases)
export const uploadImage = multer({
  storage: memoryStorage,
  fileFilter: imageFilter,
  limits: { fileSize: MAX_FILE_SIZE_MB * 1024 * 1024 },
});

// Document upload middleware (placeholder — implementation pending future phases)
export const uploadDocument = multer({
  storage: memoryStorage,
  limits: { fileSize: MAX_FILE_SIZE_MB * 1024 * 1024 },
});
