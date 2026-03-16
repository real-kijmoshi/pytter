/* eslint-disable @next/next/no-img-element */
import axios from "axios";
import Link from "next/link";
import { SERVER_ADRESS } from "@/config.json";

interface Tweet {
  id: number;
  content: string;
  user_id: number;
  date_posted: string;
  like_count: number;
}

interface UserProfile {
  id: number;
  username: string;
  display_name: string;
  profile_picture: string;
  account_created: string | null;
  tweet_count: number;
}

export default function UserPage({
  profile,
  tweets,
  error,
}: {
  profile: UserProfile | null;
  tweets: Tweet[];
  error?: string;
}) {
  if (error || !profile) {
    return (
      <main className="flex-1 min-h-screen border-r border-gray-200 max-w-2xl">
        <div className="sticky top-0 bg-white/80 backdrop-blur border-b border-gray-200 px-4 py-3 z-10 flex items-center gap-3">
          <Link href="/" className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <h1 className="text-xl font-bold">Profile</h1>
        </div>
        <div className="flex flex-col items-center py-16 text-gray-500">
          <p className="font-semibold text-lg">User not found</p>
          <Link href="/" className="text-brand text-sm mt-2 hover:underline">Back to home</Link>
        </div>
      </main>
    );
  }

  const joinedDate = profile.account_created
    ? new Date(profile.account_created).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : null;

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
    <main className="flex-1 min-h-screen border-r border-gray-200 max-w-2xl">
      {/* Back header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur border-b border-gray-200 px-4 py-3 z-10 flex items-center gap-3">
        <Link href="/" className="p-2 rounded-full hover:bg-gray-100 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
        <div>
          <h1 className="text-xl font-bold leading-tight">{profile.display_name}</h1>
          <p className="text-gray-500 text-xs">{profile.tweet_count} posts</p>
        </div>
      </div>

      {/* Profile banner */}
      <div className="h-32 bg-gradient-to-r from-brand to-blue-400" />

      {/* Avatar & info */}
      <div className="px-4 pb-4 border-b border-gray-200">
        <div className="flex justify-between items-end mb-3">
          <img
            src={profile.profile_picture}
            alt={profile.username}
            width={80}
            height={80}
            className="rounded-full w-20 h-20 object-cover border-4 border-white -mt-10"
          />
        </div>
        <h2 className="text-xl font-bold">{profile.display_name}</h2>
        <p className="text-gray-500 text-sm">@{profile.username}</p>
        {joinedDate && (
          <p className="text-gray-500 text-sm mt-2 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Joined {joinedDate}
          </p>
        )}
        <div className="mt-3">
          <span className="text-sm font-semibold">{profile.tweet_count}</span>
          <span className="text-gray-500 text-sm ml-1">Posts</span>
        </div>
      </div>

      {/* Tweets */}
      <div>
        {tweets.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-gray-500">
            <p className="font-semibold">No posts yet</p>
            <p className="text-sm text-gray-400">@{profile.username} hasn&apos;t posted anything yet.</p>
          </div>
        ) : (
          tweets.map((tweet) => (
            <article key={tweet.id} className="flex gap-3 px-4 py-3 border-b border-gray-200 hover:bg-gray-50 transition-colors">
              <img
                src={profile.profile_picture}
                alt={profile.username}
                width={44}
                height={44}
                className="rounded-full w-11 h-11 object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-1 flex-wrap">
                  <span className="font-semibold text-sm">{profile.display_name}</span>
                  <span className="text-gray-500 text-xs">@{profile.username}</span>
                  <span className="text-gray-400 text-xs">· {timeAgo(tweet.date_posted)}</span>
                </div>
                <p className="text-sm text-gray-900 mt-1 whitespace-pre-wrap break-words">{tweet.content}</p>
                <div className="mt-2 flex items-center gap-1 text-gray-400 text-xs">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {tweet.like_count}
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </main>
  );
}

export const getServerSideProps = async (ctx: any) => {
  const { username } = ctx.params;

  try {
    const profileRes = await axios.get(`${SERVER_ADRESS}/users/${username}`);
    const profile: UserProfile = profileRes.data;

    const tweetsRes = await axios.get(`${SERVER_ADRESS}/tweets`, {
      params: { user_id: profile.id },
    });
    const tweets: Tweet[] = tweetsRes.data.tweets ?? [];

    return { props: { profile, tweets } };
  } catch (err: any) {
    if (err.response?.status === 404) {
      return { props: { profile: null, tweets: [], error: "not found" } };
    }
    return { props: { profile: null, tweets: [], error: "error" } };
  }
};
