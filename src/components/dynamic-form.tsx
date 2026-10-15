import { useEffect, useMemo, useState } from "react";
import type { FieldDef, FormSchema, JsonObject } from "@/lib/types";
import { isFieldRequired, isFieldVisible, validatePayload } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";

const DRAFT_KEY = (id: number) => `Coeus.draft.${id}`;

function today() {
  return new Date().toISOString().slice(0, 10);
}

function emptyPayload(fields: FieldDef[]): JsonObject {
  const o: JsonObject = {};
  for (const f of fields) {
    if (f.type === "boolean") o[f.key] = false;
    else if (f.type === "date") o[f.key] = today();
    else if (f.type === "number") o[f.key] = "";
    else o[f.key] = "";
  }
  return o;
}

export function DynamicForm({
  schema,
  submitting,
  onSubmit,
}: {
  schema: FormSchema;
  submitting?: boolean;
  onSubmit: (payload: JsonObject) => Promise<void> | void;
}) {
  const [payload, setPayload] = useState<JsonObject>(() => emptyPayload(schema.fields));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY(schema.id));
      if (raw) {
        setPayload({ ...emptyPayload(schema.fields), ...JSON.parse(raw) });
      } else {
        setPayload(emptyPayload(schema.fields));
      }
    } catch {
      setPayload(emptyPayload(schema.fields));
    }
    setErrors({});
  }, [schema.id, schema.fields]);

  useEffect(() => {
    const t = window.setTimeout(() => {
      try {
        localStorage.setItem(DRAFT_KEY(schema.id), JSON.stringify(payload));
        setSaved(true);
        window.setTimeout(() => setSaved(false), 800);
      } catch {
        /* ignore */
      }
    }, 400);
    return () => window.clearTimeout(t);
  }, [payload, schema.id]);

  const visible = useMemo(
    () => schema.fields.filter((f) => isFieldVisible(f, payload)),
    [schema.fields, payload],
  );

  function setField(key: string, value: JsonObject[string]) {
    setPayload((p) => ({ ...p, [key]: value }));
    setErrors((e) => {
      const next = { ...e };
      delete next[key];
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const list = validatePayload(schema.fields, payload);
    if (list.length) {
      setErrors(Object.fromEntries(list.map((x) => [x.field, x.message])));
      return;
    }
    await onSubmit(payload);
    try {
      localStorage.removeItem(DRAFT_KEY(schema.id));
    } catch {
      /* ignore */
    }
    setPayload(emptyPayload(schema.fields));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {visible.map((field) => (
        <Field
          key={field.key}
          field={field}
          value={payload[field.key]}
          error={errors[field.key]}
          required={isFieldRequired(field, payload)}
          onChange={(v) => setField(field.key, v as JsonObject[string])}
        />
      ))}
      <div className="flex items-center justify-between gap-3 pt-2">
        <p className="text-xs text-faint">{saved ? "Draft saved" : "Autosaves as you type"}</p>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Checking…" : "Submit report"}
        </Button>
      </div>
    </form>
  );
}

function Field({
  field,
  value,
  error,
  required,
  onChange,
}: {
  field: FieldDef;
  value: unknown;
  error?: string;
  required: boolean;
  onChange: (v: unknown) => void;
}) {
  const id = `f-${field.key}`;
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>
        {field.label}
        {required ? <span className="text-danger"> *</span> : null}
      </Label>
      {field.type === "textarea" ? (
        <Textarea
          id={id}
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={Boolean(error)}
        />
      ) : field.type === "select" ? (
        <select
          id={id}
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
          className="flex h-11 w-full rounded-md border border-line bg-surface px-3 text-sm text-ink shadow-[var(--shadow-card)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/35"
        >
          <option value="">Select…</option>
          {field.options?.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      ) : field.type === "boolean" ? (
        <label className="flex h-11 items-center gap-3 rounded-md border border-line bg-surface px-3 text-sm shadow-[var(--shadow-card)]">
          <input
            id={id}
            type="checkbox"
            checked={Boolean(value)}
            onChange={(e) => onChange(e.target.checked)}
            className="size-4 accent-accent"
          />
          Yes
        </label>
      ) : (
        <Input
          id={id}
          type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
          value={value === undefined || value === null ? "" : String(value)}
          min={field.min}
          max={field.max}
          onChange={(e) =>
            onChange(
              field.type === "number"
                ? e.target.value === ""
                  ? ""
                  : Number(e.target.value)
                : e.target.value,
            )
          }
          aria-invalid={Boolean(error)}
        />
      )}
      {field.help && !error ? <p className="text-xs text-faint">{field.help}</p> : null}
      {error ? <p className="text-xs text-danger">{error}</p> : null}
    </div>
  );
}
