import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { z } from "zod";
import { CloudSun, Loader2, Mail, Lock, User as UserIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const emailSchema = z.string().trim().email("Invalid email").max(255);
const passwordSchema = z.string().min(8, "Min 8 characters").max(72);
const nameSchema = z.string().trim().min(2, "Min 2 characters").max(80);

export default function Auth() {
  const { user, loading, signIn, signUp } = useAuth();
  const nav = useNavigate();
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [busy, setBusy] = useState(false);

  if (!loading && user) return <Navigate to="/" replace />;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const ev = emailSchema.safeParse(email);
    const pv = passwordSchema.safeParse(password);
    if (!ev.success) return toast.error(ev.error.issues[0].message);
    if (!pv.success) return toast.error(pv.error.issues[0].message);
    setBusy(true);
    const { error } = await signIn(ev.data, pv.data);
    setBusy(false);
    if (error) return toast.error(error);
    toast.success("Welcome back!");
    nav("/");
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const nv = nameSchema.safeParse(displayName);
    const ev = emailSchema.safeParse(email);
    const pv = passwordSchema.safeParse(password);
    if (!nv.success) return toast.error(nv.error.issues[0].message);
    if (!ev.success) return toast.error(ev.error.issues[0].message);
    if (!pv.success) return toast.error(pv.error.issues[0].message);
    setBusy(true);
    const { error } = await signUp(ev.data, pv.data, nv.data);
    setBusy(false);
    if (error) return toast.error(error);
    toast.success("Account created!");
    nav("/");
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      <div className="pointer-events-none fixed inset-0 -z-10 mesh-bg" />
      <div className="pointer-events-none fixed -top-32 -left-32 h-96 w-96 rounded-full bg-primary/20 blur-3xl animate-float-slow -z-10" />
      <div className="pointer-events-none fixed bottom-0 right-0 h-96 w-96 rounded-full bg-accent/20 blur-3xl animate-float-slow -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass-strong rounded-3xl p-8 shadow-glow"
      >
        <Link to="/" className="flex items-center gap-2 justify-center mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-aurora shadow-glow">
            <CloudSun className="h-7 w-7 text-white" />
          </div>
          <div>
            <div className="font-display text-xl font-bold">SkyCast<span className="gradient-text"> Pro</span></div>
            <div className="text-[10px] text-muted-foreground">Intelligent Forecasting</div>
          </div>
        </Link>

        <Tabs value={tab} onValueChange={(v) => setTab(v as "signin" | "signup")} className="w-full">
          <TabsList className="grid grid-cols-2 w-full mb-6">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="si-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="si-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    className="pl-9" placeholder="you@example.com" required />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="si-pw">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="si-pw" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                    className="pl-9" placeholder="••••••••" required />
                </div>
              </div>
              <Button type="submit" disabled={busy} className="w-full bg-gradient-aurora text-white border-0 hover:opacity-90">
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign In"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="su-name">Display name</Label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="su-name" value={displayName} onChange={(e) => setDisplayName(e.target.value)}
                    className="pl-9" placeholder="Jane Doe" required />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="su-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="su-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    className="pl-9" placeholder="you@example.com" required />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="su-pw">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="su-pw" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                    className="pl-9" placeholder="At least 8 characters" required />
                </div>
              </div>
              <Button type="submit" disabled={busy} className="w-full bg-gradient-aurora text-white border-0 hover:opacity-90">
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create account"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <p className="text-xs text-muted-foreground text-center mt-6">
          By continuing you agree to our terms of service.
        </p>
      </motion.div>
    </div>
  );
}
