import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../src/security/env", () => ({
  SECURITY_ENV: {
    KEY_MAX_AGE_DAYS: 90,
    API_KEY_GEMINI: "test-key",
    API_KEY_VERSION_GEMINI: "v5",
    API_KEY_ROTATION_DATE_GEMINI: "2026-02-01",
    API_KEY_OPENAI: "",
    API_KEY_VERSION_OPENAI: "",
    API_KEY_ROTATION_DATE_OPENAI: "",
    API_KEY_ANTHROPIC: "",
    API_KEY_VERSION_ANTHROPIC: "",
    API_KEY_ROTATION_DATE_ANTHROPIC: "",
  },
}));

const { getCurrentApiKey, isKeyRotationDue, getKeyMetadata } = await import("../src/security/keyRotation");

describe("keyRotation", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-02T00:00:00.000Z"));
  });

  it("returns api key and metadata", () => {
    expect(getCurrentApiKey("gemini")).toBe("test-key");
    expect(getKeyMetadata("gemini")).toEqual({
      provider: "gemini",
      version: "v5",
      rotationDate: "2026-02-01",
      isDue: false,
    });
  });

  it("detects due state correctly", () => {
    expect(isKeyRotationDue("gemini")).toBe(false);
  });
});
