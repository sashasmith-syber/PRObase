import { describe, expect, it } from 'vitest';
import { MAX_PROMPT_LENGTH } from '../../constants/limits';
import {
  sanitizeTextInput,
  validateAttachmentDataUrl,
  validatePromptInput,
  validateWallpaperUrl,
} from '../../utils/validation';

describe('validation utilities', () => {
  it('sanitizes control characters from input', () => {
    const input = `hello\u0000world`;
    expect(sanitizeTextInput(input)).toBe('helloworld');
  });

  it('rejects prompts that exceed max length', () => {
    const input = 'a'.repeat(MAX_PROMPT_LENGTH + 1);
    const result = validatePromptInput(input);
    expect(result.isValid).toBe(false);
  });

  it('accepts valid wallpaper URLs', () => {
    const result = validateWallpaperUrl('https://example.com/image.png');
    expect(result.isValid).toBe(true);
  });

  it('rejects non-http wallpaper URLs', () => {
    const result = validateWallpaperUrl('data:text/plain;base64,AAA=');
    expect(result.isValid).toBe(false);
  });

  it('validates base64 attachment data URLs', () => {
    const dataUrl = `data:text/plain;base64,${btoa('hello')}`;
    const result = validateAttachmentDataUrl(dataUrl, 'text/plain');
    expect(result.isValid).toBe(true);
    expect(result.base64Data).toBeTruthy();
  });
});
