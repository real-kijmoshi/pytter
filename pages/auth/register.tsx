import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";

export default function Register() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [password2, setPassword2] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  const handleRegister = async () => {
    if (username.length < 3) return setError("Username is too short (min 3)");
    if (password.length < 5) return setError("Password is too short (min 5)");
    if (username.length > 20) return setError("Username is too long (max 20)");
    if (password.length > 20) return setError("Password is too long (max 20)");
    if (password !== password2) return setError("Passwords don't match");

    setLoading(true);
    setError("");
    try {
      const res = await axios.post("/api/auth/register", {
        username,
        password,
        email,
      });
      if (res.status === 201) {
        router.push("/auth/login");
      }
    } catch (err: any) {
      setError(err.response?.data?.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <span className="text-5xl font-black text-brand">𝕻</span>
          <h1 className="mt-2 text-2xl font-bold text-gray-900">Create your account</h1>
        </div>

        {/* Card */}
        <div className="card p-8 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              placeholder="Choose a username"
              className="input-field"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              placeholder="Create a password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm your password"
              className="input-field"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              autoComplete="new-password"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            className="btn-primary w-full mt-2"
            onClick={handleRegister}
            disabled={loading}
          >
            {loading ? "Creating account…" : "Sign up"}
          </button>
        </div>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-brand font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

