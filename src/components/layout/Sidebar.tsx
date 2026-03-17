import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Database, Key, BarChart3,
  MessageSquare, Settings, Layers, LogOut, Files,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { id: "dashboard",  label: "Dashboard",  icon: LayoutDashboard },
  { id: "ingest",     label: "Ingest Data", icon: Database },
  { id: "documents",  label: "Documents",   icon: Files },
  { id: "api-keys",   label: "API Keys",    icon: Key },
  { id: "usage",      label: "API Usage",   icon: BarChart3 },
  { id: "playground", label: "Playground",  icon: MessageSquare },
];

interface SidebarProps {
  onNavigate?: () => void;
  isMobile?: boolean;
}

export function Sidebar({ onNavigate, isMobile }: SidebarProps) {
  const location  = useLocation();
  const navigate  = useNavigate();
  const [usage]   = useState(67);
  const [settingsHovered, setSettingsHovered] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <aside className={cn(
      "flex flex-col bg-[hsl(var(--sidebar-background))]",
      isMobile
        ? "w-full h-full pt-10 rounded-none"
        : "w-64 rounded-2xl floating-panel"
    )}>
      {/* ── Logo ── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-3 px-4 py-3 mb-5"
      >
        <motion.div
          whileHover={{ rotate: [0, -6, 6, 0], scale: 1.08 }}
          transition={{ duration: 0.4 }}
          className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center shadow-sm cursor-default"
        >
          <Layers className="w-4 h-4 text-background" />
        </motion.div>
        <span className="font-semibold text-foreground tracking-tight">DataMind AI</span>
      </motion.div>

      {/* ── Nav items ── */}
      <nav className="flex-1 px-2 space-y-0.5">
        {NAV_ITEMS.map((item, idx) => {
          const isActive = location.pathname === `/app/${item.id}`;
          const Icon = item.icon;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.045, duration: 0.35, ease: [0.22,1,0.36,1] }}
            >
              <Link
                to={`/app/${item.id}`}
                onClick={onNavigate}
                className={cn(
                  "relative flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium",
                  "transition-colors duration-150 group overflow-hidden",
                  isActive
                    ? "bg-nav-active text-nav-active-foreground pressed-in"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-foreground active:scale-[0.98]"
                )}
              >
                {/* Active left bar */}
                {isActive && (
                  <motion.span
                    layoutId="sidebar-active-bar"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-nav-active-foreground/50"
                    transition={{ type: "spring", stiffness: 380, damping: 28 }}
                  />
                )}

                {/* Icon */}
                <Icon className={cn(
                  "w-[17px] h-[17px] shrink-0 transition-all duration-200",
                  !isActive && "group-hover:scale-110 group-hover:-rotate-3"
                )} />

                {item.label}

                {/* Shimmer hover */}
                {!isActive && (
                  <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%]
                    bg-gradient-to-r from-transparent via-foreground/[0.04] to-transparent
                    transition-transform duration-500 pointer-events-none" />
                )}
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* ── Bottom section ── */}
      <div className="px-2 pt-4 pb-2 border-t border-sidebar-border space-y-1">
        {/* Usage bar */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="px-3 py-2.5 rounded-xl bg-secondary/40 mb-2"
        >
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-muted-foreground">API Requests</span>
            <span className="font-semibold text-foreground tabular-nums">{usage}%</span>
          </div>
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${usage}%` }}
              transition={{ delay: 0.5, duration: 1.2, ease: [0.22,1,0.36,1] }}
              className="h-full bg-foreground rounded-full"
            />
          </div>
          <p className="text-[10px] text-muted-foreground mt-1.5">6,700 / 10,000 requests</p>
        </motion.div>

        {/* Settings */}
        <button
          onMouseEnter={() => setSettingsHovered(true)}
          onMouseLeave={() => setSettingsHovered(false)}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm
            text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-foreground
            transition-all duration-200 group active:scale-[0.98]"
        >
          <motion.div animate={settingsHovered ? { rotate: 90 } : { rotate: 0 }} transition={{ duration: 0.3 }}>
            <Settings className="w-[17px] h-[17px]" />
          </motion.div>
          Settings
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm
            text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive
            transition-all duration-200 group active:scale-[0.98]"
        >
          <LogOut className="w-[17px] h-[17px] group-hover:-translate-x-0.5 transition-transform duration-200" />
          Logout
        </button>
      </div>
    </aside>
  );
}
