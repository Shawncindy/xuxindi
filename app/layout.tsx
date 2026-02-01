import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "徐欣迪 学习小站",
  description: "一个初三学生自己做的学习辅助网站（提问 + 笔记）"
};

function NavLink({
  href,
  children
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900"
    >
      {children}
    </Link>
  );
}

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-white text-slate-900">
        <header className="border-b border-slate-200">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
            <Link href="/" className="font-semibold tracking-tight">
              徐欣迪 学习小站
            </Link>
            <nav className="-mx-2 flex flex-wrap items-center gap-1">
              <NavLink href="/">首页</NavLink>
              <NavLink href="/ask">搜索/提问</NavLink>
              <NavLink href="/notes">笔记</NavLink>
              <NavLink href="/new-note">新增笔记</NavLink>
              <NavLink href="/about">关于我</NavLink>
            </nav>
          </div>
        </header>

        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>

        <footer className="border-t border-slate-200">
          <div className="mx-auto max-w-5xl px-4 py-6 text-sm text-slate-600">
            <p>
              提醒：本站的 AI 回答只用于理解思路，别直接抄作业；请结合课本和老师讲解核对。
            </p>
            <p className="mt-2">
              © {new Date().getFullYear()} 徐欣迪 · xuxindi.patac.top
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
