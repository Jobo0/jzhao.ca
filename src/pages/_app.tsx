import type { AppProps } from "next/app";
import "@/styles/index.scss";
import "@fontsource/jetbrains-mono";
import { Analytics } from "@vercel/analytics/next";
import { CardIntroProvider } from "@/components/CardScrollAnimation/CardIntroContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <CardIntroProvider>
      <Component {...pageProps} />
      <Analytics />
    </CardIntroProvider>
  );
}
