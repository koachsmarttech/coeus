import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import { ensureSeeded } from "@/lib/seed.server";
import { grokChat, grokTts, aiConfigured } from "@/lib/xai.server";
import {
  AI_MODELS,
  DEFAULT_SETTINGS,
  type AiSummary,
  type AppSettings,
  type ChartSpec,
  type ChatMessage,
  type ChatSource,
  type FieldDef,
  type FormSchema,
  type JsonObject,
  type Profile,
  type Role,
  type Submission,
  type SubmissionStatus,
} from "@/lib/types";
import { canonicalRegion, parseCsv, sanitizePayload, validatePayload } from "@/lib/validation";

type Actor = { userId: string; profile: Profile; role: Role };

function asRole(real: Role, viewAs?: Role | null): Role {
  if (real === "admin" && viewAs && ["submitter", "analyst", "admin"].includes(viewAs)) {
    return viewAs;
  }
  return real;
}

function parseFields(raw: unknown): FieldDef[] {
  if (Array.isArray(raw)) return raw as FieldDef[];
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw) as FieldDef[];
    } catch {
      return [];
    }
  }
  return [];
}

function parseJson<T>(raw: unknown, fallback: T): T {
  if (raw === null || raw === undefined) return fallback;
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  }
  return raw as T;
}

function num(v: unknown, fallback = 0) {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : fallback;
}

async function loadActor(userId: string, viewAs?: Role | null): Promise<Actor> {
  const sql = await getSql();
  await ensureSeeded(sql);
  const existing = await sql<Profile>`
    select user_id, email, name, role, created_at::text as created_at
    from profiles where user_id = ${userId}
  `;
  let profile = existing[0];
  if (!profile) {
    const count = await sql<{ n: number }>`select count(*)::int as n from profiles`;
    const role: Role = (count[0]?.n ?? 0) === 0 ? "admin" : "submitter";
    await sql`
      insert into profiles (user_id, role, name)
      values (${userId}, ${role}, ${"Member"})
      on conflict (user_id) do nothing
    `;
    const again = await sql<Profile>`
      select user_id, email, name, role, created_at::text as created_at
      from profiles where user_id = ${userId}
    `;
    profile = again[0]!;
  }
  return { userId, profile, role: asRole(profile.role, viewAs) };
}

async function writeAudit(
  actorId: string,
  action: string,
  entity_type: string,
  entity_id: string,
  details?: unknown,
) {
  const sql = await getSql();
  await sql`
    insert into audit_events (actor_id, action, entity_type, entity_id, details)
    values (
      ${actorId}, ${action}, ${entity_type}, ${entity_id},
      ${details ? JSON.stringify(details) : null}::jsonb
    )
  `;
}

async function logUsage(
  userId: string | null,
  purpose: string,
  model: string,
  input: number,
  output: number,
  cost: number,
) {
  const sql = await getSql();
  await sql`
    insert into ai_usage (user_id, purpose, model, input_tokens, output_tokens, cost_cents)
    values (${userId}, ${purpose}, ${model}, ${input}, ${output}, ${cost})
  `;
}

async function getSettings(): Promise<AppSettings> {
  const sql = await getSql();
  const rows = await sql<{ key: string; value: unknown }>`select key, value from app_settings`;
  const map = Object.fromEntries(rows.map((r) => [r.key, parseJson(r.value, null)])) as Record<
    string,
    unknown
  >;
  return {
    analysis_model: String(map.analysis_model ?? DEFAULT_SETTINGS.analysis_model),
    chat_model: String(map.chat_model ?? DEFAULT_SETTINGS.chat_model),
    rejection_alert_pct: num(map.rejection_alert_pct, DEFAULT_SETTINGS.rejection_alert_pct),
  };
}

async function findDuplicateId(schemaId: number, payload: JsonObject): Promise<number | null> {
  const site = String(payload.site ?? payload.lga_or_site ?? payload.state ?? "")
    .trim()
    .toLowerCase();
  const date = String(
    payload.occurred_at ??
      payload.collected_at ??
      payload.inspected_at ??
      payload.observed_at ??
      "",
  ).slice(0, 10);
  const cat = String(payload.category ?? payload.topic ?? "")
    .trim()
    .toLowerCase();
  if (!site || !date) return null;
  const sql = await getSql();
  const rows = await sql<{ id: number; payload: unknown }>`
    select id, payload from submissions
    where schema_id = ${schemaId} and status <> 'rejected'
    order by id desc
    limit 120
  `;
  for (const r of rows) {
    const p = parseJson<JsonObject>(r.payload, {});
    const s = String(p.site ?? p.lga_or_site ?? p.state ?? "")
      .trim()
      .toLowerCase();
    const d = String(
      p.occurred_at ?? p.collected_at ?? p.inspected_at ?? p.observed_at ?? "",
    ).slice(0, 10);
    const c = String(p.category ?? p.topic ?? "")
      .trim()
      .toLowerCase();
    if (s === site && d === date && (cat ? c === cat : true)) return r.id;
  }
  return null;
}

function mapSubmission(row: Record<string, unknown>): Submission {
  return {
    id: num(row.id),
    schema_id: num(row.schema_id),
    schema_name: (row.schema_name as string) ?? undefined,
    submitted_by: String(row.submitted_by ?? ""),
    submitter_name: String(row.submitter_name ?? ""),
    channel: (row.channel as Submission["channel"]) ?? "form",
    status: (row.status as SubmissionStatus) ?? "pending_review",
    payload: parseJson<JsonObject>(row.payload, {}),
    validation_errors: parseJson(row.validation_errors, null),
    region: (row.region as string) ?? null,
    category: (row.category as string) ?? null,
    severity: (row.severity as string) ?? null,
    quality_score: row.quality_score === null ? null : num(row.quality_score),
    ai_notes: (row.ai_notes as string) ?? null,
    ai_model: (row.ai_model as string) ?? null,
    ai_reviewed_at: (row.ai_reviewed_at as string) ?? null,
    is_seed: Boolean(row.is_seed),
    created_at: String(row.created_at ?? ""),
    updated_at: String(row.updated_at ?? ""),
  };
}

