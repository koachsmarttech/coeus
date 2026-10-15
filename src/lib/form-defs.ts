import type { FieldDef } from "./types";

/** Broad region list — works for general ops and Nigerian zonal reporting. */
export const REGION_OPTIONS = [
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
  "Other",
] as const;

export const INCIDENT_FIELDS: FieldDef[] = [
  {
    key: "occurred_at",
    label: "Date of incident",
    type: "date",
    required: true,
  },
  {
    key: "region",
    label: "Region / zone",
    type: "select",
    required: true,
    options: [...REGION_OPTIONS],
  },
  {
    key: "site",
    label: "Location (site, LGA, facility, or unit)",
    type: "text",
    required: true,
    minLength: 2,
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
      "Other",
    ],
  },
  {
    key: "severity",
    label: "Severity",
    type: "select",
    required: true,
    options: ["low", "medium", "high", "critical"],
  },
  {
    key: "people_affected",
    label: "People affected",
    type: "number",
    required: true,
    min: 0,
    max: 100000,
    help: "Use 0 if nobody was directly affected.",
  },
  {
    key: "description",
    label: "What happened",
    type: "textarea",
    required: true,
    minLength: 20,
  },
  {
    key: "follow_up_needed",
    label: "Follow-up required",
    type: "boolean",
  },
  {
    key: "follow_up_notes",
    label: "Follow-up notes",
    type: "textarea",
    minLength: 10,
    showIf: { key: "follow_up_needed", equals: true },
    requiredIf: { key: "follow_up_needed", equals: true },
  },
];

export const FEEDBACK_FIELDS: FieldDef[] = [
  { key: "collected_at", label: "Date collected", type: "date", required: true },
  {
    key: "region",
    label: "Region / zone",
    type: "select",
    required: true,
    options: [...REGION_OPTIONS],
  },
  {
    key: "site",
    label: "Community / site",
    type: "text",
    required: true,
    minLength: 2,
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
      "Other",
    ],
  },
  {
    key: "satisfaction",
    label: "Satisfaction (1–5)",
    type: "number",
    required: true,
    min: 1,
    max: 5,
  },
  {
    key: "comments",
    label: "Comments",
    type: "textarea",
    required: true,
    minLength: 12,
  },
  {
    key: "would_recommend",
    label: "Would recommend / trust again",
    type: "select",
    required: true,
    options: ["yes", "no", "unsure"],
  },
];

export const INSPECTION_FIELDS: FieldDef[] = [
  { key: "inspected_at", label: "Inspection / review date", type: "date", required: true },
  {
    key: "region",
    label: "Region / zone",
    type: "select",
    required: true,
    options: [...REGION_OPTIONS],
  },
  { key: "site", label: "Site / unit", type: "text", required: true, minLength: 2 },
  {
    key: "overall_score",
    label: "Overall score (1–10)",
    type: "number",
    required: true,
    min: 1,
    max: 10,
  },
  {
    key: "issues_found",
    label: "Issues found",
    type: "number",
    required: true,
    min: 0,
    max: 100,
  },
  {
    key: "outcome",
    label: "Outcome",
    type: "select",
    required: true,
    options: ["pass", "conditional", "fail", "credible", "partially credible", "not credible"],
  },
  {
    key: "notes",
    label: "Notes",
    type: "textarea",
    required: true,
    minLength: 16,
  },
];

export const SEEDED_SCHEMAS = [
  {
    slug: "incident",
    name: "Incident report",
    description:
      "General incident intake — safety, security, operations, community, logistics, and related events.",
    fields: INCIDENT_FIELDS,
  },
  {
    slug: "feedback",
    name: "Community / stakeholder feedback",
    description: "Satisfaction and comments from communities, staff, or stakeholders.",
    fields: FEEDBACK_FIELDS,
  },
  {
    slug: "inspection",
    name: "Site / process review",
    description: "Structured walk-through scores, issue counts, and outcome notes.",
    fields: INSPECTION_FIELDS,
  },
] as const;
