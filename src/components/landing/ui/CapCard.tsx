import { useState } from "react";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export function CapCard({
  icon: Icon,
  title,
  description,
  badge,
  color,
  bg,
  border,
  children,
  delay = 0,
  wide = false,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  badge?: string;
  color: string;
  bg: string;
  border: string;
  children?: React.ReactNode;
  delay?: number;
  wide?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [hov, setHov] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ gridColumn: wide ? "span 2" : undefined }}
      className={`relative bg-card border rounded-2xl p-6 overflow-hidden cursor-default
        transition-all duration-300 hover:-translate-y-1
        hover:shadow-xl hover:shadow-foreground/[0.04]
        ${hov ? "border-border" : "border-border/60"}`}
    >
      {/* Top accent line on hover */}
      <motion.div
        animate={{ scaleX: hov ? 1 : 0, opacity: hov ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className={`absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl ${bg} origin-left`}
      />

      <div className="flex items-start gap-4 mb-4">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${bg} border ${border}`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <h3 className="text-base font-semibold text-foreground leading-tight">{title}</h3>
            {badge && (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${bg} ${color} border ${border}`}>
                {badge}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        </div>
      </div>

      {children && <div className="mt-1">{children}</div>}

      <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-foreground/[0.025] blur-xl pointer-events-none" />
    </motion.div>
  );
}
