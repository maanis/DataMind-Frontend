import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Check, Star } from "lucide-react";
import { DotGrid } from "../ui/Backgrounds";
import { Reveal } from "../ui/Reveal";

export function CtaSection() {
  const navigate = useNavigate();
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-foreground/[0.02] pointer-events-none" />
      <DotGrid opacity={0.3} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
        w-[600px] h-[350px] bg-foreground/[0.04] rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <Reveal>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/80
            border border-border/60 text-xs font-medium text-muted-foreground mb-6">
            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
            Free to start. No credit card.
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold text-foreground tracking-tight mb-5 leading-tight">
            Give your team an AI<br />
            <span className="text-muted-foreground">that actually does things.</span>
          </h2>

          <p className="text-base text-muted-foreground leading-relaxed mb-10 max-w-xl mx-auto">
            Create your first workspace, connect your documents and data sources, and let your
            team ask questions in plain English. Ship your first agent in under an hour.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/signup")}
              className="group flex items-center gap-2 px-7 py-4 bg-foreground text-background
                font-semibold text-sm rounded-xl shadow-lg hover:opacity-90 transition-all
                w-full sm:w-auto justify-center"
            >
              Create free account
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </motion.button>
            <button
              onClick={() => navigate("/login")}
              className="px-7 py-4 text-sm font-medium text-muted-foreground border border-border/70
                rounded-xl hover:text-foreground hover:bg-secondary/60 transition-all w-full sm:w-auto"
            >
              Already have an account →
            </button>
          </div>

          <div className="flex items-center justify-center gap-6 flex-wrap">
            {["No setup fees", "Cancel anytime", "REST API included", "5 agents out of the box"].map((t) => (
              <div key={t} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />{t}
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
