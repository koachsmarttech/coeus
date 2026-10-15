import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { SignInGate } from "@/lib/auth/gates";
import { ThemeToggle } from "@/components/theme";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const { user, isPending } = useCurrentUserState();
  if (isPending) {
    return (
      <main className="grid min-h-dvh place-items-center bg-bg">
        <p className="font-display text-3xl tracking-tight text-ink">Data Reporting Portal</p>
      </main>
    );
  }
  if (user) return <Navigate to="/app" />;
  return <Landing />;
}

function Landing() {
  return (
    <main className="min-h-dvh bg-bg">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <span className="font-display text-2xl tracking-tight text-accent">Data Reporting Portal</span>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <SignInGate
            fallback={
              <Link
                to="/login"
                className="inline-flex h-11 items-center rounded-md bg-accent px-4 text-sm font-medium text-accent-fg"
              >
                Sign in
              </Link>
            }
          >
            <Link
              to="/app"
              className="inline-flex h-11 items-center rounded-md bg-accent px-4 text-sm font-medium text-accent-fg"
            >
              Open workspace
            </Link>
          </SignInGate>
        </div>
      </header>
      <section className="mx-auto max-w-5xl px-6 pb-20 pt-10">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted">
          Field reports, refined
        </p>
        <h1 className="mt-4 max-w-3xl font-display text-4xl leading-[1.12] tracking-tight text-ink sm:text-6xl">
          Collect. Check. Understand.
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
          Data Reporting Portal takes incident reports, inspections, and community feedback — validates every field
          — then lets analysts ask grounded questions, with the numbers calculated before the AI
          ever writes a word.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/login"
            className="inline-flex h-12 items-center gap-2 rounded-md bg-accent px-5 text-sm font-medium text-accent-fg"
          >
            Enter the workspace
            <ArrowRight className="size-4" />
          </Link>
        </div>
        <ul className="mt-16 grid gap-4 sm:grid-cols-3">
          {[
            {
              t: "Intake that refuses bad data",
              d: "Live form checks, row-by-row CSV review, duplicate detection, and a quarantine that never silently drops a record.",
            },
            {
              t: "Facts first, narration second",
              d: "Trends and outliers are computed from the database. Grok only explains what was already counted, with citations.",
            },
            {
              t: "Ask Coeus, then listen",
              d: "A permission-scoped chat with citations, small charts, and text-to-speech. Reporters only see their own filings; Ask Coeus is for Analyst and Admin.",
            },
          ].map((c) => (
            <li key={c.t} className="rounded-xl bg-surface p-5 shadow-(--shadow-card)">
              <h2 className="font-display text-lg">{c.t}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">{c.d}</p>
            </li>
          ))}
        </ul>
        <dl className="mt-12 grid gap-6 border-t border-line pt-10 sm:grid-cols-3">
          <div>
            <dt className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Reporter</dt>
            <dd className="mt-2 text-sm text-ink-soft">
              File reports and uploads. See your own status. Ask why something was held.
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Analyst</dt>
            <dd className="mt-2 text-sm text-ink-soft">
              Dashboards and briefs on AI-reviewed records only. No export, no raw pending data.
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Admin</dt>
            <dd className="mt-2 text-sm text-ink-soft">
              Users, form rules, quarantine, feeds, AI spend, and CSV export.
            </dd>
          </div>
        </dl>
      </section>
    </main>
  );
}
