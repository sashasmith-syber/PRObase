import { describe, expect, it } from "vitest";
import { clearAuditEventsForTest, getRecentAuditEvents, recordEvent } from "../src/security/auditLog";

describe("auditLog", () => {
  it("records events and links hashes", () => {
    clearAuditEventsForTest();
    const first = recordEvent({
      directive: "BUBBLE",
      outcome: "ALLOW",
      sourceId: "test",
      message: "first",
    });
    const second = recordEvent({
      directive: "BUBBLE",
      outcome: "WARN",
      sourceId: "test",
      message: "second",
    });

    expect(first.previousHash).toBe("");
    expect(second.previousHash).toBe(first.hash);
    expect(second.hash).not.toBe(first.hash);
    expect(getRecentAuditEvents(2)).toHaveLength(2);
  });
});
