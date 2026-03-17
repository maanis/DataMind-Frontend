import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronRight, Menu, X, Layers } from "lucide-react";
import { ThemeToggleBtn } from "../ui/ThemeToggleBtn";

const NAV_LINKS = [
  { label: "How it works",   href: "#how-it-works" },
  { label: "Capabilities",   href: "#capabilities" },
  { label: "For developers", href: "#developers" },
];

export function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen]   = useState(false);
  const [scrolled, setScrolled]   = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const prevY = useRef(0);

  useEffect(() => {
    const fn = () => {
      const y = window.scrollY;
      setScrolled(y > 50);
      setNavHidden(y > prevY.current && y > 160);
      prevY.current = y;
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <motion.header
      animate={{ y: navHidden ? -88 : 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 pointer-events-none"
    >
      <div className={`transition-all duration-300 ${scrolled ? "py-2" : "py-4"} pointer-events-auto`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className={`flex items-center justify-between px-4 sm:px-5 rounded-2xl
            transition-all duration-300
            ${scrolled
              ? "py-2.5 bg-background/92 backdrop-blur-xl border border-border/60 shadow-lg shadow-foreground/[0.04]"
              : "py-3 bg-transparent"}`}
          >
            {/* Logo */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex items-center gap-2.5 shrink-0"
            >
              <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center shadow-sm">
                <Layers className="w-4 h-4 text-background" strokeWidth={2.5} />
              </div>
              <span className="font-bold text-base text-foreground tracking-tight">DataMind AI</span>
            </button>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((l) => (
                <a key={l.label} href={l.href}
                  className="px-3.5 py-2 rounded-xl text-sm font-medium text-muted-foreground
                    hover:text-foreground hover:bg-secondary/70 transition-all duration-200">
                  {l.label}
                </a>
              ))}
            </nav>

            {/* Right */}
            <div className="flex items-center gap-2">
              <ThemeToggleBtn />
              <button onClick={() => navigate("/login")}
                className="hidden md:block px-3.5 py-2 text-sm font-medium text-muted-foreground
                  hover:text-foreground transition-colors">
                Sign in
              </button>
              <motion.button whileTap={{ scale: 0.96 }} onClick={() => navigate("/signup")}
                className="hidden md:flex items-center gap-1.5 px-4 py-2 text-sm font-semibold
                  bg-foreground text-background rounded-xl hover:opacity-90 transition-opacity shadow-sm">
                Get started <ArrowRight className="w-3.5 h-3.5" />
              </motion.button>
              <button onClick={() => setMenuOpen((o) => !o)}
                className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors">
                {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div key="bg"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
              onClick={() => setMenuOpen(false)} />
            <motion.div key="panel"
              initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
              transition={{ type: "spring", stiffness: 360, damping: 30 }}
              className="fixed top-20 left-4 right-4 z-50 bg-card border border-border/60
                rounded-2xl p-3 shadow-2xl md:hidden">
              {NAV_LINKS.map((l) => (
                <a key={l.label} href={l.href} onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium
                    text-muted-foreground hover:text-foreground hover:bg-secondary/70 transition-all">
                  {l.label}<ChevronRight className="w-4 h-4 opacity-50" />
                </a>
              ))}
              <div className="border-t border-border/50 mt-2 pt-2 space-y-2">
                <button onClick={() => { navigate("/login"); setMenuOpen(false); }}
                  className="w-full py-3 text-sm font-medium text-muted-foreground
                    hover:text-foreground rounded-xl hover:bg-secondary/70 transition-all">
                  Sign in
                </button>
                <button onClick={() => { navigate("/signup"); setMenuOpen(false); }}
                  className="w-full py-3 text-sm font-semibold bg-foreground text-background
                    rounded-xl hover:opacity-90 transition-opacity">
                  Get started free →
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
