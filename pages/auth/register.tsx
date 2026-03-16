import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";

import { SERVER_ADRESS } from "@/config.json";

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default function Register() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [password2, setPassword2] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  const handleRegister = () => {
    if (username.length < 3) return setError("Username is too short (min 3 characters).");
    if (password.length < 5) return setError("Password is too short (min 5 characters).");
    if (username.length > 20) return setError("Username is too long (max 20 characters).");
    if (password.length > 20) return setError("Password is too long (max 20 characters).");
    if (password !== password2) return setError("Passwords don't match.");

    setLoading(true);
    setError("");

    axios
      .post(SERVER_ADRESS + "/register", { username, password, email })
      .then((res) => {
        if (res.status === 201) {
          router.push("/auth/login");
        } else {
          setError(res.data.message);
        }
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Something went wrong.");
      })
      .finally(() => setLoading(false));
  };

  const passwordMatch = password.length > 0 && password2.length > 0 && password === password2;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0a0f] px-4 py-8">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-purple-600/8 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center justify-center space-x-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg leading-none select-none">P</span>
          </div>
          <span className="text-2xl font-bold text-white tracking-tight">Pytter</span>
        </div>

        {/* Card */}
        <div className="bg-[#13131a] border border-[#1f1f2e] rounded-2xl px-8 py-8 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          <h1 className="text-xl font-bold text-white mb-1">Create an account</h1>
          <p className="text-slate-500 text-sm mb-6">{"Join Pytter and share what's on your mind"}</p>

          <div className="flex flex-col space-y-3">
            {/* Username */}
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600">
                <UserIcon />
              </span>
              <input
                type="text"
                placeholder="Username"
                className="bg-[#1a1a24] border border-[#2d2d42] rounded-xl pl-10 pr-4 py-3 w-full text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-200 text-sm"
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
              />
            </div>

            {/* Email */}
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600">
                <MailIcon />
              </span>
              <input
                type="email"
                placeholder="Email address"
                className="bg-[#1a1a24] border border-[#2d2d42] rounded-xl pl-10 pr-4 py-3 w-full text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-200 text-sm"
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600">
                <LockIcon />
              </span>
              <input
                type="password"
                placeholder="Password"
                className="bg-[#1a1a24] border border-[#2d2d42] rounded-xl pl-10 pr-4 py-3 w-full text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-200 text-sm"
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>

            {/* Confirm password */}
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600">
                <span className={passwordMatch ? "text-emerald-500" : "text-slate-600"}>
                  {passwordMatch ? <CheckIcon /> : <LockIcon />}
                </span>
              </span>
              <input
                type="password"
                placeholder="Confirm password"
                className={`bg-[#1a1a24] border rounded-xl pl-10 pr-4 py-3 w-full text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 transition-all duration-200 text-sm ${
                  passwordMatch
                    ? "border-emerald-500/40 focus:ring-emerald-500/30 focus:border-emerald-500/50"
                    : "border-[#2d2d42] focus:ring-indigo-500/50 focus:border-indigo-500/50"
                }`}
                onChange={(e) => setPassword2(e.target.value)}
                autoComplete="new-password"
              />
            </div>

            <button
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl py-3 mt-1 transition-all duration-200 text-sm active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center space-x-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span>Creating account…</span>
                </span>
              ) : "Create account"}
            </button>
          </div>

          {error && (
            <div className="mt-4 bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3">
              <p className="text-rose-400 text-sm text-center">{error}</p>
            </div>
          )}
        </div>

        <p className="text-center text-slate-600 text-sm mt-5">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
