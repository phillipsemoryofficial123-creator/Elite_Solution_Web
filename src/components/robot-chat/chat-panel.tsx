"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowClockwise,
  Minus,
  PaperPlaneTilt,
  SpeakerHigh,
  SpeakerSlash,
  X,
} from "@phosphor-icons/react";
import { STARTERS, type ChatMessage, type RobotMood } from "./types";

type Props = {
  messages: ChatMessage[];
  input: string;
  busy: boolean;
  error: string | null;
  mood: RobotMood;
  muted: boolean;
  reduced: boolean;
  onInput: (value: string) => void;
  onSend: (text: string) => void;
  onMinimize: () => void;
  onClose: () => void;
  onRestart: () => void;
  onToggleSound: () => void;
};

export function ChatPanel({
  messages,
  input,
  busy,
  error,
  mood,
  muted,
  reduced,
  onInput,
  onSend,
  onMinimize,
  onClose,
  onRestart,
  onToggleSound,
}: Props) {
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const showStarters = messages.length <= 1;
  const canSend = input.trim().length > 0 && !busy;

  useEffect(() => {
    const node = listRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [messages, busy]);

  useEffect(() => {
    const frame = window.setTimeout(() => inputRef.current?.focus(), 220);
    return () => window.clearTimeout(frame);
  }, []);

  function resize(node: HTMLTextAreaElement) {
    node.style.height = "0px";
    node.style.height = `${Math.min(node.scrollHeight, 120)}px`;
  }

  return (
    <motion.section
      id="ronot-panel"
      className="rw-panel"
      role="dialog"
      aria-labelledby="ronot-title"
      aria-modal="false"
      initial={reduced ? { opacity: 1 } : { opacity: 0, y: 18, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={reduced ? { opacity: 0 } : { opacity: 0, y: 14, scale: 0.98 }}
      transition={{ duration: reduced ? 0.01 : 0.42, ease: [0.22, 1, 0.36, 1] }}
      style={{ transformOrigin: "100% 100%" }}
    >
      <header className="rw-head">
        <div className="rw-identity">
          <Face mood={mood} />
          <div>
            <h2 id="ronot-title">Ronot</h2>
            <p className="rw-status">
              <span className="rw-dot" />
              {mood === "think" ? "Thinking" : mood === "speak" ? "Replying" : "Online"}
            </p>
          </div>
        </div>
        <div className="rw-tools">
          <button
            type="button"
            className="rw-icon"
            onClick={onToggleSound}
            aria-pressed={!muted}
            aria-label={muted ? "Unmute sound" : "Mute sound"}
          >
            {muted ? <SpeakerSlash size={16} /> : <SpeakerHigh size={16} />}
          </button>
          <button
            type="button"
            className="rw-icon"
            onClick={onRestart}
            aria-label="Restart conversation"
          >
            <ArrowClockwise size={16} />
          </button>
          <button
            type="button"
            className="rw-icon"
            onClick={onMinimize}
            aria-label="Minimize chat"
          >
            <Minus size={16} />
          </button>
          <button
            type="button"
            className="rw-icon"
            onClick={onClose}
            aria-label="Close and reset chat"
          >
            <X size={16} />
          </button>
        </div>
      </header>

      <div className="rw-thread" ref={listRef} aria-busy={busy}>
        {messages.map((message) => {
          const pending =
            busy &&
            message.role === "assistant" &&
            message.id === messages[messages.length - 1]?.id;
          const thinking = pending && !message.content;
          return (
            <motion.article
              key={message.id}
              className={`rw-bubble rw-bubble--${message.role}${pending && !thinking ? " is-streaming" : ""}`}
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              {thinking ? (
                <p className="rw-typing" aria-label="Ronot is thinking">
                  <i />
                  <i />
                  <i />
                </p>
              ) : (
                <p>{message.content}</p>
              )}
            </motion.article>
          );
        })}
      </div>

      <AnimatePresence>
        {showStarters ? (
          <motion.div
            className="rw-chips"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {STARTERS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => onSend(prompt)}
                disabled={busy}
              >
                {prompt}
              </button>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>

      {error ? <p className="rw-error">{error}</p> : null}

      <form
        className="rw-composer"
        onSubmit={(event) => {
          event.preventDefault();
          onSend(input);
        }}
      >
        <label className="rw-sr" htmlFor="ronot-input">
          Message
        </label>
        <textarea
          id="ronot-input"
          ref={inputRef}
          rows={1}
          value={input}
          maxLength={2000}
          placeholder="Ask about services or pricing"
          autoComplete="off"
          onChange={(event) => {
            onInput(event.target.value);
            resize(event.target);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              onSend(input);
            }
          }}
        />
        <button type="submit" className="rw-send" disabled={!canSend} aria-label="Send message">
          <PaperPlaneTilt size={18} weight="fill" />
        </button>
      </form>
      <p className="rw-legal">
        AI assistant. For a quote, <Link href="/contact">contact the team</Link>.
      </p>
    </motion.section>
  );
}

function Face({ mood }: { mood: RobotMood }) {
  return (
    <span className={`rw-face is-${mood}`} aria-hidden="true">
      <span className="rw-face-antenna" />
      <span className="rw-face-ear" />
      <span className="rw-face-ear rw-face-ear--r" />
      <span className="rw-face-eyes">
        <i />
        <i />
      </span>
      <span className="rw-face-mouth">
        <i />
        <i />
        <i />
      </span>
    </span>
  );
}
