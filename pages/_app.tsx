import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Aside from "./components/Aside";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`flex flex-row`}>
      <Aside />
      <Component {...pageProps} />
    </div>
  );
}
