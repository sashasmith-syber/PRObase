import { Mode } from '../types';
import { API_MAX_RETRIES, API_MIN_REQUEST_INTERVAL_MS, API_TIMEOUT_MS } from '../constants/api';
import { MAX_AUDIO_BYTES, MAX_IMAGE_BYTES, MAX_PROMPT_LENGTH, MAX_TEXT_BYTES } from '../constants/limits';
import { validateAttachmentDataUrl, validatePromptInput } from '../utils/validation';

type ValidationResult = { isValid: boolean; error?: string };

type PersonaId = Mode;

interface SanctuaryPointer {
  id: string;
  path: string;
  description: string;
}

interface GroundedCognitionConfig {
  sanctuaryPointers: SanctuaryPointer[];
  notes: string;
}

interface ApiSchemaConfig {
  modelPreference: string;
  enforceFlashSchema: boolean;
  allowedModels: string[];
  validateRequest: (request: unknown) => ValidationResult;
  validateResponse: (response: unknown) => ValidationResult;
}

interface GuardRailConfig {
  maxPromptLength: number;
  maxAttachmentBytes: {
    image: number;
    audio: number;
    text: number;
  };
  minRequestIntervalMs: number;
  timeoutMs: number;
  maxRetries: number;
}

interface ValidationMappings {
  prompt: (input: string) => ValidationResult;
  attachment: (dataUrl: string, mimeType?: string) => ValidationResult;
}

interface PersonaRegistryEntry {
  id: PersonaId;
  label: string;
  groundedCognition: GroundedCognitionConfig;
  apiSchema: ApiSchemaConfig;
  guardRails: GuardRailConfig;
  validation: ValidationMappings;
}

const LOCAL_SANCTUARY_POINTERS: SanctuaryPointer[] = [
  {
    id: 'gemini-service',
    path: 'services/geminiService.ts',
    description: 'Gemini API gateway with streaming + key validation.',
  },
  {
    id: 'validation-utils',
    path: 'utils/validation.ts',
    description: 'Input, attachment, and URL validation routines.',
  },
  {
    id: 'error-handler',
    path: 'utils/errorHandler.ts',
    description: 'Centralized error normalization and retry logic.',
  },
  {
    id: 'limits',
    path: 'constants/limits.ts',
    description: 'Global prompt and attachment size limits.',
  },
  {
    id: 'api-constants',
    path: 'constants/api.ts',
    description: 'API timeouts, retries, and rate limit thresholds.',
  },
  {
    id: 'architecture',
    path: 'docs/Architecture_v1.2.md',
    description: 'System architecture and persona design decisions.',
  },
  {
    id: 'deployment',
    path: 'docs/DEPLOYMENT.md',
    description: 'Reference deployment path and hosting guidance.',
  },
  {
    id: 'security',
    path: 'SECURITY.md',
    description: 'Security policies and recommended headers.',
  },
];

const validateGeminiFlashRequest = (request: unknown, allowedModels: string[]): ValidationResult => {
  if (typeof request !== 'object' || request === null) {
    return { isValid: false, error: 'Gemini request must be an object.' };
  }

  const record = request as Record<string, unknown>;
  const model = typeof record.model === 'string' ? record.model : '';

  if (!model) {
    return { isValid: false, error: 'Gemini request is missing model.' };
  }

  if (!allowedModels.includes(model)) {
    return { isValid: false, error: 'Gemini request model is not allowed.' };
  }

  if (!Array.isArray(record.contents)) {
    return { isValid: false, error: 'Gemini request is missing contents array.' };
  }

  return { isValid: true };
};

const validateGeminiFlashResponse = (response: unknown): ValidationResult => {
  if (typeof response !== 'object' || response === null) {
    return { isValid: false, error: 'Gemini response must be an object.' };
  }

  const record = response as Record<string, unknown>;
  if ('text' in record && typeof record.text !== 'string' && typeof record.text !== 'function') {
    return { isValid: false, error: 'Gemini response text must be a string.' };
  }

  return { isValid: true };
};
const guardianPromptValidation = (input: string): ValidationResult => {
  const result = validatePromptInput(input, MAX_PROMPT_LENGTH);
  return result.isValid ? { isValid: true } : { isValid: false, error: result.error };
};

