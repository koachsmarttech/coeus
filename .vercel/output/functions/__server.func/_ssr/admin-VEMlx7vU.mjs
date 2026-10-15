import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { D as useBootstrap, T as toggleFieldRequired, a as exportSubmissions, f as ingestFeed, m as listMembers, n as addSchemaField, p as listAudit, x as setMemberRole } from "./bootstrap-nXVxPEIQ.mjs";
import { t as Button } from "./button-C5sL4cLt.mjs";
import { i as CardTitle, n as CardDesc, r as CardHeader, t as Card } from "./card-DpV6wKp_.mjs";
import { n as Label, t as Input } from "./input-jByHJSbl.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-VEMlx7vU.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminPage() {
	const { data, reload } = useBootstrap();
	const [members, setMembers] = (0, import_react.useState)([]);
	const [audit, setAudit] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		if (data?.profile.role !== "admin") return;
		listMembers().then(setMembers).catch(() => void 0);
		listAudit().then(setAudit).catch(() => void 0);
	}, [data?.profile.role]);
	if (data?.profile.role !== "admin") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted",
		children: "Admin only."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium uppercase tracking-[0.16em] text-muted",
				children: "Control"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-1 font-display text-3xl tracking-tight",
				children: "Admin"
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "People" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDesc, { children: "First signed-in person becomes Admin. Assign Analyst or Reporter from here." })] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "divide-y divide-line",
				children: members.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex flex-wrap items-center justify-between gap-3 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium",
						children: m.name ?? m.user_id.slice(0, 8)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-faint",
						children: m.email ?? m.user_id
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: m.role,
						className: "h-11 rounded-md border border-line bg-surface px-3 text-sm",
						onChange: async (e) => {
							await setMemberRole({ data: {
								user_id: m.user_id,
								role: e.target.value
							} });
							toast.success("Role updated");
							setMembers(await listMembers());
							reload();
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "submitter",
								children: "Reporter"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "analyst",
								children: "Analyst"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "admin",
								children: "Admin"
							})
						]
					})]
				}, m.user_id))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Form schemas" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDesc, { children: "Toggle required fields or add a new one. Version increments on every change." })] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-6",
				children: data.schemas.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SchemaEditor, {
					schema: s,
					onChange: reload
				}, s.id))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Automated feed" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDesc, { children: "Paste a JSON array of objects (keys matching field names) or CSV. Invalid rows go to quarantine — nothing is dropped." })] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FeedIngest, { schemas: data.schemas })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Export" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDesc, { children: "CSV of all filings. Analysts cannot export." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "secondary",
				onClick: async () => {
					const res = await exportSubmissions({ data: { status: "all" } });
					const blob = new Blob([res.csv], { type: "text/csv" });
					const a = document.createElement("a");
					a.href = URL.createObjectURL(blob);
					a.download = res.filename;
					a.click();
					toast.success("Export ready");
				},
				children: "Download CSV"
			})] }) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Audit trail" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 space-y-2 text-sm",
				children: audit.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex justify-between gap-3 text-muted",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						e.action,
						" ",
						e.entity_type
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "tabular-nums text-faint",
						children: new Date(e.created_at).toLocaleString()
					})]
				}, e.id))
			})] })
		]
	});
}
function SchemaEditor({ schema, onChange }) {
	const [key, setKey] = (0, import_react.useState)("");
	const [label, setLabel] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-2 flex items-baseline justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "font-medium",
				children: schema.name
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "text-xs text-faint",
				children: ["v", schema.version]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "space-y-1.5",
			children: schema.fields.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex items-center justify-between gap-2 rounded-md bg-bg px-3 py-2 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
					f.label,
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-xs text-faint",
						children: f.key
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex items-center gap-2 text-xs text-muted",
					children: ["Required", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						checked: Boolean(f.required),
						onChange: async (e) => {
							await toggleFieldRequired({ data: {
								schema_id: schema.id,
								key: f.key,
								required: e.target.checked
							} });
							onChange();
						}
					})]
				})]
			}, f.key))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "mt-3 flex flex-col gap-2 sm:flex-row",
			onSubmit: async (e) => {
				e.preventDefault();
				if (!key || !label) return;
				await addSchemaField({ data: {
					schema_id: schema.id,
					field: {
						key,
						label,
						type: "text",
						required: false
					}
				} });
				setKey("");
				setLabel("");
				toast.success("Field added");
				onChange();
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 space-y-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: `k-${schema.id}`,
						children: "New key"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: `k-${schema.id}`,
						value: key,
						onChange: (e) => setKey(e.target.value),
						placeholder: "weather"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 space-y-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: `l-${schema.id}`,
						children: "Label"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: `l-${schema.id}`,
						value: label,
						onChange: (e) => setLabel(e.target.value),
						placeholder: "Weather notes"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					variant: "secondary",
					className: "sm:mt-6",
					children: "Add field"
				})
			]
		})
	] });
}
function FeedIngest({ schemas }) {
	const [schemaId, setSchemaId] = (0, import_react.useState)(schemas[0]?.id);
	const [body, setBody] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "space-y-3",
		onSubmit: async (e) => {
			e.preventDefault();
			if (!schemaId || !body.trim()) return;
			setBusy(true);
			try {
				const format = body.trim().startsWith("[") ? "json" : "csv";
				const res = await ingestFeed({ data: {
					schema_id: schemaId,
					body,
					format
				} });
				toast.success(`${res.accepted} accepted, ${res.quarantined} quarantined`);
				setBody("");
			} catch (err) {
				toast.error(err instanceof Error ? err.message : "Feed failed");
			} finally {
				setBusy(false);
			}
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "block text-sm",
				children: ["Form", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
					value: schemaId,
					onChange: (e) => setSchemaId(Number(e.target.value)),
					className: "mt-1 h-11 w-full rounded-md border border-line bg-surface px-3 text-sm",
					children: schemas.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: s.id,
						children: s.name
					}, s.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
				value: body,
				onChange: (e) => setBody(e.target.value),
				placeholder: "[{\"region\":\"South-West\",\"state\":\"Lagos\",\"election_year\":\"2023\",...}] or CSV",
				className: "min-h-32 w-full rounded-lg border border-line bg-surface px-3 py-2 font-mono text-xs"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "submit",
				disabled: busy || !body.trim(),
				children: busy ? "Checking…" : "Ingest feed"
			})
		]
	});
}
//#endregion
export { AdminPage as component };
