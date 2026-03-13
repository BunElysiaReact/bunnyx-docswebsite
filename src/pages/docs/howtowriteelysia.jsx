import { InlineCode, Code } from "bertui-code";
import { useRef, useEffect } from "react";
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

/* ── Code strings (BertUI safe) ── */
const code = {
  prefix:
'// ❌ wrong — catch-all will intercept this\n' +
'export const badRoutes  = new Elysia({ prefix: "/users" })\n' +
'\n' +
'// ✅ correct — Elysia gets this first\n' +
'export const goodRoutes = new Elysia({ prefix: "/api/users" })',

  routeFile:
'// src/api/users.ts\n' +
'import { Elysia, t } from "elysia"\n' +
'\n' +
'export const usersRoutes = new Elysia({ prefix: "/api/users" })\n' +
'  .get("/", () => ({\n' +
'    users: [\n' +
'      { id: 1, name: "Pease" },\n' +
'      { id: 2, name: "Ernest" },\n' +
'    ]\n' +
'  }))',

  methods:
'export const exampleRoutes = new Elysia({ prefix: "/api/example" })\n' +
'  .get("/",    () => ({ method: "GET" }))\n' +
'  .post("/",   () => ({ method: "POST" }))\n' +
'  .put("/",    () => ({ method: "PUT" }))\n' +
'  .patch("/",  () => ({ method: "PATCH" }))\n' +
'  .delete("/", () => ({ method: "DELETE" }))',

  urlParams:
'import { Elysia, t } from "elysia"\n' +
'\n' +
'export const usersRoutes = new Elysia({ prefix: "/api/users" })\n' +
'  .get("/:id", ({ params }) => ({\n' +
'    id:   params.id,\n' +
'    name: "User " + params.id\n' +
'  }), {\n' +
'    params: t.Object({\n' +
'      id: t.Numeric() // coerces string "5" → number 5\n' +
'    })\n' +
'  })',

  urlParamsFrontend:
'api.api.users({ id: 5 }).get() // id is typed as number ✅',

  body:
'export const usersRoutes = new Elysia({ prefix: "/api/users" })\n' +
'  .post("/", ({ body }) => ({\n' +
'    created: true,\n' +
'    user:    body\n' +
'  }), {\n' +
'    body: t.Object({\n' +
'      name:  t.String(),\n' +
'      email: t.String(),\n' +
'      age:   t.Number()\n' +
'    })\n' +
'  })',

  bodyFrontend:
'api.api.users.post({\n' +
'  body: { name: "Pease", email: "p@test.com", age: 20 }\n' +
'}) // body shape is fully typed ✅',

  query:
'export const postsRoutes = new Elysia({ prefix: "/api/posts" })\n' +
'  .get("/", ({ query }) => ({\n' +
'    page:  query.page,\n' +
'    limit: query.limit,\n' +
'  }), {\n' +
'    query: t.Object({\n' +
'      page:  t.Optional(t.Numeric()),\n' +
'      limit: t.Optional(t.Numeric()),\n' +
'    })\n' +
'  })',

  queryFrontend:
'api.api.posts.get({ query: { page: 1, limit: 10 } })',

  combined:
'export const postsRoutes = new Elysia({ prefix: "/api/posts" })\n' +
'  .put("/:id", ({ params, body, query }) => ({\n' +
'    updated: true,\n' +
'    id:      params.id,\n' +
'    data:    body,\n' +
'    notify:  query.notify,\n' +
'  }), {\n' +
'    params: t.Object({ id: t.Numeric() }),\n' +
'    body:   t.Object({ title: t.String(), content: t.String() }),\n' +
'    query:  t.Object({ notify: t.Optional(t.BooleanString()) }),\n' +
'  })',

  statusCodes:
'export const authRoutes = new Elysia({ prefix: "/api/auth" })\n' +
'  .post("/login", ({ body, set }) => {\n' +
'    if (body.password !== "correct") {\n' +
'      set.status = 401\n' +
'      return { error: "Invalid credentials" }\n' +
'    }\n' +
'    return { token: "abc123" }\n' +
'  }, {\n' +
'    body: t.Object({\n' +
'      email:    t.String(),\n' +
'      password: t.String(),\n' +
'    })\n' +
'  })',

  register:
'// src/index.ts\n' +
'import { Elysia } from "elysia"\n' +
'import { cors } from "@elysiajs/cors"\n' +
'import { usersRoutes }  from "./api/users"\n' +
'import { postsRoutes }  from "./api/posts"\n' +
'import { authRoutes }   from "./api/auth"\n' +
'import { uploadRoutes } from "./api/upload"\n' +
'\n' +
'const app = new Elysia()\n' +
'  .use(cors())\n' +
'  .use(usersRoutes)   // ← every route file goes here\n' +
'  .use(postsRoutes)\n' +
'  .use(authRoutes)\n' +
'  .use(uploadRoutes)\n' +
'\n' +
'// Required — do not remove either of these\n' +
'export type App = typeof app\n' +
'export default app',

  fullExample:
'// src/api/posts.ts\n' +
'import { Elysia, t } from "elysia"\n' +
'\n' +
'// In a real app this would be a database\n' +
'const posts = [\n' +
'  { id: 1, title: "Hello Bunnyx", content: "First post" },\n' +
']\n' +
'\n' +
'export const postsRoutes = new Elysia({ prefix: "/api/posts" })\n' +
'  .get("/", () => ({ posts }))\n' +
'\n' +
'  .get("/:id", ({ params, set }) => {\n' +
'    const post = posts.find(p => p.id === params.id)\n' +
'    if (!post) { set.status = 404; return { error: "Not found" } }\n' +
'    return { post }\n' +
'  }, {\n' +
'    params: t.Object({ id: t.Numeric() })\n' +
'  })\n' +
'\n' +
'  .post("/", ({ body }) => {\n' +
'    const post = { id: posts.length + 1, ...body }\n' +
'    posts.push(post)\n' +
'    return { created: true, post }\n' +
'  }, {\n' +
'    body: t.Object({\n' +
'      title:   t.String(),\n' +
'      content: t.String(),\n' +
'    })\n' +
'  })\n' +
'\n' +
'  .delete("/:id", ({ params, set }) => {\n' +
'    const idx = posts.findIndex(p => p.id === params.id)\n' +
'    if (idx === -1) { set.status = 404; return { error: "Not found" } }\n' +
'    posts.splice(idx, 1)\n' +
'    return { deleted: true }\n' +
'  }, {\n' +
'    params: t.Object({ id: t.Numeric() })\n' +
'  })',
};

