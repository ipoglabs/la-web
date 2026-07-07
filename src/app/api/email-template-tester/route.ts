import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);

    if (!body) {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const to = String(body.to || "").trim();
    const subject = String(body.subject || "Test Email Template").trim();
    const html = String(body.html || "").trim();

    if (!to) {
      return NextResponse.json(
        { error: "Recipient email (to) is required" },
        { status: 400 }
      );
    }

    if (!html) {
      return NextResponse.json(
        { error: "HTML template content is required" },
        { status: 400 }
      );
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return NextResponse.json(
        { error: "EMAIL_USER or EMAIL_PASS is not configured on server" },
        { status: 500 }
      );
    }

    // 🔧 Nodemailer transport using your .env credentials
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"LokalAds Template Tester" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    return NextResponse.json({
      ok: true,
      message: "Email sent successfully",
      messageId: info.messageId,
    });
  } catch (err: any) {
    console.error("Email template test failed:", err);
    return NextResponse.json(
      {
        ok: false,
        error: err?.message || "Failed to send email",
      },
      { status: 500 }
    );
  }
}
