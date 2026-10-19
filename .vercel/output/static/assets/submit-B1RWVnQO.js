import { i as e, t } from "./react-DB-4Zxce.js";
import { n } from "./dist-BaYBqCWs.js";
import { t as r } from "./preload-helper-C27TozAT.js";
import { t as i } from "./link-C85B5GQr.js";
import { r as a, t as o } from "./utils-D0icuJXL.js";
import { T as s, n as c, w as l } from "./bootstrap-oMSY54iG.js";
import { t as u } from "./button-CZaF3Ix3.js";
import { i as d, n as f, t as p } from "./card-DO6v5AX4.js";
import { n as m, r as h, t as g } from "./input-tneNOyvh.js";
var _ = e(t(), 1);
function v(e, t) {
  return t ? String(e[t.key] ?? ``) === String(t.equals) : !1;
}
function y(e, t) {
  return !e.showIf || v(t, e.showIf);
}
function b(e, t) {
  return e.required ? !0 : e.requiredIf ? v(t, e.requiredIf) : !1;
}
function x(e) {
  if (e === `` || e == null) return null;
  let t = typeof e == `number` ? e : Number(e);
  return Number.isFinite(t) ? t : null;
}
function S(e, t) {
  let n = [];
  for (let r of e) {
    if (!y(r, t)) continue;
    let e = t[r.key],
      i = e == null || e === `` || (typeof e == `string` && e.trim() === ``);
    if (b(r, t) && i) {
      n.push({ field: r.key, message: `${r.label} is required.` });
      continue;
    }
    if (!i) {
      if (r.type === `number`) {
        let t = x(e);
        if (t === null) {
          n.push({ field: r.key, message: `${r.label} must be a number.` });
          continue;
        }
        (r.min !== void 0 &&
          t < r.min &&
          n.push({ field: r.key, message: `${r.label} must be at least ${r.min}.` }),
          r.max !== void 0 &&
            t > r.max &&
            n.push({ field: r.key, message: `${r.label} must be at most ${r.max}.` }));
      }
      if (
        ((r.type === `text` || r.type === `textarea`) &&
          typeof e == `string` &&
          r.minLength &&
          e.trim().length < r.minLength &&
          n.push({ field: r.key, message: `${r.label} needs at least ${r.minLength} characters.` }),
        r.type === `select` &&
          r.options &&
          !r.options.includes(String(e)) &&
          n.push({ field: r.key, message: `${r.label} must be one of: ${r.options.join(`, `)}.` }),
        r.type === `date`)
      ) {
        let t = String(e);
        (!/^\d{4}-\d{2}-\d{2}$/.test(t) || Number.isNaN(Date.parse(t))) &&
          n.push({ field: r.key, message: `${r.label} must be a valid date.` });
      }
    }
  }
  return n;
}
var C = a(),
  w = (e) => `Coeus.draft.${e}`;
