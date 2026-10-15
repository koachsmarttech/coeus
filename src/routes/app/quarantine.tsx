import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { listSubmissions, resolveQuarantine } from "@/lib/api";
import { useBootstrap } from "@/lib/bootstrap";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Submission } from "@/lib/types";

export const Route = createFileRoute("/app/quarantine")({ component: QuarantinePage });

function QuarantinePage() {
  const { data, viewAs } = useBootstrap();
  const [rows, setRows] = useState<Submission[]>([]);

  function reload() {
    listSubmissions({ data: { viewAs, status: "quarantined", limit: 100 } }).then((r) =>
      setRows(r.rows),
    );
  }

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewAs]);

  if (data?.profile.role !== "admin") {
    return <p className="text-sm text-muted">Quarantine is admin-only.</p>;
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Held records</p>
        <h1 className="mt-1 font-display text-3xl tracking-tight">Quarantine</h1>
        <p className="mt-2 max-w-xl text-sm text-muted">
          Failed checks never disappear. Review, correct the process, or accept with an override.
        </p>
      </header>
      {rows.length === 0 ? (
        <p className="text-sm text-muted">Nothing in quarantine.</p>
      ) : (
        <ul className="space-y-3">
          {rows.map((r) => (
            <li key={r.id}>
              <Card className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <Link
                    to="/app/records/$id"
                    params={{ id: String(r.id) }}
                    className="font-medium text-accent hover:underline"
                  >
                    #{r.id} {r.schema_name}
                  </Link>
                  <p className="mt-1 text-sm text-muted">
                    {r.region} · {r.submitter_name} · {new Date(r.created_at).toLocaleString()}
                  </p>
                  <ul className="mt-2 list-disc pl-5 text-sm text-danger">
                    {(r.validation_errors ?? []).map((e, i) => (
                      <li key={i}>{e.message}</li>
                    ))}
                  </ul>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={async () => {
                      await resolveQuarantine({ data: { id: r.id, action: "accept" } });
                      toast.success("Accepted");
                      reload();
                    }}
                  >
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={async () => {
                      await resolveQuarantine({ data: { id: r.id, action: "reject" } });
                      toast.success("Rejected");
                      reload();
                    }}
                  >
                    Reject
                  </Button>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
