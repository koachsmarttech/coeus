import { i as e, t } from "./react-DB-4Zxce.js";
import { n, r, t as i } from "./link-C85B5GQr.js";
import { n as a } from "./useMatch-H3fDmcxm.js";
import { r as o, t as s } from "./utils-D0icuJXL.js";
import { t as c } from "./createLucideIcon-BG7u4oKA.js";
import { t as l } from "./x-Or4oqxn7.js";
import { D as u, l as d, t as f } from "./bootstrap-oMSY54iG.js";
import { d as p, i as m, r as h } from "./index-C0nCe6P2.js";
import { i as g, r as _ } from "./gates-dYOZgE3A.js";
import { t as v } from "./button-CZaF3Ix3.js";
import { t as y } from "./skeleton-Cyw-AFUS.js";
function b(e) {
  let t = r({ warn: e?.router === void 0 }),
    i = e?.router || t;
  return n(i.stores.__store, a(e, i));
}
var x = c(`clipboard-list`, [
    [`rect`, { width: `8`, height: `4`, x: `8`, y: `2`, rx: `1`, ry: `1`, key: `tgr4d6` }],
    [
      `path`,
      {
        d: `M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2`,
        key: `116196`,
      },
    ],
    [`path`, { d: `M12 11h4`, key: `1jrz19` }],
    [`path`, { d: `M12 16h4`, key: `n85exb` }],
    [`path`, { d: `M8 11h.01`, key: `1dfujw` }],
    [`path`, { d: `M8 16h.01`, key: `18s6g9` }],
  ]),
  S = c(`file-up`, [
    [`path`, { d: `M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z`, key: `1rqfz7` }],
    [`path`, { d: `M14 2v4a2 2 0 0 0 2 2h4`, key: `tnqrlb` }],
    [`path`, { d: `M12 12v6`, key: `3ahymv` }],
    [`path`, { d: `m15 15-3-3-3 3`, key: `15xj92` }],
  ]),
  C = c(`layout-dashboard`, [
    [`rect`, { width: `7`, height: `9`, x: `3`, y: `3`, rx: `1`, key: `10lvy0` }],
    [`rect`, { width: `7`, height: `5`, x: `14`, y: `3`, rx: `1`, key: `16une8` }],
    [`rect`, { width: `7`, height: `9`, x: `14`, y: `12`, rx: `1`, key: `1hutg5` }],
    [`rect`, { width: `7`, height: `5`, x: `3`, y: `16`, rx: `1`, key: `ldoo1y` }],
  ]),
  w = c(`menu`, [
    [`path`, { d: `M4 12h16`, key: `1lakjw` }],
    [`path`, { d: `M4 18h16`, key: `19g7jn` }],
    [`path`, { d: `M4 6h16`, key: `1o0s65` }],
  ]),
  T = c(`message-square`, [
    [`path`, { d: `M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z`, key: `1lielz` }],
  ]),
  E = c(`settings-2`, [
    [`path`, { d: `M20 7h-9`, key: `3s1dr2` }],
    [`path`, { d: `M14 17H5`, key: `gfn3mx` }],
    [`circle`, { cx: `17`, cy: `17`, r: `3`, key: `18b49y` }],
    [`circle`, { cx: `7`, cy: `7`, r: `3`, key: `dfmy0x` }],
  ]),
  D = c(`shield-alert`, [
    [
      `path`,
      {
        d: `M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z`,
        key: `oel41y`,
      },
    ],
    [`path`, { d: `M12 8v4`, key: `1got3b` }],
    [`path`, { d: `M12 16h.01`, key: `1drbdi` }],
  ]),
  O = c(`sparkles`, [
    [
      `path`,
      {
        d: `M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z`,
        key: `4pj2yx`,
      },
    ],
    [`path`, { d: `M20 3v4`, key: `1olli1` }],
    [`path`, { d: `M22 5h-4`, key: `1gvqau` }],
    [`path`, { d: `M4 17v2`, key: `vumght` }],
    [`path`, { d: `M5 18H3`, key: `zchphs` }],
  ]),
  k = e(t(), 1),
  A = `Coeus.viewAs`;
function j() {
  if (typeof window > `u`) return null;
  try {
    let e = window.localStorage.getItem(A);
    if (e === `submitter` || e === `analyst` || e === `admin`) return e;
  } catch {}
  return null;
}
var M = m((e) => ({
    viewAs: null,
    hydrated: !1,
    hydrate: () => e({ viewAs: j(), hydrated: !0 }),
    setViewAs: (t) => {
      try {
        t ? window.localStorage.setItem(A, t) : window.localStorage.removeItem(A);
      } catch {}
      e({ viewAs: t });
    },
  })),
  N = o();
