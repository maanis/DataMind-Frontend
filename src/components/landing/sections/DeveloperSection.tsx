import { Zap, Network, Code2, Shield } from "lucide-react";
import { DotGrid } from "../ui/Backgrounds";
import { Reveal } from "../ui/Reveal";
import { CodeSnip } from "../ui/CodeSnip";

const API_CODE = `<span style="color:#94a3b8"># Ask in plain English — the agent figures out the rest</span>
<span style="color:#7dd3fc">curl</span> -X POST https://api.datamind.ai/query \\
  -H <span style="color:#86efac">"Authorization: Bearer YOUR_TOKEN"</span> \\
  -d <span style="color:#fca5a5">'{ "question": "Send the Q3 report to Sarah", "workspaceId": "ws_xyz" }'</span>

<span style="color:#94a3b8"># Response — action taken, not just text</span>
{
  <span style="color:#93c5fd">"intent"</span>:      <span style="color:#86efac">"email_workflow"</span>,
  <span style="color:#93c5fd">"action"</span>:      <span style="color:#86efac">"email_sent"</span>,
  <span style="color:#93c5fd">"to"</span>:          <span style="color:#86efac">"sarah@company.com"</span>,
  <span style="color:#93c5fd">"answer"</span>:      <span style="color:#86efac">"Report sent to Sarah with Q3 summary."</span>,
  <span style="color:#93c5fd">"latency_ms"</span>:  <span style="color:#fbbf24">61</span>
}`;

const BENEFITS = [
  { icon: Zap,     text: "Streaming SSE for real-time token output" },
  { icon: Network, text: "Single REST endpoint — all agents behind one URL" },
  { icon: Code2,   text: "Built-in examples in cURL, JavaScript, Python" },
  { icon: Shield,  text: "JWT auth, workspace-scoped, production-ready" },
];

export function DeveloperSection() {
  return (
    <section id="developers" className="relative py-24 overflow-hidden">
      <DotGrid opacity={0.2} />
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <Reveal>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
              For developers
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-5">
              One API for every agent
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed mb-8">
              Send a natural language query and get back a structured response — the intent,
              the action taken, and the answer. The same endpoint handles RAG, SQL, emails,
              and workflows. Integrate into your product in minutes.
            </p>
            <div className="space-y-3">
              {BENEFITS.map(({ icon: Icon, text }, i) => (
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
            <CodeSnip lang="cURL · The same endpoint for everything" code={API_CODE} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
