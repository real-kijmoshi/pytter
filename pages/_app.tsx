import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Aside from "./components/Aside";
import RightSidebar from "./components/RightSidebar";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  if (router.pathname.startsWith("/auth")) {
    return (
      <div className="min-h-screen bg-bg">
        <Component {...pageProps} />
      </div>
    );
  }

  return (
    <div className="flex flex-row min-h-screen bg-bg max-w-[1280px] mx-auto">
      <Aside />
      <main className="flex-1 min-w-0 border-x border-border">
        <Component {...pageProps} />
      </main>
      <RightSidebar />
    </div>
  );
}
