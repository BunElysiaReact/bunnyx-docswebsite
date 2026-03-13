import { useState, useEffect, useRef } from "react";

/* ── default code ── */
const DEFAULT_CODE = `import { Elysia } from 'elysia'

const app = new Elysia({ aot: false })
  .get('/', () => ({ message: 'Hello from BunnyX!' }))
  .get('/user/:id', ({ params }) => ({
    id: params.id,
    name: 'User ' + params.id
  }))
  .post('/echo', ({ body }) => ({ received: body }))
`;

/* ── test cases ── */
const TESTCASES = [
  { label: "GET /",        method: "GET",  url: "/" },
  { label: "GET /user/42", method: "GET",  url: "/user/42" },
  { label: "POST /echo",   method: "POST", url: "/echo", body: { hello: "world" } },
];

/* ── run elysia code in browser ── */
async function runCode(code, method, url, body) {
  try {
    const transformed = code
      .replace(
        /import\s+\{([^}]+)\}\s+from\s+['"]elysia['"]/g,
        `const {$1} = await import('https://esm.sh/elysia@1.1.27?target=es2022');`
      )
      .replace(
        /import\s+\{([^}]+)\}\s+from\s+['"]@elysiajs\/cors['"]/g,
        `const {$1} = await import('https://esm.sh/@elysiajs/cors@1.1.1?target=es2022');`
      )
      // disable AOT — it crashes in browser (checksum error)
      .replace(/new\s+Elysia\s*\(\s*\)/g, `new Elysia({ aot: false })`)
      .replace(/new\s+Elysia\s*\(\s*\{/g, `new Elysia({ aot: false,`)
      // strip any existing default export so we don't get duplicate
      .replace(/export\s+default\s+\w+\s*;?\s*$/m, '')
      + `\nexport default typeof app !== 'undefined' ? app : null;`;

    const mod = await import(
      /* @vite-ignore */
      `data:text/javascript;charset=utf-8,${encodeURIComponent(transformed)}`
    );

    const elysiaApp = mod.default;
    if (!elysiaApp || !elysiaApp.handle) {
      return { error: "No app found. Make sure you export it or name it 'app'." };
    }

    const reqInit = { method, headers: { "Content-Type": "application/json" } };
    if (body && method !== "GET") reqInit.body = JSON.stringify(body);

    const response = await elysiaApp.handle(
      new Request(`http://localhost${url}`, reqInit)
    );

    const text = await response.text();
    let parsed;
    try { parsed = JSON.parse(text); } catch { parsed = text; }

    return {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      body: parsed,
    };
  } catch (e) {
    return { error: e.message || String(e) };
  }
}

/* ── Monaco loader hook ── */
function useMonaco(containerRef, initialCode, onChange) {
  const editorRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || editorRef.current) return;

    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs/loader.min.js";
    script.onload = () => {
      window.require.config({
        paths: { vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs" }
      });
      window.require(["vs/editor/editor.main"], () => {
        window.monaco.editor.defineTheme("bunnyx-dark", {
          base: "vs-dark",
          inherit: true,
          rules: [
            { token: "comment",  foreground: "5a6474", fontStyle: "italic" },
            { token: "keyword",  foreground: "ff7eb6" },
            { token: "string",   foreground: "a8ff78" },
            { token: "number",   foreground: "ffcb6b" },
            { token: "type",     foreground: "c084fc" },
            { token: "variable", foreground: "e2e8f0" },
          ],
          colors: {
            "editor.background":            "#0a0a0a",
            "editor.foreground":            "#e2e8f0",
            "editorLineNumber.foreground":  "#2a2a2a",
            "editorLineNumber.activeForeground": "#444",
            "editor.selectionBackground":   "#2d3748",
            "editor.lineHighlightBackground":"#111111",
            "editorCursor.foreground":      "#ff7eb6",
            "editor.inactiveSelectionBackground": "#1a1a1a",
            "editorIndentGuide.background": "#1a1a1a",
          },
        });

        editorRef.current = window.monaco.editor.create(containerRef.current, {
          value: initialCode,
          language: "typescript",
          theme: "bunnyx-dark",
          fontSize: 13,
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          lineNumbers: "on",
          wordWrap: "on",
          automaticLayout: true,
          padding: { top: 20, bottom: 20 },
          renderLineHighlight: "line",
          smoothScrolling: true,
          cursorBlinking: "smooth",
          cursorSmoothCaretAnimation: true,
        });

        editorRef.current.onDidChangeModelContent(() => {
          onChange(editorRef.current.getValue());
        });
      });
    };
    document.head.appendChild(script);

    return () => {
      editorRef.current?.dispose();
      editorRef.current = null;
    };
  }, []);
}