export const getBootstrap = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((data: { viewAs?: Role | null }) => data ?? {})
  .handler(async ({ context, data }) => {
    const actor = await loadActor(context.userId, data.viewAs);
    const sql = await getSql();
    const schemas = await sql<{
      id: number;
      slug: string;
      name: string;
      description: string;
      version: number;
      fields: unknown;
      is_active: boolean;
    }>`select id, slug, name, description, version, fields, is_active from form_schemas order by id`;
    const settings = await getSettings();
    return {
      profile: actor.profile,
      effectiveRole: actor.role,
      schemas: schemas.map((s): FormSchema => ({
        ...s,
        fields: parseFields(s.fields),
      })),
      settings,
      aiAvailable: aiConfigured(),
      models: AI_MODELS,
    };
  });

export const updateProfileMeta = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { name?: string; email?: string }) => data)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await loadActor(context.userId);
    await sql`
      update profiles
      set name = coalesce(${data.name ?? null}, name),
          email = coalesce(${data.email ?? null}, email),
          updated_at = now()
      where user_id = ${context.userId}
    `;
    return { ok: true };
  });

export const listMembers = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const actor = await loadActor(context.userId);
    if (actor.profile.role !== "admin") throw new Error("Forbidden");
    const sql = await getSql();
    return sql<Profile>`
      select user_id, email, name, role, created_at::text as created_at
      from profiles order by created_at
    `;
  });

export const setMemberRole = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { user_id: string; role: Role }) => data)
  .handler(async ({ context, data }) => {
    const actor = await loadActor(context.userId);
    if (actor.profile.role !== "admin") throw new Error("Forbidden");
    if (!["submitter", "analyst", "admin"].includes(data.role)) throw new Error("Invalid role");
    const sql = await getSql();
    await sql`
      update profiles set role = ${data.role}, updated_at = now()
      where user_id = ${data.user_id}
    `;
    await writeAudit(context.userId, "role.change", "profile", data.user_id, { role: data.role });
    return { ok: true };
  });

export const saveSettings = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: Partial<AppSettings>) => data)
  .handler(async ({ context, data }) => {
    const actor = await loadActor(context.userId);
    if (actor.profile.role !== "admin") throw new Error("Forbidden");
    const sql = await getSql();
    for (const [key, value] of Object.entries(data)) {
      if (value === undefined) continue;
      await sql`
        insert into app_settings (key, value, updated_by, updated_at)
        values (${key}, ${JSON.stringify(value)}::jsonb, ${context.userId}, now())
        on conflict (key) do update set value = excluded.value, updated_by = excluded.updated_by, updated_at = now()
      `;
    }
    await writeAudit(context.userId, "settings.update", "settings", "app", data);
    return getSettings();
  });

type SubmitInput = {
  schema_id: number;
  payload: JsonObject;
  channel?: "form" | "upload" | "feed";
  viewAs?: Role | null;
};

async function refineWithAi(actor: Actor, schema: FormSchema, payload: JsonObject, model: string) {
  const facts = {
    schema: schema.name,
    payload,
    region: canonicalRegion(payload.region) ?? payload.region ?? null,
  };
  const result = await grokChat({
    model,
    max_tokens: 180,
    messages: [
      {
        role: "system",
        content:
          "You refine operational submissions. Return 1-2 sentences: normalized takeaway, notable risk, and nothing invented. If the record is ordinary, say so. Never compute new numbers.",
      },
      { role: "user", content: JSON.stringify(facts) },
    ],
  });
  if (result.ok) {
    await logUsage(
      actor.userId,
      "review",
      result.model,
      result.input_tokens,
      result.output_tokens,
      result.cost_cents,
    );
    return { notes: result.text, model: result.model };
  }
  const region = canonicalRegion(payload.region) ?? String(payload.region ?? "Unknown");
  return {
    notes: `Rule-based review: ${schema.name} from ${region} accepted. AI narration unavailable.`,
    model: "rules-v1",
  };
}

export const submitForm = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: SubmitInput) => data)
  .handler(async ({ context, data }) => {
    const actor = await loadActor(context.userId, data.viewAs);
    if (actor.role !== "submitter" && actor.profile.role !== "admin") {
      throw new Error("Only submitters can file reports.");
    }
    const sql = await getSql();
    const schemas = await sql<{
      id: number;
      slug: string;
      name: string;
      description: string;
      version: number;
      fields: unknown;
      is_active: boolean;
    }>`select * from form_schemas where id = ${data.schema_id}`;
    const raw = schemas[0];
    if (!raw) throw new Error("Unknown form.");
    const schema: FormSchema = { ...raw, fields: parseFields(raw.fields) };
    const payload = sanitizePayload(schema.fields, data.payload);
    const errors = validatePayload(schema.fields, payload);
    const dup = await findDuplicateId(schema.id, payload);
    if (dup) {
      errors.push({
        field: "site",
        message: `Possible duplicate of #${dup} (same site and date). Held for admin review.`,
      });
    }
    const settings = await getSettings();
    const status: SubmissionStatus = errors.length ? "quarantined" : "pending_review";
    const region = canonicalRegion(payload.region);
    const category = String(payload.category ?? payload.topic ?? payload.status ?? "") || null;
    const severity = payload.severity ? String(payload.severity) : null;

    let ai_notes: string | null = null;
    let ai_model: string | null = null;
    let ai_reviewed_at: string | null = null;
    let finalStatus: SubmissionStatus = status;
    if (errors.length === 0) {
      const refined = await refineWithAi(actor, schema, payload, settings.analysis_model);
      ai_notes = refined.notes;
      ai_model = refined.model;
      ai_reviewed_at = new Date().toISOString();
      finalStatus = "accepted";
    }

    const inserted = await sql<{ id: number }>`
      insert into submissions (
        schema_id, submitted_by, submitter_name, channel, status, payload,
        validation_errors, region, category, severity, quality_score,
        ai_notes, ai_model, ai_reviewed_at, is_seed
      ) values (
        ${schema.id},
        ${actor.userId},
        ${actor.profile.name ?? "Submitter"},
        ${data.channel ?? "form"},
        ${finalStatus},
        ${JSON.stringify(payload)}::jsonb,
        ${errors.length ? JSON.stringify(errors) : null}::jsonb,
        ${region},
        ${category},
        ${severity},
        ${errors.length ? 35 : 88},
        ${ai_notes},
        ${ai_model},
        ${ai_reviewed_at},
        false
      ) returning id
    `;
    const id = inserted[0]!.id;
    await writeAudit(actor.userId, "submission.create", "submission", String(id), {
      status: finalStatus,
      channel: data.channel ?? "form",
    });
    return { id, status: finalStatus, errors };
  });

