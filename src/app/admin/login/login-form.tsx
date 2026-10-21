"use client";

import { useActionState } from "react";
import { loginAdmin, type LoginState } from "./actions";

const initial: LoginState = { error: "" };

export function AdminLoginForm() {
  const [state, formAction, pending] = useActionState(loginAdmin, initial);

  return (
    <form className="admin-login" action={formAction}>
      <div className="admin-field">
        <label htmlFor="admin-username">Username</label>
        <input id="admin-username" name="username" autoComplete="username" required />
      </div>
      <div className="admin-field">
        <label htmlFor="admin-password">Password</label>
        <input
          id="admin-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </div>
      {state.error ? <p className="admin-login__error">{state.error}</p> : null}
      <button className="admin-btn admin-btn--primary" type="submit" disabled={pending}>
        {pending ? "Signing in" : "Sign in"}
      </button>
    </form>
  );
}
