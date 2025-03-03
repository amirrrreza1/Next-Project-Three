// در صفحه AddNewBlogPage
import BlogForm from "@/Components/BlogForm/BlogForm";
import { supabase } from "@/lib/supabase";

const AddNewBlogPage = () => {



  const handleSubmitBlog = async (data: any) => {
    console.log("Blog submitted:", data);

    const { title, content } = data;

    const { data: blogData, error } = await supabase.from("Blogs").insert([
      {
        title,
        content,
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error("Error inserting blog:", error.message || error); // چاپ خطای دقیق
      if (error.details) {
        console.error("Error details:", error.details);
      }
    } else {
      console.log("Blog successfully added:", blogData);
    }
  };

  return (
    <div className="w-full mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Add New Blog</h1>
      <BlogForm onSubmit={handleSubmitBlog} />
    </div>
  );
};

export default AddNewBlogPage;
