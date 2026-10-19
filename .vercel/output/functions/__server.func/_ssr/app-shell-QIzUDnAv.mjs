import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import {
  _ as Outlet,
  m as useRouterState,
  w as require_jsx_runtime,
  x as Link,
} from "../_libs/@tanstack/react-router+[...].mjs";
import {
  a as Sparkles,
  d as Menu,
  h as ClipboardList,
  m as FileUp,
  o as ShieldAlert,
  p as LayoutDashboard,
  s as Settings2,
  t as X,
  u as MessageSquare,
} from "../_libs/lucide-react.mjs";
import { t as create } from "../_libs/zustand.mjs";
import { a as cn, i as ThemeToggle } from "./router-_Zz8wlGJ.mjs";
import {
  E as updateProfileMeta,
  c as getBootstrap,
  t as BootstrapContext,
} from "./bootstrap-Dbln8WC-.mjs";
import { t as Button } from "./button-CPNhbiud.mjs";
import { i as useCurrentUser, r as UserButton } from "./gates-Bsd7b9jP.mjs";
import { t as Skeleton } from "./skeleton-BU-YmEdi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app-shell-QIzUDnAv.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var KEY = "Coeus.viewAs";
function readViewAs() {
  if (typeof window === "undefined") return null;
  try {
    const v = window.localStorage.getItem(KEY);
    if (v === "submitter" || v === "analyst" || v === "admin") return v;
  } catch {}
  return null;
}
var useViewAs = create((set) => ({
  viewAs: null,
  hydrated: false,
  hydrate: () =>
    set({
      viewAs: readViewAs(),
      hydrated: true,
    }),
  setViewAs: (role) => {
    try {
      if (role) window.localStorage.setItem(KEY, role);
      else window.localStorage.removeItem(KEY);
    } catch {}
    set({ viewAs: role });
  },
}));
/** UI labels — backend role remains submitter | analyst | admin */
function roleLabel(role) {
  if (role === "submitter") return "Reporter";
  if (role === "analyst") return "Analyst";
  return "Admin";
}
function roleBlurb(role) {
  if (role === "submitter") return "";
  if (role === "analyst") return "";
  return "";
}
var NAV = [
  {
    to: "/app",
    label: "Overview",
    icon: LayoutDashboard,
    roles: ["analyst", "admin"],
  },
  {
    to: "/app",
    label: "My Desk",
    icon: ClipboardList,
    roles: ["submitter"],
  },
  {
    to: "/app/submit",
    label: "New Report",
    icon: FileUp,
    roles: ["submitter"],
  },
  {
    to: "/app/records",
    label: "Records",
    icon: ClipboardList,
    roles: ["analyst", "admin", "submitter"],
  },
  {
    to: "/app/insights",
    label: "Briefs",
    icon: Sparkles,
    roles: ["analyst", "admin"],
  },
  {
    to: "/app/chat",
    label: "Ask Coeus",
    icon: MessageSquare,
    roles: ["analyst", "admin"],
  },
  {
    to: "/app/quarantine",
    label: "Quarantine",
    icon: ShieldAlert,
    roles: ["admin"],
  },
  {
    to: "/app/admin",
    label: "Administrator",
    icon: Settings2,
    roles: ["admin"],
  },
];
function AppShell() {
  const user = useCurrentUser();
  const { viewAs, setViewAs, hydrate, hydrated } = useViewAs();
  const [data, setData] = (0, import_react.useState)(null);
  const [loading, setLoading] = (0, import_react.useState)(true);
  const [error, setError] = (0, import_react.useState)(null);
  const [open, setOpen] = (0, import_react.useState)(false);
  const [tick, setTick] = (0, import_react.useState)(0);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  (0, import_react.useEffect)(() => {
    hydrate();
  }, [hydrate]);
  (0, import_react.useEffect)(() => {
    if (!hydrated) return;
    setLoading(true);
    getBootstrap({ data: { viewAs } })
      .then((b) => {
        setData(b);
        setError(null);
        if (user?.displayName || user?.primaryEmail)
          updateProfileMeta({
            data: {
              name: user.displayName ?? void 0,
              email: user.primaryEmail ?? void 0,
            },
          });
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, [hydrated, viewAs, user?.displayName, user?.primaryEmail, tick]);
  const role = data?.effectiveRole ?? "submitter";
  const isAdmin = data?.profile.role === "admin";
  const items = (0, import_react.useMemo)(() => NAV.filter((n) => n.roles.includes(role)), [role]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BootstrapContext.Provider, {
    value: {
      data,
      loading,
      error,
      reload: () => setTick((n) => n + 1),
      viewAs,
      setViewAs,
    },
    children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
      className: "min-h-dvh bg-bg text-ink",
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
          href: "#main",
          className:
            "sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-ink focus:px-3 focus:py-2 focus:text-accent-fg",
          children: "Skip to content",
        }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
          className: "sticky top-0 z-30 border-b border-line/80 bg-surface/90 backdrop-blur-md",
          children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
            className: "mx-auto flex h-14 max-w-[1400px] items-center gap-3 px-4",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
                type: "button",
                className: "inline-flex size-11 items-center justify-center rounded-md lg:hidden",
                onClick: () => setOpen(true),
                "aria-label": "Open menu",
                children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, {
                  className: "size-5",
                }),
              }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
                to: "/app",
                className: "font-display text-xl tracking-tight text-accent",
                children: "Data Reporting Portal",
              }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
                className: "hidden text-xs text-faint md:inline",
                children: "Reporter → Analyst → Admin",
              }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
                className: "ml-auto flex items-center gap-1 sm:gap-2",
                children: [
                  isAdmin
                    ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
                        className: "hidden items-center gap-2 text-xs text-muted md:flex",
                        children: [
                          "View as",
                          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
                            value: viewAs ?? data?.profile.role ?? "admin",
                            onChange: (e) => setViewAs(e.target.value),
                            className:
                              "h-9 rounded-md border border-line bg-surface px-2 text-xs text-ink",
                            children: [
                              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
                                value: "admin",
                                children: "Admin",
                              }),
                              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
                                value: "analyst",
                                children: "Analyst",
                              }),
                              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
                                value: "submitter",
                                children: "Reporter",
                              }),
                            ],
                          }),
                        ],
                      })
                    : null,
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
                    className:
                      "rounded-full bg-accent px-2.5 py-1 text-[11px] font-semibold text-accent-fg",
                    children: roleLabel(role),
                  }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeToggle, {}),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {}),
                ],
              }),
            ],
          }),
        }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
          className: "mx-auto flex max-w-[1400px]",
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
              className:
                "sticky top-14 hidden h-[calc(100dvh-3.5rem)] w-56 shrink-0 border-r border-line/70 p-3 lg:block",
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
                  className:
                    "mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-faint",
                  children: [roleLabel(role), " menu"],
                }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavList, {
                  items,
                  pathname,
                }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
                  className:
                    "mt-6 rounded-lg border border-line bg-accent-soft/60 p-3 text-[11px] leading-relaxed text-ink-soft",
                  children: roleBlurb(role),
                }),
              ],
            }),
            open
              ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
                  className: "fixed inset-0 z-40 lg:hidden",
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
                      type: "button",
                      className: "absolute inset-0 bg-scrim",
                      "aria-label": "Close menu",
                      onClick: () => setOpen(false),
                    }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
                      className:
                        "absolute left-0 top-0 flex h-full w-72 flex-col bg-surface p-4 shadow-xl",
                      children: [
                        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
                          className: "mb-4 flex items-center justify-between",
                          children: [
                            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
                              className: "font-display text-lg text-accent",
                              children: "Data Reporting Portal",
                            }),
                            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
                              type: "button",
                              className: "size-10",
                              onClick: () => setOpen(false),
                              "aria-label": "Close",
                              children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
                                className: "size-5",
                              }),
                            }),
                          ],
                        }),
                        isAdmin
                          ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
                              className: "mb-4 block text-xs text-muted",
                              children: [
                                "View as",
                                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
                                  value: viewAs ?? data?.profile.role ?? "admin",
                                  onChange: (e) => setViewAs(e.target.value),
                                  className:
                                    "mt-1 h-11 w-full rounded-md border border-line bg-surface px-2 text-sm text-ink",
                                  children: [
                                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
                                      value: "admin",
                                      children: "Admin",
                                    }),
                                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
                                      value: "analyst",
                                      children: "Analyst",
                                    }),
                                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
                                      value: "submitter",
                                      children: "Reporter",
                                    }),
                                  ],
                                }),
                              ],
                            })
                          : null,
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavList, {
                          items,
                          pathname,
                          onNavigate: () => setOpen(false),
                        }),
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
                          className: "mt-4 text-xs text-muted",
                          children: roleBlurb(role),
                        }),
                      ],
                    }),
                  ],
                })
              : null,
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
              id: "main",
              className: "min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8",
              children:
                loading && !data
                  ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShellSkeleton, {})
                  : error && !data
                    ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
                        className: "rounded-xl bg-surface p-6 shadow-[var(--shadow-card)]",
                        children: [
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
                            className: "text-sm text-danger",
                            children: error,
                          }),
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
                            className: "mt-3",
                            onClick: () => setTick((n) => n + 1),
                            children: "Retry",
                          }),
                        ],
                      })
                    : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}),
            }),
          ],
        }),
      ],
    }),
  });
}
function NavList({ items, pathname, onNavigate }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
    className: "flex flex-col gap-1",
    children: items.map((item) => {
      const active =
        item.to === "/app"
          ? pathname === "/app"
          : pathname === item.to || pathname.startsWith(`${item.to}/`);
      const Icon = item.icon;
      return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
        Link,
        {
          to: item.to,
          onClick: onNavigate,
          className: cn(
            "flex h-11 items-center gap-2.5 rounded-md px-3 text-sm font-medium",
            active ? "bg-accent text-accent-fg" : "text-ink-soft hover:bg-bg-warm",
          ),
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" }),
            item.label,
          ],
        },
        item.to + item.label,
      );
    }),
  });
}
function ShellSkeleton() {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
    className: "space-y-4",
    children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-8 w-48" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
        className: "grid gap-3 sm:grid-cols-3",
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-24" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-24" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-24" }),
        ],
      }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-64" }),
    ],
  });
}
//#endregion
export { roleLabel as n, AppShell as t };
