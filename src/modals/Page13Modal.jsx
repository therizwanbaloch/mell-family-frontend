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
      document.body.style.overflow = 'hidden';
    } else {
      setAnimIn(false);
      document.body.style.overflow = '';
      const t = setTimeout(() => setVisible(false), 380);
      return () => clearTimeout(t);
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!visible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-[100] transition-all duration-300 ${
          animIn ? "bg-black/80 backdrop-blur-[2px]" : "bg-black/0"
        }`}
      />

      {/* Modal Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`fixed bottom-0 left-1/2 z-[101] flex flex-col rounded-t-[32px] bg-[#4a4a4a] border-t-2 border-x-2 border-black shadow-2xl transition-transform duration-[400ms] ease-[cubic-bezier(0.32,0.72,0,1)] ${
          animIn ? "translate-y-0 -translate-x-1/2" : "translate-y-full -translate-x-1/2"
        }`}
        style={{
          width: 'calc(100% - 8px)',
          maxWidth: '422px',
          height: '75dvh', // Dynamic height for both OS
          paddingBottom: 'calc(env(safe-area-inset-bottom) + 12px)'
        }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1.5 rounded-full bg-white/20" />
        </div>

        {/* Content Area */}
        <div className="flex-1 px-4 pb-2 flex flex-col overflow-hidden">
          
          {/* Header/Close Row */}
          <div className="flex justify-end mb-2 shrink-0">
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-black font-black text-[11px] bg-[#b4b4b4] border border-black shadow-[0_2px_0_#000]"
            >
              <span>❌</span> Закрыть
            </button>
          </div>

          {/* Timer Card */}
          <div className="rounded-2xl flex flex-col items-center justify-center py-3 mb-3 border-2 border-[#da9d01] bg-black shrink-0 shadow-[0_0_15px_rgba(218,157,1,0.1)]">
            <p className="text-[#888] font-black text-[9px] tracking-[0.2em] mb-1">ОСТАЛОСЬ</p>
            <p className="font-days font-black text-white text-[28px] leading-none tabular-nums tracking-tighter">
              {countdown}
            </p>
          </div>

          {/* Info Description */}
          <div className="rounded-xl px-3 py-3 mb-3 bg-[#333] border border-white/5 shrink-0">
            <p className="text-white text-center text-[11px] leading-relaxed font-medium">
              Каждые две недели проходит огромный турнир. Все билеты зачисляются в ставку. По истечению таймера 90% билетов сгорают, а победители получают награды:
            </p>
          </div>

          {/* Prize Table - SCROLLABLE area */}
          <div className="flex-1 overflow-y-auto rounded-xl bg-[#2d2d2d] border border-black/50 no-scrollbar">
            <div className="px-3">
              {PRIZES.map((row, i) => (
                <div
                  key={i}
                  className={`flex justify-between items-center py-3 ${i !== PRIZES.length - 1 ? 'border-b border-white/5' : ''}`}
                >
                  <span className="text-[#eee] font-bold text-[12px]">{row.place}</span>
                  <span
                    className="text-[12px] font-black"
                    style={{ color: row.reward === "0 USDT" ? "#666" : "#E1BB2A" }} 
                  >
                    {row.reward}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Global styles for the scrollbar and font */}
        <style>{`
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          .font-days { font-family: 'Days One', sans-serif; }
        `}</style>
      </div>
    </>
  );
};

export default Page13Modal;