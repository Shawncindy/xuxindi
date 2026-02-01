import { getAllNotes, SUBJECT_LABELS, SUBJECTS } from "@/lib/notes";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function NotesPage() {
  const notes = await getAllNotes();

  const bySubject = Object.fromEntries(SUBJECTS.map((s) => [s, [] as typeof notes]));
  for (const note of notes) bySubject[note.subject].push(note);

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">笔记</h1>
        <p className="text-sm text-slate-700">
          这些是我自己整理的笔记（可能不完美，但我会慢慢改）。
        </p>
      </header>

      <div className="grid gap-6">
        {SUBJECTS.map((subject) => {
          const list = bySubject[subject];
          return (
            <section key={subject} className="rounded-2xl border border-slate-200 p-5">
              <div className="flex items-end justify-between gap-3">
                <h2 className="text-lg font-semibold">{SUBJECT_LABELS[subject]}</h2>
                <Link className="text-sm text-slate-700 hover:underline" href="/new-note">
                  + 新增笔记
                </Link>
              </div>

              {list.length === 0 ? (
                <p className="mt-3 text-sm text-slate-600">这科我还没写…先占个坑。</p>
              ) : (
                <ul className="mt-4 divide-y divide-slate-200">
                  {list.map((note) => (
                    <li key={note.id} className="py-3">
                      <Link className="font-medium hover:underline" href={`/notes/${note.id}`}>
                        {note.title}
                      </Link>
                      <div className="mt-1 text-xs text-slate-500">
                        更新：{new Date(note.updatedAt).toLocaleString("zh-CN")}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
