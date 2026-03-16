/* eslint-disable @next/next/no-img-element */
import axios from "axios";
import { useState, useEffect } from "react";
import { HeartFill, Heart, Send } from "react-bootstrap-icons";

import { SERVER_ADRESS } from "@/config.json";

interface TweetAuthor {
  username: string;
  display_name: string;
  avatar: string;
}

interface TweetItem {
  id: number;
  content: string;
  date_posted: string;
  like_count: number;
  author: TweetAuthor;
}

interface UserExtended {
  username: string;
  display_name: string;
  avatar: string;

  // extended
  token: string;
}

function timeAgo(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}

export default function Home({ user }: { user: UserExtended | null }) {
  const [postContent, setPostContent] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [tweets, setTweets] = useState<TweetItem[]>([]);
  const [likedIds, setLikedIds] = useState<Set<number>>(new Set());

  const loadFeed = () => {
    axios.get(SERVER_ADRESS + "/feed").then((res) => {
      if (res.status === 200) {
        setTweets(res.data.tweets);
      }
    }).catch(() => {});
  };

  useEffect(() => {
    loadFeed();
  }, []);

  const handlePost = () => {
    if (postContent.trim().length < 1) {
      setError("Post is too short.");
      return;
    }
    if (postContent.length > 280) {
      setError("Post is too long (max 280 characters).");
      return;
    }

    axios
      .post(
        SERVER_ADRESS + "/tweet",
        { content: postContent },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      )
      .then((res) => {
        if (res.status === 201) {
          setError("");
          setPostContent("");
          loadFeed();
        } else {
          setError(res.data.message);
        }
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Something went wrong.");
      });
  };

  const handleLike = (tweetId: number) => {
    if (!user) return;
    const wasLiked = likedIds.has(tweetId);
    axios
      .post(
        SERVER_ADRESS + "/like",
        { tweet_id: tweetId },
        { headers: { Authorization: `Bearer ${user.token}` } }
      )
      .then(() => {
        setLikedIds((prev) => {
          const next = new Set(prev);
          if (next.has(tweetId)) next.delete(tweetId);
          else next.add(tweetId);
          return next;
        });
        setTweets((prev) =>
          prev.map((t) =>
            t.id === tweetId
              ? { ...t, like_count: wasLiked ? t.like_count - 1 : t.like_count + 1 }
              : t
          )
        );
      })
      .catch(() => {});
  };

  return (
    <div className="flex-1 max-w-xl mx-auto py-4 px-2">
      {user?.username && (
        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4 shadow-sm">
          <div className="flex items-start space-x-3">
            <img
              src={user.avatar}
              alt={user.username}
              width={48}
              height={48}
              className="rounded-full shrink-0"
            />
            <div className="flex-1">
              <textarea
                placeholder="What's happening?"
                className="w-full resize-none outline-none text-gray-900 placeholder-gray-400 text-lg p-1"
                rows={3}
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                maxLength={280}
              />
              <div className="flex justify-between items-center mt-2 border-t border-gray-100 pt-2">
                <span className={`text-sm ${postContent.length > 260 ? "text-red-500" : "text-gray-400"}`}>
                  {postContent.length}/280
                </span>
                <button
                  className="flex items-center space-x-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full px-4 py-1.5 text-sm transition-colors disabled:opacity-50"
                  onClick={handlePost}
                  disabled={postContent.trim().length === 0}
                >
                  <Send size={14} />
                  <span>Post</span>
                </button>
              </div>
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>
          </div>
        </div>
      )}

      {tweets.length === 0 && (
        <div className="text-center text-gray-400 py-16">
          <p className="text-xl font-semibold">No posts yet</p>
          <p className="text-sm mt-1">Be the first to post something!</p>
        </div>
      )}

      <div className="space-y-px">
        {tweets.map((tweet) => (
          <div
            key={tweet.id}
            className="bg-white border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex space-x-3">
              <img
                src={tweet.author.avatar}
                alt={tweet.author.username}
                width={48}
                height={48}
                className="rounded-full shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-1 flex-wrap">
                  <span className="font-semibold text-gray-900 truncate">{tweet.author.display_name}</span>
                  <span className="text-gray-500 text-sm">@{tweet.author.username}</span>
                  <span className="text-gray-400 text-sm">·</span>
                  <span className="text-gray-400 text-sm">{timeAgo(tweet.date_posted)}</span>
                </div>
                <p className="text-gray-900 mt-1 break-words">{tweet.content}</p>
                <div className="flex items-center mt-2 space-x-1">
                  <button
                    className={`flex items-center space-x-1 text-sm transition-colors group ${
                      likedIds.has(tweet.id) ? "text-red-500" : "text-gray-400 hover:text-red-500"
                    }`}
                    onClick={() => handleLike(tweet.id)}
                    disabled={!user}
                  >
                    {likedIds.has(tweet.id) ? <HeartFill size={16} /> : <Heart size={16} />}
                    <span>{tweet.like_count + (likedIds.has(tweet.id) ? 1 : 0)}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export const getServerSideProps = async (ctx: any) => {
  const token = ctx.req.cookies.token;

  if (token) {
    try {
      const res = await axios.get(SERVER_ADRESS + "/whoami", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 200) {
        return { props: { user: { ...res.data, token } } };
      }
    } catch {
      // Token invalid or expired
    }
  }

  return { props: { user: null } };
};
