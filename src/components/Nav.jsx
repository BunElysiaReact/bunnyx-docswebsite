import { useState } from "react";
import { useTheme } from "./ThemeContext";
import "../styles/Nav.css";

const LINKS = [
  { to: "/",         label: "Home"          },
  { to: "/illust",   label: "Illustrations" },
  { to: "/docs",     label: "Docs"          },
  { to: "/playground", label: "live test"      },
  { to: "/blog",     label: "Blog"          },
  { to: "/about",    label: "About"         },
];

function NavLink({ to, className, children, onClick }) {
  const active = typeof window !== "undefined" && window.location.pathname === to;
  return (
    <a
      href={to}
      className={`${className}${active ? ` ${className}--active` : ""}`}
      onClick={onClick}
    >
      {children}
    </a>
  );
}

export default function Nav() {
  const { dark, toggle } = useTheme();
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const results = query.trim()
    ? LINKS.filter(l => l.label.toLowerCase().includes(query.toLowerCase()))
    : [];

  return (
    <nav className="bx-nav">

      {/* Brand */}
      <a href="/" className="bx-nav__brand">
        <img src="/logomain.svg" alt="" className="bx-nav__logo" />
        <span className="bx-nav__name">BunnyX</span>
      </a>

      {/* Desktop links */}
      <div className="bx-nav__links">
        {LINKS.map(l => (
          <NavLink key={l.to} to={l.to} className="bx-nav__link">
            {l.label}
          </NavLink>
        ))}
      </div>

      {/* Search */}
      <div className="bx-nav__search-wrap">
        <div className="bx-search">
          <span className="bx-search__icon">⌕</span>
          <input
            className="bx-search__input"
            type="text"
            placeholder="Search…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onBlur={() => setTimeout(() => setQuery(""), 150)}
          />
          {query && (
            <kbd className="bx-search__esc" onClick={() => setQuery("")}>✕</kbd>
          )}
        </div>
        {results.length > 0 && (
          <div className="bx-search__dropdown">
            {results.map(l => (
              <a
                key={l.to}
                href={l.to}
                className="bx-search__result"
                onClick={() => setQuery("")}
              >
                <span className="bx-search__result-icon">→</span>
                {l.label}
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Theme toggle */}
      <button className="bx-theme-btn" onClick={toggle} aria-label="Toggle theme">
        <span className="bx-theme-btn__icon">{dark ? "🌙" : "☀️"}</span>
        <span className="bx-theme-btn__label">{dark ? "Dark" : "Light"}</span>
      </button>

      {/* Mobile burger */}
      <button
        className="bx-nav__burger"
        onClick={() => setMenuOpen(o => !o)}
        aria-label="Menu"
      >
        <span /><span /><span />
      </button>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="bx-nav__drawer" onClick={() => setMenuOpen(false)}>
          {LINKS.map(l => (
            <NavLink key={l.to} to={l.to} className="bx-nav__drawer-link">
              {l.label}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
}