/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import axios from "axios";
import { useEffect, useState } from "react";

import config from "@/config.json";

const SERVER_ADRESS = config.SERVER_ADRESS;

//const SERVER_ADRESS = "http:///127.0.0.1:5000";

interface whioAmIaccount {
  username: string;
  displayName: string;
  avatar: string;
}

export default function Aside() {
  const [userData, setUserData] = useState<whioAmIaccount | undefined>();
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      axios
        .post(
          SERVER_ADRESS + "/whoami",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          if(res.status != 200) {
            localStorage.removeItem("token");
            location.href = "/";
          }
          setUserData(res.data);
        })
        .catch((err) => {
          console.log(err);
          if (err.response?.status != 200) {
            axios
              .get(SERVER_ADRESS + "/ping", {})
              .then((res) => {
                if (res.data != "pong") {
                  alert("Server is down please try again later");
                }
              })
              .catch((err) => {
                alert(
                  "Server is down please try again later or contact with server admin (kijmoshi.xyz discord: @kijmoshi or @mertane.)"
                );
              });
          }
        });
    }
  }, []);
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
              <h1 className={`text-center`}>{userData.displayName}</h1>
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
                    localStorage.removeItem("token");
                    location.href = "/";
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
