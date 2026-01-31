// src/app/api/admin/auth/register/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import AdminUser from "@/models/adminUser";
import { hash } from "bcryptjs";
import { ADMIN_COOKIE, verifyAdminJwt } from "@/lib/adminAuth";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const token = req.headers
      .get("cookie")
      ?.split(";")
      .map((s) => s.trim())
      .find((s) => s.startsWith(`${ADMIN_COOKIE}=`))
      ?.split("=")[1];

    const session = token ? verifyAdminJwt(token) : null;

    if (!session || session.role !== "super_admin") {
      return NextResponse.json({ ok: false, error: "Forbidden (super_admin only)" }, { status: 403 });
    }

    const body = await req.json().catch(() => ({} as any));

    const email = String(body?.email ?? "").toLowerCase().trim();
    const password = String(body?.password ?? "");

    const payload = {
      firstName: String(body?.firstName ?? "").trim(),
      lastName: String(body?.lastName ?? "").trim(),
      designation: String(body?.designation ?? "").trim(),
      age: Number(body?.age ?? 0),
      gender: String(body?.gender ?? ""),
      country: String(body?.country ?? "").trim(),
      location: String(body?.location ?? "").trim(),
      role: String(body?.role ?? ""),
      employeeId: String(body?.employeeId ?? "").trim(),
      email,
    };

    if (!payload.firstName || !payload.lastName || !payload.designation || !payload.country || !payload.location) {
      return NextResponse.json({ ok: false, error: "Missing required fields" }, { status: 400 });
    }
    if (!email || !password) {
      return NextResponse.json({ ok: false, error: "Email/password required" }, { status: 400 });
    }

    const exists = await AdminUser.findOne({ $or: [{ email }, { employeeId: payload.employeeId }] }).lean();
    if (exists) {
      return NextResponse.json({ ok: false, error: "Email or Employee ID already exists" }, { status: 409 });
    }

    const passwordHash = await hash(password, 10);

    await AdminUser.create({
      ...payload,
      password: passwordHash,
      createdBy: session.adminId,
      isActive: true,
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Register failed" }, { status: 500 });
  }
}
