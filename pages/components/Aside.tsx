/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { useCookies } from "react-cookie";

interface User {
  username: string;
  display_name: string;
  profile_picture: string;
}

export default function Aside() {
  const [userData, setUserData] = useState<User | undefined>();
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const [cookies, , removeCookie] = useCookies(["token"]);

  useEffect(() => {
    const token = cookies.token;
    if (token) {
      axios
        .get("/api/auth/whoami")
        .then((res) => {
          if (res.status === 200) {
            setUserData(res.data);
          } else {
            removeCookie("token");
          }
        })
        .catch(() => {
          removeCookie("token");
        });
    }
  }, [cookies.token, removeCookie]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <aside className="sticky top-0 h-screen w-16 sm:w-64 flex flex-col justify-between border-r border-gray-200 bg-white px-2 sm:px-4 py-4 shrink-0">
      {/* Logo */}
      <div>
        <Link href="/" className="flex items-center gap-3 px-2 py-3 mb-4 rounded-xl hover:bg-brand-light transition-colors">
          <span className="text-brand text-2xl font-black select-none">𝕻</span>
          <span className="hidden sm:block text-xl font-bold text-brand">Pytter</span>
        </Link>

        {/* Nav links */}
        <nav className="flex flex-col gap-1">
          <Link href="/" className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-100 transition-colors font-medium text-gray-800">
            <svg className="w-6 h-6 shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
            <span className="hidden sm:block">Home</span>
          </Link>
          {userData && (
            <Link href={`/user/${userData.username}`} className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-100 transition-colors font-medium text-gray-800">
              <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="hidden sm:block">Profile</span>
            </Link>
          )}
        </nav>
      </div>

      {/* User section at bottom */}
      <div>
        {userData ? (
          <div ref={menuRef} className="relative">
            {menuOpen && (
              <div className="absolute bottom-full mb-2 left-0 w-full sm:w-56 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-50">
                <Link
                  href={`/user/${userData.username}`}
                  className="block px-4 py-3 text-sm font-semibold hover:bg-gray-50 transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  View Profile
                </Link>
                <hr className="border-gray-100 my-1" />
                <button
                  onClick={() => {
                    removeCookie("token", { path: "/" });
                    setUserData(undefined);
                    setMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors"
                >
                  Log out @{userData.username}
                </button>
              </div>
            )}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-3 w-full px-2 py-2 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <img
                src={userData.profile_picture}
                width={40}
                height={40}
                alt={userData.username}
                className="rounded-full w-10 h-10 object-cover shrink-0"
              />
              <div className="hidden sm:block text-left overflow-hidden flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{userData.display_name}</p>
                <p className="text-gray-500 text-xs truncate">@{userData.username}</p>
              </div>
              <svg className="hidden sm:block w-5 h-5 text-gray-500 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
              </svg>
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <Link href="/auth/login" className="btn-primary text-center text-sm hidden sm:block">
              Log in
            </Link>
            <Link href="/auth/register" className="btn-outline text-center text-sm hidden sm:block">
              Sign up
            </Link>
            <Link href="/auth/login" className="sm:hidden flex justify-center p-2">
              <svg className="w-6 h-6 text-brand" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}

