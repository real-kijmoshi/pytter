import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";

import { SERVER_ADRESS } from "@/config.json";

export default function Register() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [password2, setPassword2] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const router = useRouter();

  const [error, setError] = useState<string>("");

  const handleRegister = () => {
    if (username.length < 3) return setError("Username is too short (min 3).");
    if (password.length < 5) return setError("Password is too short (min 5).");

    if (username.length > 20) return setError("Username is too long (max 20).");
    if (password.length > 20) return setError("Password is too long (max 20).");

    if (password !== password2) return setError("Passwords don't match.");

    axios
      .post(
        SERVER_ADRESS + "/register",
        {
          username,
          password,
          email,
        },
      )
      .then((res) => {
        if (res.status === 201) {
          router.push("/auth/login");
        } else {
          setError(res.data.message);
        }
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Something went wrong.");
      });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 px-10 py-8 w-full max-w-sm">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">Create account</h1>
        <div className="flex flex-col space-y-3">
          <input
            type="text"
            placeholder="Username"
            className="border border-gray-300 rounded-lg p-2.5 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className="border border-gray-300 rounded-lg p-2.5 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="border border-gray-300 rounded-lg p-2.5 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm password"
            className="border border-gray-300 rounded-lg p-2.5 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e) => setPassword2(e.target.value)}
          />
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full py-2.5 mt-2 transition-colors"
            onClick={handleRegister}
          >
            Register
          </button>
        </div>

        {error && <p className="text-red-500 text-sm mt-3 text-center">{error}</p>}

        <p className="text-center text-gray-500 text-sm mt-5">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-blue-500 hover:text-blue-700 font-medium">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
