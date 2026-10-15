import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { w as require_jsx_runtime, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { r as Route$4 } from "./router-C6ayO53m.mjs";
import { D as useBootstrap, b as saveView, g as listSubmissions, h as listSavedViews, i as deleteSavedView } from "./bootstrap-nXVxPEIQ.mjs";
import { t as Button } from "./button-C5sL4cLt.mjs";
import { t as Input } from "./input-jByHJSbl.mjs";
import { r as REGIONS } from "./types-BpuhrmLu.mjs";
import { t as Skeleton } from "./skeleton-mFZHMuR3.mjs";
import { t as StatusBadge } from "./status-badge-CwKYPmQR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/records-_6qBXzZQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function RecordsPage() {
	const search = Route$4.useSearch();
	const { data, viewAs } = useBootstrap();
	const [q, setQ] = (0, import_react.useState)(search.q ?? "");
	const [qDebounced, setQDebounced] = (0, import_react.useState)(search.q ?? "");
	const [region, setRegion] = (0, import_react.useState)(search.region ?? "");
	const [status, setStatus] = (0, import_react.useState)(search.status || "all");
	const [rows, setRows] = (0, import_react.useState)([]);
	const [total, setTotal] = (0, import_react.useState)(0);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [views, setViews] = (0, import_react.useState)([]);
	const [viewName, setViewName] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		const t = window.setTimeout(() => setQDebounced(q), 280);
		return () => window.clearTimeout(t);
	}, [q]);
	(0, import_react.useEffect)(() => {
		setLoading(true);
		listSubmissions({ data: {
			viewAs,
			q: qDebounced || void 0,
			region: region || void 0,
			status,
			limit: 80
		} }).then((r) => {
			setRows(r.rows);
			setTotal(r.total);
		}).finally(() => setLoading(false));
	}, [
		viewAs,
		qDebounced,
		region,
		status
	]);
	(0, import_react.useEffect)(() => {
		listSavedViews().then((list) => setViews(list)).catch(() => void 0);
	}, []);
	const role = data?.effectiveRole;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium uppercase tracking-[0.16em] text-muted",
					children: role === "submitter" ? "Your filings" : "Refined records"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 font-display text-3xl tracking-tight",
					children: "Records"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted",
					children: role === "analyst" ? "Analysts only see filings that have completed review. Pending and raw records are out of reach." : role === "submitter" ? "You can see the status of your own submissions, including anything still processing." : "Admins can inspect every state, including quarantine."
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-2 sm:flex-row",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						placeholder: "Search state, LGA, notes, name…",
						value: q,
						onChange: (e) => setQ(e.target.value),
						className: "sm:max-w-xs"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: region,
						onChange: (e) => setRegion(e.target.value),
						className: "h-11 rounded-md border border-line bg-surface px-3 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "All regions"
						}), REGIONS.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: r,
							children: r
						}, r))]
					}),
					role !== "analyst" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: status,
						onChange: (e) => setStatus(e.target.value),
						className: "h-11 rounded-md border border-line bg-surface px-3 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "all",
								children: "All statuses"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "accepted",
								children: "Accepted"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "pending_review",
								children: "Pending"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "quarantined",
								children: "Quarantined"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "rejected",
								children: "Rejected"
							})
						]
					}) : null
				]
			}),
			role !== "submitter" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2",
				children: [views.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "inline-flex h-9 items-center gap-2 rounded-full bg-bg-warm px-3 text-xs",
					onClick: () => {
						const f = typeof v.filters === "string" ? JSON.parse(v.filters) : v.filters;
						setQ(f.q ?? "");
						setRegion(f.region ?? "");
						setStatus(f.status || "all");
					},
					children: [v.name, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						role: "button",
						tabIndex: 0,
						className: "text-faint hover:text-danger",
						onClick: (e) => {
							e.stopPropagation();
							deleteSavedView({ data: { id: v.id } }).then(() => setViews((list) => list.filter((x) => x.id !== v.id)));
						},
						children: "×"
					})]
				}, v.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "flex gap-2",
					onSubmit: async (e) => {
						e.preventDefault();
						if (!viewName.trim()) return;
						await saveView({ data: {
							name: viewName,
							filters: {
								q: qDebounced,
								region,
								status
							}
						} });
						setViewName("");
						setViews(await listSavedViews());
						toast.success("View saved");
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: viewName,
						onChange: (e) => setViewName(e.target.value),
						placeholder: "Save this view…",
						className: "h-9 w-40"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						size: "sm",
						variant: "secondary",
						children: "Save"
					})]
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs text-faint tabular-nums",
				children: [total, " matching"]
			}),
			loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-64" }) : rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "No records in this view."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto rounded-xl bg-surface shadow-[var(--shadow-card)]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full min-w-[720px] text-left text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "border-b border-line text-xs uppercase tracking-wider text-muted",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 font-medium",
								children: "ID"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 font-medium",
								children: "Form"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 font-medium",
								children: "Region"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 font-medium",
								children: "Category"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 font-medium",
								children: "Status"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 font-medium",
								children: "When"
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-line/70 last:border-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 font-mono text-xs",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/app/records/$id",
									params: { id: String(r.id) },
									className: "text-accent hover:underline",
									children: ["#", r.id]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: r.schema_name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: r.region ?? "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: r.category ?? "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: r.status })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 text-muted tabular-nums",
								children: new Date(r.created_at).toLocaleDateString()
							})
						]
					}, r.id)) })]
				})
			})
		]
	});
}
//#endregion
export { RecordsPage as component };
