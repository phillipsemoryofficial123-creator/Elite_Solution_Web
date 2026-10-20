export type DataBadgeStatus = "live" | "disconnected" | "sample";

const LABELS: Record<DataBadgeStatus, string> = {
  live: "Live",
  disconnected: "Disconnected",
  sample: "Sample",
};

export function DataBadge({
  status,
  className = "",
}: {
  status: DataBadgeStatus;
  className?: string;
}) {
  return (
    <span
      className={`admin-badge admin-badge--${status}${className ? ` ${className}` : ""}`}
      data-status={status}
    >
      <span className="admin-badge__dot" aria-hidden />
      {LABELS[status]}
    </span>
  );
}
