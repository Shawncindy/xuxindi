import "server-only";

import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

export const SUBJECTS = ["math", "english", "chinese", "physics", "chemistry"] as const;
export type Subject = (typeof SUBJECTS)[number];

export const SUBJECT_LABELS: Record<Subject, string> = {
  math: "数学",
  english: "英语",
  chinese: "语文",
  physics: "物理",
  chemistry: "化学"
};

export type Note = {
  id: string;
  title: string;
  subject: Subject;
  content: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateNoteInput = {
  title: string;
  subject: Subject;
  content: string;
};

export type CreateNoteResult =
  | { mode: "written"; note: Note }
  | {
      mode: "manual";
      note: Note;
      insertJson: string;
      insertMarkdown: string;
      reason: string;
    };

function notesFilePath() {
  return path.join(process.cwd(), "data", "notes.json");
}

function isVercelRuntime() {
  return Boolean(process.env.VERCEL);
}

function toIsoNow() {
  return new Date().toISOString();
}

function normalizeString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function assertSubject(value: string): Subject {
  if ((SUBJECTS as readonly string[]).includes(value)) return value as Subject;
  throw new Error(`Invalid subject: ${value}`);
}

function noteToMarkdown(note: Note) {
  return [
    "---",
    `id: ${note.id}`,
    `title: ${note.title.replaceAll("\n", " ")}`,
    `subject: ${note.subject}`,
    `createdAt: ${note.createdAt}`,
    `updatedAt: ${note.updatedAt}`,
    "---",
    "",
    note.content.trimEnd(),
    ""
  ].join("\n");
}

async function readNotesUnsafe(): Promise<Note[]> {
  const file = notesFilePath();
  try {
    const raw = await fs.readFile(file, "utf8");
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];

    const notes: Note[] = [];
    for (const item of parsed) {
      if (!item || typeof item !== "object") continue;
      const obj = item as Record<string, unknown>;
      const id = normalizeString(obj.id);
      const title = normalizeString(obj.title);
      const subjectRaw = normalizeString(obj.subject);
      const content = typeof obj.content === "string" ? obj.content : "";
      const createdAt = normalizeString(obj.createdAt) || toIsoNow();
      const updatedAt = normalizeString(obj.updatedAt) || createdAt;
      if (!id || !title || !subjectRaw) continue;
      if (!(SUBJECTS as readonly string[]).includes(subjectRaw)) continue;
      notes.push({
        id,
        title,
        subject: subjectRaw as Subject,
        content,
        createdAt,
        updatedAt
      });
    }

    return notes;
  } catch (err: any) {
    if (err?.code === "ENOENT") return [];
    throw err;
  }
}

async function writeNotesUnsafe(notes: Note[]) {
  const file = notesFilePath();
  await fs.mkdir(path.dirname(file), { recursive: true });
  const raw = JSON.stringify(notes, null, 2) + "\n";
  await fs.writeFile(file, raw, "utf8");
}

export async function getAllNotes(): Promise<Note[]> {
  const notes = await readNotesUnsafe();
  return notes.sort((a, b) => (a.updatedAt > b.updatedAt ? -1 : 1));
}

export async function getNoteById(id: string): Promise<Note | null> {
  const safeId = normalizeString(id);
  if (!safeId) return null;
  const notes = await readNotesUnsafe();
  return notes.find((n) => n.id === safeId) ?? null;
}

export async function addNote(input: CreateNoteInput): Promise<CreateNoteResult> {
  const title = normalizeString(input.title);
  const content = typeof input.content === "string" ? input.content : "";
  const subject = assertSubject(input.subject);
  if (!title) throw new Error("标题不能为空");
  if (!content.trim()) throw new Error("内容不能为空（至少写点东西嘛）");

  const now = toIsoNow();
  const note: Note = {
    id: crypto.randomUUID(),
    title,
    subject,
    content,
    createdAt: now,
    updatedAt: now
  };

  if (isVercelRuntime()) {
    return {
      mode: "manual",
      note,
      insertJson: JSON.stringify(note, null, 2),
      insertMarkdown: noteToMarkdown(note),
      reason: "检测到 Vercel 运行环境：线上一般不能把文件写回仓库，所以我改成让你复制粘贴。"
    };
  }

  try {
    const notes = await readNotesUnsafe();
    const next = [note, ...notes];
    await writeNotesUnsafe(next);
    return { mode: "written", note };
  } catch (err: any) {
    return {
      mode: "manual",
      note,
      insertJson: JSON.stringify(note, null, 2),
      insertMarkdown: noteToMarkdown(note),
      reason:
        "我尝试写入 data/notes.json 失败了（可能是权限/只读）。所以我给你一段可复制的内容。错误：" +
        String(err?.message ?? err)
    };
  }
}

