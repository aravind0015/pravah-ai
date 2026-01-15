import { useState, useRef, useEffect } from "react";

// Demo bootstrap identifiers (pre-seeded in DB)
// In production, these would come from auth/session context
const DEMO_USER_ID = "0f596df2-f875-493f-9e04-e221791d8b41";
const DEMO_CONVERSATION_ID = "8990eefd-8d9f-4329-9763-93154dbf9554";

type Message = {
  role: "user" | "assistant";
  content: string;
};

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage() {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    // placeholder assistant message (for streaming)
    let assistantMessage: Message = { role: "assistant", content: "" };
    setMessages((prev) => [...prev, assistantMessage]);

    const res = await fetch(
      "http://localhost:3001/api/chat/messages/stream",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: DEMO_USER_ID,
          conversationId: DEMO_CONVERSATION_ID,
          message: userMessage.content,
        }),
      }
    );

    if (!res.body) {
      setLoading(false);
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      assistantMessage = {
        ...assistantMessage,
        content: assistantMessage.content + chunk,
      };

      setMessages((prev) => [
        ...prev.slice(0, -1),
        assistantMessage,
      ]);
    }

    setLoading(false);
  }

  return (
    <div style={styles.page}>
      <div style={styles.chat}>
        <h1 style={styles.title}>Pravah AI</h1>

        <div style={styles.messages}>
          {messages.map((msg, idx) => (
            <div
              key={idx}
              style={{
                ...styles.message,
                ...(msg.role === "user"
                  ? styles.user
                  : styles.assistant),
              }}
            >
              {msg.content}
            </div>
          ))}

          {loading && (
            <div style={{ ...styles.message, ...styles.assistant, opacity: 0.6 }}>
              Thinking…
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        <div style={styles.inputBar}>
          <textarea
            rows={2}
            placeholder="Ask something…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={styles.textarea}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <button onClick={sendMessage} style={styles.button}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#0f0f0f",
    display: "flex",
    justifyContent: "center",
  },
  chat: {
    width: "100%",
    maxWidth: "800px",
    display: "flex",
    flexDirection: "column",
    padding: "24px",
  },
  title: {
    marginBottom: "16px",
    color: "#eaeaea",
  },
  messages: {
    flex: 1,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    paddingBottom: "16px",
  },
  message: {
    maxWidth: "75%",
    padding: "12px 14px",
    borderRadius: "10px",
    lineHeight: 1.5,
    whiteSpace: "pre-wrap",
  },
  user: {
    alignSelf: "flex-end",
    background: "#2563eb",
    color: "#fff",
  },
  assistant: {
    alignSelf: "flex-start",
    background: "#1e1e1e",
    color: "#eaeaea",
  },
  inputBar: {
    display: "flex",
    gap: "8px",
    borderTop: "1px solid #333",
    paddingTop: "12px",
  },
  textarea: {
    flex: 1,
    background: "#1e1e1e",
    color: "#eaeaea",
    border: "1px solid #333",
    borderRadius: "8px",
    padding: "10px",
    resize: "none",
    fontSize: "14px",
  },
  button: {
    padding: "10px 16px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
};

export default App;
