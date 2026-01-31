// src/app/api/admin/auth/login/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import AdminUser from "@/models/adminUser";
import { compare } from "bcryptjs";
import { ADMIN_COOKIE, ADMIN_MAX_AGE, signAdminJwt, isAdminRole } from "@/lib/adminAuth";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const body = await req.json().catch(() => ({} as any));
    const email = String(body?.email ?? "").trim().toLowerCase();
    const password = String(body?.password ?? "");

    if (!email || !password) {
      return NextResponse.json({ ok: false, error: "Email and password are required." }, { status: 400 });
    }

    const admin: any = await AdminUser.findOne({ email }).select("+password").lean();
    if (!admin) {
      return NextResponse.json({ ok: false, error: "Account not found." }, { status: 404 });
    }

    if (!admin.isActive) {
      return NextResponse.json({ ok: false, error: "Account is disabled." }, { status: 403 });
    }

    if (!isAdminRole(admin.role)) {
      return NextResponse.json({ ok: false, error: "Not allowed." }, { status: 403 });
    }

    const ok = await compare(password, admin.password);
    if (!ok) {
      return NextResponse.json({ ok: false, error: "Invalid credentials." }, { status: 401 });
    }

    const token = signAdminJwt({
      adminId: String(admin._id),
      email: admin.email,
      role: admin.role,
      country: admin.country,
    });

    const res = NextResponse.json(
      {
        ok: true,
        user: {
          id: String(admin._id),
          firstName: admin.firstName,
          lastName: admin.lastName,
          email: admin.email,
          role: admin.role,
          country: admin.country,
        },
      },
      { status: 200 }
    );

    res.cookies.set(ADMIN_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: ADMIN_MAX_AGE,
    });

    return res;
  } catch (err) {
    console.error("Admin login error:", err);
    return NextResponse.json({ ok: false, error: "Something went wrong during admin login." }, { status: 500 });
  }
}
