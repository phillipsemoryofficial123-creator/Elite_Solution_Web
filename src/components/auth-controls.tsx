"use client";

import { Show, UserButton } from "@clerk/nextjs";
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
        <UserButton
          appearance={{
            elements: {
              avatarBox: "auth-avatar",
            },
          }}
        />
      </Show>
      <Link className="call" href={href}>
        {label}
      </Link>
    </div>
  );
}
