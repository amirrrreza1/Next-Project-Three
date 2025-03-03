import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabase";
import BlogForm from "@/Components/BlogForm/BlogForm";

interface Blog {
  title: string;
  content: string;
}


export default function EditBlogPage() {
  const router = useRouter();
  const { id } = router.query as { id?: string };
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!id) return;

    const fetchBlog = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("Blogs")
        .select("title, content, image_url")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching blog:", error.message);
      } else {
        setBlog(data);
      }
      setLoading(false);
    };

    fetchBlog();
  }, [id]);

  const handleUpdateBlog = async (data: Blog) => {
    if (!id) return;

    const { error } = await supabase
      .from("Blogs")
      .update({
        title: data.title,
        content: data.content,
      })
      .eq("id", id);

    if (error) {
      console.error("Error updating blog:", error.message);
    } else {
      router.push("/Blog/BlogAdmin");
    }
  };

  if (loading) return <p>در حال بارگذاری...</p>;
  if (!blog) return <p>بلاگ یافت نشد</p>;

  return (
    <div className="w-full mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Edit Blog</h1>
      {blog && <BlogForm onSubmit={handleUpdateBlog} initialValues={blog} />}
    </div>
  );
}
