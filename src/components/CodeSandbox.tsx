import { useState, useRef, useCallback } from "react";
import { Play, X, Maximize2, Minimize2, RotateCcw, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CodeSandboxProps {
  code: string;
  language: "html" | "javascript" | "python";
  onClose: () => void;
}

const wrapJS = (js: string) => `<!DOCTYPE html>
<html><head><style>
  body { background: #0a0a0a; color: #00ff88; font-family: 'Courier New', monospace; padding: 16px; font-size: 14px; }
  .output { white-space: pre-wrap; word-break: break-all; }
  .error { color: #ff4444; }
</style></head><body>
<div class="output" id="out"></div>
<script>
  const _out = document.getElementById('out');
  const _log = (...a) => { _out.textContent += a.map(x => typeof x === 'object' ? JSON.stringify(x, null, 2) : String(x)).join(' ') + '\\n'; };
  console.log = _log; console.info = _log; console.warn = _log;
  console.error = (...a) => { const s = document.createElement('span'); s.className='error'; s.textContent = a.join(' ')+'\\n'; _out.appendChild(s); };
  try { ${js} } catch(e) { console.error('❌ ' + e.message); }
</script></body></html>`;

const wrapPython = (py: string) => `<!DOCTYPE html>
<html><head>
<script src="https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js"></script>
<style>
  body { background: #0a0a0a; color: #00ff88; font-family: 'Courier New', monospace; padding: 16px; font-size: 14px; }
  .output { white-space: pre-wrap; word-break: break-all; }
  .error { color: #ff4444; }
  .loading { color: #888; }
</style></head><body>
<div class="output" id="out"><span class="loading">🐍 Python wird geladen (Pyodide)...</span></div>
<script>
  async function main() {
    const out = document.getElementById('out');
    try {
      const pyodide = await loadPyodide();
      pyodide.runPython(\`
import sys, io
sys.stdout = io.StringIO()
sys.stderr = io.StringIO()
\`);
      pyodide.runPython(${JSON.stringify(py)});
      const stdout = pyodide.runPython('sys.stdout.getvalue()');
      const stderr = pyodide.runPython('sys.stderr.getvalue()');
      out.innerHTML = '';
      if (stdout) out.textContent += stdout;
      if (stderr) { const s = document.createElement('span'); s.className='error'; s.textContent = stderr; out.appendChild(s); }
      if (!stdout && !stderr) out.textContent = '✅ Code ausgeführt (keine Ausgabe)';
    } catch(e) {
      out.innerHTML = '<span class="error">❌ ' + e.message + '</span>';
    }
  }
  main();
</script></body></html>`;

const CodeSandbox = ({ code, language, onClose }: CodeSandboxProps) => {
  const [expanded, setExpanded] = useState(false);
  const [key, setKey] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const getSrcDoc = useCallback(() => {
    if (language === "html") return code;
    if (language === "python") return wrapPython(code);
    return wrapJS(code);
  }, [code, language]);

  const langLabel = language === "python" ? "🐍 Python" : language === "html" ? "🌐 HTML" : "⚡ JavaScript";

  return (
    <div className={`border border-neon/50 rounded-lg overflow-hidden bg-tech ${expanded ? "fixed inset-4 z-50" : ""}`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between bg-secondary/80 border-b border-neon/30 px-3 py-1.5">
        <div className="flex items-center gap-2">
          <Code2 className="h-3.5 w-3.5 text-neon" />
          <span className="text-[11px] font-mono text-neon">{langLabel} Sandbox</span>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-neon" onClick={() => setKey(k => k + 1)} title="Neu ausführen">
            <RotateCcw className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-neon" onClick={() => setExpanded(e => !e)} title={expanded ? "Verkleinern" : "Vergrößern"}>
            {expanded ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={onClose} title="Schließen">
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* iframe */}
      <iframe
        key={key}
        ref={iframeRef}
        sandbox="allow-scripts allow-modals"
        srcDoc={getSrcDoc()}
        className={`w-full bg-black ${expanded ? "flex-1 h-[calc(100%-36px)]" : "h-48 md:h-64"}`}
        title="Code Sandbox"
      />
    </div>
  );
};

export default CodeSandbox;
