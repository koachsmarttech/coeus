import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { w as require_jsx_runtime, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import {
  a as Sparkles,
  g as ArrowRight,
  h as ClipboardList,
  m as FileUp,
  o as ShieldAlert,
  s as Settings2,
  u as MessageSquare,
} from "../_libs/lucide-react.mjs";
import {
  D as useBootstrap,
  _ as listSummaries,
  g as listSubmissions,
  l as getDashboard,
} from "./bootstrap-Dbln8WC-.mjs";
import { i as CardTitle, n as CardDesc, r as CardHeader, t as Card } from "./card-BoZDzAlh.mjs";
import { t as Skeleton } from "./skeleton-BU-YmEdi.mjs";
import { n as roleLabel } from "./app-shell-QIzUDnAv.mjs";
import { i as VolumeChart, r as SimpleBar, t as AskDrawer } from "./chat-panel-BfRJ3qfV.mjs";
import { t as StatusBadge } from "./status-badge-C4Fypzzp.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app-tGlKVnOB.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Overview() {
  const { data, viewAs } = useBootstrap();
  const role = data?.effectiveRole ?? "submitter";
  if (role === "submitter") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReporterHome, {});
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OpsHome, {
    viewAs,
    role,
  });
}
function RoleBanner({ role }) {
  const steps = [
    {
      id: "submitter",
      label: "Reporter",
      hint: "File & upload",
    },
    {
      id: "analyst",
      label: "Analyst",
      hint: "Review & Ask",
    },
    {
      id: "admin",
      label: "Admin",
      hint: "Control & roles",
    },
  ];
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
    className: "rounded-xl border border-line bg-surface p-4 shadow-[var(--shadow-card)]",
    children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
        className: "text-[11px] font-semibold uppercase tracking-wider text-faint",
        children: "Your place in the flow",
      }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
        className: "mt-3 flex flex-col gap-2 sm:flex-row sm:items-stretch",
        children: steps.map((s, i) => {
          const active = s.id === role || (role === "admin" && s.id === "admin");
          return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
            "div",
            {
              className: "flex flex-1 items-center gap-2",
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
                  className: `flex-1 rounded-lg border px-3 py-2 ${active ? "border-accent bg-accent text-accent-fg" : "border-line bg-bg text-muted"}`,
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
                      className: "text-sm font-semibold",
                      children: s.label,
                    }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
                      className: `text-[11px] ${active ? "text-accent-fg/80" : "text-faint"}`,
                      children: s.hint,
                    }),
                  ],
                }),
                i < steps.length - 1
                  ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
                      className: "hidden text-faint sm:inline",
                      "aria-hidden": true,
                      children: "→",
                    })
                  : null,
              ],
            },
            s.id,
          );
        }),
      }),
    ],
  });
}
function ReporterHome() {
  const { data, viewAs } = useBootstrap();
  const [rows, setRows] = (0, import_react.useState)([]);
  const [counts, setCounts] = (0, import_react.useState)({
    accepted: 0,
    quarantined: 0,
    pending: 0,
    rejected: 0,
  });
  const [total, setTotal] = (0, import_react.useState)(0);
  const [loading, setLoading] = (0, import_react.useState)(true);
  (0, import_react.useEffect)(() => {
    listSubmissions({
      data: {
        viewAs,
        limit: 8,
      },
    })
      .then((r) => {
        setRows(r?.rows ?? []);
        setTotal(r?.total ?? 0);
        setCounts(
          r?.counts ?? {
            accepted: 0,
            quarantined: 0,
            pending: 0,
            rejected: 0,
          },
        );
      })
      .catch(() => {
        setRows([]);
        setTotal(0);
      })
      .finally(() => setLoading(false));
  }, [viewAs]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
    className: "space-y-6",
    children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
            className: "text-xs font-medium uppercase tracking-[0.16em] text-accent",
            children: "Reporter Desk",
          }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
            className: "mt-1 font-display text-3xl tracking-tight",
            children: ["Hello", data?.profile.name ? `, ${data.profile.name.split(" ")[0]}` : ""],
          }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
            className: "mt-2 max-w-xl text-sm text-muted",
            children:
              "File structured reports or upload CSV, Excel, PDF, or PowerPoint. You only see your own filings.",
          }),
        ],
      }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoleBanner, { role: "submitter" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
        "aria-labelledby": "reporter-actions-title",
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
            className: "mb-3",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
                id: "reporter-actions-title",
                className: "text-sm font-semibold",
                children: "Quick actions",
              }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
                className: "mt-1 text-xs text-muted",
                children: "Start a filing or check the status of one you sent.",
              }),
            ],
          }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
            className: "grid gap-3 sm:grid-cols-2",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuickAction, {
                to: "/app/submit",
                icon: FileUp,
                title: "File a report",
                description: "Complete a form or upload a supported file.",
                tone: "accent",
              }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuickAction, {
                to: "/app/records",
                icon: ClipboardList,
                title: "View your records",
                description: "See your submissions and their latest status.",
              }),
            ],
          }),
        ],
      }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
        className: "grid gap-3 sm:grid-cols-3",
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
            label: "Your filings",
            value: total,
            hint: "All reports you have sent",
          }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
            label: "Processing",
            value: counts.pending,
            hint: "Waiting for review",
          }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
            label: "Needs a fix",
            value: counts.quarantined,
            hint: "Check the status in Records",
            warn: counts.quarantined > 0,
          }),
        ],
      }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
                    children: "Recent submissions",
                  }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDesc, {
                    children:
                      "Status stays visible to you even while analysts only see accepted rows.",
                  }),
                ],
              }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
                to: "/app/records",
                className: "text-sm font-medium text-accent hover:underline",
                children: "All records",
              }),
            ],
          }),
          loading
            ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-32" })
            : rows.length === 0
              ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
                  className: "text-sm text-muted",
                  children: "Nothing filed yet. Start with an incident report.",
                })
              : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
                  className: "divide-y divide-line",
                  children: rows.map((r) =>
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                      "li",
                      {
                        className: "flex items-center justify-between gap-3 py-3",
                        children: [
                          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
                            className: "min-w-0",
                            children: [
                              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
                                className: "truncate text-sm font-medium",
                                children: [r.schema_name, " · ", r.region ?? "—"],
                              }),
                              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
                                className: "text-xs text-faint",
                                children: new Date(r.created_at).toLocaleString(),
                              }),
                            ],
                          }),
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, {
                            status: r.status,
                          }),
                        ],
                      },
                      r.id,
                    ),
                  ),
                }),
        ],
      }),
    ],
  });
}
function OpsHome({ viewAs, role }) {
  const { data } = useBootstrap();
  const [dash, setDash] = (0, import_react.useState)(null);
  const [brief, setBrief] = (0, import_react.useState)(null);
  const [err, setErr] = (0, import_react.useState)(null);
  const [askOpen, setAskOpen] = (0, import_react.useState)(false);
  const threshold = data?.settings.rejection_alert_pct ?? 10;
  const isAdmin = role === "admin";
  (0, import_react.useEffect)(() => {
    setErr(null);
    Promise.all([getDashboard({ data: { viewAs } }), listSummaries({ data: { viewAs } })])
      .then(([d, s]) => {
        setDash(d);
        const list = Array.isArray(s) ? s : (s?.rows ?? []);
        setBrief(list[0] ?? null);
      })
      .catch((e) => setErr(e instanceof Error ? e.message : "Failed to load dashboard"));
  }, [viewAs]);
  if (err)
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
      className: "text-sm text-danger",
      children: err,
    });
  if (!dash)
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
      className: "space-y-4",
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-10 w-64" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
          className: "grid gap-3 sm:grid-cols-4",
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-24" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-24" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-24" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-24" }),
          ],
        }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-64" }),
      ],
    });
  const kpis = dash.kpis ?? {
    total: 0,
    accepted: 0,
    quarantined: 0,
    pending: 0,
    week: 0,
  };
  const rejectRate =
    kpis.accepted + kpis.quarantined > 0
      ? (kpis.quarantined / (kpis.accepted + kpis.quarantined)) * 100
      : 0;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
    className: "space-y-6",
    children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
        className:
          "rounded-2xl border border-line bg-surface p-5 shadow-[var(--shadow-card)] sm:p-7",
        children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
              className: "text-xs font-medium uppercase tracking-[0.16em] text-accent",
              children: [roleLabel(role), " overview"],
            }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
              className: "mt-2 font-display text-3xl tracking-tight",
              children: "Your operations at a glance",
            }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
              className: "mt-2 max-w-2xl text-sm leading-relaxed text-muted",
              children:
                role === "analyst"
                  ? "Explore reviewed records, follow reporting trends, and turn the data into clear briefs. Your counts include accepted records only."
                  : "Monitor reporting activity, review held filings, and manage portal settings. Counts reflect the records available to your role.",
            }),
          ],
        }),
      }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoleBanner, { role }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
        "aria-labelledby": "ops-actions-title",
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
            className: "mb-3",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
                id: "ops-actions-title",
                className: "text-sm font-semibold",
                children: "Quick actions",
              }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
                className: "mt-1 text-xs text-muted",
                children: isAdmin
                  ? "Review incoming data and manage portal access."
                  : "Move from reviewed data to insight.",
              }),
            ],
          }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
            className: `grid gap-3 ${isAdmin ? "sm:grid-cols-2 xl:grid-cols-5" : "sm:grid-cols-3"}`,
            children: [
              isAdmin
                ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuickAction, {
                    to: "/app/quarantine",
                    icon: ShieldAlert,
                    title: "Review quarantine",
                    description: "Accept or reject held filings.",
                    tone: "warn",
                  })
                : null,
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuickAction, {
                to: "/app/records",
                icon: ClipboardList,
                title: role === "analyst" ? "Browse accepted records" : "Browse records",
                description:
                  role === "analyst"
                    ? "Search records that have completed review."
                    : "Search and filter portal records.",
              }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuickAction, {
                to: "/app/insights",
                icon: Sparkles,
                title: "Open briefs",
                description: "Read or generate a data summary.",
              }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
                type: "button",
                onClick: () => setAskOpen(true),
                className:
                  "group flex min-h-28 items-start gap-3 rounded-xl border border-line bg-surface p-4 text-left shadow-[var(--shadow-card)] transition hover:-translate-y-0.5 hover:border-accent hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
                    className:
                      "flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent",
                    children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, {
                      className: "size-5",
                    }),
                  }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
                    className: "min-w-0 flex-1",
                    children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
                        className: "flex items-center justify-between gap-2 text-sm font-semibold",
                        children: [
                          "Ask Coeus ",
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
                            className:
                              "size-4 text-faint transition group-hover:translate-x-0.5 group-hover:text-accent",
                          }),
                        ],
                      }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
                        className: "mt-1 block text-xs leading-relaxed text-muted",
                        children: "Ask questions about the available reporting data.",
                      }),
                    ],
                  }),
                ],
              }),
              isAdmin
                ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuickAction, {
                    to: "/app/admin",
                    icon: Settings2,
                    title: "Manage portal",
                    description: "People, forms, feed, exports, and audit trail.",
                    tone: "accent",
                  })
                : null,
            ],
          }),
        ],
      }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
            className: "mb-3 text-xs font-semibold uppercase tracking-wider text-faint",
            children: "Key counts",
          }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
            className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
                label: "Visible records",
                value: kpis.total,
                hint: "In your role scope",
              }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
                label: "Accepted",
                value: kpis.accepted,
              }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
                label: "Quarantined",
                value: kpis.quarantined,
                warn: rejectRate >= threshold,
                hint: rejectRate >= threshold ? `Above ${threshold}% alert` : void 0,
              }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
                label: "Last 7 days",
                value: kpis.week,
                hint: "New arrivals",
              }),
            ],
          }),
        ],
      }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
            className: "mb-3 text-xs font-semibold uppercase tracking-wider text-faint",
            children: "Trends",
          }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
            className: "grid gap-4 lg:grid-cols-2",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
                    children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
                        children: "Volume",
                      }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDesc, {
                        children: "Accepted vs held",
                      }),
                    ],
                  }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeChart, {
                    data: dash.volume ?? [],
                  }),
                ],
              }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
                    children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
                        children: "Region",
                      }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDesc, {
                        children: "Click a zone to open Records",
                      }),
                    ],
                  }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimpleBar, {
                    data: dash.byRegion ?? [],
                    xKey: "region",
                    yKey: "count",
                  }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
                    className: "mt-2 flex flex-wrap gap-2",
                    children: (dash.byRegion ?? []).map((r) =>
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                        Link,
                        {
                          to: "/app/records",
                          search: { region: r.region },
                          className:
                            "rounded-full bg-accent-soft px-2.5 py-1 text-xs font-medium text-accent hover:bg-accent hover:text-accent-fg",
                          children: [r.region, " · ", r.count],
                        },
                        r.region,
                      ),
                    ),
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
            className: "mb-3 text-xs font-semibold uppercase tracking-wider text-faint",
            children: "Breakdown & brief",
          }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
            className: "grid gap-4 lg:grid-cols-3",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
                    children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
                      children: "Category",
                    }),
                  }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimpleBar, {
                    data: dash.byCategory ?? [],
                    xKey: "category",
                    yKey: "count",
                  }),
                ],
              }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
                    children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
                        children: "Satisfaction",
                      }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDesc, {
                        children: "Community feedback, 1–5",
                      }),
                    ],
                  }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimpleBar, {
                    data: (dash.satisfaction ?? []).map((s) => ({
                      score: `${s.score}`,
                      count: s.count,
                    })),
                    xKey: "score",
                    yKey: "count",
                  }),
                ],
              }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
                    children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
                        children: [
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
                            children: "Latest brief",
                          }),
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDesc, {
                            children: brief
                              ? `${brief.model} · ${brief.confidence} confidence`
                              : "No brief yet — generate one from Insights",
                          }),
                        ],
                      }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
                        to: "/app/insights",
                        className: "text-sm font-medium text-accent hover:underline",
                        children: "Open",
                      }),
                    ],
                  }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
                    className: "line-clamp-6 text-sm leading-relaxed text-ink-soft",
                    children:
                      brief?.narrative ??
                      "Analysts only see records after review is complete. Generate a brief to narrate the calculated facts.",
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      dash.anomalies?.length
        ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
                className: "mb-3 text-xs font-semibold uppercase tracking-wider text-faint",
                children: "Alerts",
              }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
                className: "grid gap-2 sm:grid-cols-2",
                children: dash.anomalies.map((a) =>
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                    "div",
                    {
                      className: "rounded-xl border border-warn/30 bg-warn-soft p-4 text-sm",
                      children: [
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
                          className: "font-semibold text-warn",
                          children: a.title,
                        }),
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
                          className: "mt-1 text-ink-soft",
                          children: a.detail,
                        }),
                      ],
                    },
                    a.title,
                  ),
                ),
              }),
            ],
          })
        : null,
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AskDrawer, {
        open: askOpen,
        onClose: () => setAskOpen(false),
        role,
        viewAs,
      }),
    ],
  });
}
function Stat({ label, value, hint, warn }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
    className: "rounded-xl border border-line bg-surface p-4 shadow-[var(--shadow-card)]",
    children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
        className: "text-xs font-medium uppercase tracking-wider text-muted",
        children: label,
      }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
        className: `mt-2 font-display text-3xl tabular-nums ${warn ? "text-danger" : "text-accent"}`,
        children: value,
      }),
      hint
        ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
            className: "mt-1 text-xs text-faint",
            children: hint,
          })
        : null,
    ],
  });
}
function QuickAction({ to, icon: Icon, title, description, tone = "neutral" }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
    to,
    className:
      "group flex min-h-28 items-start gap-3 rounded-xl border border-line bg-surface p-4 shadow-[var(--shadow-card)] transition hover:-translate-y-0.5 hover:border-accent hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
    children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
        className: `flex size-10 shrink-0 items-center justify-center rounded-xl ${tone === "warn" ? "bg-warn-soft text-warn" : tone === "accent" ? "bg-accent text-accent-fg" : "bg-accent-soft text-accent"}`,
        children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-5" }),
      }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
        className: "min-w-0 flex-1",
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
            className: "flex items-center justify-between gap-2 text-sm font-semibold",
            children: [
              title,
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
                className:
                  "size-4 shrink-0 text-faint transition group-hover:translate-x-0.5 group-hover:text-accent",
              }),
            ],
          }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
            className: "mt-1 block text-xs leading-relaxed text-muted",
            children: description,
          }),
        ],
      }),
    ],
  });
}
//#endregion
export { Overview as component };
