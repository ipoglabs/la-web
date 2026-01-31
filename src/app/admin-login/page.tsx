// src/app/admin-login/page.tsx
import { Suspense } from "react";
import AdminLoginClient from "./AdminLoginClient";

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <AdminLoginClient />
    </Suspense>
  );
}
