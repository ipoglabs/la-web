"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MyAdRow from "./MyAdRow";

type Props = {
  initialRows?: any[];
  ownerEmail: string;
  ownerId: string;
};

export default function ClientList({
  initialRows,
  ownerEmail,
  ownerId,
}: Props) {
  const router = useRouter();

  const [rows, setRows] = useState<any[]>(
    Array.isArray(initialRows) ? initialRows : []
  );

  // ✅ FIX: Sync server → client state
  useEffect(() => {
    setRows(Array.isArray(initialRows) ? initialRows : []);
  }, [initialRows]);

  // 🔥 AUTO REFRESH ONLY IF PENDING EXISTS
  useEffect(() => {
    const hasPending = rows.some((r) => r.status === "pending");

    if (!hasPending) return;

    const interval = setInterval(() => {
      router.refresh();
    }, 8000);

    return () => clearInterval(interval);
  }, [rows, router]);

  return (
    <div className="space-y-3">
      {rows.map((r) => (
          <MyAdRow
            key={r.id}
            row={r}
            ownerEmail={ownerEmail}
            ownerId={ownerId}
            onDeleted={(id) =>
              setRows((s) => s.filter((x) => x.id !== id))
            }
            onBumped={(id, iso) =>
              setRows((s) =>
                s.map((x) =>
                  x.id === id ? { ...x, lastBumpedAt: iso } : x
                )
              )
            }
            onStatusChanged={(id, status) =>
              setRows((s) =>
                s.map((x) =>
                  x.id === id ? { ...x, status } : x
                )
              )
            }
          />
      ))}
    </div>
  );
}