export const submitCsv = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { schema_id: number; csv: string; viewAs?: Role | null }) => data)
  .handler(async ({ context, data }) => {
    const actor = await loadActor(context.userId, data.viewAs);
    if (actor.role !== "submitter" && actor.profile.role !== "admin") {
      throw new Error("Only submitters can upload reports.");
    }
    const sql = await getSql();
    const schemas = await sql<{
      id: number;
      slug: string;
      name: string;
      description: string;
      version: number;
      fields: unknown;
      is_active: boolean;
    }>`select * from form_schemas where id = ${data.schema_id}`;
    const raw = schemas[0];
    if (!raw) throw new Error("Unknown form.");
    const schema: FormSchema = { ...raw, fields: parseFields(raw.fields) };
    const parsed = parseCsv(data.csv);
    if (parsed.rows.length === 0) throw new Error("The file has no data rows.");
    if (parsed.rows.length > 200) throw new Error("Please keep uploads to 200 rows.");

    const settings = await getSettings();
    const report: {
      row: number;
      status: SubmissionStatus;
      errors: { field: string; message: string }[];
      id?: number;
    }[] = [];
    let accepted = 0;
    let quarantined = 0;

    for (let i = 0; i < parsed.rows.length; i += 1) {
      const payload = sanitizePayload(schema.fields, parsed.rows[i] ?? {});
      const errors = validatePayload(schema.fields, payload);
      const dup = await findDuplicateId(schema.id, payload);
      if (dup) {
        errors.push({
          field: "site",
          message: `Possible duplicate of #${dup}.`,
        });
      }
      const status: SubmissionStatus = errors.length ? "quarantined" : "pending_review";
      const region = canonicalRegion(payload.region);
      const category = String(payload.category ?? payload.topic ?? payload.status ?? "") || null;
      const inserted = await sql<{ id: number }>`
        insert into submissions (
          schema_id, submitted_by, submitter_name, channel, status, payload,
          validation_errors, region, category, severity, quality_score,
          ai_notes, ai_model, ai_reviewed_at, is_seed
        ) values (
          ${schema.id}, ${actor.userId}, ${actor.profile.name ?? "Submitter"}, 'upload',
          ${status}, ${JSON.stringify(payload)}::jsonb,
          ${errors.length ? JSON.stringify(errors) : null}::jsonb,
          ${region}, ${category}, ${payload.severity ? String(payload.severity) : null},
          ${errors.length ? 30 : 84},
           ${errors.length ? null : "Batch upload — rule-based review. Row accepted."},
           ${errors.length ? null : "rules-v1"},
           ${errors.length ? null : new Date().toISOString()},
           false
         ) returning id
       `;
      if (status === "pending_review") accepted += 1;
      else quarantined += 1;
      report.push({ row: i + 2, status, errors, id: inserted[0]?.id });
    }

    if (accepted > 0) {
      const result = await grokChat({
        model: settings.analysis_model,
        max_tokens: 220,
        messages: [
          {
            role: "system",
            content:
              "Summarize a batch upload in 3 sentences using only the counts provided. Do not invent details.",
          },
          {
            role: "user",
            content: JSON.stringify({
              schema: schema.name,
              accepted,
              quarantined,
              total: parsed.rows.length,
            }),
          },
        ],
      });
      if (result.ok) {
        await logUsage(
          actor.userId,
          "review",
          result.model,
          result.input_tokens,
          result.output_tokens,
          result.cost_cents,
        );
      }
    }

    await writeAudit(actor.userId, "submission.batch", "schema", String(schema.id), {
      accepted,
      quarantined,
    });
    return { accepted, quarantined, total: parsed.rows.length, report };
  });

type ListInput = {
  viewAs?: Role | null;
  status?: SubmissionStatus | "all";
  region?: string;
  schema_id?: number;
  q?: string;
  limit?: number;
};

export const listSubmissions = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((data: ListInput) => data ?? {})
  .handler(async ({ context, data }) => {
    const actor = await loadActor(context.userId, data.viewAs);
    const sql = await getSql();
    const limit = Math.min(data.limit ?? 80, 200);
    const rows = await sql<Record<string, unknown>>`
      select s.*, fs.name as schema_name,
             s.created_at::text as created_at, s.updated_at::text as updated_at,
             s.ai_reviewed_at::text as ai_reviewed_at
      from submissions s
      join form_schemas fs on fs.id = s.schema_id
      order by s.created_at desc
      limit 400
    `;
    let list = rows.map(mapSubmission);
    if (actor.role === "submitter") list = list.filter((s) => s.submitted_by === actor.userId);
    else if (actor.role === "analyst" || actor.role === "admin")
      list = list.filter((s) => s.status === "accepted");
    if (data.status && data.status !== "all") list = list.filter((s) => s.status === data.status);
    if (data.region) list = list.filter((s) => s.region === data.region);
    if (data.schema_id) list = list.filter((s) => s.schema_id === data.schema_id);
    if (data.q) {
      const q = data.q.toLowerCase();
      list = list.filter(
        (s) =>
          JSON.stringify(s.payload).toLowerCase().includes(q) ||
          (s.submitter_name ?? "").toLowerCase().includes(q) ||
          (s.region ?? "").toLowerCase().includes(q),
      );
    }
    const counts = {
      accepted: list.filter((s) => s.status === "accepted").length,
      quarantined: list.filter((s) => s.status === "quarantined").length,
      pending: list.filter((s) => s.status === "pending_review").length,
      rejected: list.filter((s) => s.status === "rejected").length,
    };
    return { total: list.length, rows: list.slice(0, limit), counts };
  });

