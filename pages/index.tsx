/* eslint-disable @next/next/no-img-element */
import axios from "axios";
import { useState, useEffect } from "react";
import Link from "next/link";
import { SERVER_ADRESS } from "@/config.json";

interface Author {
  username: string;
  display_name: string;
  profile_picture: string;
}

interface Tweet {
  id: number;
  content: string;
  user_id: number;
  date_posted: string;
  like_count: number;
  author: Author | null;
}

interface UserExtended {
  username: string;
  display_name: string;
  profile_picture: string;
  token: string;
}

function TweetCard({
  tweet,
  token,
  likedIds,
  onLikeToggle,
}: {
  tweet: Tweet;
  token: string | null;
  likedIds: Set<number>;
  onLikeToggle: (id: number, liked: boolean) => void;
}) {
  const liked = likedIds.has(tweet.id);
  const [likeCount, setLikeCount] = useState(tweet.like_count);
  const [pending, setPending] = useState(false);

  const handleLike = async () => {
    if (!token || pending) return;
    setPending(true);
    try {
      const res = await axios.post("/api/like", { tweet_id: tweet.id });
      const nowLiked: boolean = res.data.liked;
      setLikeCount((c) => (nowLiked ? c + 1 : c - 1));
      onLikeToggle(tweet.id, nowLiked);
    } catch {
      // ignore
    } finally {
      setPending(false);
    }
  };

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const s = Math.floor(diff / 1000);
    if (s < 60) return `${s}s`;
    const m = Math.floor(s / 60);
    if (m < 60) return `${m}m`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h`;
    return new Date(dateStr).toLocaleDateString();
  };

  return (
    <article className="flex gap-3 px-4 py-3 border-b border-gray-200 hover:bg-gray-50 transition-colors">
      {tweet.author ? (
        <Link href={`/user/${tweet.author.username}`} className="shrink-0">
          <img
            src={tweet.author.profile_picture}
            alt={tweet.author.username}
            width={44}
            height={44}
            className="rounded-full w-11 h-11 object-cover"
          />
        </Link>
      ) : (
        <div className="w-11 h-11 rounded-full bg-gray-200 shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-1 flex-wrap">
          {tweet.author ? (
            <Link href={`/user/${tweet.author.username}`} className="font-semibold text-sm hover:underline truncate">
              {tweet.author.display_name}
            </Link>
          ) : (
            <span className="font-semibold text-sm text-gray-500">Unknown</span>
          )}
          {tweet.author && (
            <span className="text-gray-500 text-xs truncate">@{tweet.author.username}</span>
          )}
          <span className="text-gray-400 text-xs">· {timeAgo(tweet.date_posted)}</span>
        </div>
        <p className="text-sm text-gray-900 mt-1 whitespace-pre-wrap break-words">{tweet.content}</p>
        <div className="mt-2 flex items-center gap-1">
          <button
            onClick={handleLike}
            disabled={!token || pending}
            className={`flex items-center gap-1 text-xs rounded-full px-2 py-1 transition-colors ${
              liked
                ? "text-red-500 bg-red-50 hover:bg-red-100"
                : "text-gray-500 hover:text-red-500 hover:bg-red-50"
            } disabled:cursor-not-allowed`}
            aria-label={liked ? "Unlike" : "Like"}
          >
            <svg className="w-4 h-4" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span>{likeCount}</span>
          </button>
        </div>
      </div>
    </article>
  );
}

export default function Home({ user }: { user: UserExtended | null }) {
  const [postContent, setPostContent] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [posting, setPosting] = useState<boolean>(false);
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [loadingFeed, setLoadingFeed] = useState<boolean>(true);
  const [likedIds, setLikedIds] = useState<Set<number>>(new Set());
  const charLimit = 300;

  const fetchFeed = async () => {
    try {
      const res = await axios.get("/api/feed");
      setTweets(res.data.tweets ?? []);
    } catch {
      // ignore
    } finally {
      setLoadingFeed(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  const handlePost = async () => {
    if (postContent.trim().length < 1) return setError("Post is too short");
    if (postContent.length > charLimit) return setError(`Post is too long (max ${charLimit} chars)`);

    setPosting(true);
    setError("");
    try {
      const res = await axios.post("/api/tweet", { content: postContent });
      if (res.status === 201) {
        setPostContent("");
        // Prepend the new tweet to feed
        const newTweet: Tweet = {
          ...res.data.tweet,
          like_count: 0,
          author: user
            ? {
                username: user.username,
                display_name: user.display_name,
                profile_picture: user.profile_picture,
              }
            : null,
        };
        setTweets((prev) => [newTweet, ...prev]);
      }
    } catch (err: any) {
      setError(err.response?.data?.message ?? "Failed to post");
    } finally {
      setPosting(false);
    }
  };

  const handleLikeToggle = (id: number, liked: boolean) => {
    setLikedIds((prev) => {
      const next = new Set(prev);
      liked ? next.add(id) : next.delete(id);
      return next;
    });
  };

  return (
    <main className="flex-1 min-h-screen border-r border-gray-200 max-w-2xl">
      {/* Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur border-b border-gray-200 px-4 py-3 z-10">
        <h1 className="text-xl font-bold">Home</h1>
      </div>

      {/* Compose box */}
      {user && (
        <div className="flex gap-3 px-4 py-4 border-b border-gray-200 bg-white">
          <img
            src={user.profile_picture}
            alt={user.username}
            width={44}
            height={44}
            className="rounded-full w-11 h-11 object-cover shrink-0"
          />
          <div className="flex-1">
            <textarea
              placeholder="What's happening?"
              className="w-full resize-none text-lg placeholder-gray-400 outline-none bg-transparent min-h-[80px]"
              value={postContent}
              onChange={(e) => {
                setPostContent(e.target.value);
                setError("");
              }}
              maxLength={charLimit + 10}
            />
            <div className="flex items-center justify-between mt-2">
              <span className={`text-sm ${postContent.length > charLimit ? "text-red-500" : "text-gray-400"}`}>
                {postContent.length}/{charLimit}
              </span>
              <div className="flex items-center gap-3">
                {error && <span className="text-sm text-red-500">{error}</span>}
                <button
                  className="btn-primary px-5 py-1.5 text-sm"
                  onClick={handlePost}
                  disabled={posting || postContent.trim().length === 0 || postContent.length > charLimit}
                >
                  {posting ? "Posting…" : "Post"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Feed */}
      {loadingFeed ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin" />
        </div>
      ) : tweets.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-gray-500">
          <svg className="w-12 h-12 mb-3 text-gray-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
          </svg>
          <p className="font-semibold text-lg">No posts yet</p>
          <p className="text-sm">Be the first to post something!</p>
        </div>
      ) : (
        <div>
          {tweets.map((tweet) => (
            <TweetCard
              key={tweet.id}
              tweet={tweet}
              token={user?.token ?? null}
              likedIds={likedIds}
              onLikeToggle={handleLikeToggle}
            />
          ))}
        </div>
      )}
    </main>
  );
}

export const getServerSideProps = async (ctx: any) => {
  const token = ctx.req.cookies?.token;

  if (token) {
    try {
      const res = await axios.get(SERVER_ADRESS + "/whoami", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 200) {
        return { props: { user: { ...res.data, token } } };
      }
    } catch {
      // invalid token – fall through
    }
  }

  return { props: { user: null } };
};

