import type { FieldDef, Json, JsonObject } from "./types";

export type FieldError = { field: string; message: string };

function matches(payload: JsonObject, cond?: { key: string; equals: string | number | boolean }) {
  if (!cond) return false;
  return String(payload[cond.key] ?? "") === String(cond.equals);
}

export function isFieldVisible(field: FieldDef, payload: JsonObject) {
  if (!field.showIf) return true;
  return matches(payload, field.showIf);
}

export function isFieldRequired(field: FieldDef, payload: JsonObject) {
  if (field.required) return true;
  if (field.requiredIf) return matches(payload, field.requiredIf);
  return false;
}

function asNumber(value: unknown): number | null {
  if (value === "" || value === null || value === undefined) return null;
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : null;
}

export function validatePayload(fields: FieldDef[], payload: JsonObject): FieldError[] {
  const errors: FieldError[] = [];
  for (const field of fields) {
    if (!isFieldVisible(field, payload)) continue;
    const raw = payload[field.key];
    const empty =
      raw === undefined ||
      raw === null ||
      raw === "" ||
      (typeof raw === "string" && raw.trim() === "");

    if (isFieldRequired(field, payload) && empty) {
      errors.push({ field: field.key, message: `${field.label} is required.` });
      continue;
    }
    if (empty) continue;

    if (field.type === "number") {
      const n = asNumber(raw);
      if (n === null) {
        errors.push({ field: field.key, message: `${field.label} must be a number.` });
        continue;
      }
      if (field.min !== undefined && n < field.min) {
        errors.push({ field: field.key, message: `${field.label} must be at least ${field.min}.` });
      }
      if (field.max !== undefined && n > field.max) {
        errors.push({ field: field.key, message: `${field.label} must be at most ${field.max}.` });
      }
    }

    if ((field.type === "text" || field.type === "textarea") && typeof raw === "string") {
      if (field.minLength && raw.trim().length < field.minLength) {
        errors.push({
          field: field.key,
          message: `${field.label} needs at least ${field.minLength} characters.`,
        });
      }
    }

    if (field.type === "select" && field.options && !field.options.includes(String(raw))) {
      errors.push({
        field: field.key,
        message: `${field.label} must be one of: ${field.options.join(", ")}.`,
      });
    }

    if (field.type === "date") {
      const s = String(raw);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(s) || Number.isNaN(Date.parse(s))) {
        errors.push({ field: field.key, message: `${field.label} must be a valid date.` });
      }
    }
  }
  return errors;
}

export function sanitizePayload(
  fields: FieldDef[],
  payload: Record<string, Json | undefined> | JsonObject,
): JsonObject {
  const out: JsonObject = {};
  for (const field of fields) {
    const raw = payload[field.key];
    if (field.type === "boolean") {
      out[field.key] = raw === true || raw === "true" || raw === "yes" || raw === "on";
      continue;
    }
    if (field.type === "number") {
      out[field.key] = asNumber(raw);
      continue;
    }
    if (typeof raw === "string") {
      out[field.key] = raw.replace(/<[^>]*>/g, "").trim().slice(0, 8000);
    } else if (raw === undefined || raw === null) {
      out[field.key] = "";
    } else if (typeof raw === "number" || typeof raw === "boolean") {
      out[field.key] = String(raw);
    } else {
      out[field.key] = "";
    }
  }
  return out;
}



export function parseCsv(text: string): { headers: string[]; rows: Record<string, string>[] } {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;
  const src = text.replace(/^\uFEFF/, "");
  for (let i = 0; i < src.length; i += 1) {
    const ch = src[i];
    if (inQuotes) {
      if (ch === '"') {
        if (src[i + 1] === '"') {
          cell += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        cell += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      row.push(cell.trim());
      cell = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && src[i + 1] === "\n") i += 1;
      row.push(cell.trim());
      cell = "";
      if (row.some((c) => c !== "")) rows.push(row);
      row = [];
    } else {
      cell += ch;
    }
  }
  row.push(cell.trim());
  if (row.some((c) => c !== "")) rows.push(row);
  if (rows.length === 0) return { headers: [], rows: [] };
  const headers = rows[0].map((h) => h.trim());
  const data = rows.slice(1).map((r) => {
    const obj: Record<string, string> = {};
    headers.forEach((h, idx) => {
      obj[h] = r[idx] ?? "";
    });
    return obj;
  });
  return { headers, rows: data };
}

export function canonicalRegion(value: unknown): string | null {
  const s = String(value ?? "").trim().toLowerCase().replace(/[_\s]+/g, "-");
  const map: Record<string, string> = {
    "north-west": "North-West",
    "northwest": "North-West",
    "nw": "North-West",
    "north-east": "North-East",
    "northeast": "North-East",
    "ne": "North-East",
    "north-central": "North-Central",
    "northcentral": "North-Central",
    "nc": "North-Central",
    "south-west": "South-West",
    "southwest": "South-West",
    "sw": "South-West",
    "south-east": "South-East",
    "southeast": "South-East",
    "se": "South-East",
    "south-south": "South-South",
    "southsouth": "South-South",
    "ss": "South-South",
    west: "West",
    east: "East",
    north: "North",
    south: "South",
    central: "Central",
    centre: "Central",
    center: "Central",
  };
  return map[s] ?? (s ? String(value).trim() : null);
}
