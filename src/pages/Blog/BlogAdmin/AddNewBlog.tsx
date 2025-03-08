import { useState } from "react";
import BlogForm from "@/Components/BlogForm/BlogForm";
import { supabase } from "@/lib/supabase";
import Head from "next/head";

const AddNewBlogPage = () => {
  const handleSubmitBlog = async (data: any) => {
    console.log("Submitting blog...", data);

    const { title, content } = data;

    console.log("Blog data to be inserted:", {
      title,
      content,
      created_at: new Date().toISOString(),
    });

    const { data: blogData, error } = await supabase.from("Blogs").insert([
      {
        title,
        content,
        created_at: new Date().toISOString(),
      },
    ]);
  };

  return (
    <>
      <Head>
        <title>Add New Blog</title>
      </Head>
      <div className="w-full mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Add New Blog</h1>
        <BlogForm onSubmit={handleSubmitBlog} />
      </div>
    </>
  );
};

export default AddNewBlogPage;
