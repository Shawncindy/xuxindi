# xuxindi 学习小站（Next.js + Tailwind）

## 我为啥做这个网站（我写在这里的真实原因）

我对人工智能（AI）和智能系统比较感兴趣，所以我自己搭建并维护了一个学习辅助网站：**xuxindi.patac.top**。做这个网站的想法，是因为我在学习中经常会遇到卡住的题目或知识点，我希望能把“查资料—整理—理解”的过程变得更高效，也能把自己学到的内容沉淀下来。

## 功能（现在版本）

- 首页：介绍 + 快速入口
- 搜索/提问：输入问题 → AI 给“参考解释”（有免责声明：不是让你抄作业）
- 笔记：按学科分类浏览，点进详情看 Markdown 内容
- 新增笔记：开发环境可写入 `data/notes.json`；线上（Vercel）会生成一段 JSON/Markdown 给我复制粘贴
- 关于我：初三学生口吻（就是我本人）

## 技术栈

- Next.js（App Router）+ TypeScript
- Tailwind CSS（界面简单干净）
- 数据：本地 `data/notes.json`（不搞数据库，先把事情做出来）

## 1) 本地运行

```bash
npm install
npm run dev
```

然后打开：`http://localhost:3000`

## 2) 环境变量（AI 提问用）

新建一个文件：`.env.local`（注意：不要提交到 GitHub）

内容参考：

```bash
OPENAI_API_KEY=你的key

# 可选：兼容 OpenAI 的第三方接口（比如自建/代理）
# OPENAI_BASE_URL=https://api.openai.com/v1

# 可选：模型名
# OPENAI_MODEL=gpt-4o-mini
```

说明：

- 这个 key 只在后端路由 `app/api/ask/route.ts` 用，不会发到前端。
- AI 回答只是参考信息，请结合课本和老师讲解核对（我写进页面和 footer 里了）。

## 3) 新增笔记为什么线上不能直接写入？

因为 Vercel 的无服务器环境（Serverless）一般不能把文件写回仓库（就算某次写成功，也不会长期保存）。

所以我做了一个“不会坏掉”的方案：

- 本地开发（`npm run dev`）：提交笔记会直接写入 `data/notes.json`
- Vercel 线上：提交笔记会返回一段 JSON/Markdown，我复制后粘贴进 `data/notes.json`，然后再 `git push`，Vercel 会自动重新部署

## 4) 上传到 GitHub（从零）

1. 在 GitHub 新建一个空仓库，比如叫：`xuxindi-study-helper`
2. 在本项目目录执行（每条命令单独一行）：

```bash
git init
git add .
git commit -m "init: xuxindi study helper"
git branch -M main
git remote add origin https://github.com/你的用户名/xuxindi-study-helper.git
git push -u origin main
```

（如果你用 SSH，把 remote 换成 `git@github.com:你的用户名/xuxindi-study-helper.git`）

## 5) 用 Vercel 一键部署

1. 打开 Vercel 控制台 → **Add New…** → **Project**
2. 选择导入你刚刚的 GitHub 仓库
3. Framework 选 Next.js（一般会自动识别）
4. 在 **Environment Variables** 里新增：
   - `OPENAI_API_KEY`
   - （可选）`OPENAI_BASE_URL`
   - （可选）`OPENAI_MODEL`
5. 点击 Deploy

构建命令和输出目录（默认就行）：

- Build Command: `next build`
- Output Directory: `.next`

## 6) 绑定域名：xuxindi.patac.top（Vercel + DNS）

### 6.1 在 Vercel 添加域名

1. 打开你的项目 → Settings → Domains
2. Add Domain：填 `xuxindi.patac.top`
3. Vercel 会提示你需要配置 DNS（它会给你一个推荐配置）

### 6.2 去你的域名 DNS 提供商配置解析

常见有两种方式（看 Vercel 给你的提示用哪一种）：

**方式 A：CNAME（推荐子域名）**

- 记录类型：CNAME
- 主机记录：`xuxindi`（表示 xuxindi.patac.top）
- 记录值：`cname.vercel-dns.com`

**方式 B：A 记录（有时也会用）**

- 记录类型：A
- 主机记录：`xuxindi`
- 记录值：`76.76.21.21`

等 DNS 生效后（有时几分钟，有时更久），回到 Vercel Domains 页面看到 **Valid Configuration** 就 OK 了。

## 7) 我写这个网站的提醒

- AI 是参考，不是答案。
- 我写笔记是为了“我真的理解了”，不是为了“看起来很努力”。
- 如果我哪天把这个小站越做越好，希望那时候我已经不怕那些卡住我的题了。