export const getSubmission = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((data: { id: number; viewAs?: Role | null }) => data)
  .handler(async ({ context, data }) => {
    const actor = await loadActor(context.userId, data.viewAs);
    const sql = await getSql();
    const rows = await sql<Record<string, unknown>>`
      select s.*, fs.name as schema_name, fs.fields as schema_fields,
             s.created_at::text as created_at, s.updated_at::text as updated_at,
             s.ai_reviewed_at::text as ai_reviewed_at
      from submissions s
      join form_schemas fs on fs.id = s.schema_id
      where s.id = ${data.id}
    `;
    const row = rows[0];
    if (!row) throw new Error("Not found");
    const sub = mapSubmission(row);
    if (actor.role === "submitter" && sub.submitted_by !== actor.userId)
      throw new Error("Not found");
    if (actor.role === "analyst" && sub.status !== "accepted") throw new Error("Not found");
    return { ...sub, schema_fields: parseFields(row.schema_fields) };
  });

export const resolveQuarantine = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { id: number; action: "accept" | "reject"; note?: string }) => data)
  .handler(async ({ context, data }) => {
    const actor = await loadActor(context.userId);
    if (actor.profile.role !== "admin") throw new Error("Forbidden");
    const sql = await getSql();
    const status = data.action === "accept" ? "accepted" : "rejected";
    await sql`
      update submissions
      set status = ${status},
          ai_notes = coalesce(ai_notes, ${data.note ?? "Admin override."}),
          ai_reviewed_at = now(),
          updated_at = now()
      where id = ${data.id}
    `;
    await writeAudit(context.userId, "submission.resolve", "submission", String(data.id), {
      action: data.action,
    });
    return { ok: true };
  });

export type DashboardData = {
  kpis: {
    total: number;
    accepted: number;
    quarantined: number;
    pending: number;
    week: number;
    prevWeek: number;
    rejectRate: number;
  };
  volume: { date: string; accepted: number; quarantined: number; pending: number }[];
  byRegion: { region: string; count: number }[];
  byCategory: { category: string; count: number }[];
  bySeverity: { severity: string; count: number }[];
  satisfaction: { score: number; count: number }[];
  channels: { channel: string; count: number }[];
  anomalies: { title: string; detail: string; href?: string }[];
};

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export const getDashboard = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((data: { viewAs?: Role | null; days?: number }) => data ?? {})
  .handler(async ({ context, data }): Promise<DashboardData> => {
    const actor = await loadActor(context.userId, data.viewAs);
    if (actor.role === "submitter") {
      throw new Error("Dashboard is for analysts and admins.");
    }
    const sql = await getSql();
    const days = data.days ?? 56;
    const rows = await sql<Record<string, unknown>>`
      select s.*, s.created_at::text as created_at, s.payload
      from submissions s
      order by s.created_at
    `;
    let list = rows.map(mapSubmission);
    if (actor.role === "analyst") list = list.filter((s) => s.status === "accepted");
    const since = startOfDay(new Date(Date.now() - days * 86400000));
    const inWindow = list.filter((s) => new Date(s.created_at) >= since);
    const weekSince = Date.now() - 7 * 86400000;
    const prevWeekSince = Date.now() - 14 * 86400000;
    const week = list.filter((s) => new Date(s.created_at).getTime() >= weekSince).length;
    const prevWeek = list.filter((s) => {
      const t = new Date(s.created_at).getTime();
      return t >= prevWeekSince && t < weekSince;
    }).length;
    const accepted = inWindow.filter((s) => s.status === "accepted").length;
    const quarantined = inWindow.filter((s) => s.status === "quarantined").length;
    const pending = inWindow.filter((s) => s.status === "pending_review").length;
    const decided = accepted + quarantined;
    const rejectRate = decided === 0 ? 0 : (quarantined / decided) * 100;

    const volumeMap = new Map<string, { accepted: number; quarantined: number; pending: number }>();
    for (let i = days - 1; i >= 0; i -= 1) {
      const key = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
      volumeMap.set(key, { accepted: 0, quarantined: 0, pending: 0 });
    }
    for (const s of inWindow) {
      const key = s.created_at.slice(0, 10);
      const bucket = volumeMap.get(key);
      if (!bucket) continue;
      if (s.status === "accepted") bucket.accepted += 1;
      else if (s.status === "quarantined") bucket.quarantined += 1;
      else if (s.status === "pending_review") bucket.pending += 1;
    }

    const tally = (key: (s: Submission) => string | null) => {
      const m = new Map<string, number>();
      for (const s of inWindow) {
        const k = key(s) || "Unknown";
        m.set(k, (m.get(k) ?? 0) + 1);
      }
      return [...m.entries()].map(([k, count]) => ({ label: k, count }));
    };

    const sat = new Map<number, number>();
    for (const s of inWindow) {
      const v = num(s.payload.satisfaction, 0);
      if (v >= 1 && v <= 5) sat.set(v, (sat.get(v) ?? 0) + 1);
    }

    const violenceCount = inWindow.filter(
      (s) => s.category === "Violence" && s.status === "accepted",
    ).length;
    const lowSat = inWindow.filter((s) => num(s.payload.satisfaction, 5) <= 2).length;
    const seLogistics = inWindow.filter(
      (s) =>
        s.region === "South-East" &&
        (s.category === "Logistics failure" || s.category === "Disenfranchisement"),
    ).length;

    const anomalies: DashboardData["anomalies"] = [];
    if (violenceCount >= 5) {
      anomalies.push({
        title: "Elevated election violence reports",
        detail: `${violenceCount} accepted Violence filings in this window across zones.`,
      });
    }
    if (lowSat >= 4) {
      anomalies.push({
        title: "Low voter satisfaction",
        detail: `${lowSat} feedback records scored 1–2 on satisfaction (registration, polling, credibility).`,
      });
    }
    if (seLogistics >= 3) {
      anomalies.push({
        title: "South-East logistics / access issues",
        detail: `${seLogistics} Logistics failure or Disenfranchisement reports from the South-East.`,
      });
    }
    if (rejectRate >= 8) {
      anomalies.push({
        title: "Quarantine rate elevated",
        detail: `${rejectRate.toFixed(1)}% of checked filings were quarantined — review data quality on high-severity claims.`,
      });
    }

    return {
      kpis: {
        total: inWindow.length,
        accepted,
        quarantined,
        pending,
        week,
        prevWeek,
        rejectRate,
      },
      volume: [...volumeMap.entries()].map(([date, v]) => ({ date, ...v })),
      byRegion: tally((s) => s.region).map((x) => ({ region: x.label, count: x.count })),
      byCategory: tally((s) => s.category).map((x) => ({ category: x.label, count: x.count })),
      bySeverity: tally((s) => s.severity)
        .filter((x) => x.label !== "Unknown")
        .map((x) => ({ severity: x.label, count: x.count })),
      satisfaction: [1, 2, 3, 4, 5].map((score) => ({ score, count: sat.get(score) ?? 0 })),
      channels: tally((s) => s.channel).map((x) => ({ channel: x.label, count: x.count })),
      anomalies,
    };
  });

