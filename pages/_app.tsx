import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Aside from "./components/Aside";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  if (router.pathname.startsWith("/auth")) {
    return <Component {...pageProps} />;
  }

  return (
    <div className="flex flex-row min-h-screen max-w-6xl mx-auto">
      <Aside />
      <Component {...pageProps} />
    </div>
  );
}

