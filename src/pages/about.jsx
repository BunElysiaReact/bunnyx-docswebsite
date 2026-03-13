import { Heart } from "bertui-icons";
import Nav from "../components/Nav";
import "./styles/home.css";


export default function About() {
  return (
    <div className="bx-root">
      <div className="bx-grain" aria-hidden="true" />
      <Nav />

      <main className="bx-main">
        <section className="bx-hero">
          <div className="bx-orb bx-orb--pink" />
          <div className="bx-orb bx-orb--purple" />
          <div className="bx-hero__inner">
            <div className="bx-badge">Open source · Built in Kenya 🇰🇪</div>
            <h1 className="bx-hero__title">
              <span className="bx-grad">About BunnyX</span>
            </h1>
            <p className="bx-hero__tagline">
              One port. One command. Full-stack Bun.
            </p>
          </div>
        </section>

        {/* What is it */}
        <section className="bx-section">
          <div className="bx-section__head">
            <span className="bx-eyebrow">What is BunnyX</span>
            <h2 className="bx-h2">A bridge, not a framework.</h2>
          </div>

          <p className="bx-prose">
            BunnyX is a meta-framework that bridges{" "}
            <a href="https://elysiajs.com" className="bx-link">Elysia</a> and{" "}
            <a href="#" className="bx-link">B.E.R.T.U.I</a> into a single
            development server running on a single port. No CORS configuration.
            No proxy setup. No separate dev servers. One{" "}
            <code>bun run dev</code> and you are running a full-stack Bun app.
          </p>

          <p className="bx-prose">
            The key word is <strong>bridge</strong>. BunnyX does not reinvent
            Elysia or BertUI — it connects them. Your backend is pure Elysia.
            Your frontend is pure React via BertUI. BunnyX just makes them live
            together without friction.
          </p>
        </section>

        {/* What it includes */}
        <section className="bx-section">
          <div className="bx-section__head">
            <span className="bx-eyebrow">What's inside</span>
            <h2 className="bx-h2">Everything BunnyX handles for you.</h2>
          </div>

          <div className="bx-feat-grid">
            <div className="bx-feat-card bx-feat-card--static">
              <span className="bx-feat-card__emoji">🔀</span>
              <strong>Single server bridge</strong>
              <span>Elysia + BertUI on one port</span>
            </div>
            <div className="bx-feat-card bx-feat-card--static">
              <span className="bx-feat-card__emoji">🧬</span>
              <strong>Auto type generation</strong>
              <span>Eden client generated on every dev start</span>
            </div>
            <div className="bx-feat-card bx-feat-card--static">
              <span className="bx-feat-card__emoji">📁</span>
              <strong>File-based routing</strong>
              <span>Pages from BertUI, API from Elysia</span>
            </div>
            <div className="bx-feat-card bx-feat-card--static">
              <span className="bx-feat-card__emoji">🔥</span>
              <strong>HMR</strong>
              <span>Hot module replacement out of the box</span>
            </div>
            <div className="bx-feat-card bx-feat-card--static">
              <span className="bx-feat-card__emoji">📖</span>
              <strong>OpenAPI</strong>
              <span>Scalar UI at /openapi automatically</span>
            </div>
            <div className="bx-feat-card bx-feat-card--static">
              <span className="bx-feat-card__emoji">🔒</span>
              <strong>End-to-end type safety</strong>
              <span>Powered by @elysiajs/eden</span>
            </div>
          </div>
        </section>

        {/* Stack */}
        <section className="bx-section">
          <div className="bx-section__head">
            <span className="bx-eyebrow">The stack</span>
            <h2 className="bx-h2">Three projects. One runtime.</h2>
          </div>

          <div className="bx-sponsor-grid">
            <div className="bx-sponsor-card">
              <span className="bx-sponsor-card__name">🏃 Bun</span>
              <p>
                The runtime everything runs on. Fast, TypeScript-native, ships
                with a bundler, test runner, and package manager built in.
              </p>
            </div>
            <div className="bx-sponsor-card">
              <span className="bx-sponsor-card__name">⚗️ Elysia</span>
              <p>
                The backend. Ergonomic, end-to-end type-safe HTTP framework
                built specifically for Bun. The best TypeScript backend
                experience available today.
              </p>
            </div>
            <div className="bx-sponsor-card">
              <span className="bx-sponsor-card__name">🐰 B.E.R.T.U.I</span>
              <p>
                The frontend. A React-based framework with file-based routing,
                server rendering, and HMR — built on Bun and designed to pair
                with Elysia.
              </p>
            </div>
          </div>
        </section>

        {/* Current state */}
        <section className="bx-section">
          <div className="bx-section__head">
            <span className="bx-eyebrow">Current state</span>
            <h2 className="bx-h2">Beta. Honest about it.</h2>
          </div>

          <p className="bx-prose">
            BunnyX is in active development. All standard Elysia HTTP features
            work — routing, validation, guards, hooks, middleware, OpenAPI.
            Features requiring persistent connections (WebSockets, SSE,
            streaming) are not yet bridged and are coming in future updates.
          </p>

          <p className="bx-prose">
            Windows support is untested. Vercel deployment is untested — deploy
            to Railway or Fly.io for now. The{" "}
            <code>@bunnyx/api</code> import alias has known IDE quirks; import
            directly from <code>../../bunnyx-api/api-client</code> if
            autocomplete breaks.
          </p>

          <div className="bx-note">
            <span className="bx-note__icon">💬</span>
            <p>
              Found a bug or want to contribute?{" "}
              <a
                href="https://github.com/BunElysiaReact/Bunnyx"
                className="bx-link"
              >
                Open an issue on GitHub →
              </a>
            </p>
          </div>
        </section>

        <div className="bx-mascot">
          <div className="bx-mascot__glow" />
          <img src="/BUNNY.jpg" alt="BunnyX mascot" />
        </div>
      </main>

      <footer className="bx-footer">
        <span>
          Made with love <Heart className="bx-icon bx-icon--heart" /> by the
          BunnyX team
        </span>
      </footer>
    </div>
  );
}