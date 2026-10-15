import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { submitCsv, submitForm } from "@/lib/api";
import { JsonObject } from "@/lib/types";
import { useBootstrap } from "@/lib/bootstrap";
import { DynamicForm } from "@/components/dynamic-form";
import { Button } from "@/components/ui/button";
import { Card, CardDesc, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/submit")({ component: SubmitPage });

const ACCEPT =
  ".csv,.xlsx,.xls,.pdf,.pptx,.ppt,text/csv,application/pdf,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.ms-powerpoint";

function sheetToCsv(rows: unknown[][]): string {
  return rows
    .map((row) =>
      row
        .map((cell) => {
          const s = cell == null ? "" : String(cell);
          if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
          return s;
        })
        .join(","),
    )
    .join("\n");
}

async function fileToCsvOrDocument(
  file: File,
): Promise<{ kind: "csv"; csv: string } | { kind: "document"; name: string; text: string }> {
  const name = file.name.toLowerCase();
  if (name.endsWith(".csv") || file.type === "text/csv") {
    return { kind: "csv", csv: await file.text() };
  }
  if (name.endsWith(".xlsx") || name.endsWith(".xls")) {
    try {
      const XLSX = await import("xlsx");
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf, { type: "array" });
      const sheet = wb.Sheets[wb.SheetNames[0]!];
      if (!sheet) throw new Error("Workbook has no sheets");
      const rows = XLSX.utils.sheet_to_json<(string | number | boolean | null)[]>(sheet, {
        header: 1,
        defval: "",
      });
      return { kind: "csv", csv: sheetToCsv(rows as unknown[][]) };
    } catch (e) {
      throw new Error(
        e instanceof Error && e.message.includes("Failed to fetch")
          ? "Install the xlsx package (npm install xlsx) to upload Excel files."
          : e instanceof Error
            ? e.message
            : "Could not read Excel file",
      );
    }
  }
  if (name.endsWith(".pdf") || name.endsWith(".pptx") || name.endsWith(".ppt")) {
    // Binary office/pdf: create a single document narrative the form pipeline can accept.
    // Full text extraction would need extra native deps; we capture filename + size for intake.
    const text =
      `Document upload: ${file.name} (${Math.round(file.size / 1024)} KB, type ${file.type || "unknown"}). ` +
      `Structured fields were auto-filled for intake; replace description details after open if needed. ` +
      `Original file retained by the submitter outside this system unless a document store is configured.`;
    return { kind: "document", name: file.name, text };
  }
  throw new Error(
    "Unsupported file type. Use CSV, Excel (.xlsx/.xls), PDF, or PowerPoint (.pptx/.ppt).",
  );
}

