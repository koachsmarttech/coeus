import { useEffect, useMemo, useState } from "react";
import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  ClipboardList,
  FileUp,
  LayoutDashboard,
  Menu,
  MessageSquare,
  Settings2,
  ShieldAlert,
  Sparkles,
  X,
} from "lucide-react";
import { UserButton } from "@/lib/auth/gates";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import { getBootstrap, updateProfileMeta } from "@/lib/api";
import { BootstrapContext, type Bootstrap } from "@/lib/bootstrap";
import { useViewAs } from "@/lib/session-store";
import type { Role } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ThemeToggle } from "@/components/theme";

/** UI labels — backend role remains submitter | analyst | admin */
export function roleLabel(role: Role): string {
  if (role === "submitter") return "Reporter";
  if (role === "analyst") return "Analyst";
  return "Admin";
}

export function roleBlurb(role: Role): string {
  if (role === "submitter") return "";
  if (role === "analyst") return "";
  return "";
}

const NAV: { to: string; label: string; icon: typeof LayoutDashboard; roles: Role[] }[] = [
  { to: "/app", label: "Overview", icon: LayoutDashboard, roles: ["analyst", "admin"] },
  { to: "/app", label: "My Desk", icon: ClipboardList, roles: ["submitter"] },
  { to: "/app/submit", label: "New Report", icon: FileUp, roles: ["submitter"] },
  {
    to: "/app/records",
    label: "Records",
    icon: ClipboardList,
    roles: ["analyst", "admin", "submitter"],
  },
  { to: "/app/insights", label: "Briefs", icon: Sparkles, roles: ["analyst", "admin"] },
  { to: "/app/chat", label: "Ask Coeus", icon: MessageSquare, roles: ["analyst", "admin"] },
  { to: "/app/quarantine", label: "Quarantine", icon: ShieldAlert, roles: ["admin"] },
  { to: "/app/admin", label: "Administrator", icon: Settings2, roles: ["admin"] },
];