type FactsBundle = {
  role: Role;
  kpis: Record<string, number>;
  byRegion: { region: string; count: number }[];
  byCategory: { category: string; count: number }[];
  recent: {
    id: number;
    status: string;
    region: string | null;
    category: string | null;
    summary: string;
  }[];
  usage: { purpose: string; calls: number; cost_cents: number }[];
  settings: AppSettings;
};

async function computeFacts(actor: Actor): Promise<FactsBundle> {
  const sql = await getSql();
  const rows = await sql<Record<string, unknown>>`
    select s.*, s.created_at::text as created_at
    from submissions s
    order by s.created_at desc
    limit 500
  `;
  let list = rows.map(mapSubmission);
  if (actor.role === "submitter") list = list.filter((s) => s.submitted_by === actor.userId);
  else if (actor.role === "analyst") list = list.filter((s) => s.status === "accepted");
  const weekSince = Date.now() - 7 * 86400000;
  const week = list.filter((s) => new Date(s.created_at).getTime() >= weekSince);
  const byRegion = new Map<string, number>();
  const byCategory = new Map<string, number>();
  for (const s of list) {
    byRegion.set(s.region ?? "Unknown", (byRegion.get(s.region ?? "Unknown") ?? 0) + 1);
    byCategory.set(s.category ?? "Unknown", (byCategory.get(s.category ?? "Unknown") ?? 0) + 1);
  }
  const usageRows =
    actor.role === "admin"
      ? await sql<{ purpose: string; calls: number; cost_cents: number }>`
        select purpose, count(*)::int as calls, coalesce(sum(cost_cents),0)::float as cost_cents
        from ai_usage group by purpose
      `
      : [];
  return {
    role: actor.role,
    kpis: {
      total: list.length,
      accepted: list.filter((s) => s.status === "accepted").length,
      quarantined: list.filter((s) => s.status === "quarantined").length,
      pending: list.filter((s) => s.status === "pending_review").length,
      week: week.length,
    },
    byRegion: [...byRegion.entries()].map(([region, count]) => ({ region, count })),
    byCategory: [...byCategory.entries()].map(([category, count]) => ({ category, count })),
    recent: list.slice(0, 8).map((s) => ({
      id: s.id,
      status: s.status,
      region: s.region,
      category: s.category,
      summary:
        s.ai_notes ??
        String(s.payload.description ?? s.payload.comments ?? s.payload.notes ?? "").slice(0, 160),
    })),
    usage: usageRows,
    settings: await getSettings(),
  };
}

function fallbackNarrate(question: string, facts: FactsBundle) {
  const topRegion = [...facts.byRegion].sort((a, b) => b.count - a.count)[0];
  const lines = [
    `I can only speak to the numbers already calculated for your role (${facts.role}).`,
    `There are ${facts.kpis.total} visible records, ${facts.kpis.accepted} accepted, ${facts.kpis.quarantined} quarantined, ${facts.kpis.pending} pending review. ${facts.kpis.week} arrived in the last 7 days.`,
    topRegion ? `${topRegion.region} currently leads volume with ${topRegion.count} filings.` : "",
    facts.recent[0]
      ? `Most recent visible record: #${facts.recent[0].id} (${facts.recent[0].status}${facts.recent[0].region ? `, ${facts.recent[0].region}` : ""}).`
      : "No records are in scope yet.",
    `You asked: “${question.trim()}”. If that needs data outside this snapshot, I will not guess.`,
  ];
  return lines.filter(Boolean).join(" ");
}

function chartFromFacts(question: string, facts: FactsBundle): ChartSpec | null {
  const q = question.toLowerCase();
  if (q.includes("region") || q.includes("area") || q.includes("where")) {
    return {
      type: "bar",
      title: "Filings by region",
      xKey: "region",
      yKeys: [{ key: "count", label: "Filings" }],
      data: facts.byRegion,
    };
  }
  if (q.includes("category") || q.includes("topic") || q.includes("type")) {
    return {
      type: "bar",
      title: "Filings by category",
      xKey: "category",
      yKeys: [{ key: "count", label: "Filings" }],
      data: facts.byCategory,
    };
  }
  return null;
}

