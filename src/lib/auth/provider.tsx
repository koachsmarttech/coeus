import { useEffect, useState, type ReactNode } from "react";
import { initializeLocalAuth } from "./local-auth";

/**
 * App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
 *
 *   <AuthProvider><Outlet /></AuthProvider>
 *
 * Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
 * its `useSession()` works standalone — so this is a passthrough today. It's
 * kept as the single, stable mount point for any future client-side providers
 * (e.g. a toast or theme provider) without churning the root shell.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    fetch("/api/auth/mode")
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((result: { localOnly?: boolean }) => initializeLocalAuth(result.localOnly === true))
      .catch(() => initializeLocalAuth(false))
      .finally(() => setReady(true));
  }, []);
  return ready ? <>{children}</> : null;
}
