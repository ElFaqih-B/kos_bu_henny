"use client";

import {
  FormEvent,
  useState,
} from "react";

import {
  Eye,
  EyeOff,
  LockKeyhole,
  UserRound,
} from "lucide-react";

import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function submit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!username.trim() || !password) {
      setError(
        "Username dan password wajib diisi.",
      );
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "/api/admin/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            username: username.trim(),
            password,
          }),
          cache: "no-store",
        },
      );

      const data = await response
        .json()
        .catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.detail ||
            "Username atau password salah.",
        );
      }

      /*
       * Jangan ke /admin/dashboard.
       *
       * Dashboard utama kita adalah /admin.
       */
      window.location.href = "/admin";
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal masuk. Silakan coba lagi.",
      );

      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-(--cream) px-5 py-10 text-(--ink)">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-md items-center justify-center">
        <section className="w-full rounded-[10px] border border-(--line) bg-white p-6 shadow-[0_18px_50px_rgba(50,45,41,0.08)] sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-(--accent)">
            Kos Omah Subardiman
          </p>

          <h1 className="mt-3 font-(family-name:--font-fraunces) text-3xl font-semibold tracking-[-0.03em]">
            Masuk ke Admin
          </h1>

          <p className="mt-2 text-sm leading-6 text-(--stone)">
            Kelola data website dari satu
            tempat.
          </p>

          <form
            onSubmit={submit}
            className="mt-8 space-y-4"
          >
            <label className="block">
              <span className="mb-2 block text-sm font-medium">
                Username
              </span>

              <div className="relative">
                <UserRound
                  size={17}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-(--stone)"
                />

                <input
                  value={username}
                  onChange={(event) =>
                    setUsername(
                      event.target.value,
                    )
                  }
                  autoComplete="username"
                  placeholder="Username"
                  disabled={loading}
                  className="min-h-12 w-full rounded-lg border border-(--line) bg-(--cream)/35 pl-11 pr-4 text-sm outline-none transition focus:border-(--ink) focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium">
                Password
              </span>

              <div className="relative">
                <LockKeyhole
                  size={17}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-(--stone)"
                />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(event) =>
                    setPassword(
                      event.target.value,
                    )
                  }
                  autoComplete="current-password"
                  placeholder="Password"
                  disabled={loading}
                  className="min-h-12 w-full rounded-lg border border-(--line) bg-(--cream)/35 pl-11 pr-12 text-sm outline-none transition focus:border-(--ink) focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (value) => !value,
                    )
                  }
                  disabled={loading}
                  className="absolute right-1 top-1 grid size-10 place-items-center rounded-md text-(--stone) hover:text-(--ink)"
                  aria-label={
                    showPassword
                      ? "Sembunyikan password"
                      : "Tampilkan password"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
                  )}
                </button>
              </div>
            </label>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex min-h-12 w-full items-center justify-center rounded-lg bg-(--ink) px-4 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-55"
            >
              {loading
                ? "Memeriksa..."
                : "Masuk"}
            </button>
          </form>

          <p className="mt-7 text-center text-xs text-(--stone)">
            Area khusus pengelola Kos Omah
            Subardiman.
          </p>
        </section>
      </div>
    </main>
  );
}