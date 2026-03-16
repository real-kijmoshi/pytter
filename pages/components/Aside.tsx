/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import axios from "axios";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";

import config from "@/config.json";

const SERVER_ADRESS = config.SERVER_ADRESS;

interface User {
  username: string;
  display_name: string;
  avatar: string;
}

function HomeIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </svg>
  );
}

function UserIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
    </svg>
  );
}

function ChevronUpIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="18 15 12 9 6 15" />
    </svg>
  );
}

function LogOutIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

export default function Aside() {
  const [userData, setUserData] = useState<User | undefined>();
  const [visible, setVisible] = useState<boolean>(false);
  const router = useRouter();

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

  const isActive = (path: string) => router.pathname === path;

  return (
    <aside className="w-16 sm:w-64 min-h-screen bg-[#0d0d14] border-r border-[#1f1f2e] flex flex-col justify-between py-4 px-2 sm:px-4 shrink-0">
      {/* Top: Logo + Nav */}
      <div>
        {/* Logo */}
        <div className="mb-8 flex items-center sm:justify-start justify-center px-1 sm:px-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-glow-indigo shrink-0">
            <span className="text-white font-bold text-base leading-none select-none">P</span>
          </div>
          <span className="hidden sm:block ml-3 text-xl font-bold text-white tracking-tight">
            Pytter
          </span>
        </div>

        {/* Nav links */}
        {userData && (
          <nav className="flex flex-col space-y-1">
            <Link
              href="/"
              className={`flex items-center space-x-3 p-2.5 sm:px-4 rounded-full transition-all duration-200 font-medium ${
                isActive("/")
                  ? "bg-white/10 text-white"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className={`${isActive("/") ? "text-indigo-400" : ""}`}>
                <HomeIcon size={20} />
              </span>
              <span className="hidden sm:inline text-sm">Home</span>
            </Link>
            <Link
              href={`/user/${userData.username}`}
              className={`flex items-center space-x-3 p-2.5 sm:px-4 rounded-full transition-all duration-200 font-medium ${
                isActive(`/user/${userData.username}`)
                  ? "bg-white/10 text-white"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <UserIcon size={20} />
              <span className="hidden sm:inline text-sm">Profile</span>
            </Link>
          </nav>
        )}
      </div>

      {/* Bottom: User section */}
      <div>
        {userData ? (
          <div className="relative">
            <button
              className="flex items-center space-x-2 w-full p-2 sm:p-2.5 rounded-2xl hover:bg-white/5 transition-all duration-200 group"
              onClick={() => setVisible(!visible)}
            >
              <img
                src={userData.avatar}
                width={36}
                height={36}
                alt={userData.username}
                className="rounded-full shrink-0 ring-2 ring-white/10 group-hover:ring-indigo-500/40 transition-all duration-200"
              />
              <div className="hidden sm:flex flex-col text-left min-w-0 flex-1">
                <span className="font-semibold text-sm text-white truncate">{userData.display_name}</span>
                <span className="text-slate-500 text-xs truncate">@{userData.username}</span>
              </div>
              <span className={`hidden sm:block text-slate-500 transition-transform duration-200 ${visible ? "rotate-180" : ""}`}>
                <ChevronUpIcon />
              </span>
            </button>

            {visible && (
              <div className="absolute bottom-full left-0 mb-2 w-52 bg-[#1a1a28] border border-[#2d2d42] rounded-2xl shadow-dropdown overflow-hidden z-50 animate-slide-up">
                <Link
                  href={`/user/${userData.username}`}
                  className="flex items-center space-x-3 px-4 py-3 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors font-medium"
                  onClick={() => setVisible(false)}
                >
                  <UserIcon size={15} />
                  <span>View profile</span>
                </Link>
                <div className="border-t border-[#1f1f2e]" />
                <button
                  onClick={() => {
                    removeCookie("token");
                    setUserData(undefined);
                    setVisible(false);
                  }}
                  className="flex items-center space-x-3 w-full px-4 py-3 text-sm text-rose-400 hover:bg-rose-500/10 transition-colors font-medium"
                >
                  <LogOutIcon />
                  <span>Log out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col space-y-2">
            <Link
              href="/auth/login"
              className="block text-center bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-full py-2.5 text-sm transition-all duration-200 active:scale-95"
            >
              <span className="hidden sm:inline">Log in</span>
              <span className="sm:hidden">→</span>
            </Link>
            <Link
              href="/auth/register"
              className="hidden sm:block text-center border border-[#2d2d42] text-slate-300 hover:border-indigo-500/50 hover:text-white hover:bg-white/5 font-medium rounded-full py-2.5 text-sm transition-all duration-200 active:scale-95"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}
