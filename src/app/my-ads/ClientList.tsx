"use client";

import { useState } from "react";
import MyAdRow from "./MyAdRow";

export default function ClientList({
  initialRows,
  ownerEmail,
}: {
  initialRows: any[];
  ownerEmail: string;
}) {
  const [rows, setRows] = useState(initialRows);

  return (
    <div className="space-y-3">
      {rows.map((r) => (
        <MyAdRow
          key={r.id}
          row={r}
          ownerEmail={ownerEmail}
          onDeleted={(id) => setRows((s: any[]) => s.filter((x) => x.id !== id))}
        />
      ))}
    </div>
  );
}
