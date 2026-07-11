"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { authService, useAuthStore } from "@juice-vibe/services";
import { Button, Input } from "@juice-vibe/ui";
import { ShieldCheck, Mail, Lock, AlertTriangle } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginSchema = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginSchema) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const response = await authService.login(data);
      if (response && response.user && response.tokens) {
        // Enforce administrative role protection
        const allowedRoles = ["admin", "manager", "cashier", "kitchen", "editor"];
        if (!allowedRoles.includes(response.user.role)) {
          setErrorMsg("Access denied. Authorized administrative accounts only.");
          setLoading(false);
          return;
        }

        setAuth(response.user, response.tokens);
        router.replace("/dashboard");
      } else {
        setErrorMsg("Invalid authorization response from server.");
      }
    } catch (err: any) {
      console.error("Login failure:", err);
      const detail = err.response?.data?.message || "Invalid credentials or server unavailable.";
      setErrorMsg(detail);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 relative overflow-hidden">
      {/* Handcrafted Organic Accent Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-orange/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-[300px] h-[300px] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />
      
      <div className="w-full max-w-md space-y-6 relative z-10">
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary mb-2">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-heading">
            Juice Vibe OS
          </h1>
          <p className="text-sm text-muted-foreground uppercase tracking-widest font-mono text-[10px]">
            Enterprise Operations Management
          </p>
        </div>

        <div className="terminal-card p-8 border border-border shadow-2xl relative overflow-hidden bg-card glow-border-yellow">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-yellow/50 to-transparent" />
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {errorMsg && (
              <div className="flex items-center gap-2 rounded-lg border border-pink/30 bg-pink/10 p-3 text-xs text-pink">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span className="font-mono">{errorMsg}</span>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                Security Identity (Email)
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="name@juicevibe.com"
                  className="pl-10 w-full bg-ink-dark border-border text-foreground focus:border-primary focus:ring-1 focus:ring-primary/20 placeholder:text-muted-foreground/50 h-10 font-mono text-xs rounded-lg"
                  disabled={loading}
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="text-[11px] font-mono text-pink mt-1">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                Access Token (Password)
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="pl-10 w-full bg-ink-dark border-border text-foreground focus:border-primary focus:ring-1 focus:ring-primary/20 placeholder:text-muted-foreground/50 h-10 font-mono text-xs rounded-lg"
                  disabled={loading}
                  {...register("password")}
                />
              </div>
              {errors.password && (
                <p className="text-[11px] font-mono text-pink mt-1">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary-dark text-ink-dark font-semibold h-10 mt-6 shadow-md transition-all uppercase tracking-wider text-xs font-heading disabled:opacity-50"
              disabled={loading}
              loading={loading}
            >
              Authorize System Session
            </Button>
          </form>
        </div>

        <div className="text-center font-mono text-[10px] text-muted-foreground/60">
          SECURE CHANNEL // SYSTEM ID: <span className="font-numeral">JVM-908A</span>
        </div>
      </div>
    </div>
  );
}
