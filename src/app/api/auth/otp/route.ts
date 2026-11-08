import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * Demo OTP sign-in: POST {email, code?, name?}
 *  - without code: returns devCode (displayed in the UI for the demo)
 *  - with code: verifies (any 4-digit code ≥1000 works in demo mode), upserts user
 */
export async function POST(req: NextRequest) {
  try {
    const { email, code, name } = await req.json();
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return NextResponse.json({ error: "Enter a valid email" }, { status: 400 });
    }

    if (!code) {
      return NextResponse.json({ ok: true, devCode: String(1000 + Math.floor(Math.random() * 9000)) });
    }

    if (!/^\d{4}$/.test(code)) return NextResponse.json({ error: "OTP must be 4 digits" }, { status: 400 });

    const user = await db.user.upsert({
      where: { email },
      update: { name: name || undefined },
      create: { email, name: name || email.split("@")[0] },
    });

    return NextResponse.json({ ok: true, user: { email: user.email, name: user.name ?? user.email.split("@")[0] } });
  } catch {
    return NextResponse.json({ error: "Sign-in failed" }, { status: 500 });
  }
}
