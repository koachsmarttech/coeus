import { w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Badge } from "./badge-BQauLc_z.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/status-badge-C4Fypzzp.js
var import_jsx_runtime = require_jsx_runtime();
function StatusBadge({ status }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		tone: status === "accepted" ? "ok" : status === "quarantined" || status === "rejected" ? "danger" : status === "pending_review" ? "warn" : "neutral",
		children: status === "pending_review" ? "Pending review" : status === "quarantined" ? "Quarantined" : status
	});
}
//#endregion
export { StatusBadge as t };
