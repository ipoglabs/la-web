import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, getClientIp, rateLimitResponse } from "@/lib/rate-limit";

const MAX_CHAR = 20;

// Generous enough for normal form-editing bursts but blocks scripted abuse.
const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 60_000;

function serverNormalize(s: unknown) {
  if (typeof s !== "string") return "";
  let t = s.replace(/[\u0000-\u001F\u007F]/g, "");
  t = t.replace(/\s+/g, " ").trim();

  const urlPattern = /(https?:\/\/\S+|www\.\S+|[A-Za-z0-9-]+\.(?:com|net|org|io|gov|edu|co|uk|info|ai|biz|me|app)\S*|[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})/gi;
  t = t.replace(urlPattern, "");

  // allow Unicode letters and conservative punctuation (same as client)
  const allowed = new RegExp("[\\p{L}0-9 .:&,/'()#%+-]", "u");
  t = t
    .split("")
    .filter((ch) => allowed.test(ch))
    .join("");

  return t.trim().slice(0, MAX_CHAR);
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  if (!checkRateLimit(`good-to-know-validate:${ip}`, RATE_LIMIT, RATE_WINDOW_MS)) {
    return rateLimitResponse(60);
  }

  try {
    const body = await req.json();
    const points = Array.isArray(body?.points) ? body.points : null;

    if (!points) {
      return NextResponse.json({ ok: false, error: "Missing points array" }, { status: 400 });
    }

    const errors: Array<{ index: number; field: string; reason: string }> = [];
    const cleaned: { label: string; value: string }[] = [];

    for (let i = 0; i < points.length; i++) {
      const p = points[i] ?? {};
      const rawLabel = p.label ?? "";
      const rawValue = p.value ?? "";

      const label = serverNormalize(rawLabel);
      const value = serverNormalize(rawValue);

      if (label.length > MAX_CHAR) {
        errors.push({ index: i, field: "label", reason: "label too long" });
      }
      if (value.length > MAX_CHAR) {
        errors.push({ index: i, field: "value", reason: "value too long" });
      }

      // Require at least one non-empty field per row (server-side policy)
      if (!label && !value) {
        // allow empty rows but mark them (optional) — we won't treat as hard error
      }

      cleaned.push({ label, value });
    }

    if (errors.length > 0) {
      return NextResponse.json({ ok: false, errors, cleaned }, { status: 400 });
    }

    return NextResponse.json({ ok: true, cleaned });
  } catch (err) {
    console.error("[POST /api/good-to-know/validate]", err);
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}
