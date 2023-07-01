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
    if (username.length < 3) return setError("username is too short(min 3)");
    if (password.length < 5) return setError("password is too short(min 5)");

    if (username.length > 20) return setError("username is too long (max 20)");
    if (password.length > 20) return setError("password is too long (max 20)");

    console.log(password, password2)
    if (password === password2) {
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
            setError(res.data.error);
          }
        })
        .catch((err) => {
          if(err.response.status === 400) {
            setError(err.response.data.message)
          }
        });
    } else {
      setError("passwords don't match");
    }
  };

  return (
    <div className={`flex flex-col items-center w-screen`}>
      <div
        className={`flex flex-col justify-bettwen space-y-2xl rounded shadow-lg border border-[#e6e6e6] text-center px-10 py-3 mt-10`}
      >
        <h1 className={`text-4xl `}>Register</h1>
        <div>
          <input
            type="text"
            placeholder="username"
            className={`border border-black rounded p-1 mt-5`}
            onChange={(e) => setUsername(e.target.value)}
          />
          <br />
          <input
            type="password"
            placeholder="password"
            className={`border border-black rounded p-1 mt-2`}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <input
            type="password"
            placeholder="password"
            className={`border border-black rounded p-1 mt-2`}
            onChange={(e) => setPassword2(e.target.value)}
          />
          <br />
          <input
            type="email"
            placeholder="email"
            className={`border border-black rounded p-1 mt-2`}
            onChange={(e) => setEmail(e.target.value)}
          />
          <br />
          <button
            className={`border border-black rounded p-2 px-2 px-6 mt-2 hover:bg-black hover:text-white`}
            onClick={handleRegister}
          >
            Register
          </button>

          <p className={`mt-10 flex flex-row`}>
            if you have an account, please
            <Link href="/auth/login" className={`text-blue-300 ml-1`}>
              login
            </Link>
          </p>

          {error && <p className={`text-red-500`}>{error}</p>}
        </div>
      </div>
    </div>
  );
}