/* ── draggable mascot ── */
function Mascot({ initialX = 60, initialY = 360 }) {
  const [pos, setPos]       = useState({ x: initialX, y: initialY });
  const [mode, setMode]     = useState("still");   // still | walking | sitting
  const [flipX, setFlipX]   = useState(false);
  const [frame, setFrame]   = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const offset    = useRef({ x: 0, y: 0 });
  const lastX     = useRef(initialX);
  const timers    = useRef([]);
  const walkTimer = useRef(null);
  const frameInt  = useRef(null);

  function clearAll() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    if (walkTimer.current) clearInterval(walkTimer.current);
    if (frameInt.current)  clearInterval(frameInt.current);
  }

  function schedule(fn, ms) {
    const id = setTimeout(fn, ms);
    timers.current.push(id);
    return id;
  }

  function startWalk() {
    if (isDragging) return;
    setMode("walking");
    if (frameInt.current) clearInterval(frameInt.current);
    frameInt.current = setInterval(() => setFrame(f => (f + 1) % 4), 140);

    walkTimer.current = setInterval(() => {
      setPos(prev => {
        const dir = flipX ? -1 : 1;
        let nx = prev.x + 1.2 * dir;
        const vw = window.innerWidth;
        if (nx < 0 || nx > vw - 80) {
          setFlipX(f => !f);
          nx = Math.max(0, Math.min(vw - 80, nx));
        }
        return { ...prev, x: nx };
      });
    }, 16);

    schedule(() => {
      clearInterval(walkTimer.current);
      clearInterval(frameInt.current);
      setMode("still");
      schedule(() => { if (!isDragging) setMode("sitting"); }, 1500);
      schedule(startWalk, 3500 + Math.random() * 2000);
    }, 2500 + Math.random() * 2000);
  }

  useEffect(() => {
    const id = schedule(startWalk, 2000);
    return () => { clearAll(); };
  }, []);

  const handleDown = e => {
    e.preventDefault();
    setIsDragging(true);
    clearAll();
    setMode("walking");
    if (frameInt.current) clearInterval(frameInt.current);
    frameInt.current = setInterval(() => setFrame(f => (f + 1) % 4), 80);
    const cx = e.touches ? e.touches[0].clientX : e.clientX;
    const cy = e.touches ? e.touches[0].clientY : e.clientY;
    offset.current  = { x: cx - pos.x, y: cy - pos.y };
    lastX.current   = cx;
  };

  useEffect(() => {
    const move = e => {
      if (!isDragging) return;
      e.preventDefault();
      const cx = e.touches ? e.touches[0].clientX : e.clientX;
      const cy = e.touches ? e.touches[0].clientY : e.clientY;
      if (Math.abs(cx - lastX.current) > 1) setFlipX(cx < lastX.current);
      lastX.current = cx;
      setPos({ x: cx - offset.current.x, y: cy - offset.current.y });
    };
    const up = () => {
      if (!isDragging) return;
      clearInterval(frameInt.current);
      setIsDragging(false);
      setMode("still");
      schedule(() => setMode("sitting"), 2000);
      schedule(startWalk, 4000);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup",   up);
    window.addEventListener("touchmove", move, { passive: false });
    window.addEventListener("touchend",  up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup",   up);
      window.removeEventListener("touchmove", move);
      window.removeEventListener("touchend",  up);
    };
  }, [isDragging]);

  /* ── SVG bunny frames ── */
  const PINK  = "#ff7eb6";
  const PPINK = "#c084fc";
  const BODY  = "#f1d6e8";
  const EAR   = "#e8a8c8";
  const NOSE  = "#ff9ec6";

  /* Simple pixel-art style bunny via SVG */
  const bobY = mode === "still" ? Math.sin(Date.now() / 600) * 3 : 0;

  function BunnySVG({ walking, frame: f, sit }) {
    // ears bob when walking
    const earL = walking ? (f % 2 === 0 ? -8 : -6) : sit ? -4 : -10;
    const earR = walking ? (f % 2 === 0 ? -6 : -8) : sit ? -4 : -10;
    // body squish
    const scaleY = walking && f % 2 === 0 ? 0.95 : 1;

    return (
      <svg width="64" height="80" viewBox="0 0 64 80" style={{ overflow: "visible" }}>
        {/* left ear */}
        <ellipse cx="22" cy={earL + 18} rx="6" ry="14" fill={BODY} />
        <ellipse cx="22" cy={earL + 20} rx="3.5" ry="10" fill={EAR} />
        {/* right ear */}
        <ellipse cx="42" cy={earR + 18} rx="6" ry="14" fill={BODY} />
        <ellipse cx="42" cy={earR + 20} rx="3.5" ry="10" fill={EAR} />
        {/* body */}
        <ellipse cx="32" cy={sit ? 58 : 55} rx={sit ? 18 : 16} ry={sit ? 16 : 18} fill={BODY} style={{ transform: `scaleY(${scaleY})`, transformOrigin: "32px 55px" }} />
        {/* head */}
        <circle cx="32" cy="38" r="16" fill={BODY} />
        {/* eyes */}
        <circle cx="26" cy="36" r="2.5" fill="#1a0a12" />
        <circle cx="38" cy="36" r="2.5" fill="#1a0a12" />
        <circle cx="27" cy="35" r="1" fill="white" />
        <circle cx="39" cy="35" r="1" fill="white" />
        {/* blush */}
        <ellipse cx="23" cy="40" rx="3.5" ry="2" fill={PINK} opacity="0.5" />
        <ellipse cx="41" cy="40" rx="3.5" ry="2" fill={PINK} opacity="0.5" />
        {/* nose */}
        <ellipse cx="32" cy="41" rx="2" ry="1.5" fill={NOSE} />
        {/* mouth */}
        <path d="M30 43 Q32 45 34 43" fill="none" stroke="#c87a9a" strokeWidth="1" strokeLinecap="round" />
        {/* tail */}
        {!sit && <circle cx={48} cy={62} r={5} fill="white" opacity="0.9" />}
        {/* front paws */}
        {walking ? (
          <>
            <ellipse cx={f % 2 === 0 ? 22 : 24} cy="72" rx="5" ry="4" fill={BODY} />
            <ellipse cx={f % 2 === 0 ? 42 : 40} cy="72" rx="5" ry="4" fill={BODY} />
          </>
        ) : sit ? (
          <>
            <ellipse cx="24" cy="70" rx="6" ry="4" fill={BODY} />
            <ellipse cx="40" cy="70" rx="6" ry="4" fill={BODY} />
          </>
        ) : (
          <>
            <ellipse cx="22" cy="70" rx="5" ry="4" fill={BODY} />
            <ellipse cx="42" cy="70" rx="5" ry="4" fill={BODY} />
          </>
        )}
        {/* scarf / gradient accent */}
        <path d="M18 46 Q32 50 46 46" fill="none" stroke={PINK} strokeWidth="3" strokeLinecap="round" opacity="0.7" />
        <path d="M18 46 Q32 50 46 46" fill="none" stroke={PPINK} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      </svg>
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        left: pos.x,
        top:  pos.y,
        zIndex: 9999,
        cursor: isDragging ? "grabbing" : "grab",
        userSelect: "none",
        WebkitUserSelect: "none",
        touchAction: "none",
        filter: "drop-shadow(0 8px 18px rgba(255,126,182,0.25))",
        transform: `scaleX(${flipX ? -1 : 1})`,
        transition: isDragging ? "none" : "top 0.05s linear",
      }}
      onMouseDown={handleDown}
      onTouchStart={handleDown}
    >
      <BunnySVG
        walking={mode === "walking" || isDragging}
        frame={frame}
        sit={mode === "sitting"}
      />
    </div>
  );
}

