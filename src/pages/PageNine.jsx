import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import pageBg from '../assets/page1bg.webp';
import SnackBar from '../components/SnackBar';

import imgHeroBanner  from '../assets/page9Images/cardbg.webp';
import imgTicketIcon  from '../assets/page9Images/ticket-icon.webp';
import imgTicketSmall from '../assets/page9Images/ticket-small.webp';
import imgMedal1      from '../assets/page9Images/medal-1.webp';
import imgMedal2      from '../assets/page9Images/medal-2.webp';
import imgMedal3      from '../assets/page9Images/medal-3.webp';
import imgModalBanner from '../assets/page9Images/modal-banner.webp';



// ye array of players wese likha hai just to check front end................

const generatePlayers = () => [
  { rank: 1,  avatar: null, flag: '🇺🇦', level: 9, name: 'Коля камазаяка 2', tickets: 896960, isMe: false },
  { rank: 2,  avatar: null, flag: null,   level: 7, name: 'zovbi1488',        tickets: 245670, isMe: false },
  { rank: 3,  avatar: null, flag: null,   level: 8, name: 'Ганвест UA',       tickets: 123450, isMe: false },
  { rank: 4,  avatar: null, flag: '🇺🇦', level: 9, name: 'Коля камазаяка 3', tickets: 96960,  isMe: false },
  { rank: 5,  avatar: null, flag: null,   level: 6, name: 'Player005',        tickets: 88420,  isMe: false },
  { rank: 6,  avatar: null, flag: null,   level: 5, name: 'Player006',        tickets: 74300,  isMe: false },
  { rank: 7,  avatar: null, flag: null,   level: 7, name: 'Player007',        tickets: 61200,  isMe: false },
  { rank: 8,  avatar: null, flag: null,   level: 4, name: 'Player008',        tickets: 52100,  isMe: false },
  { rank: 9,  avatar: null, flag: null,   level: 6, name: 'Player009',        tickets: 43800,  isMe: false },
  { rank: 10, avatar: null, flag: null,   level: 5, name: 'Player010',        tickets: 38600,  isMe: false },
  ...Array.from({ length: 40 }, (_, i) => ({
    rank: i + 11, avatar: null, flag: null,
    level: Math.floor(Math.random() * 9) + 1,
    name: `Player${String(i + 11).padStart(3, '0')}`,
    tickets: Math.floor(Math.random() * 30000) + 1000,
    isMe: false,
  })),
];

const ME = { rank: 916, avatar: null, flag: '🇺🇦', level: 9, name: 'Коля камазаяка', tickets: 10, isMe: true };
const players = generatePlayers();

