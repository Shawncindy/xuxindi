export default function AboutPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">关于我</h1>
        <p className="text-sm text-slate-700">（这个页面我写得有点“中二”，但是真实。）</p>
      </header>

      <section className="prose prose-slate max-w-none rounded-2xl border border-slate-200 bg-white p-6">
        <p>大家好，我是徐欣迪，上海杨浦双语初三五班的学生。</p>
        <p>
          我对人工智能（AI）和智能系统比较感兴趣，所以我自己搭建并维护了一个学习辅助网站：
          <strong> xuxindi.patac.top</strong>。
        </p>
        <p>
          我做这个网站的原因很简单：我学习的时候经常会卡住（真的会卡到怀疑人生），我就想把“查资料—整理—理解”的过程变得更高效一点。
          然后把学到的东西变成笔记，越积越多，最后就变成一个自己的小知识库。
        </p>
        <p>
          这个网站现在功能还不多，但我会慢慢加：比如更好的搜索、更漂亮的笔记排版、还有一些我自己的学习计划。
        </p>
        <p>如果你也在学习路上一起卡住，那我们就一起加油吧。</p>
      </section>
    </div>
  );
}
