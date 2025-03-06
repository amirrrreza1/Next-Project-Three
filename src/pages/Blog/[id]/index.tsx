import { supabase } from "@/lib/supabase";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Head from "next/head";
import Image from "next/image";

type BlogType = {
  id: number;
  title: string;
  content: string;
  image_url: string | null | StaticImport;
};

export default function BlogPost({ blog }: { blog: BlogType }) {
  if (!blog) return <p>پست یافت ks</p>;

  return (
    <>
      <Head>
        <title>{blog.title}</title>
      </Head>
      <div className="w-[95%] max-w-[800px] mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4 text-center">{blog.title}</h1>
        {blog.image_url && (
          <div className="relative w-full h-[300px] mb-4">
            <Image
              src={blog.image_url}
              alt={blog.title}
              fill
              className="object-contain rounded-md"
            />
          </div>
        )}
        <p
          className="text-lg"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        ></p>
      </div>
    </>
  );
}

// دریافت اطلاعات هر پست به‌صورت استاتیک
export async function getStaticProps({ params }: { params: { id: string } }) {
  const { data, error } = await supabase
    .from("Blogs")
    .select("*")
    .eq("id", params.id)
    .single(); // فقط یک پست را دریافت کن

  if (error) {
    console.error("Error fetching blog:", error);
    return {
      notFound: true, // صفحه 404 برگردان اگر پست وجود نداشت
    };
  }

  return {
    props: { blog: data }, // مقدار `blog` را پاس بده
  };
}

// دریافت ۵ پست اول برای ساخت مسیرهای استاتیک
export async function getStaticPaths() {
  const { data, error } = await supabase.from("Blogs").select("id").limit(5);

  if (error || !data) {
    console.error("Error fetching blog IDs:", error);
    return { paths: [], fallback: "blocking" }; // مسیرهای خالی در صورت خطا
  }

  const paths = data.map((post) => ({
    params: { id: post.id.toString() },
  }));

  return {
    paths,
    fallback: "blocking", // مسیرهای جدید روی سرور ساخته شوند
  };
}
