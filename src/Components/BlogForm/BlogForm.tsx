"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/lib/supabase";
import { Editor } from "@tinymce/tinymce-react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

interface BlogFormProps {
  onSubmit: (data: BlogData) => void;
  initialValues?: BlogData;
  isEdit?: boolean;
}

interface BlogData {
  title: string;
  content: string;
  image_url?: string;
}

const BlogForm: React.FC<BlogFormProps> = ({
  onSubmit,
  initialValues,
  isEdit,
}) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<BlogData>({
    defaultValues: { title: "", content: "", image_url: "" },
  });

  const [editorContent, setEditorContent] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (initialValues) {
      setValue("title", initialValues.title);
      setValue("content", initialValues.content);
      setEditorContent(initialValues.content);
      setImagePreview(initialValues.image_url || null);
    }
  }, [initialValues, setValue]);

  const handleEditorChange = (content: string) => {
    setEditorContent(content);
    setValue("content", content);
  };

  const handleSubmitForm = async (data: BlogData) => {
    const result = await Swal.fire({
      title: "Are you sure you want to save?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, save it",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    const { error } = await supabase.from("Blogs").insert([
      {
        title: data.title,
        content: editorContent,
      },
    ]);

    if (error) {
      Swal.fire("Error", "There was a problem saving the blog", "error");
    } else {
      Swal.fire("Success!", "The blog was saved successfully", "success");
      router.push(isEdit ? "/BlogAdmin" : "/Blog");
    }
  };

  return (
    <form onSubmit={handleSubmit(handleSubmitForm)} className="w-full">
      <div>
        <label className="block text-md font-medium my-1">Title</label>
        <input
          {...register("title", { required: "Title is required" })}
          className="p-2 w-full border border-gray-300 rounded"
        />
        {errors.title && (
          <p className="text-red-500 text-sm">{errors.title.message}</p>
        )}
      </div>

      <div className="my-5">
        <label className="block text-md font-medium my-1">Content</label>
        <Editor
          apiKey="xhz3fm1wrv4r3f1trc0ebey5g3ol3cvoy11r6ikit4hqdak1"
          value={editorContent}
          onEditorChange={handleEditorChange}
          init={{
            height: 400,
            menubar: true,
            plugins: [
              "link",
              "lists",
              "image",
              "media",
              "code",
              "table",
              "emoticons",
              "fullscreen",
              "wordcount",
            ],
            toolbar:
              "undo redo | formatselect | bold italic underline strikethrough | forecolor backcolor | fontselect fontsizeselect | alignleft aligncenter alignright | bullist numlist | outdent indent | link image media | table code fullscreen emoticons | wordcount",
            toolbar_mode: "floating",
            content_style:
              "body { font-family: Arial, sans-serif; font-size: 14px; }",
          }}
        />
        {errors.content && (
          <p className="text-red-500 text-sm">{errors.content.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 rounded"
      >
        Save
      </button>
    </form>
  );
};

export default BlogForm;
