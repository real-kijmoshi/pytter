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

function HeartIcon({ filled, size = 17 }: { filled: boolean; size?: number }) {
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
    <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" className="text-accent/30">
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
  const [activeTab, setActiveTab] = useState<"foryou" | "following">("foryou");
  const [composerFocused, setComposerFocused] = useState(false);

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
          setComposerFocused(false);
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
    <div className="flex flex-col min-h-screen">
      {/* Sticky header */}
      <header className="sticky top-0 z-10 backdrop-blur-md bg-bg/80 border-b border-border">
        <div className="flex">
          <button
            onClick={() => setActiveTab("foryou")}
            className={`flex-1 py-4 text-sm font-semibold transition-all duration-200 relative ${
              activeTab === "foryou" ? "text-text-primary" : "text-text-muted hover:text-text-secondary hover:bg-white/[0.03]"
            }`}
          >
            For you
            {activeTab === "foryou" && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-[3px] rounded-full bg-gradient-to-r from-accent to-accent-bright" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("following")}
            className={`flex-1 py-4 text-sm font-semibold transition-all duration-200 relative ${
              activeTab === "following" ? "text-text-primary" : "text-text-muted hover:text-text-secondary hover:bg-white/[0.03]"
            }`}
          >
            Following
            {activeTab === "following" && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-[3px] rounded-full bg-gradient-to-r from-accent to-accent-bright" />
            )}
          </button>
        </div>
      </header>

      {/* Tweet Composer */}
      {user?.username && (
        <div className={`border-b border-border px-4 pt-4 pb-3 transition-all duration-200 ${composerFocused ? "bg-white/[0.01]" : ""}`}>
          <div className="flex gap-3">
            <img
              src={user.avatar}
              alt={user.username}
              width={44}
              height={44}
              className="rounded-full shrink-0 ring-2 ring-border-highlight object-cover mt-0.5"
            />
            <div className="flex-1 min-w-0">
              <textarea
                placeholder="What's on your mind?"
                className="w-full bg-transparent outline-none text-text-primary placeholder-text-muted text-[1.0625rem] leading-relaxed pt-2 min-h-[52px]"
                rows={composerFocused ? 3 : 2}
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                onFocus={() => setComposerFocused(true)}
                maxLength={280}
              />

              {/* Composer actions */}
              <div className={`flex items-center justify-between pt-3 border-t border-border mt-2 transition-all duration-200 ${!composerFocused && !postContent ? "opacity-60" : "opacity-100"}`}>
                <div className="flex items-center gap-1.5">
                  {/* Progress ring */}
                  <div className="relative w-7 h-7">
                    <svg width="28" height="28" viewBox="0 0 28 28" className="-rotate-90">
                      <circle cx="14" cy="14" r={PROGRESS_CIRCLE_RADIUS} fill="none" stroke="#1e1e2e" strokeWidth="2.5" />
                      <circle
                        cx="14" cy="14" r={PROGRESS_CIRCLE_RADIUS}
                        fill="none"
                        stroke={isDanger ? "#f43f5e" : isWarning ? "#f59e0b" : "#7c3aed"}
                        strokeWidth="2.5"
                        strokeDasharray={circumference}
                        strokeDashoffset={circumference * (1 - progress)}
                        strokeLinecap="round"
                        className="transition-all duration-100"
                      />
                    </svg>
                    {isWarning && (
                      <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold" style={{ color: isDanger ? "#f43f5e" : "#f59e0b" }}>
                        {remaining}
                      </span>
                    )}
                  </div>
                  <div className="w-px h-5 bg-border" />
                </div>

                <div className="flex items-center gap-2">
                  {postContent && (
                    <button
                      className="text-xs text-text-muted hover:text-text-secondary transition-colors px-2"
                      onClick={() => { setPostContent(""); setError(""); }}
                    >
                      Clear
                    </button>
                  )}
                  <button
                    className="flex items-center gap-1.5 bg-gradient-to-r from-accent to-accent-bright hover:opacity-90 text-white font-semibold rounded-full px-5 py-2 text-sm transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 shadow-button"
                    onClick={handlePost}
                    disabled={postContent.trim().length === 0 || isDanger}
                  >
                    Post
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-rose-400 text-xs mt-2 flex items-center gap-1.5 bg-rose-500/10 rounded-lg px-3 py-2">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                  <span>{error}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {tweets.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-4 animate-float">
            <SparkleIcon />
          </div>
          <p className="text-lg font-bold text-text-primary mb-1.5">Nothing here yet</p>
          <p className="text-sm text-text-muted max-w-[240px] text-center leading-relaxed">
            Be the first to share something with the world!
          </p>
        </div>
      )}

      {/* Feed */}
      <div>
        {tweets.map((tweet, idx) => (
          <article
            key={tweet.id}
            className="border-b border-border px-4 py-4 hover:bg-white/[0.02] transition-colors duration-150 animate-fade-in"
            style={{ animationDelay: `${idx * 30}ms`, animationFillMode: "both" }}
          >
            <div className="flex gap-3">
              <div className="shrink-0">
                <img
                  src={tweet.author.avatar}
                  alt={tweet.author.username}
                  width={44}
                  height={44}
                  className="rounded-full ring-2 ring-border-highlight hover:ring-accent/30 transition-all duration-200 object-cover cursor-pointer"
                />
              </div>
              <div className="flex-1 min-w-0">
                {/* Author line */}
                <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                  <span className="font-bold text-sm text-text-primary hover:underline cursor-pointer">
                    {tweet.author.display_name}
                  </span>
                  <span className="text-text-muted text-sm">@{tweet.author.username}</span>
                  <span className="text-border-highlight text-xs">·</span>
                  <span className="text-text-muted text-xs">{timeAgo(tweet.date_posted)}</span>
                </div>

                {/* Content */}
                <p className="text-text-secondary text-[0.9375rem] leading-relaxed break-words mt-0.5">
                  {tweet.content}
                </p>

                {/* Actions */}
                <div className="flex items-center gap-4 mt-3 -ml-1.5">
                  <button
                    className={`flex items-center gap-1.5 text-sm rounded-full px-2 py-1.5 transition-all duration-200 group ${
                      likedIds.has(tweet.id)
                        ? "text-pink"
                        : "text-text-muted hover:text-pink hover:bg-pink/10"
                    } ${!user ? "cursor-default" : "cursor-pointer"}`}
                    onClick={() => handleLike(tweet.id)}
                    disabled={!user}
                    aria-label="Like"
                  >
                    <span className={`transition-transform ${animatingId === tweet.id ? "animate-heart-pop" : ""}`}>
                      <HeartIcon filled={likedIds.has(tweet.id)} size={16} />
                    </span>
                    <span className="text-xs font-medium tabular-nums">
                      {tweet.like_count + (likedIds.has(tweet.id) ? 1 : 0)}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Bottom spacer */}
      {tweets.length > 0 && <div className="h-16" />}
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
