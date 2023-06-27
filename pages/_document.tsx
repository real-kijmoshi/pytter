import { Html, Head, Main, NextScript } from "next/document";
import Aside from "./components/Aside";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className={`flex flex-row`}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