export const askQuestion = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { question: string; threadId?: number | null; viewAs?: Role | null }) => data)
  .handler(async ({ context, data }) => {
    const actor = await loadActor(context.userId, data.viewAs);
    if (actor.role === "submitter") {
      throw new Error("Chat is limited to analyst and admin roles.");
    }
    const question = data.question.trim().slice(0, 800);
    if (!question) throw new Error("Ask a question first.");
    const sql = await getSql();
    let threadId = data.threadId ?? null;
    if (!threadId) {
      const created = await sql<{ id: number }>`
        insert into chat_threads (user_id, title)
        values (${actor.userId}, ${question.slice(0, 72)})
        returning id
      `;
      threadId = created[0]!.id;
    } else {
      const owned = await sql<{ id: number }>`
        select id from chat_threads where id = ${threadId} and user_id = ${actor.userId}
      `;
      if (!owned[0]) throw new Error("Thread not found");
    }

    await sql`
      insert into chat_messages (thread_id, user_id, role, content)
      values (${threadId}, ${actor.userId}, 'user', ${question})
    `;

    const history = await sql<{ role: string; content: string }>`
      select role, content from chat_messages
      where thread_id = ${threadId}
      order by id desc
      limit 8
    `;

    const facts = await computeFacts(actor);
    const settings = facts.settings;
    const system = [
      "You are Coeus, an operations analyst. You NEVER invent numbers.",
      "You are given a JSON facts bundle calculated from the database, already permission-scoped.",
      "Answer only from those facts. If the facts cannot answer the question, say so plainly.",
      "Cite record ids from facts.recent when you mention a filing.",
      `The asker's role is ${actor.role}.`,
      actor.role === "analyst"
        ? "They cannot see pending or quarantined filings."
        : "They may hear operational counts including quarantine and AI usage.",
      "Keep answers under 180 words. Use short paragraphs.",
    ].join(" ");

    const result = await grokChat({
      model: settings.chat_model,
      max_tokens: 420,
      messages: [
        { role: "system", content: system },
        ...history
          .reverse()
          .slice(0, -1)
          .map((m) => ({
            role: m.role === "assistant" ? ("assistant" as const) : ("user" as const),
            content: m.content,
          })),
        {
          role: "user",
          content: `FACTS:\n${JSON.stringify(facts)}\n\nQUESTION:\n${question}`,
        },
      ],
    });

    const text = result.ok ? result.text : fallbackNarrate(question, facts);
    if (result.ok) {
      await logUsage(
        actor.userId,
        "chat",
        result.model,
        result.input_tokens,
        result.output_tokens,
        result.cost_cents,
      );
    }
    const chart = chartFromFacts(question, facts);
    const sources: ChatSource[] = facts.recent.slice(0, 4).map((r) => ({
      kind: "submission",
      id: String(r.id),
      label: `#${r.id} ${r.region ?? ""} ${r.category ?? ""}`.trim(),
    }));

    const saved = await sql<{ id: number; created_at: string }>`
      insert into chat_messages (thread_id, user_id, role, content, chart, sources)
      values (
        ${threadId}, ${actor.userId}, 'assistant', ${text},
        ${chart ? JSON.stringify(chart) : null}::jsonb,
        ${JSON.stringify(sources)}::jsonb
      )
      returning id, created_at::text as created_at
    `;

    const message: ChatMessage = {
      id: saved[0]!.id,
      thread_id: threadId,
      role: "assistant",
      content: text,
      chart,
      sources,
      created_at: saved[0]!.created_at,
    };
    return { threadId, message, grounded: result.ok };
  });

export const listThreads = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await loadActor(context.userId);
    const sql = await getSql();
    return sql<{ id: number; title: string; created_at: string }>`
      select id, title, created_at::text as created_at
      from chat_threads
      where user_id = ${context.userId}
      order by id desc
      limit 20
    `;
  });

export const getThread = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((data: { id: number }) => data)
  .handler(async ({ context, data }) => {
    await loadActor(context.userId);
    const sql = await getSql();
    const thread = await sql<{ id: number; title: string }>`
      select id, title from chat_threads where id = ${data.id} and user_id = ${context.userId}
    `;
    if (!thread[0]) throw new Error("Not found");
    const messages = await sql<Record<string, unknown>>`
      select id, thread_id, role, content, chart, sources, created_at::text as created_at
      from chat_messages where thread_id = ${data.id} order by id
    `;
    return {
      ...thread[0],
      messages: messages.map((m): ChatMessage => ({
        id: num(m.id),
        thread_id: num(m.thread_id),
        role: m.role === "assistant" ? "assistant" : "user",
        content: String(m.content),
        chart: parseJson(m.chart, null),
        sources: parseJson(m.sources, null),
        created_at: String(m.created_at),
      })),
    };
  });

export const speakText = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { text: string }) => data)
  .handler(async ({ context, data }) => {
    await loadActor(context.userId);
    const result = await grokTts(data.text);
    if (!result.ok) return result;
    await logUsage(context.userId, "tts", "tts", data.text.length, 0, 1);
    return result;
  });

export const listSummaries = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((data: { viewAs?: Role | null }) => data ?? {})
  .handler(async ({ context, data }) => {
    const actor = await loadActor(context.userId, data.viewAs);
    if (actor.role === "submitter") throw new Error("Forbidden");
    const sql = await getSql();
    const rows = await sql<Record<string, unknown>>`
      select id, title, period_start::text as period_start, period_end::text as period_end,
             trigger, facts, narrative, sources, confidence, model, prompt_version,
             input_tokens, output_tokens, cost_cents, flagged, flag_note, created_by,
             created_at::text as created_at
      from ai_summaries order by id desc limit 12
    `;
    return rows.map((r): AiSummary => ({
      id: num(r.id),
      title: String(r.title),
      period_start: (r.period_start as string) ?? null,
      period_end: (r.period_end as string) ?? null,
      trigger: String(r.trigger),
      facts: parseJson<JsonObject>(r.facts, {}),
      narrative: String(r.narrative),
      sources: parseJson(r.sources, null),
      confidence: (r.confidence as AiSummary["confidence"]) ?? "medium",
      model: String(r.model),
      prompt_version: String(r.prompt_version),
      input_tokens: num(r.input_tokens),
      output_tokens: num(r.output_tokens),
      cost_cents: num(r.cost_cents),
      flagged: Boolean(r.flagged),
      flag_note: (r.flag_note as string) ?? null,
      created_by: (r.created_by as string) ?? null,
      created_at: String(r.created_at),
    }));
  });

