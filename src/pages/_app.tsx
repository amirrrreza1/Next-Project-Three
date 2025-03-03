import { useRouter } from "next/router";
import MainLayout from "@/Components/Layout/MainLayout";
import SpecialLayout from "@/Components/Layout/SpecialLayout";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const specialPages = ["/Blog/BlogAdmin/AddNewBlog" , "/Blog/BlogAdmin/EditBlog/[id]"];
  const isSpecialPage = specialPages.includes(router.pathname);

  const Layout = isSpecialPage ? SpecialLayout : MainLayout;

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
