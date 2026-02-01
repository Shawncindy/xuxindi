import { NextResponse } from "next/server";
import { addNote } from "@/lib/notes";

export const runtime = "nodejs";

function cleanText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      title?: string;
      subject?: string;
      content?: string;
    };

    const title = cleanText(body.title);
    const subject = cleanText(body.subject);
    const content = typeof body.content === "string" ? body.content : "";

    const result = await addNote({
      title,
      subject: subject as any,
      content
    });

    return NextResponse.json({ ok: true, data: result });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: String(err?.message ?? err) }, { status: 400 });
  }
}

