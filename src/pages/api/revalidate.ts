// pages/api/revalidate.ts
import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabase"; // اگر به supabase نیاز دارید

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { editedBlogIds } = req.body; // دریافت شناسه‌های پست‌های ویرایش شده
      if (!editedBlogIds || editedBlogIds.length === 0) {
        return res
          .status(400)
          .json({ message: "No edited blogs to revalidate" });
      }

      // به‌روزرسانی فیلد edited به false برای پست‌های ویرایش شده
      const { error } = await supabase
        .from("Blogs")
        .update({ edited: false })
        .in("id", editedBlogIds); // به‌روزرسانی تمام پست‌های ویرایش شده

      if (error) {
        return res.status(500).json({ message: "Error updating blogs", error });
      }

      res.status(200).json({ message: "Revalidation successful!" });
      res.revalidate("/Blog");
    } catch (error) {
      console.error("Error during revalidation:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
