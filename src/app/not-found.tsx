import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center px-4">
        <h1 className="text-8xl font-bold text-[#111111] mb-4">404</h1>
        <p className="text-xl text-[#333333] mb-2">页面未找到</p>
        <p className="text-base text-[#666666] mb-8">
          您访问的页面不存在或已被移除
        </p>
        <Link
          href="/"
          className="inline-block px-8 h-11 leading-[44px] bg-[#165DFF] text-white rounded-xl text-base font-medium hover:opacity-90 transition-opacity"
        >
          返回首页
        </Link>
      </div>
    </div>
  );
}
