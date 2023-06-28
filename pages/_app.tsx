import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Aside from "./components/Aside";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  if (router.pathname.startsWith("/auth")) {
    return (
      <div>
        <Component {...pageProps} />
      </div>
    );
  }

  return (
    <div className={`flex flex-row`}>
      <Aside />
      <Component {...pageProps} />
    </div>
  );
}
