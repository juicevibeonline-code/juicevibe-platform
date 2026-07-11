"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles } from "lucide-react";
import { useAuthStore, authService } from "@juice-vibe/services";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/hooks/useToast";

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, setAuth } = useAuthStore();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await authService.login({ email, password });
      
      if (response && response.user && response.tokens) {
        setAuth(response.user, response.tokens);
        toast({
          type: "success",
          title: "Welcome back!",
          message: `Logged in as ${response.user.name}`,
        });
        router.push("/dashboard");
      } else {
        throw new Error("Invalid authentication response");
      }
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.message || err.message || "Failed to log in. Please try again.";
      setError(msg);
      toast({
        type: "error",
        title: "Login Failed",
        message: msg,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-background px-4 overflow-hidden">
      {/* Background visual graphics */}
      <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-orange/10 blur-[120px] pointer-events-none" />

      {/* Main Login Card */}
      <div className="w-full max-w-md relative z-10">
        {/* Logo / Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary text-white mb-4 shadow-lg shadow-primary/20">
            <span className="text-lg font-bold tracking-wider font-display">JV</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-display flex items-center justify-center gap-1.5">
            Juice Vibe <Sparkles size={16} className="text-orange animate-pulse" />
          </h1>
          <p className="text-xs text-muted mt-1 uppercase tracking-widest font-semibold">
            Admin Portal Access
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-card/75 backdrop-blur-xl border border-border/80 rounded-2xl p-8 shadow-xl shadow-foreground/5">
          {error && (
            <div className="mb-6 p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-lg text-xs font-semibold leading-relaxed">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email field */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground block mb-1">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted group-focus-within:text-primary transition-colors" />
                <input
                  type="email"
                  placeholder="admin@juicevibe.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background/50 text-xs text-foreground focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all font-medium"
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-foreground block">
                  Password
                </label>
              </div>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted group-focus-within:text-primary transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-border bg-background/50 text-xs text-foreground focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground cursor-pointer focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center gap-2 w-full mt-6 py-3 rounded-lg bg-primary hover:bg-primary-dark text-white font-bold text-xs shadow-md shadow-primary/10 transition-colors cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  Sign In to Workspace
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer info */}
        <p className="text-center text-[10px] text-muted mt-8 font-semibold uppercase tracking-wider">
          © {new Date().getFullYear()} Juice Vibe Cafe • Bentota, Sri Lanka
        </p>
      </div>
    </div>
  );
}
