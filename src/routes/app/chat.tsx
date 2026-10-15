import { createFileRoute } from "@tanstack/react-router";
import { ChatPanel } from "@/components/chat-panel";
import { useBootstrap } from "@/lib/bootstrap";

export const Route = createFileRoute("/app/chat")({ component: ChatPage });

function ChatPage() {
  const { data, viewAs } = useBootstrap();
  const role = data?.effectiveRole ?? "submitter";
  if (role === "submitter") {
    return (
      <div className="mx-auto max-w-lg space-y-3">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Ask</p>
        <h1 className="font-display text-3xl tracking-tight">Not available</h1>
        <p className="text-sm text-muted">
          Chat is limited to analyst and admin roles so submitters stay focused on filing. Ask a
          colleague with analyst access to query the archive.
        </p>
      </div>
    );
  }
  return (
    <div className="mx-auto flex h-[calc(100dvh-8rem)] max-w-2xl flex-col">
      <header className="mb-4">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Grounded chat</p>
        <h1 className="mt-1 font-display text-3xl tracking-tight">Ask Coeus</h1>
      </header>
      <div className="min-h-0 flex-1 rounded-xl bg-surface p-4 shadow-[var(--shadow-card)]">
        <ChatPanel role={role} viewAs={viewAs} />
      </div>
    </div>
  );
}
