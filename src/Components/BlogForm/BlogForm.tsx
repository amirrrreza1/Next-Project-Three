"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

// غیرفعال کردن SSR برای TinyMCE
const Editor = dynamic(
  () => import("@tinymce/tinymce-react").then((mod) => mod.Editor),
  {
    ssr: false,
    loading: () => <p>Loading editor...</p>, // نمایش متن هنگام لود شدن
  }
);

interface BlogData {
  title: string;
  content: string;
  image_url?: string;
}

const BlogForm: React.FC<{
  onSubmit: (data: BlogData) => void;
  initialValues?: BlogData;
  isEdit?: boolean;
}> = ({ onSubmit, initialValues, isEdit }) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<BlogData>({
    defaultValues: { title: "", content: "" },
  });

  const [editorContent, setEditorContent] = useState<string>("");
  const [mounted, setMounted] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialValues?.image_url || "/Images/ImagePlaceholder.png"
  );
  const [loading, setLoading] = useState<boolean>(false); // **اضافه کردن استیت لودینگ**

  useEffect(() => {
    setMounted(true);
    if (initialValues) {
      setValue("title", initialValues.title);
      setValue("content", initialValues.content);
      setEditorContent(initialValues.content);

      // مقداردهی اولیه پیش‌نمایش تصویر
      if (initialValues.image_url) {
        setImagePreview(initialValues.image_url);
      }
    }
  }, [initialValues, setValue]);

  const handleEditorChange = (content: string) => {
    setEditorContent(content);
    setValue("content", content);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitForm = async (data: BlogData) => {
    setLoading(true); // **فعال کردن لودینگ**

    const result = await Swal.fire({
      title: "Are you sure you want to save?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, save it",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) {
      setLoading(false);
      return;
    }

    let imageUrl = "";
    if (imageFile) {
      const filePath = `IMG/${Date.now()}_${imageFile.name}`;
      const { data: uploadedFileData, error: uploadError } =
        await supabase.storage.from("IMG").upload(filePath, imageFile);

      if (uploadError) {
        console.error(
          "Error uploading image:",
          uploadError.message || uploadError
        );
        setLoading(false);
        return;
      }

      const { data } = supabase.storage.from("IMG").getPublicUrl(filePath);
      imageUrl = data?.publicUrl || "";
    }

    const { error, data: blogData } = await supabase.from("Blogs").insert([
      {
        title: data.title,
        content: editorContent,
        image_url: imageUrl,
      },
    ]);

    setLoading(false); // **غیرفعال کردن لودینگ بعد از ارسال**

    if (error) {
      Swal.fire(
        "Error",
        `There was a problem saving the blog: ${error.message}`,
        "error"
      );
    } else {
      Swal.fire("Success!", "The blog was saved successfully", "success");
      router.push("/Blog/BlogAdmin");
    }
  };

  return (
    <form onSubmit={handleSubmit(handleSubmitForm)} className="w-full">
      <div className="my-5">
        <label className="block text-md font-medium my-1">
          Choose an preview image:
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="p-2 w-full border border-gray-300 rounded"
          disabled={loading}
        />

        <div className="mt-5">
          <p>Your image preview:</p>
          {imagePreview && (
            <div className="mt-4">
              <img
                src={imagePreview || "./Images/ImagePlaceholder.png"}
                alt="Image preview"
                className="w-[300px] h-auto"
              />
            </div>
          )}
        </div>
      </div>
      <div>
        <label className="block text-md font-medium my-1">Title</label>
        <input
          {...register("title", { required: "Title is required" })}
          className="p-2 w-full border border-gray-300 rounded"
          disabled={loading} // **غیرفعال کردن ورودی در هنگام لودینگ**
        />
        {errors.title && (
          <p className="text-red-500 text-sm">{errors.title.message}</p>
        )}
      </div>

      <div className="my-5">
        <label className="block text-md font-medium my-1">Content</label>
        {mounted && (
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
                "undo redo | formatselect | bold italic underline strikethrough | " +
                "forecolor backcolor | fontselect fontsizeselect | alignleft aligncenter alignright | " +
                "bullist numlist | outdent indent | link image media | table code fullscreen emoticons | wordcount",
              toolbar_mode: "floating",
              content_style:
                "body { font-family: Arial, sans-serif; font-size: 14px; }",
            }}
          />
        )}
        {errors.content && (
          <p className="text-red-500 text-sm">{errors.content.message}</p>
        )}
      </div>

      {loading && (
        <div className="w-full h-screen bg-black/70 flex justify-center items-center fixed top-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%] z-50">
          <div className="w-6 h-6 border-4 border-white border-dashed rounded-full animate-spin"></div>
          <p className="ml-2 text-white">Uploading...</p>
        </div>
      )}
      <div className="flex gap-3">
        <button
          type="submit"
          className="w-[150px] bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
        >
          Save
        </button>
        <Link
          href="/Blog/BlogAdmin"
          onClick={async (e) => {
            e.preventDefault();
            const result = await Swal.fire({
              title: "Are you sure you want to exit?",
              text: "Any unsaved changes will be lost.",
              icon: "warning",
              showCancelButton: true,
              confirmButtonText: "Yes, exit",
              cancelButtonText: "Cancel",
            });

            if (result.isConfirmed) {
              router.push("/Blog/BlogAdmin");
            }
          }}
          className="w-[150px] bg-red-500 hover:bg-red-600 text-white py-2 rounded block text-center"
        >
          Exit
        </Link>
      </div>
    </form>
  );
};

export default BlogForm;
