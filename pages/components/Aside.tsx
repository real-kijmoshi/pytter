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

function HomeIcon({ size = 22, filled = false }: { size?: number; filled?: boolean }) {
  return filled ? (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </svg>
  ) : (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function UserCircleIcon({ size = 22, filled = false }: { size?: number; filled?: boolean }) {
  return filled ? (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 4a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm0 13.5a7.5 7.5 0 0 1-6-3c.053-2 4-3.1 6-3.1s5.947 1.1 6 3.1a7.5 7.5 0 0 1-6 3z" />
    </svg>
  ) : (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function MoreHorizIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <circle cx="5" cy="12" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="19" cy="12" r="2" />
    </svg>
  );
}

function LogOutIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function PytterLogo({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path
        d="M16 4C9.373 4 4 9.373 4 16s5.373 12 12 12 12-5.373 12-12S22.627 4 16 4z"
        fill="url(#logoGrad)"
      />
      <path
        d="M10 13h5l-2 3h4l-5 7 1-5h-3l2-5z"
        fill="white"
        fillOpacity="0.95"
      />
      <defs>
        <linearGradient id="logoGrad" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7c3aed" />
          <stop offset="1" stopColor="#ec4899" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function Aside() {
  const [userData, setUserData] = useState<User | undefined>();
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
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
    <aside className="w-[68px] xl:w-[260px] min-h-screen bg-bg border-r border-border flex flex-col justify-between py-3 shrink-0 sticky top-0 self-start h-screen overflow-y-auto">
      {/* Top section */}
      <div className="flex flex-col px-2 xl:px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 p-3 mb-1 rounded-2xl hover:bg-white/[0.05] transition-colors group w-fit xl:w-auto">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-glow-violet group-hover:shadow-glow-violet transition-shadow duration-300">
            <PytterLogo size={28} />
          </div>
          <span className="hidden xl:block text-xl font-bold text-text-primary tracking-tight">
            Pytter
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex flex-col gap-0.5 mt-2">
          <Link
            href="/"
            className={`flex items-center gap-3 px-3 py-3 rounded-2xl transition-all duration-200 font-medium text-[0.9375rem] group ${
              isActive("/")
                ? "text-text-primary font-semibold"
                : "text-text-secondary hover:text-text-primary hover:bg-white/[0.06]"
            }`}
          >
            <span className={`transition-all duration-200 ${isActive("/") ? "text-accent" : "group-hover:scale-110"}`}>
              <HomeIcon size={22} filled={isActive("/")} />
            </span>
            <span className="hidden xl:inline">Home</span>
          </Link>

          {userData && (
            <Link
              href={`/user/${userData.username}`}
              className={`flex items-center gap-3 px-3 py-3 rounded-2xl transition-all duration-200 font-medium text-[0.9375rem] group ${
                isActive(`/user/${userData.username}`)
                  ? "text-text-primary font-semibold"
                  : "text-text-secondary hover:text-text-primary hover:bg-white/[0.06]"
              }`}
            >
              <span className={`transition-all duration-200 ${isActive(`/user/${userData.username}`) ? "text-accent" : "group-hover:scale-110"}`}>
                <UserCircleIcon size={22} filled={isActive(`/user/${userData.username}`)} />
              </span>
              <span className="hidden xl:inline">Profile</span>
            </Link>
          )}
        </nav>

        {/* Post button */}
        {userData && (
          <div className="mt-4">
            <Link
              href="/"
              className="xl:flex hidden items-center justify-center w-full py-3 rounded-full font-semibold text-sm text-white bg-gradient-to-r from-accent to-accent-bright hover:opacity-90 transition-all duration-200 active:scale-95 shadow-button hover:shadow-button-hover"
            >
              Post
            </Link>
            <Link
              href="/"
              className="xl:hidden flex items-center justify-center w-10 h-10 rounded-full font-semibold text-white bg-gradient-to-r from-accent to-accent-bright hover:opacity-90 transition-all shadow-button mx-auto"
              title="Post"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </Link>
          </div>
        )}
      </div>

      {/* Bottom: User section */}
      <div className="px-2 xl:px-4 mt-4">
        {userData ? (
          <div className="relative">
            <button
              className="flex items-center gap-2.5 w-full p-2.5 rounded-2xl hover:bg-white/[0.06] transition-all duration-200 group"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <img
                src={userData.avatar}
                width={38}
                height={38}
                alt={userData.username}
                className="rounded-full shrink-0 ring-2 ring-border-highlight group-hover:ring-accent/40 transition-all duration-200 object-cover"
              />
              <div className="hidden xl:flex flex-col text-left min-w-0 flex-1">
                <span className="font-semibold text-sm text-text-primary truncate leading-tight">{userData.display_name}</span>
                <span className="text-text-muted text-xs truncate leading-tight">@{userData.username}</span>
              </div>
              <span className="hidden xl:block text-text-muted group-hover:text-text-secondary transition-colors ml-auto">
                <MoreHorizIcon />
              </span>
            </button>

            {menuOpen && (
              <div className="absolute bottom-full left-0 mb-2 w-56 bg-surface-overlay border border-border-highlight rounded-2xl shadow-dropdown overflow-hidden z-50 animate-scale-in">
                <div className="px-4 py-3 border-b border-border">
                  <p className="font-semibold text-sm text-text-primary truncate">{userData.display_name}</p>
                  <p className="text-xs text-text-muted truncate">@{userData.username}</p>
                </div>
                <Link
                  href={`/user/${userData.username}`}
                  className="flex items-center gap-3 px-4 py-3 text-sm text-text-secondary hover:bg-white/[0.05] hover:text-text-primary transition-colors font-medium"
                  onClick={() => setMenuOpen(false)}
                >
                  <UserCircleIcon size={16} />
                  <span>View profile</span>
                </Link>
                <div className="border-t border-border" />
                <button
                  onClick={() => {
                    removeCookie("token");
                    setUserData(undefined);
                    setMenuOpen(false);
                  }}
                  className="flex items-center gap-3 w-full px-4 py-3 text-sm text-rose-400 hover:bg-rose-500/10 transition-colors font-medium"
                >
                  <LogOutIcon />
                  <span>Log out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <Link
              href="/auth/login"
              className="flex items-center justify-center py-2.5 rounded-full font-semibold text-sm text-white bg-gradient-to-r from-accent to-accent-bright hover:opacity-90 transition-all duration-200 active:scale-95 shadow-button"
            >
              <span className="hidden xl:inline">Log in</span>
              <span className="xl:hidden text-base">→</span>
            </Link>
            <Link
              href="/auth/register"
              className="hidden xl:flex items-center justify-center py-2.5 rounded-full border border-border-highlight text-text-secondary hover:border-accent/40 hover:text-text-primary hover:bg-white/[0.04] font-medium text-sm transition-all duration-200 active:scale-95"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}
