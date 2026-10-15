import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { C as useRouter, _ as Outlet, b as createRootRoute, f as Scripts, g as createRouter, p as HeadContent, v as lazyRouteComponent, w as require_jsx_runtime, y as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as getServerFnById, i as TSS_SERVER_FUNCTION, r as createServerFn, s as __exportAll } from "./ssr.mjs";
import { L as string, N as number, P as object, R as union, j as literal } from "../_libs/@better-auth/core+[...].mjs";
import { n as auth } from "./server-B09ZYjv9.mjs";
import { a as Sun, i as TriangleAlert, u as Moon } from "../_libs/lucide-react.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { t as create } from "../_libs/zustand.mjs";
import { n as clsx } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-C6ayO53m.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 bg-bg px-6 text-center text-ink",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-danger",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-muted",
				children: errorMessage(error)
			})
		]
	});
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var ACCOUNTS_KEY = "drp.local.accounts.v1";
var SESSION_KEY = "drp.local.session.v1";
var listeners = /* @__PURE__ */ new Set();
var localMode = null;
var currentUser = null;
function emit() {
	for (const listener of listeners) listener();
}
function subscribe(listener) {
	listeners.add(listener);
	return () => listeners.delete(listener);
}
function getSnapshot() {
	return currentUser;
}
function getServerSnapshot() {
	return null;
}
function readAccounts() {
	try {
		return JSON.parse(localStorage.getItem(ACCOUNTS_KEY) ?? "[]");
	} catch {
		return [];
	}
}
function readSession() {
	try {
		const id = localStorage.getItem(SESSION_KEY);
		currentUser = id ? readAccounts().find((a) => a.id === id) ?? null : null;
	} catch {
		currentUser = null;
	}
}
function isLocalAuthMode() {
	return localMode;
}
function initializeLocalAuth(enabled) {
	localMode = enabled;
	if (enabled) readSession();
	emit();
}
function useLocalUser() {
	return {
		user: (0, import_react.useSyncExternalStore)(subscribe, getSnapshot, getServerSnapshot),
		isPending: localMode === null
	};
}
function useLocalMode() {
	return (0, import_react.useSyncExternalStore)(subscribe, () => localMode, () => null);
}
async function hashPassword(password, salt) {
	const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
	const bits = await crypto.subtle.deriveBits({
		name: "PBKDF2",
		salt: Uint8Array.from(atob(salt), (c) => c.charCodeAt(0)),
		iterations: 12e4,
		hash: "SHA-256"
	}, key, 256);
	return btoa(String.fromCharCode(...new Uint8Array(bits)));
}
function saveSession(user) {
	localStorage.setItem(SESSION_KEY, user.id);
	currentUser = user;
	emit();
}
async function createLocalAccount(name, email, password) {
	const normalized = email.trim().toLowerCase();
	const accounts = readAccounts();
	if (accounts.some((account) => account.email === normalized)) throw new Error("An account with this email already exists in this browser.");
	const saltBytes = crypto.getRandomValues(/* @__PURE__ */ new Uint8Array(16));
	const salt = btoa(String.fromCharCode(...saltBytes));
	const user = {
		id: crypto.randomUUID(),
		name: name.trim() || normalized.split("@")[0] || "Member",
		email: normalized
	};
	accounts.push({
		...user,
		salt,
		passwordHash: await hashPassword(password, salt)
	});
	localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
	saveSession(user);
}
async function signInLocalAccount(email, password) {
	const normalized = email.trim().toLowerCase();
	const account = readAccounts().find((item) => item.email === normalized);
	if (!account || await hashPassword(password, account.salt) !== account.passwordHash) throw new Error("Email or password is incorrect.");
	saveSession({
		id: account.id,
		name: account.name,
		email: account.email
	});
}
function signOutLocalAccount() {
	localStorage.removeItem(SESSION_KEY);
	currentUser = null;
	emit();
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		fetch("/api/auth/mode").then((response) => response.ok ? response.json() : Promise.reject()).then((result) => initializeLocalAuth(result.localOnly === true)).catch(() => initializeLocalAuth(false)).finally(() => setReady(true));
	}, []);
	return ready ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children }) : null;
}
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: literal("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		hostMessageHandlers.get(envelope.data.type)?.(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
var THEME_KEY = "Coeus.theme";
var THEME_COLOR_LIGHT = "#F3EEE6";
var THEME_COLOR_DARK = "#12100E";
var THEME_BOOT = `(function(){try{var t=localStorage.getItem("Coeus.theme");var d=t==="dark"||(t!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches);var r=document.documentElement;r.classList.toggle("dark",d);r.style.colorScheme=d?"dark":"light";var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute("content",d?"#12100E":"#F3EEE6")}catch(e){}})();`;
function getSystem() {
	if (typeof window === "undefined") return "light";
	return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
function readStoredTheme() {
	if (typeof window === "undefined") return "system";
	try {
		const v = window.localStorage.getItem(THEME_KEY);
		if (v === "light" || v === "dark" || v === "system") return v;
	} catch {}
	return "system";
}
function resolveTheme(theme) {
	return theme === "system" ? getSystem() : theme;
}
function applyTheme(theme) {
	if (typeof document === "undefined") return;
	const resolved = resolveTheme(theme);
	const root = document.documentElement;
	root.classList.toggle("dark", resolved === "dark");
	root.style.colorScheme = resolved;
	const meta = document.querySelector("meta[name=\"theme-color\"]");
	if (meta) meta.setAttribute("content", resolved === "dark" ? THEME_COLOR_DARK : THEME_COLOR_LIGHT);
}
var useTheme = create((set) => ({
	theme: "system",
	resolved: "light",
	hydrated: false,
	hydrate: () => {
		const theme = readStoredTheme();
		const resolved = resolveTheme(theme);
		applyTheme(theme);
		set({
			theme,
			resolved,
			hydrated: true
		});
	},
	setTheme: (theme) => {
		try {
			window.localStorage.setItem(THEME_KEY, theme);
		} catch {}
		const resolved = resolveTheme(theme);
		applyTheme(theme);
		set({
			theme,
			resolved
		});
	}
}));
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var useIsoLayoutEffect = typeof window !== "undefined" ? import_react.useLayoutEffect : import_react.useEffect;
function ThemeSync() {
	const hydrate = useTheme((s) => s.hydrate);
	const theme = useTheme((s) => s.theme);
	useIsoLayoutEffect(() => {
		hydrate();
	}, [hydrate]);
	(0, import_react.useEffect)(() => {
		if (theme !== "system") return;
		const mq = window.matchMedia("(prefers-color-scheme: dark)");
		const onChange = () => {
			applyTheme("system");
			useTheme.setState({ resolved: mq.matches ? "dark" : "light" });
		};
		mq.addEventListener("change", onChange);
		return () => mq.removeEventListener("change", onChange);
	}, [theme]);
	return null;
}
function ThemedToaster() {
	const resolved = useTheme((s) => s.resolved);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		theme: resolved,
		position: "bottom-right",
		toastOptions: { style: {
			background: "var(--color-surface)",
			color: "var(--color-ink)",
			border: "1px solid var(--color-line)"
		} }
	});
}
function ThemeToggle({ className }) {
	const setTheme = useTheme((s) => s.setTheme);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		className: cn("inline-flex size-11 items-center justify-center rounded-md text-ink-soft transition-colors duration-150 hover:bg-bg-warm hover:text-ink", className),
		"aria-label": "Toggle dark mode",
		title: "Toggle dark mode",
		onClick: () => {
			const dark = document.documentElement.classList.contains("dark");
			setTheme(dark ? "light" : "dark");
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, {
			className: "hidden size-4 dark:block",
			"aria-hidden": true
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, {
			className: "size-4 dark:hidden",
			"aria-hidden": true
		})]
	});
}
var styles_default = "/assets/styles-BRAbLCxv.css";
var APP_NAME = "Data Reporting Portal";
var fetchSessionUser = createServerFn({ method: "GET" }).handler(createSsrRpc("2c4985e96c199268f7f639534cb5e8e31d6b19d43286bf77416413db60ffde26"));
var Route$13 = createRootRoute({
	beforeLoad: async () => ({ sessionUser: await fetchSessionUser() }),
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: APP_NAME },
			{
				name: "theme-color",
				content: "#F3EEE6"
			},
			{
				name: "color-scheme",
				content: "light dark"
			},
			{
				name: "description",
				content: "Collect field reports, check them, and understand them with grounded AI."
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600&family=Fraunces:opsz,wght@9..144,500;9..144,600&family=IBM+Plex+Mono:wght@400;500&display=swap"
			}
		]
	}),
	component: () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		className: "antialiased",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("head", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", { dangerouslySetInnerHTML: { __html: THEME_BOOT } }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", {
			className: "text-ink",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AuthProvider, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeSync, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemedToaster, {})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
			]
		})]
	})
});
var $$splitComponentImporter$10 = () => import("./routes-nU0vyWTT.mjs");
var Route$12 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$10, "component") });
var $$splitComponentImporter$9 = () => import("./app-CNTufTFj.mjs");
var Route$11 = createFileRoute("/app")({ component: lazyRouteComponent($$splitComponentImporter$9, "component") });
var $$splitComponentImporter$8 = () => import("./login-CyX1sMzQ.mjs");
var Route$10 = createFileRoute("/login")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var $$splitComponentImporter$7 = () => import("./app-Dq4pH0ll.mjs");
var Route$9 = createFileRoute("/app/")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
var $$splitComponentImporter$6 = () => import("./admin-VEMlx7vU.mjs");
var Route$8 = createFileRoute("/app/admin")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("./chat-D0J-MxJG.mjs");
var Route$7 = createFileRoute("/app/chat")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./insights-o8dwD20F.mjs");
var Route$6 = createFileRoute("/app/insights")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./quarantine-DK40yRY1.mjs");
var Route$5 = createFileRoute("/app/quarantine")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./records-_6qBXzZQ.mjs");
var Route$4 = createFileRoute("/app/records")({
	validateSearch: (s) => ({
		region: typeof s.region === "string" ? s.region : void 0,
		status: typeof s.status === "string" ? s.status : void 0,
		q: typeof s.q === "string" ? s.q : void 0
	}),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./submit-6aUnuCJL.mjs");
var Route$3 = createFileRoute("/app/submit")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var Route$2 = createFileRoute("/api/auth/$")({ server: { handlers: {
	GET: ({ request }) => auth.handler(request),
	POST: ({ request }) => auth.handler(request)
} } });
var Route$1 = createFileRoute("/api/auth/mode")({ server: { handlers: { GET: () => Response.json({ localOnly: !Boolean(process.env.DATABASE_URL?.trim()) }) } } });
var $$splitComponentImporter = () => import("./records._id-BQBZgpiQ.mjs");
var Route = createFileRoute("/app/records/$id")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var IndexRoute = Route$12.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$13
});
var AppRoute = Route$11.update({
	id: "/app",
	path: "/app",
	getParentRoute: () => Route$13
});
var LoginRoute = Route$10.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$13
});
var AppIndexRoute = Route$9.update({
	id: "/",
	path: "/",
	getParentRoute: () => AppRoute
});
var AppAdminRoute = Route$8.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => AppRoute
});
var AppChatRoute = Route$7.update({
	id: "/chat",
	path: "/chat",
	getParentRoute: () => AppRoute
});
var AppInsightsRoute = Route$6.update({
	id: "/insights",
	path: "/insights",
	getParentRoute: () => AppRoute
});
var AppQuarantineRoute = Route$5.update({
	id: "/quarantine",
	path: "/quarantine",
	getParentRoute: () => AppRoute
});
var AppRecordsRoute = Route$4.update({
	id: "/records",
	path: "/records",
	getParentRoute: () => AppRoute
});
var AppSubmitRoute = Route$3.update({
	id: "/submit",
	path: "/submit",
	getParentRoute: () => AppRoute
});
var ApiAuthSplatRoute = Route$2.update({
	id: "/api/auth/$",
	path: "/api/auth/$",
	getParentRoute: () => Route$13
});
var ApiAuthModeRoute = Route$1.update({
	id: "/api/auth/mode",
	path: "/api/auth/mode",
	getParentRoute: () => Route$13
});
var AppRecordsRouteChildren = { AppRecordsIdRoute: Route.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => AppRecordsRoute
}) };
var AppRouteChildren = {
	AppAdminRoute,
	AppChatRoute,
	AppInsightsRoute,
	AppQuarantineRoute,
	AppRecordsRoute: AppRecordsRoute._addFileChildren(AppRecordsRouteChildren),
	AppSubmitRoute,
	AppIndexRoute
};
var rootRouteChildren = {
	IndexRoute,
	AppRoute: AppRoute._addFileChildren(AppRouteChildren),
	LoginRoute,
	ApiAuthSplatRoute,
	ApiAuthModeRoute
};
var routeTree = Route$13._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { cn as a, signInLocalAccount as c, useLocalUser as d, createSsrRpc as f, ThemeToggle as i, signOutLocalAccount as l, Route as n, createLocalAccount as o, Route$4 as r, isLocalAuthMode as s, router_exports as t, useLocalMode as u };
