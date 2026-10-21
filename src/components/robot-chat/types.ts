export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
};

export type RobotMood = "idle" | "greet" | "hover" | "think" | "speak";

export const STARTERS = [
  "What services do you offer?",
  "How does pricing work?",
  "I need bookkeeping help",
  "Book a discovery call",
] as const;

export const WELCOME: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Hello. I'm Ronot, the assistant for Elite Solutions. Ask about services, pricing, or how to get started.",
};
