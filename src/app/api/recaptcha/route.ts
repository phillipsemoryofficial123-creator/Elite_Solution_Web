import { verifyRecaptcha } from "@/lib/recaptcha";

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Confirm you are not a robot." }, { status: 400 });
  }

  const token =
    payload && typeof payload === "object" && "token" in payload
      ? payload.token
      : "";
  const ok = await verifyRecaptcha(typeof token === "string" ? token.trim() : "", request);
  if (!ok) {
    return Response.json({ error: "Confirm you are not a robot." }, { status: 400 });
  }
  return Response.json({ ok: true });
}
