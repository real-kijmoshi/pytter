import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";

import { SERVER_ADRESS } from "@/config.json";

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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

  const steps = [
    { label: "Username", done: username.length >= 3 },
    { label: "Email", done: email.includes("@") && email.includes(".") },
    { label: "Password", done: password.length >= 5 },
    { label: "Confirm", done: passwordMatch },
  ];
  const completedSteps = steps.filter((s) => s.done).length;

  return (
    <div className="flex min-h-screen bg-bg">
      {/* Left panel — branding */}
      <div className="hidden lg:flex flex-1 flex-col items-center justify-center bg-gradient-to-br from-pink/15 via-bg to-bg border-r border-border relative overflow-hidden">
        <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-accent/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] bg-pink/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center px-12 max-w-md">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-glow-pink mb-8">
            <svg width="64" height="64" viewBox="0 0 32 32" fill="none">
              <path d="M16 2C8.268 2 2 8.268 2 16s6.268 14 14 14 14-6.268 14-14S23.732 2 16 2z" fill="url(#registerHeroGrad)" />
              <path d="M10 13h5l-2 3h4l-5 7 1-5h-3l2-5z" fill="white" fillOpacity="0.95" />
              <defs>
                <linearGradient id="registerHeroGrad" x1="2" y1="2" x2="30" y2="30" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#ec4899" />
                  <stop offset="1" stopColor="#7c3aed" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <h1 className="text-4xl font-extrabold text-text-primary mb-4 tracking-tight">
            Join <span className="bg-gradient-to-r from-pink to-accent-bright bg-clip-text text-transparent">Pytter</span> today
          </h1>
          <p className="text-text-muted text-lg leading-relaxed mb-10">
            Create your account and start sharing what{"'"}s on your mind with the world.
          </p>

          {/* Progress tracker */}
          <div className="w-full max-w-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-text-muted font-medium">Account setup</span>
              <span className="text-xs text-accent-bright font-semibold">{completedSteps}/{steps.length}</span>
            </div>
            <div className="h-1.5 bg-surface rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-gradient-to-r from-accent to-pink rounded-full transition-all duration-500"
                style={{ width: `${(completedSteps / steps.length) * 100}%` }}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {steps.map((step, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all duration-300 ${
                    step.done
                      ? "bg-accent/10 border-accent/30 text-accent-bright"
                      : "bg-surface border-border text-text-muted"
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${step.done ? "bg-accent" : "bg-surface-overlay border border-border-highlight"}`}>
                    {step.done && <CheckIcon />}
                  </div>
                  <span className="text-xs font-medium">{step.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 lg:max-w-[480px] flex flex-col items-center justify-center px-6 py-12 relative">
        <div className="lg:hidden absolute top-1/4 left-1/2 -translate-x-1/2 w-72 h-72 bg-pink/8 rounded-full blur-3xl pointer-events-none" />

        <div className="relative w-full max-w-sm animate-slide-up">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 justify-center mb-8">
            <svg width="36" height="36" viewBox="0 0 32 32" fill="none">
              <path d="M16 2C8.268 2 2 8.268 2 16s6.268 14 14 14 14-6.268 14-14S23.732 2 16 2z" fill="url(#regMobileGrad)" />
              <path d="M10 13h5l-2 3h4l-5 7 1-5h-3l2-5z" fill="white" fillOpacity="0.95" />
              <defs>
                <linearGradient id="regMobileGrad" x1="2" y1="2" x2="30" y2="30" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#7c3aed" />
                  <stop offset="1" stopColor="#ec4899" />
                </linearGradient>
              </defs>
            </svg>
            <span className="text-2xl font-bold text-text-primary tracking-tight">Pytter</span>
          </div>

          <h2 className="text-2xl font-bold text-text-primary mb-1.5">Create account</h2>
          <p className="text-text-muted text-sm mb-7">{"Join Pytter and share what's on your mind"}</p>

          <div className="flex flex-col gap-3">
            {/* Username */}
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
                <UserIcon />
              </span>
              <input
                type="text"
                placeholder="Username"
                className="bg-surface border border-border rounded-xl pl-11 pr-4 py-3.5 w-full text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all duration-200 text-sm"
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
              />
            </div>

            {/* Email */}
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
                <MailIcon />
              </span>
              <input
                type="email"
                placeholder="Email address"
                className="bg-surface border border-border rounded-xl pl-11 pr-4 py-3.5 w-full text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all duration-200 text-sm"
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
                <LockIcon />
              </span>
              <input
                type="password"
                placeholder="Password"
                className="bg-surface border border-border rounded-xl pl-11 pr-4 py-3.5 w-full text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all duration-200 text-sm"
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>

            {/* Confirm password */}
            <div className="relative">
              <span className={`absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors ${passwordMatch ? "text-emerald-400" : "text-text-muted"}`}>
                {passwordMatch ? <CheckIcon /> : <LockIcon />}
              </span>
              <input
                type="password"
                placeholder="Confirm password"
                className={`bg-surface rounded-xl pl-11 pr-4 py-3.5 w-full text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 transition-all duration-200 text-sm border ${
                  passwordMatch
                    ? "border-emerald-500/40 focus:ring-emerald-500/20 focus:border-emerald-500/50"
                    : "border-border focus:ring-accent/30 focus:border-accent/50"
                }`}
                onChange={(e) => setPassword2(e.target.value)}
                autoComplete="new-password"
              />
              {passwordMatch && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-400 text-xs font-semibold">✓ Match</span>
              )}
            </div>

            <button
              className="bg-gradient-to-r from-accent to-accent-bright hover:opacity-90 text-white font-semibold rounded-xl py-3.5 mt-1 transition-all duration-200 text-sm active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed shadow-button hover:shadow-button-hover"
              onClick={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
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
            <div className="mt-4 bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3 animate-slide-down">
              <p className="text-rose-400 text-sm text-center flex items-center justify-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                {error}
              </p>
            </div>
          )}

          <p className="text-center text-text-muted text-sm mt-6">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-accent-bright hover:text-accent font-semibold transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
