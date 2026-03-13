import { InlineCode, Code } from "bertui-code";

export default function ApiTest() {
  return (
    <div>
      <h1>OpenAPI Documentation</h1>
      <p>
        Bunnyx supports OpenAPI documentation out of the box — powered entirely by Elysia's
        official <InlineCode>@elysiajs/openapi</InlineCode> plugin. No extra config, no separate
        doc server, no additional port. Your API docs live on the same server as everything else.
      </p>

      <h2>What This Means</h2>
      <p>
        Every route you write in Elysia — with its validators, params, body schemas, and response
        types — gets automatically documented. Scalar reads your Elysia app and generates a
        clean, interactive API reference page at <InlineCode>/openapi</InlineCode>.
        You can browse every endpoint, see the expected inputs and outputs, and test requests
        directly from the browser. No Postman needed.
      </p>

      <h2>Setup</h2>
      <p>
        Install the plugin:
      </p>
      <Code>{`bun add @elysiajs/openapi`}</Code>
      <p>
        Add it to your <InlineCode>src/index.ts</InlineCode> and tell Bunnyx to bypass the route:
      </p>
      <Code>
        {`// src/index.ts
import { Elysia } from 'elysia'
import { openapi } from '@elysiajs/openapi'
import { cors } from '@elysiajs/cors'

const app = new Elysia()
  .use(openapi({
    exclude: {
      // hide Bunnyx internal routes from the docs
      paths: [
        '/__hmr', '/bunnyx-api/*', '/compiled/*',
        '/styles/*', '/images/*', '/node_modules/*',
        '/error-overlay.js', '/bertui-animate.css', '/*'
      ]
    },
    documentation: {
      info: {
        title: 'My API',
        version: '1.0.0',
        description: 'Auto-generated from Elysia routes'
      }
    }
  }))
  .use(cors())
  .use(yourRoutes)

export type App = typeof app
export default app`}
      </Code>
      <p>
        Then in <InlineCode>bunnyx.config.ts</InlineCode>, tell Bunnyx not to intercept the docs route:
      </p>
      <Code>
        {`// bunnyx.config.ts
export default {
  server: './src/index.ts',
  bypass: ['openapi'] // Bunnyx passes /openapi straight to Elysia
}`}
      </Code>

      <h2>Result</h2>
      <p>
        Visit <InlineCode>/openapi</InlineCode> on your running app and Scalar renders your full
        API reference — every route, every schema, every param. It updates automatically as you
        add or change routes. No manual documentation work ever.
      </p>
      <p>
        See it live here: <a href="/openapi" target="_blank">/openapi →</a>
      </p>

      <h2>This is Elysia. Bunnyx Just Stays Out of the Way.</h2>
      <p>
        Bunnyx didn't build this. Elysia did. The only thing Bunnyx does here is the
        <InlineCode>bypass</InlineCode> config — one line that tells the bridge to leave
        <InlineCode>/openapi</InlineCode> alone. Everything else is pure Elysia working exactly
        as it was designed to. That's the point of zero abstraction — when Elysia ships a
        feature, you get it immediately. No waiting for Bunnyx to catch up.
      </p>
      <div>
        <p>a sample of the docs page api page image</p>
        <img src="/openapi.png" alt="openapi" />
      </div>
    </div>
  );
}