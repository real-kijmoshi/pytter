import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";

import { SERVER_ADRESS } from "@/config.json"

export default function Login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [error, setError] = useState<string>("");

  const router = useRouter();

  const [, setCookie] = useCookies(["token"]);

  const handleLogin = () => {
    axios
      .post(
        SERVER_ADRESS + "/login",
        {
          username,
          password,
        },
      )
      .then((res) => {
        if (res.status === 200) {
          setCookie("token", res.data.token, {
            path: "/",
            maxAge: 60 * 60 * 24 * 30, // 30 days
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
          setError("Something went wrong.");
        }
      });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 px-10 py-8 w-full max-w-sm">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">Sign in</h1>
        <div className="flex flex-col space-y-3">
          <input
            type="text"
            placeholder="Username"
            className="border border-gray-300 rounded-lg p-2.5 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
          <input
            type="password"
            placeholder="Password"
            className="border border-gray-300 rounded-lg p-2.5 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full py-2.5 mt-2 transition-colors"
            onClick={handleLogin}
          >
            Log in
          </button>
        </div>

        {error && <p className="text-red-500 text-sm mt-3 text-center">{error}</p>}

        <p className="text-center text-gray-500 text-sm mt-5">
          {"Don't have an account? "}
          <Link href="/auth/register" className="text-blue-500 hover:text-blue-700 font-medium">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
