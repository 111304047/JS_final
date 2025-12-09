"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handlePlayClick = () => {
    router.push("/intro");
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <main
        className="w-4xl bg-white/40 backdrop-blur-sm rounded-2xl p-8 shadow-xl leading-relaxed text-[#482923] flex flex-col items-center justify-center">
        {/* 標題改成圖片 */}
        <div className="mb-8">
          <Image
            src="/title.png"
            alt="看不見的保護"
            width={400}   // 可根據需求調整大小
            height={100}  // 可根據需求調整大小
          />
        </div>

        <div className="flex justify-center mt-4">
          <button
            onClick={() => router.push("/intro")}
            className="px-8 py-3 bg-[#A82D2C] text-white font-bold rounded-full shadow-md hover:scale-105 hover:bg-[#8f2524] transition-transform duration-200"
          >
            Play →
          </button>
        </div>

      </main>
    </div>
  );
}
