import nodemailer from "nodemailer";
import { services } from "@/data/services";
import { site } from "@/data/site";

const allowedServices = new Set([
  ...services.map((service) => service.name),
  "Not sure yet",
]);

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Enter a valid message." }, { status: 400 });
  }

  if (!payload || typeof payload !== "object") {
    return Response.json({ error: "Enter a valid message." }, { status: 400 });
  }

  const fields = payload as Record<string, unknown>;
  const name = clean(fields.name);
  const email = clean(fields.email);
  const service = clean(fields.service);
  const message = clean(fields.message);

  if (name.length < 2 || name.length > 120 || /[\r\n]/.test(name)) {
    return Response.json({ error: "Enter your full name." }, { status: 400 });
  }
  if (
    email.length > 200 ||
    /[\r\n]/.test(email) ||
    !emailPattern.test(email)
  ) {
    return Response.json({ error: "Enter a valid email address." }, { status: 400 });
  }
  if (!allowedServices.has(service)) {
    return Response.json({ error: "Choose a service." }, { status: 400 });
  }
  if (message.length < 10 || message.length > 5000) {
    return Response.json({ error: "Write at least 10 characters." }, { status: 400 });
  }

  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS;
  const port = Number(process.env.SMTP_PORT || "587");
  const from = process.env.SMTP_FROM?.trim() || user;
  const to = process.env.CONTACT_TO_EMAIL?.trim() || site.email;
  if (!host || !user || !pass || !from || !Number.isInteger(port) || port < 1 || port > 65535) {
    return Response.json(
      { error: "Email is not set up yet. Please call or email us directly." },
      { status: 503 },
    );
  }

  const secure =
    process.env.SMTP_SECURE === "true" ||
    (process.env.SMTP_SECURE !== "false" && port === 465);

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    requireTLS: !secure,
    auth: { user, pass },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
  });

  try {
    await transporter.sendMail({
      from,
      to,
      replyTo: email,
      subject: `Consultation request: ${service}`,
      text: `Name: ${name}\nEmail: ${email}\nService: ${service}\n\n${message}`,
    });
  } catch (error) {
    console.error(
      "SMTP contact error",
      error instanceof Error ? error.message : "send failed",
    );
    return Response.json(
      { error: "Could not send your message. Try again in a moment." },
      { status: 502 },
    );
  }

  return Response.json({ ok: true });
}
