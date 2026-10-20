import Groq from "groq-sdk";
import { z } from "zod";
import { RONOT_SYSTEM_PROMPT } from "@/lib/chat/system-prompt";
import { rateLimit } from "@/lib/seo/rate-limit";

export const runtime = "nodejs";

const PREFERRED_GROQ_MODELS = [
  "llama-3.3-70b-versatile",
  "openai/gpt-oss-20b",
  "openai/gpt-oss-120b",
  "llama-3.1-8b-instant",
  "gemma2-9b-it",
] as const;

type ChatTurn = { role: "user" | "assistant"; content: string };

let cachedModel: string | null = null;

function isModelMissing(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return /model_not_found|does not exist|do not have access/i.test(message);
}

async function resolveGroqModel(groq: Groq): Promise<string[]> {
  if (cachedModel) return [cachedModel, ...PREFERRED_GROQ_MODELS];

  try {
    const listed = await groq.models.list();
    const ids = (listed.data ?? []).map((model) => model.id);
    const preferred = PREFERRED_GROQ_MODELS.filter((id) => ids.includes(id));
    return [...new Set([...preferred, ...ids, ...PREFERRED_GROQ_MODELS])];
  } catch {
    return [...PREFERRED_GROQ_MODELS];
  }
}

async function createGroqStream(groq: Groq, messages: ChatTurn[]) {
  const candidates = await resolveGroqModel(groq);
  let lastError: unknown;

  for (const model of candidates) {
    try {
      const stream = await groq.chat.completions.create({
        model,
        temperature: 0.5,
        max_tokens: 500,
        stream: true,
        messages: [
          { role: "system", content: RONOT_SYSTEM_PROMPT },
          ...messages,
        ],
      });
      cachedModel = model;
      return stream;
    } catch (error) {
      lastError = error;
      if (!isModelMissing(error)) throw error;
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("No available Groq chat model.");
}

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1).max(4000),
});

const bodySchema = z.object({
  messages: z.array(messageSchema).min(1).max(24),
});

function clientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "local"
  );
}

export async function POST(request: Request) {
  const limited = rateLimit(`chat:${clientIp(request)}`, 20, 60_000);
  if (!limited.ok) {
    return Response.json(
      { error: "Please wait a moment before sending another message." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil(limited.retryAfterMs / 1000)),
        },
      },
    );
  }

  const apiKey = process.env.GROQ_API_KEY?.trim();
  if (!apiKey) {
    return Response.json(
      { error: "Ronot is not connected yet. Add GROQ_API_KEY and restart the server." },
      { status: 503 },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Send a valid message." }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(payload);
  if (!parsed.success) {
    return Response.json({ error: "Send a valid conversation." }, { status: 400 });
  }

  const groq = new Groq({ apiKey });

  try {
    const stream = await createGroqStream(groq, parsed.data.messages);

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content;
            if (text) controller.enqueue(encoder.encode(text));
          }
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Ronot lost the connection.";
          controller.enqueue(encoder.encode(`\n\n${message}`));
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error(
      "Ronot Groq error",
      error instanceof Error ? error.message : "request failed",
    );
    return Response.json(
      { error: "Ronot could not reply just now. Try again in a moment." },
      { status: 502 },
    );
  }
}
