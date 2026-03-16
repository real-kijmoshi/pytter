/* eslint-disable @next/next/no-img-element */
import axios from "axios";
import { useState, useEffect } from "react";

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
  token: string;
}

function timeAgo(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}

function SendIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
    </svg>
  );
}

function HeartIcon({ filled, size = 16 }: { filled: boolean; size?: number }) {
  return filled ? (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  ) : (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="text-indigo-500/40">
      <path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5z" />
    </svg>
  );
}

export default function Home({ user }: { user: UserExtended | null }) {
  const [postContent, setPostContent] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [tweets, setTweets] = useState<TweetItem[]>([]);
  const [likedIds, setLikedIds] = useState<Set<number>>(new Set());
  const [animatingId, setAnimatingId] = useState<number | null>(null);

  const remaining = 280 - postContent.length;
  const isWarning = remaining <= 20;
  const isDanger = remaining < 0;

  const PROGRESS_CIRCLE_RADIUS = 9;
  const circumference = 2 * Math.PI * PROGRESS_CIRCLE_RADIUS;
  const progress = Math.min(postContent.length / 280, 1);

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
    setAnimatingId(tweetId);
    setTimeout(() => setAnimatingId(null), 400);
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
    <div className="flex-1 max-w-[600px] mx-auto py-4 px-3">
      {/* Header */}
      <div className="pb-3 mb-1">
        <h1 className="text-lg font-bold text-white">Home</h1>
      </div>

      {/* Composer */}
      {user?.username && (
        <div className="bg-[#13131a] border border-[#1f1f2e] rounded-2xl p-4 mb-1">
          <div className="flex items-start space-x-3">
            <img
              src={user.avatar}
              alt={user.username}
              width={40}
              height={40}
              className="rounded-full shrink-0 ring-2 ring-white/10"
            />
            <div className="flex-1 min-w-0">
              <textarea
                placeholder="What's on your mind?"
                className="w-full bg-transparent outline-none text-slate-100 placeholder-slate-600 text-base leading-relaxed pt-1 min-h-[72px]"
                rows={3}
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                maxLength={280}
              />
              <div className="flex justify-between items-center mt-2 pt-2 border-t border-[#1f1f2e]">
                <div className="flex items-center space-x-2">
                  {/* Circular progress indicator */}
                  <svg width="24" height="24" viewBox="0 0 24 24" className="-rotate-90">
                    <circle
                      cx="12" cy="12" r={PROGRESS_CIRCLE_RADIUS}
                      fill="none"
                      stroke="#1f1f2e"
                      strokeWidth="2.5"
                    />
                    <circle
                      cx="12" cy="12" r={PROGRESS_CIRCLE_RADIUS}
                      fill="none"
                      stroke={isDanger ? "#f43f5e" : isWarning ? "#f59e0b" : "#6366f1"}
                      strokeWidth="2.5"
                      strokeDasharray={circumference}
                      strokeDashoffset={circumference * (1 - progress)}
                      strokeLinecap="round"
                      className="transition-all duration-100"
                    />
                  </svg>
                  <span className={`text-xs font-medium ${isDanger ? "text-rose-400" : isWarning ? "text-amber-400" : "text-slate-600"}`}>
                    {isWarning || isDanger ? remaining : ""}
                  </span>
                </div>
                <button
                  className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-full px-4 py-1.5 text-sm transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
                  onClick={handlePost}
                  disabled={postContent.trim().length === 0 || isDanger}
                >
                  <SendIcon />
                  <span>Post</span>
                </button>
              </div>
              {error && (
                <p className="text-rose-400 text-xs mt-2 flex items-center space-x-1">
                  <span>⚠</span>
                  <span>{error}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Divider */}
      <div className="border-t border-[#1f1f2e] mb-1" />

      {/* Empty state */}
      {tweets.length === 0 && (
        <div className="text-center py-20 animate-fade-in">
          <div className="flex justify-center mb-4">
            <SparkleIcon />
          </div>
          <p className="text-lg font-semibold text-white mb-1">Nothing here yet</p>
          <p className="text-sm text-slate-500">Be the first to share something!</p>
        </div>
      )}

      {/* Feed */}
      <div>
        {tweets.map((tweet) => (
          <article
            key={tweet.id}
            className="border-b border-[#1f1f2e] px-4 py-4 hover:bg-white/[0.02] transition-colors duration-150 cursor-default"
          >
            <div className="flex space-x-3">
              <img
                src={tweet.author.avatar}
                alt={tweet.author.username}
                width={42}
                height={42}
                className="rounded-full shrink-0 ring-2 ring-white/5"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-1.5 flex-wrap mb-0.5">
                  <span className="font-semibold text-sm text-white">{tweet.author.display_name}</span>
                  <span className="text-slate-600 text-sm">@{tweet.author.username}</span>
                  <span className="text-slate-700 text-xs">·</span>
                  <span className="text-slate-600 text-xs">{timeAgo(tweet.date_posted)}</span>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed break-words">{tweet.content}</p>
                <div className="flex items-center mt-3 -ml-1">
                  <button
                    className={`flex items-center space-x-1.5 text-xs rounded-full px-2 py-1 transition-all duration-200 group ${
                      likedIds.has(tweet.id)
                        ? "text-pink-500"
                        : "text-slate-600 hover:text-pink-500 hover:bg-pink-500/10"
                    } ${!user ? "cursor-default" : "cursor-pointer"}`}
                    onClick={() => handleLike(tweet.id)}
                    disabled={!user}
                    aria-label="Like"
                  >
                    <span className={animatingId === tweet.id ? "animate-heart-pop" : ""}>
                      <HeartIcon filled={likedIds.has(tweet.id)} size={15} />
                    </span>
                    <span className="font-medium">
                      {tweet.like_count + (likedIds.has(tweet.id) ? 1 : 0)}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </article>
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
