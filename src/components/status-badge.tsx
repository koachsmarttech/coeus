import { Badge } from "@/components/ui/badge";
import type { SubmissionStatus } from "@/lib/types";

export function StatusBadge({ status }: { status: SubmissionStatus | string }) {
  const tone =
    status === "accepted"
      ? "ok"
      : status === "quarantined" || status === "rejected"
        ? "danger"
        : status === "pending_review"
          ? "warn"
          : "neutral";
  const label =
    status === "pending_review"
      ? "Pending review"
      : status === "quarantined"
        ? "Quarantined"
        : status;
  return <Badge tone={tone}>{label}</Badge>;
}
