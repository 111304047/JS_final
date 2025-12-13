"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function Game1() {
  const router = useRouter();
  const folderRef = useRef(null);

  const hoverSoundRef = useRef(null);
  const successSoundRef = useRef(null);
  const failSoundRef = useRef(null);
  const countdownSoundRef = useRef(null);
  const countdownPlayedRef = useRef(false);

  const [gameStarted, setGameStarted] = useState(false);
  const [timer, setTimer] = useState(30);
  const [items, setItems] = useState([]);
  const [collected, setCollected] = useState(0);
  const totalNeeded = 5;

  const [showResult, setShowResult] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successCount, setSuccessCount] = useState(0);

  const [draggingId, setDraggingId] = useState(null);
  const [dragOrigin, setDragOrigin] = useState(null);

  const evidenceList = [
    { id: 1, name: "威脅訊息截圖", img: "/evidence/chat.png", desc: "對方恐嚇的對話紀錄" },
    { id: 2, name: "醫院診斷書", img: "/evidence/hospital.png", desc: "醫師開立的傷勢診斷證明" },
    { id: 3, name: "受傷照片", img: "/evidence/photo.png", desc: "拍下的外傷影像" },
    { id: 4, name: "家暴語音錄音", img: "/evidence/record.png", desc: "當下留下的錄音證據" },
    { id: 5, name: "警局備案單", img: "/evidence/police.png", desc: "曾向警方報案的紀錄" }
  ];

  const decoyList = [
    { id: 101, name: "咖啡", img: "/decoy/coffee.png", desc: "喝到一半的咖啡" },
    { id: 102, name: "鍵盤", img: "/decoy/keyboard.png", desc: "桌上的舊鍵盤" },
    { id: 103, name: "備忘錄", img: "/decoy/memo.png", desc: "零散的筆記" },
    { id: 104, name: "報紙", img: "/decoy/newspaper.png", desc: "昨天的報紙" }
  ];

  // 初始位置
  useEffect(() => {
    const all = [...evidenceList, ...decoyList];
    setItems(
      all.map((item) => ({
        ...item,
        x: Math.random() * 45 + 25 + "vw",
        y: Math.random() * 40 + 5 + "vh",
        isReal: evidenceList.some((e) => e.id === item.id),
      }))
    );
  }, []);

  // 計時器
  useEffect(() => {
    if (!gameStarted) return; // 還沒開始不倒數

    // 剩五秒播放音效
    if (timer === 5 && !countdownPlayedRef.current) {
      if (countdownSoundRef.current) {
        countdownSoundRef.current.currentTime = 0;
        countdownSoundRef.current.play();
        countdownPlayedRef.current = true;
      }
    }

    if (timer <= 0) {
      setShowResult(true);
      setIsSuccess(collected >= totalNeeded);
      return;
    }

    const countdown = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);

    return () => clearInterval(countdown);
  }, [timer, gameStarted]);

  useEffect(() => {
    hoverSoundRef.current = new Audio("/sfx/hover.mp3");
    hoverSoundRef.current.volume = 0.6;

    successSoundRef.current = new Audio("/sfx/success.mp3");
    successSoundRef.current.volume = 0.6;

    failSoundRef.current = new Audio("/sfx/fail.mp3");
    failSoundRef.current.volume = 0.6;

    countdownSoundRef.current = new Audio("/sfx/countdown.mp3");
    countdownSoundRef.current.volume = 0.6;
  }, []);

  /*拖曳邏輯*/

  const onMouseDown = (e, id) => {
    e.preventDefault();
    const item = items.find((i) => i.id === id);
    if (!item) return;

    setDraggingId(id);
    setDragOrigin({ id, x: item.x, y: item.y });
  };

  const onMouseMove = (e) => {
    if (draggingId === null) return;

    setItems((prev) =>
      prev.map((item) =>
        item.id === draggingId
          ? {
            ...item,
            x: e.clientX - 150 + "px",
            y: e.clientY - 150 + "px",
          }
          : item
      )
    );
  };

  const onMouseUp = () => {
    if (draggingId === null) return;

    const item = items.find((i) => i.id === draggingId);
    const folder = folderRef.current;
    if (!item || !folder) {
      setDraggingId(null);
      return;
    }

    const folderRect = folder.getBoundingClientRect();
    const itemX = parseFloat(item.x);
    const itemY = parseFloat(item.y);
    const centerX = itemX + 150;
    const centerY = itemY + 150;

    const inside =
      centerX >= folderRect.left &&
      centerX <= folderRect.right &&
      centerY >= folderRect.top &&
      centerY <= folderRect.bottom;

    // 在收集夾內
    if (inside) {
      if (item.isReal) {
        // 成功音效
        if (successSoundRef.current) {
          successSoundRef.current.currentTime = 0;
          successSoundRef.current.play();
        }
        setItems((prev) => prev.filter((i) => i.id !== item.id));
        setCollected((c) => {
          const next = c + 1;
          if (next >= totalNeeded) {
            setTimeout(() => {
              setShowResult(true);
              setIsSuccess(true);
              setSuccessCount(1);
            }, 300);
          }
          return next;
        });
      } else if (dragOrigin) {

        // 失敗音效
        if (failSoundRef.current) {
          failSoundRef.current.currentTime = 0;
          failSoundRef.current.play();
        }
        // 干擾物彈回
        setItems((prev) =>
          prev.map((i) =>
            i.id === item.id
              ? { ...i, x: dragOrigin.x, y: dragOrigin.y, bounce: true }
              : i
          )
        );
        setTimeout(() => {
          setItems((prev) =>
            prev.map((i) =>
              i.id === item.id ? { ...i, bounce: false } : i
            )
          );
        }, 300);
      }
    }

    setDraggingId(null);
  };

  /* UI */

  return (
    <div
      className="relative w-screen h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/game1-bg.png')" }}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
    >
      <div
        className={`absolute top-4 left-4
    bg-[#f8f4ec] backdrop-blur-sm
    px-4 py-2 rounded-xl
    text-lg font-bold text-[#A82D2C]
    shadow-md border border-[#e2d8c3]
    transition-all
    ${timer <= 5 && timer > 0 ? "animate-shake text-red-700" : ""}
  `}
      >
        ⏳ 剩餘時間：{timer} 秒
      </div>



      <div
        className="absolute top-4 right-4
             bg-[#f8f4ec] backdrop-blur-sm
             px-4 py-2 rounded-xl
             text-lg font-semibold text-[#A82D2C]
             shadow-md border border-[#e2d8c3]">
        📂 已蒐證：{collected} / {totalNeeded}
      </div>



      {/* 收集夾 */}
      <div
        ref={folderRef}
        className="absolute bottom-5 left-1/2 -translate-x-1/2 w-[300px] h-[120px] bg-white rounded-xl shadow-lg border-2 border-[#A82D2C] flex flex-col justify-center items-center"
      >
        📁 證據收集夾
        <span className="text-sm text-gray-600">(拖曳證物到這裡)</span>
      </div>

      {/* 證物 / 干擾物 */}
      {items.map((item) => (
        <div
          key={item.id}
          onMouseDown={(e) => onMouseDown(e, item.id)}
          onMouseEnter={() => {
            if (hoverSoundRef.current) {
              hoverSoundRef.current.currentTime = 0;
              hoverSoundRef.current.play();
            }
          }}
          className="absolute cursor-grab transition-transform duration-150
             hover:scale-110 group"
          style={{ left: item.x, top: item.y }}
        >
          <img
            src={item.img}
            alt={item.name}
            className="w-72 h-72 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.9)]"
          />

          {/* 🏷️ Hover 小標籤 */}
          <div
            className="absolute left-1/2 -translate-x-1/2 -top-4
               hidden group-hover:block
               bg-black/80 text-white text-xs
               px-3 py-2 rounded-lg shadow-lg
               whitespace-nowrap z-50
               text-center"
          >
            <div className="font-semibold">{item.name}</div>
            <div className="text-[10px] opacity-80 mt-0.5">
              {item.desc}
            </div>
          </div>
        </div>

      ))}

      {/* 遊戲開始介紹彈窗 */}
      {!gameStarted && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white w-[580px] p-10 rounded-2xl shadow-xl text-[#482923]">

            <h2 className="text-2xl font-bold text-[#A82D2C] mb-6 text-center">
              關卡一｜蒐證挑戰
            </h2>

            <p className="text-base mb-4">
              當家不再是避風港，你唯一能依靠的，只剩下那些零散卻關鍵的證據。
            </p>

            <p className="text-base mb-4">
              桌面上散落著各種物品，
              有些，可能是你<span className="font-bold">自保的關鍵</span>。
            </p>

            <p className="text-base mb-4 font-semibold text-[#A82D2C]">
              一次錯誤的判斷，都可能讓真正的證據被忽略。
            </p>

            <p className="text-base mb-4">
              你必須在<span className="font-bold">有限的時間</span>內保持冷靜，
              找出並<span className="font-bold">蒐集所有有效的證據</span>。
            </p>

            <p className="text-base mb-4">
              時間一到，行動將被迫終止。
            </p>

            <div className="flex justify-center">
              <button
                onClick={() => setGameStarted(true)}
                className="px-8 py-3 bg-[#A82D2C] text-white font-bold rounded-full
                   shadow-md hover:bg-[#8f2524] transition"
              >
                Start
              </button>
            </div>

          </div>
        </div>
      )}



      {/* 結果視窗 */}
      {showResult && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-white w-[380px] p-8 rounded-2xl shadow-xl text-center text-[#482923]">
            {isSuccess ? (
              <p className="text-2xl font-bold text-green-700 mb-6">
                恭喜你！<br />找到所有證據！
              </p>
            ) : (
              <p className="text-2xl font-bold text-[#A82D2C] mb-6">
                真可惜！<br />還有一些證據沒有找到……
              </p>
            )}

            <button
              onClick={() => router.push(`/game2?successCount=${successCount}`)}
              className="px-6 py-3 bg-[#A82D2C] text-white rounded-full text-lg font-bold shadow-md hover:bg-[#8f2524] transition"
            >
              下一關 →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
