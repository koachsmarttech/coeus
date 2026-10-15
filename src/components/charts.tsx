import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ChartSpec } from "@/lib/types";

const LIGHT = {
  accent: "#2F5D4A",
  ink: "#1A1612",
  muted: "#6E675C",
  line: "#E2DAD0",
  warn: "#8A5A24",
  danger: "#9B3A2F",
};

export const CHART = {
  ACCENT: LIGHT.accent,
  INK: LIGHT.ink,
  MUTED: LIGHT.muted,
  LINE: LIGHT.line,
  WARN: LIGHT.warn,
  DANGER: LIGHT.danger,
};

function readChartColors() {
  if (typeof window === "undefined") return LIGHT;
  const s = getComputedStyle(document.documentElement);
  const pick = (prop: string, fallback: string) => s.getPropertyValue(prop).trim() || fallback;
  return {
    accent: pick("--color-accent", LIGHT.accent),
    ink: pick("--color-ink", LIGHT.ink),
    muted: pick("--color-muted", LIGHT.muted),
    line: pick("--color-line", LIGHT.line),
    warn: pick("--color-warn", LIGHT.warn),
    danger: pick("--color-danger", LIGHT.danger),
  };
}

function useChartColors() {
  const [colors, setColors] = useState(LIGHT);
  useEffect(() => {
    const update = () => setColors(readChartColors());
    update();
    const obs = new MutationObserver(update);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);
  return colors;
}

function ChartTip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md bg-ink px-3 py-2 text-xs text-accent-fg shadow-[var(--shadow-card)]">
      <p className="mb-1 font-medium">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="tabular-nums text-accent-fg/80">
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
}

export function VolumeChart({
  data,
}: {
  data: { date: string; accepted: number; quarantined: number; pending: number }[];
}) {
  const colors = useChartColors();
  const slim = (data ?? []).map((d) => ({
    ...d,
    label: String(d.date ?? "").slice(5) || "—",
  }));
  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={slim} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
          <CartesianGrid stroke={colors.line} vertical={false} />
          <XAxis dataKey="label" tick={{ fill: colors.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: colors.muted, fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip content={<ChartTip />} />
          <Area type="monotone" dataKey="accepted" name="Accepted" stroke={colors.accent} fill={colors.accent} fillOpacity={0.18} strokeWidth={2} />
          <Area type="monotone" dataKey="quarantined" name="Quarantined" stroke={colors.danger} fill={colors.danger} fillOpacity={0.12} strokeWidth={1.5} />
          <Area type="monotone" dataKey="pending" name="Pending" stroke={colors.warn} fill={colors.warn} fillOpacity={0.1} strokeWidth={1.5} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SimpleBar({
  data,
  xKey,
  yKey,
  color,
}: {
  data: Record<string, string | number>[];
  xKey: string;
  yKey: string;
  color?: string;
}) {
  const colors = useChartColors();
  const fill = color ?? colors.accent;
  return (
    <div className="h-52 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
          <CartesianGrid stroke={colors.line} vertical={false} />
          <XAxis dataKey={xKey} tick={{ fill: colors.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: colors.muted, fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip content={<ChartTip />} />
          <Bar dataKey={yKey} name="Count" fill={fill} radius={[6, 6, 0, 0]} maxBarSize={42} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function MiniChart({ spec }: { spec: ChartSpec }) {
  const colors = useChartColors();
  if (spec.type === "bar") {
    return (
      <SimpleBar
        data={spec.data}
        xKey={spec.xKey}
        yKey={spec.yKeys[0]?.key ?? "count"}
      />
    );
  }
  return (
    <div className="h-44 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={spec.data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
          <CartesianGrid stroke={colors.line} vertical={false} />
          <XAxis dataKey={spec.xKey} tick={{ fill: colors.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: colors.muted, fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip content={<ChartTip />} />
          {spec.yKeys.map((y) => (
            <Area
              key={y.key}
              type="monotone"
              dataKey={y.key}
              name={y.label}
              stroke={colors.accent}
              fill={colors.accent}
              fillOpacity={0.16}
              strokeWidth={2}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
