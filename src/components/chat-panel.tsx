import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { LoaderCircle, Send, Volume2, X } from "lucide-react";
import { toast } from "sonner";
import { askQuestion, getThread, listThreads, speakText } from "@/lib/api";
import type { ChatMessage, Role } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { MiniChart } from "@/components/charts";
import { cn } from "@/lib/utils";

const SUGGEST: Record<Role, string[]> = {
  submitter: [
    "What's the status of my last upload?",
    "Why was a submission quarantined?",
    "How many reports have I filed this week?",
  ],
  analyst: [
    "What changed this month?",
    "Which region had the most filings?",
    "Show me volume by category",
  ],
  admin: [
    "How many submissions failed review this week and why?",
    "What's our AI spend versus last week?",
    "Which region is driving quarantines?",
  ],
};

export function ChatPanel({
  role,
  viewAs,
  compact,
}: {
  role: Role;
  viewAs: Role | null;
  compact?: boolean;
}) {
  const [threadId, setThreadId] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [speaking, setSpeaking] = useState<number | null>(null);
  const bottom = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    listThreads()
      .then(async (threads) => {
        const first = threads[0];
        if (!first) return;
        setThreadId(first.id);
        const t = await getThread({ data: { id: first.id } });
        setMessages(t.messages);
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, busy]);

  async function send(text?: string) {
    const question = (text ?? input).trim();
    if (!question || busy) return;
    setInput("");
    const optimistic: ChatMessage = {
      id: Date.now(),
      thread_id: threadId ?? 0,
      role: "user",
      content: question,
      chart: null,
      sources: null,
      created_at: new Date().toISOString(),
    };
    setMessages((m) => [...m, optimistic]);
    setBusy(true);
    try {
      const res = await askQuestion({ data: { question, threadId, viewAs } });
      setThreadId(res.threadId);
      setMessages((m) => [...m.filter((x) => x.id !== optimistic.id), optimistic, res.message]);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not answer");
    } finally {
      setBusy(false);
    }
  }

  async function speak(msg: ChatMessage) {
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

  return (
    <div className={cn("flex h-full min-h-0 flex-col", compact && "max-h-[min(70vh,640px)]")}>
      <div className="mb-2 flex justify-end">
        <button
          type="button"
          className="text-xs text-muted hover:text-ink"
          onClick={() => {
            setThreadId(null);
            setMessages([]);
          }}
        >
          New conversation
        </button>
      </div>
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-1 py-2">
        {messages.length === 0 && !busy ? (
          <div className="space-y-3 py-4">
            <p className="font-display text-xl text-ink">Ask about the data you can see.</p>
            <p className="text-sm text-muted">
              Answers are grounded in calculated facts — the model never does the math itself.
            </p>
            <div className="flex flex-col gap-2">
              {SUGGEST[role].map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => void send(q)}
                  className="rounded-lg border border-line bg-surface px-3 py-2.5 text-left text-sm text-ink-soft shadow-(--shadow-card) hover:bg-bg-warm"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : null}
        {messages.map((m) => (
          <div
            key={m.id}
            className={cn(
              "max-w-[92%] rounded-lg px-3.5 py-3 text-sm leading-relaxed",
              m.role === "user"
                ? "ml-auto bg-ink text-accent-fg"
                : "bg-surface text-ink shadow-(--shadow-card)",
            )}
          >
            <p className="whitespace-pre-wrap">{m.content}</p>
            {m.chart ? (
              <div className="mt-3 rounded-md bg-bg p-2">
                <p className="mb-1 text-xs font-medium text-muted">{m.chart.title}</p>
                <MiniChart spec={m.chart} />
              </div>
            ) : null}
            {m.role === "assistant" ? (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => void speak(m)}
                  className="inline-flex h-9 items-center gap-1.5 rounded-md px-2 text-xs text-muted hover:bg-bg-warm hover:text-ink"
                >
                  {speaking === m.id ? (
                    <LoaderCircle className="size-3.5 animate-spin" />
                  ) : (
                    <Volume2 className="size-3.5" />
                  )}
                  Listen
                </button>
                {m.sources?.slice(0, 3).map((s) =>
                  s.kind === "submission" ? (
                    <Link
                      key={s.id}
                      to="/app/records/$id"
                      params={{ id: s.id }}
                      className="rounded-full bg-bg-warm px-2 py-0.5 text-[11px] text-ink-soft hover:text-ink"
                    >
                      {s.label}
                    </Link>
                  ) : (
                    <span
                      key={s.id}
                      className="rounded-full bg-bg-warm px-2 py-0.5 text-[11px] text-ink-soft"
                    >
                      {s.label}
                    </span>
                  ),
                )}
              </div>
            ) : null}
          </div>
        ))}
        {busy ? (
          <div className="rounded-lg bg-surface px-3.5 py-3 text-sm text-muted shadow-(--shadow-card)">
            Looking up the numbers…
          </div>
        ) : null}
        <div ref={bottom} />
      </div>
      <form
        className="mt-3 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          void send();
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question…"
          className="h-11 min-w-0 flex-1 rounded-md border border-line bg-surface px-3 text-sm shadow-(--shadow-card) placeholder:text-faint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/35"
        />
        <Button type="submit" size="icon" disabled={busy || !input.trim()} aria-label="Send">
          <Send />
        </Button>
      </form>
    </div>
  );
}

export function AskDrawer({
  open,
  onClose,
  role,
  viewAs,
}: {
  open: boolean;
  onClose: () => void;
  role: Role;
  viewAs: Role | null;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40">
      <button
        type="button"
        className="absolute inset-0 bg-scrim"
        aria-label="Close ask panel"
        onClick={onClose}
      />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-surface p-4 shadow-(--shadow-card)">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-xl">Ask Coeus</h2>
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="min-h-0 flex-1">
          <ChatPanel role={role} viewAs={viewAs} />
        </div>
      </aside>
    </div>
  );
}
