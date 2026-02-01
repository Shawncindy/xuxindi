import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "欣迪的学习小站",
  description: "一个安静的小小学习角落：提问 + 笔记"
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
      className="rounded-full px-3 py-2 text-sm font-medium text-slate-700 hover:bg-emerald-50 hover:text-slate-900"
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
      <body className="min-h-screen bg-gradient-to-b from-emerald-50 via-rose-50 to-white text-slate-900">
        <header className="border-b border-emerald-100/70 bg-white/60">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
            <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
              {/* 自然风格点缀：小叶子图标（SVG） */}
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                className="h-6 w-6 text-emerald-600/70"
                fill="none"
              >
                <path
                  d="M19.5 4.5c-6.5 1-11.5 6-12.5 12.5 6.5-1 11.5-6 12.5-12.5Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
                <path
                  d="M7 17c2-3 5-6 8.5-8.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
              欣迪的学习小站
            </Link>
            <nav className="-mx-2 flex flex-wrap items-center gap-1">
              <NavLink href="/">首页</NavLink>
              <NavLink href="/ask">去提问</NavLink>
              <NavLink href="/notes">笔记</NavLink>
              <NavLink href="/new-note">写新笔记</NavLink>
            </nav>
          </div>
        </header>

        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>

        <footer className="border-t border-emerald-100/70 bg-white/60">
          <div className="mx-auto max-w-5xl px-4 py-6 text-sm text-slate-600">
            <p>本站内容用于帮助理解学习思路，请结合课本和老师讲解。</p>
            <p className="mt-2 text-xs text-slate-500">提醒：AI 也可能会说错，记得核对哦。</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
