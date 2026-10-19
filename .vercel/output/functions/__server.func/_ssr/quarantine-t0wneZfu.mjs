import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { w as require_jsx_runtime, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { D as useBootstrap, g as listSubmissions, y as resolveQuarantine } from "./bootstrap-Dbln8WC-.mjs";
import { t as Button } from "./button-CPNhbiud.mjs";
import { t as Card } from "./card-BoZDzAlh.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/quarantine-t0wneZfu.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function QuarantinePage() {
	const { data, viewAs } = useBootstrap();
	const [rows, setRows] = (0, import_react.useState)([]);
	function reload() {
		listSubmissions({ data: {
			viewAs,
			status: "quarantined",
			limit: 100
		} }).then((r) => setRows(r.rows));
	}
	(0, import_react.useEffect)(() => {
		reload();
	}, [viewAs]);
	if (data?.profile.role !== "admin") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted",
		children: "Quarantine is admin-only."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium uppercase tracking-[0.16em] text-muted",
				children: "Held records"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-1 font-display text-3xl tracking-tight",
				children: "Quarantine"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-xl text-sm text-muted",
				children: "Failed checks never disappear. Review, correct the process, or accept with an override."
			})
		] }), rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted",
			children: "Nothing in quarantine."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "space-y-3",
			children: rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/app/records/$id",
						params: { id: String(r.id) },
						className: "font-medium text-accent hover:underline",
						children: [
							"#",
							r.id,
							" ",
							r.schema_name
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm text-muted",
						children: [
							r.region,
							" · ",
							r.submitter_name,
							" · ",
							new Date(r.created_at).toLocaleString()
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-2 list-disc pl-5 text-sm text-danger",
						children: (r.validation_errors ?? []).map((e, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: e.message }, i))
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "secondary",
						onClick: async () => {
							await resolveQuarantine({ data: {
								id: r.id,
								action: "accept"
							} });
							toast.success("Accepted");
							reload();
						},
						children: "Accept"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "danger",
						onClick: async () => {
							await resolveQuarantine({ data: {
								id: r.id,
								action: "reject"
							} });
							toast.success("Rejected");
							reload();
						},
						children: "Reject"
					})]
				})]
			}) }, r.id))
		})]
	});
}
//#endregion
export { QuarantinePage as component };
