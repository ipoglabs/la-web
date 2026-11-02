"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import AdminPostsPanel from "./AdminPostsPanel";
import AdminReportsPanel from "./AdminReportsPanel";
import AdminUsersPanel from "./AdminUsersPanel";
import AdminOptionRequestsPanel from "./AdminOptionRequestsPanel";

export type AdminTab = "posts" | "reports" | "users" | "options";

export default function AdminTabs({ initialTab = "posts" }: { initialTab?: AdminTab }) {
  const [tab, setTab] = useState<AdminTab>(initialTab);

  return (
    <div className="flex flex-col gap-6">
      <div className="inline-flex gap-1 rounded-lg bg-slate-100 p-1 w-fit">
        <button
          type="button"
          onClick={() => setTab("posts")}
          className={cn(
            "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
            tab === "posts" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
          )}
        >
          Posts
        </button>
        <button
          type="button"
          onClick={() => setTab("reports")}
          className={cn(
            "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
            tab === "reports" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
          )}
        >
          Reports
        </button>
        <button
          type="button"
          onClick={() => setTab("users")}
          className={cn(
            "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
            tab === "users" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
          )}
        >
          Users
        </button>
        <button
          type="button"
          onClick={() => setTab("options")}
          className={cn(
            "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
            tab === "options" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
          )}
        >
          Option requests
        </button>
      </div>

      {tab === "posts" ? (
        <AdminPostsPanel />
      ) : tab === "reports" ? (
        <AdminReportsPanel />
      ) : tab === "users" ? (
        <AdminUsersPanel />
      ) : (
        <AdminOptionRequestsPanel />
      )}
    </div>
  );
}
