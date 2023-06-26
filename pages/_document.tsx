import { Html, Head, Main, NextScript } from "next/document";
import Aside from "./components/Aside";
import { useEffect, useState } from "react";

export default function Document() {
  const [loading, setLoading] = useState(true);
  const [whoAmI, setWhoAmI] = useState("test");

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <Html lang="en">
      <Head />
      {!loading ? (
        <div className={`text-center`}>
          loading
        </div>
      ) : (
        <body className={`flex flex-row`}>
          {
            whoAmI && <Aside whoAmI={whoAmI} />
          }
          <div>
            <Main />
            <NextScript />
          </div>
        </body>
      )}
    </Html>
  );
}
