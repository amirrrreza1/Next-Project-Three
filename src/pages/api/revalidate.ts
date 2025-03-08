import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabase"; 

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { editedBlogIds } = req.body;
      if (!editedBlogIds || editedBlogIds.length === 0) {
        return res
          .status(400)
          .json({ message: "No edited blogs to revalidate" });
      }

      const { error } = await supabase
        .from("Blogs")
        .update({ edited: false })
        .in("id", editedBlogIds);

      if (error) {
        return res.status(500).json({ message: "Error updating blogs", error });
      }

      await res.revalidate("/Blog");

      res.status(200).json({ message: "Revalidation successful!" });
    } catch (error) {
      console.error("Error during revalidation:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
