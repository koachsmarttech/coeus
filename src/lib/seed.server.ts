import type { Sql } from "@/lib/db";
import { SEEDED_SCHEMAS } from "@/lib/form-defs";
import type { FieldDef } from "@/lib/types";

function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function pick<T>(rng: () => number, list: T[]): T {
  return list[Math.floor(rng() * list.length)]!;
}

const ELECTION_WINDOWS = [
  { year: "1999", date: "1999-02-27", winner: "Olusegun Obasanjo", party: "PDP" },
  { year: "2003", date: "2003-04-19", winner: "Olusegun Obasanjo", party: "PDP" },
  { year: "2007", date: "2007-04-21", winner: "Umaru Musa Yar'Adua", party: "PDP" },
  { year: "2011", date: "2011-04-16", winner: "Goodluck Jonathan", party: "PDP" },
  { year: "2015", date: "2015-03-28", winner: "Muhammadu Buhari", party: "APC" },
  { year: "2019", date: "2019-02-23", winner: "Muhammadu Buhari", party: "APC" },
  { year: "2023", date: "2023-02-25", winner: "Bola Ahmed Tinubu", party: "APC" },
];

const ZONES = ["North-West", "North-East", "North-Central", "South-West", "South-East", "South-South"] as const;
const STATES_BY_ZONE: Record<string, string[]> = {
  "North-West": ["Kano", "Kaduna", "Katsina", "Sokoto", "Zamfara"],
  "North-East": ["Borno", "Yobe", "Adamawa", "Bauchi", "Gombe"],
  "North-Central": ["Plateau", "Benue", "Nasarawa", "Kogi", "FCT"],
  "South-West": ["Lagos", "Oyo", "Ogun", "Osun", "Ondo"],
  "South-East": ["Anambra", "Enugu", "Imo", "Abia", "Ebonyi"],
  "South-South": ["Rivers", "Delta", "Bayelsa", "Akwa Ibom", "Edo"],
};
const PEOPLE = ["Amina Yusuf", "Chinedu Okeke", "Fatima Bello", "Ibrahim Musa", "Ngozi Eze", "Tunde Adebayo", "Hauwa Abdullahi", "Emeka Nwosu"];
const INCIDENT_CATS = ["Safety", "Security", "Infrastructure", "Community", "Health", "Logistics", "Operations", "Governance", "Other"] as const;

function daysOffsetFrom(isoDate: string, offsetDays: number, hour = 10): string {
  const d = new Date(isoDate + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() + offsetDays);
  d.setUTCHours(hour, 0, 0, 0);
  return d.toISOString();
}
function ymdFromIso(iso: string): string {
  return iso.slice(0, 10);
}

