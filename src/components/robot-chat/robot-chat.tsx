"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X } from "@phosphor-icons/react";
import { ChatPanel } from "./chat-panel";
import { useRobotChat } from "./use-robot-chat";
import { useSound } from "./use-sound";
import type { RobotMood } from "./types";
import "./robot-chat.css";

function RobotPlaceholder() {
  return (
    <div className="rw-fallback" aria-hidden="true">
      <span className="rw-fallback-glow" />
      <span className="rw-fallback-head">
        <i />
        <i />
      </span>
    </div>
  );
}

const RobotStage = dynamic(
  () => import("./robot-stage").then((mod) => mod.RobotStage),
  {
    ssr: false,
    loading: () => <RobotPlaceholder />,
  },
);

const SPLASH_KEY = "elite-splash-seen";

export function RobotChat() {
  const reduced = useReducedMotion() ?? false;
  const chat = useRobotChat();
  const sound = useSound();
  const launchRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [hello, setHello] = useState(false);
  const [greet, setGreet] = useState(false);
  const [hovered, setHovered] = useState(false);
  const replied = useRef(false);

  useEffect(() => {
    let splashWait = 400;
    try {
      if (window.sessionStorage.getItem(SPLASH_KEY) !== "1") splashWait = 3200;
    } catch {
      splashWait = 400;
    }

    const helloTimer = window.setTimeout(() => setHello(true), splashWait);

    if (reduced) return () => window.clearTimeout(helloTimer);

    const greetTimer = window.setTimeout(() => setGreet(true), splashWait);
    const greetEnd = window.setTimeout(() => setGreet(false), splashWait + 2600);
    return () => {
      window.clearTimeout(helloTimer);
      window.clearTimeout(greetTimer);
      window.clearTimeout(greetEnd);
    };
  }, [reduced]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setHello(true);
        setOpen(false);
        launchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const awaiting = chat.busy && chat.messages.at(-1)?.content === "";
  const mood: RobotMood = awaiting
    ? "think"
    : chat.busy
      ? "speak"
      : hovered
        ? "hover"
        : greet
          ? "greet"
          : "idle";

  function dismissHello() {
    setHello(false);
  }

  function openChat() {
    setHello(false);
    setOpen(true);
    sound.play("open");
  }

  function minimize() {
    setHello(true);
    setOpen(false);
    launchRef.current?.focus();
  }

  function closeChat() {
    chat.reset();
    setHello(true);
    setOpen(false);
    launchRef.current?.focus();
  }

  async function send(text: string) {
    setHello(false);
    if (!open) setOpen(true);
    replied.current = false;
    sound.play("send");
    const reply = await chat.send(text);
    if (reply && !replied.current) {
      replied.current = true;
      sound.play("reply");
    }
  }

  return (
    <div className={`rw${open ? " is-open" : ""}`}>
      <div className="rw-sr" aria-live="polite">
        {chat.live}
      </div>

      <AnimatePresence>
        {open ? (
          <ChatPanel
            messages={chat.messages}
            input={chat.input}
            busy={chat.busy}
            error={chat.error}
            mood={mood}
            muted={sound.muted}
            reduced={reduced}
            onInput={chat.setInput}
            onSend={(text) => void send(text)}
            onMinimize={minimize}
            onClose={closeChat}
            onRestart={chat.reset}
            onToggleSound={sound.toggle}
          />
        ) : null}
      </AnimatePresence>

      <div className="rw-dock">
        <AnimatePresence>
          {!open && hello ? (
            <motion.div
              className="rw-hello"
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: 8 }}
              transition={{ duration: reduced ? 0.01 : 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <button type="button" className="rw-hello-main" onClick={openChat}>
                <span className="rw-status">
                  <span className="rw-dot" /> Online
                </span>
                <span className="rw-hello-text">Hello! I&apos;m your AI assistant.</span>
              </button>
              <button
                type="button"
                className="rw-hello-x"
                aria-label="Dismiss greeting"
                onClick={dismissHello}
              >
                <X size={12} />
              </button>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div
          className="rw-robot-home"
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
        >
          <RobotStage mood={mood} reduced={reduced} />
          <button
            ref={launchRef}
            type="button"
            className="rw-hit"
            aria-expanded={open}
            aria-controls={open ? "ronot-panel" : undefined}
            aria-label={open ? "Minimize chat" : "Open AI assistant"}
            onClick={() => (open ? minimize() : openChat())}
          />
        </div>
      </div>
    </div>
  );
}
