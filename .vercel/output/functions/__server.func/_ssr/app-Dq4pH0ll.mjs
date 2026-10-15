import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { w as require_jsx_runtime, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { _ as ArrowUpRight, d as MessageSquare, h as FileUp, r as Users, s as ShieldAlert } from "../_libs/lucide-react.mjs";
import { D as useBootstrap, _ as listSummaries, g as listSubmissions, l as getDashboard } from "./bootstrap-nXVxPEIQ.mjs";
import { t as Button } from "./button-C5sL4cLt.mjs";
import { i as CardTitle, n as CardDesc, r as CardHeader, t as Card } from "./card-DpV6wKp_.mjs";
import { t as Skeleton } from "./skeleton-mFZHMuR3.mjs";
import { n as roleLabel } from "./app-shell-kPeSIp3A.mjs";
import { i as VolumeChart, r as SimpleBar, t as AskDrawer } from "./chat-panel-BAlkw8S0.mjs";
import { t as StatusBadge } from "./status-badge-CwKYPmQR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app-Dq4pH0ll.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Overview() {
	const { data, viewAs } = useBootstrap();
	const role = data?.effectiveRole ?? "submitter";
	if (role === "submitter") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReporterHome, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OpsHome, {
		viewAs,
		role
	});
}
function RoleBanner({ role }) {
	const steps = [
		{
			id: "submitter",
			label: "Reporter",
			hint: "File & upload"
		},
		{
			id: "analyst",
			label: "Analyst",
			hint: "Review & Ask"
		},
		{
			id: "admin",
			label: "Admin",
			hint: "Control & roles"
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-line bg-surface p-4 shadow-[var(--shadow-card)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[11px] font-semibold uppercase tracking-wider text-faint",
			children: "Your place in the flow"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-3 flex flex-col gap-2 sm:flex-row sm:items-stretch",
			children: steps.map((s, i) => {
				const active = s.id === role || role === "admin" && s.id === "admin";
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-1 items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `flex-1 rounded-lg border px-3 py-2 ${active ? "border-accent bg-accent text-accent-fg" : "border-line bg-bg text-muted"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-semibold",
							children: s.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: `text-[11px] ${active ? "text-accent-fg/80" : "text-faint"}`,
							children: s.hint
						})]
					}), i < steps.length - 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "hidden text-faint sm:inline",
						"aria-hidden": true,
						children: "→"
					}) : null]
				}, s.id);
			})
		})]
	});
}
function ReporterHome() {
	const { data, viewAs } = useBootstrap();
	const [rows, setRows] = (0, import_react.useState)([]);
	const [counts, setCounts] = (0, import_react.useState)({
		accepted: 0,
		quarantined: 0,
		pending: 0,
		rejected: 0
	});
	const [total, setTotal] = (0, import_react.useState)(0);
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		listSubmissions({ data: {
			viewAs,
			limit: 8
		} }).then((r) => {
			setRows(r?.rows ?? []);
			setTotal(r?.total ?? 0);
			setCounts(r?.counts ?? {
				accepted: 0,
				quarantined: 0,
				pending: 0,
				rejected: 0
			});
		}).catch(() => {
			setRows([]);
			setTotal(0);
		}).finally(() => setLoading(false));
	}, [viewAs]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium uppercase tracking-[0.16em] text-accent",
					children: "Reporter desk"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "mt-1 font-display text-3xl tracking-tight",
					children: ["Hello", data?.profile.name ? `, ${data.profile.name.split(" ")[0]}` : ""]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-xl text-sm text-muted",
					children: "File structured reports or upload CSV, Excel, PDF, or PowerPoint. You only see your own filings."
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoleBanner, { role: "submitter" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-3 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Your filings",
						value: total
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Processing",
						value: counts.pending
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Needs a fix",
						value: counts.quarantined,
						warn: counts.quarantined > 0
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "flex flex-wrap gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/app/submit",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileUp, {}), " New report"]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "secondary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/app/records",
						children: "View your records"
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Recent submissions" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDesc, { children: "Status stays visible to you even while analysts only see accepted rows." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/app/records",
				className: "text-sm font-medium text-accent hover:underline",
				children: "All records"
			})] }), loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-32" }) : rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Nothing filed yet. Start with an incident report."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "divide-y divide-line",
				children: rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center justify-between gap-3 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "truncate text-sm font-medium",
							children: [
								r.schema_name,
								" · ",
								r.region ?? "—"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-faint",
							children: new Date(r.created_at).toLocaleString()
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: r.status })]
				}, r.id))
			})] })
		]
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
		Promise.all([getDashboard({ data: { viewAs } }), listSummaries({ data: { viewAs } })]).then(([d, s]) => {
			setDash(d);
			const list = Array.isArray(s) ? s : s?.rows ?? [];
			setBrief(list[0] ?? null);
		}).catch((e) => setErr(e instanceof Error ? e.message : "Failed to load dashboard"));
	}, [viewAs]);
	if (err) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-danger",
		children: err
	});
	if (!dash) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-10 w-64" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-24" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-24" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-24" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-24" })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-64" })
		]
	});
	const kpis = dash.kpis ?? {
		total: 0,
		accepted: 0,
		quarantined: 0,
		pending: 0,
		week: 0
	};
	const rejectRate = kpis.accepted + kpis.quarantined > 0 ? kpis.quarantined / (kpis.accepted + kpis.quarantined) * 100 : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex flex-wrap items-end justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs font-medium uppercase tracking-[0.16em] text-accent",
						children: [roleLabel(role), " overview"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 font-display text-3xl tracking-tight",
						children: "Operations dashboard"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 max-w-xl text-sm text-muted",
						children: "Counts are calculated from records in your scope. Ask only narrates these facts — it does not invent numbers."
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "secondary",
							onClick: () => setAskOpen(true),
							children: ["Ask ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "size-4" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "secondary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/app/insights",
								children: ["Briefs ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "size-4" })]
							})
						}),
						isAdmin ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/app/admin",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-4" }), " People & models"]
							})
						}) : null
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoleBanner, { role }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-3 text-xs font-semibold uppercase tracking-wider text-faint",
				children: "Key counts"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Visible records",
						value: kpis.total,
						hint: "In your role scope"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Accepted",
						value: kpis.accepted
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Quarantined",
						value: kpis.quarantined,
						warn: rejectRate >= threshold,
						hint: rejectRate >= threshold ? `Above ${threshold}% alert` : void 0
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Last 7 days",
						value: kpis.week,
						hint: "New arrivals"
					})
				]
			})] }),
			isAdmin ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-3 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/app/quarantine",
					className: "flex items-center gap-3 rounded-xl border border-line bg-surface p-4 shadow-[var(--shadow-card)] hover:border-accent",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex size-10 items-center justify-center rounded-full bg-warn-soft text-warn",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "size-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-semibold",
						children: "Quarantine queue"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: "Accept or reject held filings"
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/app/admin",
					className: "flex items-center gap-3 rounded-xl border border-line bg-surface p-4 shadow-[var(--shadow-card)] hover:border-accent",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex size-10 items-center justify-center rounded-full bg-accent-soft text-accent",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-semibold",
						children: "Assign roles"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: "Reporter · Analyst · Admin"
					})] })]
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-3 text-xs font-semibold uppercase tracking-wider text-faint",
				children: "Trends"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Volume over time" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDesc, { children: "Accepted vs held" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeChart, { data: dash.volume ?? [] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "By region" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDesc, { children: "Click a zone to open Records" })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimpleBar, {
						data: dash.byRegion ?? [],
						xKey: "region",
						yKey: "count"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 flex flex-wrap gap-2",
						children: (dash.byRegion ?? []).map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/app/records",
							search: { region: r.region },
							className: "rounded-full bg-accent-soft px-2.5 py-1 text-xs font-medium text-accent hover:bg-accent hover:text-accent-fg",
							children: [
								r.region,
								" · ",
								r.count
							]
						}, r.region))
					})
				] })]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-3 text-xs font-semibold uppercase tracking-wider text-faint",
				children: "Breakdown & brief"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Category mix" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimpleBar, {
						data: dash.byCategory ?? [],
						xKey: "category",
						yKey: "count"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Satisfaction" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDesc, { children: "Community feedback, 1–5" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimpleBar, {
						data: (dash.satisfaction ?? []).map((s) => ({
							score: `${s.score}`,
							count: s.count
						})),
						xKey: "score",
						yKey: "count"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Latest brief" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDesc, { children: brief ? `${brief.model} · ${brief.confidence} confidence` : "No brief yet — generate one from Insights" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/app/insights",
						className: "text-sm font-medium text-accent hover:underline",
						children: "Open"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "line-clamp-6 text-sm leading-relaxed text-ink-soft",
						children: brief?.narrative ?? "Analysts only see records after review is complete. Generate a brief to narrate the calculated facts."
					})] })
				]
			})] }),
			dash.anomalies?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-3 text-xs font-semibold uppercase tracking-wider text-faint",
				children: "Alerts"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-2 sm:grid-cols-2",
				children: dash.anomalies.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-warn/30 bg-warn-soft p-4 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-semibold text-warn",
						children: a.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-ink-soft",
						children: a.detail
					})]
				}, a.title))
			})] }) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AskDrawer, {
				open: askOpen,
				onClose: () => setAskOpen(false),
				role,
				viewAs
			})
		]
	});
}
function Stat({ label, value, hint, warn }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-line bg-surface p-4 shadow-[var(--shadow-card)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium uppercase tracking-wider text-muted",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: `mt-2 font-display text-3xl tabular-nums ${warn ? "text-danger" : "text-accent"}`,
				children: value
			}),
			hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-faint",
				children: hint
			}) : null
		]
	});
}
//#endregion
export { Overview as component };
