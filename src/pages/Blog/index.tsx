import { supabase } from "@/lib/supabase";
import Head from "next/head";
import { useEffect, useState } from "react";

type BlogType = {
  id: number;
  title: string;
  content: string;
  image_url: string | null;
};

export default function Home() {
  const [Blog, setBlog] = useState<BlogType[]>([]);

  useEffect(() => {
    const fetchBlog = async () => {
      const { data, error } = await supabase.from("Blogs").select("*");
      if (!error) setBlog(data || []);
    };
    fetchBlog();
  }, []);

  return (
    <>
      <Head>
        <title>Blogs</title>
      </Head>
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">بلاگ</h1>
        {Blog.map((post) => (
          <div key={post.id} className="p-4 border rounded mb-4">
            {post.image_url && (
              <img
                src={post.image_url}
                alt={post.title}
                className="w-full rounded mb-2"
              />
            )}
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p>{post.content}</p>
          </div>
        ))}
      </div>
    </>
  );
}
