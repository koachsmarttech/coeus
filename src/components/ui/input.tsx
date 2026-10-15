import * as React from "react";
import { cn } from "@/lib/utils";

export function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={cn(
        "flex h-11 w-full rounded-md border border-line bg-surface px-3 text-sm text-ink shadow-[var(--shadow-card)] placeholder:text-faint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/35 disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "flex min-h-28 w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink shadow-[var(--shadow-card)] placeholder:text-faint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/35 disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      className={cn("text-sm font-medium text-ink-soft", className)}
      {...props}
    />
  );
}
