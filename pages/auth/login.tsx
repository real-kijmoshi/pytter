/* eslint-disable react/no-unescaped-entities */
import axios from "axios";
import { Roboto_Flex } from "next/font/google";
import Link from "next/link";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";

const roboto = Roboto_Flex({ subsets: ["latin-ext"] });

import { SERVER_ADRESS } from "@/config.json"

export default function Login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [error, setError] = useState<string>("");

  const router = useRouter();

  const [cookies, setCookie, removeCookie] = useCookies(["token"]);

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
            maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
            sameSite: true,
          });

          router.push("/");
        } else {
          setError(res.data.error);
        }
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status === 400) {
          setError(err.response.data.error);
        }
      });
  };

  return (
    <div className={`flex flex-col items-center w-screen`}>
      <div
        className={`flex flex-col justify-bettwen space-y-2xl rounded shadow-lg border border-[#e6e6e6] text-center px-10 py-3 mt-10`}
      >
        <h1 className={`text-4xl ${roboto.className}`}>Login</h1>
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
          <button
            className={`border border-black rounded p-2 px-2 px-6 mt-2 hover:bg-black hover:text-white`}
            onClick={handleLogin}
          >
            Login
          </button>
        </div>
        <div>
          <p className={`flex flex-row mt-10`}>
            if you don't have an account, please
            <Link href="/auth/register"
              className={`text-blue-500 hover:text-blue-700 ml-1`}
            >
              register
            </Link>
          </p>

          {error && <p className={`text-red-500`}>{error}</p>}
        </div>
      </div>
    </div>
  );
}
