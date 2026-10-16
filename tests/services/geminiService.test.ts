import { afterEach, describe, expect, it } from 'vitest';
import { getApiKey } from '../../services/geminiService';

const originalEnv = {
  API_KEY: process.env.API_KEY,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
};

const setEnv = (env: { API_KEY?: string; GEMINI_API_KEY?: string }): void => {
  if (env.API_KEY === undefined) {
    delete process.env.API_KEY;
  } else {
    process.env.API_KEY = env.API_KEY;
  }

  if (env.GEMINI_API_KEY === undefined) {
    delete process.env.GEMINI_API_KEY;
  } else {
    process.env.GEMINI_API_KEY = env.GEMINI_API_KEY;
  }
};

describe('geminiService getApiKey', () => {
  afterEach(() => {
    setEnv(originalEnv);
  });

  it('throws when no API keys are set', () => {
    setEnv({ API_KEY: '', GEMINI_API_KEY: '' });
    expect(() => getApiKey()).toThrow();
  });

  it('returns API_KEY when set', () => {
    setEnv({ API_KEY: 'test-key', GEMINI_API_KEY: '' });
    expect(getApiKey()).toBe('test-key');
  });

  it('falls back to GEMINI_API_KEY when API_KEY is missing', () => {
    setEnv({ API_KEY: '', GEMINI_API_KEY: 'gemini-key' });
    expect(getApiKey()).toBe('gemini-key');
  });
});
