import { create } from "zustand";

export type Theme = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

export const THEME_KEY = "Coeus.theme";
export const THEME_COLOR_LIGHT = "#F3EEE6";
export const THEME_COLOR_DARK = "#12100E";

export const THEME_BOOT = `(function(){try{var t=localStorage.getItem("Coeus.theme");var d=t==="dark"||(t!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches);var r=document.documentElement;r.classList.toggle("dark",d);r.style.colorScheme=d?"dark":"light";var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute("content",d?"#12100E":"#F3EEE6")}catch(e){}})();`;

function getSystem(): ResolvedTheme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function readStoredTheme(): Theme {
  if (typeof window === "undefined") return "system";
  try {
    const v = window.localStorage.getItem(THEME_KEY);
    if (v === "light" || v === "dark" || v === "system") return v;
  } catch {
    /* ignore */
  }
  return "system";
}

export function resolveTheme(theme: Theme): ResolvedTheme {
  return theme === "system" ? getSystem() : theme;
}

export function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  const resolved = resolveTheme(theme);
  const root = document.documentElement;
  root.classList.toggle("dark", resolved === "dark");
  root.style.colorScheme = resolved;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute("content", resolved === "dark" ? THEME_COLOR_DARK : THEME_COLOR_LIGHT);
  }
}

type Store = {
  theme: Theme;
  resolved: ResolvedTheme;
  hydrated: boolean;
  hydrate: () => void;
  setTheme: (theme: Theme) => void;
};

export const useTheme = create<Store>((set) => ({
  theme: "system",
  resolved: "light",
  hydrated: false,
  hydrate: () => {
    const theme = readStoredTheme();
    const resolved = resolveTheme(theme);
    applyTheme(theme);
    set({ theme, resolved, hydrated: true });
  },
  setTheme: (theme) => {
    try {
      window.localStorage.setItem(THEME_KEY, theme);
    } catch {
      /* ignore */
    }
    const resolved = resolveTheme(theme);
    applyTheme(theme);
    set({ theme, resolved });
  },
}));
