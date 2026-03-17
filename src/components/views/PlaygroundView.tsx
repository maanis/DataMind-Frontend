import { useState, useRef, useEffect, useCallback } from "react";
import {
  Send, Sparkles, Database, Bot, User,
  PanelRightClose, PanelRightOpen, Search,
  Quote, Copy, RefreshCw, ChevronDown, FileText, Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useWorkspaces, useDocuments } from "@/hooks/useWorkspaces";
import { API_BASE_URL } from "@/config/api";

interface Source { id: string; text: string; score: number; source: string; }
interface PipelineStep { tool: string; message: string; }
interface Message {
  id: string; role: "user" | "assistant"; content: string;
  timestamp: Date; sources?: Source[]; isStreaming?: boolean; steps?: PipelineStep[];
}

const SKIP_TOOLS = new Set(["cache", "metadata"]);
function shouldShowStep(tool: string, message: string): boolean {
  if (SKIP_TOOLS.has(tool)) return false;
  if (message.includes("Answered from") || message.includes("cache")) return false;
  return true;
}

function cleanLabel(tool: string, message: string): string {
  // Message-aware labels for email — multiple steps share tool="email"
  const msg = message.toLowerCase();
  if (tool === "email") {
    if (msg.includes("finding") || msg.includes("recipient")) return "Finding recipients";
    if (msg.includes("drafting") || msg.includes("draft")) return "Drafting email";
    if (msg.includes("sending") || msg.includes("send")) return "Sending email";
    if (msg.includes("updating") || msg.includes("update")) return "Updating draft";
    return "Preparing email";
  }
  if (tool === "action") return "Sending email";
  const map: Record<string, string> = {
    router: "Classifying query",
    memory: "Loading memory",
    sql_gen: "Generating SQL",
    sql_exec: "Running query",
    search: "Searching documents",
    rerank: "Ranking results",
    llm: "Generating answer",
    workflow: "Planning steps",
    system: "Processing",
  };
  if (map[tool]) return map[tool];
  return message.replace(/^\[step\s*\d+\]\s*/i, "").replace(/^[^\w]+\s*/, "").split(":")[0].trim() || "Processing";
}

const TOOL_EMOJI: Record<string, string> = {
  router: "🔀", memory: "🧠", sql_gen: "⚙️", sql_exec: "⚡",
  search: "🔍", rerank: "📊", llm: "✍️", email: "📧",
  workflow: "🗂️", system: "💬", action: "✅",
};

// Deduplicate pipeline steps — keep last occurrence of each unique label
// prevents "Preparing email x3" — shows only the final meaningful step per type
function dedupeSteps(steps: PipelineStep[]): PipelineStep[] {
  const seen = new Map<string, number>();
  steps.forEach((s, i) => { seen.set(cleanLabel(s.tool, s.message), i); });
  return steps.filter((s, i) => seen.get(cleanLabel(s.tool, s.message)) === i);
}

function normalizeSources(rawSources: any[] = []): Source[] {
  return rawSources
    .map((s, i) => ({
      id: s?.id || `src-${Date.now()}-${i}`,
      text: String(s?.text || "").trim(),
      score: Number.isFinite(Number(s?.score)) ? Number(s.score) : 0,
      source: String(s?.source || "Workspace document").trim(),
    }))
    .filter((s) => Boolean(s.text));
}

// ---------------------------------------------------------------------------
// Full markdown renderer — handles ##, ###, **, *, `code`, ---, numbered lists, *italics*
// ---------------------------------------------------------------------------
function renderInline(text: string): React.ReactNode[] {
  // Handle **bold**, *italic*, `code` inline
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);
  return parts.map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**"))
      return <strong key={i} className="font-semibold text-foreground">{p.slice(2, -2)}</strong>;
    if (p.startsWith("*") && p.endsWith("*") && p.length > 2)
      return <em key={i} className="italic text-muted-foreground">{p.slice(1, -1)}</em>;
    if (p.startsWith("`") && p.endsWith("`") && p.length > 2)
      return (
        <code key={i} className="px-1.5 py-0.5 rounded-md bg-muted/70 border border-border/40 font-mono text-[11px] text-foreground/80">
          {p.slice(1, -1)}
        </code>
      );
    return <span key={i}>{p}</span>;
  });
}

