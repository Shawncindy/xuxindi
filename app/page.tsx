import { getAllNotes, SUBJECT_LABELS } from "@/lib/notes";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const notes = await getAllNotes();
  const latest = notes.slice(0, 3);

  return (
    <div className="space-y-10">
      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
        <h1 className="text-2xl font-semibold tracking-tight">我自己的学习辅助网站</h1>
        <p className="mt-3 text-slate-700">
          我是徐欣迪，上海杨浦双语初三五班的学生。我对人工智能（AI）和智能系统比较感兴趣，所以我自己搭建并维护了一个学习辅助网站：
          <span className="font-medium"> xuxindi.patac.top</span>。
        </p>
        <p className="mt-2 text-slate-700">
          做这个网站的想法，是因为我在学习中经常会遇到卡住的题目或知识点，我希望能把
          “查资料—整理—理解”的过程变得更高效，也能把自己学到的内容沉淀下来。
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
            href="/ask"
          >
            去提问（AI 参考解释）
          </Link>
          <Link
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50"
            href="/notes"
          >
            去看我的笔记
          </Link>
          <Link
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50"
            href="/new-note"
          >
            我想写一条新笔记
          </Link>
        </div>
      </section>

      <section>
        <div className="flex items-end justify-between">
          <h2 className="text-lg font-semibold">最近更新的笔记</h2>
          <Link className="text-sm text-slate-700 hover:underline" href="/notes">
            查看全部 →
          </Link>
        </div>

        {latest.length === 0 ? (
          <p className="mt-3 text-slate-600">我还没写笔记…先去“新增笔记”写一条！</p>
        ) : (
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {latest.map((note) => (
              <li key={note.id} className="rounded-xl border border-slate-200 p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-slate-600">
                    {SUBJECT_LABELS[note.subject]}
                  </span>
                  <span className="text-xs text-slate-500">
                    {new Date(note.updatedAt).toLocaleDateString("zh-CN")}
                  </span>
                </div>
                <Link className="mt-2 block font-medium hover:underline" href={`/notes/${note.id}`}>
                  {note.title}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
