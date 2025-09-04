import type { AppProps } from "next/app";
import "@/styles/index.scss";
import "@fontsource/jetbrains-mono";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