function T() {
  return new Date().toISOString().slice(0, 10);
}
function E(e) {
  let t = {};
  for (let n of e)
    n.type === `boolean`
      ? (t[n.key] = !1)
      : n.type === `date`
        ? (t[n.key] = T())
        : (n.type, (t[n.key] = ``));
  return t;
}
function D({ schema: e, submitting: t, onSubmit: n }) {
  let [r, i] = (0, _.useState)(() => E(e.fields)),
    [a, o] = (0, _.useState)({}),
    [s, c] = (0, _.useState)(!1);
  ((0, _.useEffect)(() => {
    try {
      let t = localStorage.getItem(w(e.id));
      i(t ? { ...E(e.fields), ...JSON.parse(t) } : E(e.fields));
    } catch {
      i(E(e.fields));
    }
    o({});
  }, [e.id, e.fields]),
    (0, _.useEffect)(() => {
      let t = window.setTimeout(() => {
        try {
          (localStorage.setItem(w(e.id), JSON.stringify(r)),
            c(!0),
            window.setTimeout(() => c(!1), 800));
        } catch {}
      }, 400);
      return () => window.clearTimeout(t);
    }, [r, e.id]));
  let l = (0, _.useMemo)(() => e.fields.filter((e) => y(e, r)), [e.fields, r]);
  function d(e, t) {
    (i((n) => ({ ...n, [e]: t })),
      o((t) => {
        let n = { ...t };
        return (delete n[e], n);
      }));
  }
  async function f(t) {
    t.preventDefault();
    let a = S(e.fields, r);
    if (a.length) {
      o(Object.fromEntries(a.map((e) => [e.field, e.message])));
      return;
    }
    await n(r);
    try {
      localStorage.removeItem(w(e.id));
    } catch {}
    i(E(e.fields));
  }
  return (0, C.jsxs)(`form`, {
    onSubmit: f,
    className: `space-y-4`,
    children: [
      l.map((e) =>
        (0, C.jsx)(
          O,
          {
            field: e,
            value: r[e.key],
            error: a[e.key],
            required: b(e, r),
            onChange: (t) => d(e.key, t),
          },
          e.key,
        ),
      ),
      (0, C.jsxs)(`div`, {
        className: `flex items-center justify-between gap-3 pt-2`,
        children: [
          (0, C.jsx)(`p`, {
            className: `text-xs text-faint`,
            children: s ? `Draft saved` : `Autosaves as you type`,
          }),
          (0, C.jsx)(u, {
            type: `submit`,
            disabled: t,
            children: t ? `Checking…` : `Submit report`,
          }),
        ],
      }),
    ],
  });
}
function O({ field: e, value: t, error: n, required: r, onChange: i }) {
  let a = `f-${e.key}`;
  return (0, C.jsxs)(`div`, {
    className: `space-y-1.5`,
    children: [
      (0, C.jsxs)(m, {
        htmlFor: a,
        children: [
          e.label,
          r ? (0, C.jsx)(`span`, { className: `text-danger`, children: ` *` }) : null,
        ],
      }),
      e.type === `textarea`
        ? (0, C.jsx)(h, {
            id: a,
            value: String(t ?? ``),
            onChange: (e) => i(e.target.value),
            "aria-invalid": !!n,
          })
        : e.type === `select`
          ? (0, C.jsxs)(`select`, {
              id: a,
              value: String(t ?? ``),
              onChange: (e) => i(e.target.value),
              className: `flex h-11 w-full rounded-md border border-line bg-surface px-3 text-sm text-ink shadow-[var(--shadow-card)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/35`,
              children: [
                (0, C.jsx)(`option`, { value: ``, children: `Select…` }),
                e.options?.map((e) => (0, C.jsx)(`option`, { value: e, children: e }, e)),
              ],
            })
          : e.type === `boolean`
            ? (0, C.jsxs)(`label`, {
                className: `flex h-11 items-center gap-3 rounded-md border border-line bg-surface px-3 text-sm shadow-[var(--shadow-card)]`,
                children: [
                  (0, C.jsx)(`input`, {
                    id: a,
                    type: `checkbox`,
                    checked: !!t,
                    onChange: (e) => i(e.target.checked),
                    className: `size-4 accent-accent`,
                  }),
                  `Yes`,
                ],
              })
            : (0, C.jsx)(g, {
                id: a,
                type: e.type === `number` ? `number` : e.type === `date` ? `date` : `text`,
                value: t == null ? `` : String(t),
                min: e.min,
                max: e.max,
                onChange: (t) =>
                  i(
                    e.type === `number`
                      ? t.target.value === ``
                        ? ``
                        : Number(t.target.value)
                      : t.target.value,
                  ),
                "aria-invalid": !!n,
              }),
      e.help && !n ? (0, C.jsx)(`p`, { className: `text-xs text-faint`, children: e.help }) : null,
      n ? (0, C.jsx)(`p`, { className: `text-xs text-danger`, children: n }) : null,
    ],
  });
}
var k = `.csv,.xlsx,.xls,.pdf,.pptx,.ppt,text/csv,application/pdf,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.ms-powerpoint`;
function A(e) {
  return e.map((e) =>
    e
      .map((e) => {
        let t = e == null ? `` : String(e);
        return /[",\n\r]/.test(t) ? `"${t.replace(/"/g, `""`)}"` : t;
      })
      .join(`,`),
  ).join(`
`);
}
async function j(e) {
  let t = e.name.toLowerCase();
  if (t.endsWith(`.csv`) || e.type === `text/csv`) return { kind: `csv`, csv: await e.text() };
  if (t.endsWith(`.xlsx`) || t.endsWith(`.xls`))
    try {
      let t = await r(() => import(`./xlsx-BKER4Xe2.js`), []),
        n = await e.arrayBuffer(),
        i = t.read(n, { type: `array` }),
        a = i.Sheets[i.SheetNames[0]];
      if (!a) throw Error(`Workbook has no sheets`);
      return { kind: `csv`, csv: A(t.utils.sheet_to_json(a, { header: 1, defval: `` })) };
    } catch (e) {
      throw Error(
        e instanceof Error && e.message.includes(`Failed to fetch`)
          ? `Install the xlsx package (npm install xlsx) to upload Excel files.`
          : e instanceof Error
            ? e.message
            : `Could not read Excel file`,
      );
    }
  if (t.endsWith(`.pdf`) || t.endsWith(`.pptx`) || t.endsWith(`.ppt`)) {
    let t = `Document upload: ${e.name} (${Math.round(e.size / 1024)} KB, type ${e.type || `unknown`}). Structured fields were auto-filled for intake; replace description details after open if needed. Original file retained by the submitter outside this system unless a document store is configured.`;
    return { kind: `document`, name: e.name, text: t };
  }
  throw Error(
    `Unsupported file type. Use CSV, Excel (.xlsx/.xls), PDF, or PowerPoint (.pptx/.ppt).`,
  );
}
function M() {
  let { data: e, viewAs: t } = c(),
    r = e?.schemas.filter((e) => e.is_active) ?? [],
    [a, m] = (0, _.useState)(r[0]?.id),
    h = r.find((e) => e.id === a) ?? r[0],
    [g, v] = (0, _.useState)(`form`),
    [y, b] = (0, _.useState)(!1),
    [x, S] = (0, _.useState)(null),
    [w, T] = (0, _.useState)(null);
  return e?.effectiveRole === `submitter`
    ? h
      ? (0, C.jsxs)(`div`, {
          className: `mx-auto max-w-2xl space-y-6`,
          children: [
            (0, C.jsxs)(`header`, {
              children: [
                (0, C.jsx)(`p`, {
                  className: `text-xs font-medium uppercase tracking-[0.16em] text-muted`,
                  children: `Intake`,
                }),
                (0, C.jsx)(`h1`, {
                  className: `mt-1 font-display text-3xl tracking-tight`,
                  children: `New Report`,
                }),
              ],
            }),
            (0, C.jsx)(`div`, {
              className: `flex flex-wrap gap-2`,
              children: r.map((e) =>
                (0, C.jsx)(
                  `button`,
                  {
                    type: `button`,
                    onClick: () => {
                      (m(e.id), S(null), T(null));
                    },
                    className: o(
                      `h-10 rounded-full px-3 text-sm`,
                      e.id === h.id
                        ? `bg-ink text-accent-fg`
                        : `bg-surface text-ink-soft shadow-(--shadow-card)`,
                    ),
                    children: e.name,
                  },
                  e.id,
                ),
              ),
            }),
            (0, C.jsx)(`p`, { className: `text-sm text-muted`, children: h.description }),
            (0, C.jsxs)(`div`, {
              className: `flex gap-2`,
              children: [
                (0, C.jsx)(`button`, {
                  type: `button`,
                  onClick: () => v(`form`),
                  className: o(
                    `h-10 rounded-md px-3 text-sm`,
                    g === `form` ? `bg-accent-soft text-accent` : `text-muted`,
                  ),
                  children: `Form`,
                }),
                (0, C.jsx)(`button`, {
                  type: `button`,
                  onClick: () => v(`upload`),
                  className: o(
                    `h-10 rounded-md px-3 text-sm`,
                    g === `upload` ? `bg-accent-soft text-accent` : `text-muted`,
                  ),
                  children: `File upload`,
                }),
              ],
            }),
            g === `form`
              ? (0, C.jsx)(p, {
                  children: (0, C.jsx)(D, {
                    schema: h,
                    submitting: y,
                    onSubmit: async (e) => {
                      (b(!0), S(null));
                      try {
                        let r = await s({ data: { schema_id: h.id, payload: e, viewAs: t } });
                        (S(`Filed as #${r.id} (${r.status}).`),
                          n.success(r.status === `accepted` ? `Accepted` : `Held for review`));
                      } catch (e) {
                        n.error(e instanceof Error ? e.message : `Submit failed`);
                      } finally {
                        b(!1);
                      }
                    },
                  }),
                })
              : (0, C.jsxs)(p, {
                  children: [
                    (0, C.jsx)(d, { children: `Upload a file` }),
                    (0, C.jsx)(f, {
                      className: `mt-2`,
                      children: `CSV or Excel for many rows at once. PDF or PowerPoint becomes a single document report under this form. Column headers should match field keys (see sample CSV).`,
                    }),
                    (0, C.jsx)(`a`, {
                      href: `/samples/incident-sample.csv`,
                      className: `mt-3 inline-block text-sm text-accent hover:underline`,
                      download: !0,
                      children: `Download sample CSV`,
                    }),
                    (0, C.jsx)(`input`, {
                      type: `file`,
                      className: `mt-4 block w-full text-sm`,
                      accept: k,
                      disabled: y,
                      onChange: async (e) => {
                        let r = e.target.files?.[0];
                        if (r) {
                          (b(!0), T(null), S(null));
                          try {
                            let e = await j(r);
                            if (e.kind === `csv`) {
                              let r = await l({ data: { schema_id: h.id, csv: e.csv, viewAs: t } });
                              (T(r),
                                n.success(`${r.accepted} accepted, ${r.quarantined} quarantined`));
                            } else {
                              let r = new Date().toISOString().slice(0, 10),
                                i = {
                                  occurred_at: r,
                                  collected_at: r,
                                  inspected_at: r,
                                  region: `Other`,
                                  site: e.name.slice(0, 80),
                                  category: `Other`,
                                  topic: `Other`,
                                  severity: `medium`,
                                  people_affected: 0,
                                  satisfaction: 3,
                                  overall_score: 5,
                                  issues_found: 0,
                                  hazards_found: 0,
                                  outcome: `conditional`,
                                  status: `pending_review`,
                                  would_recommend: `unsure`,
                                  description: e.text,
                                  comments: e.text,
                                  notes: e.text,
                                  follow_up_needed: !0,
                                  follow_up_notes: `Review uploaded document: ${e.name}`,
                                },
                                a = await s({ data: { schema_id: h.id, payload: i, viewAs: t } });
                              (S(`Document filed as #${a.id} (${a.status}).`),
                                n.success(
                                  a.status === `accepted`
                                    ? `Document accepted`
                                    : `Document held for review`,
                                ));
                            }
                          } catch (e) {
                            n.error(e instanceof Error ? e.message : `Upload failed`);
                          } finally {
                            (b(!1), (e.target.value = ``));
                          }
                        }
                      },
                    }),
                    y
                      ? (0, C.jsx)(`p`, {
                          className: `mt-3 text-sm text-muted`,
                          children: `Processing file…`,
                        })
                      : null,
                  ],
                }),
            x
              ? (0, C.jsxs)(`p`, {
                  className: `text-sm text-ink-soft`,
                  children: [
                    x,
                    ` `,
                    (0, C.jsx)(i, {
                      to: `/app/records`,
                      className: `text-accent hover:underline`,
                      children: `View records`,
                    }),
                  ],
                })
              : null,
            w
              ? (0, C.jsxs)(p, {
                  children: [
                    (0, C.jsxs)(d, {
                      children: [
                        w.accepted,
                        ` accepted · `,
                        w.quarantined,
                        ` quarantined · `,
                        w.total,
                        ` rows`,
                      ],
                    }),
                    (0, C.jsx)(`ul`, {
                      className: `mt-3 max-h-56 space-y-1 overflow-y-auto text-sm`,
                      children: w.report
                        .filter((e) => e.status !== `accepted`)
                        .map((e) =>
                          (0, C.jsxs)(
                            `li`,
                            {
                              className: `text-danger`,
                              children: [
                                `Row `,
                                e.row,
                                `: `,
                                e.errors.map((e) => e.message).join(` `),
                              ],
                            },
                            e.row,
                          ),
                        ),
                    }),
                    w.quarantined > 0
                      ? (0, C.jsx)(u, {
                          className: `mt-3`,
                          variant: `secondary`,
                          onClick: () => {
                            let e = [`row,status,errors`];
                            for (let t of w.report)
                              e.push(
                                `${t.row},${t.status},"${t.errors
                                  .map((e) => e.message)
                                  .join(`; `)
                                  .replace(/"/g, `""`)}"`,
                              );
                            let t = new Blob(
                                [
                                  e.join(`
`),
                                ],
                                { type: `text/csv` },
                              ),
                              n = document.createElement(`a`);
                            ((n.href = URL.createObjectURL(t)),
                              (n.download = `Coeus-upload-report.csv`),
                              n.click());
                          },
                          children: `Download error report`,
                        })
                      : null,
                  ],
                })
              : null,
          ],
        })
      : (0, C.jsx)(`p`, { className: `text-sm text-muted`, children: `No forms configured.` })
    : (0, C.jsxs)(p, {
        children: [
          (0, C.jsx)(d, { children: `Submitter view required` }),
          (0, C.jsx)(f, {
            className: `mt-2`,
            children: `Filing is limited to the submitter role. If you are an admin, switch View as to Submitter.`,
          }),
        ],
      });
}
export { M as component };
