import Link from "next/link";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import Donation from "@/models/donation";
import { getCurrentUser } from "@/app/actions/getCurrentUser";

export const dynamic = "force-dynamic";

// ─── Helpers ────────────────────────────────────────────────────────────────

function fmtAmount(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: currency || "GBP",
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount}`;
  }
}

function fmtDate(d: Date): string {
  return new Date(d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const methodLabels: Record<string, string> = {
  qr: "Scan & Pay (UPI)",
  card: "Credit Card",
  paypal: "PayPal",
};

const statusStyles: Record<string, string> = {
  success: "bg-green-100 text-green-700",
  pending: "bg-amber-100 text-amber-700",
  failed: "bg-red-100 text-red-600",
};

const statusLabels: Record<string, string> = {
  success: "Successful",
  pending: "Pending",
  failed: "Failed",
};

// ─── Page ───────────────────────────────────────────────────────────────────

export default async function DonationHistoryPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?redirect=/donation-history");
  }

  await dbConnect();

  const donations = await Donation.find({ donorEmail: user.email })
    .sort({ createdAt: -1 })
    .lean();

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-screen-md mx-auto w-full px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-slate-800">Donation History</h1>
          <Link
            href="/donate"
            className="text-sm font-semibold text-blue-700 hover:text-blue-600 transition"
          >
            + Make a donation
          </Link>
        </div>

        {donations.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 px-6 py-12 text-center">
            <p className="text-slate-600 font-medium mb-2">
              You haven&apos;t made any donations yet.
            </p>
            <p className="text-slate-400 text-sm mb-6">
              Your donation history will show up here once you make your first
              contribution.
            </p>
            <Link
              href="/donate"
              className="inline-block px-6 py-3 rounded-full bg-blue-700 hover:bg-blue-600 text-white font-semibold text-sm transition"
            >
              Donate Now
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {donations.map((d) => {
              const status = d.status?.toLowerCase() || "pending";
              return (
                <div
                  key={d._id.toString()}
                  className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100"
                >
                  <div className="flex items-center justify-between px-4 py-3">
                    <div>
                      <p className="text-lg font-bold text-blue-700">
                        {fmtAmount(d.amount, d.currency)}
                      </p>
                      <p className="text-xs text-slate-400">
                        {fmtDate(d.createdAt)}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-semibold px-3 py-0.5 rounded-full ${
                        statusStyles[status] || "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {statusLabels[status] || d.status}
                    </span>
                  </div>

                  <div className="px-4 py-3 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-500">Method</span>
                      <span className="text-sm font-medium text-slate-800">
                        {methodLabels[d.method] || d.method}
                      </span>
                    </div>
                    {d.transactionId && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-500">
                          Transaction ID
                        </span>
                        <span className="font-mono text-[11px] text-slate-600 text-right break-all max-w-[60%]">
                          {d.transactionId}
                        </span>
                      </div>
                    )}
                    {d.description && (
                      <div className="flex justify-between items-start">
                        <span className="text-sm text-slate-500">Note</span>
                        <span className="text-sm text-slate-700 text-right max-w-[60%]">
                          {d.description}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}