function RenderMessage({ content, isStreaming }: { content: string; isStreaming?: boolean }) {
  const lines = content.split("\n");
  const nodes: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // --- horizontal rule
    if (/^-{3,}$/.test(trimmed)) {
      nodes.push(<hr key={i} className="my-3 border-border/40" />);
      i++; continue;
    }

    // ## H2 heading
    if (trimmed.startsWith("## ")) {
      nodes.push(
        <h2 key={i} className="text-base font-semibold text-foreground mt-3 mb-1.5 first:mt-0">
          {renderInline(trimmed.slice(3))}
        </h2>
      );
      i++; continue;
    }

    // ### H3 heading
    if (trimmed.startsWith("### ")) {
      nodes.push(
        <h3 key={i} className="text-sm font-semibold text-foreground mt-2.5 mb-1">
          {renderInline(trimmed.slice(4))}
        </h3>
      );
      i++; continue;
    }

    // * or - bullet list — collect consecutive bullets into a <ul>
    if (/^[\*\-•]\s/.test(trimmed)) {
      const items: React.ReactNode[] = [];
      while (i < lines.length && /^[\*\-•]\s/.test(lines[i].trim())) {
        const text = lines[i].trim().slice(2);
        items.push(
          <li key={i} className="flex gap-2 items-start">
            <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary/60 shrink-0" />
            <span className="text-sm leading-relaxed">{renderInline(text)}</span>
          </li>
        );
        i++;
      }
      nodes.push(<ul key={`ul-${i}`} className="space-y-1 my-1.5 ml-1">{items}</ul>);
      continue;
    }

    // Numbered list — collect consecutive numbered items
    if (/^\d+\.\s/.test(trimmed)) {
      const items: React.ReactNode[] = [];
      let counter = 1;
      while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
        const di = lines[i].trim().indexOf(". ");
        const text = lines[i].trim().slice(di + 2);
        items.push(
          <li key={i} className="flex gap-3 items-start">
            <span className="text-xs font-mono font-semibold text-primary/70 mt-0.5 w-4 shrink-0 text-right">{counter}.</span>
            <span className="text-sm leading-relaxed">{renderInline(text)}</span>
          </li>
        );
        counter++; i++;
      }
      nodes.push(
        <ol key={`ol-${i}`} className="space-y-1.5 my-1.5 ml-1">{items}</ol>
      );
      continue;
    }

    // Sub-bullet with indentation (- or * after spaces)
    if (/^\s{2,}[-*]\s/.test(line)) {
      nodes.push(
        <div key={i} className="flex gap-2 items-start ml-5">
          <span className="mt-2 w-1 h-1 rounded-full bg-muted-foreground/50 shrink-0" />
          <span className="text-sm leading-relaxed text-muted-foreground">{renderInline(trimmed.slice(2))}</span>
        </div>
      );
      i++; continue;
    }

    // Empty line → spacing
    if (!trimmed) {
      nodes.push(<div key={i} className="h-1.5" />);
      i++; continue;
    }

    // Regular paragraph
    nodes.push(
      <p key={i} className="text-sm leading-relaxed">{renderInline(line)}</p>
    );
    i++;
  }

  return (
    <div className="space-y-1">
      {nodes}
      {isStreaming && (
        <span className="inline-block w-0.5 h-4 bg-current opacity-70 animate-pulse ml-0.5 align-text-bottom" />
      )}
    </div>
  );
}

// Past-tense labels for completed steps
const PAST_TENSE: Record<string, string> = {
  "Classifying query":   "Classified",
  "Loading memory":      "Memory loaded",
  "Generating SQL":      "SQL generated",
  "Running query":       "Query ran",
  "Searching documents": "Documents searched",
  "Ranking results":     "Results ranked",
  "Generating answer":   "Answer generated",
  "Preparing email":     "Email prepared",
  "Drafting email":      "Email drafted",
  "Finding recipients":  "Recipients found",
  "Sending email":       "Email sent",
  "Updating draft":      "Draft updated",
  "Planning steps":      "Steps planned",
  "Processing":          "Processed",
};

function toPastTense(label: string): string {
  return PAST_TENSE[label] || label;
}

function PipelineSteps({ steps, isStreaming }: { steps: PipelineStep[]; isStreaming?: boolean }) {
  const visible = dedupeSteps(steps.filter(s => shouldShowStep(s.tool, s.message)));
  if (!visible.length) return null;
  // While streaming: last step is active, all prior are done.
  // After streaming: all steps are done.
  const activeIdx = isStreaming ? visible.length - 1 : -1;
  return (
    <div className="mb-2 flex flex-wrap gap-1.5">
      {visible.map((s, i) => {
        const label = cleanLabel(s.tool, s.message);
        const isDone = i < activeIdx || !isStreaming;
        const isActive = i === activeIdx;
        return (
          <motion.span key={i}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, delay: i * 0.04 }}
            className={[
              "inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border transition-all duration-300",
              isDone
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                : isActive
                ? "bg-primary/10 border-primary/30 text-primary"
                : "bg-muted/60 border-border/40 text-muted-foreground",
            ].join(" ")}>
            {isDone ? (
              // Checkmark for completed steps
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="shrink-0">
                <path d="M2 5l2.5 2.5L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : isActive ? (
              // Pulsing dot for active step
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shrink-0" />
            ) : (
              <span>{TOOL_EMOJI[s.tool] || "💬"}</span>
            )}
            <span>{isDone ? toPastTense(label) : label}</span>
          </motion.span>
        );
      })}
    </div>
  );
}

