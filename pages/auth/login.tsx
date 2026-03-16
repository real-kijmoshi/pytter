import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";

import { SERVER_ADRESS } from "@/config.json"

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

function PytterLogo() {
  return (
    <svg width="36" height="36" viewBox="0 0 32 32" fill="none">
      <path
        d="M16 2C8.268 2 2 8.268 2 16s6.268 14 14 14 14-6.268 14-14S23.732 2 16 2z"
        fill="url(#loginLogoGrad)"
      />
      <path
        d="M10 13h5l-2 3h4l-5 7 1-5h-3l2-5z"
        fill="white"
        fillOpacity="0.95"
      />
      <defs>
        <linearGradient id="loginLogoGrad" x1="2" y1="2" x2="30" y2="30" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7c3aed" />
          <stop offset="1" stopColor="#ec4899" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function Login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();
  const [, setCookie] = useCookies(["token"]);

  const handleLogin = () => {
    if (!username || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setError("");
    axios
      .post(SERVER_ADRESS + "/login", { username, password })
      .then((res) => {
        if (res.status === 200) {
          setCookie("token", res.data.token, {
            path: "/",
            maxAge: 60 * 60 * 24 * 30,
            sameSite: true,
          });
          router.push("/");
        } else {
          setError(res.data.message);
        }
      })
      .catch((err) => {
        if (err.response?.status === 400) {
          setError("Invalid username or password.");
        } else {
          setError("Something went wrong. Please try again.");
        }
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="flex min-h-screen bg-bg">
      {/* Left panel — branding */}
      <div className="hidden lg:flex flex-1 flex-col items-center justify-center bg-gradient-to-br from-accent/20 via-bg to-bg border-r border-border relative overflow-hidden">
        {/* Glow orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-accent/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/3 w-[300px] h-[300px] bg-pink/8 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center px-12 max-w-md">
          <div className="mb-8 animate-float">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-glow-violet">
              <svg width="64" height="64" viewBox="0 0 32 32" fill="none">
                <path d="M16 2C8.268 2 2 8.268 2 16s6.268 14 14 14 14-6.268 14-14S23.732 2 16 2z" fill="url(#heroGrad)" />
                <path d="M10 13h5l-2 3h4l-5 7 1-5h-3l2-5z" fill="white" fillOpacity="0.95" />
                <defs>
                  <linearGradient id="heroGrad" x1="2" y1="2" x2="30" y2="30" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#7c3aed" />
                    <stop offset="1" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-extrabold text-text-primary mb-4 tracking-tight">
            Welcome to <span className="bg-gradient-to-r from-accent-bright to-pink bg-clip-text text-transparent">Pytter</span>
          </h1>
          <p className="text-text-muted text-lg leading-relaxed">
            Share your thoughts, connect with others, and discover what{"'"}s happening right now.
          </p>

          <div className="mt-10 flex flex-col gap-3 w-full max-w-xs">
            {[
              { emoji: "⚡", text: "Real-time posts & reactions" },
              { emoji: "❤️", text: "Like and engage with content" },
              { emoji: "🔒", text: "Secure & private by default" },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-3 text-left bg-surface/50 border border-border rounded-xl px-4 py-3">
                <span className="text-lg">{f.emoji}</span>
                <span className="text-sm text-text-secondary font-medium">{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 lg:max-w-[480px] flex flex-col items-center justify-center px-6 py-12 relative">
        {/* Mobile bg glow */}
        <div className="lg:hidden absolute top-1/4 left-1/2 -translate-x-1/2 w-72 h-72 bg-accent/8 rounded-full blur-3xl pointer-events-none" />

        <div className="relative w-full max-w-sm animate-slide-up">
          {/* Logo (mobile only) */}
          <div className="lg:hidden flex items-center gap-3 justify-center mb-8">
            <PytterLogo />
            <span className="text-2xl font-bold text-text-primary tracking-tight">Pytter</span>
          </div>

          <h2 className="text-2xl font-bold text-text-primary mb-1.5">Sign in</h2>
          <p className="text-text-muted text-sm mb-7">Welcome back! Enter your credentials to continue.</p>

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
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                autoComplete="username"
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
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                autoComplete="current-password"
              />
            </div>

            <button
              className="bg-gradient-to-r from-accent to-accent-bright hover:opacity-90 text-white font-semibold rounded-xl py-3.5 mt-1 transition-all duration-200 text-sm active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed shadow-button hover:shadow-button-hover"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span>Signing in…</span>
                </span>
              ) : "Sign in"}
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
            {"Don't have an account? "}
            <Link href="/auth/register" className="text-accent-bright hover:text-accent font-semibold transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
