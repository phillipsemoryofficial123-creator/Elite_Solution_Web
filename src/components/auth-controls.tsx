import Link from "next/link";

export function GetStartedMenu({
  label,
  href,
  className = "",
}: {
  label: string;
  href: string;
  className?: string;
}) {
  return (
    <div className={`get-started ${className}`.trim()}>
      <Link className="call" href={href}>
        {label}
      </Link>
    </div>
  );
}