export function PlaygroundView() {
  const [messages, setMessages] = useState<Message[]>([{
    id: "1", role: "assistant",
    content: "Hello! I'm ready to answer questions based on your knowledge base.",
    timestamp: new Date(),
  }]);
  const [input, setInput] = useState("");
  const [activeSources, setActiveSources] = useState<Source[]>([]);
  const [showSidebar, setShowSidebar] = useState(true);
  const [isResponding, setIsResponding] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState("");
  const [selectedDocument, setSelectedDocument] = useState("all");

  const { data: workspaces = [] } = useWorkspaces();
  const { data: documents = [], isLoading: documentsLoading } = useDocuments(selectedWorkspace);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (workspaces.length > 0 && !selectedWorkspace)
      setSelectedWorkspace(workspaces[0].workspaceId);
  }, [workspaces, selectedWorkspace]);

  useEffect(() => { setSelectedDocument("all"); }, [selectedWorkspace]);

  // Fetch conversation memory for the workspace
  const fetchMemory = useCallback(async (workspaceId: string) => {
    if (!workspaceId) return;
    const token = localStorage.getItem("token") || "";
    try {
      const res = await fetch(`${API_BASE_URL}/api/query/memory/${workspaceId}`, {
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.memory && Array.isArray(data.memory.messages)) {
          const loadedMessages = data.memory.messages.map((msg: any, idx: number) => ({
            id: `mem-${idx}`,
            role: msg.role || "assistant",
            content: msg.content || "",
            timestamp: new Date(msg.timestamp || Date.now()),
          }));
          setMessages(loadedMessages);
        }
      }
    } catch (err) {
      console.error("Failed to fetch memory:", err);
    }
  }, []);

  useEffect(() => {
    if (selectedWorkspace) {
      fetchMemory(selectedWorkspace);
    }
  }, [selectedWorkspace, fetchMemory]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [input]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || !selectedWorkspace) {
      if (!selectedWorkspace) toast({ title: "Select a workspace", variant: "destructive" });
      return;
    }

    abortRef.current?.abort();
    abortRef.current = new AbortController();

    const question = input.trim();
    const uid = Date.now().toString();
    const aid = (Date.now() + 1).toString();

    setMessages(prev => [...prev,
      { id: uid, role: "user", content: question, timestamp: new Date() },
      { id: aid, role: "assistant", content: "", timestamp: new Date(), isStreaming: true, steps: [] },
    ]);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setIsResponding(true);
    setActiveSources([]);

    const token = localStorage.getItem("token") || "";
    const docId = selectedDocument === "all" ? null : selectedDocument;

    try {
      const res = await fetch(`${API_BASE_URL}/api/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ question, workspaceId: selectedWorkspace, documentId: docId, stream: true }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({})) as any;
        throw new Error(err.message || `HTTP ${res.status}`);
      }

      const ct = res.headers.get("content-type") || "";

      if (ct.includes("text/event-stream")) {
        const reader = res.body!.getReader();
        const dec = new TextDecoder();
        let buf = "";
        let streamedSources: Source[] = [];

        const finish = () => {
          setIsResponding(false);
          setMessages(prev => prev.map(m => m.id === aid ? { ...m, isStreaming: false } : m));
        };

        outer: while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buf += dec.decode(value, { stream: true });
          const lines = buf.split("\n");
          buf = lines.pop() ?? "";

          for (const line of lines) {
            const normalizedLine = line.trimStart();
            if (!normalizedLine.startsWith("data:")) continue;
            const raw = normalizedLine.slice(5).trim();
            if (!raw) continue;
            try {
              const ev = JSON.parse(raw);
              if (ev.type === "step") {
                setMessages(prev => prev.map(m =>
                  m.id === aid
                    ? { ...m, steps: [...(m.steps || []), { tool: ev.tool || "system", message: ev.message || "" }] }
                    : m
                ));
              } else if ((ev.type === "sources" || ev.type === "source") && Array.isArray(ev.sources || ev.data?.sources)) {
                const mappedSources = normalizeSources(ev.sources || ev.data?.sources || []);
                if (mappedSources.length) {
                  streamedSources = mappedSources;
                  setActiveSources(mappedSources);
                  setMessages(prev => prev.map(m => m.id === aid ? { ...m, sources: mappedSources } : m));
                }
              } else if (ev.type === "token" && ev.text) {
                setMessages(prev => prev.map(m =>
                  m.id === aid ? { ...m, content: m.content + ev.text } : m
                ));
              } else if (ev.type === "done") {
                if (streamedSources.length) {
                  setActiveSources(streamedSources);
                  setMessages(prev => prev.map(m => m.id === aid ? { ...m, sources: streamedSources } : m));
                }
                if (ev.finalAnswer) {
                  setMessages(prev => prev.map(m => {
                    if (m.id !== aid) return m;
                    return m.content ? m : { ...m, content: ev.finalAnswer! };
                  }));
                }
                finish(); break outer;
              } else if (ev.type === "error") {
                setMessages(prev => prev.map(m =>
                  m.id === aid ? { ...m, content: ev.message || "Something went wrong.", isStreaming: false } : m
                ));
                setIsResponding(false); break outer;
              }
            } catch { /* ignore parse errors */ }
          }
        }
        finish();

      } else {
        const payload = await res.json() as any;
        if (!payload.success) throw new Error(payload.message || "Query failed");
        const content = payload.response?.message || "No response.";
        const mappedSources = normalizeSources(payload.meta?.chunks_used || []);
        setMessages(prev => prev.map(m => m.id === aid
          ? { ...m, content, isStreaming: false, sources: mappedSources }
          : m));
        setActiveSources(mappedSources);
        setIsResponding(false);
      }
    } catch (err: any) {
      if (err.name === "AbortError") return;
      setMessages(prev => prev.map(m =>
        m.id === aid ? { ...m, content: "Something went wrong. Please try again.", isStreaming: false } : m
      ));
      toast({ title: "Error", description: err.message, variant: "destructive" });
      setIsResponding(false);
    }
  }, [input, selectedWorkspace, selectedDocument, toast]);

  const handleStop = () => {
    abortRef.current?.abort();
    setIsResponding(false);
    setMessages(prev => prev.map(m => m.isStreaming ? { ...m, isStreaming: false } : m));
  };

  const handleClear = useCallback(async () => {
    if (!selectedWorkspace) {
      toast({ title: "Select a workspace first", variant: "destructive" });
      return;
    }
    const token = localStorage.getItem("token") || "";
    try {
      const res = await fetch(`${API_BASE_URL}/api/query/clear-memory`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ workspaceId: selectedWorkspace }),
      });
      if (res.ok) {
        setMessages([{
          id: "1",
          role: "assistant",
          content: "Conversation cleared! Ready for a fresh start.",
          timestamp: new Date(),
        }]);
        toast({ title: "Conversation cleared successfully" });
      } else {
        throw new Error("Failed to clear memory");
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  }, [selectedWorkspace, toast]);

  return (
    <div className="flex h-full max-w-5xl mx-auto overflow-y-hidden w-full bg-background overflow-hidden rounded-3xl border border-border shadow-2xl">

      {/* Chat */}
      <div className="flex-1 flex flex-col min-w-0 bg-background relative z-0">
        <header className="h-16 border-b border-border/50 flex items-center justify-between px-6 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="relative">
              <select value={selectedWorkspace} onChange={e => setSelectedWorkspace(e.target.value)}
                className="appearance-none pl-9 pr-8 py-2 bg-secondary/50 hover:bg-secondary rounded-xl text-sm font-medium transition-colors cursor-pointer outline-none focus:ring-2 focus:ring-primary/20">
                <option value="" disabled>Select Workspace</option>
                {workspaces.map(w => <option key={w.workspaceId} value={w.workspaceId}>{w.workspaceName}</option>)}
                {workspaces.length === 0 && <option value="demo">Demo Workspace</option>}
              </select>
              <Database className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            </div>
            <div className="relative">
              <select value={selectedDocument} onChange={e => setSelectedDocument(e.target.value)}
                disabled={!selectedWorkspace || documentsLoading}
                className="appearance-none pl-9 pr-8 py-2 bg-secondary/50 hover:bg-secondary rounded-xl text-sm font-medium transition-colors cursor-pointer outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed">
                <option value="all">All Documents</option>
                {documents.map((d: any) => <option key={d._id} value={d._id}>{d.fileName}</option>)}
              </select>
              <FileText className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            </div>
            <span className="h-4 w-px bg-border/50 mx-1" />
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Bot Active
            </div>
          </div>
          <button onClick={() => setShowSidebar(!showSidebar)}
            className="p-2 hover:bg-secondary rounded-lg text-muted-foreground transition-colors">
            {showSidebar ? <PanelRightClose className="w-5 h-5" /> : <PanelRightOpen className="w-5 h-5" />}
          </button>
          <button onClick={handleClear} disabled={isResponding}
            className="p-2 hover:bg-secondary rounded-lg text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Clear conversation">
            <Trash2 className="w-5 h-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth">
          <div className="max-w-3xl mx-auto space-y-8 py-4">
            {messages.map(msg => (
              <motion.div key={msg.id}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}
                className={cn("flex gap-4", msg.role === "user" ? "flex-row-reverse" : "flex-row")}>
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm mt-1",
                  msg.role === "assistant" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                )}>
                  {msg.role === "assistant" ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                </div>
                <div className={cn("flex flex-col max-w-[80%]", msg.role === "user" ? "items-end" : "items-start")}>
                  {msg.role === "assistant" && msg.steps && msg.steps.length > 0 && (
                    <PipelineSteps steps={msg.steps} isStreaming={msg.isStreaming} />
                  )}
                  <div className={cn(
                    "px-5 py-3.5 rounded-2xl shadow-sm leading-relaxed",
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-sm text-sm"
                      : "bg-card border border-border rounded-tl-sm text-foreground"
                  )}>
                    {msg.role === "assistant"
                      ? msg.content === "" && msg.isStreaming
                        ? <span className="inline-flex gap-1 items-center">
                            <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:-0.3s]" />
                            <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:-0.15s]" />
                            <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" />
                          </span>
                        : <RenderMessage content={msg.content} isStreaming={msg.isStreaming} />
                      : <span className="text-sm whitespace-pre-wrap">{msg.content}</span>
                    }
                  </div>
                  <span className="text-[10px] text-muted-foreground mt-2 px-1 select-none">
                    {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              </motion.div>
            ))}
            <div ref={messagesEndRef} className="h-4" />
          </div>
        </div>

        <div className="p-6 pt-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky bottom-0 z-20">
          <div className="max-w-3xl mx-auto">
            <div className="relative bg-card border border-border rounded-2xl flex items-end p-2 transition-all duration-200 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 focus-within:bg-muted/20">
              <textarea ref={textareaRef} value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder="Message..." rows={1}
                className="flex-1 max-h-48 min-h-[50px] bg-transparent border-none focus:outline-none resize-none py-3 px-4 text-sm leading-relaxed placeholder:text-muted-foreground/50 scrollbar-hide" />
              <button onClick={isResponding ? handleStop : handleSend}
                disabled={!isResponding && !input.trim()}
                className="mb-1.5 mr-1.5 p-2 rounded-xl bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95">
                {isResponding ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[10px] text-muted-foreground text-center mt-3">
              AI can make mistakes. Please check important information.
            </p>
          </div>
        </div>
      </div>

      {/* Sources sidebar */}
      <AnimatePresence initial={false}>
        {showSidebar && (
          <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: 320, opacity: 1 }} exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="border-l border-border bg-muted/10 h-full overflow-hidden flex flex-col shadow-inner">
            <div className="h-16 flex items-center px-5 border-b border-border/50 bg-muted/30">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" /> Citations & Sources
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {activeSources.length > 0 ? activeSources.map((s, idx) => (
                <motion.div key={s.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  className="bg-card border border-border/50 rounded-xl p-4 shadow-sm hover:shadow-md transition-all group">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-primary/10 rounded-md text-primary"><Quote className="w-3 h-3" /></div>
                      <span className="text-xs font-semibold truncate max-w-[150px]" title={s.source}>{s.source}</span>
                    </div>
                    <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full",
                      s.score > 0.8 ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600")}>
                      {Math.round(s.score * 100)}% match
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-4 font-mono bg-muted/30 p-2 rounded-lg border border-border/30">
                    "{s.text}"
                  </p>
                  <div className="mt-3 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="text-[10px] flex items-center gap-1 text-primary hover:underline"
                      onClick={() => navigator.clipboard.writeText(s.text)}>
                      <Copy className="w-3 h-3" /> Copy
                    </button>
                  </div>
                </motion.div>
              )) : (
                <div className="h-64 flex flex-col items-center justify-center text-center p-4">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                    <Search className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium">No sources yet</p>
                  <p className="text-xs text-muted-foreground mt-1">Ask a question to see which documents the AI uses.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}