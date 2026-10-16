import { recordEvent } from './auditLog';
import { SECURITY_ENV } from './env';

export type SupportedProvider = 'gemini' | 'openai' | 'anthropic';

const getProviderConfig = (provider: SupportedProvider) => {
  if (provider === 'gemini') {
    return {
      key: SECURITY_ENV.API_KEY_GEMINI,
      version: SECURITY_ENV.API_KEY_VERSION_GEMINI,
      rotationDate: SECURITY_ENV.API_KEY_ROTATION_DATE_GEMINI,
    };
  }
  if (provider === 'openai') {
    return {
      key: SECURITY_ENV.API_KEY_OPENAI,
      version: SECURITY_ENV.API_KEY_VERSION_OPENAI,
      rotationDate: SECURITY_ENV.API_KEY_ROTATION_DATE_OPENAI,
    };
  }
  return {
    key: SECURITY_ENV.API_KEY_ANTHROPIC,
    version: SECURITY_ENV.API_KEY_VERSION_ANTHROPIC,
    rotationDate: SECURITY_ENV.API_KEY_ROTATION_DATE_ANTHROPIC,
  };
};

const getRotationDate = (provider: SupportedProvider): Date | null => {
  const value = getProviderConfig(provider).rotationDate;
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const getAgeInDays = (date: Date): number => {
  const diffMs = Date.now() - date.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
};

export const isKeyRotationDue = (provider: SupportedProvider): boolean => {
  const rotationDate = getRotationDate(provider);
  if (!rotationDate) {
    return true;
  }
  return getAgeInDays(rotationDate) > SECURITY_ENV.KEY_MAX_AGE_DAYS;
};

export const getCurrentApiKey = (provider: SupportedProvider): string => {
  const config = getProviderConfig(provider);

  const key = config.key.trim();
  if (!key || key === 'VITE_API_KEY_PLACEHOLDER' || key === 'REPLACE_WITH_REAL_KEY') {
    recordEvent({
      directive: 'KEY_ROTATION',
      outcome: 'DENY',
      sourceId: provider,
      message: `Missing API key for "${provider}"`,
    });
    throw new Error(`Missing API key for "${provider}"`);
  }

  const due = isKeyRotationDue(provider);
  recordEvent({
    directive: 'KEY_ROTATION',
    outcome: due ? 'WARN' : 'ALLOW',
    sourceId: provider,
    message: due
      ? `Key rotation overdue for "${provider}"`
      : `Key active for "${provider}"`,
  });

  return key;
};

export const getKeyMetadata = (provider: SupportedProvider) => {
  const config = getProviderConfig(provider);
  return {
    provider,
    version: config.version || 'unknown',
    rotationDate: config.rotationDate || '',
    isDue: isKeyRotationDue(provider),
  };
};

export const getSupportedProviders = (): SupportedProvider[] => ['gemini', 'openai', 'anthropic'];
