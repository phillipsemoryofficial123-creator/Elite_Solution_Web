"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { WELCOME, type ChatMessage } from "./types";

function newId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function useRobotChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [live, setLive] = useState("");
  const messagesRef = useRef(messages);
  const busyRef = useRef(false);
  const genRef = useRef(0);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const reset = useCallback(() => {
    genRef.current += 1;
    abortRef.current?.abort();
    abortRef.current = null;
    busyRef.current = false;
    setBusy(false);
    setError(null);
    setInput("");
    setLive("");
    setMessages([WELCOME]);
  }, []);

  const send = useCallback(async (text: string) => {
    const content = text.trim();
    if (!content || busyRef.current) return;

    const generation = ++genRef.current;
    const assistantId = newId();
    const history = messagesRef.current
      .filter((message) => message.id !== WELCOME.id && message.content.trim())
      .concat({ id: newId(), role: "user" as const, content })
      .slice(-20);

    busyRef.current = true;
    setBusy(true);
    setError(null);
    setInput("");
    setMessages((current) => [
      ...current,
      { id: newId(), role: "user", content },
      { id: assistantId, role: "assistant", content: "" },
    ]);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          messages: history.map(({ role, content: value }) => ({
            role,
            content: value,
          })),
        }),
      });

      if (generation !== genRef.current) return;

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
        if (generation !== genRef.current) {
          await reader.cancel().catch(() => undefined);
          return;
        }
        if (done) break;
        assembled += decoder.decode(value, { stream: true });
        const next = assembled;
        setMessages((current) =>
          current.map((message) =>
            message.id === assistantId ? { ...message, content: next } : message,
          ),
        );
      }

      if (!assembled.trim()) {
        const fallback =
          "I don't have a reply for that. You can reach the team from Contact.";
        assembled = fallback;
        setMessages((current) =>
          current.map((message) =>
            message.id === assistantId
              ? { ...message, content: fallback }
              : message,
          ),
        );
      }

      setLive(assembled.slice(0, 280));
      return assembled;
    } catch (err) {
      if (generation !== genRef.current) return;
      if (err instanceof DOMException && err.name === "AbortError") return;
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
      return null;
    } finally {
      if (generation === genRef.current) {
        busyRef.current = false;
        setBusy(false);
        abortRef.current = null;
      }
    }
  }, []);

  return {
    messages,
    input,
    setInput,
    busy,
    error,
    live,
    send,
    reset,
  };
}
