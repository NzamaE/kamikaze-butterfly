import * as React from "react";
import { motion } from "motion/react";
import { Button } from "../components/Button";
import { Badge } from "../components/Badge";
import { Sparkles, Mail, Lock, Github, Chrome, ChevronRight, User, Briefcase } from "lucide-react";
import { authAPI } from "../api/index";

export function LoginScreen({ onLogin }: { onLogin: (role: string) => void }) {
  const [role, setRole] = React.useState<'client' | 'vendor'>('client');
  const [isRegister, setIsRegister] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [form, setForm] = React.useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async () => {
    if (!form.email || !form.password) {
      setError("Please fill in all fields");
      return;
    }
    if (isRegister && !form.name) {
      setError("Please enter your name");
      return;
    }
    setLoading(true);
    setError("");
    try {
      if (isRegister) {
        await authAPI.register(form.name, form.email, form.password, role);
        const data = await authAPI.login(form.email, form.password);
        onLogin(data.user.role);
      } else {
        const data = await authAPI.login(form.email, form.password);
        onLogin(data.user.role);
      }
    } catch (err: any) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen grid lg:grid-cols-2 bg-surface"
    >
      {/* Left — image panel */}
      <div className="relative hidden lg:block overflow-hidden">
        <img
          src="https://picsum.photos/seed/wedding/1920/1080"
          alt="Wedding"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px]" />
        <div className="absolute inset-0 flex flex-col justify-end p-24 text-on-primary space-y-6">
          <Badge variant="primary" className="w-fit bg-white/20 backdrop-blur-md border border-white/30 text-white">
            Curated Excellence
          </Badge>
          <h1 className="text-7xl font-bold leading-tight tracking-tight">
            Kamikaze <br />
            <span className="italic font-normal">Butterfly</span>
          </h1>
          <p className="text-xl max-w-md leading-relaxed opacity-90">
            A high-end editorial wedding planning and vendor management platform for visionaries and curators.
          </p>
        </div>
      </div>

      {/* Right — form panel */}
      <div className="flex items-center justify-center p-6 sm:p-12 lg:p-24">
        <div className="w-full max-w-md space-y-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-semibold uppercase tracking-widest text-xs">
              <Sparkles size={14} />
              <span>Welcome</span>
            </div>
            <h2 className="text-4xl font-bold tracking-tight">
              {isRegister ? "Create your" : "Sign in to your"} <br />
              <span className="italic font-normal text-primary">Creative Space</span>
            </h2>
          </div>

          <div className="space-y-8">

            {/* Role toggle — only show when registering */}
            {isRegister && (
              <div className="flex p-1.5 bg-surface-container-low rounded-2xl">
                <button
                  onClick={() => setRole('client')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
                    role === 'client' ? 'bg-surface shadow-sm text-primary' : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <User size={18} /> Client
                </button>
                <button
                  onClick={() => setRole('vendor')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
                    role === 'vendor' ? 'bg-surface shadow-sm text-primary' : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <Briefcase size={18} /> Vendor
                </button>
              </div>
            )}

            <div className="space-y-6">
              {/* Name — register only */}
              {isRegister && (
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant group-focus-within:text-primary transition-colors" size={18} />
                  <input
                    name="name"
                    type="text"
                    placeholder="Full name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full bg-surface-container-low border border-transparent rounded-xl pl-12 pr-4 py-4 text-on-surface transition-all focus:bg-surface-container focus:border-primary/20 focus:ring-2 focus:ring-primary/5 outline-none"
                  />
                </div>
              )}

              {/* Email */}
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant group-focus-within:text-primary transition-colors" size={18} />
                <input
                  name="email"
                  type="email"
                  placeholder="Email address"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full bg-surface-container-low border border-transparent rounded-xl pl-12 pr-4 py-4 text-on-surface transition-all focus:bg-surface-container focus:border-primary/20 focus:ring-2 focus:ring-primary/5 outline-none"
                />
              </div>

              {/* Password */}
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant group-focus-within:text-primary transition-colors" size={18} />
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full bg-surface-container-low border border-transparent rounded-xl pl-12 pr-4 py-4 text-on-surface transition-all focus:bg-surface-container focus:border-primary/20 focus:ring-2 focus:ring-primary/5 outline-none"
                />
              </div>

              {!isRegister && (
                <div className="flex justify-end">
                  <button className="text-xs font-bold uppercase tracking-widest text-primary hover:underline">
                    Forgot password?
                  </button>
                </div>
              )}

              {/* Error */}
              {error && (
                <p className="text-sm text-red-500 font-medium bg-red-50 py-3 px-4 rounded-xl text-center">
                  {error}
                </p>
              )}

              {/* Submit */}
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-4 gap-2 group"
              >
                {loading ? "Please wait..." : isRegister ? "Create Account" : "Sign In"}
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-surface-container-high"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold text-outline-variant">
                <span className="bg-surface px-4">Or continue with</span>
              </div>
            </div>

            {/* Social buttons */}
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="gap-2 py-3.5">
                <Chrome size={18} /> Google
              </Button>
              <Button variant="outline" className="gap-2 py-3.5">
                <Github size={18} /> GitHub
              </Button>
            </div>
          </div>

          {/* Switch login/register */}
          <p className="text-center text-sm text-on-surface-variant">
            {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              onClick={() => { setIsRegister(!isRegister); setError(""); }}
              className="font-bold text-primary hover:underline"
            >
              {isRegister ? "Sign in" : "Create an account"}
            </button>
          </p>
        </div>
      </div>
    </motion.div>
  );
}