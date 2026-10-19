import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { D as useBootstrap, _ as listSummaries, o as flagSummary, s as generateSummary } from "./bootstrap-Dbln8WC-.mjs";
import { t as Button } from "./button-CPNhbiud.mjs";
import { i as CardTitle, n as CardDesc, r as CardHeader, t as Card } from "./card-BoZDzAlh.mjs";
import { t as Skeleton } from "./skeleton-BU-YmEdi.mjs";
import { t as Badge } from "./badge-BQauLc_z.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/insights-CvSoiidk.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function InsightsPage() {
	const { data, viewAs } = useBootstrap();
	const [rows, setRows] = (0, import_react.useState)([]);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [loading, setLoading] = (0, import_react.useState)(true);
	function reload() {
		setLoading(true);
		listSummaries({ data: { viewAs } }).then(setRows).catch((e) => toast.error(e instanceof Error ? e.message : "Failed")).finally(() => setLoading(false));
	}
	(0, import_react.useEffect)(() => {
		reload();
	}, [viewAs]);
	if (data?.effectiveRole === "submitter") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted",
		children: "Briefs are for analysts and admins."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "flex flex-wrap items-end justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium uppercase tracking-[0.16em] text-muted",
					children: "Narrated facts"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 font-display text-3xl tracking-tight",
					children: "Weekly briefs"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted",
					children: "Numbers are calculated first. The model only writes from that bundle, with a model id stored on every brief."
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				disabled: busy,
				onClick: async () => {
					setBusy(true);
					try {
						await generateSummary({ data: { viewAs } });
						toast.success("Brief generated");
						reload();
					} catch (e) {
						toast.error(e instanceof Error ? e.message : "Failed");
					} finally {
						setBusy(false);
					}
				},
				children: busy ? "Writing…" : "Generate brief"
			})]
		}), loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-48" }) : rows.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: s.title }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardDesc, { children: [
				s.period_start,
				" → ",
				s.period_end,
				" · ",
				s.trigger,
				" · ",
				s.model,
				" · ",
				s.prompt_version
			] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
				tone: s.confidence === "high" ? "ok" : s.confidence === "low" ? "warn" : "neutral",
				children: [s.confidence, " confidence"]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "whitespace-pre-wrap text-sm leading-relaxed text-ink-soft",
				children: s.narrative
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 flex flex-wrap items-center gap-2",
				children: s.flagged ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					tone: "danger",
					children: "Flagged"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: "ghost",
					onClick: async () => {
						await flagSummary({ data: { id: s.id } });
						toast.success("Thanks — this brief is marked inaccurate");
						reload();
					},
					children: "Flag as inaccurate"
				})
			})
		] }, s.id))]
	});
}
//#endregion
export { InsightsPage as component };
