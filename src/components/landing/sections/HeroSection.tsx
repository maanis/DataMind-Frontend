import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, Sparkles, Network } from "lucide-react";
import { AgentFlowDiagram } from "../animations/AgentFlowDiagram";
import { IntentClassifier } from "../animations/IntentClassifier";

export function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-20 overflow-hidden bg-white dark:bg-black transition-colors duration-500">
      
      {/* Background Grid & Neon Glows */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Subtle dot matrix grid that adapts to light/dark */}
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        
        {/* Vivid glowing orbs that pop perfectly against true black */}
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/20 dark:bg-purple-600/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse duration-1000" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-blue-500/20 dark:bg-blue-600/20 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-center">
          
          {/* LEFT: Typography & Calls to Action */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex flex-col items-start text-left"
          >
            {/* Glowing Neon Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/30 mb-8 shadow-[0_0_15px_rgba(168,85,247,0.1)] dark:shadow-[0_0_20px_rgba(168,85,247,0.2)]">
              <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="text-xs font-semibold text-purple-900 dark:text-purple-300 uppercase tracking-wider">
                Agentic Architecture
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-zinc-900 dark:text-white leading-[1.05] mb-6">
              Beyond simple <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400">
                retrieval.
              </span>
            </h1>

            <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed mb-10 max-w-lg font-light">
              DataMind AI classifies user intent in milliseconds, routing complex queries to specialized agents. Query databases, automate tasks, and fetch documents through a single stream.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <button
                onClick={() => navigate("/signup")}
                className="group flex items-center justify-center gap-2 px-8 py-4 bg-zinc-900 dark:bg-white text-white dark:text-black font-semibold rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                Start building free
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => navigate("/login")}
                className="flex items-center justify-center px-8 py-4 bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white font-medium rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-800 backdrop-blur-md transition-all"
              >
                View Documentation
              </button>
            </div>
          </motion.div>

          {/* RIGHT: Cascading Glass Cards */}
          <div className="lg:col-span-7 relative h-[600px] w-full mt-10 lg:mt-0">
            
            {/* Background Glow specifically for the cards */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-gradient-to-tr from-purple-500/10 to-blue-500/10 dark:from-purple-500/20 dark:to-blue-500/20 rounded-full blur-[80px]" />

            {/* Top Card (Agent Routing) */}
            <motion.div
              initial={{ opacity: 0, x: 40, y: -20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ delay: 0.3, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-0 right-0 w-[85%] sm:w-[75%] p-6 sm:p-8 rounded-3xl bg-white/70 dark:bg-zinc-950/60 border border-zinc-200 dark:border-white/10 backdrop-blur-2xl shadow-2xl z-20 group hover:border-purple-500/50 transition-colors duration-500"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                    <Network className="w-4 h-4 text-zinc-900 dark:text-white" />
                  </div>
                  <h3 className="text-sm font-medium text-zinc-900 dark:text-white">Active Routing</h3>
                </div>
                <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
              </div>
              <div className="w-full h-[220px] flex items-center justify-center opacity-90 group-hover:opacity-100 transition-opacity">
                <AgentFlowDiagram />
              </div>
            </motion.div>

            {/* Bottom Card (Intent Classifier) */}
            <motion.div
              initial={{ opacity: 0, x: -40, y: 40 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ delay: 0.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="absolute bottom-4 left-0 w-[85%] sm:w-[75%] p-6 sm:p-8 rounded-3xl bg-white/70 dark:bg-zinc-950/60 border border-zinc-200 dark:border-white/10 backdrop-blur-2xl shadow-2xl z-10 group hover:border-blue-500/50 transition-colors duration-500"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-medium text-zinc-900 dark:text-white flex items-center gap-2">
                  <span className="text-blue-600 dark:text-blue-400 font-mono text-xs border border-blue-200 dark:border-blue-500/30 bg-blue-50 dark:bg-blue-500/10 px-2 py-1 rounded">LIVE</span>
                  Intent Stream
                </h3>
              </div>
              <div className="w-full h-[220px] flex items-center justify-center opacity-90 group-hover:opacity-100 transition-opacity">
                <IntentClassifier />
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}