import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { deleteSavedView, listSavedViews, listSubmissions, saveView } from "@/lib/api";
import { useBootstrap } from "@/lib/bootstrap";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { REGIONS, type Submission, type SubmissionStatus } from "@/lib/types";

type RecordsSearch = {
  region?: string;
  status?: string;
  q?: string;
};

export const Route = createFileRoute("/app/records")({
  validateSearch: (s: Record<string, unknown>): RecordsSearch => ({
    region: typeof s.region === "string" ? s.region : undefined,
    status: typeof s.status === "string" ? s.status : undefined,
    q: typeof s.q === "string" ? s.q : undefined,
  }),
  component: RecordsPage,
});

function RecordsPage() {
  const search = Route.useSearch();
  const { data, viewAs } = useBootstrap();
  const [q, setQ] = useState(search.q ?? "");
  const [qDebounced, setQDebounced] = useState(search.q ?? "");
  const [region, setRegion] = useState(search.region ?? "");
  const [status, setStatus] = useState<SubmissionStatus | "all">(
    (search.status as SubmissionStatus | "all") || "all",
  );
  const [rows, setRows] = useState<Submission[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [views, setViews] = useState<{ id: number; name: string; filters: unknown }[]>([]);
  const [viewName, setViewName] = useState("");

  useEffect(() => {
    const t = window.setTimeout(() => setQDebounced(q), 280);
    return () => window.clearTimeout(t);
  }, [q]);

  useEffect(() => {
    setLoading(true);
    listSubmissions({
      data: {
        viewAs,
        q: qDebounced || undefined,
        region: region || undefined,
        status,
        limit: 80,
      },
    })
      .then((r) => {
        setRows(r.rows);
        setTotal(r.total);
      })
      .finally(() => setLoading(false));
  }, [viewAs, qDebounced, region, status]);

  useEffect(() => {
    listSavedViews()
      .then((list) => setViews(list))
      .catch(() => undefined);
  }, []);

  const role = data?.effectiveRole;

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">
          {role === "submitter" ? "Your filings" : "Refined records"}
        </p>
        <h1 className="mt-1 font-display text-3xl tracking-tight">Records</h1>
        <p className="mt-2 text-sm text-muted">
          {role === "analyst"
            ? "Analysts only see filings that have completed review. Pending and raw records are out of reach."
            : role === "submitter"
              ? "You can see the status of your own submissions, including anything still processing."
              : "Admins can inspect every state, including quarantine."}
        </p>
      </header>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          placeholder="Search state, LGA, notes, name…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="sm:max-w-xs"
        />
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="h-11 rounded-md border border-line bg-surface px-3 text-sm"
        >
          <option value="">All regions</option>
          {REGIONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        {role !== "analyst" ? (
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as SubmissionStatus | "all")}
            className="h-11 rounded-md border border-line bg-surface px-3 text-sm"
          >
            <option value="all">All statuses</option>
            <option value="accepted">Accepted</option>
            <option value="pending_review">Pending</option>
            <option value="quarantined">Quarantined</option>
            <option value="rejected">Rejected</option>
          </select>
        ) : null}
      </div>
      {role !== "submitter" ? (
        <div className="flex flex-wrap items-center gap-2">
          {views.map((v) => (
            <button
              key={v.id}
              type="button"
              className="inline-flex h-9 items-center gap-2 rounded-full bg-bg-warm px-3 text-xs"
              onClick={() => {
                const f = (typeof v.filters === "string" ? JSON.parse(v.filters) : v.filters) as {
                  q?: string;
                  region?: string;
                  status?: string;
                };
                setQ(f.q ?? "");
                setRegion(f.region ?? "");
                setStatus((f.status as SubmissionStatus | "all") || "all");
              }}
            >
              {v.name}
              <span
                role="button"
                tabIndex={0}
                className="text-faint hover:text-danger"
                onClick={(e) => {
                  e.stopPropagation();
                  void deleteSavedView({ data: { id: v.id } }).then(() =>
                    setViews((list) => list.filter((x) => x.id !== v.id)),
                  );
                }}
              >
                ×
              </span>
            </button>
          ))}
          <form
            className="flex gap-2"
            onSubmit={async (e) => {
              e.preventDefault();
              if (!viewName.trim()) return;
              await saveView({
                data: {
                  name: viewName,
                  filters: { q: qDebounced, region, status },
                },
              });
              setViewName("");
              setViews(await listSavedViews());
              toast.success("View saved");
            }}
          >
            <Input
              value={viewName}
              onChange={(e) => setViewName(e.target.value)}
              placeholder="Save this view…"
              className="h-9 w-40"
            />
            <Button type="submit" size="sm" variant="secondary">
              Save
            </Button>
          </form>
        </div>
      ) : null}
      <p className="text-xs text-faint tabular-nums">{total} matching</p>
      {loading ? (
        <Skeleton className="h-64" />
      ) : rows.length === 0 ? (
        <p className="text-sm text-muted">No records in this view.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl bg-surface shadow-[var(--shadow-card)]">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-line text-xs uppercase tracking-wider text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">ID</th>
                <th className="px-4 py-3 font-medium">Form</th>
                <th className="px-4 py-3 font-medium">Region</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">When</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-line/70 last:border-0">
                  <td className="px-4 py-3 font-mono text-xs">
                    <Link to="/app/records/$id" params={{ id: String(r.id) }} className="text-accent hover:underline">
                      #{r.id}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{r.schema_name}</td>
                  <td className="px-4 py-3">{r.region ?? "—"}</td>
                  <td className="px-4 py-3">{r.category ?? "—"}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="px-4 py-3 text-muted tabular-nums">
                    {new Date(r.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
