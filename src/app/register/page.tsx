"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { motion } from "framer-motion";
import { UserPlus, Mail, Lock, User, AlertCircle, Loader2 } from "lucide-react";
import Navbar from "@/components/layout/Navbar";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { register, error, clearError } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    if (!name || !email || !password) return;
    setSubmitting(true);
    const ok = await register(name, email, password);
    setSubmitting(false);
    if (ok) router.push("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-md"
        >
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold" style={{ fontFamily: "var(--font-amiri)" }}>ق</span>
          </div>
          <h1 className="text-2xl font-bold">Create account</h1>
          <p className="text-muted text-sm mt-1">Join Al-Quran to save your progress</p>
        </div>

        <div className="card p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 text-sm p-3 rounded-lg">
                <AlertCircle size={16} className="shrink-0" />
                {error}
              </motion.div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1.5">Full Name</label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required minLength={2}
                  className="w-full pl-10 pr-4 py-2.5 bg-surface-alt border border-border rounded-lg text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required
                  className="w-full pl-10 pr-4 py-2.5 bg-surface-alt border border-border rounded-lg text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 8 chars, A-Z, a-z, 0-9" required minLength={8}
                  className="w-full pl-10 pr-4 py-2.5 bg-surface-alt border border-border rounded-lg text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all" />
              </div>
              <p className="text-[11px] text-muted mt-1">Must include uppercase, lowercase, and a number</p>
            </div>

            <button type="submit" disabled={submitting}
              className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-60">
              {submitting ? <Loader2 size={18} className="animate-spin" /> : <UserPlus size={18} />}
              {submitting ? "Creating..." : "Create Account"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-muted mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-primary font-medium hover:underline">Sign in</Link>
        </p>
        </motion.div>
      </div>
    </div>
  );
}