const guardianAttachmentValidation = (dataUrl: string, mimeType?: string): ValidationResult => {
  const result = validateAttachmentDataUrl(dataUrl, mimeType);
  return result.isValid ? { isValid: true } : { isValid: false, error: result.error };
};

const BASE_GUARD_RAILS: GuardRailConfig = {
  maxPromptLength: MAX_PROMPT_LENGTH,
  maxAttachmentBytes: {
    image: MAX_IMAGE_BYTES,
    audio: MAX_AUDIO_BYTES,
    text: MAX_TEXT_BYTES,
  },
  minRequestIntervalMs: API_MIN_REQUEST_INTERVAL_MS,
  timeoutMs: API_TIMEOUT_MS,
  maxRetries: API_MAX_RETRIES,
};

const GEMINI_ALLOWED_MODELS = [
  'gemini-2.5-flash',
  'models/gemini-2.5-flash',
  'google/gemini-2.5-flash',
  'gemini-2.5-pro',
  'models/gemini-2.5-pro',
  'google/gemini-2.5-pro',
];

const BASE_SCHEMA: ApiSchemaConfig = {
  modelPreference: 'gemini-2.5-flash',
  enforceFlashSchema: true,
  allowedModels: GEMINI_ALLOWED_MODELS,
  validateRequest: (request) => validateGeminiFlashRequest(request, GEMINI_ALLOWED_MODELS),
  validateResponse: validateGeminiFlashResponse,
};

const BASE_GROUNDING: GroundedCognitionConfig = {
  sanctuaryPointers: LOCAL_SANCTUARY_POINTERS,
  notes: 'Ground all reasoning in Local Sanctuary pointers to prevent hallucinations.',
};

const BASE_VALIDATION: ValidationMappings = {
  prompt: guardianPromptValidation,
  attachment: guardianAttachmentValidation,
};

const createPersona = (id: PersonaId, label: string): PersonaRegistryEntry => ({
  id,
  label,
  groundedCognition: BASE_GROUNDING,
  apiSchema: BASE_SCHEMA,
  guardRails: BASE_GUARD_RAILS,
  validation: BASE_VALIDATION,
});

/**
 * PROTOS-1 Persona Registry
 * Centralized definitions for the 12 expert personas.
 */
export const PROTOS_1_PERSONA_REGISTRY: Record<PersonaId, PersonaRegistryEntry> = {
  [Mode.Professor]: createPersona(Mode.Professor, 'Professor'),
  [Mode.Coder]: createPersona(Mode.Coder, 'Coder'),
  [Mode.Troubleshooter]: createPersona(Mode.Troubleshooter, 'Troubleshooter'),
  [Mode.Security]: createPersona(Mode.Security, 'Security Analyst'),
  [Mode.TestCaseGenerator]: createPersona(Mode.TestCaseGenerator, 'Test Case Generator'),
  [Mode.SemanticDebugger]: createPersona(Mode.SemanticDebugger, 'Semantic Debugger'),
  [Mode.CodeTranslator]: createPersona(Mode.CodeTranslator, 'Code Translator'),
  [Mode.ApiIntegrator]: createPersona(Mode.ApiIntegrator, 'API Integrator'),
  [Mode.KnowledgeBaseGenerator]: createPersona(Mode.KnowledgeBaseGenerator, 'Knowledge Base Generator'),
  [Mode.PerformanceAnalyzer]: createPersona(Mode.PerformanceAnalyzer, 'Performance Analyzer'),
  [Mode.GenerativeUiUxPrototyper]: createPersona(Mode.GenerativeUiUxPrototyper, 'Generative UI/UX Prototyper'),
  [Mode.SimulatedExperimentation]: createPersona(Mode.SimulatedExperimentation, 'Simulated Experimentation'),
};

/**
 * @param personaId - Persona identifier.
 * @returns The persona registry entry.
 */
export const getPersonaRegistryEntry = (personaId: PersonaId): PersonaRegistryEntry => {
  return PROTOS_1_PERSONA_REGISTRY[personaId];
};

/**
 * @returns Local Sanctuary pointers for grounding.
 */
export const getSanctuaryPointers = (): SanctuaryPointer[] => {
  return LOCAL_SANCTUARY_POINTERS;
};
