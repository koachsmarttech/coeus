import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ClipboardList,
  FileUp,
  MessageSquare,
  Settings2,
  ShieldAlert,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { getDashboard, listSubmissions, listSummaries, type DashboardData } from "@/lib/api";
import { useBootstrap } from "@/lib/bootstrap";
import { roleLabel } from "@/components/app-shell";
import { Card, CardDesc, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SimpleBar, VolumeChart } from "@/components/charts";
import { StatusBadge } from "@/components/status-badge";
import { AskDrawer } from "@/components/chat-panel";
import type { AiSummary, Role, Submission } from "@/lib/types";

export const Route = createFileRoute("/app/")({ component: Overview });

function Overview() {
  const { data, viewAs } = useBootstrap();
  const role = data?.effectiveRole ?? "submitter";
  if (role === "submitter") return <ReporterHome />;
  return <OpsHome viewAs={viewAs} role={role} />;
}

function RoleBanner({ role }: { role: Role }) {
  const steps = [
    { id: "submitter" as Role, label: "Reporter", hint: "File & upload" },
    { id: "analyst" as Role, label: "Analyst", hint: "Review & Ask" },
    { id: "admin" as Role, label: "Admin", hint: "Control & roles" },
  ];
  return (
    <div className="rounded-xl border border-line bg-surface p-4 shadow-(--shadow-card)">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-faint">
        Your place in the flow
      </p>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-stretch">
        {steps.map((s, i) => {
          const active = s.id === role || (role === "admin" && s.id === "admin");
          return (
            <div key={s.id} className="flex flex-1 items-center gap-2">
              <div
                className={`flex-1 rounded-lg border px-3 py-2 ${
                  active ? "border-accent bg-accent text-accent-fg" : "border-line bg-bg text-muted"
                }`}
              >
                <p className="text-sm font-semibold">{s.label}</p>
                <p className={`text-[11px] ${active ? "text-accent-fg/80" : "text-faint"}`}>
                  {s.hint}
                </p>
              </div>
              {i < steps.length - 1 ? (
                <span className="hidden text-faint sm:inline" aria-hidden>
                  →
                </span>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ReporterHome() {
  const { data, viewAs } = useBootstrap();
  const [rows, setRows] = useState<Submission[]>([]);
  const [counts, setCounts] = useState({ accepted: 0, quarantined: 0, pending: 0, rejected: 0 });
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listSubmissions({ data: { viewAs, limit: 8 } })
      .then((r) => {
        setRows(r?.rows ?? []);
        setTotal(r?.total ?? 0);
        setCounts(r?.counts ?? { accepted: 0, quarantined: 0, pending: 0, rejected: 0 });
      })
      .catch(() => {
        setRows([]);
        setTotal(0);
      })
      .finally(() => setLoading(false));
  }, [viewAs]);

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-accent">Reporter Desk</p>
        <h1 className="mt-1 font-display text-3xl tracking-tight">
          Hello{data?.profile.name ? `, ${data.profile.name.split(" ")[0]}` : ""}
        </h1>
        <p className="mt-2 max-w-xl text-sm text-muted">
          File structured reports or upload CSV, Excel, PDF, or PowerPoint. You only see your own
          filings.
        </p>
      </header>

      <RoleBanner role="submitter" />

      <section aria-labelledby="reporter-actions-title">
        <div className="mb-3">
          <h2 id="reporter-actions-title" className="text-sm font-semibold">
            Quick actions
          </h2>
          <p className="mt-1 text-xs text-muted">
            Start a filing or check the status of one you sent.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <QuickAction
            to="/app/submit"
            icon={FileUp}
            title="File a report"
            description="Complete a form or upload a supported file."
            tone="accent"
          />
          <QuickAction
            to="/app/records"
            icon={ClipboardList}
            title="View your records"
            description="See your submissions and their latest status."
          />
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        <Stat label="Your filings" value={total} hint="All reports you have sent" />
        <Stat label="Processing" value={counts.pending} hint="Waiting for review" />
        <Stat
          label="Needs a fix"
          value={counts.quarantined}
          hint="Check the status in Records"
          warn={counts.quarantined > 0}
        />
      </section>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Recent submissions</CardTitle>
            <CardDesc>
              Status stays visible to you even while analysts only see accepted rows.
            </CardDesc>
          </div>
          <Link to="/app/records" className="text-sm font-medium text-accent hover:underline">
            All records
          </Link>
        </CardHeader>
        {loading ? (
          <Skeleton className="h-32" />
        ) : rows.length === 0 ? (
          <p className="text-sm text-muted">Nothing filed yet. Start with an incident report.</p>
        ) : (
          <ul className="divide-y divide-line">
            {rows.map((r) => (
              <li key={r.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {r.schema_name} · {r.region ?? "—"}
                  </p>
                  <p className="text-xs text-faint">{new Date(r.created_at).toLocaleString()}</p>
                </div>
                <StatusBadge status={r.status} />
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

function OpsHome({
  viewAs,
  role,
}: {
  viewAs: "submitter" | "analyst" | "admin" | null;
  role: Role;
}) {
  const { data } = useBootstrap();
  const [dash, setDash] = useState<DashboardData | null>(null);
  const [brief, setBrief] = useState<AiSummary | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [askOpen, setAskOpen] = useState(false);
  const threshold = data?.settings.rejection_alert_pct ?? 10;
  const isAdmin = role === "admin";

  useEffect(() => {
    setErr(null);
    Promise.all([getDashboard({ data: { viewAs } }), listSummaries({ data: { viewAs } })])
      .then(([d, s]) => {
        setDash(d);
        // listSummaries returns AiSummary[] (not { rows })
        const list = Array.isArray(s) ? s : ((s as { rows?: AiSummary[] })?.rows ?? []);
        setBrief(list[0] ?? null);
      })
      .catch((e) => setErr(e instanceof Error ? e.message : "Failed to load dashboard"));
  }, [viewAs]);

  if (err) {
    return <p className="text-sm text-danger">{err}</p>;
  }
  if (!dash) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-3 sm:grid-cols-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  const kpis = dash.kpis ?? { total: 0, accepted: 0, quarantined: 0, pending: 0, week: 0 };
  const rejectRate =
    kpis.accepted + kpis.quarantined > 0
      ? (kpis.quarantined / (kpis.accepted + kpis.quarantined)) * 100
      : 0;

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <header className="rounded-2xl border border-line bg-surface p-5 shadow-(--shadow-card) sm:p-7">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-accent">
            {roleLabel(role)} overview
          </p>
          <h1 className="mt-2 font-display text-3xl tracking-tight">Your operations at a glance</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
            {role === "analyst"
              ? "Explore reviewed records, follow reporting trends, and turn the data into clear briefs. Your counts include accepted records only."
              : "Monitor reporting activity, review held filings, and manage portal settings. Counts reflect the records available to your role."}
          </p>
        </div>
      </header>

      {/* 2. Role flow */}
      <RoleBanner role={role} />

      <section aria-labelledby="ops-actions-title">
        <div className="mb-3">
          <h2 id="ops-actions-title" className="text-sm font-semibold">
            Quick actions
          </h2>
          <p className="mt-1 text-xs text-muted">
            {isAdmin
              ? "Review incoming data and manage portal access."
              : "Move from reviewed data to insight."}
          </p>
        </div>
        <div
          className={`grid gap-3 ${isAdmin ? "sm:grid-cols-2 xl:grid-cols-5" : "sm:grid-cols-3"}`}
        >
          {isAdmin ? (
            <QuickAction
              to="/app/quarantine"
              icon={ShieldAlert}
              title="Review quarantine"
              description="Accept or reject held filings."
              tone="warn"
            />
          ) : null}
          <QuickAction
            to="/app/records"
            icon={ClipboardList}
            title={role === "analyst" ? "Browse accepted records" : "Browse records"}
            description={
              role === "analyst"
                ? "Search records that have completed review."
                : "Search and filter portal records."
            }
          />
          <QuickAction
            to="/app/insights"
            icon={Sparkles}
            title="Open briefs"
            description="Read or generate a data summary."
          />
          <button
            type="button"
            onClick={() => setAskOpen(true)}
            className="group flex min-h-28 items-start gap-3 rounded-xl border border-line bg-surface p-4 text-left shadow-(--shadow-card) transition hover:-translate-y-0.5 hover:border-accent hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
              <MessageSquare className="size-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center justify-between gap-2 text-sm font-semibold">
                Ask Coeus{" "}
                <ArrowRight className="size-4 text-faint transition group-hover:translate-x-0.5 group-hover:text-accent" />
              </span>
              <span className="mt-1 block text-xs leading-relaxed text-muted">
                Ask questions about the available reporting data.
              </span>
            </span>
          </button>
          {isAdmin ? (
            <QuickAction
              to="/app/admin"
              icon={Settings2}
              title="Manage portal"
              description="People, forms, feed, exports, and audit trail."
              tone="accent"
            />
          ) : null}
        </div>
      </section>

      {/* 3. KPI strip */}
      <section>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-faint">
          Key counts
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Visible records" value={kpis.total} hint="In your role scope" />
          <Stat label="Accepted" value={kpis.accepted} />
          <Stat
            label="Quarantined"
            value={kpis.quarantined}
            warn={rejectRate >= threshold}
            hint={rejectRate >= threshold ? `Above ${threshold}% alert` : undefined}
          />
          <Stat label="Last 7 days" value={kpis.week} hint="New arrivals" />
        </div>
      </section>

      {/* 4. Trends */}
      <section>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-faint">Trends</h2>
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Volume</CardTitle>
              <CardDesc>Accepted vs held</CardDesc>
            </CardHeader>
            <VolumeChart data={dash.volume ?? []} />
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Region</CardTitle>
              <CardDesc>Click a zone to open Records</CardDesc>
            </CardHeader>
            <SimpleBar data={dash.byRegion ?? []} xKey="region" yKey="count" />
            <div className="mt-2 flex flex-wrap gap-2">
              {(dash.byRegion ?? []).map((r) => (
                <Link
                  key={r.region}
                  to="/app/records"
                  search={{ region: r.region }}
                  className="rounded-full bg-accent-soft px-2.5 py-1 text-xs font-medium text-accent hover:bg-accent hover:text-accent-fg"
                >
                  {r.region} · {r.count}
                </Link>
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* 5. Detail cards */}
      <section>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-faint">
          Breakdown & brief
        </h2>
        <div className="grid gap-4 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Category mix</CardTitle>
            </CardHeader>
            <SimpleBar data={dash.byCategory ?? []} xKey="category" yKey="count" />
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Satisfaction</CardTitle>
              {/* <CardDesc>Community feedback, 1–5</CardDesc> */}
            </CardHeader>
            <SimpleBar
              data={(dash.satisfaction ?? []).map((s) => ({ score: `${s.score}`, count: s.count }))}
              xKey="score"
              yKey="count"
            />
          </Card>
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Latest brief</CardTitle>
                <CardDesc>
                  {brief
                    ? `${brief.model} · ${brief.confidence} confidence`
                    : "No brief yet — generate one from Insights"}
                </CardDesc>
              </div>
              <Link to="/app/insights" className="text-sm font-medium text-accent hover:underline">
                Open
              </Link>
            </CardHeader>
            <p className="line-clamp-6 text-sm leading-relaxed text-ink-soft">
              {brief?.narrative ??
                "Analysts only see records after review is complete. Generate a brief to narrate the calculated facts."}
            </p>
          </Card>
        </div>
      </section>

      {dash.anomalies?.length ? (
        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-faint">Alerts</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {dash.anomalies.map((a) => (
              <div
                key={a.title}
                className="rounded-xl border border-warn/30 bg-warn-soft p-4 text-sm"
              >
                <p className="font-semibold text-warn">{a.title}</p>
                <p className="mt-1 text-ink-soft">{a.detail}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <AskDrawer open={askOpen} onClose={() => setAskOpen(false)} role={role} viewAs={viewAs} />
    </div>
  );
}

function Stat({
  label,
  value,
  hint,
  warn,
}: {
  label: string;
  value: number | string;
  hint?: string;
  warn?: boolean;
}) {
  return (
    <div className="rounded-xl border border-line bg-surface p-4 shadow-(--shadow-card)">
      <p className="text-xs font-medium uppercase tracking-wider text-muted">{label}</p>
      <p
        className={`mt-2 font-display text-3xl tabular-nums ${warn ? "text-danger" : "text-accent"}`}
      >
        {value}
      </p>
      {hint ? <p className="mt-1 text-xs text-faint">{hint}</p> : null}
    </div>
  );
}

function QuickAction({
  to,
  icon: Icon,
  title,
  description,
  tone = "neutral",
}: {
  to: "/app/submit" | "/app/records" | "/app/insights" | "/app/quarantine" | "/app/admin";
  icon: LucideIcon;
  title: string;
  description: string;
  tone?: "neutral" | "accent" | "warn";
}) {
  const iconTone =
    tone === "warn"
      ? "bg-warn-soft text-warn"
      : tone === "accent"
        ? "bg-accent text-accent-fg"
        : "bg-accent-soft text-accent";

  return (
    <Link
      to={to}
      className="group flex min-h-28 items-start gap-3 rounded-xl border border-line bg-surface p-4 shadow-(--shadow-card) transition hover:-translate-y-0.5 hover:border-accent hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${iconTone}`}>
        <Icon className="size-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center justify-between gap-2 text-sm font-semibold">
          {title}
          <ArrowRight className="size-4 shrink-0 text-faint transition group-hover:translate-x-0.5 group-hover:text-accent" />
        </span>
        <span className="mt-1 block text-xs leading-relaxed text-muted">{description}</span>
      </span>
    </Link>
  );
}
