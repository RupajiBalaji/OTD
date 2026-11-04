export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export const validateGarmentImage = (
  file: { mimetype?: string; size?: number } | undefined
): FileValidationResult => {
  if (!file) {
    return { isValid: false, error: 'No image file provided' };
  }

  if (file.mimetype && !ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return {
      isValid: false,
      error: `Unsupported image format (${file.mimetype}). Please upload JPEG, PNG, WEBP, or HEIC.`,
    };
  }

  if (file.size && file.size > MAX_FILE_SIZE_BYTES) {
    return {
      isValid: false,
      error: 'File size exceeds maximum allowed threshold of 10MB',
    };
  }

  return { isValid: true };
};
