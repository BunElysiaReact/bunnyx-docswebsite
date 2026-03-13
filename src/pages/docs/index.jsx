import { InlineCode, Code } from "bertui-code";
import { api } from "../../../bunnyx-api/api-client";
import { useState, useEffect, useRef } from "react";
import Nav from "../../components/Nav";
import "./styles/docs.css";

/* ── Scroll reveal ── */
function useReveal(threshold = 0.12) {
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

/* ── Code strings (BertUI safe — no template literals in JSX) ── */
const code = {
  elysiaRoute:
'// src/api/test.ts\n' +
'import { Elysia, t } from "elysia"\n' +
'\n' +
'// ✅ correct — /api/ prefix means Bunnyx routes it to Elysia\n' +
'export const testRoutes = new Elysia({ prefix: "/api/test" })\n' +
'  .get("/", () => ({\n' +
'    message: "API is working!",\n' +
'    timestamp: new Date().toISOString()\n' +
'  }))\n' +
'  .get("/user/:id", ({ params }) => ({\n' +
'    id: params.id,\n' +
'    name: `User ${params.id}`,\n' +
'    email: `user${params.id}@example.com`\n' +
'  }), {\n' +
'    params: t.Object({\n' +
'      id: t.Numeric()\n' +
'    })\n' +
'  })\n' +
'  .post("/data", ({ body }) => ({\n' +
'    received: body,\n' +
'    processed: true\n' +
'  }), {\n' +
'    body: t.Object({\n' +
'      name: t.String(),\n' +
'      age: t.Number()\n' +
'    })\n' +
'  })',

  registerRoute:
'// src/index.ts\n' +
'import { Elysia } from "elysia"\n' +
'import { cors } from "@elysiajs/cors"\n' +
'import { testRoutes } from "./api/test"\n' +
'\n' +
'const app = new Elysia()\n' +
'  .use(cors())\n' +
'  .use(testRoutes) // ← registered here, now visible to the type system\n' +
'\n' +
'// These two lines power the bridge — do not remove them\n' +
'export type App = typeof app  // Bunnyx reads this to generate the typed client\n' +
'export default app            // Bunnyx mounts this onto the dev server',

  importClient:
'import { api } from "../../../bunnyx-api/api-client"\n' +
'// adjust the path based on how deep your file is relative to project root\n' +
'\n' +
'// Root GET /api/test/ → api.api.test.get()\n' +
'api.api.test.get()\n' +
'\n' +
'// Parameterized routes pass params as an object\n' +
'api.api.test.user({ id: 5 }).get()\n' +
'\n' +
'// POST routes pass body as first argument\n' +
'api.api.test.data.post({ body: { name: "Pease", age: 20 } })',
};

/* ── Page ── */
export default function Docs() {
  const [message, setMessage] = useState('');
  const [user, setUser]       = useState(null);

  const introRef  = useReveal();
  const step1Ref  = useReveal();
  const step2Ref  = useReveal();
  const step3Ref  = useReveal();
  const liveRef   = useReveal();
  const internalRef = useReveal();

  useEffect(() => {
    api.api.test.get().then(({ data }) => {
      setMessage(data?.message ?? '');
    });
    api.api.test.user({ id: 5 }).get().then(({ data }) => {
      setUser(data ?? null);
    });
  }, []);

  return (
    <div className="docs-root">
      <Nav />

      <div className="docs-layout">

        {/* ── Sidebar ── */}
        <aside className="docs-sidebar" aria-label="Docs navigation">
          <span className="docs-sidebar__label">Getting Started</span>
          <a href="#intro"      className="docs-sidebar__link docs-sidebar__link--active">Overview</a>
          <a href="#structure"  className="docs-sidebar__link">Default Template</a>

          <span className="docs-sidebar__label">The Bridge</span>
          <a href="#step1"      className="docs-sidebar__link">Step 1 — Write routes</a>
          <a href="#step2"      className="docs-sidebar__link">Step 2 — Register routes</a>
          <a href="#step3"      className="docs-sidebar__link">Step 3 — Import client</a>

          <span className="docs-sidebar__label">Reference</span>
          <a href="#live"       className="docs-sidebar__link">Live example</a>
          <a href="#internals"  className="docs-sidebar__link">How it works</a>

          <span className="docs-sidebar__label">More</span>
          <a href="/docs/folderstructure"   className="docs-sidebar__link">Folder structure</a>
          <a href="/docs/buildstructure"    className="docs-sidebar__link">Build structure</a>
          <a href="/docs/howtowriteelysia"  className="docs-sidebar__link">Writing Elysia routes</a>
        </aside>

        {/* ── Content ── */}
        <main className="docs-content">
          <div className="docs-body">

            {/* ── Overview ── */}
            <section ref={introRef} className="docs-reveal" id="intro">
              <h1 className="docs-h1">Bunnyx Docs</h1>
              <p className="docs-p">
                Bunnyx is not a meta framework. It has no opinions on how you structure
                your app, no runtime magic, no hidden abstractions. It is a zero-abstraction
                bridge — it wires your Elysia backend and your BertUI React frontend together
                and gets out of the way. So these docs are not about learning Bunnyx concepts.
                They are about understanding what Bunnyx gives you and how to use it correctly.
              </p>
            </section>

            <hr className="docs-divider" />

            {/* ── Default Template ── */}
            <section id="structure">
              <h1 className="docs-h1">Default Template Structure</h1>
              <p className="docs-p">
                When you run <InlineCode>bunx create-bunnyx my-app</InlineCode>, Bunnyx writes a
                default project to disk and installs dependencies. If you are new, opening the
                folder for the first time can be confusing — what do you touch, what do you leave
                alone, what breaks if you move it. The folder structure docs cover all of that.
              </p>
              <p className="docs-p">
                Read the full folder structure breakdown{" "}
                <a href="/docs/folderstructure" className="docs-link">here</a>, and the
                production build structure{" "}
                <a href="/docs/buildstructure" className="docs-link">here</a>.
              </p>
            </section>

            <hr className="docs-divider" />

            {/* ── Type-Safe Bridge ── */}
            <section>
              <h1 className="docs-h1">The Type-Safe Bridge</h1>
              <p className="docs-p">
                The one thing Bunnyx actually does — the reason it exists — is the type-safe
                bridge between your Elysia routes and your React components. Here is exactly
                how it works.
              </p>
            </section>

            {/* Step 1 */}
            <section ref={step1Ref} className="docs-reveal" id="step1">
              <h2 className="docs-h2">
                <span className="docs-h2-step">1</span>
                Write your Elysia route
              </h2>
              <p className="docs-p">
                Create a route file in <InlineCode>src/api/</InlineCode>. Elysia's{" "}
                <InlineCode>t</InlineCode> validator is what makes the types flow — when you
                define a body or params schema with <InlineCode>t.Object()</InlineCode>, Elysia
                encodes that into the route's TypeScript type. Without validators, Elysia still
                works but the types will be loose. Always validate your inputs.
              </p>

              <div className="docs-note docs-note--warn">
                <span className="docs-note__icon">⚠️</span>
                <p>
                  <strong>All Elysia routes must use the <InlineCode>/api/</InlineCode> prefix.</strong>{" "}
                  Bunnyx uses this prefix to tell API routes apart from SPA page routes. A route
                  like <InlineCode>/test/</InlineCode> with no prefix will be intercepted by the
                  catch-all and return the HTML shell instead of your API response. Always prefix
                  your routes with <InlineCode>/api/</InlineCode>.
                </p>
              </div>

              <p className="docs-code-label">src/api/test.ts</p>
              <Code language="typescript">{code.elysiaRoute}</Code>
            </section>

            {/* Step 2 */}
            <section ref={step2Ref} className="docs-reveal" id="step2">
              <h2 className="docs-h2">
                <span className="docs-h2-step">2</span>
                Register the route in src/index.ts
              </h2>
              <p className="docs-p">
                This is the most important step and the most commonly missed. Bunnyx reads your
                app from <InlineCode>src/index.ts</InlineCode> to generate the typed client. If a
                route file is not chained onto the app here, it does not exist as far as the type
                system is concerned — your IDE will not autocomplete it and calling it will return{" "}
                <InlineCode>any</InlineCode>. Every route file you create must be added here before
                you use it in the frontend.
              </p>

              <p className="docs-code-label">src/index.ts</p>
              <Code language="typescript">{code.registerRoute}</Code>
            </section>

            {/* Step 3 */}
            <section ref={step3Ref} className="docs-reveal" id="step3">
              <h2 className="docs-h2">
                <span className="docs-h2-step">3</span>
                Import the generated client in your component
              </h2>
              <p className="docs-p">
                When you run <InlineCode>bun run dev</InlineCode>, Bunnyx reads the{" "}
                <InlineCode>App</InlineCode> type from <InlineCode>src/index.ts</InlineCode> and
                generates <InlineCode>bunnyx-api/api-client.ts</InlineCode> at the project root.
                This file contains a fully typed <InlineCode>api</InlineCode> object powered by
                Eden Treaty. Import it using a relative path from your component to the project root.
                Do not edit this file — it is regenerated every time the dev server starts.
              </p>

              <p className="docs-code-label">your-component.jsx</p>
              <Code language="javascript">{code.importClient}</Code>
            </section>

            <hr className="docs-divider" />

            {/* Live Example */}
            <section ref={liveRef} className="docs-reveal" id="live">
              <h2 className="docs-h2">Live Example — This Page Calling the Test Routes</h2>
              <p className="docs-p">
                This docs page itself is calling{" "}
                <InlineCode>GET /api/test/</InlineCode> and{" "}
                <InlineCode>GET /api/test/user/:id</InlineCode> right now. The results below are
                live API responses from the Elysia backend — fully typed, no manual type
                definitions written anywhere on this page.
              </p>
              <p className="docs-p">
                When you import the api and hover over it, your IDE shows every route, every
                parameter, every response shape — all inferred directly from your Elysia routes.
                No manual types needed.
              </p>

              {/* Type safety screenshots */}
              <div className="docs-img-grid">
                <div className="docs-img-card">
                  <img src="/type2.png" alt="Type safety IDE screenshot 2" loading="lazy" />
                  <div className="docs-img-card__caption">Eden Treaty autocomplete in VS Code</div>
                </div>
                <div className="docs-img-card">
                  <img src="/type1.png" alt="Type safety IDE screenshot 1" loading="lazy" />
                  <div className="docs-img-card__caption">Full route type inference</div>
                </div>
              </div>

              {/* Live response */}
              <div className="docs-live">
                <div className="docs-live__header">
                  <span className="docs-live__dot" aria-hidden="true" />
                  <span className="docs-live__title">Live API Response</span>
                </div>
                <div className="docs-live__body">
                  {!message && !user && (
                    <span className="docs-live__empty">Fetching from Elysia backend…</span>
                  )}
                  {message && (
                    <div className="docs-live__row">
                      <span className="docs-live__key">message:</span>
                      <span>{message}</span>
                    </div>
                  )}
                  {user && (
                    <>
                      <div className="docs-live__row">
                        <span className="docs-live__key">user.name:</span>
                        <span>{user.name}</span>
                      </div>
                      <div className="docs-live__row">
                        <span className="docs-live__key">user.email:</span>
                        <span>{user.email}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </section>

            <hr className="docs-divider" />

            {/* Internals */}
            <section ref={internalRef} className="docs-reveal" id="internals">
              <h2 className="docs-h2">How the Bridge Works Internally</h2>
              <p className="docs-p">
                When <InlineCode>bun run dev</InlineCode> starts, Bunnyx imports your{" "}
                <InlineCode>src/index.ts</InlineCode> and reads the <InlineCode>App</InlineCode>{" "}
                type. It then generates <InlineCode>bunnyx-api/api-client.ts</InlineCode> which
                calls Eden Treaty's <InlineCode>{"treaty<App>(url)"}</InlineCode>. The generic{" "}
                <InlineCode>App</InlineCode> type is what gives Treaty the full route map — every
                prefix, every method, every validator schema you defined in Elysia gets encoded
                into that type automatically. Treaty then exposes it as a chainable object that
                matches your URL structure exactly. No code generation step, no schema files, no
                separate type definitions — the Elysia route is the single source of truth for
                both the runtime behavior and the TypeScript types.
              </p>
              <p className="docs-p">
                The <InlineCode>/api/</InlineCode> prefix convention is what keeps everything
                working. Bunnyx's catch-all route serves the React SPA shell for any path without
                a file extension. Without the prefix, your Elysia route and your React page routes
                are indistinguishable to the bridge — the catch-all wins and your API never
                responds. With the prefix, Elysia always gets there first.
              </p>

              <div className="docs-note">
                <span className="docs-note__icon">📖</span>
                <p>
                  Learn how to write Elysia routes correctly{" "}
                  <a href="/docs/howtowriteelysia" className="docs-link">here</a>.
                  API tests live in{" "}
                  <a href="/tests/apitest" className="docs-link">tests/apitest</a>.
                </p>
              </div>
            </section>

          </div>
        </main>
      </div>
    </div>
  );
}