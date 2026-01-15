type Message = {
  role: "user" | "system";
  content: string;
};

const MAX_MESSAGES = 10;
const KEEP_LAST = 6;

export function buildContext(messages: Message[]): {
  summary?: string;
  recentMessages: Message[];
} {
  if (messages.length <= MAX_MESSAGES) {
    return {
      recentMessages: messages,
    };
  }

  const old = messages.slice(0, messages.length - KEEP_LAST);
  const recent = messages.slice(-KEEP_LAST);

  return {
    summary: `Previous context: ${old
      .map((m) => m.content)
      .join(" | ")}`,
    recentMessages: recent,
  };
}
