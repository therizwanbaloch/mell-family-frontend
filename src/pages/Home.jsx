import React, { useState, useRef, useEffect } from 'react';
import mainBg from '../assets/page1bg.webp';
import profilePic from '../assets/page1bg.webp';
import coinImage from '../assets/coin.webp';
import BattleLayout from '../components/BattleLayout';
import HomeBottomButtons from '../components/HomeBottomButtons';
import UserProfile from '../modals/UserProfile';
import BalanceModal from '../modals/BalanceModal';
import { useNavigate } from 'react-router-dom';
import { FaSackDollar } from 'react-icons/fa6';
import { PiCursorClick } from 'react-icons/pi';
import { useSelector } from 'react-redux';

const AnimatedNumber = ({ value, formatter }) => {
  const [display, setDisplay] = useState(value);
  const prevRef = useRef(value);
  const rafRef  = useRef(null);

  useEffect(() => {
    const from = prevRef.current;
    const to   = value;
    if (from === to) return;
    prevRef.current = to;
    const duration = 500;
    const start    = performance.now();
    const step = (now) => {
      const p     = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(from + (to - from) * eased));
      if (p < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [value]);

  return <span>{formatter ? formatter(display) : display}</span>;
};

const Home = () => {
  const navigate = useNavigate();
  const [profileOpen,  setProfileOpen]  = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);

  const { user, rates, stateLoading } = useSelector((state) => state.game);

  const playerName   = user?.username || user?.first_name || 'PLAYER';
  const faPerHour    = rates?.fa_per_hour ?? 0;
  const faPerTap     = rates?.fa_per_tap  ?? 0;
  const fa           = user?.fa ?? 0;
  const profileLevel = user?.profile_level ?? 1;
  const mainLevel    = user?.main_level ?? 1;
  const levelInMain  = ((profileLevel - 1) % 10) + 1;

  const fmtFa    = (n) => Math.floor(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  const fmtShort = (n) => {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}М`;
    if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}К`;
    return String(Math.floor(n));
  };

  return (
    <div
      className="max-w-[430px] mx-auto h-dvh overflow-hidden flex flex-col bg-cover bg-center"
      style={{ backgroundImage: `url(${mainBg})` }}
    >
      


      
      <div className="flex justify-center pt-2.5 shrink-0">
        <div className="bg-black/80 border border-yellow-400/35 rounded-2xl px-8 py-1.5 flex flex-col items-center shadow-[0_4px_20px_rgba(0,0,0,0.7)]">
          <span
            className="text-yellow-400 font-black uppercase tracking-[0.12em] leading-tight"
            style={{
              fontSize: 'clamp(22px,7vw,30px)',
              textShadow: '0 0 20px rgba(255,215,0,0.8), 0 2px 4px #000',
            }}
          >
            DRUN FAMILY
          </span>
          <div className="flex items-center gap-2 mt-px w-full">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-yellow-400/60" />
            <span className="text-[#ccc] text-xs font-semibold tracking-[0.2em]">game</span>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-yellow-400/60" />
          </div>
        </div>
      </div>

    




      <div className="flex items-center gap-2 px-3 shrink-0 mt-1 py-1.5">
    


        <div
          className="relative shrink-0 cursor-pointer"
          onClick={() => setProfileOpen(true)}
        >
          <img
            src={profilePic}
            alt="profile"
            className="w-11 h-11 rounded-full object-cover border-2 border-yellow-400 shadow-[0_0_10px_rgba(255,215,0,0.5)]"
          />
          <div className="absolute -bottom-1 -left-1 bg-gradient-to-b from-[#f0a800] to-[#c87800] border border-[#8a5500] rounded-full w-[18px] h-[18px] flex items-center justify-center text-[9px] font-black text-white">
            {mainLevel}
          </div>
        </div>

      
        <div className="flex-1 flex flex-col gap-0.5">
          <span className="text-white font-extrabold text-[15px]">
            {stateLoading ? '...' : playerName}
          </span>
          <div className="flex items-center gap-1">
            <span className="text-[#f0a800] text-[10px] font-extrabold">{levelInMain}</span>
            <div className="flex-1 h-2 rounded-full bg-black/50 border border-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#5ecb1a] to-[#86efac] rounded-full transition-all duration-500"
                style={{ width: `${(levelInMain / 10) * 100}%` }}
              />
            </div>
            <span className="text-[#4ad] text-[13px]">◆</span>
            <span className="text-white text-[10px] font-extrabold">{Math.min(levelInMain + 1, 10)}</span>
          </div>
        </div>

        


        <button
          onClick={(e) => { e.stopPropagation(); setWithdrawOpen(true); }}
          className="shrink-0 bg-gradient-to-b from-[#f0a800] to-[#c87800] border-2 border-[#8a5500] rounded-[20px] px-4 py-1.5 text-black font-black text-[13px] tracking-[0.05em] uppercase cursor-pointer shadow-[0_3px_8px_rgba(175,135,0,0.6)]"
        >
          ВЫВОД
        </button>
      </div>

    
            <div className="flex items-center justify-center gap-2 shrink-0 px-3 py-0.5">
        <img src={coinImage} alt="fa" className="w-[30px] h-[30px] object-contain" />
        <span
          className="text-white font-black tracking-[0.06em]"
          style={{
            fontSize: 'clamp(20px,6vw,26px)',
            textShadow: '0 2px 10px rgba(0,0,0,0.9)',
          }}
        >
          {stateLoading ? '...' : <AnimatedNumber value={fa} formatter={fmtFa} />}
        </span>
      </div>

      

      <div className="flex items-center justify-center gap-2.5 shrink-0 mt-0.5">
        <div className="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-b from-[#5ecb1a] to-[#3a9010] border border-[#2a6a08] shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
          <span className="text-white font-black text-[12px] whitespace-nowrap">
            {stateLoading ? '...' : `${fmtShort(faPerHour)}В/час`}
          </span>
          <FaSackDollar color="#fff" size={13} />
        </div>
        <div className="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-b from-[#f0a800] to-[#c87800] border border-[#8a5500] shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
          <span className="text-white font-black text-[12px] whitespace-nowrap">
            {stateLoading ? '...' : `${fmtShort(faPerTap)}М/тап`}
          </span>
          <PiCursorClick color="#fff" size={13} />
        </div>
      </div>

    
                              <div className="flex-1 min-h-0 mt-0.5">
        <BattleLayout />
      </div>

    



      <div className="shrink-0">
        <HomeBottomButtons />
      </div>

      <UserProfile  isOpen={profileOpen}  onClose={() => setProfileOpen(false)} />
      <BalanceModal isOpen={withdrawOpen} onClose={() => setWithdrawOpen(false)} />
    </div>
  );
};

export default Home;