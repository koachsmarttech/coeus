import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { flagSummary, generateSummary, listSummaries } from "@/lib/api";
import { useBootstrap } from "@/lib/bootstrap";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardDesc, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { AiSummary } from "@/lib/types";

export const Route = createFileRoute("/app/insights")({ component: InsightsPage });

function InsightsPage() {
  const { data, viewAs } = useBootstrap();
  const [rows, setRows] = useState<AiSummary[]>([]);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  function reload() {
    setLoading(true);
    listSummaries({ data: { viewAs } })
      .then(setRows)
      .catch((e) => toast.error(e instanceof Error ? e.message : "Failed"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewAs]);

  if (data?.effectiveRole === "submitter") {
    return <p className="text-sm text-muted">Briefs are for analysts and admins.</p>;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Narrated facts</p>
          <h1 className="mt-1 font-display text-3xl tracking-tight">Weekly briefs</h1>
          <p className="mt-2 text-sm text-muted">
            Numbers are calculated first. The model only writes from that bundle, with a model id stored on
            every brief.
          </p>
        </div>
        <Button
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            try {
              await generateSummary({ data: { viewAs } });
              toast.success("Brief generated");
              reload();
            } catch (e) {
              toast.error(e instanceof Error ? e.message : "Failed");
            } finally {
              setBusy(false);
            }
          }}
        >
          {busy ? "Writing…" : "Generate brief"}
        </Button>
      </header>
      {loading ? (
        <Skeleton className="h-48" />
      ) : (
        rows.map((s) => (
          <Card key={s.id}>
            <CardHeader>
              <div>
                <CardTitle>{s.title}</CardTitle>
                <CardDesc>
                  {s.period_start} → {s.period_end} · {s.trigger} · {s.model} · {s.prompt_version}
                </CardDesc>
              </div>
              <Badge tone={s.confidence === "high" ? "ok" : s.confidence === "low" ? "warn" : "neutral"}>
                {s.confidence} confidence
              </Badge>
            </CardHeader>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink-soft">{s.narrative}</p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {s.flagged ? (
                <Badge tone="danger">Flagged</Badge>
              ) : (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={async () => {
                    await flagSummary({ data: { id: s.id } });
                    toast.success("Thanks — this brief is marked inaccurate");
                    reload();
                  }}
                >
                  Flag as inaccurate
                </Button>
              )}
            </div>
          </Card>
        ))
      )}
    </div>
  );
}
