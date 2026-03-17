import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeProvider } from "next-themes";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Loader2, Eye, EyeOff, Layers, ArrowRight, X as XIcon } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { API_BASE_URL } from "@/config/api";

export function Signup() {
  const [form, setForm] = useState({ name:"", email:"", password:"", confirmPassword:"" });
  const [showPw,  setShowPw]  = useState(false);
  const [showCpw, setShowCpw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<string|null>(null);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  useEffect(()=>{ setTimeout(()=>setMounted(true),60); },[]);

  const handle = (e:React.ChangeEvent<HTMLInputElement>) =>
    setForm(f=>({...f,[e.target.name]:e.target.value}));

  const submit = async(e:React.FormEvent)=>{
    e.preventDefault();
    if(form.password !== form.confirmPassword){ toast.error("Passwords don't match."); return; }
    setLoading(true);
    try{
      const res = await fetch(`${API_BASE_URL}/api/auth/register`,{
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ name:form.name, email:form.email, password:form.password }),
      });
      const data = await res.json();
      if(res.ok){
        localStorage.setItem("token",data.token);
        localStorage.setItem("user",JSON.stringify(data.user));
        navigate("/app/dashboard");
      } else { toast.error(data.message||"Unable to create account."); }
    }catch{ toast.error("Unable to connect to the server."); }
    finally{ setLoading(false); }
  };

  const fieldStyle = (id:string) =>
    `rounded-xl border transition-all duration-200 ${focused===id?"border-foreground/40 bg-background shadow-sm":"border-border bg-secondary/30 hover:border-border/80"}`;

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <div className="min-h-screen bg-background overflow-hidden relative flex items-center justify-center p-4 py-10">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full opacity-[0.06] animate-float-slow"
            style={{ background:"radial-gradient(circle, hsl(var(--foreground)), transparent 65%)", animationDelay:"0.5s" }} />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full opacity-[0.04] animate-float"
            style={{ background:"radial-gradient(circle, hsl(var(--foreground)), transparent 65%)", animationDelay:"2s" }} />
          <svg className="absolute inset-0 w-full h-full opacity-[0.025]" xmlns="http://www.w3.org/2000/svg">
            <defs><pattern id="dots-signup" width="28" height="28" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="currentColor"/></pattern></defs>
            <rect width="100%" height="100%" fill="url(#dots-signup)" />
          </svg>
        </div>

        <header className="fixed top-4 right-6 z-10"><ThemeToggle /></header>

        <motion.div
          initial={{ opacity:0, y:24, scale:0.97 }}
          animate={mounted?{ opacity:1, y:0, scale:1 }:{}}
          transition={{ duration:0.6, ease:[0.22,1,0.36,1] }}
          className="w-full max-w-[400px] relative"
        >
          <div className="absolute -inset-4 rounded-3xl bg-foreground/[0.03] blur-3xl pointer-events-none" />
          <div className="relative bg-card border border-border/60 rounded-2xl shadow-2xl overflow-hidden">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-foreground/20 to-transparent" />
            <div className="p-7 sm:p-8">
              <div className="flex flex-col items-center mb-7">
                <motion.div whileHover={{ rotate:[0,8,-8,0], scale:1.1 }} transition={{ duration:0.45 }}
                  className="w-12 h-12 rounded-2xl bg-foreground flex items-center justify-center mb-4 shadow-lg cursor-default">
                  <Layers className="w-6 h-6 text-background" />
                </motion.div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">Create account</h1>
                <p className="text-sm text-muted-foreground mt-1">Get started with DataMind AI</p>
              </div>

              <form onSubmit={submit} className="space-y-3.5">
                {/* Name */}
                <div className="space-y-1.5">
                  <Label htmlFor="name" className={`text-xs font-semibold uppercase tracking-wider transition-colors ${focused==="name"?"text-foreground":"text-muted-foreground"}`}>Full Name</Label>
                  <div className={fieldStyle("name")}>
                    <Input id="name" name="name" type="text" placeholder="John Smith"
                      value={form.name} onChange={handle}
                      onFocus={()=>setFocused("name")} onBlur={()=>setFocused(null)} required
                      className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 h-11 px-4 text-sm" />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <Label htmlFor="email" className={`text-xs font-semibold uppercase tracking-wider transition-colors ${focused==="email"?"text-foreground":"text-muted-foreground"}`}>Email</Label>
                  <div className={fieldStyle("email")}>
                    <Input id="email" name="email" type="email" placeholder="you@company.com"
                      value={form.email} onChange={handle}
                      onFocus={()=>setFocused("email")} onBlur={()=>setFocused(null)} required
                      className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 h-11 px-4 text-sm" />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <Label htmlFor="password" className={`text-xs font-semibold uppercase tracking-wider transition-colors ${focused==="password"?"text-foreground":"text-muted-foreground"}`}>Password</Label>
                  <div className={`relative ${fieldStyle("password")}`}>
                    <Input id="password" name="password" type={showPw?"text":"password"}
                      placeholder="Create a password" value={form.password} onChange={handle}
                      onFocus={()=>setFocused("password")} onBlur={()=>setFocused(null)} required
                      className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 h-11 px-4 pr-12 text-sm" />
                    <motion.button type="button" whileTap={{ scale:0.85 }} onClick={()=>setShowPw(p=>!p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all">
                      {showPw?<EyeOff className="h-4 w-4"/>:<Eye className="h-4 w-4"/>}
                    </motion.button>
                  </div>
                </div>

                {/* Confirm */}
                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword" className={`text-xs font-semibold uppercase tracking-wider transition-colors ${focused==="confirmPassword"?"text-foreground":"text-muted-foreground"}`}>Confirm Password</Label>
                  <div className={`relative rounded-xl border transition-all duration-200 ${
                    form.confirmPassword && form.confirmPassword!==form.password
                      ?"border-red-400/60 bg-red-400/5"
                      :focused==="confirmPassword"?"border-foreground/40 bg-background shadow-sm":"border-border bg-secondary/30"
                  }`}>
                    <Input id="confirmPassword" name="confirmPassword" type={showCpw?"text":"password"}
                      placeholder="Confirm your password" value={form.confirmPassword} onChange={handle}
                      onFocus={()=>setFocused("confirmPassword")} onBlur={()=>setFocused(null)} required
                      className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 h-11 px-4 pr-12 text-sm" />
                    <motion.button type="button" whileTap={{ scale:0.85 }} onClick={()=>setShowCpw(p=>!p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all">
                      {showCpw?<EyeOff className="h-4 w-4"/>:<Eye className="h-4 w-4"/>}
                    </motion.button>
                  </div>
                  <AnimatePresence>
                    {form.confirmPassword && form.confirmPassword!==form.password && (
                      <motion.p initial={{ opacity:0, y:-4 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                        className="text-[11px] text-red-500 flex items-center gap-1 mt-1">
                        <XIcon className="w-3 h-3" /> Passwords don't match
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <motion.button type="submit" disabled={loading} whileTap={{ scale:0.97 }}
                  className="group relative w-full h-11 rounded-xl bg-foreground text-background text-sm font-semibold
                    overflow-hidden flex items-center justify-center gap-2 shadow-sm
                    hover:opacity-92 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 mt-2"
                >
                  <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%]
                    bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700" />
                  {loading?<><Loader2 className="h-4 w-4 animate-spin"/>Creating…</>:<>Create Account <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform duration-200"/></>}
                </motion.button>
              </form>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border/50"/></div>
                <div className="relative flex justify-center"><span className="bg-card px-3 text-xs text-muted-foreground uppercase tracking-widest">or</span></div>
              </div>

              <p className="text-center text-sm">
                <span className="text-muted-foreground">Have an account? </span>
                <Link to="/login" className="font-semibold text-foreground hover:underline underline-offset-2">Sign in →</Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </ThemeProvider>
  );
}
