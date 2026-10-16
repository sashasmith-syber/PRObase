import { recordEvent } from "./auditLog";

export type BubbleOutcome = "ALLOW" | "DENY" | "WARN";

export interface BubbleDirectiveResult {
  directive: "BUBBLE";
  outcome: BubbleOutcome;
  message: string;
  reasons: string[];
  sanitizedPayload?: string;
  metadata?: Record<string, unknown>;
}

interface RateBucket {
  count: number;
  windowStart: number;
}

interface SafeBubbleInput {
  sourceId: string;
  endpoint: string;
  origin: string;
  payloadText: string;
  payloadSizeBytes: number;
  requestedTokens: number;
  allowedOrigins: readonly string[];
  maxTokens: number;
  maxPayloadSize: number;
  rateLimit: {
    windowMs: number;
    maxRequests: number;
  };
}

const rateBuckets = new Map<string, RateBucket>();
const INJECTION_MARKERS: RegExp[] = [
  /ignore\s+all\s+previous\s+instructions/gi,
  /developer\s+instructions/gi,
  /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
  /javascript:/gi,
  /data:text\/html/gi,
  /prompt\s+injection/gi,
];

const makeResult = (
  input: Pick<SafeBubbleInput, "sourceId" | "endpoint">,
  outcome: BubbleOutcome,
  message: string,
  reasons: string[],
  sanitizedPayload?: string,
): BubbleDirectiveResult => {
  const result: BubbleDirectiveResult = {
    directive: "BUBBLE",
    outcome,
    message,
    reasons,
    sanitizedPayload,
    metadata: {
      endpoint: input.endpoint,
      sourceId: input.sourceId,
    },
  };

  void recordEvent({
    directive: result.directive,
    outcome: result.outcome,
    sourceId: input.sourceId,
    message: `${message}${reasons.length > 0 ? ` :: ${reasons.join("; ")}` : ""}`,
    metadata: result.metadata,
  });

  return result;
};

const evaluateRateLimit = (
  sourceId: string,
  endpoint: string,
  windowMs: number,
  maxRequests: number,
): { allowed: boolean; count: number } => {
  const bucketId = `${sourceId}:${endpoint}`;
  const current = rateBuckets.get(bucketId);
  const now = Date.now();

  if (!current || now - current.windowStart > windowMs) {
    rateBuckets.set(bucketId, { count: 1, windowStart: now });
    return { allowed: true, count: 1 };
  }

  if (current.count >= maxRequests) {
    return { allowed: false, count: current.count };
  }

  current.count += 1;
  rateBuckets.set(bucketId, current);
  return { allowed: true, count: current.count };
};

const sanitizePrompt = (text: string): { value: string; changed: boolean } => {
  let sanitized = text;
  for (const marker of INJECTION_MARKERS) {
    sanitized = sanitized.replace(marker, "[REMOVED]");
  }
  return { value: sanitized, changed: sanitized !== text };
};

export const parseAllowedOrigins = (value: string): string[] =>
  value
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

export const resetSafeBubbleRateLimitForTest = (): void => {
  rateBuckets.clear();
};

export const checkSafeBubble = (input: SafeBubbleInput): BubbleDirectiveResult => {
  if (!input.allowedOrigins.length) {
    return makeResult(input, "DENY", "Safe Bubble configuration invalid", ["ALLOWED_ORIGINS_EMPTY"]);
  }

  if (!input.origin || !input.allowedOrigins.includes(input.origin)) {
    return makeResult(input, "DENY", "Origin denied by Safe Bubble", ["ORIGIN_NOT_ALLOWED"]);
  }

  if (input.maxPayloadSize <= 0 || input.maxTokens <= 0) {
    return makeResult(input, "DENY", "Safe Bubble configuration invalid", ["NON_POSITIVE_LIMITS"]);
  }

  if (input.payloadSizeBytes > input.maxPayloadSize) {
    return makeResult(input, "DENY", "Payload exceeds Safe Bubble size limit", ["MAX_PAYLOAD_SIZE_EXCEEDED"]);
  }

  if (input.requestedTokens > input.maxTokens) {
    return makeResult(input, "DENY", "Token estimate exceeds Safe Bubble limit", ["MAX_TOKENS_EXCEEDED"]);
  }

  const rate = evaluateRateLimit(
    input.sourceId,
    input.endpoint,
    input.rateLimit.windowMs,
    input.rateLimit.maxRequests,
  );
  if (!rate.allowed) {
    return makeResult(input, "DENY", "Safe Bubble rate limit exceeded", ["RATE_LIMIT_EXCEEDED"]);
  }

  const sanitized = sanitizePrompt(input.payloadText);
  if (sanitized.changed) {
    return makeResult(
      input,
      "WARN",
      "Payload sanitized by Safe Bubble",
      ["PROMPT_INJECTION_MARKERS_REMOVED"],
      sanitized.value,
    );
  }

  return makeResult(input, "ALLOW", "Safe Bubble approved request", []);
};
