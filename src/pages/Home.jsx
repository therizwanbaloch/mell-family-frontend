import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { doTap, fetchState, fetchTournaments } from "../redux/gameSlice";
import { BsLightningChargeFill } from "react-icons/bs";
import { FaSackDollar } from "react-icons/fa6";
import { PiCursorClick } from "react-icons/pi";

import mainBg     from "../assets/page1bg.webp";
import profilePic from "../assets/page1bg.webp";
import coinImage  from "../assets/coin.webp";
import logoImg    from "../assets/logo.webp";
import layout1    from "../assets/layout1.webp";
import layout2    from "../assets/layout2.webp";
import layout3    from "../assets/layout3.webp";
import layout4    from "../assets/layout4.webp";
import layout5    from "../assets/layout5.webp";
import layout6    from "../assets/layout6.webp";
import layoutMain from "../assets/layoutMain.webp";

import UserProfile  from "../modals/UserProfile";
import BalanceModal from "../modals/BalanceModal";
import Page8Modal   from "../modals/Page8Modal";
import SnackBar     from "../components/SnackBar";

/* ─── Components & Helpers ─── */
const FloatingLabel = ({ x, y, value }) => (
  <div style={{
    position: "fixed", left: x, top: y, transform: "translate(-50%,-50%)",
    pointerEvents: "none", zIndex: 9999, animation: "floatUp 0.85s ease-out forwards",
    color: "#FFD700", fontWeight: 900, fontSize: 18, textShadow: "0 2px 8px rgba(0,0,0,0.9)",
  }}>+{value}</div>
);

const SideIcon = ({ src, label, onClick }) => (
  <div className="flex flex-col items-center gap-0.5 cursor-pointer active:opacity-70" onClick={onClick}>
    <img src={src} alt={label} style={{ width: 34, height: 34, borderRadius: 8, objectFit: "cover", boxShadow: "0 2px 8px rgba(0,0,0,0.5)" }} />
    <span className="text-white font-extrabold uppercase text-[8px] tracking-wide" style={{ textShadow: "0 1px 3px #000" }}>{label}</span>
  </div>
);

// FIX: Changed 1M/1K to 1000000/1000
const fmtFa = (n) => Math.floor(n || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
const fmtShort = (n) => {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}М`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}К`;
  return String(Math.floor(n || 0));
};

