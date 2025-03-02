import Link from "next/link";
import { usePathname } from "next/navigation";

const PAGES = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Blog",
    href: "/Blog",
  },
  {
    name: "BlogAdmin",
    href: "/Blog/BlogAdmin",
  },
];

const MainLayout = ({ children }: any) => {
  const path = usePathname();

  return (
    <>
      <header className="p-3 bg-white">
        <div className="bg-blue-500 text-white h-[60px] w-[95%] max-w-[500px] m-auto flex items-center justify-center rounded-lg">
          <nav className="flex items-center justify-between gap-3 h-[60px] leading-[60px]">
            {PAGES.map((page) => (
              <Link
                key={page.name}
                href={page.href}
                className={path === page.href ? "opacity-100 border-b-2" : "opacity-60 hover:opacity-100 transform border-transparent border-b-2"}
              >
                {page.name}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main>{children}</main>
    </>
  );
};

export default MainLayout;