export async function ensureSeeded(sql: Sql) {
  const existing = await sql<{ n: number }>`select count(*)::int as n from form_schemas`;
  if ((existing[0]?.n ?? 0) > 0) return;

  for (const schema of SEEDED_SCHEMAS) {
    await sql`
      insert into form_schemas (slug, name, description, fields)
      values (${schema.slug}, ${schema.name}, ${schema.description}, ${JSON.stringify(schema.fields)}::jsonb)
    `;
  }
  const schemas = await sql<{ id: number; slug: string; fields: FieldDef[] }>`select id, slug, fields from form_schemas`;
  const bySlug = Object.fromEntries(schemas.map((s) => [s.slug, s]));
  const incident = bySlug.incident!, feedback = bySlug.feedback!, inspection = bySlug.inspection!;
  const rng = mulberry32(19990227);
  const rows: any[] = [];

  for (const win of ELECTION_WINDOWS) {
    const year = win.year, baseDate = win.date;
    for (let i = 0; i < 10; i++) {
      const region = pick(rng, [...ZONES]);
      const state = pick(rng, STATES_BY_ZONE[region]!);
      const category = pick(rng, [...INCIDENT_CATS]);
      let severity = pick(rng, ["low", "medium", "medium", "high", "critical"]);
      if (year === "2011" && (category === "Security" || category === "Safety")) severity = pick(rng, ["high", "critical"]);
      if (year === "2023" && category === "Logistics") severity = pick(rng, ["medium", "high"]);
      const people_affected =
        severity === "critical" ? 200 + Math.floor(rng() * 1500) : severity === "high" ? 40 + Math.floor(rng() * 180) : Math.floor(rng() * 25);
      const created = daysOffsetFrom(baseDate, Math.floor(rng() * 4) - 1, 8 + Math.floor(rng() * 10));
      const site = `${state} — ${pick(rng, ["Central LGA", "Urban Ward", "Polling cluster", "Facility"])}`;
      const follow = severity === "high" || severity === "critical";
      const payload = {
        occurred_at: ymdFromIso(created),
        region,
        site,
        category,
        severity,
        people_affected,
        description: `${category} incident linked to the ${year} election cycle in ${site}. ${people_affected} people affected. Context: national outcome ${win.winner} (${win.party}). Field team notified authorities.`,
        follow_up_needed: follow,
        follow_up_notes: follow ? `Escalate to regional lead and document chain of custody for ${site}.` : "",
      };
      const quarantined = region === "South-East" && year === "2023" && rng() > 0.75;
      rows.push({
        schema_id: incident.id,
        submitted_by: "seed-field-team",
        submitter_name: pick(rng, PEOPLE),
        channel: "form",
        status: quarantined ? "quarantined" : "accepted",
        payload,
        validation_errors: quarantined ? [{ field: "description", message: "Insufficient corroborating detail" }] : null,
        region,
        category,
        severity,
        quality_score: quarantined ? 50 : 75 + Math.floor(rng() * 20),
        ai_notes: `${severity} ${category} in ${state} (${region}), ${year}. ${people_affected} affected.`,
        ai_model: "rules-v1",
        ai_reviewed_at: created,
        created_at: created,
      });
    }
    for (let i = 0; i < 7; i++) {
      const region = pick(rng, [...ZONES]);
      const state = pick(rng, STATES_BY_ZONE[region]!);
      const topic = pick(rng, ["Service quality", "Access", "Safety", "Communication", "Infrastructure", "Staff conduct", "Other"]);
      const satisfaction =
        year === "2015" ? 3 + Math.floor(rng() * 3) : year === "2007" || year === "2023" ? 1 + Math.floor(rng() * 3) : 2 + Math.floor(rng() * 3);
      const created = daysOffsetFrom(baseDate, Math.floor(rng() * 5) - 1, 10);
      const payload = {
        collected_at: ymdFromIso(created),
        region,
        site: state,
        topic,
        satisfaction,
        comments: `Feedback on ${topic.toLowerCase()} in ${state} around the ${year} process. Satisfaction ${satisfaction}/5.`,
        would_recommend: satisfaction >= 4 ? "yes" : satisfaction === 3 ? "unsure" : "no",
      };
      rows.push({
        schema_id: feedback.id,
        submitted_by: "seed-field-team",
        submitter_name: pick(rng, PEOPLE),
        channel: "form",
        status: "accepted",
        payload,
        validation_errors: null,
        region,
        category: topic,
        severity: null,
        quality_score: 80 + Math.floor(rng() * 15),
        ai_notes: `Satisfaction ${satisfaction}/5 on ${topic} in ${state}, ${year}.`,
        ai_model: "rules-v1",
        ai_reviewed_at: created,
        created_at: created,
      });
    }
    for (let i = 0; i < 5; i++) {
      const region = pick(rng, [...ZONES]);
      const state = pick(rng, STATES_BY_ZONE[region]!);
      let baseScore = 6 + Math.floor(rng() * 3);
      if (year === "2015") baseScore = Math.min(10, baseScore + 1);
      if (year === "2007") baseScore = Math.max(3, baseScore - 2);
      if (year === "2023" && (region === "South-East" || region === "South-South")) baseScore = Math.max(3, baseScore - 1);
      const issues = Math.max(0, 8 - baseScore + Math.floor(rng() * 3));
      const outcome = baseScore >= 8 ? "pass" : baseScore >= 5 ? "conditional" : "fail";
      const created = daysOffsetFrom(baseDate, Math.floor(rng() * 2), 17);
      const payload = {
        inspected_at: ymdFromIso(created),
        region,
        site: state,
        overall_score: baseScore,
        issues_found: issues,
        outcome,
        notes: `Review of ${state} (${region}) for ${year}: score ${baseScore}/10, ${issues} issues, outcome ${outcome}. Reference cycle winner ${win.winner} (${win.party}).`,
      };
      rows.push({
        schema_id: inspection.id,
        submitted_by: "seed-observer-mission",
        submitter_name: pick(rng, PEOPLE),
        channel: "form",
        status: "accepted",
        payload,
        validation_errors: null,
        region,
        category: "Operations",
        severity: outcome === "fail" ? "high" : outcome === "conditional" ? "medium" : "low",
        quality_score: 82 + Math.floor(rng() * 14),
        ai_notes: `Review ${baseScore}/10, ${outcome}, ${state}, ${year}.`,
        ai_model: "rules-v1",
        ai_reviewed_at: created,
        created_at: created,
      });
    }
  }

  for (const r of rows) {
    await sql`
      insert into submissions (
        schema_id, submitted_by, submitter_name, channel, status, payload,
        validation_errors, region, category, severity, quality_score,
        ai_notes, ai_model, ai_reviewed_at, is_seed, created_at, updated_at
      ) values (
        ${r.schema_id}, ${r.submitted_by}, ${r.submitter_name}, ${r.channel}, ${r.status},
        ${JSON.stringify(r.payload)}::jsonb,
        ${r.validation_errors ? JSON.stringify(r.validation_errors) : null}::jsonb,
        ${r.region}, ${r.category}, ${r.severity}, ${r.quality_score},
        ${r.ai_notes}, ${r.ai_model}, ${r.ai_reviewed_at}, true,
        ${r.created_at}, ${r.created_at}
      )
    `;
  }

  const facts = {
    total_seed_records: rows.length,
    accepted: rows.filter((r) => r.status === "accepted").length,
    cycles: ELECTION_WINDOWS.map((w) => w.year),
  };
  await sql`
    insert into ai_summaries (title, period_start, period_end, trigger, facts, narrative, sources, confidence, model, prompt_version, created_by)
    values (
      ${"Seeded archive overview"}, ${"1999-02-27"}, ${"2023-02-25"}, ${"scheduled"},
      ${JSON.stringify(facts)}::jsonb,
      ${"Demo data includes general incident, feedback, and review records with Nigerian election-cycle context in narratives (1999–2023). Forms themselves are general-purpose for any operations reporting."},
      ${JSON.stringify([{ kind: "metric", id: "seed", label: "Seed volume" }])}::jsonb,
      ${"high"}, ${"facts-v1"}, ${"v1"}, ${"seed"}
    )
  `;
  await sql`insert into app_settings (key, value) values
    ('analysis_model', ${JSON.stringify("gpt-4o-mini")}::jsonb),
    ('chat_model', ${JSON.stringify("gpt-4o-mini")}::jsonb),
    ('rejection_alert_pct', ${JSON.stringify(10)}::jsonb)
    on conflict (key) do nothing`;
}
