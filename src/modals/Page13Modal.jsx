import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const PRIZES = [
  { place: "1 Место", reward: "2300 USDT" },
  { place: "2-5 Место", reward: "250 USDT" },
  { place: "6-10 Место", reward: "100 USDT" },
  { place: "11-50 Место", reward: "10 USDT" },
  { place: "51-250 Место", reward: "2 USDT" },
  { place: "251-500 Место", reward: "1 USDT" },
  { place: "501-750 Место", reward: "0.5 USDT" },
  { place: "751-1000 Место", reward: "0.1 USDT" },
  { place: "1000+ Место", reward: "0 USDT" },
];

const useEndTsCountdown = (endTs) => {
  const calc = () => {
    if (!endTs) return "00:00:00:00";
    const ts = endTs > 10000000000 ? Math.floor(endTs / 1000) : endTs;
    const diff = Math.max(0, ts - Math.floor(Date.now() / 1000));
    const d = String(Math.floor(diff / 86400)).padStart(2, "0");
    const h = String(Math.floor((diff % 86400) / 3600)).padStart(2, "0");
    const m = String(Math.floor((diff % 3600) / 60)).padStart(2, "0");
    const s = String(diff % 60).padStart(2, "0");
    return `${d}:${h}:${m}:${s}`;
  };
  const [display, setDisplay] = useState(calc());
  useEffect(() => {
    const id = setInterval(() => setDisplay(calc()), 1000);
    return () => clearInterval(id);
  }, [endTs]);
  return display;
};

const Page13Modal = ({ isOpen, onClose }) => {
  const [visible, setVisible] = useState(false);
  const [animIn, setAnimIn] = useState(false);

  const { tournaments } = useSelector((s) => s.game);
  const tournamentData = tournaments?.usdt_draw || tournaments?.usdt_tournament;
  const endTs = tournamentData?.end_ts;
  const countdown = useEndTsCountdown(endTs);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setAnimIn(true)));
    } else {
      setAnimIn(false);
      const t = setTimeout(() => setVisible(false), 380);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  if (!visible) return null;

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-[100] transition-opacity duration-300 ${
          animIn ? "bg-black/80 backdrop-blur-[2px]" : "opacity-0"
        }`}
      />

      <div
        onClick={(e) => e.stopPropagation()}
        className={`fixed bottom-0 left-1/2 z-[101] flex flex-col rounded-t-[32px] bg-[#4a4a4a] border-t-2 border-x-2 border-black shadow-2xl transition-transform duration-[400ms] ease-[cubic-bezier(0.32,0.72,0,1)] ${
          animIn ? "translate-y-0 -translate-x-1/2" : "translate-y-full -translate-x-1/2"
        }`}
        style={{
          width: 'calc(100% - 8px)',
          maxWidth: '422px',
          height: '70dvh', // Fixed consistent height
          paddingBottom: 'calc(env(safe-area-inset-bottom) + 10px)'
        }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 shrink-0">
          <div className="w-10 h-1 rounded-full bg-white/10" />
        </div>

        <div className="flex-1 px-4 py-2 flex flex-col overflow-hidden">
          
          {/* Close Button */}
          <div className="flex justify-end mb-2">
            <button
              onClick={onClose}
              className="flex items-center gap-1 rounded-lg px-2.5 py-1 text-black font-black text-[10px] bg-[#b4b4b4] border border-black"
            >
              <span>❌</span> Закрыть
            </button>
          </div>

          {/* Timer Section */}
          <div className="rounded-2xl flex flex-col items-center justify-center py-2 mb-2 border-2 border-[#da9d01] bg-black shrink-0">
            <p className="text-[#888] font-black text-[8px] tracking-[0.2em]">ОСТАЛОСЬ</p>
            <p className="font-days font-black text-white text-[22px] leading-none tabular-nums">
              {countdown}
            </p>
          </div>

          {/* Description */}
          <div className="rounded-xl px-3 py-2 mb-2 bg-[#333] border border-white/5 shrink-0">
            <p className="text-white text-center text-[10px] leading-tight opacity-90">
              Каждые две недели проходит огромный турнир. Все билеты зачисляются в ставку. По истечению таймера 90% билетов сгорают, а победители получают награды:
            </p>
          </div>

          {/* Table Container - Fits everything without scrolling */}
          <div className="flex-1 flex flex-col justify-between rounded-xl bg-[#2d2d2d] p-2 border border-black/40">
            {PRIZES.map((row, i) => (
              <div
                key={i}
                className={`flex justify-between items-center px-1 flex-1 ${i !== PRIZES.length - 1 ? 'border-b border-white/5' : ''}`}
              >
                <span className="text-[#eee] font-bold" style={{ fontSize: 'clamp(10px, 2.5dvh, 12px)' }}>
                  {row.place}
                </span>
                <span
                  className="font-black"
                  style={{ 
                    fontSize: 'clamp(10px, 2.5dvh, 12px)',
                    color: row.reward === "0 USDT" ? "#666" : "#E1BB2A" 
                  }} 
                >
                  {row.reward}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Page13Modal;