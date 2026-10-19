import { w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as cn } from "./router-_Zz8wlGJ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/badge-BQauLc_z.js
var import_jsx_runtime = require_jsx_runtime();
function Badge({ className, tone = "neutral", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize", {
			neutral: "bg-bg-warm text-ink-soft",
			ok: "bg-ok-soft text-ok",
			warn: "bg-warn-soft text-warn",
			danger: "bg-danger-soft text-danger",
			accent: "bg-accent-soft text-accent"
		}[tone], className),
		...props
	});
}
//#endregion
export { Badge as t };
