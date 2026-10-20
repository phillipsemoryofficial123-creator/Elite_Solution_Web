"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import "./ronot-chat.css";

type ChatRole = "user" | "assistant";

type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
};

const STARTERS = [
  "What services do you offer?",
  "How does pricing work?",
  "I need bookkeeping help",
  "Book a discovery call",
];

function newId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function RonotChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hi, I’m Ronot — Elite Solutions’ concierge. Ask about accounting, tax, websites, SEO, or how to get started.",
    },
  ]);

  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const node = listRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [messages, open, busy]);

  useEffect(() => {
    if (!open) return;
    const frame = window.setTimeout(() => inputRef.current?.focus(), 180);
    return () => window.clearTimeout(frame);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const canSend = useMemo(
    () => input.trim().length > 0 && !busy,
    [input, busy],
  );

  async function send(text: string) {
    const content = text.trim();
    if (!content || busy) return;

    const history = messages
      .filter((message) => message.id !== "welcome")
      .concat({ id: newId(), role: "user", content });

    const assistantId = newId();
    setMessages([
      ...messages,
      { id: newId(), role: "user", content },
      { id: assistantId, role: "assistant", content: "" },
    ]);
    setInput("");
    setBusy(true);
    setError(null);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history.map(({ role, content: value }) => ({
            role,
            content: value,
          })),
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(payload?.error || "Ronot could not reply.");
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("Ronot could not stream a reply.");

      const decoder = new TextDecoder();
      let assembled = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        assembled += decoder.decode(value, { stream: true });
        const next = assembled;
        setMessages((current) =>
          current.map((message) =>
            message.id === assistantId
              ? { ...message, content: next }
              : message,
          ),
        );
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Ronot could not reply.";
      setError(message);
      setMessages((current) =>
        current.map((item) =>
          item.id === assistantId
            ? {
                ...item,
                content:
                  item.content ||
                  "I could not reach the team just now. You can also write us from Contact.",
              }
            : item,
        ),
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={`ronot${open ? " is-open" : ""}`}>
      {open ? (
        <section
          className="ronot-panel"
          role="dialog"
          aria-labelledby="ronot-title"
          aria-modal="false"
        >
          <header className="ronot-head">
            <div className="ronot-identity">
              <RonotAvatar pulse />
              <div>
                <p className="ronot-kicker">Elite Solutions</p>
                <h2 id="ronot-title">Ronot</h2>
                <p className="ronot-status">
                  <span className="ronot-dot" /> Online concierge
                </p>
              </div>
            </div>
            <button
              type="button"
              className="ronot-icon-btn"
              onClick={() => setOpen(false)}
              aria-label="Close Ronot"
            >
              ×
            </button>
          </header>

          <div className="ronot-thread" ref={listRef}>
            {messages.map((message) => (
              <article
                key={message.id}
                className={`ronot-bubble ronot-bubble--${message.role}`}
              >
                {message.role === "assistant" ? (
                  <RonotAvatar compact />
                ) : null}
                <p>
                  {message.content || (busy ? "Thinking…" : "")}
                </p>
              </article>
            ))}
            {error ? <p className="ronot-error">{error}</p> : null}
          </div>

          {messages.length < 3 ? (
            <div className="ronot-stars">
              {STARTERS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => void send(prompt)}
                  disabled={busy}
                >
                  {prompt}
                </button>
              ))}
            </div>
          ) : null}

          <form
            className="ronot-composer"
            onSubmit={(event) => {
              event.preventDefault();
              void send(input);
            }}
          >
            <textarea
              ref={inputRef}
              value={input}
              rows={1}
              maxLength={2000}
              placeholder="Ask Ronot anything…"
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  void send(input);
                }
              }}
            />
            <button type="submit" disabled={!canSend} aria-label="Send message">
              Send
            </button>
          </form>
          <p className="ronot-legal">
            AI assistant. For a quote,{" "}
            <Link href="/contact">contact the team</Link>.
          </p>
        </section>
      ) : null}

      <button
        type="button"
        className="ronot-launch"
        aria-expanded={open}
        aria-controls={open ? "ronot-title" : undefined}
        onClick={() => setOpen((value) => !value)}
      >
        <RonotAvatar pulse={!open} />
        <span>
          <strong>Ronot</strong>
          <small>{open ? "Hide chat" : "Ask Elite"}</small>
        </span>
      </button>
    </div>
  );
}

function RonotAvatar({
  compact = false,
  pulse = false,
}: {
  compact?: boolean;
  pulse?: boolean;
}) {
  return (
    <span
      className={`ronot-face${compact ? " is-compact" : ""}${pulse ? " is-live" : ""}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 64 64" fill="none">
        <rect x="10" y="16" width="44" height="36" rx="14" fill="#1F2E5D" />
        <rect x="10" y="16" width="44" height="36" rx="14" stroke="#F3D77A" strokeWidth="2" />
        <circle cx="32" cy="10" r="3" fill="#C9A227" />
        <path d="M32 13v5" stroke="#C9A227" strokeWidth="2" />
        <circle cx="24" cy="32" r="5" fill="#7FA1E6" />
        <circle cx="40" cy="32" r="5" fill="#7FA1E6" />
        <circle cx="24" cy="32" r="2" fill="#0C1330" />
        <circle cx="40" cy="32" r="2" fill="#0C1330" />
        <path d="M26 43h12" stroke="#F3D77A" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </span>
  );
}