const GOLD_BTN = { background: "linear-gradient(180deg,#deba00,#c87800)", border: "2.5px solid #af8700", boxShadow: "0 3px 8px rgba(175,135,0,0.55)" };
const GOLD = { background: "linear-gradient(180deg,#f0a800 0%,#da9d01 50%,#b87e00 100%)", border: "2px solid #b58030", boxShadow: "0 4px 0 #7a4e00" };

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, rates, tournaments, stateLoading } = useSelector((s) => s.game);

  const [localFa, setLocalFa] = useState(null);
  const [localEnergy, setLocalEnergy] = useState(null);
  const [tapping, setTapping] = useState(false);
  const [floats, setFloats] = useState([]);
  
  const displayFa = localFa !== null ? localFa : (user?.fa ?? 0);
  const displayEnergy = localEnergy !== null ? localEnergy : (user?.energy ?? 0);
  const maxEnergy = 1000; 
  const energyPct = Math.max(0, Math.min(100, (displayEnergy / maxEnergy) * 100));

  const [profileOpen, setProfileOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [showPage8, setShowPage8] = useState(false);
  const [timeLeft, setTimeLeft] = useState("--:--:--");

  const floatIdRef = useRef(0);
  const tapBufferRef = useRef(0);
  const tapTimerRef = useRef(null);
  const localEngRef = useRef(null);
  localEngRef.current = localEnergy;

  useEffect(() => { dispatch(fetchTournaments()); }, [dispatch]);
  useEffect(() => {
    const endTs = tournaments?.ticket_tournament?.end_ts;
    if (!endTs) return;
    const tick = () => {
      const d = Math.max(0, endTs - Math.floor(Date.now() / 1000));
      setTimeLeft(`${String(Math.floor(d/3600)).padStart(2,"0")}:${String(Math.floor((d%3600)/60)).padStart(2,"0")}:${String(d%60).padStart(2,"0")}`);
    };
    tick(); const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [tournaments]);

  const flushTaps = useCallback(() => {
    const count = tapBufferRef.current;
    tapBufferRef.current = 0; tapTimerRef.current = null;
    if (count <= 0) return;
    setTapping(false);
    dispatch(doTap(count)).then(() => {
      dispatch(fetchState()).then(() => { setLocalFa(null); setLocalEnergy(null); });
    });
  }, [dispatch]);

  const handleTap = useCallback((e) => {
    e.preventDefault();
    const touches = e.touches || e.changedTouches;
    const points = touches ? Array.from(touches) : [{ clientX: e.clientX, clientY: e.clientY }];
    const curEnergy = localEngRef.current !== null ? localEngRef.current : (user?.energy ?? 0);
    if (curEnergy <= 0) return;
    const tapsNow = Math.min(points.length, curEnergy);

    setLocalFa((prev) => (prev !== null ? prev : user?.fa) + (rates?.fa_per_tap ?? 1) * tapsNow);
    setLocalEnergy((prev) => Math.max(0, (prev !== null ? prev : user?.energy) - tapsNow));
    setTapping(true);

    points.slice(0, tapsNow).forEach(({ clientX, clientY }) => {
      const id = floatIdRef.current++;
      setFloats((prev) => [...prev, { id, x: clientX, y: clientY }]);
      setTimeout(() => setFloats((prev) => prev.filter((f) => f.id !== id)), 900);
    });

    tapBufferRef.current += tapsNow;
    if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
    tapTimerRef.current = setTimeout(flushTaps, 300);
  }, [user, rates, flushTaps]);

  return (
    <div className="max-w-[430px] mx-auto h-dvh overflow-hidden flex flex-col bg-cover bg-center" style={{ backgroundImage: `url(${mainBg})` }}>
      <style>{`
        @keyframes floatUp { 0% { opacity:1; transform:translate(-50%,-50%) scale(1.3); } 100% { opacity:0; transform:translate(-50%,-100px) scale(0.9); } }
        @keyframes tapBounce { 0%,100% { transform:scale(1); } 50% { transform:scale(0.94); } }
      `}</style>

      {floats.map((f) => <FloatingLabel key={f.id} x={f.x} y={f.y} value={fmtShort(rates?.fa_per_tap ?? 1)} />)}

      <div className="flex flex-col items-center shrink-0">
        <img src={logoImg} alt="LOGO" className="h-[120px] w-auto object-contain drop-shadow-lg" />
        <div className="w-[94%] bg-neutral-900/90 rounded-xl border border-neutral-700 p-2 flex items-center gap-2 mb-2">
          <div className="relative shrink-0 cursor-pointer" onClick={() => setProfileOpen(true)}>
            <img src={user?.photo_url || profilePic} className="w-10 h-10 rounded-full border-2 border-yellow-400 object-cover" alt="p" />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-tr from-[#c87800] to-[#f0a800] border-2 border-[#8a5500] rotate-45 flex items-center justify-center">
              <span className="rotate-[-45deg] text-[9px] font-black text-white">{user?.main_level ?? 1}</span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-bold truncate">{user?.username || "PLAYER"}</p>
            <div className="w-full h-1.5 bg-neutral-700 rounded-full mt-1 relative overflow-hidden">
              <div className="h-full bg-yellow-600 rounded-full" style={{ width: `${((user?.profile_level - 1) % 10 + 1) * 10}%` }} />
            </div>
          </div>
          <button onClick={() => setWithdrawOpen(true)} className="px-3 py-1.5 rounded-full text-[10px] font-black text-white uppercase" style={GOLD_BTN}>ВЫВОД</button>
        </div>

        <div className="flex items-center gap-1 mb-1">
          <img src={coinImage} className="w-10 h-10" alt="c" />
          <span className="text-white text-2xl font-black italic tracking-wider" style={{ fontFamily: 'Days One', textShadow: "0 2px 8px #000" }}>
            {fmtFa(displayFa)}
          </span>
        </div>

        <div className="flex gap-2 mb-4">
          <div className="flex items-center gap-1 bg-gradient-to-b from-[#5ecb1a] to-[#3a9010] border border-[#2a6a08] px-3 py-0.5 rounded-full shadow-md">
            <span className="text-[9px] font-black">{fmtShort(rates?.fa_per_hour ?? 0)}В/час</span>
            <FaSackDollar size={10} />
          </div>
          <div className="flex items-center gap-1 bg-gradient-to-b from-[#f0a800] to-[#c87800] border border-[#8a5500] px-3 py-0.5 rounded-full shadow-md">
            <span className="text-[9px] font-black">{fmtShort(rates?.fa_per_tap ?? 1)}М/тап</span>
            <PiCursorClick size={10} />
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 max-h-[350px]">
        <div className="w-full flex justify-between items-center max-w-[380px]">
          <div className="flex flex-col gap-4">
            <SideIcon src={layout1} label="ТУРНИРЫ" onClick={() => setShowPage8(true)} />
            <SideIcon src={layout2} label="БОКСЫ" onClick={() => navigate("/page20")} />
            <SideIcon src={layout3} label="ПОДАРОК" />
          </div>

          <div 
            onTouchStart={handleTap} 
            className="relative cursor-pointer select-none active:scale-95 transition-transform duration-75"
            style={{ width: 160, height: 160 }}
          >
            <img src={layoutMain} className="w-full h-full object-contain" alt="m" style={{ filter: "drop-shadow(0 0 20px rgba(255,215,0,0.4))" }} />
            <div className="absolute bottom-[-10px] left-0 w-full text-center">
               <span className="text-white font-black text-xl italic tracking-[0.2em]" style={{ textShadow: "0 2px 10px #000" }}>ТАП</span>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <SideIcon src={layout4} label="СЛОТЫ" onClick={() => navigate("/page24")} />
            <SideIcon src={layout5} label="AVIATOR" onClick={() => navigate("/page25")} />
            <SideIcon src={layout6} label="BETON" />
          </div>
        </div>
      </div>

      <div className="mt-auto px-4 pb-20 flex flex-col gap-3">
        <div onClick={() => navigate("/nine")} className="w-fit p-2 rounded-xl border-2 border-yellow-600 active:scale-95 transition-transform" style={GOLD}>
          <p className="text-[10px] font-black leading-tight text-yellow-900 uppercase">УСПЕЙ ПОБЕДИТЬ!</p>
          <p className="text-lg font-black text-black">{timeLeft}</p>
        </div>

        <div className="flex items-end gap-3 w-full h-[60px]">
          <div className="flex-1 flex flex-col gap-1">
            <div className="flex items-center gap-1">
              <BsLightningChargeFill className="text-yellow-400" />
              <span className="text-white font-black text-xs">{Math.floor(displayEnergy)}/{maxEnergy}</span>
            </div>
            <div className="w-full h-3 bg-black/40 rounded-full border border-yellow-500 overflow-hidden shadow-inner">
              <div className={`h-full transition-all duration-300 ${energyPct < 30 ? 'bg-red-500' : 'bg-green-600'}`} style={{ width: `${energyPct}%` }} />
            </div>
          </div>

          <button 
            onClick={() => navigate("/page14")} 
            className="flex-1 h-full rounded-2xl font-black text-yellow-950 uppercase border-b-4 border-yellow-800 active:translate-y-1 active:border-b-0"
            style={{ backgroundColor: "#deba00", border: "2px solid #af8700" }}
          >
            УЛУЧШАЙ
          </button>
        </div>
      </div>

      <Page8Modal isOpen={showPage8} onClose={() => setShowPage8(false)} />
      <UserProfile isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
      <BalanceModal isOpen={withdrawOpen} onClose={() => setWithdrawOpen(false)} />
      <SnackBar />
    </div>
  );
};

export default Home;