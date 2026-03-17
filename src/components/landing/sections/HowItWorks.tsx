import { motion } from "framer-motion";
import { Brain, GitBranch, Zap, CheckCircle2, Search, Database, Mail, BarChart3 } from "lucide-react";
import { Reveal } from "../ui/Reveal";

const COMPANIES = ["Acme Corp","Nexus Labs","FinanceOS","Meridian","Cipher AI","Veritas","Loophole","StratosTech"];

const STATS = [
  { value: "< 60ms",   label: "Agent response time" },
  { value: "5 agents", label: "Specialised handlers" },
  { value: "4 inputs", label: "File formats supported" },
  { value: "1 API",    label: "Single endpoint for all" },
];

const STEPS = [
  {
    letter: "A",
    icon: Brain,
    color: "#3b82f6",
    title: "Intent Classification",
    subtitle: "Understanding your query",
    desc: "The AI router analyses your natural language query in milliseconds, identifying whether you need a database lookup, email automation, spreadsheet analysis, document retrieval, or a multi-step workflow.",
    side: "right" as const,
  },
  {
    letter: "B",
    icon: GitBranch,
    color: "#8b5cf6",
    title: "Smart Agent Routing",
    subtitle: "Right agent, every time",
    desc: "Based on classified intent, your query is dispatched to the specialised agent — SQL Agent, Email Agent, CSV/Excel Agent, RAG Knowledge Agent, or Workflow Orchestrator. No manual selection needed.",
    side: "left" as const,
  },
  {
    letter: "C",
    icon: Zap,
    color: "#f59e0b",
    title: "Action Execution",
    subtitle: "Real actions, not just text",
    desc: "The agent takes real action — queries your live database, reads your spreadsheet, searches through uploaded documents, or sends that email. Results are computed from your actual data sources.",
    side: "right" as const,
  },
  {
    letter: "D",
    icon: CheckCircle2,
    color: "#10b981",
    title: "Structured Response",
    subtitle: "Answer + proof of action",
    desc: "You receive a natural language answer, the intent classification, the action taken, source citations, and latency — all in one structured JSON response through a single API call or the Playground.",
    side: "left" as const,
  },
];

