import axios from "axios";
import { useState, useEffect } from "react";
import { ChevronRight } from "react-bootstrap-icons";

export default function Home() {
  const [postContent, setPostContent] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    setToken(localStorage.getItem("token") || "");
  }, []);

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
            Authorization: `Bearer ${localStorage.getItem("token")}`,
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
      {token && (
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
