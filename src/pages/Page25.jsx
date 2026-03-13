import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { patchUser } from '../redux/gameSlice';
import pageBg     from '../assets/page1bg.webp';
import usdtIcon   from '../assets/page23Images/usdt-icon.webp';
import fishkiIcon from '../assets/page22Images/fa-icon.webp';
import planeImg   from '../assets/page25Images/plane.webp';
import mascotImg  from '../assets/page25Images/mascot.webp';

/* ══════════════════════════════════════
   CONSTANTS
══════════════════════════════════════ */
const MAX_USDT_BET  = 50;
const MAX_CHIPS_BET = 2000;
const POOL_SCALE    = 10000;
const WAITING_SECS  = 5;

function historyStyle(v) {
  if (v >= 25) return { bg: 'bg-[#c8a000]', text: 'text-white' };
  if (v >= 10) return { bg: 'bg-[#1a8a10]', text: 'text-white' };
  if (v >= 2)  return { bg: 'bg-[#1060c8]', text: 'text-white' };
  return             { bg: 'bg-[#555]',      text: 'text-white' };
}

function clamp(val, min, max) { return Math.min(Math.max(val, min), max); }

/* ══════════════════════════════════════
   TOGGLE
══════════════════════════════════════ */
const Toggle = ({ value, onChange }) => (
  <div
    onClick={() => onChange(!value)}
    className="relative shrink-0 w-9 h-5 rounded-full cursor-pointer transition-colors duration-200"
    style={{ background: value ? '#4aaa18' : '#555' }}
  >
    <div
      className="absolute top-[3px] w-3.5 h-3.5 rounded-full bg-white transition-all duration-200"
      style={{ left: value ? 18 : 3 }}
    />
  </div>
);