function SubmitPage() {
  const { data, viewAs } = useBootstrap();
  const schemas = data?.schemas.filter((s) => s.is_active) ?? [];
  const [schemaId, setSchemaId] = useState(schemas[0]?.id);
  const schema = schemas.find((s) => s.id === schemaId) ?? schemas[0];
  const [tab, setTab] = useState<"form" | "upload">("form");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [batch, setBatch] = useState<{
    accepted: number;
    quarantined: number;
    total: number;
    report: { row: number; status: string; errors: { field: string; message: string }[] }[];
  } | null>(null);

  if (data?.effectiveRole !== "submitter") {
    return (
      <Card>
        <CardTitle>Submitter view required</CardTitle>
        <CardDesc className="mt-2">
          Filing is limited to the submitter role. If you are an admin, switch View as to Submitter.
        </CardDesc>
      </Card>
    );
  }

  if (!schema) return <p className="text-sm text-muted">No forms configured.</p>;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <header>
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Intake</p>
        <h1 className="mt-1 font-display text-3xl tracking-tight">New report</h1>
      </header>
      <div className="flex flex-wrap gap-2">
        {schemas.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => {
              setSchemaId(s.id);
              setResult(null);
              setBatch(null);
            }}
            className={cn(
              "h-10 rounded-full px-3 text-sm",
              s.id === schema.id
                ? "bg-ink text-accent-fg"
                : "bg-surface text-ink-soft shadow-[var(--shadow-card)]",
            )}
          >
            {s.name}
          </button>
        ))}
      </div>
      <p className="text-sm text-muted">{schema.description}</p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setTab("form")}
          className={cn(
            "h-10 rounded-md px-3 text-sm",
            tab === "form" ? "bg-accent-soft text-accent" : "text-muted",
          )}
        >
          Form
        </button>
        <button
          type="button"
          onClick={() => setTab("upload")}
          className={cn(
            "h-10 rounded-md px-3 text-sm",
            tab === "upload" ? "bg-accent-soft text-accent" : "text-muted",
          )}
        >
          File upload
        </button>
      </div>

      {tab === "form" ? (
        <Card>
          <DynamicForm
            schema={schema}
            submitting={busy}
            onSubmit={async (payload) => {
              setBusy(true);
              setResult(null);
              try {
                const res = await submitForm({
                  data: { schema_id: schema.id, payload, viewAs },
                });
                setResult(`Filed as #${res.id} (${res.status}).`);
                toast.success(res.status === "accepted" ? "Accepted" : "Held for review");
              } catch (err) {
                toast.error(err instanceof Error ? err.message : "Submit failed");
              } finally {
                setBusy(false);
              }
            }}
          />
        </Card>
      ) : (
        <Card>
          <CardTitle>Upload a file</CardTitle>
          <CardDesc className="mt-2">
            CSV or Excel for many rows at once. PDF or PowerPoint becomes a single document report
            under this form. Column headers should match field keys (see sample CSV).
          </CardDesc>
          <a
            href="/samples/incident-sample.csv"
            className="mt-3 inline-block text-sm text-accent hover:underline"
            download
          >
            Download sample CSV
          </a>
          <input
            type="file"
            className="mt-4 block w-full text-sm"
            accept={ACCEPT}
            disabled={busy}
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setBusy(true);
              setBatch(null);
              setResult(null);
              try {
                const parsed = await fileToCsvOrDocument(file);
                if (parsed.kind === "csv") {
                  const res = await submitCsv({
                    data: { schema_id: schema.id, csv: parsed.csv, viewAs },
                  });
                  setBatch(res);
                  toast.success(`${res.accepted} accepted, ${res.quarantined} quarantined`);
                } else {
                  const today = new Date().toISOString().slice(0, 10);
                  const payload: JsonObject = {
                    occurred_at: today,
                    collected_at: today,
                    inspected_at: today,
                    region: "Other",
                    site: parsed.name.slice(0, 80),
                    category: "Other",
                    topic: "Other",
                    severity: "medium",
                    people_affected: 0,
                    satisfaction: 3,
                    overall_score: 5,
                    issues_found: 0,
                    hazards_found: 0,
                    outcome: "conditional",
                    status: "pending_review",
                    would_recommend: "unsure",
                    description: parsed.text,
                    comments: parsed.text,
                    notes: parsed.text,
                    follow_up_needed: true,
                    follow_up_notes: `Review uploaded document: ${parsed.name}`,
                  };
                  const res = await submitForm({
                    data: { schema_id: schema.id, payload, viewAs },
                  });
                  setResult(`Document filed as #${res.id} (${res.status}).`);
                  toast.success(
                    res.status === "accepted" ? "Document accepted" : "Document held for review",
                  );
                }
              } catch (err) {
                toast.error(err instanceof Error ? err.message : "Upload failed");
              } finally {
                setBusy(false);
                e.target.value = "";
              }
            }}
          />
          {busy ? <p className="mt-3 text-sm text-muted">Processing file…</p> : null}
        </Card>
      )}

      {result ? (
        <p className="text-sm text-ink-soft">
          {result}{" "}
          <Link to="/app/records" className="text-accent hover:underline">
            View records
          </Link>
        </p>
      ) : null}

      {batch ? (
        <Card>
          <CardTitle>
            {batch.accepted} accepted · {batch.quarantined} quarantined · {batch.total} rows
          </CardTitle>
          <ul className="mt-3 max-h-56 space-y-1 overflow-y-auto text-sm">
            {batch.report
              .filter((r) => r.status !== "accepted")
              .map((r) => (
                <li key={r.row} className="text-danger">
                  Row {r.row}: {r.errors.map((e) => e.message).join(" ")}
                </li>
              ))}
          </ul>
          {batch.quarantined > 0 ? (
            <Button
              className="mt-3"
              variant="secondary"
              onClick={() => {
                const lines = ["row,status,errors"];
                for (const r of batch.report) {
                  lines.push(
                    `${r.row},${r.status},"${r.errors
                      .map((e) => e.message)
                      .join("; ")
                      .replace(/"/g, '""')}"`,
                  );
                }
                const blob = new Blob([lines.join("\n")], { type: "text/csv" });
                const a = document.createElement("a");
                a.href = URL.createObjectURL(blob);
                a.download = "Coeus-upload-report.csv";
                a.click();
              }}
            >
              Download error report
            </Button>
          ) : null}
        </Card>
      ) : null}
    </div>
  );
}
