"use client";

import { Show } from "@clerk/nextjs";
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
      <Show when="signed-in">
        <Link className="nav-admin" href="/admin">
          Admin Dashboard
        </Link>
      </Show>
      <Link className="call" href={href}>
        {label}
      </Link>
    </div>
  );
}
