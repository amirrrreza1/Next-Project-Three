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
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      const { error } = await supabase.from("Blogs").delete().eq("id", id);
      if (error) {
        Swal.fire("Error", "Failed to delete blog.", "error");
      } else {
        setBlogs((prev) => prev.filter((blog) => blog.id !== id));
        Swal.fire("Deleted!", "Your blog has been deleted.", "success");
      }
    }
  };

  return (
    <>
      <Head>
        <title>Blog Admin Page</title>
      </Head>
      <div className="w-[90%] mx-auto p-6 bg-white">
        <div className="w-full justify-between flex">
          <h1 className="text-2xl font-bold mb-4">Blog List</h1>
          <Link
            href="/Blog/BlogAdmin/AddNewBlog"
            className="w-[150px] bg-green-500 hover:bg-green-600 text-white p-2 rounded mb-4 text-center transition-all"
          >
            Add New Blog
          </Link>
        </div>

        {blogs.length === 0 ? (
          <p className="text-center my-10">There is no blog yet.</p>
        ) : (
          <div className="w-[95%] max-w-[1000px] m-auto space-y-4 flex justify-around items-stretch flex-wrap">
            {blogs.map((blog) => (
              <div
                key={blog.id}
                className="w-[100%] md:w-[45%] lg:w-[30%] border p-4 rounded shadow h-full flex flex-col justify-between"
              >
                <div className="relative w-full h-[200px]">
                  <Image
                    src={ blog.image_url || "/Images/ImagePlaceholder.png" }
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
                    onClick={() =>
                      router.push(`/Blog/BlogAdmin/EditBlog/${blog.id}`)
                    }
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
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
