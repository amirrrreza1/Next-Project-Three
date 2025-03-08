import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import Swal from "sweetalert2";
import Image from "next/image";

interface Blog {
  id: number;
  title: string;
  content: string;
  image_url: string;
  edited: boolean;
}

export default function BlogList() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("Blogs").select("*");
      if (error) console.error("Error fetching blogs:", error);
      else setBlogs(data || []);
      setLoading(false);
    };

    fetchBlogs();
  }, []);

  const handleEditClick = async (id: number) => {
    router.push(`/Blog/BlogAdmin/EditBlog/${id}`);
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      setLoading(true);
      const { error } = await supabase.from("Blogs").delete().eq("id", id);
      if (error) {
        Swal.fire("Error", "Failed to delete blog.", "error");
      } else {
        setBlogs((prev) => prev.filter((blog) => blog.id !== id));
        Swal.fire("Deleted!", "Your blog has been deleted.", "success");
      }
      setLoading(false);
    }
  };

  const revalidatePage = async () => {
    setLoading(true);
    const editedBlogs = blogs
      .filter((blog) => blog.edited)
      .map((blog) => blog.id);

    const res = await fetch("/api/revalidate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        editedBlogIds: editedBlogs,
      }),
    });

    const data = await res.json();
    Swal.fire("Success", data.message, "success");

    setBlogs((prev) => prev.map((blog) => ({ ...blog, edited: false })));
    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>Blog Admin Page</title>
      </Head>

      {loading && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center flex-col z-50">
            <span className="animate-spin border-4 border-white border-t-transparent rounded-full w-10 h-10 mb-3"></span>
            <p className="text-lg font-semibold text-white">Loading...</p>
        </div>
      )}

      <div className="w-[90%] mx-auto p-6 bg-white">
        <div className="w-full justify-between md:flex">
          <h1 className="text-2xl font-bold mb-4">Blog List</h1>
          <div className="flex gap-3">
            <Link
              href="/Blog/BlogAdmin/AddNewBlog"
              className="w-[150px] bg-green-500 hover:bg-green-600 text-white p-2 rounded mb-4 text-center transition-all block"
            >
              Add New Blog
            </Link>
            <button
              onClick={revalidatePage}
              className="w-[150px] bg-blue-500 hover:bg-blue-600 text-white p-2 rounded mb-4 text-center transition-all block"
            >
              Submit Changes
            </button>
          </div>
        </div>

        {blogs.length === 0 ? (
          <p className="text-center my-10">There is no blog yet.</p>
        ) : (
          <div className="w-[95%] max-w-[1000px] m-auto space-y-4 flex justify-around items-stretch flex-wrap">
            {blogs.map((blog) => (
              <div
                key={blog.id}
                className="w-[100%] md:w-[45%] lg:w-[30%] border p-4 rounded shadow h-full flex flex-col justify-between relative"
              >
                <div className="relative w-full h-[200px]">
                  <Image
                    src={blog.image_url || "/Images/ImagePlaceholder.png"}
                    alt={blog.title}
                    fill
                    className="object-contain rounded-md"
                  />
                </div>
                <h2 className="text-xl font-semibold text-center line-clamp-2 h-[80px] flex justify-center items-center">
                  {blog.title}
                </h2>
                <div className="flex justify-between mt-2">
                  <button
                    onClick={() => handleEditClick(blog.id)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition-all cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(blog.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-all cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
                {blog.edited && (
                  <span className="w-3 h-3 bg-orange-500 rounded-full absolute top-2 right-2"></span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
