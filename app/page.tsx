import { getAllNotes, SUBJECT_LABELS } from "@/lib/notes";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

function formatZhDate(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("zh-CN", { month: "numeric", day: "numeric" });
}

export default async function HomePage() {
  const notes = await getAllNotes();
  const latest = notes.slice(0, 5);

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-3xl border border-emerald-100/70 bg-gradient-to-br from-emerald-50 via-rose-50 to-sky-50 p-6 shadow-sm sm:p-10">
        {/* 科技 + 艺术：抽象“电路线条 + 水彩渐变”插画（低透明度，只做氛围） */}
        <Image
          src="/visual/hero-tech-art.svg"
          alt=""
          aria-hidden="true"
          width={520}
          height={340}
          sizes="(min-width: 640px) 520px, 360px"
          className="pointer-events-none absolute -right-24 -top-16 w-[360px] opacity-70 sm:w-[520px]"
        />

        <p className="text-sm font-medium text-emerald-700/80">欣迪的学习小站</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          一个安静的小小学习角落
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-700">
          在这里记录学习笔记，遇到问题时也可以借助 AI 帮助理解。
        </p>
        <p className="mt-2 text-sm text-slate-600">
          不急，先把“会的”和“卡住的地方”写清楚，就已经很棒了。
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold tracking-tight text-slate-900">今天想做什么？</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <Link
            href="/ask"
            className="group rounded-2xl border border-emerald-100/70 bg-white/80 p-5 shadow-sm hover:bg-white"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50">
                  {/* 科技：对话气泡 + 节点连接（让“提问”更像在整理思路） */}
                  <Image src="/visual/icon-ask.svg" alt="" aria-hidden="true" width={28} height={28} />
                </span>
                <span className="text-base font-semibold text-slate-900">去提问</span>
              </div>
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                AI 帮助理解
              </span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              把题目或知识点写下来，让它一步步讲清楚。
            </p>
            <p className="mt-4 text-sm font-medium text-emerald-700">开始 →</p>
          </Link>

          <Link
            href="/notes"
            className="group rounded-2xl border border-rose-100/70 bg-white/80 p-5 shadow-sm hover:bg-white"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-50">
                  {/* 艺术：小本子 + 轻轻的手绘笔触（更温柔、不像“工具页面”） */}
                  <Image src="/visual/icon-notes.svg" alt="" aria-hidden="true" width={28} height={28} />
                </span>
                <span className="text-base font-semibold text-slate-900">看学习笔记</span>
              </div>
              <span className="rounded-full bg-rose-50 px-2 py-0.5 text-xs font-medium text-rose-700">
                轻松复习
              </span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              按学科整理，复习的时候一眼就能找到。
            </p>
            <p className="mt-4 text-sm font-medium text-rose-700">去看看 →</p>
          </Link>

          <Link
            href="/new-note"
            className="group rounded-2xl border border-sky-100/70 bg-white/80 p-5 shadow-sm hover:bg-white"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-50">
                  {/* 科技 + 艺术：笔 + 像电路一样的小折线（“记录”和“整理”放一起） */}
                  <Image src="/visual/icon-new-note.svg" alt="" aria-hidden="true" width={28} height={28} />
                </span>
                <span className="text-base font-semibold text-slate-900">写一条新笔记</span>
              </div>
              <span className="rounded-full bg-sky-50 px-2 py-0.5 text-xs font-medium text-sky-700">
                记录一下
              </span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              把今天的收获写下来，之后会更好找。
            </p>
            <p className="mt-4 text-sm font-medium text-sky-700">开始写 →</p>
          </Link>
        </div>
      </section>

      <section className="relative">
        {/* 艺术：柔和曲线分隔；科技：少量“节点点点”——做过渡，不抢内容 */}
        <Image
          src="/visual/divider-wave.svg"
          alt=""
          aria-hidden="true"
          width={1200}
          height={120}
          sizes="100vw"
          className="pointer-events-none w-full opacity-80"
        />
        <div className="mt-3 rounded-2xl border border-slate-200/70 bg-white/70 p-5 text-sm text-slate-700">
          <p>学习不仅是做题，也可以慢慢整理自己的想法。</p>
          <p className="mt-2 text-slate-600">把科技当成工具，也把艺术当成一种表达方式。</p>
          <p className="mt-2 text-slate-600">我会慢慢把这里整理得更清爽一点。</p>
        </div>
      </section>

      <section>
        <div className="flex items-end justify-between gap-3">
          <h2 className="text-lg font-semibold tracking-tight text-slate-900">最近更新的笔记</h2>
          <Link className="text-sm font-medium text-slate-700 hover:underline" href="/notes">
            查看全部 →
          </Link>
        </div>

        {latest.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-slate-200/70 bg-white/70 p-5 text-sm text-slate-700">
            这里还没有笔记。可以先写一条，或者先去提问也可以。
          </div>
        ) : (
          <ul className="mt-4 space-y-3">
            {latest.map((note) => (
              <li
                key={note.id}
                className="rounded-2xl border border-slate-200/70 bg-white/80 p-4 shadow-sm"
              >
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 font-medium text-emerald-700">
                    {SUBJECT_LABELS[note.subject]}
                  </span>
                  <span className="rounded-full bg-slate-50 px-2 py-0.5 text-slate-600">
                    {formatZhDate(note.updatedAt)}
                  </span>
                </div>
                <Link
                  className="mt-2 block text-base font-semibold text-slate-900 hover:underline"
                  href={`/notes/${note.id}`}
                >
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
