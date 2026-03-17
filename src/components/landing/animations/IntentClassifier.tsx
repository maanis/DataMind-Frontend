import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Table2, Mail, BarChart3, Search, ScanSearch, GitBranch } from "lucide-react";

const EXAMPLES = [
  {
    q: "What was our revenue last quarter?",
    intent: "SQL Query",
    route: "Database Agent",
    color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/25",
    icon: Table2,
    result: "SELECT SUM(revenue) FROM sales WHERE quarter = 'Q3'",
  },
  {
    q: "Send the weekly report to the marketing team",
    intent: "Email Workflow",
    route: "Email Agent",
    color: "text-violet-500", bg: "bg-violet-500/10", border: "border-violet-500/25",
    icon: Mail,
    result: "Draft ready → Sending to 3 recipients...",
  },
  {
    q: "Which products had the most returns in July?",
    intent: "Data Analysis",
    route: "Excel/CSV Agent",
    color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/25",
    icon: BarChart3,
    result: "Scanning returns.xlsx → Found 4 anomalies",
  },
  {
    q: "Summarise our refund policy for a customer",
    intent: "RAG Retrieval",
    route: "Knowledge Agent",
    color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/25",
    icon: Search,
    result: "Retrieved 3 relevant chunks from policy.pdf",
  },
];

export function IntentClassifier() {
  const [queryIdx, setQueryIdx] = useState(0);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timings = [1800, 900, 900, 2000];
    const t = setTimeout(() => {
      if (step < 3) {
        setStep((s) => s + 1);
      } else {
        setStep(0);
        setQueryIdx((i) => (i + 1) % EXAMPLES.length);
      }
    }, timings[step]);
    return () => clearTimeout(t);
  }, [step, queryIdx]);

  const ex = EXAMPLES[queryIdx];
  const Icon = ex.icon;

  return (
    <div className="space-y-4">
      {/* User query */}
      <div className="flex items-start gap-3">
        <div className="w-7 h-7 rounded-full bg-secondary border border-border/50
          flex items-center justify-center shrink-0">
          <span className="text-[10px] font-bold text-muted-foreground">U</span>
        </div>
        <div className="flex-1 bg-secondary/50 border border-border/40 rounded-xl px-3 py-2.5">
          <p className="text-xs text-foreground/80 leading-relaxed">{ex.q}</p>
        </div>
      </div>

      {/* Intent badge */}
      <AnimatePresence>
        {step >= 1 && (
          <motion.div
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
            className="flex items-center gap-2 pl-10"
          >
            <ScanSearch className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <span className="text-[11px] text-muted-foreground">Classified as:</span>
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border
              ${ex.bg} ${ex.color} ${ex.border}`}>
              {ex.intent}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Route badge */}
      <AnimatePresence>
        {step >= 2 && (
          <motion.div
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
            className="flex items-center gap-2 pl-10"
          >
            <GitBranch className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <span className="text-[11px] text-muted-foreground">Routing to:</span>
            <span className="text-[11px] font-semibold text-foreground">{ex.route}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Result */}
      <AnimatePresence>
        {step >= 3 && (
          <motion.div
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-start gap-3 pl-10"
          >
            <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0
              ${ex.bg} border ${ex.border}`}>
              <Icon className={`w-3.5 h-3.5 ${ex.color}`} />
            </div>
            <div className="bg-background border border-border/50 rounded-xl px-3 py-2.5 flex-1">
              <p className="text-[11px] font-mono text-muted-foreground">{ex.result}</p>
              <div className="flex items-center gap-1.5 mt-1.5">
                <motion.div
                  animate={{ scale: [1, 1.4, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-1.5 h-1.5 rounded-full bg-emerald-500"
                />
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                  Done · 38ms
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
