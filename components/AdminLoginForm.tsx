"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const incomingError = searchParams.get("error");

    if (incomingError === "unauthorized") {
      setError("Akaun ini tidak mempunyai akses admin.");
      void supabase.auth.signOut();
      return;
    }

    setError(null);
  }, [searchParams]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setSubmitting(false);
      setError("Email atau password tidak sah.");
      return;
    }

    const accessResponse = await fetch("/api/admin/access", {
      cache: "no-store",
    });

    if (!accessResponse.ok) {
      const result = (await accessResponse.json()) as { error?: string };
      await supabase.auth.signOut();
      setSubmitting(false);
      setError(
        accessResponse.status === 403
          ? "Akaun ini tidak mempunyai akses admin."
          : result.error ?? "Email atau password tidak sah.",
      );
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[2rem] border border-stone-200/90 bg-white/95 p-6 shadow-[0_20px_70px_rgba(88,69,46,0.1)] sm:p-8"
    >
      <div className="space-y-3">
        <p className="text-xs font-semibold tracking-[0.24em] text-[color:var(--color-accent-deep)] uppercase">
          Admin Login
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-stone-950">
          Admin Login
        </h1>
        <p className="max-w-lg text-sm leading-7 text-stone-600">
          Masuk untuk urus tempahan Haji Saif Homestay.
        </p>
      </div>

      {error ? (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="mt-8 space-y-5">
        <label className="block space-y-2 text-sm font-medium text-stone-700">
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3.5 outline-none transition focus:border-[color:var(--color-accent)] focus:bg-white focus:ring-4 focus:ring-[color:rgba(191,142,69,0.14)]"
            placeholder="admin@email.com"
            autoComplete="email"
            required
          />
        </label>

        <label className="block space-y-2 text-sm font-medium text-stone-700">
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3.5 outline-none transition focus:border-[color:var(--color-accent)] focus:bg-white focus:ring-4 focus:ring-[color:rgba(191,142,69,0.14)]"
            placeholder="Password"
            autoComplete="current-password"
            required
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-stone-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-400"
      >
        {submitting ? "Sedang login..." : "Login Admin"}
      </button>
    </form>
  );
}
