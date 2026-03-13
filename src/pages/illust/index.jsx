import { InlineCode } from "bertui-code";
import { Smile } from "bertui-icons";
import "./styles/illustrate.css";

export default function Illustrate() {
  return (
    <div className="bx-root">
      <div className="bx-grain" aria-hidden="true" />

      <main className="bx-main bx-main--page">

        {/* ── Header ── */}
        <section className="ill-hero">
          <div className="bx-orb bx-orb--pink" />
          <div className="bx-orb bx-orb--purple" />
          <div className="ill-hero__inner">
            <span className="bx-eyebrow">Behind the brand</span>
            <h1 className="bx-hero__title">
              <span className="bx-grad">BunnyX Illustrations</span>
            </h1>
          </div>
        </section>

        {/* ── Origin story ── */}
        <section className="bx-section">
          <div className="bx-section__head">
            <span className="bx-eyebrow">Origin</span>
            <h2 className="bx-h2">How the name was born</h2>
          </div>

          <p className="bx-prose">
            BunnyX's original name was simply "Bunny" — as in the rabbit — but npm's
            naming rules made publishing under that name impossible. Not wanting to
            scope it under{" "}
            <InlineCode>@peaseernest</InlineCode>, I thought about it and landed on
            adding an <strong>X</strong> — because BunnyX essentially merges two
            frameworks into one. That is how BunnyX was born. The X is capitalised
            because it is not really part of the original name, but it should exist.{" "}
            <Smile className="bx-icon" />
          </p>

          <p className="bx-prose">
            The BunnyX logo is a bunny — it took Elysia's simplicity and joy and
            merged it with BertUI's speed to make one tiny, powerful rabbit.
          </p>

          <div className="ill-logo-pair">
            <figure className="ill-img-card">
              <img src="/logomain.svg" alt="BunnyX logo" />
              <figcaption>BunnyX logo</figcaption>
            </figure>
            <figure className="ill-img-card">
              <img src="/BUNNY.jpg" alt="BunnyX mascot" />
              <figcaption>BunnyX mascot</figcaption>
            </figure>
          </div>
        </section>

        {/* ── Elysia ── */}
        <section className="bx-section">
          <div className="bx-section__head">
            <span className="bx-eyebrow">Accompanying libs</span>
            <h2 className="bx-h2">Elysia.js</h2>
          </div>

          <div className="bx-card bx-card--highlight">
            <div className="bx-card__emoji">🦊</div>
            <p className="bx-prose" style={{ margin: 0 }}>
              According to SaltyAOM: "Elysia-chan is the mascot of ElysiaJS. An arctic
              fox girl — elegant and charming yet playful and a bit cheeky at times.
              We want to make Elysia-chan come to life not only as code but as a lovely
              character that everyone can relate to."
            </p>
          </div>

          <p className="bx-prose">
            Their logo is a fox, but the mascot is Elysia-chan.
          </p>

          <div className="ill-elysia-pair">
            <figure className="ill-img-card ill-img-card--tall">
              <img 
                src="https://elysiajs.com/assets/cover.webp" 
                alt="Elysia-chan mascot"
                loading="lazy"
              />
              <figcaption>Elysia-chan — mascot</figcaption>
            </figure>
            <figure className="ill-img-card ill-img-card--logo">
              <img 
                src="https://elysiajs.com/assets/elysia.svg" 
                alt="Elysia.js logo"
                loading="lazy"
              />
              <figcaption>Elysia.js — logo</figcaption>
            </figure>
          </div>
        </section>

        {/* ── BertUI ── */}
        <section className="bx-section">
          <div className="bx-section__head">
            <span className="bx-eyebrow">Accompanying libs</span>
            <h2 className="bx-h2">B.E.R.T.U.I</h2>
          </div>

          <p className="bx-prose">
            Named according to its stakeholders:{" "}
            <strong>B</strong>un <strong>E</strong>lysia <strong>R</strong>eact{" "}
            <strong>T</strong>emplate <strong>U</strong>ser <strong>I</strong>nterface.
          </p>

          <p className="bx-prose">
            Started late 2025 and stable as of January 2026. BertUI aims to provide
            better SEO, zero config, fast HMR, and fast builds in the UI development
            world — lightweight and easy to use.
          </p>

          <p className="bx-prose">
            BertUI's logo is essentially a tiger's face, showcasing its niche power
            and raw speed.
          </p>

          <figure className="ill-img-card ill-img-card--bertui">
            <img src="/b.svg" alt="BertUI logo" />
            <figcaption>BertUI — logo</figcaption>
          </figure>
        </section>

        {/* ── Additional images ── */}
        <section className="bx-section">
          <div className="bx-section__head">
            <span className="bx-eyebrow">Gallery</span>
            <h2 className="bx-h2">Additional images</h2>
          </div>

          <div className="ill-gallery">
            <figure className="ill-img-card">
              <img 
                src="https://elysiajs.com/assets/elysia_chan.webp" 
                alt="Elysia-chan"
                loading="lazy"
              />
            </figure>
            <figure className="ill-img-card">
              <img 
                src="https://elysiajs.com/assets/elysia-chan-card.webp" 
                alt="Elysia-chan card"
                loading="lazy"
              />
            </figure>
            <figure className="ill-img-card">
              <img 
                src="https://elysiajs.com/assets/elysia-chan-rev-2.webp" 
                alt="Elysia-chan revision 2"
                loading="lazy"
              />
            </figure>
            <figure className="ill-img-card">
              <img 
                src="https://elysiajs.com/blog/elysia-14/elysia-supersymmetry.webp" 
                alt="Elysia supersymmetry"
                loading="lazy"
              />
            </figure>
            <figure className="ill-img-card">
              <img src="/favicon.svg" alt="BunnyX favicon" />
            </figure>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="bx-section ill-cta-section">
          <p className="bx-prose bx-prose--center" style={{ fontSize: "1.1rem" }}>
            Now let's start learning about BunnyX.
          </p>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <a href="/docs" className="bx-btn bx-btn--primary">Start learning →</a>
          </div>
        </section>

      </main>

      <footer className="bx-footer">
        <span>BunnyX · Elysia.js · B.E.R.T.U.I — independent, open, yours.</span>
      </footer>
    </div>
  );
}