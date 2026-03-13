import { InlineCode, Code } from "bertui-code";
import { useRef, useEffect } from "react";
import Nav from "../../../components/Nav";
import "../../../styles/docs.css";
import React from "react";
/* ── Scroll reveal ── */
function useReveal(threshold = 0.1) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => e.isIntersecting && el.classList.add("is-visible"),
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

/* ── Code strings (BertUI safe) ── */
const code = {
  tree:
'├── bertui.config.js\n' +
'├── bun.lock\n' +
'├── bunnyx.config.ts\n' +
'├── bunnyx-env.d.ts\n' +
'├── package.json\n' +
'├── public\n' +
'│   └── favicon.svg\n' +
'├── README.md\n' +
'├── src\n' +
'│   ├── api\n' +
'│   │   ├── posts.ts\n' +
'│   │   └── users.ts\n' +
'│   ├── api.ts\n' +
'│   ├── index.ts\n' +
'│   ├── main.jsx\n' +
'│   ├── pages\n' +
'│   │   ├── about.jsx\n' +
'│   │   ├── blog\n' +
'│   │   │   ├── index.jsx\n' +
'│   │   │   └── [slug].jsx\n' +
'│   │   └── index.jsx\n' +
'│   └── styles\n' +
'│       └── global.css\n' +
'└── tsconfig.json',

  tsconfig:
'{\n' +
'  "compilerOptions": {\n' +
'    "strict": true,\n' +
'    "target": "ES2022",\n' +
'    "module": "ESNext",\n' +
'    "moduleResolution": "bundler",\n' +
'    "jsx": "react",\n' +
'    "jsxFactory": "React.createElement",\n' +
'    "jsxFragmentFactory": "React.Fragment",\n' +
'    "allowImportingTsExtensions": true,\n' +
'    "noEmit": true,\n' +
'    "paths": {\n' +
'      "@bunny/api":  ["./.bunny/api-client.ts"],\n' +
'      "@bunnyx/api": ["./.bunnyx/api-client.ts"]\n' +
'    }\n' +
'  },\n' +
'  "include": [\n' +
'    "src*",\n' +
'    "bunnyx.config.ts",\n' +
'    "bunny-env.d.ts",\n' +
'    ".bunny*",\n' +
'    ".bunnyx/**/*"\n' +
'  ]\n' +
'}',

  mainJsx:
'import React from "react";\n' +
'import { createRoot } from "react-dom/client";\n' +
'import { Router, routes } from "./router.js";\n' +
'\n' +
'const root = createRoot(document.getElementById("root"));\n' +
'root.render(React.createElement(Router, { routes }));',
};

/* ── File list data ── */
const pageFiles = [
  { name: "pages/index.jsx",        desc: "Root home page" },
  { name: "pages/about.jsx",        desc: "About page" },
  { name: "pages/blog/index.jsx",   desc: "Blog listing page" },
  { name: "pages/blog/[slug].jsx",  desc: "Dynamic blog post page" },
];

const notes = [
  {
    icon: "🖼️",
    text: (
      <>
        Images belong in <InlineCode>public/</InlineCode> or a dedicated images folder.
        Put them anywhere else and BunnyX will move them there anyway — save yourself the trip.
      </>
    ),
  },
  {
    icon: "🗑️",
    text: (
      <>
        If Bun's cache gets stale — code is correct but the page still shows an old error —
        close the dev server, delete <InlineCode>.bertui/compiled</InlineCode>, and restart.
        Even BertUI can't fight a corrupted cache.
      </>
    ),
  },
  {
    icon: "✅",
    text: "Almost all BertUI features work directly inside BunnyX with no extra config.",
  },
  {
    icon: "📋",
    text: (
      <>
        BertUI logs may be swallowed by BunnyX in the current version. A fix is planned for
        the next beta — not a major concern right now.
      </>
    ),
  },
  {
    icon: "📁",
    text: (
      <>
        Everything inside <InlineCode>src/</InlineCode> is compiled — components, utilities,
        styles, all of it. Don't put components outside <InlineCode>src/</InlineCode>; that's
        a feature, not a limitation.
      </>
    ),
  },
];

