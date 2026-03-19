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
    if (!endTs) return "--:--:--:--";
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
        className={`fixed inset-0 z-50 transition-all duration-300 ${
          animIn ? "bg-black/70 backdrop-blur-sm" : "bg-black/0"
        }`}
      />

      <div
        className={`fixed bottom-0 left-1/2 z-50 h-[65vh] max-w-[430px] w-full mx-[4px] flex flex-col rounded-t-3xl bg-[#545454] border-2 border-black shadow-2xl transform transition-transform duration-[380ms] ease-[cubic-bezier(0.32,0.72,0,1)] ${
          animIn ? "translate-y-0 -translate-x-1/2" : "translate-y-full -translate-x-1/2"
        }`}
      >
        <div className="flex justify-center pt-2 pb-1 shrink-0">
          <div className="w-9 h-1 rounded-full bg-white/20" />
        </div>

        <div className="flex-1 px-4 pb-4 flex flex-col">
          {/* Close - Compact */}
          <div className="flex justify-end mb-2">
            <button
              onClick={onClose}
              className="flex items-center gap-1 rounded-lg px-2 py-1 text-black font-bold text-[12px] bg-[#b4b4b4]"
            >
              <span>❌</span> Закрыть
            </button>
          </div>

          {/* Timer - Tightened Height */}
          <div className="rounded-xl flex flex-col items-center justify-center py-1.5 mb-2 border-[3px] border-[#dbdbdb] bg-black shrink-0">
            <p className="text-[#d9d9d9] font-extrabold text-[9px] tracking-widest leading-none mb-1">ОСТАЛОСЬ</p>
            <p className="font-black text-white text-[24px] leading-none tabular-nums">{countdown}</p>
          </div>

          {/* Description - Smaller text/padding */}
          <div className="rounded-md px-2 py-2 mb-2 shrink-0 bg-[#3d3838]">
            <p className="text-white text-center text-[10px] leading-[1.3]">
              Каждые две недели проходит огромный турнир. Все билеты <br/> 
              зачисляются в ставку. По истечению таймера 90% <br/> 
              билетов сгорают, а победители получают награды:
            </p>
          </div>

          {/* Table - No Scrolling Needed Now */}
          <div className="rounded-lg overflow-hidden px-2 py-1 bg-[#3d3838]">
            {PRIZES.map((row, i) => (
              <div
                key={i}
                className={`flex justify-between items-center ${i !== PRIZES.length - 1 ? 'border-b' : ''}`}
                style={{ borderColor: "#555" }} 
              >
                <span className="text-white font-bold text-[10.5px] py-1.5">{row.place}</span>
                <span
                  className="text-[10.5px] font-black"
                  style={{ color: row.reward === "0 USDT" ? "#999" : "#E1BB2A" }} 
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