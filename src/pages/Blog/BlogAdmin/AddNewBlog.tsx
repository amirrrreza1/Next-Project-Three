import { useState } from "react";
import BlogForm from "@/Components/BlogForm/BlogForm";
import { supabase } from "@/lib/supabase";
import Head from "next/head";

const AddNewBlogPage = () => {
  const handleSubmitBlog = async (data: any) => {
    console.log("Submitting blog...", data);

    const { title, content } = data;

    // بررسی داده‌ها قبل از ارسال به Supabase
    console.log("Blog data to be inserted:", {
      title,
      content,
      created_at: new Date().toISOString(),
    });

    // ارسال داده‌ها به جدول Blogs
    const { data: blogData, error } = await supabase.from("Blogs").insert([
      {
        title,
        content,
        created_at: new Date().toISOString(),
      },
    ]);

    // بررسی پاسخ دیتابیس و خطا
    if (error) {
      console.error("Error inserting blog:", error.message || error);
      if (error.details) {
        console.error("Error details:", error.details);
      }
    } else {
      console.log("Blog successfully added:", blogData);
    }

    // بررسی دقیق‌تر داده‌های برگشتی
    console.log("Database response:", blogData, error);
  };

  return (
    <>
      <Head>
        <title>Add New Blog</title>
      </Head>
      <div className="w-full mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Add New Blog</h1>

        {/* فرم برای افزودن بلاگ */}
        <BlogForm onSubmit={handleSubmitBlog} />
      </div>
    </>
  );
};

export default AddNewBlogPage;
