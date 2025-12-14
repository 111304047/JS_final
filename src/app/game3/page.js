"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from 'next/navigation';

const messages = [
    {
        sender: "加害者",
        text: "我最近真的很不好過，你難道一點都不在乎嗎？",
        options: [
            { text: "我需要空間，請你不要再聯絡我。", score: 1 },
            { text: "等法院結果出來再說吧。", score: 2 },
            { text: "我現在真的沒辦法回應你。", score: 0 },
        ],
        ignoreScore: 0,
    },
    {
        sender: "朋友",
        text: "如果你需要，我可以陪你去法院。",
        options: [
            { text: "好，我真的需要有人陪。", score: 2 },
            { text: "謝謝，但我想自己面對。", score: 0 },
            { text: "我還不確定，到時再說。", score: -1 },
        ],
        ignoreScore: -1,
    },
    {
        sender: "社工",
        text: "請補交驗傷證明，否則程序可能中止。",
        options: [
            { text: "我會盡快補交，謝謝提醒。", score: 2 },
            { text: "我真的很累，可以晚一點嗎？", score: 0 },
            { text: "我現在沒辦法處理這些事。", score: -1 },
        ],
        ignoreScore: -2,
    },
    {
        sender: "加害者",
        text: "我知道你現在在哪裡上班喔，只是提醒你而已。",
        options: [
            { text: "這樣的訊息讓我感到害怕。", score: 1 },
            { text: "請停止這樣的訊息。", score: 2 },
            { text: "我不想再談這件事。", score: 0 },
        ],
        ignoreScore: 0,
    },
    {
        sender: "朋友",
        text: "他剛剛私訊我，問你最近怎麼樣。",
        options: [
            { text: "拜託你不要回他任何訊息。", score: 2 },
            { text: "你可以說不知道。", score: 1 },
            { text: "沒關係，隨他吧。", score: -2 },
        ],
        ignoreScore: -1,
    },
    {
        sender: "社工",
        text: "保護令還沒生效，請特別注意安全。",
        options: [
            { text: "我會暫時搬離原住處。", score: 2 },
            { text: "我會小心，暫時不出門。", score: 0 },
            { text: "應該不會有事吧。", score: -2 },
        ],
        ignoreScore: -1,
    },
    {
        sender: "法院",
        text: "請再次確認明日是否能出席審理。",
        options: [
            { text: "我會準時出席。", score: 2 },
            { text: "我有點害怕，但我會嘗試。", score: 1 },
            { text: "我現在還沒辦法決定。", score: 0 },
        ],
        ignoreScore: -2,
    },
];

export default function Game3() {
    const router = useRouter();
    const [index, setIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(6);
    const [handled, setHandled] = useState(false);
    const [showIntro, setShowIntro] = useState(true);

    const current = messages[index];


    useEffect(() => {
        if (showIntro) return; 

        setTimeLeft(6);
        setHandled(false);

        const timer = setInterval(() => {
            setTimeLeft((t) => t - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [index, showIntro]);


    useEffect(() => {
        if (timeLeft === 0 && !handled) {
            setHandled(true);
            handleIgnore();
        }
    }, [timeLeft, handled]);

    const handleChoice = (value) => {
        const newScore = score + value;
        setScore(newScore);
        next(newScore);
    };

    const handleIgnore = () => {
        const newScore = score + current.ignoreScore;
        setScore(newScore);
        next(newScore);
    };

    const next = (finalScore = score) => {
        if (index + 1 < messages.length) {
            setIndex((i) => i + 1);
        } else {
            let successCount = 1;
            if (finalScore >= 9) successCount = 3;
            else if (finalScore <= 3) successCount = 0;

            router.push(`/ending?success=${successCount}`);
        }
    };

    return (
        <div className="relative h-screen w-screen overflow-hidden">

            {showIntro && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="w-[80%] max-w-4xl bg-white/80 backdrop-blur-md rounded-2xl p-10 shadow-xl text-[#482923] leading-relaxed">

                        <h2 className="text-2xl font-black text-[#A82D2C] mb-6 text-center">
                            第三關：等待審理
                        </h2>

                        <p className="mb-4">
                            在保護令正式生效前，你必須撐過一段危險而漫長的等待期。
                            手機不再只是聯絡工具，而是隨時可能引爆恐懼的來源。
                        </p>

                        <p className="mb-4">
                            你將陸續收到來自<strong>加害者、朋友、社工與法院</strong>的訊息。
                            每一次訊息出現後，你都必須在<strong>有限時間內</strong>選擇回應或忽視。
                        </p>

                        <p className="mb-4 text-[#A82D2C] font-semibold">
                            請注意：錯誤的回應可能提升風險，而忽視關鍵通知，則可能讓你失去保護。
                        </p>

                        <p className="mb-8">
                            在這一關，沒有安全的沉默，也沒有毫無代價的選擇。
                            你是否能平安等到審理結束，將取決於你的每一次決定。
                        </p>

                        <div className="flex justify-center">
                            <button
                                onClick={() => setShowIntro(false)}
                                className="px-10 py-3 bg-[#A82D2C] text-white font-bold rounded-full shadow-md hover:scale-105 transition"
                            >
                                開始 →
                            </button>
                        </div>

                    </div>
                </div>
            )}

            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

            <img
                src="/phone.png"
                alt="phone"
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl object-contain z-0"
            />

            <div
                className="absolute border-2 border-transparent"
                style={{
                    width: "40%",
                    height: "80%",
                    top: "20%",
                    left: "30%",
                }}
            >

                <div
                    className="absolute text-xs text-gray-500"
                    style={{
                        top: "4%",
                        left: "50%",
                        transform: "translateX(-50%)",
                    }}
                >
                    等待審理中…
                </div>


                <div
                    key={index}
                    className="absolute items-start gap-[3%] animate-pop-from-top"


                    style={{
                        top: "15%",
                        left: "5%",
                        width: "90%",
                    }}
                >

                    <div className="bg-white/85 backdrop-blur-lg rounded-2xl p-[4%]">
                        <div className="flex items-center gap-[3%] mb-[2%]">
                            <div className="w-[10%] aspect-square rounded-full bg-gray-400 flex-shrink-0" />
                            <p className="text-base text-gray-500">
                                {current.sender}
                            </p>
                        </div>
                        <p className="text-lg text-gray-800 leading-relaxed">
                            {current.text}
                        </p>
                    </div>
                </div>

                <div
                    className="absolute text-xs text-red-600"
                    style={{
                        top: "55%",
                        left: "50%",
                        transform: "translateX(-50%)",
                    }}
                >
                    {timeLeft > 0 && `${timeLeft} 秒後自動忽視`}
                </div>

                <div
                    className="absolute space-y-[3%]"
                    style={{
                        top: "60%",
                        left: "5%",
                        width: "90%",
                    }}
                >
                    {current.options.map((opt, i) => (
                        <button
                            key={i}
                            onClick={() => handleChoice(opt.score)}
                            className="w-full bg-[#8B2E2E] text-white py-[4%] rounded-full text-sm font-semibold"
                        >
                            {opt.text}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