function P(e) {
  return e === `submitter` ? `Reporter` : e === `analyst` ? `Analyst` : `Admin`;
}
function F(e) {
  return e === `submitter`
    ? `You file reports and uploads. You only see your own filings. Chat is not available in this role.`
    : e === `analyst`
      ? `You review accepted records, briefs, and Ask. Pending/quarantined items stay hidden.`
      : `You manage roles, quarantine, models, and can View as Reporter or Analyst.`;
}
var I = [
  { to: `/app`, label: `Overview`, icon: C, roles: [`analyst`, `admin`] },
  { to: `/app`, label: `My Desk`, icon: x, roles: [`submitter`] },
  { to: `/app/submit`, label: `New Report`, icon: S, roles: [`submitter`] },
  { to: `/app/records`, label: `Records`, icon: x, roles: [`analyst`, `admin`, `submitter`] },
  { to: `/app/insights`, label: `Briefs`, icon: O, roles: [`analyst`, `admin`] },
  { to: `/app/chat`, label: `Ask Coeus`, icon: T, roles: [`analyst`, `admin`] },
  { to: `/app/quarantine`, label: `Quarantine`, icon: D, roles: [`admin`] },
  { to: `/app/admin`, label: `Administrator`, icon: E, roles: [`admin`] },
];
function L() {
  let e = g(),
    { viewAs: t, setViewAs: n, hydrate: r, hydrated: a } = M(),
    [o, s] = (0, k.useState)(null),
    [c, m] = (0, k.useState)(!0),
    [y, x] = (0, k.useState)(null),
    [S, C] = (0, k.useState)(!1),
    [T, E] = (0, k.useState)(0),
    D = b({ select: (e) => e.location.pathname });
  ((0, k.useEffect)(() => {
    r();
  }, [r]),
    (0, k.useEffect)(() => {
      a &&
        (m(!0),
        d({ data: { viewAs: t } })
          .then((t) => {
            (s(t),
              x(null),
              (e?.displayName || e?.primaryEmail) &&
                u({ data: { name: e.displayName ?? void 0, email: e.primaryEmail ?? void 0 } }));
          })
          .catch((e) => x(e instanceof Error ? e.message : `Failed to load`))
          .finally(() => m(!1)));
    }, [a, t, e?.displayName, e?.primaryEmail, T]));
  let O = o?.effectiveRole ?? `submitter`,
    A = o?.profile.role === `admin`,
    j = (0, k.useMemo)(() => I.filter((e) => e.roles.includes(O)), [O]);
  return (0, N.jsx)(f.Provider, {
    value: {
      data: o,
      loading: c,
      error: y,
      reload: () => E((e) => e + 1),
      viewAs: t,
      setViewAs: n,
    },
    children: (0, N.jsxs)(`div`, {
      className: `min-h-dvh bg-bg text-ink`,
      children: [
        (0, N.jsx)(`a`, {
          href: `#main`,
          className: `sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-ink focus:px-3 focus:py-2 focus:text-accent-fg`,
          children: `Skip to content`,
        }),
        (0, N.jsx)(`header`, {
          className: `sticky top-0 z-30 border-b border-line/80 bg-surface/90 backdrop-blur-md`,
          children: (0, N.jsxs)(`div`, {
            className: `mx-auto flex h-14 max-w-[1400px] items-center gap-3 px-4`,
            children: [
              (0, N.jsx)(`button`, {
                type: `button`,
                className: `inline-flex size-11 items-center justify-center rounded-md lg:hidden`,
                onClick: () => C(!0),
                "aria-label": `Open menu`,
                children: (0, N.jsx)(w, { className: `size-5` }),
              }),
              (0, N.jsx)(i, {
                to: `/app`,
                className: `font-display text-xl tracking-tight text-accent`,
                children: `Data Reporting Portal`,
              }),
              (0, N.jsx)(`span`, {
                className: `hidden text-xs text-faint md:inline`,
                children: `Reporter → Analyst → Admin`,
              }),
              (0, N.jsxs)(`div`, {
                className: `ml-auto flex items-center gap-1 sm:gap-2`,
                children: [
                  A
                    ? (0, N.jsxs)(`label`, {
                        className: `hidden items-center gap-2 text-xs text-muted md:flex`,
                        children: [
                          `View as`,
                          (0, N.jsxs)(`select`, {
                            value: t ?? o?.profile.role ?? `admin`,
                            onChange: (e) => n(e.target.value),
                            className: `h-9 rounded-md border border-line bg-surface px-2 text-xs text-ink`,
                            children: [
                              (0, N.jsx)(`option`, { value: `admin`, children: `Admin` }),
                              (0, N.jsx)(`option`, { value: `analyst`, children: `Analyst` }),
                              (0, N.jsx)(`option`, { value: `submitter`, children: `Reporter` }),
                            ],
                          }),
                        ],
                      })
                    : null,
                  (0, N.jsx)(`span`, {
                    className: `rounded-full bg-accent px-2.5 py-1 text-[11px] font-semibold text-accent-fg`,
                    children: P(O),
                  }),
                  (0, N.jsx)(h, {}),
                  (0, N.jsx)(_, {}),
                ],
              }),
            ],
          }),
        }),
        (0, N.jsxs)(`div`, {
          className: `mx-auto flex max-w-[1400px]`,
          children: [
            (0, N.jsxs)(`aside`, {
              className: `sticky top-14 hidden h-[calc(100dvh-3.5rem)] w-56 shrink-0 border-r border-line/70 p-3 lg:block`,
              children: [
                (0, N.jsxs)(`p`, {
                  className: `mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-faint`,
                  children: [P(O), ` menu`],
                }),
                (0, N.jsx)(R, { items: j, pathname: D }),
                (0, N.jsx)(`div`, {
                  className: `mt-6 rounded-lg border border-line bg-accent-soft/60 p-3 text-[11px] leading-relaxed text-ink-soft`,
                  children: F(O),
                }),
              ],
            }),
            S
              ? (0, N.jsxs)(`div`, {
                  className: `fixed inset-0 z-40 lg:hidden`,
                  children: [
                    (0, N.jsx)(`button`, {
                      type: `button`,
                      className: `absolute inset-0 bg-scrim`,
                      "aria-label": `Close menu`,
                      onClick: () => C(!1),
                    }),
                    (0, N.jsxs)(`div`, {
                      className: `absolute left-0 top-0 flex h-full w-72 flex-col bg-surface p-4 shadow-xl`,
                      children: [
                        (0, N.jsxs)(`div`, {
                          className: `mb-4 flex items-center justify-between`,
                          children: [
                            (0, N.jsx)(`span`, {
                              className: `font-display text-lg text-accent`,
                              children: `Data Reporting Portal`,
                            }),
                            (0, N.jsx)(`button`, {
                              type: `button`,
                              className: `size-10`,
                              onClick: () => C(!1),
                              "aria-label": `Close`,
                              children: (0, N.jsx)(l, { className: `size-5` }),
                            }),
                          ],
                        }),
                        A
                          ? (0, N.jsxs)(`label`, {
                              className: `mb-4 block text-xs text-muted`,
                              children: [
                                `View as`,
                                (0, N.jsxs)(`select`, {
                                  value: t ?? o?.profile.role ?? `admin`,
                                  onChange: (e) => n(e.target.value),
                                  className: `mt-1 h-11 w-full rounded-md border border-line bg-surface px-2 text-sm text-ink`,
                                  children: [
                                    (0, N.jsx)(`option`, { value: `admin`, children: `Admin` }),
                                    (0, N.jsx)(`option`, { value: `analyst`, children: `Analyst` }),
                                    (0, N.jsx)(`option`, {
                                      value: `submitter`,
                                      children: `Reporter`,
                                    }),
                                  ],
                                }),
                              ],
                            })
                          : null,
                        (0, N.jsx)(R, { items: j, pathname: D, onNavigate: () => C(!1) }),
                        (0, N.jsx)(`p`, { className: `mt-4 text-xs text-muted`, children: F(O) }),
                      ],
                    }),
                  ],
                })
              : null,
            (0, N.jsx)(`main`, {
              id: `main`,
              className: `min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8`,
              children:
                c && !o
                  ? (0, N.jsx)(z, {})
                  : y && !o
                    ? (0, N.jsxs)(`div`, {
                        className: `rounded-xl bg-surface p-6 shadow-[var(--shadow-card)]`,
                        children: [
                          (0, N.jsx)(`p`, { className: `text-sm text-danger`, children: y }),
                          (0, N.jsx)(v, {
                            className: `mt-3`,
                            onClick: () => E((e) => e + 1),
                            children: `Retry`,
                          }),
                        ],
                      })
                    : (0, N.jsx)(p, {}),
            }),
          ],
        }),
      ],
    }),
  });
}
function R({ items: e, pathname: t, onNavigate: n }) {
  return (0, N.jsx)(`nav`, {
    className: `flex flex-col gap-1`,
    children: e.map((e) => {
      let r = e.to === `/app` ? t === `/app` : t === e.to || t.startsWith(`${e.to}/`),
        a = e.icon;
      return (0, N.jsxs)(
        i,
        {
          to: e.to,
          onClick: n,
          className: s(
            `flex h-11 items-center gap-2.5 rounded-md px-3 text-sm font-medium`,
            r ? `bg-accent text-accent-fg` : `text-ink-soft hover:bg-bg-warm`,
          ),
          children: [(0, N.jsx)(a, { className: `size-4` }), e.label],
        },
        e.to + e.label,
      );
    }),
  });
}
function z() {
  return (0, N.jsxs)(`div`, {
    className: `space-y-4`,
    children: [
      (0, N.jsx)(y, { className: `h-8 w-48` }),
      (0, N.jsxs)(`div`, {
        className: `grid gap-3 sm:grid-cols-3`,
        children: [
          (0, N.jsx)(y, { className: `h-24` }),
          (0, N.jsx)(y, { className: `h-24` }),
          (0, N.jsx)(y, { className: `h-24` }),
        ],
      }),
      (0, N.jsx)(y, { className: `h-64` }),
    ],
  });
}
export { E as a, x as c, D as i, P as n, T as o, O as r, S as s, L as t };
