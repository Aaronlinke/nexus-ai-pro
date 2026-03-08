import { useState, useMemo } from "react";
import { Play, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import CodeSandbox from "./CodeSandbox";

interface ChatMessageProps {
  type: "user" | "bot" | "system";
  content: string;
  isLoading?: boolean;
}

interface CodeBlock {
  language: "html" | "javascript" | "python";
  code: string;
  raw: string;
}

const detectCodeBlocks = (html: string): CodeBlock[] => {
  const blocks: CodeBlock[] = [];
  // Match markdown-style code blocks that may have been converted to HTML or are raw
  const patterns = [
    // ```lang\ncode\n``` in raw text (the AI sometimes outputs markdown)
    /```(html|javascript|js|python|py)\n([\s\S]*?)```/gi,
    // <code> blocks
    /<code[^>]*class="[^"]*(?:language-)?(html|javascript|js|python|py)[^"]*"[^>]*>([\s\S]*?)<\/code>/gi,
    // <pre> blocks
    /<pre[^>]*>([\s\S]*?)<\/pre>/gi,
  ];

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(html)) !== null) {
      let lang = (match[1] || "javascript").toLowerCase();
      let code = match[2] || match[1] || "";
      
      // Normalize language names
      if (lang === "js") lang = "javascript";
      if (lang === "py") lang = "python";
      if (!["html", "javascript", "python"].includes(lang)) lang = "javascript";

      // Decode HTML entities
      code = code
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .trim();

      if (code.length > 10) {
        blocks.push({ language: lang as CodeBlock["language"], code, raw: match[0] });
      }
    }
  }

  return blocks;
};

const ChatMessage = ({ type, content, isLoading }: ChatMessageProps) => {
  const [activeSandbox, setActiveSandbox] = useState<CodeBlock | null>(null);

  const codeBlocks = useMemo(() => {
    if (type !== "bot") return [];
    return detectCodeBlocks(content);
  }, [content, type]);

  const styles = {
    user: "bg-cyber/20 border-l-2 md:border-l-4 border-cyber ml-4 md:ml-8",
    bot: "bg-neon/10 border-l-2 md:border-l-4 border-neon mr-4 md:mr-8",
    system: "bg-secondary/50 border-l-2 md:border-l-4 border-muted italic text-xs"
  };

  return (
    <div className={`${styles[type]} p-2.5 md:p-4 rounded-lg animate-slide-in mb-2 md:mb-3`}>
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-neon/30 border-t-neon rounded-full animate-spin-loader" />
          <span className="text-xs text-muted-foreground">Verarbeite...</span>
        </div>
      ) : (
        <>
          <div 
            className="text-xs md:text-sm leading-relaxed break-words"
            dangerouslySetInnerHTML={{ __html: content }}
          />

          {/* Execute buttons for code blocks */}
          {codeBlocks.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {codeBlocks.map((block, i) => (
                <Button
                  key={i}
                  size="sm"
                  onClick={() => setActiveSandbox(block)}
                  className="h-7 text-[11px] bg-neon/20 border border-neon/50 text-neon hover:bg-neon/30 gap-1.5"
                >
                  <Play className="h-3 w-3" />
                  {block.language === "python" ? "🐍" : block.language === "html" ? "🌐" : "⚡"} 
                  {" "}Code ausführen {codeBlocks.length > 1 ? `(${i + 1})` : ""}
                </Button>
              ))}
            </div>
          )}

          {/* Active sandbox */}
          {activeSandbox && (
            <div className="mt-3">
              <CodeSandbox
                code={activeSandbox.code}
                language={activeSandbox.language}
                onClose={() => setActiveSandbox(null)}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ChatMessage;
