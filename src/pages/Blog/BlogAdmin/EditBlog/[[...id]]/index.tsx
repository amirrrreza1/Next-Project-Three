import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabase";
import BlogForm from "@/Components/BlogForm/BlogForm";

interface Blog {
  id: number;
  title: string;
  content: string;
  image_url?: string; // اضافه کردن فیلد تصویر
}

interface BlogFormProps {
  isEdit: boolean;
  initialValues: Blog;
  onSubmit: (data: Blog, imageFile?: File) => void; // این خط باید باشه
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
        .select("*")
        .eq("id", id) // مقدار id را از URL یا state دریافت می‌کنی؟
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

  const handleUpdateBlog = async (data: any, imageFile?: File) => {
    if (!id) return;

    setLoading(true); // Start uploading
    let imageUrl = blog?.image_url || "";

    // Handle image upload if a new image is provided
    if (imageFile) {
      const filePath = `IMG/${Date.now()}_${imageFile.name}`;
      const { data: uploadedFileData, error: uploadError } =
        await supabase.storage.from("IMG").upload(filePath, imageFile);

      if (uploadError) {
        console.error(
          "Error uploading image:",
          uploadError.message || uploadError
        );
        setLoading(false); // Stop uploading
        return; // Stop execution in case of error
      } else {
        const { data } = supabase.storage.from("IMG").getPublicUrl(filePath);
        imageUrl = data?.publicUrl || "";
      }
    }

    console.log("Sending update request...");

    const { error } = await supabase
      .from("Blogs")
      .update({
        title: data.title,
        content: data.content,
        image_url: imageUrl,
      })
      .eq("id", id);

    console.log("Update request sent"); // Check if the update request is made

    setLoading(false); // Stop uploading after the update

    if (error) {
      console.error("Error updating blog:", error.message);
    } else {
      console.log("Update successful, sending revalidation request...");

    }
  };

  if (loading)
    return (
      <p className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl">
        Loading...
      </p>
    );
  if (!blog)
    return (
      <p className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl">
        No blog found.
      </p>
    );

  return (
    <div className="w-full mx-auto p-6">
      <h1 className="text-3xl font-bold">Edit Blog</h1>
      <BlogForm
        isEdit={true}
        initialValues={{
          id: blog.id,
          title: blog.title,
          content: blog.content,
          image_url: blog.image_url,
        }}
        onSubmit={handleUpdateBlog}
      />
    </div>
  );
}
