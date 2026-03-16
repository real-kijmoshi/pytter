/* eslint-disable react/no-unescaped-entities */
import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";

export default function Login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();
  const [, setCookie] = useCookies(["token"]);

  const THIRTY_DAYS_IN_SECONDS = 60 * 60 * 24 * 30;

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Please fill in all fields");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await axios.post("/api/auth/login", { username, password });
      if (res.status === 200) {
        setCookie("token", res.data.token, {
          path: "/",
          maxAge: THIRTY_DAYS_IN_SECONDS,
          sameSite: "lax",
        });
        router.push("/");
      }
    } catch (err: any) {
      setError(err.response?.data?.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <span className="text-5xl font-black text-brand">𝕻</span>
          <h1 className="mt-2 text-2xl font-bold text-gray-900">Sign in to Pytter</h1>
        </div>

        {/* Card */}
        <div className="card p-8 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              className="input-field"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            className="btn-primary w-full mt-2"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </div>

        <p className="text-center text-sm text-gray-600 mt-4">
          Don't have an account?{" "}
          <Link href="/auth/register" className="text-brand font-semibold hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

