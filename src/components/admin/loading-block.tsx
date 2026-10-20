type LoadingBlockProps = {
  label?: string;
  className?: string;
};

export function LoadingBlock({
  label = "Loading…",
  className = "",
}: LoadingBlockProps) {
  return (
    <p
      className={`admin-loading${className ? ` ${className}` : ""}`}
      role="status"
      aria-live="polite"
    >
      {label}
    </p>
  );
}
