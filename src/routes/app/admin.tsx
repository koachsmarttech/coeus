import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  addSchemaField,
  exportSubmissions,
  ingestFeed,
  listAudit,
  listMembers,
  setMemberRole,
  toggleFieldRequired,
} from "@/lib/api";
import { useBootstrap } from "@/lib/bootstrap";
import { Button } from "@/components/ui/button";
import { Card, CardDesc, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";

import { type FieldDef, type Profile, type Role } from "@/lib/types";

export const Route = createFileRoute("/app/admin")({ component: AdminPage });

function AdminPage() {
  const { data, reload } = useBootstrap();
  const [members, setMembers] = useState<Profile[]>([]);
  const [audit, setAudit] = useState<
    { id: number; actor_id: string | null; action: string; entity_type: string | null; created_at: string }[]
  >([]);


  useEffect(() => {
    if (data?.profile.role !== "admin") return;
    void listMembers().then(setMembers).catch(() => undefined);
    void listAudit().then(setAudit).catch(() => undefined);

  }, [data?.profile.role]);

  if (data?.profile.role !== "admin") {
    return <p className="text-sm text-muted">Admin only.</p>;
  }



  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Control</p>
        <h1 className="mt-1 font-display text-3xl tracking-tight">Admin</h1>
      </header>



      <Card>
        <CardHeader>
          <div>
            <CardTitle>People</CardTitle>
            <CardDesc>First signed-in person becomes Admin. Assign Analyst or Reporter from here.</CardDesc>
          </div>
        </CardHeader>
        <ul className="divide-y divide-line">
          {members.map((m) => (
            <li key={m.user_id} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <div>
                <p className="text-sm font-medium">{m.name ?? m.user_id.slice(0, 8)}</p>
                <p className="text-xs text-faint">{m.email ?? m.user_id}</p>
              </div>
              <select
                value={m.role}
                className="h-11 rounded-md border border-line bg-surface px-3 text-sm"
                onChange={async (e) => {
                  await setMemberRole({ data: { user_id: m.user_id, role: e.target.value as Role } });
                  toast.success("Role updated");
                  setMembers(await listMembers());
                  reload();
                }}
              >
                <option value="submitter">Reporter</option>
                <option value="analyst">Analyst</option>
                <option value="admin">Admin</option>
              </select>
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Form schemas</CardTitle>
            <CardDesc>Toggle required fields or add a new one. Version increments on every change.</CardDesc>
          </div>
        </CardHeader>
        <div className="space-y-6">
          {data.schemas.map((s) => (
            <SchemaEditor key={s.id} schema={s} onChange={reload} />
          ))}
        </div>
      </Card>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Automated feed</CardTitle>
            <CardDesc>
              Paste a JSON array of objects (keys matching field names) or CSV. Invalid rows go to
              quarantine — nothing is dropped.
            </CardDesc>
          </div>
        </CardHeader>
        <FeedIngest schemas={data.schemas} />
      </Card>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Export</CardTitle>
            <CardDesc>CSV of all filings. Analysts cannot export.</CardDesc>
          </div>
          <Button
            variant="secondary"
            onClick={async () => {
              const res = await exportSubmissions({ data: { status: "all" } });
              const blob = new Blob([res.csv], { type: "text/csv" });
              const a = document.createElement("a");
              a.href = URL.createObjectURL(blob);
              a.download = res.filename;
              a.click();
              toast.success("Export ready");
            }}
          >
            Download CSV
          </Button>
        </CardHeader>
      </Card>

      <Card>
        <CardTitle>Audit trail</CardTitle>
        <ul className="mt-3 space-y-2 text-sm">
          {audit.map((e) => (
            <li key={e.id} className="flex justify-between gap-3 text-muted">
              <span>
                {e.action} {e.entity_type}
              </span>
              <span className="tabular-nums text-faint">{new Date(e.created_at).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

function SchemaEditor({
  schema,
  onChange,
}: {
  schema: { id: number; name: string; version: number; fields: FieldDef[] };
  onChange: () => void;
}) {
  const [key, setKey] = useState("");
  const [label, setLabel] = useState("");

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <h3 className="font-medium">{schema.name}</h3>
        <span className="text-xs text-faint">v{schema.version}</span>
      </div>
      <ul className="space-y-1.5">
        {schema.fields.map((f) => (
          <li key={f.key} className="flex items-center justify-between gap-2 rounded-md bg-bg px-3 py-2 text-sm">
            <span>
              {f.label} <span className="font-mono text-xs text-faint">{f.key}</span>
            </span>
            <label className="flex items-center gap-2 text-xs text-muted">
              Required
              <input
                type="checkbox"
                checked={Boolean(f.required)}
                onChange={async (e) => {
                  await toggleFieldRequired({
                    data: { schema_id: schema.id, key: f.key, required: e.target.checked },
                  });
                  onChange();
                }}
              />
            </label>
          </li>
        ))}
      </ul>
      <form
        className="mt-3 flex flex-col gap-2 sm:flex-row"
        onSubmit={async (e) => {
          e.preventDefault();
          if (!key || !label) return;
          await addSchemaField({
            data: {
              schema_id: schema.id,
              field: { key, label, type: "text", required: false },
            },
          });
          setKey("");
          setLabel("");
          toast.success("Field added");
          onChange();
        }}
      >
        <div className="flex-1 space-y-1">
          <Label htmlFor={`k-${schema.id}`}>New key</Label>
          <Input id={`k-${schema.id}`} value={key} onChange={(e) => setKey(e.target.value)} placeholder="weather" />
        </div>
        <div className="flex-1 space-y-1">
          <Label htmlFor={`l-${schema.id}`}>Label</Label>
          <Input id={`l-${schema.id}`} value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Weather notes" />
        </div>
        <Button type="submit" variant="secondary" className="sm:mt-6">
          Add field
        </Button>
      </form>
    </div>
  );
}

function FeedIngest({ schemas }: { schemas: { id: number; name: string }[] }) {
  const [schemaId, setSchemaId] = useState(schemas[0]?.id);
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);

  return (
    <form
      className="space-y-3"
      onSubmit={async (e) => {
        e.preventDefault();
        if (!schemaId || !body.trim()) return;
        setBusy(true);
        try {
          const format = body.trim().startsWith("[") ? "json" : "csv";
          const res = await ingestFeed({ data: { schema_id: schemaId, body, format } });
          toast.success(`${res.accepted} accepted, ${res.quarantined} quarantined`);
          setBody("");
        } catch (err) {
          toast.error(err instanceof Error ? err.message : "Feed failed");
        } finally {
          setBusy(false);
        }
      }}
    >
      <label className="block text-sm">
        Form
        <select
          value={schemaId}
          onChange={(e) => setSchemaId(Number(e.target.value))}
          className="mt-1 h-11 w-full rounded-md border border-line bg-surface px-3 text-sm"
        >
          {schemas.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </label>
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder='[{"region":"South-West","state":"Lagos","election_year":"2023",...}] or CSV'
        className="min-h-32 w-full rounded-lg border border-line bg-surface px-3 py-2 font-mono text-xs"
      />
      <Button type="submit" disabled={busy || !body.trim()}>
        {busy ? "Checking…" : "Ingest feed"}
      </Button>
    </form>
  );
}
