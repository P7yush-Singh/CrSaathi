// app/api/test-db/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json({ ok: true, message: "MongoDB Connected Successfully!" });
  } catch (err) {
    console.error("DB error:", err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
