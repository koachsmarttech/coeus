import { useState } from "react";
import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { GROK_PROVIDERS, authClient, authEnabled, signIn } from "@/lib/auth/client";
import { emailAndPasswordEnabled } from "@/lib/auth/email-password";
import { SignInGate } from "@/lib/auth/gates";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  return (
    <SignInGate fallback={<LoginScreen />}>
      <Navigate to="/app" />
    </SignInGate>
  );
}

function LoginScreen() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onEmail(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error: err } = await authClient.signUp.email({
          email,
          password,
          name: name.trim() || email.split("@")[0] || "Member",
          callbackURL: "/app",
        });
        if (err) throw new Error(err.message ?? "Could not create account");
      } else {
        const { error: err } = await authClient.signIn.email({
          email,
          password,
          callbackURL: "/app",
        });
        if (err) throw new Error(err.message ?? "Could not sign in");
      }
      window.location.href = "/app";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="relative min-h-dvh bg-bg">
      {/* Green vertical bands (flag-inspired) */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-3 bg-accent sm:w-4"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-3 bg-accent sm:w-4"
        aria-hidden
      />

      <div className="absolute right-5 top-4 z-10 sm:right-8">
        <ThemeToggle />
      </div>

      <div className="mx-auto grid min-h-dvh max-w-5xl gap-10 px-6 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-10">
        {/* Brand + role flow */}
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <div>
              <p className="font-display text-3xl tracking-tight text-ink sm:text-4xl">COEUS</p>
              <p className="mt-1 text-sm font-medium text-accent">
                Field reporting · Review · Insight
              </p>
            </div>
          </div>

          <p className="max-w-md text-sm leading-relaxed text-muted">
            Collect field reports, check quality, and ask grounded questions over accepted data.
            Three clear roles keep intake separate from analysis and control.
          </p>

          <ol className="space-y-3">
            <RoleStep
              n="1"
              title="Reporter"
              body="Files incident, feedback, and site-review forms. Can upload CSV, Excel, PDF, or PowerPoint. Sees only their own filings. No chat."
            />
            <RoleStep
              n="2"
              title="Analyst"
              body="Reviews accepted records, reads briefs, and uses Ask to query the archive. Cannot change roles or quarantine queues."
            />
            <RoleStep
              n="3"
              title="Admin"
              body="Full control: quarantine, user roles, AI models, and View as to demo Reporter or Analyst flows."
            />
          </ol>

          <p className="text-xs text-faint">
            First account created on this install becomes{" "}
            <span className="font-medium text-ink-soft">Admin</span>. Admins assign Reporter and
            Analyst roles under Admin → People.
          </p>
        </div>

        {/* Auth card */}
        <div className="w-full max-w-md justify-self-center rounded-2xl border border-line bg-surface p-6 shadow-(--shadow-card) sm:p-8">
          <div className="mb-6 flex items-center justify-center gap-3 border-b border-line pb-5 lg:hidden">
            <img src="/nigeria-coat-of-arms.png" alt="" className="h-14 w-auto object-contain" />
            <span className="font-display text-2xl">COEUS</span>
          </div>

          <h1 className="font-display text-2xl tracking-tight">
            {mode === "signin" ? "Sign in" : "Create account"}
          </h1>
          <p className="mt-1 text-sm text-muted">
            {mode === "signin"
              ? "Access your desk, records, or admin tools."
              : "Password must be at least 8 characters."}
          </p>

          {authEnabled && emailAndPasswordEnabled ? (
            <>
              <form onSubmit={onEmail} className="space-y-3">
                {mode === "signup" ? (
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      autoComplete="name"
                    />
                  </div>
                ) : null}
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete={mode === "signup" ? "new-password" : "current-password"}
                  />
                </div>
                {error ? <p className="text-sm text-danger">{error}</p> : null}
                <Button type="submit" className="w-full" disabled={busy}>
                  {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
                </Button>
              </form>
              <p className="mt-4 text-center text-sm text-muted">
                {mode === "signin" ? (
                  <>
                    No account?{" "}
                    <button
                      type="button"
                      className="font-medium text-accent hover:underline"
                      onClick={() => {
                        setMode("signup");
                        setError(null);
                      }}
                    >
                      Sign up
                    </button>
                  </>
                ) : (
                  <>
                    Already registered?{" "}
                    <button
                      type="button"
                      className="font-medium text-accent hover:underline"
                      onClick={() => {
                        setMode("signin");
                        setError(null);
                      }}
                    >
                      Sign in
                    </button>
                  </>
                )}
              </p>
            </>
          ) : null}

          <p className="mt-6 text-center text-xs text-faint">
            <Link to="/" className="hover:text-muted">
              Back to home
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

function RoleStep({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <li className="flex gap-3 rounded-xl border border-line bg-surface p-3 shadow-(--shadow-card)">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-fg">
        {n}
      </span>
      <div>
        <p className="text-sm font-semibold text-ink">{title}</p>
        <p className="mt-0.5 text-xs leading-relaxed text-muted">{body}</p>
      </div>
    </li>
  );
}
