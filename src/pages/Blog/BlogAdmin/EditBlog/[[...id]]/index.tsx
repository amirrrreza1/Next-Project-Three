import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabase";
import BlogForm from "@/Components/BlogForm/BlogForm";
import Link from "next/link";

interface Blog {
  title: string;
  content: string;
  image_url?: string; // اضافه کردن فیلد تصویر
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

  const handleUpdateBlog = async (data: Blog, imageFile?: File) => {
    if (!id) return;

    let imageUrl = blog?.image_url || "";

    // اگر کاربر تصویر جدیدی آپلود کرد، تصویر را جایگزین کنیم
    if (imageFile) {
      const filePath = `IMG/${Date.now()}_${imageFile.name}`;
      const { data: uploadedFileData, error: uploadError } =
        await supabase.storage.from("IMG").upload(filePath, imageFile);

      if (uploadError) {
        console.error(
          "Error uploading image:",
          uploadError.message || uploadError
        );
      } else {
        const { data } = supabase.storage.from("IMG").getPublicUrl(filePath);
        imageUrl = data?.publicUrl || "";
      }
    }

    const { error } = await supabase
      .from("Blogs")
      .update({
        title: data.title,
        content: data.content,
        image_url: imageUrl, // ذخیره تصویر جدید یا قبلی
      })
      .eq("id", id);

    if (error) {
      console.error("Error updating blog:", error.message);
    } else {
      router.push("/Blog/BlogAdmin");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!blog) return <p>Blog not found</p>;

  return (
    <div className="w-full mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Edit Blog</h1>
        <Link
          href="/Blog/BlogAdmin"
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-all"
        >
          Exit
        </Link>
      </div>
      {blog && <BlogForm onSubmit={handleUpdateBlog} initialValues={blog} />}
    </div>
  );
}
