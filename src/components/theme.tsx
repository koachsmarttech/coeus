import { useEffect, useLayoutEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { Toaster } from "sonner";
import { applyTheme, useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function ThemeSync() {
  const hydrate = useTheme((s) => s.hydrate);
  const theme = useTheme((s) => s.theme);

  useIsoLayoutEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
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

export function ThemedToaster() {
  const resolved = useTheme((s) => s.resolved);
  return (
    <Toaster
      theme={resolved}
      position="bottom-right"
      toastOptions={{
        style: {
          background: "var(--color-surface)",
          color: "var(--color-ink)",
          border: "1px solid var(--color-line)",
        },
      }}
    />
  );
}

export function ThemeToggle({ className }: { className?: string }) {
  const setTheme = useTheme((s) => s.setTheme);

  return (
    <button
      type="button"
      className={cn(
        "inline-flex size-11 items-center justify-center rounded-md text-ink-soft transition-colors duration-150 hover:bg-bg-warm hover:text-ink",
        className,
      )}
      aria-label="Toggle dark mode"
      title="Toggle dark mode"
      onClick={() => {
        const dark = document.documentElement.classList.contains("dark");
        setTheme(dark ? "light" : "dark");
      }}
    >
      <Sun className="hidden size-4 dark:block" aria-hidden />
      <Moon className="size-4 dark:hidden" aria-hidden />
    </button>
  );
}
