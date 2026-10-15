import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { w as require_jsx_runtime, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as Route } from "./router-C6ayO53m.mjs";
import { D as useBootstrap, u as getSubmission } from "./bootstrap-nXVxPEIQ.mjs";
import { i as CardTitle, n as CardDesc, r as CardHeader, t as Card } from "./card-DpV6wKp_.mjs";
import { t as Skeleton } from "./skeleton-mFZHMuR3.mjs";
import { t as StatusBadge } from "./status-badge-CwKYPmQR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/records._id-BQBZgpiQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function RecordDetail() {
	const { id } = Route.useParams();
	const { viewAs } = useBootstrap();
	const [row, setRow] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		getSubmission({ data: {
			id: Number(id),
			viewAs
		} }).then(setRow).catch((e) => setError(e instanceof Error ? e.message : "Not found"));
	}, [id, viewAs]);
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Not available" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDesc, {
			className: "mt-2",
			children: error === "Not found" ? "This record is outside your role. Analysts cannot open pending or quarantined filings." : error
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/app/records",
			className: "mt-4 inline-block text-sm text-accent hover:underline",
			children: "Back to records"
		})
	] });
	if (!row) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-64" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-2xl space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/app/records",
				className: "text-sm text-muted hover:text-ink",
				children: "← Records"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex flex-wrap items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-mono text-xs text-faint",
						children: ["#", row.id]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-3xl tracking-tight",
						children: row.schema_name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm text-muted",
						children: [
							row.submitter_name,
							" · ",
							row.channel,
							" · ",
							new Date(row.created_at).toLocaleString()
						]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: row.status })]
			}),
			row.ai_notes ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "AI review" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardDesc, { children: [
				row.ai_model,
				" ",
				row.ai_reviewed_at ? `· ${new Date(row.ai_reviewed_at).toLocaleString()}` : null
			] })] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm leading-relaxed",
				children: row.ai_notes
			})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Still in review — analysts cannot see this record yet."
			}),
			row.validation_errors?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "bg-danger-soft",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Held because" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-2 list-disc pl-5 text-sm text-danger",
					children: row.validation_errors.map((e, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: e.message }, i))
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Filed values" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
				className: "mt-4 grid gap-3 sm:grid-cols-2",
				children: row.schema_fields.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: f.type === "textarea" ? "sm:col-span-2" : "",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-xs uppercase tracking-wider text-muted",
						children: f.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "mt-1 text-sm",
						children: formatVal(row.payload[f.key])
					})]
				}, f.key))
			})] })
		]
	});
}
function formatVal(v) {
	if (v === true) return "Yes";
	if (v === false) return "No";
	if (v === null || v === void 0 || v === "") return "—";
	return String(v);
}
//#endregion
export { RecordDetail as component };
