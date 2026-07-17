export const MAX_FILE_SIZE = 10 * 1024 * 1024;

export const ALLOWED_EXTENSIONS = ['.pdf', '.txt', '.jpg', '.jpeg', '.png'];

export function validateFile(file) {
  if (!file) return { valid: false, error: 'No file selected' };

  const ext = '.' + file.name.split('.').pop().toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return { valid: false, error: `File type ${ext} is not supported` };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: `File is too large (max ${formatFileSize(MAX_FILE_SIZE)})` };
  }

  return { valid: true };
}

export function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
