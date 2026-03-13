import { useState } from "react";
import { ArrowBigDown, CloudLightning, Heart, Star } from "bertui-icons";
import { Code, InlineCode } from "bertui-code";
import "./styles/home.css";
import Nav from "../components/Nav";

/* ── Tooltip ── */
function Tooltip({ children, text, position = "top" }) {
  const [open, setOpen] = useState(false);
  return (
    <span
      className={`bx-tip${open ? " bx-tip--open" : ""}`}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      <span className="bx-tip__trigger" tabIndex={0}>{children}</span>
      <span className={`bx-tip__box bx-tip__box--${position}`} role="tooltip">
        {text}
      </span>
    </span>
  );
}

/* ── Page ── */
export default function Home() {
  return (
    <div className="bx-root">
      <div className="bx-grain" aria-hidden="true" />

      <Nav />
      <main className="bx-main">

        {/* Hero */}
        <section className="bx-hero">
          <div className="bx-orb bx-orb--pink" />
          <div className="bx-orb bx-orb--purple" />
          <div className="bx-orb bx-orb--blue" />

          <div className="bx-hero__inner">
            <div className="bx-badge">Open source · Bun-native · Zero abstraction</div>

            <div className="bx-hero__logo-wrap">
              <img src="/logomain.svg" alt="BunnyX logo" className="bx-hero__logo" />
            </div>

            <h1 className="bx-hero__title">
              <span className="bx-grad">BunnyX</span>
            </h1>
            <p className="bx-hero__tagline">The best overall bridge for Elysia.js</p>
            <p className="bx-hero__desc">
              BunnyX connects the enormously type-safe backend framework{" "}
              <Star className="bx-icon" /> and the fastest front-end React
              framework <CloudLightning className="bx-icon bx-icon--bolt" /> —
              Elysia meets B.E.R.T.U.I, zero compromise.
            </p>

            <div className="bx-hero__actions">
              <a href="#why" className="bx-btn bx-btn--primary">Get started →</a>
              <a href="#why" className="bx-btn bx-btn--ghost">Why BunnyX?</a>
            </div>
          </div>
        </section>

        {/* Why */}
        <section className="bx-section" id="why">
          <div className="bx-section__head">
            <span className="bx-eyebrow">Zero abstraction</span>
            <h2 className="bx-h2">
              Why do developers need BunnyX?{" "}
              <ArrowBigDown className="bx-icon" />
            </h2>
          </div>

          <div className="bx-card bx-card--highlight">
            <div className="bx-card__emoji">⚡</div>
            <div>
              <strong>Your code stays yours.</strong> BunnyX doesn't ship its
              own API names like{" "}
              <InlineCode>import serverlogic from "bunnyx"</InlineCode>. Your
              backend stays pure Elysia, your front end stays pure React —
              magically.
            </div>
          </div>

          <p className="bx-prose">
            Getting started is as simple as{" "}
            <InlineCode>bun create bunnyx my-app</InlineCode>. This generates a
            boilerplate for you. The folder structure is covered in the next
            chapter.
          </p>

          <p className="bx-code-label">Backend</p>
          <Code>{`// src/index.ts
import { Elysia } from 'elysia';

export const App = new Elysia()
  .get('/api/hello', () => ({ message: 'Hello from Elysia!' }));`}</Code>

          <p className="bx-code-label">Frontend — plain fetch, no BunnyX API yet</p>
          <Code>{`// src/pages/index.jsx
import { useState, useEffect } from 'react';

export default function Home() {
  const [msg, setMsg] = useState('...');

  useEffect(() => {
    fetch('/api/hello').then(r => r.json()).then(d => setMsg(d.message));
  }, []);

  return <h1>{msg}</h1>;
}`}</Code>

          <p className="bx-prose">
            The React code works as-is. The API works as-is. Later you can
            move each anywhere — that is the whole point of zero abstraction.
          </p>
        </section>

        {/* Type Safety */}
        <section className="bx-section" id="typesafe">
          <div className="bx-section__head">
            <span className="bx-eyebrow">Front-end type safety</span>
            <h2 className="bx-h2">This might sound like a joke… it is not.</h2>
          </div>

          <p className="bx-prose">
            BunnyX automatically generates a{" "}
            <InlineCode>bunnyx-env.d.ts</InlineCode> whenever you run your dev
            server. Type safety comes from{" "}
            <InlineCode>@elysiajs/eden</InlineCode>, and BunnyX auto-detects
            browser vs. server to adjust <InlineCode>baseUrl</InlineCode>{" "}
            accordingly.
          </p>

          <Code>{`import { api } from '@bunnyx/api';

const { data } = await api.api.hello.get(); // fully typed ✅`}</Code>

          <p className="bx-prose">Elysia stays the same. On the React side, things get spicy:</p>

          <Code showCopyButton="true" showLineNumbers="true">{`// src/pages/index.jsx
import { useState, useEffect } from 'react';
import { api } from '@bunnyx/api';

export default function Home() {
  const [msg, setMsg] = useState<string>('...');

  useEffect(() => {
    api.api.hello.get().then(({ data }) => setMsg(data.message));
  }, []);

  return <h1>{msg}</h1>;
}`}</Code>
        </section>

        {/* Features */}
        <section className="bx-section">
          <div className="bx-section__head">
            <span className="bx-eyebrow">Everything included</span>
            <h2 className="bx-h2">Batteries not just included — turbocharged.</h2>
          </div>

          <div className="bx-feat-grid">
            <Tooltip position="top" text={
              <ul>
                <li>File-based routing</li>
                <li>SEO optimization</li>
                <li>Fast build times</li>
                <li>Zero config</li>
              </ul>
            }>
              <div className="bx-feat-card">
                <span className="bx-feat-card__emoji">🐰</span>
                <strong>B.E.R.T.U.I</strong>
                <span>All features included</span>
              </div>
            </Tooltip>

            <Tooltip position="top" text={
              <ul>
                <li>Type safety</li>
                <li>OpenAPI documentation</li>
                <li>Client-server communication</li>
                <li>Advanced type inference</li>
                <li>Request validation</li>
              </ul>
            }>
              <div className="bx-feat-card">
                <span className="bx-feat-card__emoji">⚗️</span>
                <strong>Elysia.js</strong>
                <span>All HTTP features included</span>
              </div>
            </Tooltip>

            <div className="bx-feat-card bx-feat-card--static">
              <span className="bx-feat-card__emoji">🔒</span>
              <strong>Type-safe E2E</strong>
              <span>Eden-powered client</span>
            </div>

            <div className="bx-feat-card bx-feat-card--static">
              <span className="bx-feat-card__emoji">🚀</span>
              <strong>Bun-native</strong>
              <span>Blazing fast runtime</span>
            </div>
          </div>

          <div className="bx-note">
            <span className="bx-note__icon">📝</span>
            <p>
              While BunnyX is optimized for BertUI, you're not locked in. Take
              your API folder to Vite/React anytime — but you'll lose BunnyX's
              magic and need to configure the server yourself.
            </p>
          </div>
        </section>

        {/* Limitations */}
        <section className="bx-section" id="limitations">
          <div className="bx-section__head">
            <span className="bx-eyebrow">Honest disclaimer</span>
            <h2 className="bx-h2">What BunnyX supports — and what's coming.</h2>
          </div>

          <p className="bx-prose">
            BunnyX is a bridge between Elysia and BertUI running on a single
            Bun server. It fully supports all standard Elysia HTTP routes —
            GET, POST, PUT, PATCH, DELETE, validation, guards, hooks, middleware,
            OpenAPI. If it works over a normal HTTP request, it works in BunnyX.
          </p>

          <p className="bx-prose">
            Features that require persistent or upgraded connections are{" "}
            <strong>not yet supported</strong> because the bridge currently
            handles HTTP only. These are on the roadmap:
          </p>

          <div className="bx-feat-grid">
            <div className="bx-feat-card bx-feat-card--static">
              <span className="bx-feat-card__emoji">🔌</span>
              <strong>WebSockets</strong>
              <span>Coming in a future update</span>
            </div>
            <div className="bx-feat-card bx-feat-card--static">
              <span className="bx-feat-card__emoji">📡</span>
              <strong>Server-Sent Events</strong>
              <span>Coming in a future update</span>
            </div>
            <div className="bx-feat-card bx-feat-card--static">
              <span className="bx-feat-card__emoji">🌊</span>
              <strong>Response Streaming</strong>
              <span>Coming in a future update</span>
            </div>
          </div>

          <div className="bx-note">
            <span className="bx-note__icon">⚠️</span>
            <p>
              Using <InlineCode>.ws()</InlineCode> on your Elysia instance will
              not error at startup — but the connection will silently fail at
              runtime. Hold off on WebSockets until the bridge adds explicit
              passthrough support.
            </p>
          </div>
        </section>

        {/* From the team */}
        <section className="bx-section">
          <div className="bx-section__head">
            <span className="bx-eyebrow">From the team</span>
            <h2 className="bx-h2">Message from the developer</h2>
          </div>
          <div className="bx-placeholder">Post coming soon…</div>
          <h3 className="bx-h3">Message from our users</h3>
          <div className="bx-placeholder">Will be displayed here.</div>
        </section>

        {/* Sponsors */}
        <section className="bx-section" id="sponsors">
          <div className="bx-section__head">
            <span className="bx-eyebrow">Independence</span>
            <h2 className="bx-h2">
              BunnyX, Elysia.js, and BertUI are not owned by any
              organization — because of you.
            </h2>
          </div>

          <div className="bx-sponsor-grid">
            <div className="bx-sponsor-card">
              <span className="bx-sponsor-card__name">Elysia sponsors</span>
              <p>
                Coming soon — SaltyAOM will provide the data. Main ones include
                Jarred Summer (Bun), CodeRabbit, Photon, Better Auth, SF
                Compute Company.
              </p>
            </div>
            <div className="bx-sponsor-card">
              <span className="bx-sponsor-card__name">BertUI sponsors</span>
              <p>Ernest Tech House</p>
            </div>
            <div className="bx-sponsor-card">
              <span className="bx-sponsor-card__name">BunnyX sponsors</span>
              <p>Ernest Tech House</p>
            </div>
          </div>

          <div className="bx-cta-band">
            <div className="bx-cta-band__text">
              <strong>Love what we're building?</strong>
              <p>Become a sponsor and help BunnyX grow.</p>
            </div>
            <a href="#" className="bx-btn bx-btn--primary">Sponsor us ♥</a>
          </div>

          <p className="bx-prose bx-prose--center">
            Want to learn more?{" "}
            <a href="/docs" className="bx-link">Explore the docs →</a>
          </p>

          <div className="bx-mascot">
            <div className="bx-mascot__glow" />
            <img src="/BUNNY.jpg" alt="BunnyX mascot" />
          </div>
        </section>
      </main>

      <footer className="bx-footer">
        <span>Made with love <Heart className="bx-icon bx-icon--heart" /> by the BunnyX team</span>
      </footer>
    </div>
  );
}