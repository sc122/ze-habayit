import { NextRequest, NextResponse } from "next/server";
import { appendRow } from "@/lib/google-sheets";

export async function POST(request: NextRequest) {
  try {
    const { question } = await request.json();

    if (!question || typeof question !== "string" || question.trim().length < 4) {
      return NextResponse.json({ error: "שאלה קצרה מדי" }, { status: 400 });
    }

    await appendRow(question.trim());
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Submit error:", error);
    return NextResponse.json({ error: "שגיאה בשמירה" }, { status: 500 });
  }
}
