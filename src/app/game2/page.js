"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function Game2() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const successCount = parseInt(searchParams.get("successCount") || "0");

  const canvasRef = useRef(null);

  // audio refs
  const successAudioRef = useRef(null);
  const playedStationsRef = useRef(new Set());

  const [gameStarted, setGameStarted] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const GRID_SIZE = 5;
  const CELL_WIDTH = 80;
  const CELL_HEIGHT = 80;
  const PADDING = 40;

  // 路線
  const PATHS = [
    // path 1：旋轉 0°
    [
      [3,1],[3,0],[4,0],[4,1],[4,2],[4,3],[4,4],[3,4],[3,3],[3,2],
      [2,2],[2,1],[2,0],[1,0],[0,0],[0,1],[1,1],[1,2],[0,2],[0,3],
      [0,4],[1,4],[1,3],[2,3],[2,4]
    ],
    // path 2：旋轉 90°
    [
      [1,1],[0,1],[0,0],[1,0],[2,0],[3,0],[4,0],[4,1],[3,1],[2,1],
      [2,2],[1,2],[0,2],[0,3],[0,4],[1,4],[1,3],[2,3],[2,4],[3,4],
      [4,4],[4,3],[3,3],[3,2],[4,2]
    ],
    // path 3 - 旋轉 180°
    [
      [1,3],[1,4],[0,4],[0,3],[0,2],[0,1],[0,0],[1,0],[1,1],[1,2],
      [2,2],[2,3],[2,4],[3,4],[4,4],[4,3],[3,3],[3,2],[4,2],[4,1],
      [4,0],[3,0],[3,1],[2,1],[2,0]
    ],
    // path 4 - 旋轉 270°
    [
      [3,3],[4,3],[4,4],[3,4],[2,4],[1,4],[0,4],[0,3],[1,3],[2,3],
      [2,2],[3,2],[4,2],[4,1],[4,0],[3,0],[3,1],[2,1],[2,0],[1,0],
      [0,0],[0,1],[1,1],[1,2],[0,2]
    ],
  ];

  // 6 個站點位置
  const STATION_INDICES = [0, 4, 8, 12, 16, 24];

  const stations = [
    { id: 1, name: "家裡", emoji: "🏠", pathIndex: STATION_INDICES[0], order: 0, description: "逃離暴力的起點" },
    { id: 2, name: "警局", emoji: "🚔", pathIndex: STATION_INDICES[1], order: 1, description: "報警並製作筆錄" },
    { id: 3, name: "醫院", emoji: "🏥", pathIndex: STATION_INDICES[2], order: 2, description: "就醫並記錄傷勢" },
    { id: 4, name: "防治中心", emoji: "🛡️", pathIndex: STATION_INDICES[3], order: 3, description: "尋求專業諮詢與保護" },
    { id: 5, name: "法院", emoji: "⚖️", pathIndex: STATION_INDICES[4], order: 4, description: "申請保護令" },
    { id: 6, name: "警察機關", emoji: "👮", pathIndex: STATION_INDICES[5], order: 5, description: "最終安全保護" },
  ];

  const [correctPath, setCorrectPath] = useState([]);

  // 隨機選擇 path
  useEffect(() => {
    const randomIdx = Math.floor(Math.random() * PATHS.length);
    const path = PATHS[randomIdx];
    setCorrectPath(path);
    setGridOffset({ x: PADDING, y: PADDING });
  }, []);

  const [visitedCells, setVisitedCells] = useState([]);
  const [currentPath, setCurrentPath] = useState([]);
  const [currentCell, setCurrentCell] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [gridOffset, setGridOffset] = useState({ x: 0, y: 0 });

  // Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = GRID_SIZE * CELL_WIDTH + PADDING * 2;
    canvas.height = GRID_SIZE * CELL_HEIGHT + PADDING * 2;
  }, []);

  // Canvas 座標 -> 網格座標
  const getCellFromPos = (x, y) => {
    const gridX = Math.floor((x - gridOffset.x) / CELL_WIDTH);
    const gridY = Math.floor((y - gridOffset.y) / CELL_HEIGHT);
    if (gridX >= 0 && gridX < GRID_SIZE && gridY >= 0 && gridY < GRID_SIZE) {
      return [gridY, gridX];
    }
    return null;
  };

  const getCellCenter = (row, col) => {
    return {
      x: gridOffset.x + col * CELL_WIDTH + CELL_WIDTH / 2,
      y: gridOffset.y + row * CELL_HEIGHT + CELL_HEIGHT / 2,
    };
  };

  const isAdjacent = (cell1, cell2) => {
    if (!cell1 || !cell2) return false;
    const [r1, c1] = cell1;
    const [r2, c2] = cell2;
    return Math.abs(r1 - r2) + Math.abs(c1 - c2) === 1;
  };

  const isCellVisited = (cell) => {
    return visitedCells.some((c) => c[0] === cell[0] && c[1] === cell[1]);
  };

  const drawGame = (ctx) => {
    if (!ctx || !canvasRef.current) return;

    // 清空
    ctx.fillStyle = "#f5f1e8";
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    // 格子
    ctx.strokeStyle = "#d4c5b0";
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(gridOffset.x, gridOffset.y + i * CELL_HEIGHT);
      ctx.lineTo(gridOffset.x + GRID_SIZE * CELL_WIDTH, gridOffset.y + i * CELL_HEIGHT);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(gridOffset.x + i * CELL_WIDTH, gridOffset.y);
      ctx.lineTo(gridOffset.x + i * CELL_WIDTH, gridOffset.y + GRID_SIZE * CELL_HEIGHT);
      ctx.stroke();
    }

    // 玩家路線
    if (currentPath.length > 1) {
      ctx.strokeStyle = "#A82D2C";
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      ctx.beginPath();
      const firstCell = currentPath[0];
      const firstCenter = getCellCenter(firstCell[0], firstCell[1]);
      ctx.moveTo(firstCenter.x, firstCenter.y);

      for (let i = 1; i < currentPath.length; i++) {
        const cell = currentPath[i];
        const center = getCellCenter(cell[0], cell[1]);
        ctx.lineTo(center.x, center.y);
      }
      ctx.stroke();
    }

    // 站點
    stations.forEach((station) => {
      if (correctPath.length === 0) return;

      const pos = correctPath[station.pathIndex];
      const center = getCellCenter(pos[0], pos[1]);

      const isInPath = currentPath.some((c) => c[0] === pos[0] && c[1] === pos[1]);

      ctx.fillStyle = isInPath ? "#A82D2C" : "white";
      ctx.strokeStyle = "#A82D2C";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(center.x, center.y, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = isInPath ? "white" : "#482923";
      ctx.font = "24px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(station.emoji, center.x, center.y - 2);

      if (isInPath) {
        const pathIndex = currentPath.findIndex((c) => c[0] === pos[0] && c[1] === pos[1]);
        ctx.fillStyle = "white";
        ctx.font = "bold 10px Arial";
        ctx.fillText((pathIndex + 1).toString(), center.x, center.y + 12);
      }
    });
  };

  // 迴圈
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    drawGame(ctx);
  }, [currentPath, visitedCells, gridOffset, correctPath]);

  // 初始化音效
  useEffect(() => {
    // create audio element for success sound
    successAudioRef.current = new Audio('/sfx/success.mp3');
    successAudioRef.current.volume = 0.9;

    return () => {
      // clean up
      if (successAudioRef.current) {
        successAudioRef.current.pause();
        successAudioRef.current = null;
      }
    };
  }, []);

  // 當路徑更新時，檢查是否有站點被新經過，若是播放音效（且只播放一次）
  useEffect(() => {
    if (correctPath.length === 0) return;

    // 檢查每個站點位置是否在 currentPath 中
    stations.forEach((station, idx) => {
      const pos = correctPath[station.pathIndex];
      const foundIndex = currentPath.findIndex((c) => c[0] === pos[0] && c[1] === pos[1]);
      if (foundIndex !== -1 && !playedStationsRef.current.has(station.id)) {
        // 播放音效
        try {
          successAudioRef.current && successAudioRef.current.play();
        } catch (e) {
          // autoplay may be blocked; ignore
        }
        playedStationsRef.current.add(station.id);
      }
    });
  }, [currentPath, correctPath]);

  // 滑鼠
  const handleMouseDown = (e) => {
    if (!gameStarted || showResult) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const cell = getCellFromPos(e.clientX - rect.left, e.clientY - rect.top);
    if (!cell) return;

    if (currentPath.length === 0) {
      // 必須從起點開始
      if (
        cell[0] === correctPath[0][0] &&
        cell[1] === correctPath[0][1]
      ) {
        setCurrentPath([cell]);
        setVisitedCells([cell]);
        setCurrentCell(cell);
        setIsDrawing(true);
      }
    } else {
      const lastCell = currentPath[currentPath.length - 1];
      if (cell[0] === lastCell[0] && cell[1] === lastCell[1]) {
        setIsDrawing(true);
        setCurrentCell(cell);
      }
    }
  };

  const handleMouseMove = (e) => {
    if (!isDrawing || !gameStarted || showResult) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const cell = getCellFromPos(e.clientX - rect.left, e.clientY - rect.top);
    if (!cell || !currentCell) return;

    if (isAdjacent(currentCell, cell) && !isCellVisited(cell)) {
      setCurrentPath((prev) => [...prev, cell]);
      setVisitedCells((prev) => [...prev, cell]);
      setCurrentCell(cell);
    }
  };

  const handleMouseUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    // 是否走遍 25格？
    if (currentPath.length === GRID_SIZE * GRID_SIZE && correctPath.length > 0) {
      const lastCell = currentPath[currentPath.length - 1];
      
      // 檢查終點和路徑是否正確？
      const isCorrect =
        lastCell[0] === correctPath[24][0] &&
        lastCell[1] === correctPath[24][1] &&
        currentPath.every((cell, idx) => {
          const correctCell = correctPath[idx];
          return cell[0] === correctCell[0] && cell[1] === correctCell[1];
        });

      setShowResult(true);
      setIsSuccess(isCorrect);
    }
  };

  const handleReset = () => {
    setCurrentPath([]);
    setVisitedCells([]);
    setCurrentCell(null);
  };

  return (
    <div
      className="relative w-screen h-screen bg-cover bg-center flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundImage: "url('/game1-bg.png')" }}
    >
      <div className="absolute top-4 left-4 bg-[#f8f4ec] backdrop-blur-sm px-4 py-2 rounded-xl text-lg font-bold text-[#A82D2C] shadow-md border border-[#e2d8c3]">
        第二關｜求助之路
      </div>

      <div className="absolute top-4 right-4 bg-[#f8f4ec] backdrop-blur-sm px-4 py-2 rounded-xl text-lg font-semibold text-[#A82D2C] shadow-md border border-[#e2d8c3]">
        已連接：{currentPath.length} / 25
      </div>

      <div className="absolute left-1/2 -translate-x-1/2 top-4 rounded-xl backdrop-blur-sm shadow-lg border border-[#d4c5b0] px-9 py-6" style={{ background: "#f5f1e8" }}>
        <h3 className="text-1xl font-bold text-[#A82D2C] mb-6 text-center">📍 求助順序說明</h3>
        <div className="grid grid-cols-6 gap-6">
          {stations.map((station, idx) => (
            <div key={station.id} className="flex flex-col items-center text-center">
              <div className="text-3xl mb-3">{station.emoji}</div>
              <div className="font-bold text-[#482923] text-sm mb-2">
                {idx + 1}. {station.name}
              </div>
              <div className="text-[#666] text-sm leading-relaxed">
                {station.description}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Canvas */}
      <div className="relative flex items-center justify-center flex-1 mt-12">
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="cursor-crosshair shadow-lg rounded-lg"
          style={{ border: "2px solid #A82D2C" }}
        />
      </div>

      {/* 介紹 */}
      {!gameStarted && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white w-[580px] p-10 rounded-2xl shadow-xl text-[#482923]">
            <h2 className="text-2xl font-bold text-[#A82D2C] mb-6 text-center">
              關卡二｜求助之路
            </h2>

            <p className="text-base mb-4">
              家暴不會無預警地停止，但逃離它的路卻清晰而單一。
            </p>

            <p className="text-base mb-4">
              你必須走過從暴力現場到最終保護的每一個關鍵站點。
              每一步都不能跳過，也都必須按照法律流程。
            </p>

            <p className="text-base mb-4">
              用滑鼠從<span className="font-bold">「家裡」🏠</span>開始，
              經過全部 25 個格子，按照正確的求助順序連接到各個站點，
              最終到達<span className="font-bold">「警察機關」👮</span>。
            </p>

            <p className="text-base mb-4">
              你可以隨時放開滑鼠，之後從斷點繼續連接。
            </p>

            <p className="text-base mb-4 font-semibold text-[#A82D2C]">
              規則：每個格子只能經過一次，路線不能交叉。
              右側有完整的求助順序說明，請按照順序訪問每個站點。
            </p>

            <div className="flex justify-center">
              <button
                onClick={() => setGameStarted(true)}
                className="px-8 py-3 bg-[#A82D2C] text-white font-bold rounded-full shadow-md hover:bg-[#8f2524] transition"
              >
                開始遊戲
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 重新開始按鈕 */}
      {gameStarted && !showResult && (
        <button
          onClick={handleReset}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 bg-[#f8f4ec] text-[#A82D2C] font-bold rounded-full shadow-md hover:bg-white transition border border-[#e2d8c3]"
        >
          重新開始
        </button>
      )}

      {/* 結果 */}
      {showResult && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white w-[380px] p-8 rounded-2xl shadow-xl text-center text-[#482923]">
            {isSuccess ? (
              <p className="text-2xl font-bold text-green-700 mb-6">
                恭喜你！<br />找到正確的求助之路！
              </p>
            ) : (
              <p className="text-2xl font-bold text-[#A82D2C] mb-6">
                順序有誤……<br />請重新思考正確的流程。
              </p>
            )}

            <button
              onClick={() =>
                router.push(
                  `/game3?successCount=${isSuccess ? successCount + 1 : successCount}`
                )
              }
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