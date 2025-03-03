import { useParams } from "next/navigation";

const BlogShow = () => {
  const params = useParams();

  if (!params) {
    return <p>در حال بارگذاری...</p>;
  }
  return <div>{params.id}</div>;
};

export default BlogShow;
