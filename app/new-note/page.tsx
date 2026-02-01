"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Subject = "math" | "english" | "chinese" | "physics" | "chemistry";

const SUBJECT_OPTIONS: Array<{ value: Subject; label: string }> = [
  { value: "math", label: "数学" },
  { value: "english", label: "英语" },
  { value: "chinese", label: "语文" },
  { value: "physics", label: "物理" },
  { value: "chemistry", label: "化学" }
];

type CreateNoteResult =
  | { mode: "written"; note: { id: string; title: string } }
  | {
      mode: "manual";
      note: { id: string; title: string };
      insertJson: string;
      insertMarkdown: string;
      reason: string;
    };

export default function NewNotePage() {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState<Subject>("math");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CreateNoteResult | null>(null);

  const canSubmit = useMemo(() => {
    if (loading) return false;
    if (title.trim().length === 0) return false;
    if (content.trim().length === 0) return false;
    return true;
  }, [title, content, loading]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const resp = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, subject, content })
      });
      const data = (await resp.json()) as { ok: boolean; data?: CreateNoteResult; error?: string };
      if (!resp.ok || !data.ok || !data.data) throw new Error(data.error || "提交失败了");
      setResult(data.data);
      if (data.data.mode === "written") {
        setTitle("");
        setContent("");
      }
    } catch (err: any) {
      setError(String(err?.message ?? err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">新增笔记</h1>
        <p className="text-sm text-slate-700">
          我想把学到的东西记下来（哪怕先写得很粗糙也没关系，之后再慢慢改）。
        </p>
      </header>

      <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
        <div className="grid gap-2">
          <label className="text-sm font-medium" htmlFor="title">
            标题
          </label>
          <input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="比如：二次函数的顶点式怎么来的"
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-slate-300 focus:ring-2"
          />
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium" htmlFor="subject">
            学科
          </label>
          <select
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value as Subject)}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-slate-300 focus:ring-2"
          >
            {SUBJECT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium" htmlFor="content">
            内容（支持 Markdown）
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={"比如：\n# 关键点\n- 定义\n- 例题\n\n> 我自己的总结：...\n"}
            className="h-56 w-full resize-y rounded-xl border border-slate-300 bg-white p-3 text-sm outline-none ring-slate-300 focus:ring-2"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={!canSubmit}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "提交中…" : "提交"}
          </button>
          <Link
            href="/notes"
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50"
          >
            去看笔记列表
          </Link>
        </div>
      </form>

      {error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900">
          出错了：{error}
        </div>
      ) : null}

      {result ? (
        result.mode === "written" ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
            已写入本地 <code className="font-mono">data/notes.json</code>：{result.note.title}（太好了）
            <div className="mt-2">
              <Link className="underline" href={`/notes/${result.note.id}`}>
                现在去查看这条笔记 →
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            <p className="font-medium">线上环境不能自动写文件，所以我改成“生成内容让你复制”。</p>
            <p>{result.reason}</p>
            <div className="grid gap-2">
              <p className="font-medium">
                1) 复制下面这段 JSON（把它塞进 <code className="font-mono">data/notes.json</code> 的数组里）
              </p>
              <textarea
                readOnly
                value={result.insertJson}
                className="h-48 w-full rounded-xl border border-amber-300 bg-white p-3 font-mono text-xs"
              />
            </div>
            <div className="grid gap-2">
              <p className="font-medium">2) 可选：如果以后我想把笔记改成 Markdown 文件，也可以用这段</p>
              <textarea
                readOnly
                value={result.insertMarkdown}
                className="h-48 w-full rounded-xl border border-amber-300 bg-white p-3 font-mono text-xs"
              />
            </div>
          </div>
        )
      ) : null}
    </div>
  );
}
