"use client";

import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  return (
    <div className="flex h-screen w-screen items-center justify-center p-6">
      <div className="w-4xl bg-white/40 backdrop-blur-sm rounded-2xl p-8 shadow-xl leading-relaxed text-[#482923]">
        
        <p className="text-xl font-black text-[#A82D2C] mb-6 text-center">
          「當家不再是避風港，法律是你唯一的盾牌，但這面盾牌……真的能及時舉起嗎？」
        </p>

        <p className="text-base mb-4">
          你是一個家暴當事人，生活在恐懼的陰影之下。對你而言，每一個腳步聲都可能是惡夢的開始。
          為了徹底擺脫這一切，你決定向法院申請保護令——這將是你最後的救命稻草，也可能激怒對方的導火線。
        </p>

        <p className="text-base mb-4">
          在這場與時間賽跑的生存模擬中，你必須保持絕對的冷靜，通關三個關鍵階段。
        </p>

        <p className="text-base font-semibold text-[#A82D2C] mb-4">
          請謹記：任何一次疏忽、任何一份文件的缺失，都可能導致保護令申請失敗。
        </p>

        <p className="text-base mb-8">
          在這個遊戲裡，結局不僅僅是勝負，而是你的
          <span className="font-bold">生命安全</span>。
          你能否平安等到那張紙生效，從此重獲自由？
          還是會……落入更深的深淵？
        </p>

        {/* Play 按鈕 */}
        <div className="flex justify-center mt-6">
          <button
            onClick={() => router.push("/game1")}
            className="px-8 py-3 bg-[#A82D2C] text-white font-bold rounded-full shadow-md hover:scale-105 hover:bg-[#8f2524] transition-transform duration-200"
          >
            Play →
          </button>
        </div>

      </div>
    </div>
  );
}
