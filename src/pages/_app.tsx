import type { AppProps } from "next/app";
import "@/styles/index.scss";
import "@fontsource/jetbrains-mono";
import { Analytics } from "@vercel/analytics/next"

export default function App({ Component, pageProps }: AppProps) {
  return <>
    <Component {...pageProps} />
    <Analytics />
  </>;
}
