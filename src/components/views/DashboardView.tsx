import { useNavigate } from "react-router-dom";
import {
  MessageSquare, Key, ArrowUpRight, Sparkles, Database,
  Plus, Activity, Zap, Layers, TrendingUp, Files,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useWorkspaces, useCreateWorkspace } from "@/hooks/useWorkspaces";

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

/* ── Animated counter hook ── */
function useCountUp(target: number, trigger: boolean, duration = 1100) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!trigger || target === 0) return;
    const t0 = performance.now();
    const frame = (now: number) => {
      const p = Math.min((now - t0) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(ease * target));
      if (p < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }, [trigger, target, duration]);
  return val;
}

/* ── Stat card ── */
function StatCard({ label, value, loading, delay = 0, icon: Icon }:{
  label:string; value:number; loading:boolean; delay?:number;
  icon: React.ComponentType<{className?:string}>;
}) {
  const [vis, setVis] = useState(false);
  const count = useCountUp(value, vis && !loading, 1000);
  useEffect(()=>{ const t = setTimeout(()=>setVis(true), delay); return ()=>clearTimeout(t); },[delay]);

  return (
    <motion.div
      initial={{ opacity:0, y:16 }}
      animate={{ opacity:1, y:0 }}
      transition={{ delay: delay/1000, duration:0.5, ease:[0.22,1,0.36,1] }}
      className="p-3 sm:p-4 rounded-xl bg-card border border-border/50 card-shadow flex flex-col gap-2
        hover-lift cursor-default group"
    >
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground text-[10px] sm:text-xs font-semibold uppercase tracking-wider leading-tight">
          {label}
        </span>
        <div className="w-7 h-7 rounded-lg bg-secondary/60 flex items-center justify-center
          group-hover:bg-secondary transition-colors duration-200 shrink-0">
          <Icon className="w-3.5 h-3.5 text-muted-foreground" />
        </div>
      </div>
      <span className="text-2xl sm:text-3xl font-bold text-foreground tabular-nums tracking-tight">
        {loading ? (
          <span className="inline-block w-10 h-7 bg-muted rounded-md animate-pulse" />
        ) : count.toLocaleString()}
      </span>
    </motion.div>
  );
}

