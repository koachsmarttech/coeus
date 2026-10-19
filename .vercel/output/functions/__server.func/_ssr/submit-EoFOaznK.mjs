import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { w as require_jsx_runtime, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as cn } from "./router-_Zz8wlGJ.mjs";
import { C as submitCsv, D as useBootstrap, w as submitForm } from "./bootstrap-Dbln8WC-.mjs";
import { t as Button } from "./button-CPNhbiud.mjs";
import { i as CardTitle, n as CardDesc, t as Card } from "./card-BoZDzAlh.mjs";
import { n as Label, r as Textarea, t as Input } from "./input-o9nlF8MO.mjs";
import {
  n as isFieldRequired,
  o as validatePayload,
  r as isFieldVisible,
} from "./validation-BcFovzVK.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/submit-EoFOaznK.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var DRAFT_KEY = (id) => `Coeus.draft.${id}`;
function today() {
  return /* @__PURE__ */ new Date().toISOString().slice(0, 10);
}
function emptyPayload(fields) {
  const o = {};
  for (const f of fields)
    if (f.type === "boolean") o[f.key] = false;
    else if (f.type === "date") o[f.key] = today();
    else if (f.type === "number") o[f.key] = "";
    else o[f.key] = "";
  return o;
}
function DynamicForm({ schema, submitting, onSubmit }) {
  const [payload, setPayload] = (0, import_react.useState)(() => emptyPayload(schema.fields));
  const [errors, setErrors] = (0, import_react.useState)({});
  const [saved, setSaved] = (0, import_react.useState)(false);
  (0, import_react.useEffect)(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY(schema.id));
      if (raw)
        setPayload({
          ...emptyPayload(schema.fields),
          ...JSON.parse(raw),
        });
      else setPayload(emptyPayload(schema.fields));
    } catch {
      setPayload(emptyPayload(schema.fields));
    }
    setErrors({});
  }, [schema.id, schema.fields]);
  (0, import_react.useEffect)(() => {
    const t = window.setTimeout(() => {
      try {
        localStorage.setItem(DRAFT_KEY(schema.id), JSON.stringify(payload));
        setSaved(true);
        window.setTimeout(() => setSaved(false), 800);
      } catch {}
    }, 400);
    return () => window.clearTimeout(t);
  }, [payload, schema.id]);
  const visible = (0, import_react.useMemo)(
    () => schema.fields.filter((f) => isFieldVisible(f, payload)),
    [schema.fields, payload],
  );
  function setField(key, value) {
    setPayload((p) => ({
      ...p,
      [key]: value,
    }));
    setErrors((e) => {
      const next = { ...e };
      delete next[key];
      return next;
    });
  }
  async function handleSubmit(e) {
    e.preventDefault();
    const list = validatePayload(schema.fields, payload);
    if (list.length) {
      setErrors(Object.fromEntries(list.map((x) => [x.field, x.message])));
      return;
    }
    await onSubmit(payload);
    try {
      localStorage.removeItem(DRAFT_KEY(schema.id));
    } catch {}
    setPayload(emptyPayload(schema.fields));
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
    onSubmit: handleSubmit,
    className: "space-y-4",
    children: [
      visible.map((field) =>
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          Field,
          {
            field,
            value: payload[field.key],
            error: errors[field.key],
            required: isFieldRequired(field, payload),
            onChange: (v) => setField(field.key, v),
          },
          field.key,
        ),
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
        className: "flex items-center justify-between gap-3 pt-2",
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
            className: "text-xs text-faint",
            children: saved ? "Draft saved" : "Autosaves as you type",
          }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
            type: "submit",
            disabled: submitting,
            children: submitting ? "Checking…" : "Submit report",
          }),
        ],
      }),
    ],
  });
}
function Field({ field, value, error, required, onChange }) {
  const id = `f-${field.key}`;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
    className: "space-y-1.5",
    children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
        htmlFor: id,
        children: [
          field.label,
          required
            ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
                className: "text-danger",
                children: " *",
              })
            : null,
        ],
      }),
      field.type === "textarea"
        ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
            id,
            value: String(value ?? ""),
            onChange: (e) => onChange(e.target.value),
            "aria-invalid": Boolean(error),
          })
        : field.type === "select"
          ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
              id,
              value: String(value ?? ""),
              onChange: (e) => onChange(e.target.value),
              className:
                "flex h-11 w-full rounded-md border border-line bg-surface px-3 text-sm text-ink shadow-[var(--shadow-card)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/35",
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
                  value: "",
                  children: "Select…",
                }),
                field.options?.map((o) =>
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    "option",
                    {
                      value: o,
                      children: o,
                    },
                    o,
                  ),
                ),
              ],
            })
          : field.type === "boolean"
            ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
                className:
                  "flex h-11 items-center gap-3 rounded-md border border-line bg-surface px-3 text-sm shadow-[var(--shadow-card)]",
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
                    id,
                    type: "checkbox",
                    checked: Boolean(value),
                    onChange: (e) => onChange(e.target.checked),
                    className: "size-4 accent-accent",
                  }),
                  "Yes",
                ],
              })
            : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
                id,
                type: field.type === "number" ? "number" : field.type === "date" ? "date" : "text",
                value: value === void 0 || value === null ? "" : String(value),
                min: field.min,
                max: field.max,
                onChange: (e) =>
                  onChange(
                    field.type === "number"
                      ? e.target.value === ""
                        ? ""
                        : Number(e.target.value)
                      : e.target.value,
                  ),
                "aria-invalid": Boolean(error),
              }),
      field.help && !error
        ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
            className: "text-xs text-faint",
            children: field.help,
          })
        : null,
      error
        ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
            className: "text-xs text-danger",
            children: error,
          })
        : null,
    ],
  });
}
var ACCEPT =
  ".csv,.xlsx,.xls,.pdf,.pptx,.ppt,text/csv,application/pdf,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.ms-powerpoint";
