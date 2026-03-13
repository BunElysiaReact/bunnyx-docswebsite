/* ═══════════════════════════════════════════════════
   ThemeContext.jsx
   Shared dark mode state — import this in _app or
   your root layout, then use useTheme() anywhere.
   ═══════════════════════════════════════════════════ */
import { createContext, useContext, useState, useEffect } from "react";

const ThemeCtx = createContext({ dark: false, toggle: () => {} });

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(false);

  // On mount: read localStorage or system preference
  useEffect(() => {
    const saved = localStorage.getItem("bx-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = saved ? saved === "dark" : prefersDark;
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  function toggle() {
    setDark(prev => {
      const next = !prev;
      document.documentElement.classList.toggle("dark", next);
      localStorage.setItem("bx-theme", next ? "dark" : "light");
      return next;
    });
  }

 return (
  <ThemeCtx.Provider value={{ dark, toggle }}>
    <div suppressHydrationWarning>
      {children}
    </div>
  </ThemeCtx.Provider>
);
}

export function useTheme() {
  return useContext(ThemeCtx);
}