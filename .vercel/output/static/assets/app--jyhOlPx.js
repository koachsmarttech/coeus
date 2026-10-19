import { i as e, t } from "./react-DB-4Zxce.js";
import { t as n } from "./link-C85B5GQr.js";
import { r } from "./utils-D0icuJXL.js";
import { a as i, c as a, i as o, n as s, o as c, r as l, s as u } from "./app-shell-Br5ND4Ax.js";
import { t as d } from "./arrow-right-CmgconwJ.js";
import { i as f, r as p, t as m } from "./chat-panel-CckATtns.js";
import { _ as h, n as g, u as _, v } from "./bootstrap-oMSY54iG.js";
import { t as y } from "./skeleton-Cyw-AFUS.js";
import { i as b, n as x, r as S, t as C } from "./card-DO6v5AX4.js";
import { t as w } from "./status-badge-aa_4-bQR.js";
var T = e(t()),
  E = r();
function D() {
  let { data: e, viewAs: t } = g(),
    n = e?.effectiveRole ?? `submitter`;
  return n === `submitter` ? (0, E.jsx)(k, {}) : (0, E.jsx)(A, { viewAs: t, role: n });
}
function O({ role: e }) {
  let t = [
    { id: `submitter`, label: `Reporter`, hint: `File & upload` },
    { id: `analyst`, label: `Analyst`, hint: `Review & Ask` },
    { id: `admin`, label: `Admin`, hint: `Control & roles` },
  ];
  return (0, E.jsxs)(`div`, {
    className: `rounded-xl border border-line bg-surface p-4 shadow-[var(--shadow-card)]`,
    children: [
      (0, E.jsx)(`p`, {
        className: `text-[11px] font-semibold uppercase tracking-wider text-faint`,
        children: `Your place in the flow`,
      }),
      (0, E.jsx)(`div`, {
        className: `mt-3 flex flex-col gap-2 sm:flex-row sm:items-stretch`,
        children: t.map((n, r) => {
          let i = n.id === e || (e === `admin` && n.id === `admin`);
          return (0, E.jsxs)(
            `div`,
            {
              className: `flex flex-1 items-center gap-2`,
              children: [
                (0, E.jsxs)(`div`, {
                  className: `flex-1 rounded-lg border px-3 py-2 ${i ? `border-accent bg-accent text-accent-fg` : `border-line bg-bg text-muted`}`,
                  children: [
                    (0, E.jsx)(`p`, { className: `text-sm font-semibold`, children: n.label }),
                    (0, E.jsx)(`p`, {
                      className: `text-[11px] ${i ? `text-accent-fg/80` : `text-faint`}`,
                      children: n.hint,
                    }),
                  ],
                }),
                r < t.length - 1
                  ? (0, E.jsx)(`span`, {
                      className: `hidden text-faint sm:inline`,
                      "aria-hidden": !0,
                      children: `→`,
                    })
                  : null,
              ],
            },
            n.id,
          );
        }),
      }),
    ],
  });
}
function k() {
  let { data: e, viewAs: t } = g(),
    [r, i] = (0, T.useState)([]),
    [o, s] = (0, T.useState)({ accepted: 0, quarantined: 0, pending: 0, rejected: 0 }),
    [c, l] = (0, T.useState)(0),
    [d, f] = (0, T.useState)(!0);
  return (
    (0, T.useEffect)(() => {
      h({ data: { viewAs: t, limit: 8 } })
        .then((e) => {
          (i(e?.rows ?? []),
            l(e?.total ?? 0),
            s(e?.counts ?? { accepted: 0, quarantined: 0, pending: 0, rejected: 0 }));
        })
        .catch(() => {
          (i([]), l(0));
        })
        .finally(() => f(!1));
    }, [t]),
    (0, E.jsxs)(`div`, {
      className: `space-y-6`,
      children: [
        (0, E.jsxs)(`header`, {
          children: [
            (0, E.jsx)(`p`, {
              className: `text-xs font-medium uppercase tracking-[0.16em] text-accent`,
              children: `Reporter Desk`,
            }),
            (0, E.jsxs)(`h1`, {
              className: `mt-1 font-display text-3xl tracking-tight`,
              children: [`Hello`, e?.profile.name ? `, ${e.profile.name.split(` `)[0]}` : ``],
            }),
            (0, E.jsx)(`p`, {
              className: `mt-2 max-w-xl text-sm text-muted`,
              children: `File structured reports or upload CSV, Excel, PDF, or PowerPoint. You only see your own filings.`,
            }),
          ],
        }),
        (0, E.jsx)(O, { role: `submitter` }),
        (0, E.jsxs)(`section`, {
          "aria-labelledby": `reporter-actions-title`,
          children: [
            (0, E.jsxs)(`div`, {
              className: `mb-3`,
              children: [
                (0, E.jsx)(`h2`, {
                  id: `reporter-actions-title`,
                  className: `text-sm font-semibold`,
                  children: `Quick actions`,
                }),
                (0, E.jsx)(`p`, {
                  className: `mt-1 text-xs text-muted`,
                  children: `Start a filing or check the status of one you sent.`,
                }),
              ],
            }),
            (0, E.jsxs)(`div`, {
              className: `grid gap-3 sm:grid-cols-2`,
              children: [
                (0, E.jsx)(M, {
                  to: `/app/submit`,
                  icon: u,
                  title: `File a report`,
                  description: `Complete a form or upload a supported file.`,
                  tone: `accent`,
                }),
                (0, E.jsx)(M, {
                  to: `/app/records`,
                  icon: a,
                  title: `View your records`,
                  description: `See your submissions and their latest status.`,
                }),
              ],
            }),
          ],
        }),
        (0, E.jsxs)(`section`, {
          className: `grid gap-3 sm:grid-cols-3`,
          children: [
            (0, E.jsx)(j, { label: `Your filings`, value: c, hint: `All reports you have sent` }),
            (0, E.jsx)(j, { label: `Processing`, value: o.pending, hint: `Waiting for review` }),
            (0, E.jsx)(j, {
              label: `Needs a fix`,
              value: o.quarantined,
              hint: `Check the status in Records`,
              warn: o.quarantined > 0,
            }),
          ],
        }),
        (0, E.jsxs)(C, {
          children: [
            (0, E.jsxs)(S, {
              children: [
                (0, E.jsxs)(`div`, {
                  children: [
                    (0, E.jsx)(b, { children: `Recent submissions` }),
                    (0, E.jsx)(x, {
                      children: `Status stays visible to you even while analysts only see accepted rows.`,
                    }),
                  ],
                }),
                (0, E.jsx)(n, {
                  to: `/app/records`,
                  className: `text-sm font-medium text-accent hover:underline`,
                  children: `All records`,
                }),
              ],
            }),
            d
              ? (0, E.jsx)(y, { className: `h-32` })
              : r.length === 0
                ? (0, E.jsx)(`p`, {
                    className: `text-sm text-muted`,
                    children: `Nothing filed yet. Start with an incident report.`,
                  })
                : (0, E.jsx)(`ul`, {
                    className: `divide-y divide-line`,
                    children: r.map((e) =>
                      (0, E.jsxs)(
                        `li`,
                        {
                          className: `flex items-center justify-between gap-3 py-3`,
                          children: [
                            (0, E.jsxs)(`div`, {
                              className: `min-w-0`,
                              children: [
                                (0, E.jsxs)(`p`, {
                                  className: `truncate text-sm font-medium`,
                                  children: [e.schema_name, ` · `, e.region ?? `—`],
                                }),
                                (0, E.jsx)(`p`, {
                                  className: `text-xs text-faint`,
                                  children: new Date(e.created_at).toLocaleString(),
                                }),
                              ],
                            }),
                            (0, E.jsx)(w, { status: e.status }),
                          ],
                        },
                        e.id,
                      ),
                    ),
                  }),
          ],
        }),
      ],
    })
  );
}
function A({ viewAs: e, role: t }) {
  let { data: r } = g(),
    [u, h] = (0, T.useState)(null),
    [w, D] = (0, T.useState)(null),
    [k, A] = (0, T.useState)(null),
    [N, P] = (0, T.useState)(!1),
    F = r?.settings.rejection_alert_pct ?? 10,
    I = t === `admin`;
  if (
    ((0, T.useEffect)(() => {
      (A(null),
        Promise.all([_({ data: { viewAs: e } }), v({ data: { viewAs: e } })])
          .then(([e, t]) => {
            h(e);
            let n = Array.isArray(t) ? t : (t?.rows ?? []);
            D(n[0] ?? null);
          })
          .catch((e) => A(e instanceof Error ? e.message : `Failed to load dashboard`)));
    }, [e]),
    k)
  )
    return (0, E.jsx)(`p`, { className: `text-sm text-danger`, children: k });
  if (!u)
    return (0, E.jsxs)(`div`, {
      className: `space-y-4`,
      children: [
        (0, E.jsx)(y, { className: `h-10 w-64` }),
        (0, E.jsxs)(`div`, {
          className: `grid gap-3 sm:grid-cols-4`,
          children: [
            (0, E.jsx)(y, { className: `h-24` }),
            (0, E.jsx)(y, { className: `h-24` }),
            (0, E.jsx)(y, { className: `h-24` }),
            (0, E.jsx)(y, { className: `h-24` }),
          ],
        }),
        (0, E.jsx)(y, { className: `h-64` }),
      ],
    });
  let L = u.kpis ?? { total: 0, accepted: 0, quarantined: 0, pending: 0, week: 0 },
    R = L.accepted + L.quarantined > 0 ? (L.quarantined / (L.accepted + L.quarantined)) * 100 : 0;
  return (0, E.jsxs)(`div`, {
    className: `space-y-6`,
    children: [
      (0, E.jsx)(`header`, {
        className: `rounded-2xl border border-line bg-surface p-5 shadow-[var(--shadow-card)] sm:p-7`,
        children: (0, E.jsxs)(`div`, {
          children: [
            (0, E.jsxs)(`p`, {
              className: `text-xs font-medium uppercase tracking-[0.16em] text-accent`,
              children: [s(t), ` overview`],
            }),
            (0, E.jsx)(`h1`, {
              className: `mt-2 font-display text-3xl tracking-tight`,
              children: `Your operations at a glance`,
            }),
            (0, E.jsx)(`p`, {
              className: `mt-2 max-w-2xl text-sm leading-relaxed text-muted`,
              children:
                t === `analyst`
                  ? `Explore reviewed records, follow reporting trends, and turn the data into clear briefs. Your counts include accepted records only.`
                  : `Monitor reporting activity, review held filings, and manage portal settings. Counts reflect the records available to your role.`,
            }),
          ],
        }),
      }),
      (0, E.jsx)(O, { role: t }),
      (0, E.jsxs)(`section`, {
        "aria-labelledby": `ops-actions-title`,
        children: [
          (0, E.jsxs)(`div`, {
            className: `mb-3`,
            children: [
              (0, E.jsx)(`h2`, {
                id: `ops-actions-title`,
                className: `text-sm font-semibold`,
                children: `Quick actions`,
              }),
              (0, E.jsx)(`p`, {
                className: `mt-1 text-xs text-muted`,
                children: I
                  ? `Review incoming data and manage portal access.`
                  : `Move from reviewed data to insight.`,
              }),
            ],
          }),
          (0, E.jsxs)(`div`, {
            className: `grid gap-3 ${I ? `sm:grid-cols-2 xl:grid-cols-5` : `sm:grid-cols-3`}`,
            children: [
              I
                ? (0, E.jsx)(M, {
                    to: `/app/quarantine`,
                    icon: o,
                    title: `Review quarantine`,
                    description: `Accept or reject held filings.`,
                    tone: `warn`,
                  })
                : null,
              (0, E.jsx)(M, {
                to: `/app/records`,
                icon: a,
                title: t === `analyst` ? `Browse accepted records` : `Browse records`,
                description:
                  t === `analyst`
                    ? `Search records that have completed review.`
                    : `Search and filter portal records.`,
              }),
              (0, E.jsx)(M, {
                to: `/app/insights`,
                icon: l,
                title: `Open briefs`,
                description: `Read or generate a data summary.`,
              }),
              (0, E.jsxs)(`button`, {
                type: `button`,
                onClick: () => P(!0),
                className: `group flex min-h-28 items-start gap-3 rounded-xl border border-line bg-surface p-4 text-left shadow-[var(--shadow-card)] transition hover:-translate-y-0.5 hover:border-accent hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent`,
                children: [
                  (0, E.jsx)(`span`, {
                    className: `flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent`,
                    children: (0, E.jsx)(c, { className: `size-5` }),
                  }),
                  (0, E.jsxs)(`span`, {
                    className: `min-w-0 flex-1`,
                    children: [
                      (0, E.jsxs)(`span`, {
                        className: `flex items-center justify-between gap-2 text-sm font-semibold`,
                        children: [
                          `Ask Coeus `,
                          (0, E.jsx)(d, {
                            className: `size-4 text-faint transition group-hover:translate-x-0.5 group-hover:text-accent`,
                          }),
                        ],
                      }),
                      (0, E.jsx)(`span`, {
                        className: `mt-1 block text-xs leading-relaxed text-muted`,
                        children: `Ask questions about the available reporting data.`,
                      }),
                    ],
                  }),
                ],
              }),
              I
                ? (0, E.jsx)(M, {
                    to: `/app/admin`,
                    icon: i,
                    title: `Manage portal`,
                    description: `People, forms, feed, exports, and audit trail.`,
                    tone: `accent`,
                  })
                : null,
            ],
          }),
        ],
      }),
      (0, E.jsxs)(`section`, {
        children: [
          (0, E.jsx)(`h2`, {
            className: `mb-3 text-xs font-semibold uppercase tracking-wider text-faint`,
            children: `Key counts`,
          }),
          (0, E.jsxs)(`div`, {
            className: `grid gap-3 sm:grid-cols-2 lg:grid-cols-4`,
            children: [
              (0, E.jsx)(j, {
                label: `Visible records`,
                value: L.total,
                hint: `In your role scope`,
              }),
              (0, E.jsx)(j, { label: `Accepted`, value: L.accepted }),
              (0, E.jsx)(j, {
                label: `Quarantined`,
                value: L.quarantined,
                warn: R >= F,
                hint: R >= F ? `Above ${F}% alert` : void 0,
              }),
              (0, E.jsx)(j, { label: `Last 7 days`, value: L.week, hint: `New arrivals` }),
            ],
          }),
        ],
      }),
      (0, E.jsxs)(`section`, {
        children: [
          (0, E.jsx)(`h2`, {
            className: `mb-3 text-xs font-semibold uppercase tracking-wider text-faint`,
            children: `Trends`,
          }),
          (0, E.jsxs)(`div`, {
            className: `grid gap-4 lg:grid-cols-2`,
            children: [
              (0, E.jsxs)(C, {
                children: [
                  (0, E.jsxs)(S, {
                    children: [
                      (0, E.jsx)(b, { children: `Volume` }),
                      (0, E.jsx)(x, { children: `Accepted vs held` }),
                    ],
                  }),
                  (0, E.jsx)(f, { data: u.volume ?? [] }),
                ],
              }),
              (0, E.jsxs)(C, {
                children: [
                  (0, E.jsxs)(S, {
                    children: [
                      (0, E.jsx)(b, { children: `Region` }),
                      (0, E.jsx)(x, { children: `Click a zone to open Records` }),
                    ],
                  }),
                  (0, E.jsx)(p, { data: u.byRegion ?? [], xKey: `region`, yKey: `count` }),
                  (0, E.jsx)(`div`, {
                    className: `mt-2 flex flex-wrap gap-2`,
                    children: (u.byRegion ?? []).map((e) =>
                      (0, E.jsxs)(
                        n,
                        {
                          to: `/app/records`,
                          search: { region: e.region },
                          className: `rounded-full bg-accent-soft px-2.5 py-1 text-xs font-medium text-accent hover:bg-accent hover:text-accent-fg`,
                          children: [e.region, ` · `, e.count],
                        },
                        e.region,
                      ),
                    ),
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      (0, E.jsxs)(`section`, {
        children: [
          (0, E.jsx)(`h2`, {
            className: `mb-3 text-xs font-semibold uppercase tracking-wider text-faint`,
            children: `Breakdown & brief`,
          }),
          (0, E.jsxs)(`div`, {
            className: `grid gap-4 lg:grid-cols-3`,
            children: [
              (0, E.jsxs)(C, {
                children: [
                  (0, E.jsx)(S, { children: (0, E.jsx)(b, { children: `Category mix` }) }),
                  (0, E.jsx)(p, { data: u.byCategory ?? [], xKey: `category`, yKey: `count` }),
                ],
              }),
              (0, E.jsxs)(C, {
                children: [
                  (0, E.jsxs)(S, {
                    children: [
                      (0, E.jsx)(b, { children: `Satisfaction` }),
                      (0, E.jsx)(x, { children: `Community feedback, 1–5` }),
                    ],
                  }),
                  (0, E.jsx)(p, {
                    data: (u.satisfaction ?? []).map((e) => ({
                      score: `${e.score}`,
                      count: e.count,
                    })),
                    xKey: `score`,
                    yKey: `count`,
                  }),
                ],
              }),
              (0, E.jsxs)(C, {
                children: [
                  (0, E.jsxs)(S, {
                    children: [
                      (0, E.jsxs)(`div`, {
                        children: [
                          (0, E.jsx)(b, { children: `Latest brief` }),
                          (0, E.jsx)(x, {
                            children: w
                              ? `${w.model} · ${w.confidence} confidence`
                              : `No brief yet — generate one from Insights`,
                          }),
                        ],
                      }),
                      (0, E.jsx)(n, {
                        to: `/app/insights`,
                        className: `text-sm font-medium text-accent hover:underline`,
                        children: `Open`,
                      }),
                    ],
                  }),
                  (0, E.jsx)(`p`, {
                    className: `line-clamp-6 text-sm leading-relaxed text-ink-soft`,
                    children:
                      w?.narrative ??
                      `Analysts only see records after review is complete. Generate a brief to narrate the calculated facts.`,
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      u.anomalies?.length
        ? (0, E.jsxs)(`section`, {
            children: [
              (0, E.jsx)(`h2`, {
                className: `mb-3 text-xs font-semibold uppercase tracking-wider text-faint`,
                children: `Alerts`,
              }),
              (0, E.jsx)(`div`, {
                className: `grid gap-2 sm:grid-cols-2`,
                children: u.anomalies.map((e) =>
                  (0, E.jsxs)(
                    `div`,
                    {
                      className: `rounded-xl border border-warn/30 bg-warn-soft p-4 text-sm`,
                      children: [
                        (0, E.jsx)(`p`, {
                          className: `font-semibold text-warn`,
                          children: e.title,
                        }),
                        (0, E.jsx)(`p`, { className: `mt-1 text-ink-soft`, children: e.detail }),
                      ],
                    },
                    e.title,
                  ),
                ),
              }),
            ],
          })
        : null,
      (0, E.jsx)(m, { open: N, onClose: () => P(!1), role: t, viewAs: e }),
    ],
  });
}
function j({ label: e, value: t, hint: n, warn: r }) {
  return (0, E.jsxs)(`div`, {
    className: `rounded-xl border border-line bg-surface p-4 shadow-[var(--shadow-card)]`,
    children: [
      (0, E.jsx)(`p`, {
        className: `text-xs font-medium uppercase tracking-wider text-muted`,
        children: e,
      }),
      (0, E.jsx)(`p`, {
        className: `mt-2 font-display text-3xl tabular-nums ${r ? `text-danger` : `text-accent`}`,
        children: t,
      }),
      n ? (0, E.jsx)(`p`, { className: `mt-1 text-xs text-faint`, children: n }) : null,
    ],
  });
}
function M({ to: e, icon: t, title: r, description: i, tone: a = `neutral` }) {
  return (0, E.jsxs)(n, {
    to: e,
    className: `group flex min-h-28 items-start gap-3 rounded-xl border border-line bg-surface p-4 shadow-[var(--shadow-card)] transition hover:-translate-y-0.5 hover:border-accent hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent`,
    children: [
      (0, E.jsx)(`span`, {
        className: `flex size-10 shrink-0 items-center justify-center rounded-xl ${a === `warn` ? `bg-warn-soft text-warn` : a === `accent` ? `bg-accent text-accent-fg` : `bg-accent-soft text-accent`}`,
        children: (0, E.jsx)(t, { className: `size-5` }),
      }),
      (0, E.jsxs)(`span`, {
        className: `min-w-0 flex-1`,
        children: [
          (0, E.jsxs)(`span`, {
            className: `flex items-center justify-between gap-2 text-sm font-semibold`,
            children: [
              r,
              (0, E.jsx)(d, {
                className: `size-4 shrink-0 text-faint transition group-hover:translate-x-0.5 group-hover:text-accent`,
              }),
            ],
          }),
          (0, E.jsx)(`span`, {
            className: `mt-1 block text-xs leading-relaxed text-muted`,
            children: i,
          }),
        ],
      }),
    ],
  });
}
export { D as component };
