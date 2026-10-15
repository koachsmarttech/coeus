import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { t as authMiddleware } from "./middleware-BkX_5rlx.mjs";
import { r as getSql } from "./db-B3yj9Ymj.mjs";
import { n as DEFAULT_SETTINGS, t as AI_MODELS } from "./types-BpuhrmLu.mjs";
import { a as sanitizePayload, i as parseCsv, o as validatePayload, t as canonicalRegion } from "./validation-BcFovzVK.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/api-CwYoyvoe.js
/** Broad region list — works for general ops and Nigerian zonal reporting. */
var REGION_OPTIONS = [
	"North-West",
	"North-East",
	"North-Central",
	"South-West",
	"South-East",
	"South-South",
	"West",
	"East",
	"North",
	"South",
	"Central",
	"Other"
];
var INCIDENT_FIELDS = [
	{
		key: "occurred_at",
		label: "Date of incident",
		type: "date",
		required: true
	},
	{
		key: "region",
		label: "Region / zone",
		type: "select",
		required: true,
		options: [...REGION_OPTIONS]
	},
	{
		key: "site",
		label: "Location (site, LGA, facility, or unit)",
		type: "text",
		required: true,
		minLength: 2
	},
	{
		key: "category",
		label: "Category",
		type: "select",
		required: true,
		options: [
			"Safety",
			"Security",
			"Infrastructure",
			"Community",
			"Health",
			"Logistics",
			"Operations",
			"Governance",
			"Other"
		]
	},
	{
		key: "severity",
		label: "Severity",
		type: "select",
		required: true,
		options: [
			"low",
			"medium",
			"high",
			"critical"
		]
	},
	{
		key: "people_affected",
		label: "People affected",
		type: "number",
		required: true,
		min: 0,
		max: 1e5,
		help: "Use 0 if nobody was directly affected."
	},
	{
		key: "description",
		label: "What happened",
		type: "textarea",
		required: true,
		minLength: 20
	},
	{
		key: "follow_up_needed",
		label: "Follow-up required",
		type: "boolean"
	},
	{
		key: "follow_up_notes",
		label: "Follow-up notes",
		type: "textarea",
		minLength: 10,
		showIf: {
			key: "follow_up_needed",
			equals: true
		},
		requiredIf: {
			key: "follow_up_needed",
			equals: true
		}
	}
];
var FEEDBACK_FIELDS = [
	{
		key: "collected_at",
		label: "Date collected",
		type: "date",
		required: true
	},
	{
		key: "region",
		label: "Region / zone",
		type: "select",
		required: true,
		options: [...REGION_OPTIONS]
	},
	{
		key: "site",
		label: "Community / site",
		type: "text",
		required: true,
		minLength: 2
	},
	{
		key: "topic",
		label: "Topic",
		type: "select",
		required: true,
		options: [
			"Service quality",
			"Access",
			"Safety",
			"Communication",
			"Infrastructure",
			"Staff conduct",
			"Other"
		]
	},
	{
		key: "satisfaction",
		label: "Satisfaction (1–5)",
		type: "number",
		required: true,
		min: 1,
		max: 5
	},
	{
		key: "comments",
		label: "Comments",
		type: "textarea",
		required: true,
		minLength: 12
	},
	{
		key: "would_recommend",
		label: "Would recommend / trust again",
		type: "select",
		required: true,
		options: [
			"yes",
			"no",
			"unsure"
		]
	}
];
var INSPECTION_FIELDS = [
	{
		key: "inspected_at",
		label: "Inspection / review date",
		type: "date",
		required: true
	},
	{
		key: "region",
		label: "Region / zone",
		type: "select",
		required: true,
		options: [...REGION_OPTIONS]
	},
	{
		key: "site",
		label: "Site / unit",
		type: "text",
		required: true,
		minLength: 2
	},
	{
		key: "overall_score",
		label: "Overall score (1–10)",
		type: "number",
		required: true,
		min: 1,
		max: 10
	},
	{
		key: "issues_found",
		label: "Issues found",
		type: "number",
		required: true,
		min: 0,
		max: 100
	},
	{
		key: "outcome",
		label: "Outcome",
		type: "select",
		required: true,
		options: [
			"pass",
			"conditional",
			"fail",
			"credible",
			"partially credible",
			"not credible"
		]
	},
	{
		key: "notes",
		label: "Notes",
		type: "textarea",
		required: true,
		minLength: 16
	}
];
var SEEDED_SCHEMAS = [
	{
		slug: "incident",
		name: "Incident report",
		description: "General incident intake — safety, security, operations, community, logistics, and related events.",
		fields: INCIDENT_FIELDS
	},
	{
		slug: "feedback",
		name: "Community / stakeholder feedback",
		description: "Satisfaction and comments from communities, staff, or stakeholders.",
		fields: FEEDBACK_FIELDS
	},
	{
		slug: "inspection",
		name: "Site / process review",
		description: "Structured walk-through scores, issue counts, and outcome notes.",
		fields: INSPECTION_FIELDS
	}
];
function mulberry32(seed) {
	return () => {
		let t = seed += 1831565813;
		t = Math.imul(t ^ t >>> 15, t | 1);
		t ^= t + Math.imul(t ^ t >>> 7, t | 61);
		return ((t ^ t >>> 14) >>> 0) / 4294967296;
	};
}
function pick(rng, list) {
	return list[Math.floor(rng() * list.length)];
}
var ELECTION_WINDOWS = [
	{
		year: "1999",
		date: "1999-02-27",
		winner: "Olusegun Obasanjo",
		party: "PDP"
	},
	{
		year: "2003",
		date: "2003-04-19",
		winner: "Olusegun Obasanjo",
		party: "PDP"
	},
	{
		year: "2007",
		date: "2007-04-21",
		winner: "Umaru Musa Yar'Adua",
		party: "PDP"
	},
	{
		year: "2011",
		date: "2011-04-16",
		winner: "Goodluck Jonathan",
		party: "PDP"
	},
	{
		year: "2015",
		date: "2015-03-28",
		winner: "Muhammadu Buhari",
		party: "APC"
	},
	{
		year: "2019",
		date: "2019-02-23",
		winner: "Muhammadu Buhari",
		party: "APC"
	},
	{
		year: "2023",
		date: "2023-02-25",
		winner: "Bola Ahmed Tinubu",
		party: "APC"
	}
];
var ZONES = [
	"North-West",
	"North-East",
	"North-Central",
	"South-West",
	"South-East",
	"South-South"
];
var STATES_BY_ZONE = {
	"North-West": [
		"Kano",
		"Kaduna",
		"Katsina",
		"Sokoto",
		"Zamfara"
	],
	"North-East": [
		"Borno",
		"Yobe",
		"Adamawa",
		"Bauchi",
		"Gombe"
	],
	"North-Central": [
		"Plateau",
		"Benue",
		"Nasarawa",
		"Kogi",
		"FCT"
	],
	"South-West": [
		"Lagos",
		"Oyo",
		"Ogun",
		"Osun",
		"Ondo"
	],
	"South-East": [
		"Anambra",
		"Enugu",
		"Imo",
		"Abia",
		"Ebonyi"
	],
	"South-South": [
		"Rivers",
		"Delta",
		"Bayelsa",
		"Akwa Ibom",
		"Edo"
	]
};
var PEOPLE = [
	"Amina Yusuf",
	"Chinedu Okeke",
	"Fatima Bello",
	"Ibrahim Musa",
	"Ngozi Eze",
	"Tunde Adebayo",
	"Hauwa Abdullahi",
	"Emeka Nwosu"
];
var INCIDENT_CATS = [
	"Safety",
	"Security",
	"Infrastructure",
	"Community",
	"Health",
	"Logistics",
	"Operations",
	"Governance",
	"Other"
];
function daysOffsetFrom(isoDate, offsetDays, hour = 10) {
	const d = /* @__PURE__ */ new Date(isoDate + "T12:00:00Z");
	d.setUTCDate(d.getUTCDate() + offsetDays);
	d.setUTCHours(hour, 0, 0, 0);
	return d.toISOString();
}
function ymdFromIso(iso) {
	return iso.slice(0, 10);
}
async function ensureSeeded(sql) {
	if (((await sql`select count(*)::int as n from form_schemas`)[0]?.n ?? 0) > 0) return;
	for (const schema of SEEDED_SCHEMAS) await sql`
      insert into form_schemas (slug, name, description, fields)
      values (${schema.slug}, ${schema.name}, ${schema.description}, ${JSON.stringify(schema.fields)}::jsonb)
    `;
	const schemas = await sql`select id, slug, fields from form_schemas`;
	const bySlug = Object.fromEntries(schemas.map((s) => [s.slug, s]));
	const incident = bySlug.incident, feedback = bySlug.feedback, inspection = bySlug.inspection;
	const rng = mulberry32(19990227);
	const rows = [];
	for (const win of ELECTION_WINDOWS) {
		const year = win.year, baseDate = win.date;
		for (let i = 0; i < 10; i++) {
			const region = pick(rng, [...ZONES]);
			const state = pick(rng, STATES_BY_ZONE[region]);
			const category = pick(rng, [...INCIDENT_CATS]);
			let severity = pick(rng, [
				"low",
				"medium",
				"medium",
				"high",
				"critical"
			]);
			if (year === "2011" && (category === "Security" || category === "Safety")) severity = pick(rng, ["high", "critical"]);
			if (year === "2023" && category === "Logistics") severity = pick(rng, ["medium", "high"]);
			const people_affected = severity === "critical" ? 200 + Math.floor(rng() * 1500) : severity === "high" ? 40 + Math.floor(rng() * 180) : Math.floor(rng() * 25);
			const created = daysOffsetFrom(baseDate, Math.floor(rng() * 4) - 1, 8 + Math.floor(rng() * 10));
			const site = `${state} — ${pick(rng, [
				"Central LGA",
				"Urban Ward",
				"Polling cluster",
				"Facility"
			])}`;
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
				follow_up_notes: follow ? `Escalate to regional lead and document chain of custody for ${site}.` : ""
			};
			const quarantined = region === "South-East" && year === "2023" && rng() > .75;
			rows.push({
				schema_id: incident.id,
				submitted_by: "seed-field-team",
				submitter_name: pick(rng, PEOPLE),
				channel: "form",
				status: quarantined ? "quarantined" : "accepted",
				payload,
				validation_errors: quarantined ? [{
					field: "description",
					message: "Insufficient corroborating detail"
				}] : null,
				region,
				category,
				severity,
				quality_score: quarantined ? 50 : 75 + Math.floor(rng() * 20),
				ai_notes: `${severity} ${category} in ${state} (${region}), ${year}. ${people_affected} affected.`,
				ai_model: "rules-v1",
				ai_reviewed_at: created,
				created_at: created
			});
		}
		for (let i = 0; i < 7; i++) {
			const region = pick(rng, [...ZONES]);
			const state = pick(rng, STATES_BY_ZONE[region]);
			const topic = pick(rng, [
				"Service quality",
				"Access",
				"Safety",
				"Communication",
				"Infrastructure",
				"Staff conduct",
				"Other"
			]);
			const satisfaction = year === "2015" ? 3 + Math.floor(rng() * 3) : year === "2007" || year === "2023" ? 1 + Math.floor(rng() * 3) : 2 + Math.floor(rng() * 3);
			const created = daysOffsetFrom(baseDate, Math.floor(rng() * 5) - 1, 10);
			const payload = {
				collected_at: ymdFromIso(created),
				region,
				site: state,
				topic,
				satisfaction,
				comments: `Feedback on ${topic.toLowerCase()} in ${state} around the ${year} process. Satisfaction ${satisfaction}/5.`,
				would_recommend: satisfaction >= 4 ? "yes" : satisfaction === 3 ? "unsure" : "no"
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
				created_at: created
			});
		}
		for (let i = 0; i < 5; i++) {
			const region = pick(rng, [...ZONES]);
			const state = pick(rng, STATES_BY_ZONE[region]);
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
				notes: `Review of ${state} (${region}) for ${year}: score ${baseScore}/10, ${issues} issues, outcome ${outcome}. Reference cycle winner ${win.winner} (${win.party}).`
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
				created_at: created
			});
		}
	}
	for (const r of rows) await sql`
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
	const facts = {
		total_seed_records: rows.length,
		accepted: rows.filter((r) => r.status === "accepted").length,
		cycles: ELECTION_WINDOWS.map((w) => w.year)
	};
	await sql`
    insert into ai_summaries (title, period_start, period_end, trigger, facts, narrative, sources, confidence, model, prompt_version, created_by)
    values (
      ${"Seeded archive overview"}, ${"1999-02-27"}, ${"2023-02-25"}, ${"scheduled"},
      ${JSON.stringify(facts)}::jsonb,
      ${"Demo data includes general incident, feedback, and review records with Nigerian election-cycle context in narratives (1999–2023). Forms themselves are general-purpose for any operations reporting."},
      ${JSON.stringify([{
		kind: "metric",
		id: "seed",
		label: "Seed volume"
	}])}::jsonb,
      ${"high"}, ${"facts-v1"}, ${"v1"}, ${"seed"}
    )
  `;
	await sql`insert into app_settings (key, value) values
    ('analysis_model', ${JSON.stringify("gpt-4o-mini")}::jsonb),
    ('chat_model', ${JSON.stringify("gpt-4o-mini")}::jsonb),
    ('rejection_alert_pct', ${JSON.stringify(10)}::jsonb)
    on conflict (key) do nothing`;
}
/**
* LLM client for Coeus.
* Prefers OpenAI when OPENAI_API_KEY is set; otherwise uses xAI when XAI_API_KEY is set.
* Chat Completions-compatible for both.
*/
var OPENAI_BASE = "https://api.openai.com/v1";
var XAI_BASE = "https://api.x.ai/v1";
function aiConfigured() {
	return Boolean(process.env.OPENAI_API_KEY || process.env.XAI_API_KEY);
}
function resolveProvider(model) {
	const openaiKey = process.env.OPENAI_API_KEY;
	const xaiKey = process.env.XAI_API_KEY;
	const m = (model || "").toLowerCase();
	const wantsGrok = m.startsWith("grok");
	const wantsOpenAI = m.startsWith("gpt") || m.startsWith("o1") || m.startsWith("o3") || m.startsWith("chatgpt");
	if (wantsGrok && xaiKey) return {
		base: XAI_BASE,
		apiKey: xaiKey,
		label: "xAI",
		model: model || "grok-4.5"
	};
	if (wantsOpenAI && openaiKey) return {
		base: OPENAI_BASE,
		apiKey: openaiKey,
		label: "OpenAI",
		model: model || "gpt-4o-mini"
	};
	if (openaiKey) return {
		base: OPENAI_BASE,
		apiKey: openaiKey,
		label: "OpenAI",
		model: wantsGrok ? "gpt-4o-mini" : model && !wantsGrok ? model : "gpt-4o-mini"
	};
	if (xaiKey) return {
		base: XAI_BASE,
		apiKey: xaiKey,
		label: "xAI",
		model: wantsOpenAI ? "grok-4.5" : model || "grok-4.5"
	};
	return null;
}
function estimateCents(model, input, output) {
	const r = {
		"gpt-4o-mini": {
			in: .15,
			out: .6
		},
		"gpt-4o": {
			in: 2.5,
			out: 10
		},
		"gpt-4.1-mini": {
			in: .4,
			out: 1.6
		},
		"grok-4.5": {
			in: 3,
			out: 15
		},
		"grok-4.7": {
			in: 2,
			out: 6
		}
	}[model] ?? {
		in: 1,
		out: 3
	};
	return Math.max(0, input / 1e6 * r.in * 100 + output / 1e6 * r.out * 100);
}
async function grokChat(opts) {
	const provider = resolveProvider(opts.model);
	if (!provider) return {
		ok: false,
		error: "AI is not available. Set OPENAI_API_KEY or XAI_API_KEY in the environment."
	};
	const tryModel = async (model) => {
		return await fetch(`${provider.base}/chat/completions`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${provider.apiKey}`
			},
			body: JSON.stringify({
				model,
				messages: opts.messages,
				max_tokens: opts.max_tokens,
				temperature: opts.temperature ?? .2
			})
		});
	};
	let model = provider.model;
	let res = await tryModel(model);
	if (!res.ok && res.status === 404) {
		const fallback = provider.label === "OpenAI" ? "gpt-4o-mini" : "grok-4.5";
		if (model !== fallback) {
			model = fallback;
			res = await tryModel(model);
		}
	}
	if (!res.ok) {
		const body = await res.text().catch(() => "");
		return {
			ok: false,
			error: `${provider.label} API error ${res.status}${body ? `: ${body.slice(0, 220)}` : ""}`
		};
	}
	const json = await res.json();
	const text = json.choices?.[0]?.message?.content?.trim() ?? "";
	const input = json.usage?.prompt_tokens ?? 0;
	const output = json.usage?.completion_tokens ?? 0;
	return {
		ok: true,
		text,
		model: `${provider.label}:${model}`,
		input_tokens: input,
		output_tokens: output,
		cost_cents: estimateCents(model, input, output)
	};
}
async function grokTts(text, voice = "alloy") {
	const openaiKey = process.env.OPENAI_API_KEY;
	const xaiKey = process.env.XAI_API_KEY;
	const clipped = text.slice(0, 900);
	if (openaiKey) {
		const res = await fetch(`${OPENAI_BASE}/audio/speech`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${openaiKey}`
			},
			body: JSON.stringify({
				model: "gpt-4o-mini-tts",
				input: clipped,
				voice: voice === "eve" ? "alloy" : voice
			})
		});
		if (!res.ok) {
			const res2 = await fetch(`${OPENAI_BASE}/audio/speech`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${openaiKey}`
				},
				body: JSON.stringify({
					model: "tts-1",
					input: clipped,
					voice: "alloy"
				})
			});
			if (!res2.ok) return {
				ok: false,
				error: `OpenAI Voice API error ${res2.status}`
			};
			const buf = Buffer.from(await res2.arrayBuffer());
			return {
				ok: true,
				mime: res2.headers.get("content-type") || "audio/mpeg",
				b64: buf.toString("base64")
			};
		}
		const buf = Buffer.from(await res.arrayBuffer());
		return {
			ok: true,
			mime: res.headers.get("content-type") || "audio/mpeg",
			b64: buf.toString("base64")
		};
	}
	if (xaiKey) {
		const res = await fetch(`${XAI_BASE}/tts`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${xaiKey}`
			},
			body: JSON.stringify({
				text: clipped,
				voice_id: voice,
				language: "en"
			})
		});
		if (!res.ok) return {
			ok: false,
			error: `Voice API error ${res.status}`
		};
		const buf = Buffer.from(await res.arrayBuffer());
		return {
			ok: true,
			mime: res.headers.get("content-type") || "audio/mpeg",
			b64: buf.toString("base64")
		};
	}
	return {
		ok: false,
		error: "Voice is not available. Set OPENAI_API_KEY or XAI_API_KEY."
	};
}
function asRole(real, viewAs) {
	if (real === "admin" && viewAs && [
		"submitter",
		"analyst",
		"admin"
	].includes(viewAs)) return viewAs;
	return real;
}
function parseFields(raw) {
	if (Array.isArray(raw)) return raw;
	if (typeof raw === "string") try {
		return JSON.parse(raw);
	} catch {
		return [];
	}
	return [];
}
function parseJson(raw, fallback) {
	if (raw === null || raw === void 0) return fallback;
	if (typeof raw === "string") try {
		return JSON.parse(raw);
	} catch {
		return fallback;
	}
	return raw;
}
function num(v, fallback = 0) {
	const n = typeof v === "number" ? v : Number(v);
	return Number.isFinite(n) ? n : fallback;
}
async function loadActor(userId, viewAs) {
	const sql = await getSql();
	await ensureSeeded(sql);
	let profile = (await sql`
    select user_id, email, name, role, created_at::text as created_at
    from profiles where user_id = ${userId}
  `)[0];
	if (!profile) {
		await sql`
      insert into profiles (user_id, role, name)
      values (${userId}, ${((await sql`select count(*)::int as n from profiles`)[0]?.n ?? 0) === 0 ? "admin" : "submitter"}, ${"Member"})
      on conflict (user_id) do nothing
    `;
		profile = (await sql`
      select user_id, email, name, role, created_at::text as created_at
      from profiles where user_id = ${userId}
    `)[0];
	}
	return {
		userId,
		profile,
		role: asRole(profile.role, viewAs)
	};
}
async function writeAudit(actorId, action, entity_type, entity_id, details) {
	await (await getSql())`
    insert into audit_events (actor_id, action, entity_type, entity_id, details)
    values (
      ${actorId}, ${action}, ${entity_type}, ${entity_id},
      ${details ? JSON.stringify(details) : null}::jsonb
    )
  `;
}
async function logUsage(userId, purpose, model, input, output, cost) {
	await (await getSql())`
    insert into ai_usage (user_id, purpose, model, input_tokens, output_tokens, cost_cents)
    values (${userId}, ${purpose}, ${model}, ${input}, ${output}, ${cost})
  `;
}
async function getSettings() {
	const rows = await (await getSql())`select key, value from app_settings`;
	const map = Object.fromEntries(rows.map((r) => [r.key, parseJson(r.value, null)]));
	return {
		analysis_model: String(map.analysis_model ?? DEFAULT_SETTINGS.analysis_model),
		chat_model: String(map.chat_model ?? DEFAULT_SETTINGS.chat_model),
		rejection_alert_pct: num(map.rejection_alert_pct, DEFAULT_SETTINGS.rejection_alert_pct)
	};
}
async function findDuplicateId(schemaId, payload) {
	const site = String(payload.site ?? payload.lga_or_site ?? payload.state ?? "").trim().toLowerCase();
	const date = String(payload.occurred_at ?? payload.collected_at ?? payload.inspected_at ?? payload.observed_at ?? "").slice(0, 10);
	const cat = String(payload.category ?? payload.topic ?? "").trim().toLowerCase();
	if (!site || !date) return null;
	const rows = await (await getSql())`
    select id, payload from submissions
    where schema_id = ${schemaId} and status <> 'rejected'
    order by id desc
    limit 120
  `;
	for (const r of rows) {
		const p = parseJson(r.payload, {});
		const s = String(p.site ?? p.lga_or_site ?? p.state ?? "").trim().toLowerCase();
		const d = String(p.occurred_at ?? p.collected_at ?? p.inspected_at ?? p.observed_at ?? "").slice(0, 10);
		const c = String(p.category ?? p.topic ?? "").trim().toLowerCase();
		if (s === site && d === date && (cat ? c === cat : true)) return r.id;
	}
	return null;
}
function mapSubmission(row) {
	return {
		id: num(row.id),
		schema_id: num(row.schema_id),
		schema_name: row.schema_name ?? void 0,
		submitted_by: String(row.submitted_by ?? ""),
		submitter_name: String(row.submitter_name ?? ""),
		channel: row.channel ?? "form",
		status: row.status ?? "pending_review",
		payload: parseJson(row.payload, {}),
		validation_errors: parseJson(row.validation_errors, null),
		region: row.region ?? null,
		category: row.category ?? null,
		severity: row.severity ?? null,
		quality_score: row.quality_score === null ? null : num(row.quality_score),
		ai_notes: row.ai_notes ?? null,
		ai_model: row.ai_model ?? null,
		ai_reviewed_at: row.ai_reviewed_at ?? null,
		is_seed: Boolean(row.is_seed),
		created_at: String(row.created_at ?? ""),
		updated_at: String(row.updated_at ?? "")
	};
}
var getBootstrap_createServerFn_handler = createServerRpc({
	id: "0f126b670cc421131c95d756351f046466fb5fc3761136b7e6215a6d7f62704b",
	name: "getBootstrap",
	filename: "src/lib/api.ts"
}, (opts) => getBootstrap.__executeServer(opts));
var getBootstrap = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((data) => data ?? {}).handler(getBootstrap_createServerFn_handler, async ({ context, data }) => {
	const actor = await loadActor(context.userId, data.viewAs);
	const schemas = await (await getSql())`select id, slug, name, description, version, fields, is_active from form_schemas order by id`;
	const settings = await getSettings();
	return {
		profile: actor.profile,
		effectiveRole: actor.role,
		schemas: schemas.map((s) => ({
			...s,
			fields: parseFields(s.fields)
		})),
		settings,
		aiAvailable: aiConfigured(),
		models: AI_MODELS
	};
});
var updateProfileMeta_createServerFn_handler = createServerRpc({
	id: "05d164b1d0af8d41bc90e32b1e9806ce8ed6cfb13b67edaa86df25d5c470d6b8",
	name: "updateProfileMeta",
	filename: "src/lib/api.ts"
}, (opts) => updateProfileMeta.__executeServer(opts));
var updateProfileMeta = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(updateProfileMeta_createServerFn_handler, async ({ context, data }) => {
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
var listMembers_createServerFn_handler = createServerRpc({
	id: "6f7cffd35695d85d5f0d1af0f47c5aea92ac1b349d6255ef2af992aa3a332bad",
	name: "listMembers",
	filename: "src/lib/api.ts"
}, (opts) => listMembers.__executeServer(opts));
var listMembers = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listMembers_createServerFn_handler, async ({ context }) => {
	if ((await loadActor(context.userId)).profile.role !== "admin") throw new Error("Forbidden");
	return (await getSql())`
      select user_id, email, name, role, created_at::text as created_at
      from profiles order by created_at
    `;
});
var setMemberRole_createServerFn_handler = createServerRpc({
	id: "4e593bab6a02d795bd74ed70aeb102dae06d7b579917050ad45b76656bc03c12",
	name: "setMemberRole",
	filename: "src/lib/api.ts"
}, (opts) => setMemberRole.__executeServer(opts));
var setMemberRole = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(setMemberRole_createServerFn_handler, async ({ context, data }) => {
	if ((await loadActor(context.userId)).profile.role !== "admin") throw new Error("Forbidden");
	if (![
		"submitter",
		"analyst",
		"admin"
	].includes(data.role)) throw new Error("Invalid role");
	await (await getSql())`
      update profiles set role = ${data.role}, updated_at = now()
      where user_id = ${data.user_id}
    `;
	await writeAudit(context.userId, "role.change", "profile", data.user_id, { role: data.role });
	return { ok: true };
});
var saveSettings_createServerFn_handler = createServerRpc({
	id: "a532d20924c3d1053795b75ee01b8637795b954c8640ae7f8d7fd8dfc36e324a",
	name: "saveSettings",
	filename: "src/lib/api.ts"
}, (opts) => saveSettings.__executeServer(opts));
var saveSettings = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(saveSettings_createServerFn_handler, async ({ context, data }) => {
	if ((await loadActor(context.userId)).profile.role !== "admin") throw new Error("Forbidden");
	const sql = await getSql();
	for (const [key, value] of Object.entries(data)) {
		if (value === void 0) continue;
		await sql`
        insert into app_settings (key, value, updated_by, updated_at)
        values (${key}, ${JSON.stringify(value)}::jsonb, ${context.userId}, now())
        on conflict (key) do update set value = excluded.value, updated_by = excluded.updated_by, updated_at = now()
      `;
	}
	await writeAudit(context.userId, "settings.update", "settings", "app", data);
	return getSettings();
});
async function refineWithAi(actor, schema, payload, model) {
	const facts = {
		schema: schema.name,
		payload,
		region: canonicalRegion(payload.region) ?? payload.region ?? null
	};
	const result = await grokChat({
		model,
		max_tokens: 180,
		messages: [{
			role: "system",
			content: "You refine operational submissions. Return 1-2 sentences: normalized takeaway, notable risk, and nothing invented. If the record is ordinary, say so. Never compute new numbers."
		}, {
			role: "user",
			content: JSON.stringify(facts)
		}]
	});
	if (result.ok) {
		await logUsage(actor.userId, "review", result.model, result.input_tokens, result.output_tokens, result.cost_cents);
		return {
			notes: result.text,
			model: result.model
		};
	}
	const region = canonicalRegion(payload.region) ?? String(payload.region ?? "Unknown");
	return {
		notes: `Rule-based review: ${schema.name} from ${region} accepted. AI narration unavailable.`,
		model: "rules-v1"
	};
}
var submitForm_createServerFn_handler = createServerRpc({
	id: "ffc27b78722ecd5514bcad0a8835067a10cd5e5e324427fa9da79fe4dc2781c9",
	name: "submitForm",
	filename: "src/lib/api.ts"
}, (opts) => submitForm.__executeServer(opts));
var submitForm = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(submitForm_createServerFn_handler, async ({ context, data }) => {
	const actor = await loadActor(context.userId, data.viewAs);
	if (actor.role !== "submitter" && actor.profile.role !== "admin") throw new Error("Only submitters can file reports.");
	const sql = await getSql();
	const raw = (await sql`select * from form_schemas where id = ${data.schema_id}`)[0];
	if (!raw) throw new Error("Unknown form.");
	const schema = {
		...raw,
		fields: parseFields(raw.fields)
	};
	const payload = sanitizePayload(schema.fields, data.payload);
	const errors = validatePayload(schema.fields, payload);
	const dup = await findDuplicateId(schema.id, payload);
	if (dup) errors.push({
		field: "site",
		message: `Possible duplicate of #${dup} (same site and date). Held for admin review.`
	});
	const settings = await getSettings();
	const status = errors.length ? "quarantined" : "pending_review";
	const region = canonicalRegion(payload.region);
	const category = String(payload.category ?? payload.topic ?? payload.status ?? "") || null;
	const severity = payload.severity ? String(payload.severity) : null;
	let ai_notes = null;
	let ai_model = null;
	let ai_reviewed_at = null;
	let finalStatus = status;
	if (errors.length === 0) {
		const refined = await refineWithAi(actor, schema, payload, settings.analysis_model);
		ai_notes = refined.notes;
		ai_model = refined.model;
		ai_reviewed_at = (/* @__PURE__ */ new Date()).toISOString();
		finalStatus = "accepted";
	}
	const id = (await sql`
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
    `)[0].id;
	await writeAudit(actor.userId, "submission.create", "submission", String(id), {
		status: finalStatus,
		channel: data.channel ?? "form"
	});
	return {
		id,
		status: finalStatus,
		errors
	};
});
var submitCsv_createServerFn_handler = createServerRpc({
	id: "9152789ef44f4fe526fb1b5979227f79743eafb97e124fd5469096f020238772",
	name: "submitCsv",
	filename: "src/lib/api.ts"
}, (opts) => submitCsv.__executeServer(opts));
var submitCsv = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(submitCsv_createServerFn_handler, async ({ context, data }) => {
	const actor = await loadActor(context.userId, data.viewAs);
	if (actor.role !== "submitter" && actor.profile.role !== "admin") throw new Error("Only submitters can upload reports.");
	const sql = await getSql();
	const raw = (await sql`select * from form_schemas where id = ${data.schema_id}`)[0];
	if (!raw) throw new Error("Unknown form.");
	const schema = {
		...raw,
		fields: parseFields(raw.fields)
	};
	const parsed = parseCsv(data.csv);
	if (parsed.rows.length === 0) throw new Error("The file has no data rows.");
	if (parsed.rows.length > 200) throw new Error("Please keep uploads to 200 rows.");
	const settings = await getSettings();
	const report = [];
	let accepted = 0;
	let quarantined = 0;
	for (let i = 0; i < parsed.rows.length; i += 1) {
		const payload = sanitizePayload(schema.fields, parsed.rows[i] ?? {});
		const errors = validatePayload(schema.fields, payload);
		const dup = await findDuplicateId(schema.id, payload);
		if (dup) errors.push({
			field: "site",
			message: `Possible duplicate of #${dup}.`
		});
		const status = errors.length ? "quarantined" : "pending_review";
		const region = canonicalRegion(payload.region);
		const category = String(payload.category ?? payload.topic ?? payload.status ?? "") || null;
		const inserted = await sql`
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
           ${errors.length ? null : (/* @__PURE__ */ new Date()).toISOString()},
           false
         ) returning id
       `;
		if (status === "pending_review") accepted += 1;
		else quarantined += 1;
		report.push({
			row: i + 2,
			status,
			errors,
			id: inserted[0]?.id
		});
	}
	if (accepted > 0) {
		const result = await grokChat({
			model: settings.analysis_model,
			max_tokens: 220,
			messages: [{
				role: "system",
				content: "Summarize a batch upload in 3 sentences using only the counts provided. Do not invent details."
			}, {
				role: "user",
				content: JSON.stringify({
					schema: schema.name,
					accepted,
					quarantined,
					total: parsed.rows.length
				})
			}]
		});
		if (result.ok) await logUsage(actor.userId, "review", result.model, result.input_tokens, result.output_tokens, result.cost_cents);
	}
	await writeAudit(actor.userId, "submission.batch", "schema", String(schema.id), {
		accepted,
		quarantined
	});
	return {
		accepted,
		quarantined,
		total: parsed.rows.length,
		report
	};
});
var listSubmissions_createServerFn_handler = createServerRpc({
	id: "0f11d35ad26297e7d987bd256b5493bb232d20d2ad83ae7712c187d62d963b96",
	name: "listSubmissions",
	filename: "src/lib/api.ts"
}, (opts) => listSubmissions.__executeServer(opts));
var listSubmissions = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((data) => data ?? {}).handler(listSubmissions_createServerFn_handler, async ({ context, data }) => {
	const actor = await loadActor(context.userId, data.viewAs);
	const sql = await getSql();
	const limit = Math.min(data.limit ?? 80, 200);
	let list = (await sql`
      select s.*, fs.name as schema_name,
             s.created_at::text as created_at, s.updated_at::text as updated_at,
             s.ai_reviewed_at::text as ai_reviewed_at
      from submissions s
      join form_schemas fs on fs.id = s.schema_id
      order by s.created_at desc
      limit 400
    `).map(mapSubmission);
	if (actor.role === "submitter") list = list.filter((s) => s.submitted_by === actor.userId);
	else if (actor.role === "analyst" || actor.role === "admin") list = list.filter((s) => s.status === "accepted");
	if (data.status && data.status !== "all") list = list.filter((s) => s.status === data.status);
	if (data.region) list = list.filter((s) => s.region === data.region);
	if (data.schema_id) list = list.filter((s) => s.schema_id === data.schema_id);
	if (data.q) {
		const q = data.q.toLowerCase();
		list = list.filter((s) => JSON.stringify(s.payload).toLowerCase().includes(q) || (s.submitter_name ?? "").toLowerCase().includes(q) || (s.region ?? "").toLowerCase().includes(q));
	}
	const counts = {
		accepted: list.filter((s) => s.status === "accepted").length,
		quarantined: list.filter((s) => s.status === "quarantined").length,
		pending: list.filter((s) => s.status === "pending_review").length,
		rejected: list.filter((s) => s.status === "rejected").length
	};
	return {
		total: list.length,
		rows: list.slice(0, limit),
		counts
	};
});
var getSubmission_createServerFn_handler = createServerRpc({
	id: "e9954ce31ba0a140a0465230830ad6511219bf6f4a48d22045e192556ae4aaf0",
	name: "getSubmission",
	filename: "src/lib/api.ts"
}, (opts) => getSubmission.__executeServer(opts));
var getSubmission = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((data) => data).handler(getSubmission_createServerFn_handler, async ({ context, data }) => {
	const actor = await loadActor(context.userId, data.viewAs);
	const row = (await (await getSql())`
      select s.*, fs.name as schema_name, fs.fields as schema_fields,
             s.created_at::text as created_at, s.updated_at::text as updated_at,
             s.ai_reviewed_at::text as ai_reviewed_at
      from submissions s
      join form_schemas fs on fs.id = s.schema_id
      where s.id = ${data.id}
    `)[0];
	if (!row) throw new Error("Not found");
	const sub = mapSubmission(row);
	if (actor.role === "submitter" && sub.submitted_by !== actor.userId) throw new Error("Not found");
	if (actor.role === "analyst" && sub.status !== "accepted") throw new Error("Not found");
	return {
		...sub,
		schema_fields: parseFields(row.schema_fields)
	};
});
var resolveQuarantine_createServerFn_handler = createServerRpc({
	id: "5b4a9321fb56ca1b7f7006823c09c0c2c4ee19ffe30f9cdd6ab3092bfc4b2009",
	name: "resolveQuarantine",
	filename: "src/lib/api.ts"
}, (opts) => resolveQuarantine.__executeServer(opts));
var resolveQuarantine = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(resolveQuarantine_createServerFn_handler, async ({ context, data }) => {
	if ((await loadActor(context.userId)).profile.role !== "admin") throw new Error("Forbidden");
	await (await getSql())`
      update submissions
      set status = ${data.action === "accept" ? "accepted" : "rejected"},
          ai_notes = coalesce(ai_notes, ${data.note ?? "Admin override."}),
          ai_reviewed_at = now(),
          updated_at = now()
      where id = ${data.id}
    `;
	await writeAudit(context.userId, "submission.resolve", "submission", String(data.id), { action: data.action });
	return { ok: true };
});
function startOfDay(d) {
	const x = new Date(d);
	x.setHours(0, 0, 0, 0);
	return x;
}
var getDashboard_createServerFn_handler = createServerRpc({
	id: "9702758c6fd0cb855b9213cc5e565c91c6cccffe5c6a276226117b92c405025e",
	name: "getDashboard",
	filename: "src/lib/api.ts"
}, (opts) => getDashboard.__executeServer(opts));
var getDashboard = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((data) => data ?? {}).handler(getDashboard_createServerFn_handler, async ({ context, data }) => {
	const actor = await loadActor(context.userId, data.viewAs);
	if (actor.role === "submitter") throw new Error("Dashboard is for analysts and admins.");
	const sql = await getSql();
	const days = data.days ?? 56;
	let list = (await sql`
      select s.*, s.created_at::text as created_at, s.payload
      from submissions s
      order by s.created_at
    `).map(mapSubmission);
	if (actor.role === "analyst") list = list.filter((s) => s.status === "accepted");
	const since = startOfDay(/* @__PURE__ */ new Date(Date.now() - days * 864e5));
	const inWindow = list.filter((s) => new Date(s.created_at) >= since);
	const weekSince = Date.now() - 6048e5;
	const prevWeekSince = Date.now() - 12096e5;
	const week = list.filter((s) => new Date(s.created_at).getTime() >= weekSince).length;
	const prevWeek = list.filter((s) => {
		const t = new Date(s.created_at).getTime();
		return t >= prevWeekSince && t < weekSince;
	}).length;
	const accepted = inWindow.filter((s) => s.status === "accepted").length;
	const quarantined = inWindow.filter((s) => s.status === "quarantined").length;
	const pending = inWindow.filter((s) => s.status === "pending_review").length;
	const decided = accepted + quarantined;
	const rejectRate = decided === 0 ? 0 : quarantined / decided * 100;
	const volumeMap = /* @__PURE__ */ new Map();
	for (let i = days - 1; i >= 0; i -= 1) {
		const key = (/* @__PURE__ */ new Date(Date.now() - i * 864e5)).toISOString().slice(0, 10);
		volumeMap.set(key, {
			accepted: 0,
			quarantined: 0,
			pending: 0
		});
	}
	for (const s of inWindow) {
		const key = s.created_at.slice(0, 10);
		const bucket = volumeMap.get(key);
		if (!bucket) continue;
		if (s.status === "accepted") bucket.accepted += 1;
		else if (s.status === "quarantined") bucket.quarantined += 1;
		else if (s.status === "pending_review") bucket.pending += 1;
	}
	const tally = (key) => {
		const m = /* @__PURE__ */ new Map();
		for (const s of inWindow) {
			const k = key(s) || "Unknown";
			m.set(k, (m.get(k) ?? 0) + 1);
		}
		return [...m.entries()].map(([k, count]) => ({
			label: k,
			count
		}));
	};
	const sat = /* @__PURE__ */ new Map();
	for (const s of inWindow) {
		const v = num(s.payload.satisfaction, 0);
		if (v >= 1 && v <= 5) sat.set(v, (sat.get(v) ?? 0) + 1);
	}
	const violenceCount = inWindow.filter((s) => s.category === "Violence" && s.status === "accepted").length;
	const lowSat = inWindow.filter((s) => num(s.payload.satisfaction, 5) <= 2).length;
	const seLogistics = inWindow.filter((s) => s.region === "South-East" && (s.category === "Logistics failure" || s.category === "Disenfranchisement")).length;
	const anomalies = [];
	if (violenceCount >= 5) anomalies.push({
		title: "Elevated election violence reports",
		detail: `${violenceCount} accepted Violence filings in this window across zones.`
	});
	if (lowSat >= 4) anomalies.push({
		title: "Low voter satisfaction",
		detail: `${lowSat} feedback records scored 1–2 on satisfaction (registration, polling, credibility).`
	});
	if (seLogistics >= 3) anomalies.push({
		title: "South-East logistics / access issues",
		detail: `${seLogistics} Logistics failure or Disenfranchisement reports from the South-East.`
	});
	if (rejectRate >= 8) anomalies.push({
		title: "Quarantine rate elevated",
		detail: `${rejectRate.toFixed(1)}% of checked filings were quarantined — review data quality on high-severity claims.`
	});
	return {
		kpis: {
			total: inWindow.length,
			accepted,
			quarantined,
			pending,
			week,
			prevWeek,
			rejectRate
		},
		volume: [...volumeMap.entries()].map(([date, v]) => ({
			date,
			...v
		})),
		byRegion: tally((s) => s.region).map((x) => ({
			region: x.label,
			count: x.count
		})),
		byCategory: tally((s) => s.category).map((x) => ({
			category: x.label,
			count: x.count
		})),
		bySeverity: tally((s) => s.severity).filter((x) => x.label !== "Unknown").map((x) => ({
			severity: x.label,
			count: x.count
		})),
		satisfaction: [
			1,
			2,
			3,
			4,
			5
		].map((score) => ({
			score,
			count: sat.get(score) ?? 0
		})),
		channels: tally((s) => s.channel).map((x) => ({
			channel: x.label,
			count: x.count
		})),
		anomalies
	};
});
async function computeFacts(actor) {
	const sql = await getSql();
	let list = (await sql`
    select s.*, s.created_at::text as created_at
    from submissions s
    order by s.created_at desc
    limit 500
  `).map(mapSubmission);
	if (actor.role === "submitter") list = list.filter((s) => s.submitted_by === actor.userId);
	else if (actor.role === "analyst") list = list.filter((s) => s.status === "accepted");
	const weekSince = Date.now() - 6048e5;
	const week = list.filter((s) => new Date(s.created_at).getTime() >= weekSince);
	const byRegion = /* @__PURE__ */ new Map();
	const byCategory = /* @__PURE__ */ new Map();
	for (const s of list) {
		byRegion.set(s.region ?? "Unknown", (byRegion.get(s.region ?? "Unknown") ?? 0) + 1);
		byCategory.set(s.category ?? "Unknown", (byCategory.get(s.category ?? "Unknown") ?? 0) + 1);
	}
	const usageRows = actor.role === "admin" ? await sql`
        select purpose, count(*)::int as calls, coalesce(sum(cost_cents),0)::float as cost_cents
        from ai_usage group by purpose
      ` : [];
	return {
		role: actor.role,
		kpis: {
			total: list.length,
			accepted: list.filter((s) => s.status === "accepted").length,
			quarantined: list.filter((s) => s.status === "quarantined").length,
			pending: list.filter((s) => s.status === "pending_review").length,
			week: week.length
		},
		byRegion: [...byRegion.entries()].map(([region, count]) => ({
			region,
			count
		})),
		byCategory: [...byCategory.entries()].map(([category, count]) => ({
			category,
			count
		})),
		recent: list.slice(0, 8).map((s) => ({
			id: s.id,
			status: s.status,
			region: s.region,
			category: s.category,
			summary: s.ai_notes ?? String(s.payload.description ?? s.payload.comments ?? s.payload.notes ?? "").slice(0, 160)
		})),
		usage: usageRows,
		settings: await getSettings()
	};
}
function fallbackNarrate(question, facts) {
	const topRegion = [...facts.byRegion].sort((a, b) => b.count - a.count)[0];
	return [
		`I can only speak to the numbers already calculated for your role (${facts.role}).`,
		`There are ${facts.kpis.total} visible records, ${facts.kpis.accepted} accepted, ${facts.kpis.quarantined} quarantined, ${facts.kpis.pending} pending review. ${facts.kpis.week} arrived in the last 7 days.`,
		topRegion ? `${topRegion.region} currently leads volume with ${topRegion.count} filings.` : "",
		facts.recent[0] ? `Most recent visible record: #${facts.recent[0].id} (${facts.recent[0].status}${facts.recent[0].region ? `, ${facts.recent[0].region}` : ""}).` : "No records are in scope yet.",
		`You asked: “${question.trim()}”. If that needs data outside this snapshot, I will not guess.`
	].filter(Boolean).join(" ");
}
function chartFromFacts(question, facts) {
	const q = question.toLowerCase();
	if (q.includes("region") || q.includes("area") || q.includes("where")) return {
		type: "bar",
		title: "Filings by region",
		xKey: "region",
		yKeys: [{
			key: "count",
			label: "Filings"
		}],
		data: facts.byRegion
	};
	if (q.includes("category") || q.includes("topic") || q.includes("type")) return {
		type: "bar",
		title: "Filings by category",
		xKey: "category",
		yKeys: [{
			key: "count",
			label: "Filings"
		}],
		data: facts.byCategory
	};
	return null;
}
var askQuestion_createServerFn_handler = createServerRpc({
	id: "9d25905dc9ea357681d58df510fa436e97096afc8a5448a191588ae22cf6fdd9",
	name: "askQuestion",
	filename: "src/lib/api.ts"
}, (opts) => askQuestion.__executeServer(opts));
var askQuestion = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(askQuestion_createServerFn_handler, async ({ context, data }) => {
	const actor = await loadActor(context.userId, data.viewAs);
	if (actor.role === "submitter") throw new Error("Chat is limited to analyst and admin roles.");
	const question = data.question.trim().slice(0, 800);
	if (!question) throw new Error("Ask a question first.");
	const sql = await getSql();
	let threadId = data.threadId ?? null;
	if (!threadId) threadId = (await sql`
        insert into chat_threads (user_id, title)
        values (${actor.userId}, ${question.slice(0, 72)})
        returning id
      `)[0].id;
	else if (!(await sql`
        select id from chat_threads where id = ${threadId} and user_id = ${actor.userId}
      `)[0]) throw new Error("Thread not found");
	await sql`
      insert into chat_messages (thread_id, user_id, role, content)
      values (${threadId}, ${actor.userId}, 'user', ${question})
    `;
	const history = await sql`
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
		actor.role === "analyst" ? "They cannot see pending or quarantined filings." : "They may hear operational counts including quarantine and AI usage.",
		"Keep answers under 180 words. Use short paragraphs."
	].join(" ");
	const result = await grokChat({
		model: settings.chat_model,
		max_tokens: 420,
		messages: [
			{
				role: "system",
				content: system
			},
			...history.reverse().slice(0, -1).map((m) => ({
				role: m.role === "assistant" ? "assistant" : "user",
				content: m.content
			})),
			{
				role: "user",
				content: `FACTS:\n${JSON.stringify(facts)}\n\nQUESTION:\n${question}`
			}
		]
	});
	const text = result.ok ? result.text : fallbackNarrate(question, facts);
	if (result.ok) await logUsage(actor.userId, "chat", result.model, result.input_tokens, result.output_tokens, result.cost_cents);
	const chart = chartFromFacts(question, facts);
	const sources = facts.recent.slice(0, 4).map((r) => ({
		kind: "submission",
		id: String(r.id),
		label: `#${r.id} ${r.region ?? ""} ${r.category ?? ""}`.trim()
	}));
	const saved = await sql`
      insert into chat_messages (thread_id, user_id, role, content, chart, sources)
      values (
        ${threadId}, ${actor.userId}, 'assistant', ${text},
        ${chart ? JSON.stringify(chart) : null}::jsonb,
        ${JSON.stringify(sources)}::jsonb
      )
      returning id, created_at::text as created_at
    `;
	const message = {
		id: saved[0].id,
		thread_id: threadId,
		role: "assistant",
		content: text,
		chart,
		sources,
		created_at: saved[0].created_at
	};
	return {
		threadId,
		message,
		grounded: result.ok
	};
});
var listThreads_createServerFn_handler = createServerRpc({
	id: "7d08711f3d33adf7fd91a5a96b1d737ad1dd45f20531e21b3059fcde7325811b",
	name: "listThreads",
	filename: "src/lib/api.ts"
}, (opts) => listThreads.__executeServer(opts));
var listThreads = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listThreads_createServerFn_handler, async ({ context }) => {
	await loadActor(context.userId);
	return (await getSql())`
      select id, title, created_at::text as created_at
      from chat_threads
      where user_id = ${context.userId}
      order by id desc
      limit 20
    `;
});
var getThread_createServerFn_handler = createServerRpc({
	id: "921b392204a07901ef22f62a9f343595485b20a02abd4b3c7d19ea6006e83770",
	name: "getThread",
	filename: "src/lib/api.ts"
}, (opts) => getThread.__executeServer(opts));
var getThread = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((data) => data).handler(getThread_createServerFn_handler, async ({ context, data }) => {
	await loadActor(context.userId);
	const sql = await getSql();
	const thread = await sql`
      select id, title from chat_threads where id = ${data.id} and user_id = ${context.userId}
    `;
	if (!thread[0]) throw new Error("Not found");
	const messages = await sql`
      select id, thread_id, role, content, chart, sources, created_at::text as created_at
      from chat_messages where thread_id = ${data.id} order by id
    `;
	return {
		...thread[0],
		messages: messages.map((m) => ({
			id: num(m.id),
			thread_id: num(m.thread_id),
			role: m.role === "assistant" ? "assistant" : "user",
			content: String(m.content),
			chart: parseJson(m.chart, null),
			sources: parseJson(m.sources, null),
			created_at: String(m.created_at)
		}))
	};
});
var speakText_createServerFn_handler = createServerRpc({
	id: "46fa7a23956e84efe000e45f40767cbfa7094ed877d85d0a1823cd729d540d47",
	name: "speakText",
	filename: "src/lib/api.ts"
}, (opts) => speakText.__executeServer(opts));
var speakText = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(speakText_createServerFn_handler, async ({ context, data }) => {
	await loadActor(context.userId);
	const result = await grokTts(data.text);
	if (!result.ok) return result;
	await logUsage(context.userId, "tts", "tts", data.text.length, 0, 1);
	return result;
});
var listSummaries_createServerFn_handler = createServerRpc({
	id: "7aaec95af720c0cc2905e730bc870a789fd8c25aa54862f910191af9289f5a3f",
	name: "listSummaries",
	filename: "src/lib/api.ts"
}, (opts) => listSummaries.__executeServer(opts));
var listSummaries = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((data) => data ?? {}).handler(listSummaries_createServerFn_handler, async ({ context, data }) => {
	if ((await loadActor(context.userId, data.viewAs)).role === "submitter") throw new Error("Forbidden");
	return (await (await getSql())`
      select id, title, period_start::text as period_start, period_end::text as period_end,
             trigger, facts, narrative, sources, confidence, model, prompt_version,
             input_tokens, output_tokens, cost_cents, flagged, flag_note, created_by,
             created_at::text as created_at
      from ai_summaries order by id desc limit 12
    `).map((r) => ({
		id: num(r.id),
		title: String(r.title),
		period_start: r.period_start ?? null,
		period_end: r.period_end ?? null,
		trigger: String(r.trigger),
		facts: parseJson(r.facts, {}),
		narrative: String(r.narrative),
		sources: parseJson(r.sources, null),
		confidence: r.confidence ?? "medium",
		model: String(r.model),
		prompt_version: String(r.prompt_version),
		input_tokens: num(r.input_tokens),
		output_tokens: num(r.output_tokens),
		cost_cents: num(r.cost_cents),
		flagged: Boolean(r.flagged),
		flag_note: r.flag_note ?? null,
		created_by: r.created_by ?? null,
		created_at: String(r.created_at)
	}));
});
var generateSummary_createServerFn_handler = createServerRpc({
	id: "95e5bbd61d99d63dd5a2c59549554dfb3efb019416c023aa6e7d45666e42f618",
	name: "generateSummary",
	filename: "src/lib/api.ts"
}, (opts) => generateSummary.__executeServer(opts));
var generateSummary = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data ?? {}).handler(generateSummary_createServerFn_handler, async ({ context, data }) => {
	const actor = await loadActor(context.userId, data.viewAs);
	if (actor.role === "submitter") throw new Error("Forbidden");
	const facts = await computeFacts(actor);
	const result = await grokChat({
		model: (await getSettings()).analysis_model,
		max_tokens: 500,
		messages: [{
			role: "system",
			content: "Write a weekly operations brief from the provided FACTS only. 3 short sections: What changed, Where to look, Confidence. Cite record ids. Never invent numbers. If the sample is thin, say so."
		}, {
			role: "user",
			content: JSON.stringify(facts)
		}]
	});
	const narrative = result.ok ? result.text : fallbackNarrate("Write this week's operations brief.", facts);
	const sql = await getSql();
	const end = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
	const inserted = await sql`
      insert into ai_summaries (
        title, period_start, period_end, trigger, facts, narrative, sources,
        confidence, model, prompt_version, input_tokens, output_tokens, cost_cents, created_by
      ) values (
        ${"Weekly operations brief"},
        ${(/* @__PURE__ */ new Date(Date.now() - 6048e5)).toISOString().slice(0, 10)}, ${end}, ${"on_demand"},
        ${JSON.stringify(facts)}::jsonb,
        ${narrative},
        ${JSON.stringify(facts.recent.slice(0, 5).map((r) => ({
		kind: "submission",
		id: String(r.id),
		label: `#${r.id}`
	})))}::jsonb,
        ${facts.kpis.total > 40 ? "high" : "medium"},
        ${result.ok ? result.model : "facts-v1"},
        ${"v1"},
        ${result.ok ? result.input_tokens : 0},
        ${result.ok ? result.output_tokens : 0},
        ${result.ok ? result.cost_cents : 0},
        ${actor.userId}
      ) returning id
    `;
	if (result.ok) await logUsage(actor.userId, "summary", result.model, result.input_tokens, result.output_tokens, result.cost_cents);
	return { id: inserted[0].id };
});
var flagSummary_createServerFn_handler = createServerRpc({
	id: "8cb4e4f7036f567b9b7033bd95c6bf4e9c047b1c24af5b808b309c223b8c9cf8",
	name: "flagSummary",
	filename: "src/lib/api.ts"
}, (opts) => flagSummary.__executeServer(opts));
var flagSummary = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(flagSummary_createServerFn_handler, async ({ context, data }) => {
	const actor = await loadActor(context.userId);
	if (actor.role === "submitter") throw new Error("Forbidden");
	await (await getSql())`
      update ai_summaries
      set flagged = true, flag_note = ${data.note ?? "Flagged as inaccurate"}
      where id = ${data.id}
    `;
	await writeAudit(actor.userId, "summary.flag", "summary", String(data.id), { note: data.note });
	return { ok: true };
});
var getUsage_createServerFn_handler = createServerRpc({
	id: "e7b384656c5e6baa9122f37c60e1ad8575c7bb51dfecb608d1ad7d32eaee4b05",
	name: "getUsage",
	filename: "src/lib/api.ts"
}, (opts) => getUsage.__executeServer(opts));
var getUsage = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getUsage_createServerFn_handler, async ({ context }) => {
	if ((await loadActor(context.userId)).profile.role !== "admin") throw new Error("Forbidden");
	const sql = await getSql();
	return {
		byDay: await sql`
      select created_at::date::text as day, count(*)::int as calls,
             coalesce(sum(cost_cents),0)::float as cost_cents
      from ai_usage
      group by 1
      order by 1 desc
      limit 30
    `,
		byPurpose: await sql`
      select purpose, count(*)::int as calls, coalesce(sum(cost_cents),0)::float as cost_cents
      from ai_usage group by purpose order by calls desc
    `,
		totals: (await sql`
      select count(*)::int as calls, coalesce(sum(cost_cents),0)::float as cost_cents from ai_usage
    `)[0] ?? {
			calls: 0,
			cost_cents: 0
		}
	};
});
var exportSubmissions_createServerFn_handler = createServerRpc({
	id: "961aaec983c70889e859a0766c7433877a6eeee48f1cc66132fd1349b082326e",
	name: "exportSubmissions",
	filename: "src/lib/api.ts"
}, (opts) => exportSubmissions.__executeServer(opts));
var exportSubmissions = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((data) => data ?? {}).handler(exportSubmissions_createServerFn_handler, async ({ context, data }) => {
	const actor = await loadActor(context.userId);
	if (actor.profile.role !== "admin") throw new Error("Forbidden");
	const rows = await (await getSql())`
      select s.id, fs.name as schema_name, s.submitter_name, s.channel, s.status,
             s.region, s.category, s.severity, s.created_at::text as created_at, s.payload
      from submissions s
      join form_schemas fs on fs.id = s.schema_id
      order by s.id
    `;
	const filtered = data.status && data.status !== "all" ? rows.filter((r) => r.status === data.status) : rows;
	const lines = [[
		"id",
		"schema",
		"submitter",
		"channel",
		"status",
		"region",
		"category",
		"severity",
		"created_at"
	].join(",")];
	for (const r of filtered) lines.push([
		r.id,
		csvEscape(String(r.schema_name ?? "")),
		csvEscape(String(r.submitter_name ?? "")),
		r.channel,
		r.status,
		csvEscape(String(r.region ?? "")),
		csvEscape(String(r.category ?? "")),
		csvEscape(String(r.severity ?? "")),
		r.created_at
	].join(","));
	await writeAudit(actor.userId, "export.csv", "submissions", "all", { count: filtered.length });
	return {
		filename: "Coeus-submissions.csv",
		csv: lines.join("\n")
	};
});
function csvEscape(s) {
	if (/[",\n]/.test(s)) return `"${s.replace(/"/g, "\"\"")}"`;
	return s;
}
var addSchemaField_createServerFn_handler = createServerRpc({
	id: "4bcdb0868b0a5e402c5592045db76f2fc52cc11319a1d18bfcfc8ccca8914ae8",
	name: "addSchemaField",
	filename: "src/lib/api.ts"
}, (opts) => addSchemaField.__executeServer(opts));
var addSchemaField = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(addSchemaField_createServerFn_handler, async ({ context, data }) => {
	if ((await loadActor(context.userId)).profile.role !== "admin") throw new Error("Forbidden");
	const sql = await getSql();
	const row = (await sql`
      select fields, version from form_schemas where id = ${data.schema_id}
    `)[0];
	if (!row) throw new Error("Unknown form");
	const fields = parseFields(row.fields);
	const key = data.field.key.trim().replace(/\s+/g, "_").toLowerCase();
	if (!key) throw new Error("Field key required");
	if (fields.some((f) => f.key === key)) throw new Error("That field already exists");
	fields.push({
		...data.field,
		key
	});
	await sql`
      update form_schemas
      set fields = ${JSON.stringify(fields)}::jsonb, version = ${row.version + 1}
      where id = ${data.schema_id}
    `;
	await writeAudit(context.userId, "schema.field.add", "schema", String(data.schema_id), { key });
	return {
		fields,
		version: row.version + 1
	};
});
var toggleFieldRequired_createServerFn_handler = createServerRpc({
	id: "712859bfe3f6a9106e417cd91c5854c95ad3ea7805059fc5f4e56874e2257bec",
	name: "toggleFieldRequired",
	filename: "src/lib/api.ts"
}, (opts) => toggleFieldRequired.__executeServer(opts));
var toggleFieldRequired = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(toggleFieldRequired_createServerFn_handler, async ({ context, data }) => {
	if ((await loadActor(context.userId)).profile.role !== "admin") throw new Error("Forbidden");
	const sql = await getSql();
	const row = (await sql`
      select fields, version from form_schemas where id = ${data.schema_id}
    `)[0];
	if (!row) throw new Error("Unknown form");
	const fields = parseFields(row.fields).map((f) => f.key === data.key ? {
		...f,
		required: data.required
	} : f);
	await sql`
      update form_schemas
      set fields = ${JSON.stringify(fields)}::jsonb, version = ${row.version + 1}
      where id = ${data.schema_id}
    `;
	await writeAudit(context.userId, "schema.field.update", "schema", String(data.schema_id), data);
	return {
		fields,
		version: row.version + 1
	};
});
var listAudit_createServerFn_handler = createServerRpc({
	id: "110e50625f84053be0eeffeec0506aaf0c27a45fa23d14010fc0a8294fb82d72",
	name: "listAudit",
	filename: "src/lib/api.ts"
}, (opts) => listAudit.__executeServer(opts));
var listAudit = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listAudit_createServerFn_handler, async ({ context }) => {
	if ((await loadActor(context.userId)).profile.role !== "admin") throw new Error("Forbidden");
	return (await getSql())`
      select id, actor_id, action, entity_type, entity_id, created_at::text as created_at
      from audit_events order by id desc limit 40
    `;
});
var ingestFeed_createServerFn_handler = createServerRpc({
	id: "fb7b49458ab621a5db3a24d2ea5ae855aa535db261422ec896a820d7c7f27245",
	name: "ingestFeed",
	filename: "src/lib/api.ts"
}, (opts) => ingestFeed.__executeServer(opts));
var ingestFeed = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(ingestFeed_createServerFn_handler, async ({ context, data }) => {
	const actor = await loadActor(context.userId);
	if (actor.profile.role !== "admin") throw new Error("Forbidden");
	const sql = await getSql();
	const raw = (await sql`select * from form_schemas where id = ${data.schema_id}`)[0];
	if (!raw) throw new Error("Unknown form.");
	const schema = {
		...raw,
		fields: parseFields(raw.fields)
	};
	let rows = [];
	if (data.format === "json") {
		const parsed = JSON.parse(data.body);
		if (!Array.isArray(parsed)) throw new Error("JSON feed must be an array of objects.");
		rows = parsed;
	} else rows = parseCsv(data.body).rows;
	if (rows.length === 0) throw new Error("Feed has no rows.");
	if (rows.length > 200) throw new Error("Keep a feed batch to 200 rows.");
	let accepted = 0;
	let quarantined = 0;
	const report = [];
	for (let i = 0; i < rows.length; i += 1) {
		const payload = sanitizePayload(schema.fields, rows[i] ?? {});
		const errors = validatePayload(schema.fields, payload);
		const dup = await findDuplicateId(schema.id, payload);
		if (dup) errors.push({
			field: "site",
			message: `Possible duplicate of #${dup}.`
		});
		const status = errors.length ? "quarantined" : "accepted";
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
          ${errors.length ? null : (/* @__PURE__ */ new Date()).toISOString()},
          false
        )
      `;
		if (status === "accepted") accepted += 1;
		else quarantined += 1;
		report.push({
			row: i + 1,
			status,
			errors
		});
	}
	await writeAudit(actor.userId, "submission.feed", "schema", String(schema.id), {
		accepted,
		quarantined
	});
	return {
		accepted,
		quarantined,
		total: rows.length,
		report
	};
});
var listSavedViews_createServerFn_handler = createServerRpc({
	id: "a8fea87301eccdff455fb8ebf58bcdeefb8f11d4c10377a1833bac8dd0aa248e",
	name: "listSavedViews",
	filename: "src/lib/api.ts"
}, (opts) => listSavedViews.__executeServer(opts));
var listSavedViews = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listSavedViews_createServerFn_handler, async ({ context }) => {
	await loadActor(context.userId);
	return (await getSql())`
      select id, name, filters, created_at::text as created_at
      from saved_views where user_id = ${context.userId} order by id desc
    `;
});
var saveView_createServerFn_handler = createServerRpc({
	id: "684e40b850dd8e444a57f354f0df938b3491c791f63d568a92a592fc3923ac4f",
	name: "saveView",
	filename: "src/lib/api.ts"
}, (opts) => saveView.__executeServer(opts));
var saveView = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(saveView_createServerFn_handler, async ({ context, data }) => {
	await loadActor(context.userId);
	const name = data.name.trim().slice(0, 80);
	if (!name) throw new Error("Name the view first.");
	return { id: (await (await getSql())`
      insert into saved_views (user_id, name, filters)
      values (${context.userId}, ${name}, ${JSON.stringify(data.filters)}::jsonb)
      returning id
    `)[0].id };
});
var deleteSavedView_createServerFn_handler = createServerRpc({
	id: "2d183bb76cdc6ddb17e4f50cda1a4e93a283c693242c1a3c7696dd69090a51af",
	name: "deleteSavedView",
	filename: "src/lib/api.ts"
}, (opts) => deleteSavedView.__executeServer(opts));
var deleteSavedView = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(deleteSavedView_createServerFn_handler, async ({ context, data }) => {
	await loadActor(context.userId);
	await (await getSql())`delete from saved_views where id = ${data.id} and user_id = ${context.userId}`;
	return { ok: true };
});
//#endregion
export { addSchemaField_createServerFn_handler, askQuestion_createServerFn_handler, deleteSavedView_createServerFn_handler, exportSubmissions_createServerFn_handler, flagSummary_createServerFn_handler, generateSummary_createServerFn_handler, getBootstrap_createServerFn_handler, getDashboard_createServerFn_handler, getSubmission_createServerFn_handler, getThread_createServerFn_handler, getUsage_createServerFn_handler, ingestFeed_createServerFn_handler, listAudit_createServerFn_handler, listMembers_createServerFn_handler, listSavedViews_createServerFn_handler, listSubmissions_createServerFn_handler, listSummaries_createServerFn_handler, listThreads_createServerFn_handler, resolveQuarantine_createServerFn_handler, saveSettings_createServerFn_handler, saveView_createServerFn_handler, setMemberRole_createServerFn_handler, speakText_createServerFn_handler, submitCsv_createServerFn_handler, submitForm_createServerFn_handler, toggleFieldRequired_createServerFn_handler, updateProfileMeta_createServerFn_handler };
