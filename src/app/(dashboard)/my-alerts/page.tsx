import Link from "next/link";
import { getSession } from "@/lib/auth";
import { getMyAlerts } from "@/app/actions/alerts/getMyAlerts";
import MyAlertsList from "./MyAlertsList";

export const dynamic = "force-dynamic";

export default async function MyAlertsPage() {
  const session = await getSession();

  if (!session) {
    return (
      <main className="max-w-4xl mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-semibold">My Alerts</h1>
        <div className="border border-slate-300 rounded-md p-4 bg-slate-50 text-sm text-slate-700">
          You are not logged in.{" "}
          <Link href="/login" className="underline">
            Login
          </Link>
        </div>
      </main>
    );
  }

  let alerts: Awaited<ReturnType<typeof getMyAlerts>> = [];
  try {
    alerts = await getMyAlerts();
  } catch (e) {
    console.error("❌ getMyAlerts failed:", e);
  }

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">My Alerts</h1>
        <p className="text-sm text-slate-500 mt-1">
          Saved searches that notify you when a matching ad is posted.
        </p>
      </div>

      <MyAlertsList initialAlerts={alerts} />
    </main>
  );
}
