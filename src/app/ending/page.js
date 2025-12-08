"use client";

import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  // TODO: 之後你可以把 successCount 從 props、URL、context 帶進來
  const successCount = 3; // 先示意用

  let title = "";
  let subtitleColor = "";
  let content = "";

  // 決定內容
  if (successCount === 3) {
    // 好結局
    title = "〈完整保護〉";
    subtitleColor = "#2C6E49";
    content = `
「那張薄薄的紙，終於成為了擋在你身前的鐵壁。」

法院的裁定書送達了。因為你提供了無可辯駁的證據，並且在繁瑣的程序中展現了驚人的堅韌，法官核發了最完整的保護令。

裁定內容明確有力：「相對人必須遷出住所」、「禁止騷擾」、「必須遠離你工作場所至少 100 公尺」。

那天下午，在警方的陪同下，你看著那個曾經讓你顫抖的身影被迫收拾行李離開。當門鎖換新的那一刻，屋內的空氣終於不再凝滯。

雖然心裡的傷痕仍需要時間癒合，但至少今晚，你可以安心地睡上一覺。
    `;
  } else if (successCount === 0) {
    // 壞結局
    title = "〈緊急撤離〉";
    subtitleColor = "#8F1D1D";
    content = `
「法律的腳步太慢了，慢到追不上暴力的拳頭。」

申請被駁回，或因嚴重流程錯誤而中斷，更糟的是，你的意圖被他察覺。通訊軟體裡的威脅訊息接連湧入，門外的腳步聲急促沈重。

你知道，這一次體制救不了你。

在恐懼壓垮你之前，本能驅使你做出最後的決定——逃。

你來不及收拾行李，只抓著手機與錢包奔出那個曾經被稱為「家」的地方。你躲進了庇護所，或朋友的空房。

雖然失去生活軌跡，但你告訴自己：「活著，才有機會重新開始。」
    `;
  } else {
    // 普通/真結局
    title = "〈制度缺口〉";
    subtitleColor = "#A8782C";
    content = `
「保護令核發了，但這面盾牌上……似乎有著隱約的裂痕。」

你終於拿到了保護令，但因蒐證不足或審理過程中的失誤，法官認為急迫性或危險程度「尚未明確」。

裁定只包含最基本的「禁止身體暴力」，卻沒有「強制遷出」或「遠離令」。

他仍住在同一個屋簷下，仍可能出現在你視線的邊緣。那張保護令是一道警告，而不是一道牆。

你必須更加警惕。每一次擦身而過都像在踩薄冰。
這是一場不完美的勝利，你的安全仍然懸著。
    `;
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center p-6">
      <div className="w-4xl bg-white/40 backdrop-blur-sm rounded-2xl p-10 shadow-xl leading-relaxed text-[#482923] max-w-3xl">
        
        {/* 標題 */}
        <h1
          className="text-2xl font-black mb-6 text-center"
          style={{ color: subtitleColor }}
        >
          {title}
        </h1>

        {/* 內容 */}
        <div className="whitespace-pre-line text-base mb-10">
          {content}
        </div>

        {/* 返回按鈕 */}
        <div className="flex justify-center">
          <button
            onClick={() => router.push("/")}
            className="px-8 py-3 bg-[#A82D2C] text-white font-bold rounded-full shadow-md hover:scale-105 hover:bg-[#8f2524] transition-transform duration-200"
          >
            返回首頁
          </button>
        </div>
      </div>
    </div>
  );
}
