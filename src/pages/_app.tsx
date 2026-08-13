import type { AppProps } from "next/app";
import "../styles/global.scss";
import Layout from "@/components/layout/Layout";
import ScrollToTop from "@/components/scrolltop/ScrollToTop";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
      <ScrollToTop />
    </Layout>
  );
}
