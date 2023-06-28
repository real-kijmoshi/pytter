import axios from "axios";
import { useState } from "react";
import { ChevronRight } from "react-bootstrap-icons";

import { SERVER_ADRESS } from "@/config.json";

interface UserExtended {
  username: string;
  display_name: string;
  avatar: string;

  // extended
  token: string;
}

export default function Home({ user }: { user: UserExtended | null }) {
  const [postContent, setPostContent] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handlePost = () => {
    if (postContent.length < 1) {
      setError("post is too short");
    }
    if (postContent.length > 500) {
      setError("post is too long");
    }

    axios
      .post(
        process.env.SERVER_ADRESS + "/post/create",
        {},
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
          data: {
            content: postContent,
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          setError("");
          setPostContent("");
        } else {
          setError(res.data.error);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className={`content-center w-full flex flex-col items-center`}>
      {user?.username && (
        <div
          className={`flex flex-col space-x-2xl w-2/3 h-fit rounded shadow-lg border border-[#e6e6e6] text-center pl-10 pr-3 py-3 mt-10`}
        >
          <div className={`flex justify-center items-center`}>
            <textarea
              placeholder="Post something"
              className={`p-1 outline-none decoration-none w-full`}
              onChange={(e) => setPostContent(e.target.value)}
            />
            <button
              className={`rounded-full ml-2 p-2 hover:bg-gray-200`}
              onClick={handlePost}
            >
              <ChevronRight height={16} />
            </button>
          </div>
          <p className={`text-red-500`}>{error}</p>
        </div>
      )}

      <div>posts</div>
    </div>
  );
}

export const getServerSideProps = async (ctx: any) => {
  const token = ctx.req.cookies.token;

  if (token) {
    const res = await axios.get(SERVER_ADRESS + "/whoami", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 200) {
      return { props: { user: { ...res.data, token } } };
    }
  }

  return { props: { user: null } };
};