export const generateSummary = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { viewAs?: Role | null }) => data ?? {})
  .handler(async ({ context, data }) => {
    const actor = await loadActor(context.userId, data.viewAs);
    if (actor.role === "submitter") throw new Error("Forbidden");
    const facts = await computeFacts(actor);
    const settings = await getSettings();
    const result = await grokChat({
      model: settings.analysis_model,
      max_tokens: 500,
      messages: [
        {
          role: "system",
          content:
            "Write a weekly operations brief from the provided FACTS only. 3 short sections: What changed, Where to look, Confidence. Cite record ids. Never invent numbers. If the sample is thin, say so.",
        },
        { role: "user", content: JSON.stringify(facts) },
      ],
    });
    const narrative = result.ok
      ? result.text
      : fallbackNarrate("Write this week's operations brief.", facts);
    const sql = await getSql();
    const end = new Date().toISOString().slice(0, 10);
    const start = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10);
    const inserted = await sql<{ id: number }>`
      insert into ai_summaries (
        title, period_start, period_end, trigger, facts, narrative, sources,
        confidence, model, prompt_version, input_tokens, output_tokens, cost_cents, created_by
      ) values (
        ${"Weekly operations brief"},
        ${start}, ${end}, ${"on_demand"},
        ${JSON.stringify(facts)}::jsonb,
        ${narrative},
        ${JSON.stringify(facts.recent.slice(0, 5).map((r) => ({ kind: "submission", id: String(r.id), label: `#${r.id}` })))}::jsonb,
        ${facts.kpis.total > 40 ? "high" : "medium"},
        ${result.ok ? result.model : "facts-v1"},
        ${"v1"},
        ${result.ok ? result.input_tokens : 0},
        ${result.ok ? result.output_tokens : 0},
        ${result.ok ? result.cost_cents : 0},
        ${actor.userId}
      ) returning id
    `;
    if (result.ok) {
      await logUsage(
        actor.userId,
        "summary",
        result.model,
        result.input_tokens,
        result.output_tokens,
        result.cost_cents,
      );
    }
    return { id: inserted[0]!.id };
  });

export const flagSummary = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { id: number; note?: string }) => data)
  .handler(async ({ context, data }) => {
    const actor = await loadActor(context.userId);
    if (actor.role === "submitter") throw new Error("Forbidden");
    const sql = await getSql();
    await sql`
      update ai_summaries
      set flagged = true, flag_note = ${data.note ?? "Flagged as inaccurate"}
      where id = ${data.id}
    `;
    await writeAudit(actor.userId, "summary.flag", "summary", String(data.id), { note: data.note });
    return { ok: true };
  });

export const getUsage = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const actor = await loadActor(context.userId);
    if (actor.profile.role !== "admin") throw new Error("Forbidden");
    const sql = await getSql();
    const byDay = await sql<{ day: string; calls: number; cost_cents: number }>`
      select created_at::date::text as day, count(*)::int as calls,
             coalesce(sum(cost_cents),0)::float as cost_cents
      from ai_usage
      group by 1
      order by 1 desc
      limit 30
    `;
    const byPurpose = await sql<{ purpose: string; calls: number; cost_cents: number }>`
      select purpose, count(*)::int as calls, coalesce(sum(cost_cents),0)::float as cost_cents
      from ai_usage group by purpose order by calls desc
    `;
    const totals = await sql<{ calls: number; cost_cents: number }>`
      select count(*)::int as calls, coalesce(sum(cost_cents),0)::float as cost_cents from ai_usage
    `;
    return { byDay, byPurpose, totals: totals[0] ?? { calls: 0, cost_cents: 0 } };
  });

export const exportSubmissions = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((data: { status?: SubmissionStatus | "all" }) => data ?? {})
  .handler(async ({ context, data }) => {
    const actor = await loadActor(context.userId);
    if (actor.profile.role !== "admin") throw new Error("Forbidden");
    const sql = await getSql();
    const rows = await sql<Record<string, unknown>>`
      select s.id, fs.name as schema_name, s.submitter_name, s.channel, s.status,
             s.region, s.category, s.severity, s.created_at::text as created_at, s.payload
      from submissions s
      join form_schemas fs on fs.id = s.schema_id
      order by s.id
    `;
    const filtered =
      data.status && data.status !== "all" ? rows.filter((r) => r.status === data.status) : rows;
    const header = [
      "id",
      "schema",
      "submitter",
      "channel",
      "status",
      "region",
      "category",
      "severity",
      "created_at",
    ];
    const lines = [header.join(",")];
    for (const r of filtered) {
      lines.push(
        [
          r.id,
          csvEscape(String(r.schema_name ?? "")),
          csvEscape(String(r.submitter_name ?? "")),
          r.channel,
          r.status,
          csvEscape(String(r.region ?? "")),
          csvEscape(String(r.category ?? "")),
          csvEscape(String(r.severity ?? "")),
          r.created_at,
        ].join(","),
      );
    }
    await writeAudit(actor.userId, "export.csv", "submissions", "all", { count: filtered.length });
    return { filename: "Coeus-submissions.csv", csv: lines.join("\n") };
  });

function csvEscape(s: string) {
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export const addSchemaField = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { schema_id: number; field: FieldDef }) => data)
  .handler(async ({ context, data }) => {
    const actor = await loadActor(context.userId);
    if (actor.profile.role !== "admin") throw new Error("Forbidden");
    const sql = await getSql();
    const rows = await sql<{ fields: unknown; version: number }>`
      select fields, version from form_schemas where id = ${data.schema_id}
    `;
    const row = rows[0];
    if (!row) throw new Error("Unknown form");
    const fields = parseFields(row.fields);
    const key = data.field.key.trim().replace(/\s+/g, "_").toLowerCase();
    if (!key) throw new Error("Field key required");
    if (fields.some((f) => f.key === key)) throw new Error("That field already exists");
    fields.push({ ...data.field, key });
    await sql`
      update form_schemas
      set fields = ${JSON.stringify(fields)}::jsonb, version = ${row.version + 1}
      where id = ${data.schema_id}
    `;
    await writeAudit(context.userId, "schema.field.add", "schema", String(data.schema_id), {
      key,
    });
    return { fields, version: row.version + 1 };
  });

export const toggleFieldRequired = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { schema_id: number; key: string; required: boolean }) => data)
  .handler(async ({ context, data }) => {
    const actor = await loadActor(context.userId);
    if (actor.profile.role !== "admin") throw new Error("Forbidden");
    const sql = await getSql();
    const rows = await sql<{ fields: unknown; version: number }>`
      select fields, version from form_schemas where id = ${data.schema_id}
    `;
    const row = rows[0];
    if (!row) throw new Error("Unknown form");
    const fields = parseFields(row.fields).map((f) =>
      f.key === data.key ? { ...f, required: data.required } : f,
    );
    await sql`
      update form_schemas
      set fields = ${JSON.stringify(fields)}::jsonb, version = ${row.version + 1}
      where id = ${data.schema_id}
    `;
    await writeAudit(context.userId, "schema.field.update", "schema", String(data.schema_id), data);
    return { fields, version: row.version + 1 };
  });

export const listAudit = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const actor = await loadActor(context.userId);
    if (actor.profile.role !== "admin") throw new Error("Forbidden");
    const sql = await getSql();
    return sql<{
      id: number;
      actor_id: string | null;
      action: string;
      entity_type: string | null;
      entity_id: string | null;
      created_at: string;
    }>`
      select id, actor_id, action, entity_type, entity_id, created_at::text as created_at
      from audit_events order by id desc limit 40
    `;
  });

export const ingestFeed = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { schema_id: number; body: string; format: "csv" | "json" }) => data)
  .handler(async ({ context, data }) => {
    const actor = await loadActor(context.userId);
    if (actor.profile.role !== "admin") throw new Error("Forbidden");
    const sql = await getSql();
    const schemas = await sql<{
      id: number;
      slug: string;
      name: string;
      description: string;
      version: number;
      fields: unknown;
      is_active: boolean;
    }>`select * from form_schemas where id = ${data.schema_id}`;
    const raw = schemas[0];
    if (!raw) throw new Error("Unknown form.");
    const schema: FormSchema = { ...raw, fields: parseFields(raw.fields) };

    let rows: Record<string, unknown>[] = [];
    if (data.format === "json") {
      const parsed = JSON.parse(data.body) as unknown;
      if (!Array.isArray(parsed)) throw new Error("JSON feed must be an array of objects.");
      rows = parsed as Record<string, unknown>[];
    } else {
      rows = parseCsv(data.body).rows;
    }
    if (rows.length === 0) throw new Error("Feed has no rows.");
    if (rows.length > 200) throw new Error("Keep a feed batch to 200 rows.");

    let accepted = 0;
    let quarantined = 0;
    const report: {
      row: number;
      status: SubmissionStatus;
      errors: { field: string; message: string }[];
    }[] = [];

    for (let i = 0; i < rows.length; i += 1) {
      const payload = sanitizePayload(schema.fields, (rows[i] ?? {}) as JsonObject);
      const errors = validatePayload(schema.fields, payload);
      const dup = await findDuplicateId(schema.id, payload);
      if (dup) {
        errors.push({ field: "site", message: `Possible duplicate of #${dup}.` });
      }
      const status: SubmissionStatus = errors.length ? "quarantined" : "accepted";
      const region = canonicalRegion(payload.region);
      const category = String(payload.category ?? payload.topic ?? payload.status ?? "") || null;
      await sql`
        insert into submissions (
          schema_id, submitted_by, submitter_name, channel, status, payload,
          validation_errors, region, category, severity, quality_score,
          ai_notes, ai_model, ai_reviewed_at, is_seed
        ) values (
          ${schema.id}, ${actor.userId}, ${"Automated feed"}, 'feed',
          ${status}, ${JSON.stringify(payload)}::jsonb,
          ${errors.length ? JSON.stringify(errors) : null}::jsonb,
          ${region}, ${category}, ${payload.severity ? String(payload.severity) : null},
          ${errors.length ? 30 : 84},
          ${errors.length ? null : "Feed ingest — rule-based review. Row accepted."},
          ${errors.length ? null : "rules-v1"},
          ${errors.length ? null : new Date().toISOString()},
          false
        )
      `;
      if (status === "accepted") accepted += 1;
      else quarantined += 1;
      report.push({ row: i + 1, status, errors });
    }

    await writeAudit(actor.userId, "submission.feed", "schema", String(schema.id), {
      accepted,
      quarantined,
    });
    return { accepted, quarantined, total: rows.length, report };
  });

export const listSavedViews = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await loadActor(context.userId);
    const sql = await getSql();
    return sql<{ id: number; name: string; filters: JsonObject; created_at: string }>`
      select id, name, filters, created_at::text as created_at
      from saved_views where user_id = ${context.userId} order by id desc
    `;
  });

export const saveView = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { name: string; filters: JsonObject }) => data)
  .handler(async ({ context, data }) => {
    await loadActor(context.userId);
    const name = data.name.trim().slice(0, 80);
    if (!name) throw new Error("Name the view first.");
    const sql = await getSql();
    const inserted = await sql<{ id: number }>`
      insert into saved_views (user_id, name, filters)
      values (${context.userId}, ${name}, ${JSON.stringify(data.filters)}::jsonb)
      returning id
    `;
    return { id: inserted[0]!.id };
  });

export const deleteSavedView = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { id: number }) => data)
  .handler(async ({ context, data }) => {
    await loadActor(context.userId);
    const sql = await getSql();
    await sql`delete from saved_views where id = ${data.id} and user_id = ${context.userId}`;
    return { ok: true };
  });