export function DashboardView() {
  const navigate = useNavigate();
  const [workspaceName, setWorkspaceName] = useState("");
  const [showCreate,    setShowCreate]    = useState(false);
  const [totalDocs,     setTotalDocs]     = useState(0);
  const [queries,       setQueries]       = useState(0);
  const [statsLoading,  setStatsLoading]  = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: workspaces=[], isLoading: wsLoading, error: wsError } = useWorkspaces();
  const createMutation = useCreateWorkspace();

  useEffect(()=>{ if(wsError) toast.error("Failed to fetch workspaces"); },[wsError]);
  useEffect(()=>{ if(showCreate) inputRef.current?.focus(); },[showCreate]);

  /* Fetch stats */
  useEffect(()=>{
    if(!workspaces.length){ setTotalDocs(0); setQueries(0); return; }
    const token = localStorage.getItem("token")||"";
    setStatsLoading(true);
    (async()=>{
      let docs=0, q=0;
      const today = new Date(); today.setHours(0,0,0,0);
      for(const ws of workspaces){
        try{
          const dr = await fetch(`${API_BASE}/workspace/${ws.workspaceId}/documents`,{headers:{"Authorization":`Bearer ${token}`}});
          if(dr.ok){ const d=await dr.json(); docs+=(d.documents||[]).length; }
          const mr = await fetch(`${API_BASE}/query/memory/${ws.workspaceId}`,{headers:{"Authorization":`Bearer ${token}`}});
          if(mr.ok){
            const m=await mr.json();
            const msgs=(m.memory?.messages||[]).filter((x:any)=>x.role==="user");
            q+=msgs.length;
          }
        }catch(e){ /* skip */ }
      }
      setTotalDocs(docs); setQueries(q); setStatsLoading(false);
    })();
  },[workspaces]);

  const createWorkspace = async()=>{
    if(!workspaceName.trim()){ toast.error("Please name your workspace"); return; }
    try{
      await createMutation.mutateAsync({ workspaceName: workspaceName.trim() });
      setWorkspaceName(""); setShowCreate(false);
      toast.success("Workspace created! 🎉");
    }catch{ toast.error("Failed to create workspace"); }
  };

  const actions = [
    { title:"Playground",     desc:"Chat with your data",  icon:MessageSquare, path:"/app/playground", color:"text-emerald-500", bg:"bg-emerald-500/8",  border:"hover:border-emerald-500/25" },
    { title:"Knowledge Base", desc:"Manage documents",     icon:Database,      path:"/app/ingest",     color:"text-blue-500",    bg:"bg-blue-500/8",     border:"hover:border-blue-500/25" },
    { title:"API Access",     desc:"Integration keys",     icon:Key,           path:"/app/api-keys",   color:"text-amber-500",   bg:"bg-amber-500/8",    border:"hover:border-amber-500/25" },
  ];

  const user = (()=>{ try{ return JSON.parse(localStorage.getItem("user")||"{}"); }catch{ return {}; } })();
  const firstName = user?.name?.split(" ")[0] || "there";
  const hour = new Date().getHours();
  const greeting = hour<12?"Good morning":hour<18?"Good afternoon":"Good evening";

  return (
    <div className="min-h-full bg-background text-foreground pb-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_268px] gap-5">

          {/* ── Left column ── */}
          <main className="space-y-5 min-w-0">

            {/* Hero header */}
            <motion.header
              initial={{ opacity:0, y:-10 }}
              animate={{ opacity:1, y:0 }}
              transition={{ duration:0.5, ease:[0.22,1,0.36,1] }}
              className="space-y-2 pt-1"
            >
              <motion.div
                initial={{ opacity:0, scale:0.9 }}
                animate={{ opacity:1, scale:1 }}
                transition={{ delay:0.1 }}
                className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full
                  bg-secondary/60 border border-border/50 text-xs font-medium text-muted-foreground
                  hover:bg-secondary transition-colors duration-200 cursor-default"
              >
                <motion.div animate={{ scale:[1,1.4,1] }} transition={{ duration:2.5, repeat:Infinity }}>
                  <Sparkles className="w-3 h-3 text-primary" />
                </motion.div>
                RAG Engine v2.0
              </motion.div>

              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground leading-tight">
                <motion.span
                  initial={{ opacity:0, y:12 }}
                  animate={{ opacity:1, y:0 }}
                  transition={{ delay:0.12, duration:0.5, ease:[0.22,1,0.36,1] }}
                  className="block"
                >
                  {greeting}, {firstName}.
                </motion.span>
                <motion.span
                  initial={{ opacity:0, y:12 }}
                  animate={{ opacity:1, y:0 }}
                  transition={{ delay:0.22, duration:0.5, ease:[0.22,1,0.36,1] }}
                  className="block text-muted-foreground"
                >
                  Ready to build?
                </motion.span>
              </h1>

              <motion.p
                initial={{ opacity:0 }}
                animate={{ opacity:1 }}
                transition={{ delay:0.38 }}
                className="text-sm text-muted-foreground max-w-md leading-relaxed"
              >
                Manage your retrieval pipelines and chat with your knowledge base in real-time.
              </motion.p>
            </motion.header>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <StatCard label="Pipelines"   value={wsLoading?0:workspaces.length} loading={wsLoading}     delay={100} icon={Layers} />
              <StatCard label="Documents"   value={totalDocs}                     loading={statsLoading}   delay={200} icon={Files} />
              <StatCard label="Queries"     value={queries}                       loading={statsLoading}   delay={300} icon={TrendingUp} />
            </div>

            {/* Mobile quick actions - horizontal scroll */}
            <div className="lg:hidden">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Quick Actions</p>
              <div className="flex gap-3 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide snap-x snap-mandatory">
                {actions.map((a,i)=>{
                  const Icon=a.icon;
                  return (
                    <motion.button key={i}
                      initial={{ opacity:0, x:20 }}
                      animate={{ opacity:1, x:0 }}
                      transition={{ delay:0.15+i*0.07 }}
                      whileTap={{ scale:0.94 }}
                      onClick={()=>navigate(a.path)}
                      className="snap-start shrink-0 flex flex-col items-center gap-2.5 p-4 rounded-2xl
                        bg-card border border-border/50 card-shadow w-[110px] hover-lift"
                    >
                      <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center",a.bg,a.color)}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <p className="text-[11px] font-semibold text-foreground text-center leading-tight">{a.title}</p>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Workspaces */}
            <section className="space-y-3">
              <motion.div
                initial={{ opacity:0 }}
                animate={{ opacity:1 }}
                transition={{ delay:0.35 }}
                className="flex items-center justify-between"
              >
                <h2 className="text-base sm:text-lg font-semibold tracking-tight flex items-center gap-2">
                  <Layers className="w-4 h-4 text-muted-foreground" />
                  Workspaces
                  {!wsLoading && workspaces.length > 0 && (
                    <span className="text-xs font-normal text-muted-foreground">({workspaces.length})</span>
                  )}
                </h2>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Create card */}
                <motion.div
                  initial={{ opacity:0, scale:0.96 }}
                  animate={{ opacity:1, scale:1 }}
                  transition={{ delay:0.4, duration:0.4, ease:[0.22,1,0.36,1] }}
                  onClick={()=>!showCreate && setShowCreate(true)}
                  className={cn(
                    "relative group overflow-hidden rounded-2xl border-2 border-dashed border-border/60",
                    "hover:border-primary/50 transition-all duration-300 p-4 flex flex-col justify-between",
                    "cursor-pointer min-h-[120px] sm:min-h-[140px] bg-muted/5 hover:bg-muted/10",
                    showCreate && "border-primary ring-1 ring-primary/20 bg-background"
                  )}
                >
                  <AnimatePresence mode="wait">
                    {!showCreate ? (
                      <motion.div key="btn"
                        initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0, scale:0.95 }}
                        className="flex flex-col justify-between h-full gap-3"
                      >
                        <div className="w-10 h-10 rounded-xl bg-background border border-border shadow-sm
                          flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                          <Plus className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm text-foreground">Create New</h3>
                          <p className="text-xs text-muted-foreground">Start a new workspace</p>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div key="form"
                        initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }}
                        className="h-full flex flex-col justify-center"
                      >
                        <label className="text-[10px] font-semibold text-primary mb-1.5 uppercase tracking-wider">Name</label>
                        <input ref={inputRef}
                          type="text" value={workspaceName}
                          onChange={e=>setWorkspaceName(e.target.value)}
                          onKeyDown={e=>{ if(e.key==="Enter") createWorkspace(); if(e.key==="Escape"){ setShowCreate(false); setWorkspaceName(""); } }}
                          placeholder="e.g. Finance Bot"
                          className="w-full bg-transparent text-base font-semibold placeholder:text-muted-foreground/30 focus:outline-none mb-3"
                        />
                        <div className="flex gap-2">
                          <button onClick={e=>{e.stopPropagation();createWorkspace();}}
                            disabled={createMutation.isPending}
                            className="px-3 py-1.5 bg-primary text-primary-foreground text-xs font-semibold rounded-full
                              hover:opacity-90 active:scale-95 disabled:opacity-50 transition-all">
                            {createMutation.isPending ? "Creating…" : "Create"}
                          </button>
                          <button onClick={e=>{e.stopPropagation();setShowCreate(false);setWorkspaceName("");}}
                            className="px-3 py-1.5 text-muted-foreground text-xs font-medium hover:text-foreground transition-colors">
                            Cancel
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Skeletons */}
                {wsLoading && Array.from({length:2}).map((_,i)=>(
                  <div key={i} className="rounded-2xl bg-card border border-border/50 p-4 min-h-[120px] sm:min-h-[140px]">
                    <div className="flex justify-between mb-auto">
                      <div className="w-8 h-8 rounded-xl bg-muted animate-pulse" />
                      <div className="w-6 h-6 rounded-full bg-muted animate-pulse" />
                    </div>
                    <div className="mt-auto space-y-1.5 pt-8">
                      <div className="h-3 bg-muted rounded animate-pulse" style={{animationDelay:`${i*80}ms`}} />
                      <div className="h-2.5 bg-muted rounded w-2/3 animate-pulse" style={{animationDelay:`${i*80+60}ms`}} />
                    </div>
                  </div>
                ))}

                {/* Workspace cards */}
                {!wsLoading && workspaces.map((ws,idx)=>(
                  <motion.div key={ws.workspaceId}
                    initial={{ opacity:0, y:16 }}
                    animate={{ opacity:1, y:0 }}
                    transition={{ delay:0.45+idx*0.06, duration:0.4, ease:[0.22,1,0.36,1] }}
                    whileTap={{ scale:0.97 }}
                    className="group relative overflow-hidden rounded-2xl bg-card border border-border/50 p-4
                      flex flex-col justify-between min-h-[120px] sm:min-h-[140px] cursor-pointer
                      hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 hover:-translate-y-1
                      transition-all duration-300"
                  >
                    <div className="flex justify-between items-start">
                      <div className="w-9 h-9 rounded-xl bg-secondary/60 flex items-center justify-center
                        text-foreground font-bold text-sm group-hover:scale-110 transition-transform duration-300">
                        {(ws.workspaceName||"W").charAt(0).toUpperCase()}
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-all duration-200">
                        <div className="p-1.5 rounded-full bg-background border border-border shadow-sm">
                          <ArrowUpRight className="w-3 h-3" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground mb-1 group-hover:text-primary transition-colors truncate">
                        {ws.workspaceName||"Unnamed"}
                      </h3>
                      <p className="text-xs text-muted-foreground font-mono">
                        {(ws.workspaceId||"unknown").slice(0,10)}…
                      </p>
                    </div>
                    <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-primary/5 blur-2xl rounded-full
                      group-hover:bg-primary/10 group-hover:scale-150 transition-all duration-500 pointer-events-none" />
                  </motion.div>
                ))}
              </div>
            </section>
          </main>

          {/* ── Right column (desktop only) ── */}
          <aside className="hidden lg:flex flex-col space-y-4 pt-1">

            {/* Quick actions */}
            <motion.div
              initial={{ opacity:0, x:16 }}
              animate={{ opacity:1, x:0 }}
              transition={{ delay:0.3, duration:0.5, ease:[0.22,1,0.36,1] }}
              className="bg-card/50 backdrop-blur-sm rounded-2xl p-2 border border-border/50"
            >
              {actions.map((a,i)=>{
                const Icon=a.icon;
                return (
                  <motion.button key={i}
                    initial={{ opacity:0, x:12 }}
                    animate={{ opacity:1, x:0 }}
                    transition={{ delay:0.35+i*0.06 }}
                    whileTap={{ scale:0.97 }}
                    onClick={()=>navigate(a.path)}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group",
                      "hover:bg-background border border-transparent hover:shadow-sm",
                      a.border
                    )}
                  >
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 group-hover:scale-110",a.bg,a.color)}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="text-left flex-1">
                      <h4 className="font-semibold text-foreground text-sm">{a.title}</h4>
                      <p className="text-xs text-muted-foreground">{a.desc}</p>
                    </div>
                    <ArrowUpRight className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100
                      group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
                  </motion.button>
                );
              })}
            </motion.div>

            {/* System health */}
            <motion.div
              initial={{ opacity:0, x:16 }}
              animate={{ opacity:1, x:0 }}
              transition={{ delay:0.5, duration:0.5, ease:[0.22,1,0.36,1] }}
              className="rounded-2xl border border-border/50 bg-card p-4 space-y-3"
            >
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" />
                <h3 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">System Health</h3>
              </div>
              {[
                { label:"Vector Database", status:"Operational", pct:100, color:"bg-emerald-500", textColor:"text-emerald-500" },
                { label:"API Latency",     status:"45ms",        pct:85,  color:"bg-primary",     textColor:"text-foreground" },
              ].map((item,i)=>(
                <div key={item.label} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className={cn("font-medium",item.textColor)}>{item.status}</span>
                  </div>
                  <div className="h-1 w-full bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width:0 }}
                      animate={{ width:`${item.pct}%` }}
                      transition={{ delay:0.6+i*0.15, duration:0.9, ease:[0.22,1,0.36,1] }}
                      className={cn("h-full rounded-full",item.color)}
                    />
                  </div>
                </div>
              ))}
              <div className="pt-2 border-t border-border/50">
                <button className="w-full py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground
                  hover:bg-secondary rounded-lg transition-colors duration-200">
                  View System Logs →
                </button>
              </div>
            </motion.div>

            {/* Upgrade card */}
            <motion.div
              initial={{ opacity:0, x:16 }}
              animate={{ opacity:1, x:0 }}
              transition={{ delay:0.65, duration:0.5, ease:[0.22,1,0.36,1] }}
              className="rounded-xl bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-transparent
                p-4 border border-indigo-500/10 group hover:from-indigo-500/15 transition-all duration-300"
            >
              <motion.div className="w-4 h-4 text-indigo-500 mb-1.5" whileHover={{ rotate:[0,-15,15,0] }} transition={{ duration:0.4 }}>
                <Zap className="w-4 h-4 text-indigo-500" />
              </motion.div>
              <h4 className="font-semibold text-sm mb-1">Upgrade Plan</h4>
              <p className="text-xs text-muted-foreground mb-3 leading-relaxed">Unlock unlimited vectors and team collaboration.</p>
              <button className="text-xs font-semibold bg-background text-foreground px-3 py-1.5 rounded-lg
                border border-border shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                View Plans →
              </button>
            </motion.div>
          </aside>
        </div>

        {/* Mobile-only: status + upgrade below workspaces */}
        <div className="lg:hidden mt-5 space-y-3">
          <motion.div
            initial={{ opacity:0, y:14 }}
            animate={{ opacity:1, y:0 }}
            transition={{ delay:0.55 }}
            className="rounded-2xl border border-border/50 bg-card p-4 space-y-3"
          >
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">System Health</h3>
              <span className="ml-auto flex items-center gap-1.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> All systems go
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label:"Vector DB",    status:"Operational", pct:100, color:"bg-emerald-500", textColor:"text-emerald-600" },
                { label:"API Latency",  status:"45ms",        pct:85,  color:"bg-primary",     textColor:"text-foreground" },
              ].map((item,i)=>(
                <div key={item.label} className="space-y-1">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className={cn("font-semibold",item.textColor)}>{item.status}</span>
                  </div>
                  <div className="h-1 bg-secondary rounded-full overflow-hidden">
                    <motion.div initial={{width:0}} animate={{width:`${item.pct}%`}}
                      transition={{delay:0.65+i*0.1,duration:0.8,ease:[0.22,1,0.36,1]}}
                      className={cn("h-full rounded-full",item.color)} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity:0, y:14 }}
            animate={{ opacity:1, y:0 }}
            transition={{ delay:0.65 }}
            className="rounded-xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-transparent
              p-4 border border-indigo-500/10 flex items-center gap-4"
          >
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <Zap className="w-3.5 h-3.5 text-indigo-500" />
                <h4 className="font-semibold text-sm">Upgrade Plan</h4>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">Unlimited vectors & team collab.</p>
            </div>
            <button className="ml-auto shrink-0 text-xs font-semibold bg-background text-foreground
              px-3 py-2 rounded-lg border border-border shadow-sm whitespace-nowrap active:scale-95 transition-all">
              View Plans →
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
