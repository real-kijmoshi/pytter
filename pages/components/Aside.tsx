/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import axios from "axios";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

import config from "@/config.json";

const SERVER_ADRESS = config.SERVER_ADRESS;

interface User {
  username: string;
  display_name: string;
  avatar: string;
}

export default function Aside() {
  const [userData, setUserData] = useState<User | undefined>();
  const [visible, setVisible] = useState<boolean>(false);

  const [cookies, , removeCookie] = useCookies(["token"]);

  useEffect(() => {
    const token = cookies.token;

    if (token) {
      axios
        .get(SERVER_ADRESS + "/whoami", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setUserData(res.data);
        })
        .catch((err) => {
          if (err.response?.status === 401) {
            removeCookie("token");
          }
        });
    }
  }, [cookies.token, removeCookie]);

  return (
    <aside className="w-16 sm:w-64 min-h-screen bg-white border-r border-gray-200 flex flex-col justify-between p-2 sm:p-4 shrink-0">
      <div>
        <div className="mb-6 hidden sm:block">
          <span className="text-2xl font-bold text-blue-500">Pytter</span>
        </div>

        {userData && (
          <nav className="flex flex-col space-y-1">
            <Link
              href="/"
              className="flex items-center space-x-3 p-2 sm:px-3 rounded-full hover:bg-gray-100 transition-colors font-semibold text-gray-900"
            >
              <span className="text-xl">🏠</span>
              <span className="hidden sm:inline">Home</span>
            </Link>
            <Link
              href={`/user/${userData.username}`}
              className="flex items-center space-x-3 p-2 sm:px-3 rounded-full hover:bg-gray-100 transition-colors font-semibold text-gray-900"
            >
              <span className="text-xl">👤</span>
              <span className="hidden sm:inline">Profile</span>
            </Link>
          </nav>
        )}
      </div>

      <div>
        {userData ? (
          <div className="relative">
            <button
              className="flex items-center space-x-2 w-full p-2 rounded-full hover:bg-gray-100 transition-colors"
              onClick={() => setVisible(!visible)}
            >
              <img
                src={userData.avatar}
                width={40}
                height={40}
                alt={userData.username}
                className="rounded-full shrink-0"
              />
              <div className="hidden sm:flex flex-col text-left min-w-0 flex-1">
                <span className="font-semibold text-sm text-gray-900 truncate">{userData.display_name}</span>
                <span className="text-gray-500 text-xs truncate">@{userData.username}</span>
              </div>
            </button>

            {visible && (
              <div className="absolute bottom-full left-0 mb-1 w-48 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50">
                <Link
                  href={`/user/${userData.username}`}
                  className="block px-4 py-3 text-sm text-gray-900 hover:bg-gray-50 transition-colors font-medium"
                  onClick={() => setVisible(false)}
                >
                  View profile
                </Link>
                <button
                  onClick={() => {
                    removeCookie("token");
                    setUserData(undefined);
                    setVisible(false);
                  }}
                  className="block w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors font-medium"
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col space-y-2">
            <Link
              href="/auth/login"
              className="block text-center bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full py-2 text-sm transition-colors"
            >
              <span className="hidden sm:inline">Log in</span>
              <span className="sm:hidden">↩</span>
            </Link>
            <Link
              href="/auth/register"
              className="hidden sm:block text-center border border-blue-500 text-blue-500 hover:bg-blue-50 font-semibold rounded-full py-2 text-sm transition-colors"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}