const useCountdown = (initial) => {
  const [time, setTime] = useState(initial);
  useEffect(() => {
    const t = setInterval(() => setTime(p => p > 0 ? p - 1 : 0), 1000);
    return () => clearInterval(t);
  }, []);
  const h = String(Math.floor(time / 3600)).padStart(2, '0');
  const m = String(Math.floor((time % 3600) / 60)).padStart(2, '0');
  const s = String(time % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
};

const RankBadge = ({ rank }) => {
  if (rank === 1) return <img src={imgMedal1} alt="1" style={{ width: 36, height: 36, objectFit: 'contain' }} />;
  if (rank === 2) return <img src={imgMedal2} alt="2" style={{ width: 36, height: 36, objectFit: 'contain' }} />;
  if (rank === 3) return <img src={imgMedal3} alt="3" style={{ width: 36, height: 36, objectFit: 'contain' }} />;
  return <span className="font-black text-white" style={{ fontSize: 16, width: 36, textAlign: 'center', display: 'block' }}>{rank}</span>;
};

const PlayerRow = ({ player, highlight }) => {
  const rowBg =
    player.rank === 1 ? 'linear-gradient(90deg,#2a1a00,#3a2800)' :
    player.rank === 2 ? 'linear-gradient(90deg,#0a1a2a,#102040)' :
    player.rank === 3 ? 'linear-gradient(90deg,#1a1000,#2a1800)' :
    highlight         ? 'linear-gradient(90deg,#1a1a1a,#2a2a2a)' :
                        'linear-gradient(90deg,#111,#1a1a1a)';

  const rowBorder =
    player.rank === 1 ? '#c89000' :
    player.rank === 2 ? '#2060a0' :
    player.rank === 3 ? '#8a5000' :
    highlight         ? '#555'    : '#2a2a2a';

  return (
    <div
      className="flex items-center gap-2 rounded-2xl px-2 py-1.5 shrink-0"
      style={{ background: rowBg, border: `1.5px solid ${rowBorder}`, minHeight: '52px' }}
    >
      <div className="flex items-center justify-center shrink-0" style={{ width: 36 }}>
        <RankBadge rank={player.rank} />
      </div>
      <div
        className="rounded-full overflow-hidden shrink-0 flex items-center justify-center"
        style={{ width: 40, height: 40, background: '#333', border: `2px solid ${rowBorder}` }}
      >
        {player.avatar
          ? <img src={player.avatar} alt={player.name} className="w-full h-full object-cover" />
          : <span style={{ fontSize: 20 }}>👤</span>}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1 flex-wrap">
          {player.flag && <span style={{ fontSize: 14 }}>{player.flag}</span>}
          <span
            className="font-black text-white shrink-0"
            style={{ fontSize: 11, background: '#2a5a2a', border: '1px solid #4a9a20', borderRadius: 99, padding: '1px 5px' }}
          >
            {player.level} lvl
          </span>
          {player.isMe && <span className="font-black text-white" style={{ fontSize: 13 }}>ВЫ</span>}
          <span className="text-white font-semibold truncate" style={{ fontSize: 13 }}>{player.name}</span>
        </div>
      </div>
      <div
        className="flex items-center gap-1 rounded-full px-2 py-1 shrink-0"
        style={{ background: 'linear-gradient(180deg,#5a4a00,#3a3000)', border: '1.5px solid #c89000' }}
      >
        <img src={imgTicketSmall} alt="ticket" style={{ width: 16, height: 16, objectFit: 'contain' }} />
        <span className="font-black text-yellow-300" style={{ fontSize: 13 }}>
          {player.tickets.toLocaleString('ru-RU')}
        </span>
      </div>
    </div>
  );
};





// info modal info button sey jo open hoga 



const TournamentInfoModal = ({ isOpen, onClose }) => {
  const [visible, setVisible]     = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const countdown = useCountdown(3 * 3600);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setAnimateIn(true)));
    } else {
      setAnimateIn(false);
      const t = setTimeout(() => setVisible(false), 350);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  if (!visible) return null;

  return (
    <div
      onClick={onClose}
      className={`fixed inset-0 z-50 flex items-center justify-center px-4
        transition-all duration-300
        ${animateIn ? 'bg-black/70 backdrop-blur-sm' : 'bg-black/0 backdrop-blur-none'}`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-sm flex flex-col rounded-3xl overflow-hidden shadow-2xl
          transition-all duration-300
          ${animateIn ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'}`}
        style={{
          background: 'linear-gradient(180deg,#6a6a6a 0%,#4a4a4a 100%)',
          border: '2px solid #888',
          maxHeight: '88dvh',
          overflowY: 'auto',
        }}
      >
        {/* Close button */}
        <div className="flex justify-end px-4 pt-4 pb-2 shrink-0">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 font-black text-white active:scale-95 transition-transform"
            style={{ background: 'linear-gradient(180deg,#555,#333)', border: '1.5px solid #777', fontSize: 14 }}
          >
            <span style={{ color: '#e03030', fontSize: 16 }}>✕</span>
            Закрыть
          </button>
        </div>

        {/* Banner image */}
        <div className="px-4 shrink-0">
          <div className="rounded-2xl overflow-hidden" style={{ border: '1.5px solid #666' }}>
            <img src={imgModalBanner} alt="tournament" className="w-full object-cover" style={{ height: '210px' }} />
          </div>
        </div>

        {/* Description */}
        <div className="px-5 pt-4 pb-3 shrink-0">
          <p className="text-white font-bold text-center leading-snug" style={{ fontSize: 'clamp(14px,4vw,16px)' }}>
            Ставь билеты и получи шанс стать самым богатым в{' '}
            <span className="font-black">DRUN FAMILY GAME!</span>
          </p>
        </div>

        {/* Countdown */}
        <div className="px-4 pb-2 shrink-0">
          <div
            className="rounded-2xl flex flex-col items-center justify-center py-4"
            style={{ background: 'linear-gradient(180deg,#1a1a1a,#0d0d0d)', border: '2px solid #555' }}
          >
            <p className="font-black text-white uppercase tracking-widest" style={{ fontSize: 13, letterSpacing: '0.2em' }}>ОСТАЛОСЬ</p>
            <p className="font-black text-white" style={{ fontSize: 'clamp(38px,12vw,52px)', letterSpacing: '0.06em', lineHeight: 1.1 }}>
              {countdown}
            </p>
          </div>
        </div>

        {/* Frequency note */}
        <div className="px-5 py-2 shrink-0">
          <p className="text-white font-semibold text-center" style={{ fontSize: 'clamp(13px,3.5vw,15px)' }}>
            Турнир проходит раз в три часа
          </p>
        </div>

        {/* Rules */}
        <div className="px-4 pb-5 shrink-0">
          <div
            className="rounded-2xl px-4 py-4"
            style={{ background: 'linear-gradient(180deg,#555,#3a3a3a)', border: '1.5px solid #666' }}
          >
            <p className="text-white font-bold text-center leading-relaxed" style={{ fontSize: 'clamp(13px,3.5vw,15px)' }}>
              Ставки может сделать каждый, но победит только друн, который поставит больше всех – он и заберет все билеты.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// page ka yahan set start kr rha hon developer bhaiyaaa..................................


const PageNine = () => {
  const navigate   = useNavigate();
  const countdown  = useCountdown(2 * 3600 + 19 * 60 + 54);
  const [showInfo, setShowInfo] = useState(false);

  const heroHeight = Math.round(414 / 2);

  return (
    <div
      className="w-full flex flex-col"
      style={{
        backgroundImage: `url(${pageBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        maxWidth: '430px',
        margin: '0 auto',
        height: '100dvh',
        overflow: 'hidden',
      }}
    >
      {/* HEADER */}
      <div className="flex flex-col items-center pt-2 pb-1 shrink-0" style={{ background: 'linear-gradient(180deg,#111,#000)' }}>
        <span className="font-black text-white uppercase tracking-widest" style={{ fontSize: 'clamp(9px,2.8vw,13px)' }}>DRUN FAMILY</span>
        <div className="flex items-center w-full px-4 my-0.5">
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg,transparent,#888)' }} />
          <span className="font-bold mx-2 text-gray-400 uppercase" style={{ fontSize: 'clamp(7px,1.8vw,9px)', letterSpacing: '0.3em' }}>game</span>
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg,#888,transparent)' }} />
        </div>
      </div>

      {/* SCROLLABLE BODY */}
      <div className="flex-1 overflow-y-auto px-2" style={{ WebkitOverflowScrolling: 'touch', paddingBottom: '140px' }}>

        {/* HERO CARD */}
        <div className="relative rounded-2xl overflow-hidden mt-2" style={{ border: '2px solid #c89000' }}>
          <div className="relative" style={{ height: `${heroHeight}px` }}>
            <img src={imgHeroBanner} alt="hero" className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg,transparent 50%,rgba(0,0,0,0.6) 100%)' }} />

            {/* TOP LEFT: grey pill */}
            <div
            onClick={() => navigate("/shop")}
             className="absolute top-3 left-3 z-20 flex items-center gap-2 rounded-2xl px-3 py-1.5" style={{ background: '#888784' }}>
              <img src={imgTicketIcon} alt="ticket" style={{ width: 30, height: 30, objectFit: 'contain' }} />
              <div className="flex flex-col leading-none">
                <span className="font-bold text-white/80 uppercase" style={{ fontSize: 8, letterSpacing: 1 }}>БИЛЕТЫ</span>
                <span className="font-black text-white" style={{ fontSize: 18 }}>123</span>
              </div>
              <button
                className="flex items-center justify-center rounded-lg font-black text-white ml-1"
                style={{ width: 26, height: 26, background: 'linear-gradient(180deg,#666,#444)', border: '1.5px solid #999', fontSize: 17, lineHeight: 1 }}
              >
                +
              </button>
            </div>

            {/* TOP RIGHT: info button → opens modal */}
            <button
              onClick={() => setShowInfo(true)}
              className="absolute top-3 right-3 z-20 flex items-center justify-center rounded-full font-black text-white active:scale-95 transition-transform"
              style={{ width: 36, height: 36, background: 'rgba(0,0,0,0.45)', border: '2px solid rgba(255,255,255,0.45)', fontSize: 16 }}
            >
              i
            </button>

            {/* BOTTOM: title pill */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-3 z-10">
              <div
                className="px-6 py-2 font-black text-white uppercase"
                style={{
                  fontSize: 'clamp(15px,4.5vw,19px)',
                  letterSpacing: '0.05em',
                  background: 'linear-gradient(180deg,#3a2800,#1a1200)',
                  border: '2px solid #c89000',
                  borderRadius: 99,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.7)',
                }}
              >
                ТУРНИР БИЛЕТОВ
              </div>
            </div>
          </div>
        </div>

        {/* Countdown */}
        <div className="rounded-2xl flex flex-col items-center justify-center py-3 mt-2" style={{ background: 'linear-gradient(180deg,#1a1200,#0a0800)', border: '1.5px solid #c89000' }}>
          <p className="text-white/60 font-black uppercase tracking-widest" style={{ fontSize: 12 }}>ОСТАЛОСЬ</p>
          <p className="font-black text-white" style={{ fontSize: 'clamp(34px,11vw,50px)', letterSpacing: '0.05em', lineHeight: 1.1 }}>{countdown}</p>
        </div>

        {/* Prize fund */}
        <div className="flex items-center justify-center gap-2 rounded-full py-2 mt-2" style={{ background: 'linear-gradient(180deg,#1a1200,#0a0800)', border: '1.5px solid #c89000' }}>
          <span className="text-white/60 font-black uppercase tracking-widest" style={{ fontSize: 11 }}>ПРИЗОВОЙ ФОНД</span>
          <img src={imgTicketSmall} alt="ticket" style={{ width: 18, height: 18, objectFit: 'contain' }} />
          <span className="font-black text-yellow-300" style={{ fontSize: 15 }}>5 769 660</span>
        </div>

        {/* Leaderboard */}
        <div className="flex flex-col gap-1.5 mt-2">
          {players.map((player) => (
            <PlayerRow key={player.rank} player={player} highlight={false} />
          ))}
        </div>
      </div>

      {/* STICKY BOTTOM */}
      <div className="shrink-0 px-2 pt-1.5" style={{ background: 'linear-gradient(180deg,rgba(0,0,0,0.97),#000)', borderTop: '1px solid #2a2a2a' }}>
        <PlayerRow player={ME} highlight />
        <button
          className="w-full mt-1.5 rounded-2xl font-black text-black active:scale-95 transition-transform"
          style={{
            fontSize: 'clamp(20px,6vw,26px)',
            padding: '11px 0',
            background: 'linear-gradient(180deg,#f0c020,#c89000)',
            border: '2px solid #8a6000',
            boxShadow: '0 4px 0 #6a4000',
            fontStyle: 'italic',
            marginBottom: '6px',
          }}
        >
          Сделать ставку
        </button>
      </div>

      {/* INFO MODAL */}
      <TournamentInfoModal isOpen={showInfo} onClose={() => setShowInfo(false)} />
    </div>
  );
};

export default PageNine;