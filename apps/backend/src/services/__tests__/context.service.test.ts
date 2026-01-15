import { describe, it, expect } from "vitest";
import { buildContext } from "../context.service";

const makeMessages = (count: number) =>
  Array.from({ length: count }).map((_, i) => ({
    role: "user" as const,
    content: `message-${i + 1}`,
  }));

describe("buildContext", () => {
  it("returns all messages when under limit", () => {
    const messages = makeMessages(5);

    const result = buildContext(messages);

    expect(result.summary).toBeUndefined();
    expect(result.recentMessages.length).toBe(5);
    expect(result.recentMessages).toEqual(messages);
  });

  it("does not compact when exactly at limit", () => {
    const messages = makeMessages(10);

    const result = buildContext(messages);

    expect(result.summary).toBeUndefined();
    expect(result.recentMessages.length).toBe(10);
  });

  it("compacts old messages when over limit", () => {
    const messages = makeMessages(12);

    const result = buildContext(messages);

    expect(result.summary).toBeDefined();
    expect(result.recentMessages.length).toBe(6);
  });

  it("keeps the most recent messages", () => {
    const messages = makeMessages(12);

    const result = buildContext(messages);

    const recentContents = result.recentMessages.map(
      (m) => m.content
    );

    expect(recentContents).toEqual([
      "message-7",
      "message-8",
      "message-9",
      "message-10",
      "message-11",
      "message-12",
    ]);
  });

  it("summarizes older messages deterministically", () => {
    const messages = makeMessages(12);

    const result = buildContext(messages);

    expect(result.summary).toContain("message-1");
    expect(result.summary).toContain("message-6");
    expect(result.summary).not.toContain("message-7");
  });
});