/* ── Page ── */
export default function FolderStructure() {
  const r = {
    intro:    useReveal(),
    scaffold: useReveal(),
    tsconfig: useReveal(),
    css:      useReveal(),
    pages:    useReveal(),
    main:     useReveal(),
    indexApi: useReveal(),
    apiDir:   useReveal(),
    configs:  useReveal(),
    notes:    useReveal(),
  };

  return (
    <div className="docs-root">
      <div className="bx-grain" aria-hidden="true" />
      <Nav />

      <div className="docs-layout">

        {/* ── Sidebar ── */}
        <aside className="docs-sidebar" aria-label="Page sections">
          <span className="docs-sidebar__label">On this page</span>
          <a href="#scaffold"   className="docs-sidebar__link docs-sidebar__link--active">Folder structure</a>
          <a href="#tsconfig"   className="docs-sidebar__link">tsconfig.json</a>
          <a href="#global-css" className="docs-sidebar__link">global.css</a>
          <a href="#pages"      className="docs-sidebar__link">pages/</a>
          <a href="#main"       className="docs-sidebar__link">main.jsx</a>
          <a href="#index-api"  className="docs-sidebar__link">index.ts & api.ts</a>
          <a href="#api-dir"    className="docs-sidebar__link">api/</a>
          <a href="#configs"    className="docs-sidebar__link">Config files</a>
          <a href="#notes"      className="docs-sidebar__link">Side notes</a>

          <span className="docs-sidebar__label">Docs</span>
          <a href="/docs"                     className="docs-sidebar__link">Overview</a>
          <a href="/docs/folderstructure"     className="docs-sidebar__link docs-sidebar__link--active">Folder structure</a>
          <a href="/docs/buildstructure"      className="docs-sidebar__link">Build structure</a>
          <a href="/docs/howtowriteelysia"    className="docs-sidebar__link">Writing Elysia routes</a>
        </aside>

        {/* ── Content ── */}
        <main className="docs-content">
          <div className="docs-body">

            {/* Intro */}
            <section ref={r.intro} className="docs-reveal">
              <span className="bx-eyebrow">Getting started</span>
              <h1 className="docs-h1">
                <span className="bx-grad">Default Folder Structure</span>
              </h1>
              <p className="docs-p">
                BunnyX's default folder structure is intentionally simple. This page walks
                through every file and folder so you know exactly what to touch, what to leave
                alone, and what breaks if you move it.
              </p>
            </section>

            <hr className="docs-divider" />

            {/* Scaffold */}
            <section ref={r.scaffold} className="docs-reveal" id="scaffold">
              <h1 className="docs-h1">Scaffolding a New Project</h1>
              <p className="docs-p">
                Run either command to generate the default structure and install dependencies:
              </p>

              <div className="docs-cmd-group">
                <div className="docs-cmd">
                  <span className="docs-cmd__label">Primary</span>
                  <InlineCode>bun create bunnyx my-app</InlineCode>
                </div>
                <div className="docs-cmd">
                  <span className="docs-cmd__label">Fallback</span>
                  <InlineCode>bunx create-bunnyx my-app</InlineCode>
                </div>
              </div>

              <div className="docs-note">
                <span className="docs-note__icon">💡</span>
                <p>Don't try to memorise the structure — it may change in later BunnyX versions.</p>
              </div>

              <p className="docs-code-label">Project tree</p>
              <Code language="bash">{code.tree}</Code>
            </section>

            <hr className="docs-divider" />

            {/* tsconfig */}
            <section ref={r.tsconfig} className="docs-reveal" id="tsconfig">
              <h2 className="docs-h2">tsconfig.json</h2>
              <p className="docs-p">
                A standard TypeScript config — BunnyX ships this default automatically.
              </p>
              <Code language="json">{code.tsconfig}</Code>
              <div className="docs-note docs-note--warn">
                <span className="docs-note__icon">⚠️</span>
                <p>
                  You can <strong>add</strong> to this file freely, but do not{" "}
                  <strong>remove</strong> anything — BunnyX depends on every key here.
                </p>
              </div>
            </section>

            <hr className="docs-divider" />

            {/* global.css */}
            <section ref={r.css} className="docs-reveal" id="global-css">
              <h2 className="docs-h2">styles/global.css</h2>
              <p className="docs-p">
                Contains the default starter template styles. It's yours — edit it freely,
                delete it, replace it. BunnyX doesn't touch it after scaffolding.
              </p>
            </section>

            <hr className="docs-divider" />

            {/* pages/ */}
            <section ref={r.pages} className="docs-reveal" id="pages">
              <h2 className="docs-h2">pages/</h2>
              <p className="docs-p">
                Your entire UI lives here. The <InlineCode>index.jsx</InlineCode> in each
                folder is that folder's home page — so <InlineCode>blog/index.jsx</InlineCode>{" "}
                is the blog listing and <InlineCode>blog/[slug].jsx</InlineCode> is the
                dynamic post page.
              </p>

              <div className="docs-file-list">
                {pageFiles.map(f => (
                  <div key={f.name} className="docs-file">
                    <span className="docs-file__name">{f.name}</span>
                    <span className="docs-file__desc">{f.desc}</span>
                  </div>
                ))}
              </div>
            </section>

            <hr className="docs-divider" />

            {/* main.jsx */}
            <section ref={r.main} className="docs-reveal" id="main">
              <h2 className="docs-h2">main.jsx</h2>
              <div className="docs-note docs-note--warn">
                <span className="docs-note__icon">🚫</span>
                <p>
                  <strong>Do not edit this file.</strong> It's the app entry point, carefully
                  tuned for React compatibility. BunnyX rarely changes it.
                </p>
              </div>
              <p className="docs-p">
                If you accidentally delete it, here's the default:
              </p>
              <Code language="jsx">{code.mainJsx}</Code>
              <p className="docs-p">
                Leave it alone — it will change as BertUI moves toward full hydration support.
              </p>
            </section>

            <hr className="docs-divider" />

            {/* index.ts / api.ts */}
            <section ref={r.indexApi} className="docs-reveal" id="index-api">
              <h2 className="docs-h2">index.ts &amp; api.ts</h2>
              <div className="docs-note docs-note--warn">
                <span className="docs-note__icon">🚫</span>
                <p>
                  <strong>Do not remove these files.</strong> They are the type-safe client
                  generators — removing them kills frontend type inference.
                </p>
              </div>
              <p className="docs-p">
                <InlineCode>index.ts</InlineCode> exports your Elysia instance so the BunnyX
                bridge can read it and generate the typed client. Do not modify it.
              </p>
            </section>

            <hr className="docs-divider" />

            {/* api/ */}
            <section ref={r.apiDir} className="docs-reveal" id="api-dir">
              <h2 className="docs-h2">api/</h2>
              <p className="docs-p">
                Elysia routes only. Do not put React code in here — it won't be parsed
                and you'll get an unfriendly error. Keep all UI inside <InlineCode>pages/</InlineCode>.
              </p>
            </section>

            <hr className="docs-divider" />

            {/* Configs */}
            <section ref={r.configs} className="docs-reveal" id="configs">
              <h2 className="docs-h2">Config Files</h2>
              <p className="docs-p">
                <InlineCode>bertui.config.js</InlineCode>,{" "}
                <InlineCode>bun.lock</InlineCode>,{" "}
                <InlineCode>bunnyx.config.ts</InlineCode>,{" "}
                <InlineCode>bunnyx-env.d.ts</InlineCode> — all auto-generated by BertUI or
                BunnyX. Don't touch them. The exception is{" "}
                <InlineCode>package.json</InlineCode> when you need to bump a version or add
                a dependency.
              </p>
            </section>

            <hr className="docs-divider" />

            {/* Notes */}
            <section ref={r.notes} className="docs-reveal" id="notes">
              <h2 className="docs-h2">Side Notes</h2>
              <div className="docs-note-list">
                {notes.map((n, i) => (
                  <div key={i} className="docs-note">
                    <span className="docs-note__icon">{n.icon}</span>
                    <p>{n.text}</p>
                  </div>
                ))}
              </div>
            </section>

            <hr className="docs-divider" />

            {/* Pagination */}
            <div className="docs-pagination">
              <a href="/docs"               className="bx-btn bx-btn--ghost">← Back to Docs</a>
              <a href="/docs/buildstructure" className="bx-btn bx-btn--primary">Build structure →</a>
            </div>

          </div>
        </main>
      </div>

      <footer className="bx-footer">
        <span>BunnyX · Elysia.js · B.E.R.T.U.I — independent, open, yours.</span>
      </footer>
    </div>
  );
}