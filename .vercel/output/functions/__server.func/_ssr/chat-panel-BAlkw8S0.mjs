import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { w as require_jsx_runtime, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { l as Send, n as Volume2, p as LoaderCircle, t as X } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as cn } from "./router-C6ayO53m.mjs";
import { S as speakText, d as getThread, r as askQuestion, v as listThreads } from "./bootstrap-nXVxPEIQ.mjs";
import { t as Button } from "./button-C5sL4cLt.mjs";
import { a as Area, c as ResponsiveContainer, i as XAxis, l as Tooltip, n as BarChart, o as CartesianGrid, r as YAxis, s as Bar, t as AreaChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/chat-panel-BAlkw8S0.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var LIGHT = {
	accent: "#2F5D4A",
	ink: "#1A1612",
	muted: "#6E675C",
	line: "#E2DAD0",
	warn: "#8A5A24",
	danger: "#9B3A2F"
};
LIGHT.accent, LIGHT.ink, LIGHT.muted, LIGHT.line, LIGHT.warn, LIGHT.danger;
function readChartColors() {
	if (typeof window === "undefined") return LIGHT;
	const s = getComputedStyle(document.documentElement);
	const pick = (prop, fallback) => s.getPropertyValue(prop).trim() || fallback;
	return {
		accent: pick("--color-accent", LIGHT.accent),
		ink: pick("--color-ink", LIGHT.ink),
		muted: pick("--color-muted", LIGHT.muted),
		line: pick("--color-line", LIGHT.line),
		warn: pick("--color-warn", LIGHT.warn),
		danger: pick("--color-danger", LIGHT.danger)
	};
}
function useChartColors() {
	const [colors, setColors] = (0, import_react.useState)(LIGHT);
	(0, import_react.useEffect)(() => {
		const update = () => setColors(readChartColors());
		update();
		const obs = new MutationObserver(update);
		obs.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ["class"]
		});
		return () => obs.disconnect();
	}, []);
	return colors;
}
function ChartTip({ active, payload, label }) {
	if (!active || !payload?.length) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-md bg-ink px-3 py-2 text-xs text-accent-fg shadow-[var(--shadow-card)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-1 font-medium",
			children: label
		}), payload.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "tabular-nums text-accent-fg/80",
			children: [
				p.name,
				": ",
				p.value
			]
		}, p.name))]
	});
}
function VolumeChart({ data }) {
	const colors = useChartColors();
	const slim = (data ?? []).map((d) => ({
		...d,
		label: String(d.date ?? "").slice(5) || "—"
	}));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "h-56 w-full",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
			width: "100%",
			height: "100%",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
				data: slim,
				margin: {
					top: 8,
					right: 8,
					left: -18,
					bottom: 0
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
						stroke: colors.line,
						vertical: false
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
						dataKey: "label",
						tick: {
							fill: colors.muted,
							fontSize: 11
						},
						axisLine: false,
						tickLine: false
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
						tick: {
							fill: colors.muted,
							fontSize: 11
						},
						axisLine: false,
						tickLine: false,
						allowDecimals: false
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartTip, {}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
						type: "monotone",
						dataKey: "accepted",
						name: "Accepted",
						stroke: colors.accent,
						fill: colors.accent,
						fillOpacity: .18,
						strokeWidth: 2
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
						type: "monotone",
						dataKey: "quarantined",
						name: "Quarantined",
						stroke: colors.danger,
						fill: colors.danger,
						fillOpacity: .12,
						strokeWidth: 1.5
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
						type: "monotone",
						dataKey: "pending",
						name: "Pending",
						stroke: colors.warn,
						fill: colors.warn,
						fillOpacity: .1,
						strokeWidth: 1.5
					})
				]
			})
		})
	});
}
function SimpleBar({ data, xKey, yKey, color }) {
	const colors = useChartColors();
	const fill = color ?? colors.accent;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "h-52 w-full",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
			width: "100%",
			height: "100%",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
				data,
				margin: {
					top: 8,
					right: 8,
					left: -18,
					bottom: 0
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
						stroke: colors.line,
						vertical: false
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
						dataKey: xKey,
						tick: {
							fill: colors.muted,
							fontSize: 11
						},
						axisLine: false,
						tickLine: false
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
						tick: {
							fill: colors.muted,
							fontSize: 11
						},
						axisLine: false,
						tickLine: false,
						allowDecimals: false
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartTip, {}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
						dataKey: yKey,
						name: "Count",
						fill,
						radius: [
							6,
							6,
							0,
							0
						],
						maxBarSize: 42
					})
				]
			})
		})
	});
}
function MiniChart({ spec }) {
	const colors = useChartColors();
	if (spec.type === "bar") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimpleBar, {
		data: spec.data,
		xKey: spec.xKey,
		yKey: spec.yKeys[0]?.key ?? "count"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "h-44 w-full",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
			width: "100%",
			height: "100%",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
				data: spec.data,
				margin: {
					top: 8,
					right: 8,
					left: -18,
					bottom: 0
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
						stroke: colors.line,
						vertical: false
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
						dataKey: spec.xKey,
						tick: {
							fill: colors.muted,
							fontSize: 11
						},
						axisLine: false,
						tickLine: false
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
						tick: {
							fill: colors.muted,
							fontSize: 11
						},
						axisLine: false,
						tickLine: false,
						allowDecimals: false
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartTip, {}) }),
					spec.yKeys.map((y) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
						type: "monotone",
						dataKey: y.key,
						name: y.label,
						stroke: colors.accent,
						fill: colors.accent,
						fillOpacity: .16,
						strokeWidth: 2
					}, y.key))
				]
			})
		})
	});
}
var SUGGEST = {
	submitter: [
		"What's the status of my last upload?",
		"Why was a submission quarantined?",
		"How many reports have I filed this week?"
	],
	analyst: [
		"What changed this month?",
		"Which region had the most filings?",
		"Show me volume by category"
	],
	admin: [
		"How many submissions failed review this week and why?",
		"What's our AI spend versus last week?",
		"Which region is driving quarantines?"
	]
};
function ChatPanel({ role, viewAs, compact }) {
	const [threadId, setThreadId] = (0, import_react.useState)(null);
	const [messages, setMessages] = (0, import_react.useState)([]);
	const [input, setInput] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [speaking, setSpeaking] = (0, import_react.useState)(null);
	const bottom = (0, import_react.useRef)(null);
	const audioRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		listThreads().then(async (threads) => {
			const first = threads[0];
			if (!first) return;
			setThreadId(first.id);
			const t = await getThread({ data: { id: first.id } });
			setMessages(t.messages);
		}).catch(() => void 0);
	}, []);
	(0, import_react.useEffect)(() => {
		bottom.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages, busy]);
	async function send(text) {
		const question = (text ?? input).trim();
		if (!question || busy) return;
		setInput("");
		const optimistic = {
			id: Date.now(),
			thread_id: threadId ?? 0,
			role: "user",
			content: question,
			chart: null,
			sources: null,
			created_at: (/* @__PURE__ */ new Date()).toISOString()
		};
		setMessages((m) => [...m, optimistic]);
		setBusy(true);
		try {
			const res = await askQuestion({ data: {
				question,
				threadId,
				viewAs
			} });
			setThreadId(res.threadId);
			setMessages((m) => [
				...m.filter((x) => x.id !== optimistic.id),
				optimistic,
				res.message
			]);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not answer");
		} finally {
			setBusy(false);
		}
	}
	async function speak(msg) {
		setSpeaking(msg.id);
		try {
			const res = await speakText({ data: { text: msg.content } });
			if (!res.ok) {
				toast.error(res.error);
				return;
			}
			const url = `data:${res.mime};base64,${res.b64}`;
			audioRef.current?.pause();
			const audio = new Audio(url);
			audioRef.current = audio;
			await audio.play();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Voice failed");
		} finally {
			setSpeaking(null);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("flex h-full min-h-0 flex-col", compact && "max-h-[min(70vh,640px)]"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-2 flex justify-end",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "text-xs text-muted hover:text-ink",
					onClick: () => {
						setThreadId(null);
						setMessages([]);
					},
					children: "New conversation"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-h-0 flex-1 space-y-4 overflow-y-auto px-1 py-2",
				children: [
					messages.length === 0 && !busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3 py-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-xl text-ink",
								children: "Ask about the data you can see."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted",
								children: "Answers are grounded in calculated facts — the model never does the math itself."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-col gap-2",
								children: SUGGEST[role].map((q) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => void send(q),
									className: "rounded-lg border border-line bg-surface px-3 py-2.5 text-left text-sm text-ink-soft shadow-(--shadow-card) hover:bg-bg-warm",
									children: q
								}, q))
							})
						]
					}) : null,
					messages.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: cn("max-w-[92%] rounded-lg px-3.5 py-3 text-sm leading-relaxed", m.role === "user" ? "ml-auto bg-ink text-accent-fg" : "bg-surface text-ink shadow-(--shadow-card)"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "whitespace-pre-wrap",
								children: m.content
							}),
							m.chart ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 rounded-md bg-bg p-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mb-1 text-xs font-medium text-muted",
									children: m.chart.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniChart, { spec: m.chart })]
							}) : null,
							m.role === "assistant" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex flex-wrap items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => void speak(m),
									className: "inline-flex h-9 items-center gap-1.5 rounded-md px-2 text-xs text-muted hover:bg-bg-warm hover:text-ink",
									children: [speaking === m.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "size-3.5" }), "Listen"]
								}), m.sources?.slice(0, 3).map((s) => s.kind === "submission" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/app/records/$id",
									params: { id: s.id },
									className: "rounded-full bg-bg-warm px-2 py-0.5 text-[11px] text-ink-soft hover:text-ink",
									children: s.label
								}, s.id) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full bg-bg-warm px-2 py-0.5 text-[11px] text-ink-soft",
									children: s.label
								}, s.id))]
							}) : null
						]
					}, m.id)),
					busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-lg bg-surface px-3.5 py-3 text-sm text-muted shadow-(--shadow-card)",
						children: "Looking up the numbers…"
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ref: bottom })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-3 flex gap-2",
				onSubmit: (e) => {
					e.preventDefault();
					send();
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: input,
					onChange: (e) => setInput(e.target.value),
					placeholder: "Ask a question…",
					className: "h-11 min-w-0 flex-1 rounded-md border border-line bg-surface px-3 text-sm shadow-(--shadow-card) placeholder:text-faint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/35"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					size: "icon",
					disabled: busy || !input.trim(),
					"aria-label": "Send",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, {})
				})]
			})
		]
	});
}
function AskDrawer({ open, onClose, role, viewAs }) {
	if (!open) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-40",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "absolute inset-0 bg-scrim",
			"aria-label": "Close ask panel",
			onClick: onClose
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-surface p-4 shadow-(--shadow-card)",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl",
					children: "Ask Coeus"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "inline-flex size-11 items-center justify-center",
					onClick: onClose,
					"aria-label": "Close",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "min-h-0 flex-1",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChatPanel, {
					role,
					viewAs
				})
			})]
		})]
	});
}
//#endregion
export { VolumeChart as i, ChatPanel as n, SimpleBar as r, AskDrawer as t };