/* ══════════════════════════════════════
   BET PANEL
══════════════════════════════════════ */
const BetPanel = ({
  currency, bet, setBet,
  autoStake, setAutoStake,
  autoCashout, setAutoCashout,
  autoCashoutVal, setAutoCashoutVal,
  onAction, actionLabel, betPlaced, phase,
}) => {
  const maxBet    = currency === 'USDT' ? MAX_USDT_BET : MAX_CHIPS_BET;
  const step      = currency === 'USDT' ? 0.1 : 1;
  const quickBtns = currency === 'USDT' ? [0.1, 0.5, 1, 5] : [1, 5, 20, 100];
  const adjustBet = (delta) => setBet(b => clamp(+(b + delta).toFixed(2), step, maxBet));
  const isCashout = actionLabel === 'Вывести';
  const locked    = phase === 'flying' && betPlaced;

  return (
    <div className="rounded-xl border border-[#3a3a3a] p-2.5 mb-2" style={{ background: 'linear-gradient(180deg,#2a2a2a,#1a1a1a)' }}>
      <div className="flex items-center gap-2 mb-2">
        <div className="flex items-center gap-1.5 flex-1">
          <span className="text-[#aaa] text-[10px] font-bold">Автоставка</span>
          <Toggle value={autoStake} onChange={setAutoStake} />
        </div>
        <div className="flex items-center gap-1.5 flex-1">
          <span className="text-[#aaa] text-[10px] font-bold">Автовывод</span>
          <Toggle value={autoCashout} onChange={setAutoCashout} />
          <input
            type="number"
            value={autoCashoutVal}
            onChange={e => setAutoCashoutVal(e.target.value)}
            className="w-11 bg-[#333] border border-[#555] rounded-md text-white font-bold text-[11px] text-center py-0.5 px-1 outline-none"
          />
          <span className="text-[#aaa] text-[10px]">x</span>
        </div>
      </div>

      <div className="flex gap-2 items-stretch">
        <div className="flex-1">
          <div className="flex items-center gap-1.5 mb-1.5">
            <button onClick={() => adjustBet(-step)} disabled={locked}
              className="w-7 h-7 rounded-md bg-[#3a3a3a] border border-[#555] text-white font-black text-[16px] flex items-center justify-center cursor-pointer disabled:opacity-40">−</button>
            <span className="flex-1 text-center text-white font-black" style={{ fontSize: 'clamp(16px,5vw,22px)' }}>
              {currency === 'USDT' ? bet.toFixed(2) : Math.round(bet)}
            </span>
            <button onClick={() => adjustBet(step)} disabled={locked}
              className="w-7 h-7 rounded-md bg-[#3a3a3a] border border-[#555] text-white font-black text-[16px] flex items-center justify-center cursor-pointer disabled:opacity-40">+</button>
          </div>
          <div className="grid grid-cols-2 gap-1">
            {quickBtns.map((v, i) => (
              <button key={v} onClick={() => !locked && setBet(clamp(v, step, maxBet))} disabled={locked}
                className="rounded-full py-1 font-bold text-[12px] text-white border transition-opacity disabled:opacity-40 cursor-pointer"
                style={{
                  background: i === quickBtns.length - 1 ? 'linear-gradient(180deg,#4aaa18,#2a7008)' : 'linear-gradient(180deg,#3a3a3a,#2a2a2a)',
                  borderColor: i === quickBtns.length - 1 ? '#6ade30' : '#555',
                }}>{v}</button>
            ))}
          </div>
        </div>

        <button
          onClick={onAction}
          disabled={phase === 'crashed'}
          className="w-[48%] rounded-xl text-white font-black flex flex-col items-center justify-center cursor-pointer leading-tight border-2 shadow-[0_3px_12px_rgba(0,0,0,0.5)] disabled:opacity-40 disabled:cursor-default transition-all"
          style={{
            fontSize: 'clamp(18px,5.5vw,26px)',
            background: isCashout ? 'linear-gradient(180deg,#e8a020,#b06010)' : 'linear-gradient(180deg,#3aaa10,#1a7008)',
            borderColor: isCashout ? '#f0c030' : '#5ade20',
          }}
        >
          <span>{actionLabel}</span>
          <span className="font-bold opacity-90" style={{ fontSize: 'clamp(10px,3vw,13px)' }}>
            {currency === 'USDT' ? `${bet.toFixed(2)} USDT` : `${Math.round(bet)} Фишек`}
          </span>
        </button>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════
   GAME CANVAS — plane tracks red line tip
══════════════════════════════════════ */
const CANVAS_W = 380;
const CANVAS_H = 200;
// Line start/end in canvas-pixel space (same as the draw logic)
const LINE_START = { x: CANVAS_W * 0.05, y: CANVAS_H * 0.92 };
const LINE_END   = { x: CANVAS_W * 0.95, y: CANVAS_H * 0.08 };

const GameCanvas = ({ multiplier, phase, countdown, progress }) => {
  const canvasRef = useRef(null);
  const animRef   = useRef(null);
  const crashed   = phase === 'crashed';
  const isFlying  = phase === 'flying';
  const waiting   = phase === 'waiting';

  // Draw the red line + filled area on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;

    cancelAnimationFrame(animRef.current);

    const draw = (prog) => {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, W, H);
      if (waiting || prog <= 0) return;

      const p      = Math.min(prog, 1);
      const startX = W * 0.05, startY = H * 0.92;
      const endX   = W * 0.95, endY   = H * 0.08;
      const curX   = startX + (endX - startX) * p;
      const curY   = startY + (endY - startY) * p;

      // filled area
      const grad = ctx.createLinearGradient(startX, startY, curX, curY);
      grad.addColorStop(0, crashed ? 'rgba(180,20,20,0.9)' : 'rgba(200,20,20,0.85)');
      grad.addColorStop(1, crashed ? 'rgba(80,0,0,0.4)'   : 'rgba(255,60,0,0.3)');
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(curX, curY);
      ctx.lineTo(curX, startY);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();

      // red line
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(curX, curY);
      ctx.strokeStyle = crashed ? '#ff2020' : '#ff4020';
      ctx.lineWidth   = 3;
      ctx.shadowColor = crashed ? '#ff0000' : '#ff6040';
      ctx.shadowBlur  = 12;
      ctx.stroke();
      ctx.shadowBlur  = 0;
    };

    draw(progress);
  }, [progress, phase]);

  // Plane position = tip of the red line, converted to % of container
  const prog     = Math.min(progress, 1);
  const tipX_px  = LINE_START.x + (LINE_END.x - LINE_START.x) * prog;
  const tipY_px  = LINE_START.y + (LINE_END.y - LINE_START.y) * prog;
  // Convert to percentage of canvas size for CSS positioning
  const planeLeft = `${(tipX_px / CANVAS_W) * 100}%`;
  const planeTop  = `${(tipY_px / CANVAS_H) * 100}%`;

  return (
    <div className="relative rounded-xl overflow-hidden mb-2">
      <canvas ref={canvasRef} width={CANVAS_W} height={CANVAS_H} className="w-full block rounded-xl" />

      {/* ── Plane — sits exactly at the line tip, offset so nose points at the tip ── */}
      {isFlying && progress > 0 && (
        <img
          src={planeImg}
          alt=""
          className="absolute pointer-events-none"
          style={{
            width: 52,
            height: 'auto',
            left: planeLeft,
            top: planeTop,
            // Shift so the plane's nose (bottom-left ≈ 80% left, 80% top of image) sits on the tip
            transform: 'translate(-80%, -80%) rotate(-35deg)',
            filter: 'drop-shadow(0 0 8px rgba(255,100,0,0.9))',
            transition: 'left 0.1s linear, top 0.1s linear',
            zIndex: 5,
          }}
        />
      )}

      {/* ── WAITING overlay ── */}
      {waiting && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-xl bg-black/70">
          <span className="text-white/60 font-bold text-[13px] tracking-widest uppercase">
            Ожидание ставок...
          </span>
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="absolute inset-0 -rotate-90" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
              <circle
                cx="32" cy="32" r="28"
                fill="none" stroke="#f0c020" strokeWidth="4" strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 28}`}
                strokeDashoffset={`${2 * Math.PI * 28 * (1 - countdown / WAITING_SECS)}`}
                style={{ transition: 'stroke-dashoffset 0.9s linear' }}
              />
            </svg>
            <span className="text-[#f0c020] font-black text-[22px] leading-none">{countdown}</span>
          </div>
          <span className="text-white/40 text-[10px] font-bold">Принимаем ставки</span>
        </div>
      )}

      {/* ── Multiplier overlay (flying + crashed) ── */}
      {(isFlying || crashed) && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span
            className="font-black leading-none"
            style={{
              fontSize: 'clamp(36px,12vw,60px)',
              color: crashed ? '#ff4040' : '#fff',
              textShadow: crashed
                ? '0 0 30px #ff0000'
                : '0 0 40px rgba(255,220,100,0.9), 0 2px 0 rgba(0,0,0,0.8)',
            }}
          >
            {multiplier.toFixed(2)}x
          </span>
        </div>
      )}

      {/* ── Crash overlay ── */}
      {crashed && (
        <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-[rgba(180,0,0,0.25)]">
          <span className="text-[#ff4040] font-black text-[28px]" style={{ textShadow: '0 0 20px #ff0000' }}>
            УЛЕТЕЛ! 💥
          </span>
        </div>
      )}
    </div>
  );
};

/* ══════════════════════════════════════
   PAGE 25
══════════════════════════════════════ */
const Page25 = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user     = useSelector(s => s.game.user);

  const usdt  = user?.usdt_balance ?? 0;
  const chips = user?.chips ?? user?.fishki_balance ?? 0;

  /* ── game state ── */
  const [phase,       setPhase]       = useState('waiting');
  const [countdown,   setCountdown]   = useState(WAITING_SECS);
  const [progress,    setProgress]    = useState(0);   // 0→1 canvas line progress
  const [history,     setHistory]     = useState([52.1, 1.27, 10.6, 1.69, 1.97, 2.3]);
  const [multiplier,  setMultiplier]  = useState(1.00);
  const [showHistory, setShowHistory] = useState(false);
  const [chipsPool,   setChipsPool]   = useState(0);

  /* ── USDT panel ── */
  const [usdtBet,       setUsdtBet]       = useState(1.00);
  const [usdtAutoStake, setUsdtAutoStake] = useState(false);
  const [usdtAutoCash,  setUsdtAutoCash]  = useState(false);
  const [usdtCashVal,   setUsdtCashVal]   = useState('2.50');
  const [usdtPlaced,    setUsdtPlaced]    = useState(false);

  /* ── Chips panel ── */
  const [chipsBet,       setChipsBet]       = useState(100);
  const [chipsAutoStake, setChipsAutoStake] = useState(false);
  const [chipsAutoCash,  setChipsAutoCash]  = useState(false);
  const [chipsCashVal,   setChipsCashVal]   = useState('2.50');
  const [chipsPlaced,    setChipsPlaced]    = useState(false);

  const tickRef      = useRef(null);
  const crashValRef  = useRef(null);
  const countdownRef = useRef(null);
  const rafRef       = useRef(null);
  const progRef      = useRef(0);   // live progress ref for rAF loop

  /* ── Compute crash point ── */
  const computeCrash = (pool) => {
    const reduction = Math.floor(pool / POOL_SCALE) * 0.5;
    const maxMult   = Math.max(2.0, 22 - reduction);
    return +(1.05 + Math.random() * (maxMult - 1.05)).toFixed(2);
  };

  /* ── startFlying — rAF drives both progress & multiplier ── */
  const startFlying = useCallback((pool) => {
    setPhase('flying');
    setMultiplier(1.00);
    setProgress(0);
    progRef.current = 0;

    const crashAt = computeCrash(pool);
    crashValRef.current = crashAt;

    // rAF loop for smooth progress (canvas line + plane)
    const SPEED = 0.003; // progress units per frame (~0.3s to reach 10%)
    const animate = () => {
      progRef.current = Math.min(progRef.current + SPEED, 1);
      setProgress(progRef.current);
      if (progRef.current < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    // Separate interval for multiplier (game logic)
    tickRef.current = setInterval(() => {
      setMultiplier(prev => {
        const next = +(prev * 1.012).toFixed(2);
        if (next >= crashValRef.current) {
          clearInterval(tickRef.current);
          cancelAnimationFrame(rafRef.current);
          setPhase('crashed');
          setHistory(h => [crashValRef.current, ...h].slice(0, 25));
          setUsdtPlaced(false);
          setChipsPlaced(false);
          return crashValRef.current;
        }
        return next;
      });
    }, 100);
  }, []);

  /* ── startWaiting ── */
  const startWaiting = useCallback(() => {
    setPhase('waiting');
    setCountdown(WAITING_SECS);
    setMultiplier(1.00);
    setProgress(0);
    progRef.current = 0;
    setChipsPool(0);

    let secs = WAITING_SECS;
    countdownRef.current = setInterval(() => {
      secs -= 1;
      setCountdown(secs);
      if (secs <= 0) {
        clearInterval(countdownRef.current);
        // read current pool from state via ref pattern
        setChipsPool(pool => { startFlying(pool); return pool; });
      }
    }, 1000);
  }, [startFlying]);

  /* ── crashed → back to waiting ── */
  useEffect(() => {
    if (phase !== 'crashed') return;
    const t = setTimeout(startWaiting, 2500);
    return () => clearTimeout(t);
  }, [phase]);

  /* ── Mount ── */
  useEffect(() => {
    startWaiting();
    return () => {
      clearInterval(tickRef.current);
      clearInterval(countdownRef.current);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  /* ── USDT action ── */
  const handleUsdtAction = () => {
    if (phase === 'flying' && usdtPlaced) {
      const winnings = +(usdtBet * multiplier).toFixed(2);
      dispatch(patchUser({ usdt_balance: +(usdt + winnings).toFixed(2) }));
      setUsdtPlaced(false);
    } else if (!usdtPlaced && phase !== 'crashed') {
      if (usdt < usdtBet) return;
      dispatch(patchUser({ usdt_balance: +(usdt - usdtBet).toFixed(2) }));
      setUsdtPlaced(true);
    }
  };

  /* ── Chips action ── */
  const handleChipsAction = () => {
    if (phase === 'flying' && chipsPlaced) {
      const winnings = Math.floor(chipsBet * multiplier);
      dispatch(patchUser({ chips: chips + winnings }));
      setChipsPlaced(false);
    } else if (!chipsPlaced && phase !== 'crashed') {
      if (chips < chipsBet) return;
      dispatch(patchUser({ chips: chips - chipsBet }));
      setChipsPool(p => p + chipsBet);
      setChipsPlaced(true);
    }
  };

  const usdtLabel  = phase === 'flying' && usdtPlaced  ? 'Вывести' : 'Ставка';
  const chipsLabel = phase === 'flying' && chipsPlaced ? 'Вывести' : 'Ставка';

  return (
    <div
      className="relative max-w-[430px] mx-auto h-[100dvh] overflow-hidden flex flex-col"
      style={{
        backgroundImage: `url(${pageBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        fontFamily: "'Nunito','Segoe UI',sans-serif",
        background: '#0d0d0d',
      }}
    >
      {/* ── HEADER ── */}
      <div className="shrink-0 flex flex-col items-center pt-1.5 pb-1" style={{ background: 'linear-gradient(180deg,#c8c8c8,#a0a0a0)' }}>
        <span className="font-black text-black uppercase tracking-[0.2em] text-[11px]">DRUN FAMILY</span>
        <div className="flex items-center w-full px-4 my-0.5">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-black" />
          <span className="font-bold mx-2 uppercase text-black text-[8px] tracking-[0.3em]">GAME</span>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-black" />
        </div>
        <div className="rounded-full px-5 py-1 my-1 border border-[#888]" style={{ background: 'linear-gradient(180deg,#e0e0e0,#b0b0b0)' }}>
          <span className="font-black text-[#cc1010]" style={{ fontSize: 'clamp(14px,4.5vw,20px)' }}>Самолетик </span>
          <span className="font-black text-[#333]"    style={{ fontSize: 'clamp(14px,4.5vw,20px)' }}>Бурмалдотик</span>
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="flex-1 overflow-y-auto overscroll-contain px-2 pt-1.5 pb-4" style={{ background: '#0d0d0d', WebkitOverflowScrolling: 'touch' }}>

        {/* Balance */}
        <div className="flex gap-2 mb-2">
          <div className="flex-1 flex items-center gap-1.5 rounded-full px-2.5 py-1.5 border border-[#d4a017]" style={{ background: 'linear-gradient(180deg,#b8860b,#7a5500)' }}>
            <img src={usdtIcon} alt="" className="w-6 h-6 rounded-full object-cover shrink-0" />
            <div>
              <div className="text-white/60 text-[8px] font-bold">USDT</div>
              <div className="text-white font-black leading-none" style={{ fontSize: 'clamp(13px,4vw,18px)' }}>
                {typeof usdt === 'number' ? usdt.toFixed(2) : usdt}
              </div>
            </div>
          </div>
          <div className="flex-1 flex items-center gap-1.5 rounded-full px-2.5 py-1.5 border border-[#4aaa18]" style={{ background: 'linear-gradient(180deg,#2a7a10,#1a5008)' }}>
            <img src={fishkiIcon} alt="" className="w-6 h-6 rounded-full object-cover shrink-0" />
            <div className="flex-1">
              <div className="text-white/60 text-[8px] font-bold">ФИШКИ</div>
              <div className="text-white font-black leading-none" style={{ fontSize: 'clamp(13px,4vw,18px)' }}>
                {typeof chips === 'number' ? chips.toLocaleString() : chips}
              </div>
            </div>
            <button onClick={() => navigate('/page21')} className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-[17px] text-white shrink-0 border border-[#7ade30] cursor-pointer" style={{ background: 'linear-gradient(180deg,#5aba20,#2a8008)' }}>+</button>
          </div>
        </div>

        {/* History row */}
        <div className="flex gap-1 mb-2 items-center overflow-x-auto">
          {history.slice(0, 6).map((v, i) => {
            const s = historyStyle(v);
            return <div key={i} className={`${s.bg} ${s.text} rounded-md px-2 py-0.5 font-black text-[12px] shrink-0 min-w-[42px] text-center`}>x{v}</div>;
          })}
          <button onClick={() => setShowHistory(s => !s)} className="bg-[#333] rounded-md px-2 py-0.5 text-[#aaa] font-black text-[13px] shrink-0 cursor-pointer">•••</button>
        </div>

        {/* History popup */}
        {showHistory && (
          <div className="bg-[#1a1a1a] rounded-xl p-2.5 border border-[#333] mb-2">
            <p className="text-[#aaa] text-[11px] font-bold text-center mb-1.5 m-0">Последние 25 коэффициентов</p>
            <div className="flex flex-wrap gap-1">
              {history.map((v, i) => {
                const s = historyStyle(v);
                return <div key={i} className={`${s.bg} ${s.text} rounded-md px-2 py-0.5 font-black text-[11px]`}>x{v}</div>;
              })}
            </div>
          </div>
        )}

        {/* Game canvas */}
        <GameCanvas multiplier={multiplier} phase={phase} countdown={countdown} progress={progress} />

        {/* Chips pool */}
        {chipsPool > 0 && (
          <div className="flex items-center justify-between mb-1.5 px-1">
            <span className="text-white/40 text-[9px] font-bold uppercase tracking-wide">Пул фишек</span>
            <span className="text-[#f0c020] font-black text-[10px]">
              {chipsPool.toLocaleString()} → макс x{Math.max(2, 22 - Math.floor(chipsPool / POOL_SCALE) * 0.5).toFixed(1)}
            </span>
          </div>
        )}

        {/* Bet panels */}
        <BetPanel
          currency="USDT" bet={usdtBet} setBet={setUsdtBet}
          autoStake={usdtAutoStake} setAutoStake={setUsdtAutoStake}
          autoCashout={usdtAutoCash} setAutoCashout={setUsdtAutoCash}
          autoCashoutVal={usdtCashVal} setAutoCashoutVal={setUsdtCashVal}
          onAction={handleUsdtAction} actionLabel={usdtLabel}
          betPlaced={usdtPlaced} phase={phase}
        />
        <BetPanel
          currency="CHIPS" bet={chipsBet} setBet={setChipsBet}
          autoStake={chipsAutoStake} setAutoStake={setChipsAutoStake}
          autoCashout={chipsAutoCash} setAutoCashout={setChipsAutoCash}
          autoCashoutVal={chipsCashVal} setAutoCashoutVal={setChipsCashVal}
          onAction={handleChipsAction} actionLabel={chipsLabel}
          betPlaced={chipsPlaced} phase={phase}
        />

        {/* Mascot */}
        <div className="flex items-center gap-2 px-1 pt-1">
          <img src={mascotImg} alt="" className="w-11 h-auto object-contain" />
          <span className="text-white font-bold text-[13px]">- Привет Артур!</span>
        </div>
      </div>
    </div>
  );
};

export default Page25;