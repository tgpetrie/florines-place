"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/app/login/actions";

const initialState: LoginState = {};

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(login, initialState);

  return (
    <form action={action} className="card space-y-5 p-6 sm:p-8">
      <input type="hidden" name="next" value={next} />
      <div>
        <label htmlFor="email" className="label block">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          autoFocus
          className="mt-2 w-full rounded-xl border border-sand-deep/70 bg-oyster px-4 py-3 text-ink outline-none focus:border-canal focus:ring-2 focus:ring-canal/20"
        />
      </div>
      <div>
        <label htmlFor="password" className="label block">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="mt-2 w-full rounded-xl border border-sand-deep/70 bg-oyster px-4 py-3 text-ink outline-none focus:border-canal focus:ring-2 focus:ring-canal/20"
        />
      </div>
      {state.error && (
        <p role="alert" className="rounded-xl border border-rust/25 bg-rust/8 px-4 py-3 text-sm text-rust">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-canaldeep px-5 py-3 font-bold text-oyster transition hover:bg-navy disabled:cursor-wait disabled:opacity-60"
      >
        {pending ? "Opening the door…" : "Sign in"}
      </button>
    </form>
  );
}