export function HowItWorks() {
  const doubled = [...COMPANIES, ...COMPANIES];

  return (
    <>
      {/* Marquee strip */}
      <div className="border-y border-border/50 bg-secondary/20 py-4 overflow-hidden">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="flex items-center w-max"
        >
          {doubled.map((co, i) => (
            <span key={i}
              className="px-8 text-xs font-medium text-muted-foreground/55
                uppercase tracking-widest border-r border-border/40 whitespace-nowrap">
              {co}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Snake diagram section */}
      <section id="how-it-works" className="relative py-24 overflow-hidden bg-background">
        {/* Subtle bg */}
        <div className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle, hsl(var(--border)/0.6) 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
            opacity: 0.3,
            maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)",
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
          <Reveal className="text-center mb-20">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
              How it works
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-4">
              One query. The right action.
            </h2>
            <p className="text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Every message is classified, routed, and executed automatically —
              from question to real-world action in milliseconds.
            </p>
          </Reveal>

          {/* Snake diagram */}
          <div className="relative">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              const isRight = step.side === "right";

              return (
                <Reveal key={i} delay={i * 0.12}>
                  <div className="relative mb-4 last:mb-0">

                    {/* The snake track */}
                    <div
                      className="relative flex items-center rounded-[50px] overflow-hidden
                        border border-border/60 bg-card shadow-md"
                      style={{
                        borderLeft: isRight ? `4px solid ${step.color}` : "1px solid hsl(var(--border)/0.6)",
                        borderRight: isRight ? "1px solid hsl(var(--border)/0.6)" : `4px solid ${step.color}`,
                      }}
                    >
                      {/* Left circle icon area */}
                      <div className={`flex items-center justify-center shrink-0 ${isRight ? "order-first" : "order-last"}`}
                        style={{ width: 120, height: 120 }}>
                        <motion.div
                          whileHover={{ scale: 1.08 }}
                          transition={{ type: "spring", stiffness: 320, damping: 20 }}
                          className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg relative"
                          style={{
                            background: `radial-gradient(circle at 35% 35%, white 0%, hsl(var(--secondary)) 100%)`,
                            boxShadow: `0 8px 32px ${step.color}25, 0 2px 8px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.8)`,
                          }}
                        >
                          {/* Pulsing ring */}
                          <motion.div
                            animate={{ scale: [1, 1.35, 1], opacity: [0.4, 0, 0.4] }}
                            transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.4 }}
                            className="absolute inset-0 rounded-full"
                            style={{ border: `2px solid ${step.color}` }}
                          />
                          <Icon style={{ color: step.color }} className="w-8 h-8 relative z-10" strokeWidth={1.5} />

                          {/* Step letter badge */}
                          <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full
                            flex items-center justify-center text-[10px] font-black text-white shadow-sm"
                            style={{ background: step.color }}>
                            {step.letter}
                          </div>
                        </motion.div>
                      </div>

                      {/* Zigzag connector triangles */}
                      <div className={`flex flex-col gap-0 shrink-0 ${isRight ? "order-2" : "order-2"}`}
                        style={{ width: 20 }}>
                        {Array.from({ length: 6 }).map((_, ti) => (
                          <div key={ti}
                            style={{
                              width: 0, height: 0,
                              borderLeft: isRight ? `10px solid ${step.color}` : "10px solid transparent",
                              borderRight: isRight ? "10px solid transparent" : `10px solid ${step.color}`,
                              borderTop: "8px solid transparent",
                              borderBottom: "8px solid transparent",
                            }}
                          />
                        ))}
                      </div>

                      {/* Text content */}
                      <div className={`flex-1 px-6 py-5 ${isRight ? "order-3 text-left" : "order-1 text-right"}`}>
                        <div className={`flex items-center gap-2 mb-1 ${isRight ? "justify-start" : "justify-end"}`}>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                            {step.subtitle}
                          </p>
                        </div>
                        <h3 className="text-lg font-bold mb-2 tracking-tight"
                          style={{ color: step.color }}>
                          {step.title}
                        </h3>
                        <p className="text-xs text-muted-foreground leading-relaxed max-w-xs">
                          {step.desc}
                        </p>
                      </div>
                    </div>

                    {/* Connecting curved path between steps */}
                    {i < STEPS.length - 1 && (
                      <div className={`flex ${isRight ? "justify-end pr-10" : "justify-start pl-10"} mt-1`}>
                        <motion.div
                          initial={{ scaleX: 0 }}
                          whileInView={{ scaleX: 1 }}
                          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                          viewport={{ once: true }}
                          className="h-6 w-24 rounded-b-full border-b-2 border-l-2 border-r-2 border-border/40"
                          style={{
                            transformOrigin: isRight ? "right center" : "left center",
                            borderColor: `${step.color}40`,
                          }}
                        />
                      </div>
                    )}
                  </div>
                </Reveal>
              );
            })}
          </div>

          {/* Agent icons legend strip */}
          <Reveal delay={0.5} className="mt-16">
            <div className="flex flex-wrap items-center justify-center gap-3">
              {[
                { icon: Database,  label: "SQL Agent",     color: "#3b82f6" },
                { icon: Mail,      label: "Email Agent",   color: "#8b5cf6" },
                { icon: BarChart3, label: "Excel Agent",   color: "#f59e0b" },
                { icon: Search,    label: "RAG Agent",     color: "#10b981" },
                { icon: GitBranch, label: "Workflow Agent",color: "#ef4444" },
              ].map(({ icon: Icon, label, color }) => (
                <div key={label}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full
                    border border-border/60 bg-card text-xs font-medium text-muted-foreground
                    hover:border-border hover:text-foreground transition-all duration-200 hover:-translate-y-0.5"
                >
                  <Icon style={{ color }} className="w-3.5 h-3.5" />
                  {label}
                </div>
              ))}
            </div>
          </Reveal>

          {/* Stats inline */}
          <Reveal delay={0.6} className="mt-14">
            <div className="border border-border/50 rounded-2xl bg-secondary/10 px-8 py-10">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {STATS.map(({ value, label }, i) => (
                  <div key={i} className="text-center">
                    <div className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">{value}</div>
                    <div className="text-sm text-muted-foreground mt-1.5">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
