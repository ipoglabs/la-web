"use client";

import { useState } from "react";
import MyAdRow from "./MyAdRow";

export default function ClientList({
  initialRows,
  ownerEmail,
  ownerId,
}: {
  initialRows: any[];
  ownerEmail: string;
  ownerId: string;
}) {
  const [rows, setRows] = useState(initialRows);

  return (
    <div className="space-y-3">
      {rows.map((r) => (
        <MyAdRow
          key={r.id}
          row={r}
          ownerEmail={ownerEmail}
          ownerId={ownerId}
          onDeleted={(id) => setRows((s: any[]) => s.filter((x) => x.id !== id))}
          onBumped={(id, iso) =>
            setRows((s: any[]) =>
              s.map((x) => (x.id === id ? { ...x, lastBumpedAt: iso } : x))
            )
          }
        />
      ))}
    </div>
  );
}
