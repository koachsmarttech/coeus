import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { getSubmission } from "@/lib/api";
import { useBootstrap } from "@/lib/bootstrap";
import { StatusBadge } from "@/components/status-badge";
import { Card, CardDesc, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { FieldDef, Submission } from "@/lib/types";

export const Route = createFileRoute("/app/records/$id")({ component: RecordDetail });

function RecordDetail() {
  const { id } = Route.useParams();
  const { viewAs } = useBootstrap();
  const [row, setRow] = useState<(Submission & { schema_fields: FieldDef[] }) | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getSubmission({ data: { id: Number(id), viewAs } })
      .then(setRow)
      .catch((e) => setError(e instanceof Error ? e.message : "Not found"));
  }, [id, viewAs]);

  if (error) {
    return (
      <Card>
        <CardTitle>Not available</CardTitle>
        <CardDesc className="mt-2">
          {error === "Not found"
            ? "This record is outside your role. Analysts cannot open pending or quarantined filings."
            : error}
        </CardDesc>
        <Link to="/app/records" className="mt-4 inline-block text-sm text-accent hover:underline">
          Back to records
        </Link>
      </Card>
    );
  }
  if (!row) return <Skeleton className="h-64" />;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link to="/app/records" className="text-sm text-muted hover:text-ink">
        ← Records
      </Link>
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-mono text-xs text-faint">#{row.id}</p>
          <h1 className="font-display text-3xl tracking-tight">{row.schema_name}</h1>
          <p className="mt-1 text-sm text-muted">
            {row.submitter_name} · {row.channel} · {new Date(row.created_at).toLocaleString()}
          </p>
        </div>
        <StatusBadge status={row.status} />
      </header>
      {row.ai_notes ? (
        <Card>
          <CardHeader>
            <div>
              <CardTitle>AI review</CardTitle>
              <CardDesc>
                {row.ai_model} {row.ai_reviewed_at ? `· ${new Date(row.ai_reviewed_at).toLocaleString()}` : null}
              </CardDesc>
            </div>
          </CardHeader>
          <p className="text-sm leading-relaxed">{row.ai_notes}</p>
        </Card>
      ) : (
        <p className="text-sm text-muted">Still in review — analysts cannot see this record yet.</p>
      )}
      {row.validation_errors?.length ? (
        <Card className="bg-danger-soft">
          <CardTitle>Held because</CardTitle>
          <ul className="mt-2 list-disc pl-5 text-sm text-danger">
            {row.validation_errors.map((e, i) => (
              <li key={i}>{e.message}</li>
            ))}
          </ul>
        </Card>
      ) : null}
      <Card>
        <CardTitle>Filed values</CardTitle>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2">
          {row.schema_fields.map((f) => (
            <div key={f.key} className={f.type === "textarea" ? "sm:col-span-2" : ""}>
              <dt className="text-xs uppercase tracking-wider text-muted">{f.label}</dt>
              <dd className="mt-1 text-sm">{formatVal(row.payload[f.key])}</dd>
            </div>
          ))}
        </dl>
      </Card>
    </div>
  );
}

function formatVal(v: unknown) {
  if (v === true) return "Yes";
  if (v === false) return "No";
  if (v === null || v === undefined || v === "") return "—";
  return String(v);
}
