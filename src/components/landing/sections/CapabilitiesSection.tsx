import { Table2, Mail, BarChart3, Search, Workflow, ChevronRight,
         MessageSquare, ScanSearch, Files, Layers } from "lucide-react";
import { DotGrid, GridLines } from "../ui/Backgrounds";
import { Reveal } from "../ui/Reveal";
import { CapCard } from "../ui/CapCard";
import { CodeSnip } from "../ui/CodeSnip";
import { IntentClassifier } from "../animations/IntentClassifier";

const SQL_CODE = `<span style="color:#94a3b8"># Natural language → SQL executed automatically</span>
<span style="color:#7dd3fc">User:</span>  <span style="color:#f8fafc">"Which customers spent over $5k last month?"</span>

<span style="color:#c084fc">SELECT</span> customer_id, name, <span style="color:#c084fc">SUM</span>(amount) as total
<span style="color:#c084fc">FROM</span> orders
<span style="color:#c084fc">WHERE</span> order_date >= <span style="color:#86efac">'2024-11-01'</span>
<span style="color:#c084fc">GROUP BY</span> customer_id
<span style="color:#c084fc">HAVING</span> total > <span style="color:#fbbf24">5000</span>
<span style="color:#c084fc">ORDER BY</span> total <span style="color:#c084fc">DESC</span>;`;

const PLAYGROUND_FEATURES = [
  { icon: MessageSquare, text: "Streaming SSE responses — see it think in real time" },
  { icon: ScanSearch,    text: "Pipeline steps shown inline — router, agent, result" },
  { icon: Files,         text: "Citations and confidence scores for every RAG answer" },
  { icon: Layers,        text: "Scoped per workspace — isolate projects cleanly" },
];

export function CapabilitiesSection() {
  return (
    <>
      {/* 5 Agent capability cards */}
      <section id="capabilities" className="relative py-24 overflow-hidden">
        <DotGrid opacity={0.25} />
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
          <Reveal className="text-center mb-16">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Capabilities</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-4">
              Five agents. One platform.
            </h2>
            <p className="text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Each agent is purpose-built for its domain. You never choose — the system routes automatically.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <CapCard wide icon={Table2} title="SQL & Database Agent" badge="Natural Language → SQL"
              color="text-blue-500" bg="bg-blue-500/10" border="border-blue-500/25" delay={0}
              description="Ask questions about your database in plain English. The agent generates and executes the SQL, then returns a clean readable answer.">
              <CodeSnip lang="Example" code={SQL_CODE} />
            </CapCard>

            <CapCard icon={Mail} title="Email Workflow Agent" badge="Automation"
              color="text-violet-500" bg="bg-violet-500/10" border="border-violet-500/25" delay={0.08}
              description="Send emails, draft messages, and automate recurring reports — all from chat or the API.">
              <div className="mt-3 space-y-2">
                {[
                  { msg: "Send weekly report to marketing@co.com", status: "Sent ✓",     ok: true  },
                  { msg: "Draft a follow-up for all open tickets",  status: "Drafting…", ok: false },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between gap-2 px-3 py-2
                    bg-secondary/50 border border-border/40 rounded-xl">
                    <span className="text-[11px] text-muted-foreground truncate flex-1">{item.msg}</span>
                    <span className={`text-[10px] font-semibold shrink-0 ${item.ok ? "text-emerald-500" : "text-amber-500"}`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </CapCard>

            <CapCard icon={BarChart3} title="CSV & Excel Agent" badge="Spreadsheet AI"
              color="text-amber-500" bg="bg-amber-500/10" border="border-amber-500/25" delay={0.14}
              description="Upload Excel or CSV files. Ask analytical questions and get human-readable answers backed by the actual data.">
              <div className="mt-3 flex flex-wrap gap-2">
                {[".xlsx", ".xls", ".csv", ".tsv"].map(ext => (
                  <span key={ext} className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-lg
                    bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">{ext}</span>
                ))}
              </div>
              <p className="mt-3 text-[11px] text-muted-foreground leading-relaxed">
                "Which region had the highest return rate in Q3?" →
                <span className="text-foreground font-medium"> West (8.4%), vs avg 5.1%</span>
              </p>
            </CapCard>

            <CapCard icon={Search} title="Knowledge Retrieval Agent" badge="RAG"
              color="text-emerald-500" bg="bg-emerald-500/10" border="border-emerald-500/25" delay={0.18}
              description="Semantic search over your uploaded documents — PDFs, text, JSON. Returns grounded answers with source citations.">
              <div className="mt-3 flex items-center gap-2 bg-secondary/50 border border-border/40
                rounded-xl px-3 py-2.5 text-[11px] text-muted-foreground">
                <Search className="w-3.5 h-3.5 shrink-0" />
                "What's our policy for late deliveries?" →
                <span className="text-foreground font-medium ml-1">policy.pdf, §4.2</span>
              </div>
            </CapCard>

            <CapCard wide icon={Workflow} title="Multi-step Workflow Agent" badge="Orchestration"
              color="text-rose-500" bg="bg-rose-500/10" border="border-rose-500/25" delay={0.22}
              description="Chain multiple agents together. One query can retrieve data, run SQL, summarise it, and send the result via email — planned and executed automatically.">
              <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1">
                {[
                  { label: "Retrieve data", color: "text-emerald-500", bg: "bg-emerald-500/10" },
                  { label: "Run SQL",       color: "text-blue-500",    bg: "bg-blue-500/10" },
                  { label: "Summarise",     color: "text-amber-500",   bg: "bg-amber-500/10" },
                  { label: "Send email",    color: "text-violet-500",  bg: "bg-violet-500/10" },
                ].map((step, i, arr) => (
                  <div key={step.label} className="flex items-center gap-2 shrink-0">
                    <span className={`text-[11px] font-semibold px-3 py-1.5 rounded-full border
                      ${step.bg} ${step.color} border-current/20`}>{step.label}</span>
                    {i < arr.length - 1 && <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/40" />}
                  </div>
                ))}
              </div>
            </CapCard>
          </div>
        </div>
      </section>

      {/* Playground demo */}
      <section className="relative py-20 overflow-hidden">
        <GridLines opacity={0.15} />
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <Reveal>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Playground</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight mb-4">
                Chat with your entire business context
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                Test your agent before shipping. Ask anything — the system shows which agent handled it,
                the reasoning steps it took, and the sources it cited.
              </p>
              <div className="space-y-3">
                {PLAYGROUND_FEATURES.map(({ icon: Icon, text }, i) => (
                  <Reveal key={i} delay={i * 0.06}>
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-lg bg-secondary border border-border/50
                        flex items-center justify-center shrink-0 mt-0.5">
                        <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.1} y={16}>
              <div className="bg-card border border-border/60 rounded-2xl p-5 shadow-lg">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                  Live demo — pipeline steps
                </p>
                <IntentClassifier />
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
