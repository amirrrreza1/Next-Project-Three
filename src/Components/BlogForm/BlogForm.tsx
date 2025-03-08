import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

const Editor = dynamic(
  () => import("@tinymce/tinymce-react").then((mod) => mod.Editor),
  {
    ssr: false,
    loading: () => <p>Loading editor...</p>,
  }
);

interface BlogData {
  id?: number;
  title: string;
  content: string;
  image_url?: string;
  edited?: boolean;
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
    formState: { errors, isDirty },
  } = useForm<BlogData>({
    defaultValues: { title: "", content: "" },
  });

  const [editorContent, setEditorContent] = useState<string>("");
  const [mounted, setMounted] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialValues?.image_url || "/Images/ImagePlaceholder.png"
  );
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    if (initialValues) {
      setValue("title", initialValues.title);
      setValue("content", initialValues.content);
      setEditorContent(initialValues.content);
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
    setLoading(true);
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

    let imageUrl = initialValues?.image_url || "";
    if (imageFile) {
      const filePath = `IMG/${Date.now()}_${imageFile.name}`;
      const { data: uploadedFileData, error: uploadError } =
        await supabase.storage.from("IMG").upload(filePath, imageFile);

      if (uploadError) {
        setLoading(false);
        return;
      }
      const { data } = supabase.storage.from("IMG").getPublicUrl(filePath);
      imageUrl = data?.publicUrl || "";
    }

    const hasChanges =
      data.title !== initialValues?.title ||
      editorContent !== initialValues?.content ||
      imageUrl !== initialValues?.image_url;

    let error, blogData;
    if (isEdit && initialValues?.id) {
      let updateData: Partial<BlogData> = {
        title: data.title,
        content: editorContent,
        image_url: imageUrl,
      };

      if (hasChanges) {
        updateData.edited = true;
      }

      ({ error, data: blogData } = await supabase
        .from("Blogs")
        .update(updateData)
        .eq("id", initialValues.id));
    } else {
      ({ error, data: blogData } = await supabase.from("Blogs").insert([
        {
          title: data.title,
          content: editorContent,
          image_url: imageUrl,
          edited: true,
        },
      ]));
    }

    setLoading(false);

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
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center flex-col gap-3 bg-black/80 z-50">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          <div className="text-white">Saving</div>
        </div>
      )}

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
        <div className="mt-5 flex flex-col justify-center items-center">
          <p className="self-start mb-3">Your image preview:</p>
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Image preview"
              className="w-[300px] h-auto md:self-start"
            />
          )}
        </div>
      </div>
      <div>
        <label className="block text-md font-medium my-1">Title</label>
        <input
          {...register("title", { required: "Title is required" })}
          className="p-2 w-full border border-gray-300 rounded"
          disabled={loading}
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
      </div>
      <div className="flex gap-3 items-center justify-center mt-5 md:justify-start">
        <button
          type="submit"
          className="w-[150px] bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
        >
          Save
        </button>
        <Link
          href="/Blog/BlogAdmin"
          className="w-[150px] bg-red-500 hover:bg-red-600 text-white py-2 rounded block text-center"
        >
          Exit
        </Link>
      </div>
    </form>
  );
};

export default BlogForm;
