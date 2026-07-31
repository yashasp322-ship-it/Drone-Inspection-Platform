import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Lock, Mail, ShieldAlert } from "lucide-react";

interface LoginProps {
  onLoginSuccess: (email: string) => void;
  onBackToHome: () => void;
}

export default function Login({ onLoginSuccess, onBackToHome }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulated network delay
    setTimeout(() => {
      if (email === "admin@gmail.com" && password === "password") {
        setIsLoading(false);
        onLoginSuccess(email);
      } else {
        setIsLoading(false);
        setError("Invalid email or password. Hint: admin@gmail.com / password");
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center items-center px-6 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03),transparent_70%)] pointer-events-none" />
      
      {/* Back button */}
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        onClick={onBackToHome}
        className="absolute top-8 left-8 flex items-center space-x-2 text-xs text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </motion.button>

      {/* Main card with entry animations */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        className="w-full max-w-md bg-neutral-950 border border-white/10 rounded-2xl p-8 sm:p-10 shadow-2xl relative z-10"
      >
        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex w-12 h-12 rounded-xl bg-white text-black items-center justify-center font-black text-xl mb-2">
            D
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Sign In to Dashboard</h2>
          <p className="text-xs text-gray-500">
            Use <code className="text-white font-mono bg-white/5 px-1.5 py-0.5 rounded">admin@gmail.com</code> / <code className="text-white font-mono bg-white/5 px-1.5 py-0.5 rounded">password</code>
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-950/30 border border-red-500/20 text-red-400 rounded-xl text-xs flex items-start space-x-2.5"
          >
            <ShieldAlert className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-400">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-3 bg-neutral-900 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-400">
                Password
              </label>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-neutral-900 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors"
              />
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-white hover:bg-neutral-200 text-black font-bold rounded-xl text-sm transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.25)] flex justify-center items-center"
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              "Sign In"
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
