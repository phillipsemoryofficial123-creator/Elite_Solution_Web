"use client";

import { SignIn } from "@clerk/nextjs";

export function SignInPanel() {
  return (
    <SignIn
      appearance={{
        elements: {
          rootBox: "auth-box",
          card: "auth-card",
        },
      }}
    />
  );
}
