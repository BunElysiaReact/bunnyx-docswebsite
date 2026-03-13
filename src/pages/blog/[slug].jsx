import { useState, useEffect } from "react";
import Nav from "../../components/Nav";
import "../../styles/blog.css";

export default function BlogPost() {
  // BertUI file-based routing exposes params via window location
  const slug = typeof window !== "undefined"
    ? window.location.pathname.split("/blog/")[1]?.replace(/\/$/, "")
    : "";

  const [post, setPost]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/posts/${slug}`)
      .then(r => r.json())
      .then(d => {
        if (!d.post || d.post.title === "Not found") {
          setNotFound(true);
        } else {
          setPost(d.post);
        }
        setLoading(false);
      })
      .catch(() => { setNotFound(true); setLoading(false); });
  }, [slug]);

  return (
    <div className="bx-root">
      <div className="bx-grain" aria-hidden="true" />
      <Nav />

      <main className="bx-main blog-main">
        {loading ? (
          <div className="blog-loading" style={{ marginTop: "8rem" }}>
            <span className="blog-loading__dot" />
            <span className="blog-loading__dot" />
            <span className="blog-loading__dot" />
          </div>
        ) : notFound ? (
          <section className="bx-section" style={{ alignItems: "center", marginTop: "6rem" }}>
            <h1 className="bx-h2">Post not found</h1>
            <a href="/blog" className="bx-btn bx-btn--primary">← Back to blog</a>
          </section>
        ) : (
          <article className="blog-post">

            {/* Back */}
            <a href="/blog" className="blog-post__back">← All posts</a>

            {/* Header */}
            <header className="blog-post__header">
              {post.image && (
                <div className="blog-post__hero-img-wrap">
                  <img src={post.image} alt={post.title} className="blog-post__hero-img" />
                </div>
              )}
              <div className="blog-post__meta-top">
                {post.category && (
                  <span className="blog-card__category blog-card__category--inline">
                    {post.category}
                  </span>
                )}
                <span className="blog-card__date">
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric", month: "long", day: "numeric"
                  })}
                </span>
              </div>
              <h1 className="blog-post__title">{post.title}</h1>
              <p className="blog-post__author">By <strong>{post.author}</strong></p>
            </header>

            {/* Content */}
            <div className="blog-post__content">
              <p className="bx-prose">{post.content}</p>
            </div>

            {/* Footer nav */}
            <div className="blog-post__footer">
              <a href="/blog" className="bx-btn bx-btn--ghost">← Back to blog</a>
            </div>
          </article>
        )}
      </main>

      <footer className="bx-footer">
        <span>BunnyX · Elysia.js · B.E.R.T.U.I — independent, open, yours.</span>
      </footer>
    </div>
  );
}