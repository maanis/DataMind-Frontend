import { ThemeProvider } from "next-themes";
import { Sidebar } from "@/components/layout/Sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutDashboard, Database, Key,
  BarChart3, MessageSquare, Files, Layers,
  Settings, LogOut, ChevronRight, User,
} from "lucide-react";
import { cn } from "@/lib/utils";

const BOTTOM_TABS = [
  { id: "dashboard",  label: "Home",   icon: LayoutDashboard },
  { id: "ingest",     label: "Ingest", icon: Database },
  { id: "playground", label: "Chat",   icon: MessageSquare },
  { id: "documents",  label: "Docs",   icon: Files },
  { id: "api-keys",   label: "API",    icon: Key },
];

/* ── Profile avatar initial ── */
function getInitial(name?: string, email?: string) {
  if (name?.trim()) return name.trim()[0].toUpperCase();
  if (email?.trim()) return email.trim()[0].toUpperCase();
  return "U";
}

export default function Index() {
  const [isMobile, setIsMobile]       = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const location   = useLocation();
  const navigate   = useNavigate();

  /* ── Responsive detection ── */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* ── Close profile dropdown on outside click ── */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    if (profileOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [profileOpen]);

  /* ── Close dropdown on route change ── */
  useEffect(() => { setProfileOpen(false); }, [location.pathname]);

  /* ── User data ── */
  const user = (() => {
    try { return JSON.parse(localStorage.getItem("user") || "{}"); }
    catch { return {}; }
  })();
  const initial = getInitial(user?.name, user?.email);
  const displayName = user?.name || user?.email?.split("@")[0] || "User";
  const email = user?.email || "";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleTabPress = useCallback((id: string) => {
    navigate(`/app/${id}`);
  }, [navigate]);

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <div className="w-full h-[100dvh] overflow-hidden relative bg-background">

        {/* ══ DESKTOP: Static theme toggle ══ */}
        {!isMobile && (
          <header className="fixed top-4 right-8 z-30">
            <ThemeToggle />
          </header>
        )}

        {/* ══ MOBILE: Top bar ══ */}
        {isMobile && (
          <motion.header
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 left-0 right-0 z-40 safe-top"
            style={{ height: 56 }}
          >
            <div className="h-full glass-panel border-b border-border/40 flex items-center justify-between px-4">

              {/* ── Profile avatar (top-left) ── */}
              <div ref={profileRef} className="relative">
                <motion.button
                  whileTap={{ scale: 0.88 }}
                  onClick={() => setProfileOpen(o => !o)}
                  className="relative w-9 h-9 rounded-xl bg-foreground flex items-center justify-center
                             shadow-sm active:opacity-80 transition-opacity select-none"
                  aria-label="Profile menu"
                  aria-expanded={profileOpen}
                >
                  <span className="text-background text-sm font-bold leading-none">{initial}</span>
                  {/* Online dot */}
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500
                                   border-2 border-background shadow-sm" />
                </motion.button>

                {/* ── Profile dropdown ── */}
                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.92, y: -8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.92, y: -8 }}
                      transition={{ type: "spring", stiffness: 380, damping: 28, mass: 0.7 }}
                      className="absolute top-[calc(100%+10px)] left-0 z-50 w-64 origin-top-left"
                      style={{ willChange: "transform, opacity" }}
                    >
                      {/* Arrow */}
                      <div className="absolute -top-1.5 left-3.5 w-3 h-3 rotate-45
                                      bg-card border-l border-t border-border/60 rounded-sm" />

                      <div className="relative bg-card border border-border/60 rounded-2xl shadow-2xl
                                      overflow-hidden backdrop-blur-sm">
                        {/* Top shimmer */}
                        <div className="h-px w-full bg-gradient-to-r from-transparent via-foreground/15 to-transparent" />

                        {/* User info header */}
                        <div className="px-4 py-3.5 border-b border-border/50">
                          <div className="flex items-center gap-3">
                            {/* Avatar */}
                            <div className="w-10 h-10 rounded-xl bg-foreground flex items-center justify-center shrink-0 shadow-sm">
                              <span className="text-background text-sm font-bold">{initial}</span>
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold text-foreground truncate">{displayName}</p>
                              {email && (
                                <p className="text-[11px] text-muted-foreground truncate mt-0.5">{email}</p>
                              )}
                            </div>
                            {/* Online badge */}
                            <span className="shrink-0 flex items-center gap-1 text-[9px] font-semibold
                                             text-emerald-700 dark:text-emerald-400 bg-emerald-500/12
                                             border border-emerald-500/25 px-1.5 py-0.5 rounded-full">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              Active
                            </span>
                          </div>
                        </div>

                        {/* Menu items */}
                        <div className="p-1.5 space-y-0.5">
                          <motion.button
                            whileTap={{ scale: 0.97 }}
                            onClick={() => setProfileOpen(false)}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm
                                       text-muted-foreground hover:text-foreground hover:bg-secondary/70
                                       transition-all duration-150 group"
                          >
                            <div className="w-7 h-7 rounded-lg bg-secondary/80 flex items-center justify-center
                                            group-hover:bg-secondary transition-colors shrink-0">
                              <Settings className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform duration-300" />
                            </div>
                            <span className="font-medium flex-1 text-left">Settings</span>
                            <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100
                                                     group-hover:translate-x-0.5 transition-all duration-150" />
                          </motion.button>

                          {/* Divider */}
                          <div className="h-px bg-border/50 mx-2 my-1" />

                          <motion.button
                            whileTap={{ scale: 0.97 }}
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm
                                       text-muted-foreground hover:text-destructive hover:bg-destructive/8
                                       transition-all duration-150 group"
                          >
                            <div className="w-7 h-7 rounded-lg bg-secondary/80 flex items-center justify-center
                                            group-hover:bg-destructive/12 transition-colors shrink-0">
                              <LogOut className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform duration-200" />
                            </div>
                            <span className="font-medium flex-1 text-left">Log out</span>
                          </motion.button>
                        </div>

                        {/* Bottom shimmer */}
                        <div className="h-px w-full bg-gradient-to-r from-transparent via-foreground/8 to-transparent" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* ── Center wordmark ── */}
              <div className="flex items-center gap-2 select-none pointer-events-none">
                <div className="w-7 h-7 rounded-lg bg-foreground flex items-center justify-center shadow-sm">
                  <Layers className="w-3.5 h-3.5 text-background" strokeWidth={2.5} />
                </div>
                <span className="font-semibold text-sm tracking-tight text-foreground">DataMind AI</span>
              </div>

              {/* ── Right: theme toggle ── */}
              <ThemeToggle />
            </div>
          </motion.header>
        )}

        {/* ══ MAIN LAYOUT ══ */}
        <main className={cn(
          "h-full flex",
          isMobile ? "flex-col pt-14 pb-[68px]" : "gap-5 p-5"
        )}>
          {/* Desktop sidebar */}
          {!isMobile && <Sidebar onNavigate={() => {}} />}

          {/* Content area */}
          <div className={cn(
            "flex-1 min-w-0 overflow-y-auto scrollbar-thin scroll-touch",
            isMobile && "px-4 py-3"
          )}>
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: isMobile ? 12 : 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="h-full"
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        {/* ══ MOBILE: Bottom tab bar ══ */}
        {isMobile && (
          <motion.nav
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-0 left-0 right-0 z-40 safe-bottom"
            style={{ height: 64 }}
          >
            <div className="h-full glass-panel border-t border-border/40 flex items-center px-1">
              {BOTTOM_TABS.map(({ id, label, icon: Icon }) => {
                const active = location.pathname === `/app/${id}`;
                return (
                  <button
                    key={id}
                    onClick={() => handleTabPress(id)}
                    className="flex-1 flex flex-col items-center justify-center gap-[3px] py-1 h-full
                               rounded-xl active:bg-muted/40 transition-colors duration-100 relative"
                  >
                    {/* Sliding active pill */}
                    {active && (
                      <motion.div
                        layoutId="tab-indicator"
                        className="absolute inset-x-1 top-1 bottom-1 rounded-xl bg-foreground/[0.07] dark:bg-foreground/[0.12]"
                        transition={{ type: "spring", stiffness: 420, damping: 32 }}
                      />
                    )}

                    {/* Icon */}
                    <motion.div
                      animate={active ? { scale: 1.15, y: -1 } : { scale: 1, y: 0 }}
                      transition={{ type: "spring", stiffness: 420, damping: 24 }}
                      className="relative z-10"
                    >
                      <Icon
                        className={cn(
                          "w-5 h-5 transition-colors duration-200",
                          active ? "text-foreground" : "text-muted-foreground"
                        )}
                        strokeWidth={active ? 2.2 : 1.8}
                      />
                    </motion.div>

                    {/* Label */}
                    <span className={cn(
                      "text-[9px] font-medium tracking-wide transition-colors duration-200 relative z-10",
                      active ? "text-foreground" : "text-muted-foreground"
                    )}>
                      {label}
                    </span>

                    {/* Active dot */}
                    {active && (
                      <motion.span
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="absolute bottom-[5px] left-1/2 -translate-x-1/2 w-[3px] h-[3px] rounded-full bg-foreground z-10"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.nav>
        )}

        {/* ══ Backdrop for profile dropdown on mobile ══ */}
        <AnimatePresence>
          {isMobile && profileOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="fixed inset-0 z-30 bg-black/20"
              onClick={() => setProfileOpen(false)}
            />
          )}
        </AnimatePresence>

      </div>
    </ThemeProvider>
  );
}
