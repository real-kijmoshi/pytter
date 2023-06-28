/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import axios from "axios";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

import config from "@/config.json";

const SERVER_ADRESS = config.SERVER_ADRESS;

//const SERVER_ADRESS = "http:///127.0.0.1:5000";

interface User {
  username: string;
  display_name: string;
  avatar: string;
}

export default function Aside() {
  const [userData, setUserData] = useState<User | undefined>();
  const [visible, setVisible] = useState<boolean>(false);

  const [cookies, setCookie, removeCookie] = useCookies(["token"]);

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
          if (res.status === 200) {
            setUserData(res.data);
          } else {
            removeCookie("token");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [cookies.token, removeCookie]);

  return (
    <aside
      className={`w-32 sm:w-64 h-screen bg-white border border-[#e6e6e6] border-right `}
    >
      {userData && (
        <div>
          <div>
            <div
              className={`flex flex-col sm:flex-row sm:items-center cursor-pointer`}
              onClick={() => setVisible(!visible)}
            >
              <img
                src={userData.avatar}
                width={64}
                height={64}
                alt={userData.username}
                className={`rounded-full sm:m-2 mx-auto`}
              />
              <h1 className={`text-center`}>{userData.display_name}</h1>
            </div>
            {visible && (
              <div
                className={`flex flex-col absolute bg-white ml-5 border rounded`}
              >
                <Link
                  href={`/user/${userData.username}`}
                  className={`p-2 px-10 hover:bg-blue-300 hover:text-white`}
                >
                  Account
                </Link>

                <div
                  onClick={() => {
                    removeCookie("token");
                    setUserData(undefined);
                  }}
                  className={`p-2 px-10 hover:bg-red-500 hover:text-white`}
                >
                  Logout
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {!userData && (
        <div className={`flex flex-col items-center justify-center h-screen`}>
          <Link
            href="/auth/login"
            className={`border border-black rounded-lg p-2 px-10 hover:bg-black hover:text-white`}
          >
            Login
          </Link>
        </div>
      )}
    </aside>
  );
}
