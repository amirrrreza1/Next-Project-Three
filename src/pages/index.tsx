import Head from "next/head";

const HomePage = () => {
  return (
    <>
      <Head>
        <title>صفحه اصلی</title>
      </Head>
      <div className="w-[95%] max-w-[1000px] mx-auto p-4" style={{direction: "rtl"}}>
        <h1 className="text-3xl font-bold mb-4">به پروژه وبلاگ خوش آمدید</h1>
        <p className="text-lg text-gray-700">
          این پروژه یک پلتفرم وبلاگ‌نویسی کامل است که با{" "}
          <span className="font-semibold">Next.js</span> و{" "}
          <span className="font-semibold">Supabase</span> توسعه یافته است.
          کاربران می‌توانند پست‌های جدید ایجاد کنند، ویرایش کنند و مدیریت کاملی
          بر وبلاگ خود داشته باشند. همچنین یک پنل مدیریت برای کنترل و بررسی
          محتوای وبلاگ فراهم شده است.
        </p>

        <h2 className="text-2xl font-semibold mt-6">ویژگی‌های اصلی</h2>
        <ul className="list-disc pl-5 text-gray-700">
          <li>📝 ایجاد، ویرایش و حذف پست‌های وبلاگ</li>
          <li>📸 آپلود تصویر برای هر پست</li>
          <li>🛠 پنل مدیریت برای کنترل محتوا</li>
          <li>📡 به‌روزرسانی لحظه‌ای داده‌ها با Supabase</li>
          <li>🎨 رابط کاربری مدرن با Tailwind CSS</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6">
          تکنولوژی‌های استفاده شده
        </h2>
        <ul className="list-disc pl-5 text-gray-700">
          <li>
            ⚡ <span className="font-semibold">Next.js</span> – فریمورک سریع و
            مقیاس‌پذیر
          </li>
          <li>
            🔥 <span className="font-semibold">Supabase</span> – پایگاه داده و
            احراز هویت
          </li>
          <li>
            🎨 <span className="font-semibold">Tailwind CSS</span> – طراحی زیبا
            و واکنش‌گرا
          </li>
          <li>
            🖊 <span className="font-semibold">ویرایشگر TinyMCE</span> – برای
            ویرایش متن غنی
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6">چگونه شروع کنیم؟</h2>
        <p className="text-lg text-gray-700">
          برای بررسی امکانات این پلتفرم، به پنل مدیریت مراجعه کنید و شروع به
          مدیریت وبلاگ‌های خود کنید!
        </p>
      </div>
    </>
  );
};

export default HomePage;
