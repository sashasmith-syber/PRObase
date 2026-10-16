export type AuditOutcome = 'ALLOW' | 'DENY' | 'WARN';

export interface SecurityAuditEvent {
  directive: string;
  outcome: AuditOutcome;
  sourceId?: string;
  message: string;
  metadata?: Record<string, unknown>;
  timestamp: string;
  hash: string;
  previousHash: string;
}

interface RecordEventInput {
  directive: string;
  outcome: AuditOutcome;
  sourceId?: string;
  message: string;
  metadata?: Record<string, unknown>;
}

const MAX_EVENTS = 500;
const eventBuffer: SecurityAuditEvent[] = [];
let latestHash = '';

// Deterministic browser-safe SHA-256 implementation for tamper-evident chain hashing.
const sha256 = (input: string): string => {
  const rightRotate = (value: number, amount: number): number =>
    (value >>> amount) | (value << (32 - amount));

  const mathPow = Math.pow;
  const maxWord = mathPow(2, 32);
  const lengthProperty = 'length';

  let result = '';
  const words: number[] = [];
  const asciiBitLength = input[lengthProperty] * 8;

  const hash: number[] = [];
  const k: number[] = [];
  let primeCounter = 0;
  const isComposite: Record<number, boolean> = {};

  const maxWordSqrt = 313;
  for (let candidate = 2; primeCounter < 64; candidate += 1) {
    if (!isComposite[candidate]) {
      for (let i = 0; i < maxWordSqrt; i += candidate) {
        isComposite[i] = true;
      }
      hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
      k[primeCounter] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
      primeCounter += 1;
    }
  }

  let normalized = `${input}\x80`;
  while ((normalized[lengthProperty] % 64) - 56) {
    normalized += '\x00';
  }

  for (let i = 0; i < normalized[lengthProperty]; i += 1) {
    const code = normalized.charCodeAt(i);
    words[i >> 2] |= code << (((3 - i) % 4) * 8);
  }
  words[words[lengthProperty]] = (asciiBitLength / maxWord) | 0;
  words[words[lengthProperty]] = asciiBitLength;

  for (let j = 0; j < words[lengthProperty]; ) {
    const w = words.slice(j, (j += 16));
    const oldHash = hash.slice(0);

    for (let i = 0; i < 64; i += 1) {
      const w15 = w[i - 15];
      const w2 = w[i - 2];
      const a = hash[0];
      const e = hash[4];

      const temp1 =
        hash[7] +
        (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) +
        ((e & hash[5]) ^ (~e & hash[6])) +
        k[i] +
        (w[i] =
          i < 16
            ? w[i]
            : (w[i - 16] +
                (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3)) +
                w[i - 7] +
                (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))) |
              0);
      const temp2 =
        (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) +
        ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));

      hash.unshift((temp1 + temp2) | 0);
      hash[4] = (hash[4] + temp1) | 0;
      hash.pop();
    }

    for (let i = 0; i < 8; i += 1) {
      hash[i] = (hash[i] + oldHash[i]) | 0;
    }
  }

  for (let i = 0; i < 8; i += 1) {
    for (let j = 3; j >= 0; j -= 1) {
      const byte = (hash[i] >> (j * 8)) & 255;
      result += (byte < 16 ? '0' : '') + byte.toString(16);
    }
  }

  return result;
};

export const recordEvent = (input: RecordEventInput): SecurityAuditEvent => {
  const timestamp = new Date().toISOString();
  const previousHash = latestHash;
  const basePayload = JSON.stringify({
    directive: input.directive,
    outcome: input.outcome,
    sourceId: input.sourceId,
    message: input.message,
    metadata: input.metadata ?? {},
    timestamp,
  });
  const hash = sha256(`${previousHash}:${basePayload}`);
  latestHash = hash;

  const entry: SecurityAuditEvent = {
    ...input,
    metadata: input.metadata ?? {},
    timestamp,
    previousHash,
    hash,
  };

  eventBuffer.push(entry);
  if (eventBuffer.length > MAX_EVENTS) {
    eventBuffer.shift();
  }

  return entry;
};

export const getRecentAuditEvents = (limit = 50): SecurityAuditEvent[] => {
  if (limit <= 0) {
    return [];
  }
  return eventBuffer.slice(-limit);
};

export const getSecurityAuditDebugSnapshot = (limit = 50): SecurityAuditEvent[] =>
  getRecentAuditEvents(limit);

export const clearAuditEventsForTest = (): void => {
  eventBuffer.length = 0;
  latestHash = '';
};