/* ── Sidebar links ── */
const sections = [
  { href: "#golden-rule",  label: "The Golden Rule" },
  { href: "#route-file",   label: "Creating a route file" },
  { href: "#methods",      label: "HTTP methods" },
  { href: "#url-params",   label: "URL parameters" },
  { href: "#body",         label: "Request body" },
  { href: "#query",        label: "Query parameters" },
  { href: "#combined",     label: "Combining all three" },
  { href: "#status",       label: "Status codes" },
  { href: "#register",     label: "Registering routes" },
  { href: "#full-example", label: "Complete example" },
];

/* ── Page ── */
export default function HowToWriteElysia() {
  const r = {
    intro:    useReveal(),
    golden:   useReveal(),
    file:     useReveal(),
    methods:  useReveal(),
    params:   useReveal(),
    body:     useReveal(),
    query:    useReveal(),
    combined: useReveal(),
    status:   useReveal(),
    register: useReveal(),
    full:     useReveal(),
  };

  return (
    <div className="docs-root">
      <Nav />

      <div className="docs-layout">

        {/* ── Sidebar ── */}
        <aside className="docs-sidebar" aria-label="Page sections">
          <span className="docs-sidebar__label">On this page</span>
          {sections.map(s => (
            <a key={s.href} href={s.href} className="docs-sidebar__link">{s.label}</a>
          ))}

          <span className="docs-sidebar__label">Docs</span>
          <a href="/docs"                      className="docs-sidebar__link">Overview</a>
          <a href="/docs/folderstructure"      className="docs-sidebar__link">Folder structure</a>
          <a href="/docs/buildstructure"       className="docs-sidebar__link">Build structure</a>
          <a href="/docs/howtowriteelysia"     className="docs-sidebar__link docs-sidebar__link--active">Writing Elysia routes</a>
        </aside>

        {/* ── Content ── */}
        <main className="docs-content">
          <div className="docs-body">

            {/* Intro */}
            <section ref={r.intro} className="docs-reveal">
              <h1 className="docs-h1">How to Write Elysia Routes in Bunnyx</h1>
              <p className="docs-p">
                Elysia is the backend of your Bunnyx app. This page covers everything you need
                to know to write routes correctly so they work with the type-safe bridge and show
                up in your frontend with full autocomplete.
              </p>
            </section>

            <hr className="docs-divider" />

            {/* Golden Rule */}
            <section ref={r.golden} className="docs-reveal" id="golden-rule">
              <h1 className="docs-h1">The Golden Rule — Always Use /api/ Prefix</h1>
              <p className="docs-p">
                Every single Elysia route in a Bunnyx app must start with{" "}
                <InlineCode>/api/</InlineCode>. This is not optional. Bunnyx's bridge serves the
                React SPA shell for any path that has no file extension. Without{" "}
                <InlineCode>/api/</InlineCode>, your route and your React pages are
                indistinguishable — the catch-all wins and your API never responds.
              </p>
              <Code language="typescript">{code.prefix}</Code>
            </section>

            <hr className="docs-divider" />

            {/* Route File */}
            <section ref={r.file} className="docs-reveal" id="route-file">
              <h1 className="docs-h1">Creating a Route File</h1>
              <p className="docs-p">
                Create your route files inside <InlineCode>src/api/</InlineCode>. Each file
                exports one Elysia instance with a prefix. Keep related routes together in one file.
              </p>
              <p className="docs-code-label">src/api/users.ts</p>
              <Code language="typescript">{code.routeFile}</Code>
            </section>

            <hr className="docs-divider" />

            {/* Methods */}
            <section ref={r.methods} className="docs-reveal" id="methods">
              <h1 className="docs-h1">Route Methods</h1>
              <p className="docs-p">
                Elysia supports all HTTP methods. The handler receives a context object and
                returns the response directly — no <InlineCode>res.json()</InlineCode>, no{" "}
                <InlineCode>return Response</InlineCode>. Just return the object.
              </p>
              <Code language="typescript">{code.methods}</Code>
            </section>

            <hr className="docs-divider" />

            {/* URL Params */}
            <section ref={r.params} className="docs-reveal" id="url-params">
              <h1 className="docs-h1">URL Parameters</h1>
              <p className="docs-p">
                Define dynamic segments with <InlineCode>:name</InlineCode> in the path. Access
                them via <InlineCode>params</InlineCode> in the handler. Always validate params
                with <InlineCode>t.Object()</InlineCode> — without validation the types are loose
                and Eden won't infer them correctly.
              </p>
              <Code language="typescript">{code.urlParams}</Code>

              <p className="docs-p">
                In the frontend, Eden maps <InlineCode>/api/users/:id</InlineCode> to a function call:
              </p>
              <Code language="javascript">{code.urlParamsFrontend}</Code>
            </section>

            <hr className="docs-divider" />

            {/* Body */}
            <section ref={r.body} className="docs-reveal" id="body">
              <h1 className="docs-h1">Request Body</h1>
              <p className="docs-p">
                Validate the request body with <InlineCode>t.Object()</InlineCode>. Elysia
                automatically parses JSON and validates it. If validation fails, Elysia returns
                a 422 response — you don't have to handle that yourself.
              </p>
              <Code language="typescript">{code.body}</Code>

              <p className="docs-p">In the frontend:</p>
              <Code language="javascript">{code.bodyFrontend}</Code>
            </section>

            <hr className="docs-divider" />

            {/* Query */}
            <section ref={r.query} className="docs-reveal" id="query">
              <h1 className="docs-h1">Query Parameters</h1>
              <p className="docs-p">
                Validate query strings with <InlineCode>t.Object()</InlineCode> under the{" "}
                <InlineCode>query</InlineCode> key.
              </p>
              <Code language="typescript">{code.query}</Code>

              <p className="docs-p">In the frontend:</p>
              <Code language="javascript">{code.queryFrontend}</Code>
            </section>

            <hr className="docs-divider" />

            {/* Combined */}
            <section ref={r.combined} className="docs-reveal" id="combined">
              <h1 className="docs-h1">Combining Params, Body and Query</h1>
              <p className="docs-p">
                You can use all three in the same route. Elysia validates each independently.
              </p>
              <Code language="typescript">{code.combined}</Code>
            </section>

            <hr className="docs-divider" />

            {/* Status Codes */}
            <section ref={r.status} className="docs-reveal" id="status">
              <h1 className="docs-h1">Status Codes</h1>
              <p className="docs-p">
                Use the <InlineCode>set</InlineCode> object to change the response status code.
              </p>
              <Code language="typescript">{code.statusCodes}</Code>
            </section>

            <hr className="docs-divider" />

            {/* Registering */}
            <section ref={r.register} className="docs-reveal" id="register">
              <h1 className="docs-h1">Registering Routes in src/index.ts</h1>
              <p className="docs-p">
                Creating a route file is not enough. You must chain every route file onto the
                app in <InlineCode>src/index.ts</InlineCode>. This is what Bunnyx reads to
                generate the typed client. A route not registered here does not exist to the
                frontend — it won't appear in autocomplete and calling it will return{" "}
                <InlineCode>any</InlineCode>.
              </p>
              <p className="docs-code-label">src/index.ts</p>
              <Code language="typescript">{code.register}</Code>

              <div className="docs-note">
                <span className="docs-note__icon">💡</span>
                <p>
                  Do not call <InlineCode>.listen()</InlineCode> here — Bunnyx handles that.
                  After adding a new route file, restart{" "}
                  <InlineCode>bun run dev</InlineCode> and the client regenerates immediately.
                </p>
              </div>
            </section>

            <hr className="docs-divider" />

            {/* Full Example */}
            <section ref={r.full} className="docs-reveal" id="full-example">
              <h1 className="docs-h1">A Complete Example</h1>
              <p className="docs-p">
                A full CRUD route file for posts, correctly structured for Bunnyx:
              </p>
              <p className="docs-code-label">src/api/posts.ts</p>
              <Code language="typescript" showLineNumbers={true}>{code.fullExample}</Code>

              <p className="docs-p" style={{ marginTop: "1.5rem" }}>
                Back to <a href="/docs" className="docs-link">docs overview</a>.
              </p>
            </section>

          </div>
        </main>
      </div>
    </div>
  );
}