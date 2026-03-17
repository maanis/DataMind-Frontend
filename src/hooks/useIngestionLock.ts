/**
 * useIngestionLock.ts
 *
 * Shared hook that any component can use to know whether ingestion is running.
 * IngestView sets window.__ingestionLocked and fires a "ingestionLockChange" event.
 * This hook listens for that event and returns the current lock state.
 *
 * Usage in your sidebar:
 *
 *   const locked = useIngestionLock();
 *
 *   // Block nav link clicks:
 *   <NavLink
 *     onClick={e => { if (locked) { e.preventDefault(); toast.warning("Ingestion in progress..."); } }}
 *     ...
 *   />
 */

import { useState, useEffect } from "react";

export function useIngestionLock(): boolean {
  const [locked, setLocked] = useState<boolean>(
    () => window.__ingestionLocked ?? false
  );

  useEffect(() => {
    const handler = (e: Event) => {
      setLocked((e as CustomEvent<{ locked: boolean }>).detail.locked);
    };
    window.addEventListener("ingestionLockChange", handler);
    return () => window.removeEventListener("ingestionLockChange", handler);
  }, []);

  return locked;
}