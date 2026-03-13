import { useState, useEffect } from "react";
import Nav from "../../components/Nav"
import "../styles/blog.css";

const TECH_LOGOS = [
  { src: "/logomain.svg",                                   alt: "BunnyX",   label: "BunnyX"      },
  { src: "https://elysiajs.com/assets/elysia.svg",          alt: "Elysia",   label: "Elysia.js"   },
  { src: "/b.svg",                                          alt: "BertUI",   label: "B.E.R.T.U.I" },
];

const CATEGORIES = ["All", "Release", "Update"];

export default function Blog() {
  const [posts, setPosts]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState("All");

  useEffect(() => {
    fetch("/api/posts")
      .then(r => r.json())
      .then(d => { setPosts(d.posts); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const visible = filter === "All" ? posts : posts.filter(p => p.category === filter);

  return (
    <div className="bx-root">
      <div className="bx-grain" aria-hidden="true" />
      <Nav />

      <main className="bx-main blog-main">

        {/* Hero */}
        <section className="blog-hero">
          <div className="bx-orb bx-orb--pink"  />
          <div className="bx-orb bx-orb--purple" />
          <div className="blog-hero__inner">
            <span className="bx-eyebrow">Latest news</span>
            <h1 className="bx-hero__title">
              <span className="bx-grad">The BunnyX Blog</span>
            </h1>
            <p className="bx-hero__tagline">
              Updates on BunnyX, Elysia.js, and B.E.R.T.U.I
            </p>

            {/* Tech logos */}
            <div className="blog-logos">
              {TECH_LOGOS.map(l => (
                <div key={l.alt} className="blog-logo-chip">
                  <img src={l.src} alt={l.alt} className="blog-logo-chip__img" />
                  <span>{l.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Filter tabs */}
        <div className="blog-filters">
          {CATEGORIES.map(c => (
            <button
              key={c}
              className={`blog-filter-btn${filter === c ? " blog-filter-btn--active" : ""}`}
              onClick={() => setFilter(c)}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Posts grid */}
        <section className="blog-grid-wrap">
          {loading ? (
            <div className="blog-loading">
              <span className="blog-loading__dot" />
              <span className="blog-loading__dot" />
              <span className="blog-loading__dot" />
            </div>
          ) : visible.length === 0 ? (
            <p className="bx-prose bx-prose--center">No posts yet.</p>
          ) : (
            <div className="blog-grid">
              {visible.map(post => (
                <a key={post.id} href={`/blog/${post.slug}`} className="blog-card">
                  <div className="blog-card__img-wrap">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="blog-card__img"
                    />
                    <span className="blog-card__category">{post.category}</span>
                  </div>
                  <div className="blog-card__body">
                    <h2 className="blog-card__title">{post.title}</h2>
                    <p className="blog-card__excerpt">{post.excerpt}</p>
                    <div className="blog-card__meta">
                      <span className="blog-card__author">By {post.author}</span>
                      <span className="blog-card__date">
                        {new Date(post.date).toLocaleDateString("en-US", {
                          year: "numeric", month: "short", day: "numeric"
                        })}
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </section>

      </main>

      <footer className="bx-footer">
        <span>BunnyX · Elysia.js · B.E.R.T.U.I — independent, open, yours.</span>
      </footer>
    </div>
  );
}