/* ── JSON color highlighter ── */
function PrettyJSON({ data, color = "#a8ff78" }) {
  if (typeof data === "string") return <span style={{ color }}>{data}</span>;
  const json = JSON.stringify(data, null, 2);
  const highlighted = json
    .replace(/(".*?")\s*:/g, '<span style="color:#c084fc">$1</span>:')
    .replace(/:\s*(".*?")/g, ': <span style="color:#a8ff78">$1</span>')
    .replace(/:\s*(\d+\.?\d*)/g, ': <span style="color:#ffcb6b">$1</span>')
    .replace(/:\s*(true|false|null)/g, ': <span style="color:#ff7eb6">$1</span>');
  return <pre style={{ margin: 0, color: "#e2e8f0" }} dangerouslySetInnerHTML={{ __html: highlighted }} />;
}

/* ── main playground ── */
export default function BunnyxPlayground() {
  const [code, setCode]         = useState(DEFAULT_CODE);
  const [result, setResult]     = useState(null);
  const [loading, setLoading]   = useState(false);
  const [activeTest, setActiveTest] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const editorRef               = useRef(null);

  useMonaco(editorRef, DEFAULT_CODE, setCode);

  async function run() {
    setLoading(true);
    setResult(null);
    const tc = TESTCASES[activeTest];
    const res = await runCode(code, tc.method, tc.url, tc.body);
    setResult(res);
    setLoading(false);
  }

  const statusColor =
    !result?.status    ? "#e2e8f0" :
    result.status < 300 ? "#a8ff78" :
    result.status < 400 ? "#ffcb6b" :
    "#ff5f5f";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }

        .pg-root {
          height: 100vh;
          background: #060606;
          color: #e2e8f0;
          font-family: system-ui, -apple-system, sans-serif;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        /* ── nav ── */
        .pg-nav, .pg-toolbar, .pg-panels, .pg-footer {
          position: relative;
          z-index: 1;
        }

        .pg-nav {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0 20px;
          height: 52px;
          background: #0a0a0a;
          border-bottom: 1px solid #1a1a1a;
          flex-shrink: 0;
        }
        .pg-nav-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 15px;
          font-weight: 600;
          letter-spacing: -0.02em;
          color: #e2e8f0;
          text-decoration: none;
        }
        .pg-nav-logo-icon {
          width: 26px;
          height: 26px;
          border-radius: 8px;
          background: linear-gradient(135deg, #ff7eb6 0%, #c084fc 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
        }
        .pg-nav-divider {
          width: 1px;
          height: 20px;
          background: #222;
        }
        .pg-nav-links {
          display: flex;
          align-items: center;
          gap: 2px;
        }
        .pg-nav-link {
          font-size: 13px;
          color: #555;
          padding: 4px 10px;
          border-radius: 6px;
          cursor: pointer;
          transition: color 0.15s, background 0.15s;
          text-decoration: none;
        }
        .pg-nav-link:hover, .pg-nav-link.active {
          color: #e2e8f0;
          background: #111;
        }
        .pg-nav-link.active { color: #ff7eb6; }
        .pg-nav-spacer { flex: 1; }
        .pg-nav-badge {
          font-size: 11px;
          padding: 3px 9px;
          border-radius: 99px;
          border: 1px solid #ff7eb630;
          color: #ff7eb6;
          background: #1a0d13;
          font-family: 'JetBrains Mono', monospace;
        }

        /* ── toolbar ── */
        .pg-toolbar {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 20px;
          background: #0a0a0a;
          border-bottom: 1px solid #141414;
          flex-shrink: 0;
        }
        .pg-toolbar-label {
          font-size: 12px;
          font-weight: 500;
          color: #ff7eb6;
          letter-spacing: 0.04em;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .pg-toolbar-label::before {
          content: '';
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ff7eb6, #c084fc);
          flex-shrink: 0;
        }
        .pg-testcases {
          display: flex;
          gap: 4px;
          margin-left: 8px;
        }
        .pg-tc-btn {
          font-size: 11px;
          font-family: 'JetBrains Mono', monospace;
          padding: 4px 12px;
          border-radius: 6px;
          border: 1px solid #1e1e1e;
          background: #0d0d0d;
          color: #666;
          cursor: pointer;
          transition: all 0.15s;
          letter-spacing: 0.02em;
        }
        .pg-tc-btn:hover { border-color: #ff7eb630; color: #bbb; background: #111; }
        .pg-tc-btn.active {
          border-color: #ff7eb650;
          color: #ff7eb6;
          background: #160910;
        }
        .pg-run-btn {
          margin-left: auto;
          font-size: 12px;
          font-weight: 600;
          padding: 7px 18px;
          border-radius: 8px;
          border: none;
          background: linear-gradient(135deg, #ff7eb6 0%, #c084fc 100%);
          color: #0a0008;
          cursor: pointer;
          letter-spacing: 0.05em;
          transition: opacity 0.15s, transform 0.1s, box-shadow 0.2s;
          box-shadow: 0 0 20px rgba(255,126,182,0.2);
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .pg-run-btn:hover { opacity: 0.9; box-shadow: 0 0 28px rgba(255,126,182,0.35); }
        .pg-run-btn:active { transform: scale(0.97); }
        .pg-run-btn:disabled { opacity: 0.35; cursor: not-allowed; box-shadow: none; }

        /* ── panels ── */
        .pg-panels {
          display: grid;
          grid-template-columns: 1fr 1fr;
          flex: 1;
          overflow: hidden;
          min-height: 0;
        }
        .pg-editor-panel {
          display: flex;
          flex-direction: column;
          border-right: 1px solid #141414;
          overflow: hidden;
          min-height: 0;
        }
        .pg-panel-header {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #333;
          padding: 8px 16px;
          border-bottom: 1px solid #111;
          background: #080808;
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }
        .pg-panel-header span.file {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: #444;
          font-weight: 400;
          letter-spacing: 0.02em;
          margin-left: auto;
        }
        .pg-monaco { flex: 1; overflow: hidden; min-height: 0; }
        .pg-result-panel {
          display: flex;
          flex-direction: column;
          overflow: hidden;
          min-height: 0;
        }
        .pg-result-body {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
          font-family: 'JetBrains Mono', monospace;
          font-size: 12.5px;
          min-height: 0;
        }
        .pg-result-body::-webkit-scrollbar { width: 4px; }
        .pg-result-body::-webkit-scrollbar-track { background: transparent; }
        .pg-result-body::-webkit-scrollbar-thumb { background: #222; border-radius: 4px; }

        /* empty state */
        .pg-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          gap: 10px;
          color: #222;
        }
        .pg-empty-bunny { font-size: 36px; }
        .pg-empty-text { font-size: 12px; letter-spacing: 0.08em; font-family: 'JetBrains Mono', monospace; }

        /* loading */
        .pg-loading {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #444;
          animation: fadeIn 0.2s ease;
        }
        .pg-spinner {
          width: 14px;
          height: 14px;
          border: 2px solid #1e1e1e;
          border-top-color: #ff7eb6;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        /* result display */
        .pg-status-row {
          display: flex;
          align-items: baseline;
          gap: 10px;
          margin-bottom: 18px;
          animation: fadeIn 0.2s ease;
        }
        .pg-status-code {
          font-size: 28px;
          font-weight: 700;
          line-height: 1;
        }
        .pg-status-text { font-size: 11px; color: #444; }
        .pg-section-label {
          font-size: 9px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #333;
          margin-bottom: 6px;
          margin-top: 16px;
        }
        .pg-json {
          background: #0a0a0a;
          border: 1px solid #161616;
          border-radius: 8px;
          padding: 14px;
          font-size: 12px;
          line-height: 1.65;
          overflow-x: auto;
          animation: fadeIn 0.3s ease;
        }
        .pg-json::-webkit-scrollbar { height: 4px; }
        .pg-json::-webkit-scrollbar-thumb { background: #222; border-radius: 4px; }
        .pg-error {
          background: #100808;
          border: 1px solid #ff5f5f20;
          border-radius: 8px;
          padding: 14px;
          color: #ff5f5f;
          font-size: 12px;
          line-height: 1.6;
          white-space: pre-wrap;
          animation: fadeIn 0.2s ease;
        }

        /* hint */
        .pg-hint-btn {
          margin-top: 22px;
          font-size: 11px;
          font-family: 'JetBrains Mono', monospace;
          padding: 5px 12px;
          border-radius: 6px;
          border: 1px solid #1a1a1a;
          background: transparent;
          color: #444;
          cursor: pointer;
          transition: all 0.15s;
        }
        .pg-hint-btn:hover { border-color: #ff7eb630; color: #888; }
        .pg-hint-box {
          margin-top: 10px;
          background: #0a0a0a;
          border: 1px solid #ff7eb615;
          border-radius: 8px;
          padding: 14px;
          font-size: 12px;
          color: #666;
          line-height: 1.7;
          animation: fadeIn 0.2s ease;
        }
        .pg-hint-box code {
          color: #ff7eb6;
          background: #160910;
          padding: 1px 5px;
          border-radius: 4px;
        }

        /* footer */
        .pg-footer {
          padding: 8px 20px;
          border-top: 1px solid #111;
          background: #080808;
          font-size: 10.5px;
          color: #2a2a2a;
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
          font-family: 'JetBrains Mono', monospace;
        }
        .pg-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #a8ff78;
          box-shadow: 0 0 6px #a8ff78;
          animation: pulse 2s ease-in-out infinite;
        }
      `}</style>

      <div className="pg-root" style={{ position: "relative" }}>
        {/* background mascot */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "url('/elysia-chan-rev-2.webp')", backgroundSize: "1040px", backgroundPosition: "top 0 right -200px", backgroundRepeat: "no-repeat", opacity: 0.06, pointerEvents: "none", zIndex: 0 }} />
        {/* nav */}
        <nav className="pg-nav">
          <a className="pg-nav-logo" href="#">
            <div className="pg-nav-logo-icon">🐰</div>
            BunnyX
          </a>
          <div className="pg-nav-divider" />
          <div className="pg-nav-links">
            <a className="pg-nav-link active" href="#">Playground</a>
            <a className="pg-nav-link" href="#">Docs</a>
            <a className="pg-nav-link" href="#">Examples</a>
          </div>
          <div className="pg-nav-spacer" />
          <span className="pg-nav-badge">Elysia in browser</span>
        </nav>

        {/* toolbar */}
        <div className="pg-toolbar">
          <span className="pg-toolbar-label">BunnyX Playground</span>

          <div className="pg-testcases">
            {TESTCASES.map((tc, i) => (
              <button
                key={i}
                className={`pg-tc-btn${activeTest === i ? " active" : ""}`}
                onClick={() => setActiveTest(i)}
              >
                {tc.label}
              </button>
            ))}
          </div>

          <button className="pg-run-btn" onClick={run} disabled={loading}>
            {loading ? (
              <><div className="pg-spinner" /> Running…</>
            ) : (
              <>▶ Run</>
            )}
          </button>
        </div>

        {/* panels */}
        <div className="pg-panels">
          {/* editor */}
          <div className="pg-editor-panel">
            <div className="pg-panel-header">
              Editor
              <span className="file">src/index.ts</span>
            </div>
            <div className="pg-monaco" ref={editorRef} />
          </div>

          {/* result */}
          <div className="pg-result-panel">
            <div className="pg-panel-header">Response</div>
            <div className="pg-result-body">
              {loading && (
                <div className="pg-loading">
                  <div className="pg-spinner" />
                  Running Elysia in browser…
                </div>
              )}

              {!loading && !result && (
                <div className="pg-empty">
                  <span className="pg-empty-bunny">🐰</span>
                  <span className="pg-empty-text">Hit ▶ Run to execute</span>
                </div>
              )}

              {!loading && result && !result.error && (
                <>
                  <div className="pg-status-row">
                    <span className="pg-status-code" style={{ color: statusColor }}>
                      {result.status}
                    </span>
                    <span className="pg-status-text">{result.statusText}</span>
                  </div>

                  <div className="pg-section-label">Body</div>
                  <div className="pg-json">
                    <PrettyJSON data={result.body} />
                  </div>

                  <div className="pg-section-label">Headers</div>
                  <div className="pg-json">
                    <PrettyJSON data={result.headers} color="#c084fc" />
                  </div>
                </>
              )}

              {!loading && result?.error && (
                <div className="pg-error">⚠ {result.error}</div>
              )}

              <button
                className="pg-hint-btn"
                onClick={() => setShowHint(v => !v)}
              >
                {showHint ? "Hide hint" : "Show hint"}
              </button>

              {showHint && (
                <div className="pg-hint-box">
                  <strong style={{ color: "#ff7eb6" }}>Hint:</strong> Make sure
                  your app is named <code>app</code> and not wrapped in a
                  function. BunnyX Playground looks for a top-level{" "}
                  <code>const app = new Elysia()</code> — no{" "}
                  <code>.listen()</code> needed in browser mode.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* footer */}
        <div className="pg-footer">
          <div className="pg-dot" />
          Elysia runs directly in your browser via Web Standards — no server involved.
        </div>
      </div>

      {/* draggable mascot */}
      <Mascot initialX={48} initialY={340} />
    </>
  );
}