import { NextResponse } from "next/server";

export const runtime = "nodejs";

type AskResponse = {
  concept: string;
  solution: string;
  pitfalls: string;
  next: string;
};

function cleanText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function pickStructuredAnswer(text: string): AskResponse {
  // 兜底：如果模型没按 JSON 输出，就尽量把整段塞进去。
  const t = text.trim();
  return {
    concept: t,
    solution: "（AI 没按要求分段输出，我先把它的回答放在“概念解释”里，你可以自己再整理一下。）",
    pitfalls: "（同上）",
    next: "（同上）"
  };
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { question?: string };
    const question = cleanText(body.question);
    if (!question) {
      return NextResponse.json({ ok: false, error: "问题不能为空" }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    const baseUrl = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";
    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

    if (!apiKey) {
      return NextResponse.json(
        { ok: false, error: "服务器还没配置 OPENAI_API_KEY（请先在 .env.local / Vercel 环境变量里设置）" },
        { status: 500 }
      );
    }

    const system = [
      "你是一个学习辅助老师，擅长用初三学生能懂的方式讲解。",
      "你要帮助学生理解思路，而不是直接抄作业。",
      "请用中文输出，必须是严格 JSON，不要多余文字。",
      'JSON 格式固定为：{"concept": "...", "solution": "...", "pitfalls": "...", "next": "..."}',
      "要求：",
      "- concept：用通俗的话解释核心概念（不要太长）",
      "- solution：给解题/理解的步骤和思路（尽量分点）",
      "- pitfalls：列 3-5 个易错点/坑",
      "- next：给 3-5 条下一步学习建议（可以包含练习建议）",
      "最后不要输出任何额外字段。"
    ].join("\n");

    const user = [
      "我的问题：",
      question,
      "",
      "提醒：回答是参考信息，请结合课本和老师讲解核对。"
    ].join("\n");

    const resp = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        temperature: 0.4,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user }
        ]
      })
    });

    if (!resp.ok) {
      const raw = await resp.text();
      return NextResponse.json(
        { ok: false, error: `上游模型接口返回错误：${resp.status} ${resp.statusText}\n${raw}` },
        { status: 502 }
      );
    }

    const data = (await resp.json()) as any;
    const content = cleanText(data?.choices?.[0]?.message?.content);
    if (!content) {
      return NextResponse.json({ ok: false, error: "模型没有返回内容" }, { status: 502 });
    }

    let structured: AskResponse | null = null;
    try {
      const parsed = JSON.parse(content) as Partial<AskResponse>;
      if (
        parsed &&
        typeof parsed.concept === "string" &&
        typeof parsed.solution === "string" &&
        typeof parsed.pitfalls === "string" &&
        typeof parsed.next === "string"
      ) {
        structured = {
          concept: parsed.concept.trim(),
          solution: parsed.solution.trim(),
          pitfalls: parsed.pitfalls.trim(),
          next: parsed.next.trim()
        };
      }
    } catch {
      // ignore
    }

    return NextResponse.json({ ok: true, data: structured ?? pickStructuredAnswer(content) });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: String(err?.message ?? err) }, { status: 500 });
  }
}

