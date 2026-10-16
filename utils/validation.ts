import { MAX_AUDIO_BYTES, MAX_IMAGE_BYTES, MAX_PROMPT_LENGTH, MAX_TEXT_BYTES } from '../constants/limits';

type AttachmentCategory = 'image' | 'audio' | 'text';

const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

const ALLOWED_MIME_TYPES: Record<string, AttachmentCategory> = {
  'image/jpeg': 'image',
  'image/png': 'image',
  'image/gif': 'image',
  'image/webp': 'image',
  'audio/mpeg': 'audio',
  'audio/wav': 'audio',
  'audio/ogg': 'audio',
  'text/plain': 'text',
  'text/markdown': 'text',
  'application/json': 'text',
};

const EXTENSION_TO_MIME: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.ogg': 'audio/ogg',
  '.txt': 'text/plain',
  '.md': 'text/markdown',
  '.json': 'application/json',
};

const getSizeLimitForCategory = (category: AttachmentCategory): number => {
  switch (category) {
    case 'image':
      return MAX_IMAGE_BYTES;
    case 'audio':
      return MAX_AUDIO_BYTES;
    case 'text':
      return MAX_TEXT_BYTES;
    default:
      return MAX_TEXT_BYTES;
  }
};

/**
 * @param input - Raw user input.
 * @returns Sanitized string with control characters removed.
 */
export const sanitizeTextInput = (input: string): string => {
  return input.replace(CONTROL_CHARS, '');
};

/**
 * @param input - Raw prompt input.
 * @param maxLength - Maximum allowed length.
 * @returns Validation result and sanitized prompt.
 */
export const validatePromptInput = (
  input: string,
  maxLength: number = MAX_PROMPT_LENGTH
): { isValid: boolean; sanitized: string; error?: string } => {
  const sanitized = sanitizeTextInput(input);
  if (sanitized.length > maxLength) {
    return {
      isValid: false,
      sanitized,
      error: `Prompt is too long. Maximum length is ${maxLength} characters.`,
    };
  }
  return { isValid: true, sanitized };
};

/**
 * @param fileName - File name to infer MIME type.
 * @returns Inferred MIME type or null.
 */
export const getMimeTypeFromFileName = (fileName: string): string | null => {
  const lastDot = fileName.lastIndexOf('.');
  if (lastDot === -1) return null;
  const ext = fileName.slice(lastDot).toLowerCase();
  return EXTENSION_TO_MIME[ext] ?? null;
};

/**
 * @param mimeType - MIME type string.
 * @returns Attachment category or null if unsupported.
 */
export const getAttachmentCategory = (mimeType: string): AttachmentCategory | null => {
  return ALLOWED_MIME_TYPES[mimeType] ?? null;
};

/**
 * @param file - File object to validate.
 * @returns Validation result for file attachments.
 */
export const validateFileAttachment = (
  file: File
): { isValid: boolean; error?: string; mimeType?: string; category?: AttachmentCategory } => {
  const declaredType = file.type;
  const fallbackType = getMimeTypeFromFileName(file.name);
  const mimeType = declaredType && getAttachmentCategory(declaredType) ? declaredType : fallbackType;

  if (!mimeType || !getAttachmentCategory(mimeType)) {
    return {
      isValid: false,
      error: 'Unsupported file type. Allowed: jpg, png, gif, webp, mp3, wav, ogg, txt, md, json.',
    };
  }

  const category = getAttachmentCategory(mimeType);
  if (!category) {
    return { isValid: false, error: 'Unsupported file type.' };
  }

  const sizeLimit = getSizeLimitForCategory(category);
  if (file.size > sizeLimit) {
    return {
      isValid: false,
      error: `File is too large. Maximum ${category} size is ${Math.floor(sizeLimit / (1024 * 1024))}MB.`,
    };
  }

  return { isValid: true, mimeType, category };
};

/**
 * @param dataUrl - Base64 data URL string.
 * @returns Parsed MIME type and base64 data or null if invalid.
 */
export const parseBase64DataUrl = (
  dataUrl: string
): { mimeType: string; data: string } | null => {
  const trimmed = dataUrl.trim();
  const match = trimmed.match(/^data:([a-zA-Z0-9+./-]+);base64,([A-Za-z0-9+/=]+)$/);
  if (!match) {
    return null;
  }
  const mimeType = match[1];
  const data = match[2];
  if (data.length % 4 !== 0) {
    return null;
  }
  return { mimeType, data };
};

/**
 * @param base64Data - Base64 content without data URL prefix.
 * @returns Byte length of decoded data.
 */
export const getBase64ByteLength = (base64Data: string): number => {
  const padding = base64Data.endsWith('==') ? 2 : base64Data.endsWith('=') ? 1 : 0;
  return Math.max(0, Math.floor((base64Data.length * 3) / 4) - padding);
};

/**
 * @param dataUrl - Base64 data URL string.
 * @param declaredMimeType - Optional MIME type to validate against.
 * @returns Validation result for base64 attachment data.
 */
export const validateAttachmentDataUrl = (
  dataUrl: string,
  declaredMimeType?: string
): {
  isValid: boolean;
  error?: string;
  mimeType?: string;
  base64Data?: string;
  category?: AttachmentCategory;
  sizeBytes?: number;
} => {
  const parsed = parseBase64DataUrl(dataUrl);
  if (!parsed) {
    return { isValid: false, error: 'Invalid attachment data format.' };
  }

  const mimeType = declaredMimeType || parsed.mimeType;
  const category = getAttachmentCategory(mimeType);

  if (!category) {
    return { isValid: false, error: 'Unsupported attachment type.' };
  }

  const sizeBytes = getBase64ByteLength(parsed.data);
  const sizeLimit = getSizeLimitForCategory(category);
  if (sizeBytes > sizeLimit) {
    return {
      isValid: false,
      error: `Attachment is too large. Maximum ${category} size is ${Math.floor(sizeLimit / (1024 * 1024))}MB.`,
    };
  }

  return {
    isValid: true,
    mimeType,
    base64Data: parsed.data,
    category,
    sizeBytes,
  };
};

/**
 * @param input - Wallpaper URL string.
 * @returns Validation result and sanitized URL if valid.
 */
export const validateWallpaperUrl = (
  input: string
): { isValid: boolean; sanitizedUrl?: string; error?: string } => {
  const trimmed = input.trim();
  if (!trimmed) {
    return { isValid: false, error: 'Wallpaper URL cannot be empty.' };
  }

  try {
    const url = new URL(trimmed);
    if (!['http:', 'https:'].includes(url.protocol)) {
      return { isValid: false, error: 'Only http and https URLs are allowed.' };
    }
    return { isValid: true, sanitizedUrl: url.toString() };
  } catch {
    return { isValid: false, error: 'Invalid wallpaper URL.' };
  }
};
