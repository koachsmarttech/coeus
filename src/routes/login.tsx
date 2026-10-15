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
    <main className="relative grid min-h-dvh place-items-center bg-bg px-6 py-12">
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

      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-line bg-surface p-6 shadow-(--shadow-card) sm:p-8">
          <div className="mb-6 flex items-center justify-center gap-3 border-b border-line pb-5">
            <span className="font-display text-2xl">Data Reporting Portal</span>
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
