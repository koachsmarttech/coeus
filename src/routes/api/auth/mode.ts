import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/auth/mode")({
  server: {
    handlers: {
      GET: () => Response.json({ localOnly: !Boolean(process.env.DATABASE_URL?.trim()) }),
    },
  },
});
