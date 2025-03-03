import { supabase } from "@/lib/supabase";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type BlogType = {
  id: number;
  title: string;
  content: string;
  image_url: string | null | StaticImport;
};

export default function Home() {
  const [Blog, setBlog] = useState<BlogType[]>([]);

  useEffect(() => {
    const fetchBlog = async () => {
      const { data, error } = await supabase.from("Blogs").select("*");
      if (data && !error) setBlog(data);
    };
    fetchBlog();
  }, []);

  return (
    <>
      <Head>
        <title>Blogs</title>
      </Head>
      <div className="w-[95%] max-w-[1000px] mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 text-center">Blogs</h1>
        <div className="flex flex-wrap justify-center gap-3">
          {Blog.map((post) => (
            <div
              key={post.id}
              className="w-[100%] md:w-[45%] lg:w-[30%] p-4 border border-gray-400 rounded mb-4"
            >
              <div className="relative w-full h-[200px] mb-4">
                <Image
                  src={post.image_url || "/Images/ImagePlaceholder.png"}
                  alt={post.title}
                  fill
                  className="object-contain rounded-mdx"
                />
              </div>

              <h2 className="text-xl font-semibold line-clamp-2">{post.title}</h2>
              <Link
                href={`/Blog/${post.id}`}
                className="text-center bg-blue-500 p-2 rounded-md text-white mt-5 block"
              >
                Read More
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
