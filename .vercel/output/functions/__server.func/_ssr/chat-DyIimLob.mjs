import { w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { D as useBootstrap } from "./bootstrap-Dbln8WC-.mjs";
import { n as ChatPanel } from "./chat-panel-BfRJ3qfV.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/chat-DyIimLob.js
var import_jsx_runtime = require_jsx_runtime();
function ChatPage() {
	const { data, viewAs } = useBootstrap();
	const role = data?.effectiveRole ?? "submitter";
	if (role === "submitter") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-lg space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium uppercase tracking-[0.16em] text-muted",
				children: "Ask Coeus"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl tracking-tight",
				children: "Not available"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Chat is limited to analyst and admin roles so submitters stay focused on filing. Ask a colleague with analyst access to query the archive."
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex h-[calc(100dvh-8rem)] max-w-2xl flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "mb-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium uppercase tracking-[0.16em] text-muted",
				children: "Grounded chat"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-1 font-display text-3xl tracking-tight",
				children: "Ask Coeus"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "min-h-0 flex-1 rounded-xl bg-surface p-4 shadow-[var(--shadow-card)]",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChatPanel, {
				role,
				viewAs
			})
		})]
	});
}
//#endregion
export { ChatPage as component };
