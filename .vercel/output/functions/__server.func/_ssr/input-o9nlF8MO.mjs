import "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as cn } from "./router-_Zz8wlGJ.mjs";
require_react();
var import_jsx_runtime = require_jsx_runtime();
function Input({ className, type, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type,
		className: cn("flex h-11 w-full rounded-md border border-line bg-surface px-3 text-sm text-ink shadow-[var(--shadow-card)] placeholder:text-faint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/35 disabled:opacity-50", className),
		...props
	});
}
function Textarea({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("flex min-h-28 w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink shadow-[var(--shadow-card)] placeholder:text-faint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/35 disabled:opacity-50", className),
		...props
	});
}
function Label({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		className: cn("text-sm font-medium text-ink-soft", className),
		...props
	});
}
//#endregion
export { Label as n, Textarea as r, Input as t };
