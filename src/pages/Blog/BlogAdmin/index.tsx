import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";

interface Blog {
  id: number;
  title: string;
  content: string;
  image_url: string;
}

export default function BlogList() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchBlogs = async () => {
      const { data, error } = await supabase.from("Blogs").select("*");
      if (error) console.error("Error fetching blogs:", error);
      else setBlogs(data || []);
    };

    fetchBlogs();
  }, []);

  const handleDelete = async (id: number) => {
    await supabase.from("Blogs").delete().eq("id", id);
    setBlogs((prev) => prev.filter((blog) => blog.id !== id));
  };

  return (
    <>
      <Head>
        <title>Blog Admin Page</title>
      </Head>
      <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded">
        <h1 className="text-2xl font-bold mb-4">لیست بلاگ‌ها</h1>

        <Link
          href="/Blog/BlogAdmin/AddNewBlog"
          className="bg-green-500 text-white p-2 rounded mb-4 w-full"
        >
          + افزودن بلاگ جدید
        </Link>

        {blogs.length === 0 ? (
          <p>هیچ بلاگی وجود ندارد.</p>
        ) : (
          <div className="space-y-4">
            {blogs.map((blog) => (
              <div key={blog.id} className="border p-4 rounded shadow">
                {blog.image_url && (
                  <img
                    src={blog.image_url}
                    alt={blog.title}
                    className="w-full h-40 object-cover rounded mb-2"
                  />
                )}
                <h2 className="text-xl font-semibold">{blog.title}</h2>
                <p className="text-gray-600">{blog.content}</p>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => router.push(`/edit-post/${blog.id}`)}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    ویرایش
                  </button>
                  <button
                    onClick={() => handleDelete(blog.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    حذف
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
