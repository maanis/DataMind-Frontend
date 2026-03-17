import { Layers } from "lucide-react";
import { ThemeToggleBtn } from "../ui/ThemeToggleBtn";

const FOOTER_COLS = [
  { heading: "Platform",    links: ["Playground","Knowledge Base","SQL Agent","Email Agent","API Keys"] },
  { heading: "Developers",  links: ["REST API","cURL Examples","JavaScript","Python","Streaming SSE"] },
  { heading: "Company",     links: ["About","Blog","Privacy","Terms"] },
];

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-secondary/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-foreground flex items-center justify-center">
                <Layers className="w-3.5 h-3.5 text-background" strokeWidth={2.5} />
              </div>
              <span className="font-bold text-sm text-foreground">DataMind AI</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-[200px]">
              A full agentic AI system — not just RAG. Intent routing, SQL, email automation,
              and knowledge retrieval in one platform.
            </p>
          </div>
          {FOOTER_COLS.map((col) => (
            <div key={col.heading}>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">
                {col.heading}
              </p>
              {col.links.map((l) => (
                <p key={l} className="text-xs text-muted-foreground hover:text-foreground
                  transition-colors mb-2.5 cursor-pointer">{l}</p>
              ))}
            </div>
          ))}
        </div>
        <div className="border-t border-border/50 pt-6 flex flex-col sm:flex-row
          items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">© 2025 DataMind AI. All rights reserved.</p>
          <div className="flex items-center gap-5">
            {["Twitter","GitHub","Discord"].map((s) => (
              <span key={s} className="text-xs text-muted-foreground hover:text-foreground
                transition-colors cursor-pointer">{s}</span>
            ))}
            <ThemeToggleBtn />
          </div>
        </div>
      </div>
    </footer>
  );
}
