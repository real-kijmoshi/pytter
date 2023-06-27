import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { useEffect, useState } from "react";

interface whioAmIaccount {
  username: string;
  displayName: string;
  avatar: string;
}

export default function Aside() {
  const [userData, setUserData] = useState<whioAmIaccount | undefined>();

  useEffect(() => {
    localStorage.setItem(
      "token",
      "t"
    );
    const token = localStorage.getItem("token");


    console.log(token);

    if (token) {
      axios.post("http://127.0.0.1:5000/whoami", {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      }).then((res) => {
        console.log(res.data);
        setUserData(res.data);
        
      }).catch((err) => {
        console.log(err);
      })
      
    }
  }, []);
  return (
    <aside
      className={`w-64 h-screen bg-white border border-[#e6e6e6] border-right`}
    >
      {userData ? (
        <div>
          <Image
            src={userData.avatar}
            width={64}
            height={64}
            alt={userData.username}
            className={`rounded-full`}
          />
        </div>
      ) : (
        <div className={`flex flex-col items-center justify-center h-screen`}>
          <Link
            href="/login"
            className={`border border-black rounded-lg p-2 px-10`}
          >
            Login
          </Link>
        </div>
      )}
    </aside>
  );
}
