// src/app/(auth)/login/page.tsx
"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/features/auth/services/authApi";
import { toast } from "sonner";
import { Mail, Lock, Loader2, GraduationCap, ChevronRight } from "lucide-react";
import { AxiosError } from "axios";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await authService.login({ email, password });
      const { token, name, role } = response.data.data;

      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("userName", name);
        localStorage.setItem("userRole", role);

        toast.success(`Welcome back, ${name}!`);
        router.push("/");
      }
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      const errorMessage =
        axiosError.response?.data?.message ||
        "Login failed. Please check your credentials.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white">
      {/* Left Side: Branding & Visuals */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-slate-900 relative overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-[80px] -ml-32 -mb-32" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 text-white">
            <div className="bg-blue-600 p-2 rounded-xl">
              <GraduationCap size={28} />
            </div>
            <span className="text-2xl font-black tracking-tighter text-white">
              KEPLER
            </span>
          </div>
        </div>

        <div className="relative z-10">
          <h2 className="text-5xl font-bold text-white leading-tight mb-6">
            Shape Your Future <br />
            <span className="text-blue-500 font-black">With Kepler</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-md leading-relaxed">
            Providing world-class resources and expert mentorship to help you
            reach your peak potential.
          </p>
        </div>

        <div className="relative z-10 text-slate-500 text-sm font-medium">
          © 2026 Kepler Systems Ltd.
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="flex items-center justify-center p-6 sm:p-12 bg-slate-50">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-xl text-white">
                <GraduationCap size={24} />
              </div>
              <span className="text-xl font-black tracking-tighter text-slate-900 uppercase">
                Kepler
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Sign In
            </h1>
            <p className="text-slate-500">
              Enter your credentials to access your dashboard
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-slate-900 shadow-sm"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Password
                  </label>
                  <button
                    type="button"
                    className="text-[10px] font-bold text-blue-600 hover:underline uppercase"
                  >
                    Forgot?
                  </button>
                </div>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-slate-900 shadow-sm"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 disabled:bg-blue-400 transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-2 group active:scale-[0.98]"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <span>Login</span>
                  <ChevronRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </>
              )}
            </button>
          </form>

          {/* Institutional Note */}
          <div className="pt-8 text-center border-t border-slate-200">
            <p className="text-slate-400 text-xs">
              Trouble logging in? Contact your{" "}
              <span className="text-slate-600 font-semibold">
                IT Department
              </span>{" "}
              for assistance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function setError(errorMessage: string) {
  throw new Error("Function not implemented.");
}