export function AppShell() {
  const user = useCurrentUser();
  const { viewAs, setViewAs, hydrate, hydrated } = useViewAs();
  const [data, setData] = useState<Bootstrap | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [tick, setTick] = useState(0);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!hydrated) return;
    setLoading(true);
    getBootstrap({ data: { viewAs } })
      .then((b) => {
        setData(b);
        setError(null);
        if (user?.displayName || user?.primaryEmail) {
          void updateProfileMeta({
            data: {
              name: user.displayName ?? undefined,
              email: user.primaryEmail ?? undefined,
            },
          });
        }
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, [hydrated, viewAs, user?.displayName, user?.primaryEmail, tick]);

  const role: Role = data?.effectiveRole ?? "submitter";
  const isAdmin = data?.profile.role === "admin";
  const items = useMemo(() => NAV.filter((n) => n.roles.includes(role)), [role]);

  return (
    <BootstrapContext.Provider
      value={{ data, loading, error, reload: () => setTick((n) => n + 1), viewAs, setViewAs }}
    >
      <div className="min-h-dvh bg-bg text-ink">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-ink focus:px-3 focus:py-2 focus:text-accent-fg"
        >
          Skip to content
        </a>
        <header className="sticky top-0 z-30 border-b border-line/80 bg-surface/90 backdrop-blur-md">
          <div className="mx-auto flex h-14 max-w-350 items-center gap-3 px-4">
            <button
              type="button"
              className="inline-flex size-11 items-center justify-center rounded-md lg:hidden"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </button>
            <Link to="/app" className="font-display text-xl tracking-tight text-accent">
              Data Reporting Portal
            </Link>
            <span className="hidden text-xs text-faint md:inline">Reporter → Analyst → Admin</span>
            <div className="ml-auto flex items-center gap-1 sm:gap-2">
              {isAdmin ? (
                <label className="hidden items-center gap-2 text-xs text-muted md:flex">
                  View as
                  <select
                    value={viewAs ?? data?.profile.role ?? "admin"}
                    onChange={(e) => setViewAs(e.target.value as Role)}
                    className="h-9 rounded-md border border-line bg-surface px-2 text-xs text-ink"
                  >
                    <option value="admin">Admin</option>
                    <option value="analyst">Analyst</option>
                    <option value="submitter">Reporter</option>
                  </select>
                </label>
              ) : null}
              <span className="rounded-full bg-accent px-2.5 py-1 text-[11px] font-semibold text-accent-fg">
                {roleLabel(role)}
              </span>
              <ThemeToggle />
              <UserButton />
            </div>
          </div>
        </header>
        <div className="mx-auto flex max-w-350">
          <aside className="sticky top-14 hidden h-[calc(100dvh-3.5rem)] w-56 shrink-0 border-r border-line/70 p-3 lg:block">
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-faint">
              {roleLabel(role)} menu
            </p>
            <NavList items={items} pathname={pathname} />
            {/* <div className="mt-6 rounded-lg border border-line bg-accent-soft/60 p-3 text-[11px] leading-relaxed text-ink-soft">
              {roleBlurb(role)}
            </div> */}
          </aside>
          {open ? (
            <div className="fixed inset-0 z-40 lg:hidden">
              <button
                type="button"
                className="absolute inset-0 bg-scrim"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
              />
              <div className="absolute left-0 top-0 flex h-full w-72 flex-col bg-surface p-4 shadow-xl">
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-display text-lg text-accent">Data Reporting Portal</span>
                  <button
                    type="button"
                    className="size-10"
                    onClick={() => setOpen(false)}
                    aria-label="Close"
                  >
                    <X className="size-5" />
                  </button>
                </div>
                {isAdmin ? (
                  <label className="mb-4 block text-xs text-muted">
                    View as
                    <select
                      value={viewAs ?? data?.profile.role ?? "admin"}
                      onChange={(e) => setViewAs(e.target.value as Role)}
                      className="mt-1 h-11 w-full rounded-md border border-line bg-surface px-2 text-sm text-ink"
                    >
                      <option value="admin">Admin</option>
                      <option value="analyst">Analyst</option>
                      <option value="submitter">Reporter</option>
                    </select>
                  </label>
                ) : null}
                <NavList items={items} pathname={pathname} onNavigate={() => setOpen(false)} />
                <p className="mt-4 text-xs text-muted">{roleBlurb(role)}</p>
              </div>
            </div>
          ) : null}
          <main id="main" className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
            {loading && !data ? (
              <ShellSkeleton />
            ) : error && !data ? (
              <div className="rounded-xl bg-surface p-6 shadow-(--shadow-card)">
                <p className="text-sm text-danger">{error}</p>
                <Button className="mt-3" onClick={() => setTick((n) => n + 1)}>
                  Retry
                </Button>
              </div>
            ) : (
              <Outlet />
            )}
          </main>
        </div>
      </div>
    </BootstrapContext.Provider>
  );
}

function NavList({
  items,
  pathname,
  onNavigate,
}: {
  items: typeof NAV;
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className="flex flex-col gap-1">
      {items.map((item) => {
        const active =
          item.to === "/app"
            ? pathname === "/app"
            : pathname === item.to || pathname.startsWith(`${item.to}/`);
        const Icon = item.icon;
        return (
          <Link
            key={item.to + item.label}
            to={item.to}
            onClick={onNavigate}
            className={cn(
              "flex h-11 items-center gap-2.5 rounded-md px-3 text-sm font-medium",
              active ? "bg-accent text-accent-fg" : "text-ink-soft hover:bg-bg-warm",
            )}
          >
            <Icon className="size-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function ShellSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-48" />
      <div className="grid gap-3 sm:grid-cols-3">
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
      </div>
      <Skeleton className="h-64" />
    </div>
  );
}
