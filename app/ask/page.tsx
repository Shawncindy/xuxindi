"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";

type AskResponse = {
  concept: string;
  solution: string;
  pitfalls: string;
  next: string;
};

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4">
      <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
      <div className="prose prose-slate mt-2 max-w-none text-sm">
        <div className="whitespace-pre-wrap">{children}</div>
      </div>
    </section>
  );
}

export default function AskPage() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [answer, setAnswer] = useState<AskResponse | null>(null);

  const canSubmit = useMemo(() => question.trim().length >= 2 && !loading, [question, loading]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setAnswer(null);
    setLoading(true);
    try {
      const resp = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question })
      });
      const data = (await resp.json()) as { ok: boolean; data?: AskResponse; error?: string };
      if (!resp.ok || !data.ok || !data.data) throw new Error(data.error || "请求失败了");
      setAnswer(data.data);
    } catch (err: any) {
      setError(String(err?.message ?? err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">搜索 / 提问</h1>
        <p className="mt-2 text-sm text-slate-700">
          我会把问题交给 AI，让它给我一个“参考解释”。我不会把它当答案抄，我会再对照课本和老师讲的。
        </p>
        <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <p className="font-medium">免责声明（我认真写的）：</p>
          <ul className="mt-2 list-disc pl-5">
            <li>AI 可能会说错，别迷信它。</li>
            <li>它是帮我理解思路的，不是帮我交作业的。</li>
            <li>参考信息，请结合课本和老师讲解核对。</li>
          </ul>
        </div>
      </header>

      <form onSubmit={onSubmit} className="space-y-3">
        <label className="block text-sm font-medium text-slate-900" htmlFor="q">
          我想问：
        </label>
        <textarea
          id="q"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="比如：为什么二次函数图像会是抛物线？ / 英语定语从句怎么判断？"
          className="h-28 w-full resize-y rounded-xl border border-slate-300 bg-white p-3 text-sm outline-none ring-slate-300 focus:ring-2"
        />
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={!canSubmit}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "我在想…（请求中）" : "开始提问"}
          </button>
          <button
            type="button"
            onClick={() => {
              setQuestion("");
              setAnswer(null);
              setError(null);
            }}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50"
          >
            清空
          </button>
        </div>
      </form>

      {error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900">
          出错了：{error}
        </div>
      ) : null}

      {answer ? (
        <div className="grid gap-3">
          <Section title="1) 概念解释">{answer.concept}</Section>
          <Section title="2) 解题思路">{answer.solution}</Section>
          <Section title="3) 易错点">{answer.pitfalls}</Section>
          <Section title="4) 我可以怎么继续学习">{answer.next}</Section>
          <p className="text-xs text-slate-600">
            提醒：以上是参考信息，请结合课本和老师讲解核对（我怕它胡说）。
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
          你可以先随便问一个小问题试试，我会把回答分成 4 段，方便我整理到笔记里。
        </div>
      )}
    </div>
  );
}
