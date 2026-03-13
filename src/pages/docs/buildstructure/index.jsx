import { InlineCode, Code } from "bertui-code";
import React from "react";
import Nav from "../../../components/Nav";
import "../../../styles/docs.css";

export default function Build() {
  return (
    <div className="docs-root">
      <div className="bx-grain" aria-hidden="true" />
      <Nav />

      <div className="docs-layout">

        {/* ── Sidebar ── */}
        <aside className="docs-sidebar" aria-label="Page sections">
          <span className="docs-sidebar__label">On this page</span>
          <a href="#overview"      className="docs-sidebar__link docs-sidebar__link--active">Overview</a>
          <a href="#dist"          className="docs-sidebar__link">dist/</a>
          <a href="#assets"        className="docs-sidebar__link">assets/js</a>
          <a href="#pages"         className="docs-sidebar__link">Page folders</a>
          <a href="#server"        className="docs-sidebar__link">server/</a>
          <a href="#styles"        className="docs-sidebar__link">styles/</a>
          <a href="#node_modules"  className="docs-sidebar__link">node_modules/</a>
          <a href="#html"          className="docs-sidebar__link">HTML template</a>
          <a href="#importmap"     className="docs-sidebar__link">Import map</a>
          <a href="#start"         className="docs-sidebar__link">Starting the build</a>

          <span className="docs-sidebar__label">Docs</span>
          <a href="/docs"                     className="docs-sidebar__link">Overview</a>
          <a href="/docs/folderstructure"     className="docs-sidebar__link">Folder structure</a>
          <a href="/docs/buildstructure"      className="docs-sidebar__link docs-sidebar__link--active">Build structure</a>
          <a href="/docs/howtowriteelysia"    className="docs-sidebar__link">Writing Elysia routes</a>
        </aside>

        {/* ── Content ── */}
        <main className="docs-content">
          <div className="docs-body">

            {/* Overview */}
            <section id="overview" className="docs-reveal is-visible">
              <span className="bx-eyebrow">Deployment</span>
              <h1 className="docs-h1">
                <span className="bx-grad">Build structure</span>
              </h1>
              <p className="docs-p">
                BunnyX produces a <InlineCode>dist/</InlineCode> folder when you build.
                It contains both your API code and your compiled front-end — ready to serve.
              </p>
            </section>

            <hr className="docs-divider" />

            {/* Overview details */}
            <section id="overview-details" className="docs-reveal is-visible">
              <h2 className="docs-h2">Overview</h2>
              <p className="docs-p">
                The build follows BertUI's style: every page gets its own folder and its own{" "}
                <InlineCode>index.html</InlineCode>. This is intentional — it lays the groundwork
                for improved server-side logic in future versions and it benefits SEO since each
                route has a dedicated HTML file that crawlers can read directly.
              </p>
              <div className="docs-note docs-note--warn">
                <span className="docs-note__icon">⚠️</span>
                <p>
                  Do <strong>not</strong> modify files inside <InlineCode>dist/</InlineCode> unless
                  you know exactly what you are doing. The folder is fully regenerated on every build.
                </p>
              </div>

              <p className="docs-code-label">dist/ structure</p>
              <Code language="bash">{`dist/
├── about/
│   └── index.html
├── assets/
│   └── js/
│       ├── main-3k3r2wbk.js
│       └── main-3k3r2wbk.js.map
├── blog/
│   ├── index.html
│   └── [slug]/
│       └── index.html
├── server/
│   └── index.js
├── styles/
│   └── bertui.min.css
├── node_modules/
│   └── @elysiajs/eden/...
├── index.html
├── favicon.svg
├── import-map.json
├── metafile.json
├── bundle-report.html
├── robots.txt
├── sitemap.xml
├── package.json
└── start.js`}</Code>
            </section>

            <hr className="docs-divider" />

            {/* dist/ */}
            <section id="dist" className="docs-reveal is-visible">
              <h2 className="docs-h2">dist/</h2>
              <p className="docs-p">
                The root of your build output. Everything your production server needs is in here —
                static HTML, compiled JS, styles, API server, and the start script. You deploy
                this folder, nothing else.
              </p>
              <div className="docs-file-list">
                <div className="docs-file">
                  <span className="docs-file__name">index.html</span>
                  <span className="docs-file__desc">Root page ( / )</span>
                </div>
                <div className="docs-file">
                  <span className="docs-file__name">start.js</span>
                  <span className="docs-file__desc">Production entry point</span>
                </div>
                <div className="docs-file">
                  <span className="docs-file__name">import-map.json</span>
                  <span className="docs-file__desc">Module resolution map</span>
                </div>
                <div className="docs-file">
                  <span className="docs-file__name">robots.txt</span>
                  <span className="docs-file__desc">Crawler instructions</span>
                </div>
                <div className="docs-file">
                  <span className="docs-file__name">sitemap.xml</span>
                  <span className="docs-file__desc">Auto-generated sitemap for SEO</span>
                </div>
                <div className="docs-file">
                  <span className="docs-file__name">bundle-report.html</span>
                  <span className="docs-file__desc">Bundle size visualiser</span>
                </div>
                <div className="docs-file">
                  <span className="docs-file__name">metafile.json</span>
                  <span className="docs-file__desc">Raw esbuild metadata</span>
                </div>
              </div>
            </section>

            <hr className="docs-divider" />

            {/* assets/js */}
            <section id="assets" className="docs-reveal is-visible">
              <h2 className="docs-h2">assets/js/</h2>
              <p className="docs-p">
                Your entire React app compiled into a single hashed JS bundle —
                something like <InlineCode>main-3k3r2wbk.js</InlineCode>. The hash in the
                filename is content-based so browsers automatically bust the cache when you
                ship a new build. The <InlineCode>.map</InlineCode> file is the source map
                for debugging in production.
              </p>
              <div className="docs-note docs-note--info">
                <span className="docs-note__icon">💡</span>
                <p>
                  The <InlineCode>assets/node_modules/</InlineCode> subfolder holds any
                  bundled package assets that esbuild chose to copy rather than inline.
                </p>
              </div>
            </section>

            <hr className="docs-divider" />

            {/* Page folders */}
            <section id="pages" className="docs-reveal is-visible">
              <h2 className="docs-h2">Page folders</h2>
              <p className="docs-p">
                Each route from your <InlineCode>src/pages/</InlineCode> directory becomes
                a folder in <InlineCode>dist/</InlineCode> containing an{" "}
                <InlineCode>index.html</InlineCode>. Dynamic routes like{" "}
                <InlineCode>[slug]</InlineCode> also get their own folder with a shell HTML
                that the client-side router hydrates at runtime.
              </p>
              <div className="docs-file-list">
                <div className="docs-file">
                  <span className="docs-file__name">about/index.html</span>
                  <span className="docs-file__desc">Serves /about</span>
                </div>
                <div className="docs-file">
                  <span className="docs-file__name">blog/index.html</span>
                  <span className="docs-file__desc">Serves /blog</span>
                </div>
                <div className="docs-file">
                  <span className="docs-file__name">blog/[slug]/index.html</span>
                  <span className="docs-file__desc">Serves /blog/:slug</span>
                </div>
              </div>
              <p className="docs-p">
                This is the SEO benefit — search engine crawlers see real HTML files at
                real paths instead of a single blank shell.
              </p>
            </section>

            <hr className="docs-divider" />

            {/* server/ */}
            <section id="server" className="docs-reveal is-visible">
              <h2 className="docs-h2">server/</h2>
              <p className="docs-p">
                Contains <InlineCode>index.js</InlineCode> — your compiled Elysia API server.
                In production, <InlineCode>start.js</InlineCode> boots this alongside a
                static file server that handles the front-end routes.
              </p>
              <div className="docs-note docs-note--warn">
                <span className="docs-note__icon">⚠️</span>
                <p>
                  Do not edit <InlineCode>server/index.js</InlineCode> directly. It is
                  regenerated on every build from your <InlineCode>src/api/</InlineCode> code.
                </p>
              </div>
            </section>

            <hr className="docs-divider" />

            {/* styles/ */}
            <section id="styles" className="docs-reveal is-visible">
              <h2 className="docs-h2">styles/</h2>
              <p className="docs-p">
                Contains <InlineCode>bertui.min.css</InlineCode> — BertUI's minified base
                stylesheet, linked in the <InlineCode>&lt;head&gt;</InlineCode> of every
                generated HTML file. Your own CSS is bundled into the JS file, not here.
              </p>
            </section>

            <hr className="docs-divider" />

            {/* node_modules/ */}
            <section id="node_modules" className="docs-reveal is-visible">
              <h2 className="docs-h2">node_modules/</h2>
              <p className="docs-p">
                BunnyX copies certain packages — like{" "}
                <InlineCode>@elysiajs/eden</InlineCode> — directly into{" "}
                <InlineCode>dist/node_modules/</InlineCode> so they can be resolved via the
                import map at runtime without depending on an external CDN or ESM link. This
                means your app works fully offline once deployed.
              </p>
            </section>

            <hr className="docs-divider" />

            {/* HTML template */}
            <section id="html" className="docs-reveal is-visible">
              <h2 className="docs-h2">HTML template</h2>
              <p className="docs-p">
                Every page's <InlineCode>index.html</InlineCode> follows the same shell.
                BunnyX fills in the <InlineCode>&lt;title&gt;</InlineCode> and{" "}
                <InlineCode>&lt;meta&gt;</InlineCode> tags per page automatically:
              </p>
              <Code language="html">{`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>About — bunnyx-test</title>
  <meta name="description" content="Built with BunnyX — BertUI + Elysia">
  <meta name="keywords" content="react, bun, bertui, fast, file-based routing">
  <meta name="author" content="Pease Ernest">
  <meta name="theme-color" content="#667eea">
  <meta property="og:title" content="BertUI - Lightning Fast React Framework">
  <meta property="og:description" content="Build lightning-fast React apps with zero config">
  <meta property="og:image" content="/og-image.png">
  <link rel="stylesheet" href="/styles/bertui.min.css">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <!-- import map is inlined here -->
  <script>window.__BERTUI_HYDRATE__ = false;</script>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/assets/js/main-3k3r2wbk.js"></script>
</body>
</html>`}</Code>
            </section>

            <hr className="docs-divider" />

            {/* Import map */}
            <section id="importmap" className="docs-reveal is-visible">
              <h2 className="docs-h2">Import map</h2>
              <p className="docs-p">
                The <InlineCode>&lt;script type="importmap"&gt;</InlineCode> block tells the
                browser how to resolve bare module specifiers like{" "}
                <InlineCode>react</InlineCode> or <InlineCode>@bunnyx/api</InlineCode>.
                React itself is loaded from ESM CDN. Eden and the BunnyX API client are
                served locally from <InlineCode>dist/</InlineCode> for offline reliability.
              </p>
              <Code language="json">{`{
  "imports": {
    "react":               "https://esm.sh/react@18.2.0",
    "react-dom":           "https://esm.sh/react-dom@18.2.0",
    "react-dom/client":    "https://esm.sh/react-dom@18.2.0/client",
    "react/jsx-runtime":   "https://esm.sh/react@18.2.0/jsx-runtime",
    "@bunnyx/api":         "/bunnyx-api/api-client.js",
    "@elysiajs/eden":      "/node_modules/@elysiajs/eden/dist/index.mjs"
  }
}`}</Code>
            </section>

            <hr className="docs-divider" />

            {/* Starting */}
            <section id="start" className="docs-reveal is-visible">
              <h2 className="docs-h2">Starting the build</h2>
              <p className="docs-p">
                To run your production build, simply execute:
              </p>
              <div className="docs-cmd-group">
                <div className="docs-cmd">
                  <span className="docs-cmd__label">Run</span>
                  <InlineCode>bun dist/start.js</InlineCode>
                </div>
              </div>
              <p className="docs-p">
                This boots both the Elysia API server and the static file server together.
                No separate processes needed.
              </p>
              <div className="docs-note docs-note--info">
                <span className="docs-note__icon">💡</span>
                <p>
                  Always run from the project root, not from inside <InlineCode>dist/</InlineCode>,
                  so relative paths resolve correctly.
                </p>
              </div>
            </section>

            <hr className="docs-divider" />

            {/* Pagination */}
            <div className="docs-pagination">
              <a href="/docs/folderstructure" className="bx-btn bx-btn--ghost">← Folder structure</a>
              <a href="/docs/configuration"   className="bx-btn bx-btn--primary">Configuration →</a>
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