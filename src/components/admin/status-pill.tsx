import type { SeoPublishStatus } from "@/lib/seo/types";

type StatusPillProps = {
  status: SeoPublishStatus | string;
  className?: string;
};

const TONE: Record<string, string> = {
  published: "admin-status-pill--success",
  draft: "admin-status-pill--muted",
  scheduled: "admin-status-pill--warn",
  unpublished: "admin-status-pill--danger",
  connected: "admin-status-pill--success",
  disconnected: "admin-status-pill--warn",
  error: "admin-status-pill--danger",
  pending: "admin-status-pill--muted",
  running: "admin-status-pill--warn",
  completed: "admin-status-pill--success",
  failed: "admin-status-pill--danger",
  cancelled: "admin-status-pill--muted",
};

export function StatusPill({ status, className = "" }: StatusPillProps) {
  const tone = TONE[status] ?? "admin-status-pill--muted";
  return (
    <span
      className={`admin-status-pill ${tone}${className ? ` ${className}` : ""}`}
    >
      {status}
    </span>
  );
}
