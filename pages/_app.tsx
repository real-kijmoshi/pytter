import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Aside from "./components/Aside";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  if (router.pathname.startsWith("/auth")) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Component {...pageProps} />
      </div>
    );
  }

  return (
    <div className="flex flex-row min-h-screen bg-gray-50">
      <Aside />
      <main className="flex-1 min-w-0">
        <Component {...pageProps} />
      </main>
    </div>
  );
}
