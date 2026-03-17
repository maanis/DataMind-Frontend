import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Table2, Mail, BarChart3, Search, Workflow, Brain } from "lucide-react";

const AGENTS = [
  { label: "SQL Agent",        icon: Table2,    color: "text-blue-500",    bg: "bg-blue-500/10",    border: "border-blue-500/25" },
  { label: "Email Agent",      icon: Mail,      color: "text-violet-500",  bg: "bg-violet-500/10",  border: "border-violet-500/25" },
  { label: "CSV/Excel Agent",  icon: BarChart3, color: "text-amber-500",   bg: "bg-amber-500/10",   border: "border-amber-500/25" },
  { label: "RAG Agent",        icon: Search,    color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/25" },
  { label: "Workflow Agent",   icon: Workflow,  color: "text-rose-500",    bg: "bg-rose-500/10",    border: "border-rose-500/25" },
];

export function AgentFlowDiagram() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActive((a) => (a + 1) % AGENTS.length), 1200);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Router node */}
      <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl
        bg-foreground text-background border border-foreground/20 shadow-sm">
        <Brain className="w-4 h-4" />
        <span className="text-xs font-bold">Intent Router</span>
      </div>

      {/* Agent nodes */}
      <div className="flex gap-2 items-start">
        {AGENTS.map((a, i) => (
          <div key={i} className="flex flex-col items-center gap-1.5">
            <motion.div
              animate={{ height: active === i ? 24 : 16, opacity: active === i ? 1 : 0.3 }}
              transition={{ duration: 0.3 }}
              className="w-px bg-border"
            />
            <motion.div
              animate={active === i ? { scale: 1.1, y: -2 } : { scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 380, damping: 24 }}
              className={`flex flex-col items-center gap-1.5 px-2 py-2.5 rounded-xl border
                transition-all duration-300
                ${active === i ? `${a.bg} ${a.border}` : "bg-secondary/40 border-border/40"}`}
            >
              <a.icon className={`w-4 h-4 transition-colors duration-300
                ${active === i ? a.color : "text-muted-foreground/40"}`} />
              <span className={`text-[9px] font-medium text-center leading-tight w-14
                transition-colors duration-300
                ${active === i ? "text-foreground" : "text-muted-foreground/50"}`}>
                {a.label}
              </span>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
}
