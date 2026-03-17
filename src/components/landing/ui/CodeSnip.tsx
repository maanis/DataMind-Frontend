import { useState } from "react";
import { Check, Code2 } from "lucide-react";

export function CodeSnip({ lang, code }: { lang: string; code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const plain = code.replace(/<[^>]*>/g, "");
    navigator.clipboard.writeText(plain);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="rounded-xl overflow-hidden border border-border/60 bg-background">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-secondary/50 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
              <div key={c} style={{ background: c }} className="w-2.5 h-2.5 rounded-full" />
            ))}
          </div>
          <span className="text-[11px] text-muted-foreground font-medium">{lang}</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-[11px] text-muted-foreground
            hover:text-foreground transition-colors px-2 py-0.5 rounded hover:bg-secondary"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Code2 className="w-3 h-3" />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      <pre className="p-4 text-[11px] leading-[1.9] overflow-x-auto font-mono"
        style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}>
        <code dangerouslySetInnerHTML={{ __html: code }} />
      </pre>
    </div>
  );
}
