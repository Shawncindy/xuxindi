import ReactMarkdown from "react-markdown";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getNoteById, SUBJECT_LABELS } from "@/lib/notes";

export const dynamic = "force-dynamic";

export default async function NoteDetailPage({
  params
}: {
  params: { id: string };
}) {
  const note = await getNoteById(params.id);
  if (!note) notFound();

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <Link className="text-sm text-slate-700 hover:underline" href="/notes">
          ← 返回笔记列表
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-700">
            {SUBJECT_LABELS[note.subject]}
          </span>
          <span className="text-xs text-slate-500">
            更新：{new Date(note.updatedAt).toLocaleString("zh-CN")}
          </span>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">{note.title}</h1>
      </header>

      <article className="prose prose-slate max-w-none rounded-2xl border border-slate-200 bg-white p-6">
        <ReactMarkdown>{note.content}</ReactMarkdown>
      </article>
    </div>
  );
}
