export const ROLES = ["submitter", "analyst", "admin"] as const;
export type Role = (typeof ROLES)[number];

export const STATUSES = [
  "draft",
  "pending_review",
  "accepted",
  "quarantined",
  "rejected",
] as const;
export type SubmissionStatus = (typeof STATUSES)[number];

export const CHANNELS = ["form", "upload", "feed"] as const;
export type Channel = (typeof CHANNELS)[number];

export const REGIONS = ["West", "East", "North", "South", "Central"] as const;
export type Region = (typeof REGIONS)[number];

export type Json =
  | string
  | number
  | boolean
  | null
  | Json[]
  | { [key: string]: Json };

export type JsonObject = { [key: string]: Json };

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "date"
  | "select"
  | "boolean";


export type FieldCondition = { key: string; equals: string | number | boolean };

export type FieldDef = {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[];
  min?: number;
  max?: number;
  minLength?: number;
  help?: string;
  showIf?: FieldCondition;
  requiredIf?: FieldCondition;
};

export type FormSchema = {
  id: number;
  slug: string;
  name: string;
  description: string;
  version: number;
  fields: FieldDef[];
  is_active: boolean;
};

export type Profile = {
  user_id: string;
  email: string | null;
  name: string | null;
  role: Role;
  created_at: string;
};

export type Submission = {
  id: number;
  schema_id: number;
  schema_name?: string;
  submitted_by: string;
  submitter_name: string;
  channel: Channel;
  status: SubmissionStatus;
  payload: JsonObject;
  validation_errors: { field?: string; message: string }[] | null;
  region: string | null;
  category: string | null;
  severity: string | null;
  quality_score: number | null;
  ai_notes: string | null;
  ai_model: string | null;
  ai_reviewed_at: string | null;
  is_seed: boolean;
  created_at: string;
  updated_at: string;
};

export type ChartSpec = {
  type: "line" | "bar" | "area";
  title: string;
  xKey: string;
  yKeys: { key: string; label: string }[];
  data: Record<string, string | number>[];
};

export type ChatSource = {
  kind: "submission" | "summary" | "metric";
  id: string;
  label: string;
};

export type ChatMessage = {
  id: number;
  thread_id: number;
  role: "user" | "assistant";
  content: string;
  chart: ChartSpec | null;
  sources: ChatSource[] | null;
  created_at: string;
};

export type AiSummary = {
  id: number;
  title: string;
  period_start: string | null;
  period_end: string | null;
  trigger: string;
  facts: JsonObject;
  narrative: string;
  sources: ChatSource[] | null;
  confidence: "high" | "medium" | "low";
  model: string;
  prompt_version: string;
  input_tokens: number;
  output_tokens: number;
  cost_cents: number;
  flagged: boolean;
  flag_note: string | null;
  created_by: string | null;
  created_at: string;
};

export const AI_MODELS = [
  {
    id: "gpt-4o-mini",
    name: "GPT-4o mini",
    blurb: "OpenAI — fast, low cost (default when using OPENAI_API_KEY)",
  },
  {
    id: "gpt-4o",
    name: "GPT-4o",
    blurb: "OpenAI — stronger analysis and chat",
  },
  {
    id: "gpt-4.1-mini",
    name: "GPT-4.1 mini",
    blurb: "OpenAI — newer mini model when available on your account",
  },
  {
    id: "grok-4.5",
    name: "Grok 4.5",
    blurb: "xAI — use with XAI_API_KEY",
  },
  {
    id: "grok-4.7",
    name: "Grok 4.7",
    blurb: "xAI — faster option when available",
  },
] as const;

export type AiModelId = (typeof AI_MODELS)[number]["id"];

export type AppSettings = {
  analysis_model: string;
  chat_model: string;
  rejection_alert_pct: number;
};

export const DEFAULT_SETTINGS: AppSettings = {
  analysis_model: "gpt-4o-mini",
  chat_model: "gpt-4o-mini",
  rejection_alert_pct: 10,
};