function sheetToCsv(rows) {
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
async function fileToCsvOrDocument(file) {
  const name = file.name.toLowerCase();
  if (name.endsWith(".csv") || file.type === "text/csv")
    return {
      kind: "csv",
      csv: await file.text(),
    };
  if (name.endsWith(".xlsx") || name.endsWith(".xls"))
    try {
      const XLSX = await import("../_libs/xlsx.mjs").then((n) => n.t);
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf, { type: "array" });
      const sheet = wb.Sheets[wb.SheetNames[0]];
      if (!sheet) throw new Error("Workbook has no sheets");
      return {
        kind: "csv",
        csv: sheetToCsv(
          XLSX.utils.sheet_to_json(sheet, {
            header: 1,
            defval: "",
          }),
        ),
      };
    } catch (e) {
      throw new Error(
        e instanceof Error && e.message.includes("Failed to fetch")
          ? "Install the xlsx package (npm install xlsx) to upload Excel files."
          : e instanceof Error
            ? e.message
            : "Could not read Excel file",
      );
    }
  if (name.endsWith(".pdf") || name.endsWith(".pptx") || name.endsWith(".ppt")) {
    const text = `Document upload: ${file.name} (${Math.round(file.size / 1024)} KB, type ${file.type || "unknown"}). Structured fields were auto-filled for intake; replace description details after open if needed. Original file retained by the submitter outside this system unless a document store is configured.`;
    return {
      kind: "document",
      name: file.name,
      text,
    };
  }
  throw new Error(
    "Unsupported file type. Use CSV, Excel (.xlsx/.xls), PDF, or PowerPoint (.pptx/.ppt).",
  );
}
function SubmitPage() {
  const { data, viewAs } = useBootstrap();
  const schemas = data?.schemas.filter((s) => s.is_active) ?? [];
  const [schemaId, setSchemaId] = (0, import_react.useState)(schemas[0]?.id);
  const schema = schemas.find((s) => s.id === schemaId) ?? schemas[0];
  const [tab, setTab] = (0, import_react.useState)("form");
  const [busy, setBusy] = (0, import_react.useState)(false);
  const [result, setResult] = (0, import_react.useState)(null);
  const [batch, setBatch] = (0, import_react.useState)(null);
  if (data?.effectiveRole !== "submitter")
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
          children: "Submitter view required",
        }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDesc, {
          className: "mt-2",
          children:
            "Filing is limited to the submitter role. If you are an admin, switch View as to Submitter.",
        }),
      ],
    });
  if (!schema)
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
      className: "text-sm text-muted",
      children: "No forms configured.",
    });
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
    className: "mx-auto max-w-2xl space-y-6",
    children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
            className: "text-xs font-medium uppercase tracking-[0.16em] text-muted",
            children: "Intake",
          }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
            className: "mt-1 font-display text-3xl tracking-tight",
            children: "New Report",
          }),
        ],
      }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
        className: "flex flex-wrap gap-2",
        children: schemas.map((s) =>
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "button",
            {
              type: "button",
              onClick: () => {
                setSchemaId(s.id);
                setResult(null);
                setBatch(null);
              },
              className: cn(
                "h-10 rounded-full px-3 text-sm",
                s.id === schema.id
                  ? "bg-ink text-accent-fg"
                  : "bg-surface text-ink-soft shadow-(--shadow-card)",
              ),
              children: s.name,
            },
            s.id,
          ),
        ),
      }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
        className: "text-sm text-muted",
        children: schema.description,
      }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
        className: "flex gap-2",
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
            type: "button",
            onClick: () => setTab("form"),
            className: cn(
              "h-10 rounded-md px-3 text-sm",
              tab === "form" ? "bg-accent-soft text-accent" : "text-muted",
            ),
            children: "Form",
          }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
            type: "button",
            onClick: () => setTab("upload"),
            className: cn(
              "h-10 rounded-md px-3 text-sm",
              tab === "upload" ? "bg-accent-soft text-accent" : "text-muted",
            ),
            children: "File upload",
          }),
        ],
      }),
      tab === "form"
        ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
            children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DynamicForm, {
              schema,
              submitting: busy,
              onSubmit: async (payload) => {
                setBusy(true);
                setResult(null);
                try {
                  const res = await submitForm({
                    data: {
                      schema_id: schema.id,
                      payload,
                      viewAs,
                    },
                  });
                  setResult(`Filed as #${res.id} (${res.status}).`);
                  toast.success(res.status === "accepted" ? "Accepted" : "Held for review");
                } catch (err) {
                  toast.error(err instanceof Error ? err.message : "Submit failed");
                } finally {
                  setBusy(false);
                }
              },
            }),
          })
        : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Upload a file" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDesc, {
                className: "mt-2",
                children:
                  "CSV or Excel for many rows at once. PDF or PowerPoint becomes a single document report under this form. Column headers should match field keys (see sample CSV).",
              }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
                href: "/samples/incident-sample.csv",
                className: "mt-3 inline-block text-sm text-accent hover:underline",
                download: true,
                children: "Download sample CSV",
              }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
                type: "file",
                className: "mt-4 block w-full text-sm",
                accept: ACCEPT,
                disabled: busy,
                onChange: async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setBusy(true);
                  setBatch(null);
                  setResult(null);
                  try {
                    const parsed = await fileToCsvOrDocument(file);
                    if (parsed.kind === "csv") {
                      const res = await submitCsv({
                        data: {
                          schema_id: schema.id,
                          csv: parsed.csv,
                          viewAs,
                        },
                      });
                      setBatch(res);
                      toast.success(`${res.accepted} accepted, ${res.quarantined} quarantined`);
                    } else {
                      const today = /* @__PURE__ */ new Date().toISOString().slice(0, 10);
                      const payload = {
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
                        data: {
                          schema_id: schema.id,
                          payload,
                          viewAs,
                        },
                      });
                      setResult(`Document filed as #${res.id} (${res.status}).`);
                      toast.success(
                        res.status === "accepted"
                          ? "Document accepted"
                          : "Document held for review",
                      );
                    }
                  } catch (err) {
                    toast.error(err instanceof Error ? err.message : "Upload failed");
                  } finally {
                    setBusy(false);
                    e.target.value = "";
                  }
                },
              }),
              busy
                ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
                    className: "mt-3 text-sm text-muted",
                    children: "Processing file…",
                  })
                : null,
            ],
          }),
      result
        ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
            className: "text-sm text-ink-soft",
            children: [
              result,
              " ",
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
                to: "/app/records",
                className: "text-accent hover:underline",
                children: "View records",
              }),
            ],
          })
        : null,
      batch
        ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
                children: [
                  batch.accepted,
                  " accepted · ",
                  batch.quarantined,
                  " quarantined · ",
                  batch.total,
                  " rows",
                ],
              }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
                className: "mt-3 max-h-56 space-y-1 overflow-y-auto text-sm",
                children: batch.report
                  .filter((r) => r.status !== "accepted")
                  .map((r) =>
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                      "li",
                      {
                        className: "text-danger",
                        children: ["Row ", r.row, ": ", r.errors.map((e) => e.message).join(" ")],
                      },
                      r.row,
                    ),
                  ),
              }),
              batch.quarantined > 0
                ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
                    className: "mt-3",
                    variant: "secondary",
                    onClick: () => {
                      const lines = ["row,status,errors"];
                      for (const r of batch.report)
                        lines.push(
                          `${r.row},${r.status},"${r.errors
                            .map((e) => e.message)
                            .join("; ")
                            .replace(/"/g, '""')}"`,
                        );
                      const blob = new Blob([lines.join("\n")], { type: "text/csv" });
                      const a = document.createElement("a");
                      a.href = URL.createObjectURL(blob);
                      a.download = "Coeus-upload-report.csv";
                      a.click();
                    },
                    children: "Download error report",
                  })
                : null,
            ],
          })
        : null,
    ],
  });
}
//#endregion
export { SubmitPage as component };
