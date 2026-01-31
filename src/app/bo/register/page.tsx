"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const roles = ["admin", "moderator", "support", "analyst"] as const;

export default function AdminRegisterPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [form, setForm] = useState<any>({
    firstName: "",
    lastName: "",
    designation: "",
    age: "",
    gender: "male",
    country: "",
    location: "",
    role: "admin",
    employeeId: "",
    email: "",
    password: "",
  });

  const update = (k: string, v: any) => setForm((s: any) => ({ ...s, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ...form, age: Number(form.age) }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        setErr(data?.error || "Register failed");
        setLoading(false);
        return;
      }

      // ✅ redirect to dashboard with success flag
      router.push("/bo?created=1");
      router.refresh();
    } catch (e: any) {
      setErr(e?.message || "Register failed");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-2xl bg-white border rounded-2xl shadow p-6 space-y-4">
        <h1 className="text-2xl font-semibold">Create Admin Account</h1>

        {err ? (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {err}
          </div>
        ) : null}

        <form className="grid grid-cols-1 md:grid-cols-2 gap-3" onSubmit={submit}>
          <Input
            placeholder="First name"
            value={form.firstName}
            onChange={(e) => update("firstName", e.target.value)}
          />
          <Input
            placeholder="Last name"
            value={form.lastName}
            onChange={(e) => update("lastName", e.target.value)}
          />

          <Input
            placeholder="Designation"
            value={form.designation}
            onChange={(e) => update("designation", e.target.value)}
          />
          <Input
            placeholder="Employee ID"
            value={form.employeeId}
            onChange={(e) => update("employeeId", e.target.value)}
          />

          <Input
            placeholder="Age"
            value={form.age}
            onChange={(e) => update("age", e.target.value)}
          />
          <select
            className="h-10 rounded-md border px-3 text-sm"
            value={form.gender}
            onChange={(e) => update("gender", e.target.value)}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>

          <Input
            placeholder="Country"
            value={form.country}
            onChange={(e) => update("country", e.target.value)}
          />
          <Input
            placeholder="Location (city/region)"
            value={form.location}
            onChange={(e) => update("location", e.target.value)}
          />

          <select
            className="h-10 rounded-md border px-3 text-sm"
            value={form.role}
            onChange={(e) => update("role", e.target.value)}
          >
            {roles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>

          <div className="md:col-span-2 border-t pt-3 mt-2" />

          <Input
            placeholder="Email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
          />
          <Input
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={(e) => update("password", e.target.value)}
          />

          <div className="md:col-span-2">
            <Button className="w-full" disabled={loading}>
              {loading ? "Creating..." : "Create Admin"}
            </Button>
          </div>
        </form>

        <div className="text-xs text-slate-500">
          Only <b>super_admin</b> can create admin accounts. If not logged in as super_admin, API returns 403.
        </div>
      </div>
    </div>
  );
}
