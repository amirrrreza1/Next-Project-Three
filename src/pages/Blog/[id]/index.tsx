"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const BlogShow = () => {
  const params = useParams();
  const id = params?.id; // جلوگیری از خطای destructuring

  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("Blogs")
        .select("*")
        .eq("id", id)
        .single();

      if (!error) {
        setPost(data);
      }
      setLoading(false);
    };

    fetchPost();
  }, [id]);

  if (!id) {
    return (
      <p className="text-center text-gray-500 my-10">شناسه نامعتبر است!</p>
    );
  }

  if (loading) {
    return (
      <p className="text-center text-gray-500 my-10">در حال بارگذاری...</p>
    );
  }

  if (!post) {
    return <p className="text-center text-red-500 my-10">پست یافت نشد!</p>;
  }

  return (
    <div className="max-w-3xl mx-auto my-10 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">{post.title}</h1>
      <div className="w-full h-[300px] overflow-hidden rounded-lg">
        <img
          src={post.image_url || "/Images/ImagePlaceholder.png"}
          alt={post.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div
        className="mt-6 text-gray-700 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: post.content }}
      ></div>
      <div className="mt-6">
        <a
          href="/Blog"
          className="inline-block px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          بازگشت به لیست پست‌ها
        </a>
      </div>
    </div>
  );
};

export default BlogShow;
