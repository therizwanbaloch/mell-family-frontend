import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { patchUser } from '../redux/gameSlice';

// Assets
import usdtIcon   from '../assets/page23Images/usdt-icon.webp';
import fishkiIcon from '../assets/page25Images/OaIcon.webp';
import planeImg   from '../assets/page25Images/plane.webp';
import mascotImg  from '../assets/page25Images/mascot.webp';
import logoDark   from '../assets/logo-darkk.webp';

const MAX_USDT_BET  = 50;
const MAX_CHIPS_BET = 2000;
const WAITING_SECS  = 5;
const PLANE_CAP     = 0.55;

/* ── HELPERS ── */
function historyStyle(v) {
  if (v >= 25) return { bg: 'bg-[#c8a000]', text: 'text-white' };
  if (v >= 10) return { bg: 'bg-[#1a8a10]', text: 'text-white' };
  if (v >= 2)  return { bg: 'bg-[#1060c8]', text: 'text-white' };
  return             { bg: 'bg-[#555]',      text: 'text-white' };
}

function clamp(val, min, max) { return Math.min(Math.max(val, min), max); }
function multToProgress(mult) { return Math.min((Math.log(mult) / Math.log(22)), 1); }

/* ── TOGGLE ── */
const Toggle = ({ value, onChange }) => (
  <div
    onClick={() => onChange(!value)}
    className="relative shrink-0 w-9 h-[18px] rounded-full cursor-pointer transition-colors duration-200"
    style={{ background: value ? '#4aaa18' : '#555' }}
  >
    <div
      className="absolute top-[2px] w-[14px] h-[14px] rounded-full bg-white transition-all duration-200"
      style={{ left: value ? 18 : 2 }}
    />
  </div>
);

/* ── BET PANEL ── */
const BetPanel = ({
  currency, bet, setBet,
  autoStake, setAutoStake,
  autoCashout, setAutoCashout,
  autoCashoutVal, setAutoCashoutVal,
  onAction, actionLabel, betPlaced, phase, multiplier,
}) => {
  const maxBet    = currency === 'USDT' ? MAX_USDT_BET : MAX_CHIPS_BET;
  const step      = currency === 'USDT' ? 0.1 : 1;
  const quickBtns = currency === 'USDT' ? [0.1, 0.5, 1, 5] : [1, 5, 20, 100];
  const adjustBet = (delta) => setBet(b => clamp(+(b + delta).toFixed(2), step, maxBet));

  const isCashout = actionLabel === 'Вывести';
  const isCancel  = actionLabel === 'Отменить';
  const locked    = betPlaced;

  const isFlying     = phase === 'flying';
  const showPayout   = isFlying && betPlaced;
  const payoutUsdt   = showPayout ? +(bet * multiplier).toFixed(2) : null;
  const payoutChips  = showPayout ? Math.floor(bet * multiplier) : null;

  const btnBackground = isCashout
    ? 'linear-gradient(180deg,#e8a020,#b06010)'
    : isCancel
      ? 'linear-gradient(180deg,#cc2020,#8a0808)'
      : 'linear-gradient(180deg,#3aaa10,#1a7008)';
  const btnBorder = isCashout ? '#f0c030' : isCancel ? '#ff4040' : '#5ade20';

  return (
    <div className="rounded-lg border border-[#3a3a3a] px-2.5 py-2"
      style={{ background: 'linear-gradient(180deg,#2a2a2a,#1a1a1a)' }}>

      <div className="flex items-center gap-2 mb-1.5">
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
            className="w-10 bg-[#333] border border-[#555] rounded text-white font-bold text-[10px] text-center py-0.5 px-1 outline-none"
          />
          <span className="text-[#aaa] text-[10px]">x</span>
        </div>
      </div>

      <div className="flex gap-2 items-stretch h-14">
        <div className="flex-1 flex flex-col justify-between">
          <div className="flex items-center gap-1.5">
            <button onClick={() => adjustBet(-step)} disabled={locked}
              className="w-7 h-7 rounded bg-[#3a3a3a] border border-[#555] text-white font-black text-[15px] disabled:opacity-40">−</button>
            <span className="flex-1 text-center font-black text-[15px] text-white">
              {currency === 'USDT' ? bet.toFixed(2) : Math.round(bet)}
            </span>
            <button onClick={() => adjustBet(step)} disabled={locked}
              className="w-7 h-7 rounded bg-[#3a3a3a] border border-[#555] text-white font-black text-[15px] disabled:opacity-40">+</button>
          </div>
          <div className="grid grid-cols-4 gap-1">
            {quickBtns.map((v) => (
              <button key={v} onClick={() => !locked && setBet(v)} disabled={locked}
                className="rounded-full py-[2px] font-bold text-[9px] text-white border border-[#555] bg-[#3a3a3a] disabled:opacity-40">{v}</button>
            ))}
          </div>
        </div>

        <button
          onClick={onAction}
          disabled={phase === 'crashed' || (phase === 'flying' && !betPlaced)}
          className="w-[42%] rounded-lg text-white font-black flex flex-col items-center justify-center border-2 shadow-lg disabled:opacity-40 transition-all"
          style={{ background: btnBackground, borderColor: btnBorder }}
        >
          <span className="text-[16px]">{actionLabel}</span>
          {!isCancel && (
            <span className="font-bold opacity-90 text-[9px]">
              {showPayout
                ? currency === 'USDT' ? `→ ${payoutUsdt} USDT` : `→ ${payoutChips?.toLocaleString()} Ф`
                : currency === 'USDT' ? `${bet.toFixed(2)} USDT` : `${Math.round(bet)} Ф`
              }
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

/* ── GAME CANVAS ── */
const GameCanvas = ({ multiplier, phase, countdown }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const crashed   = phase === 'crashed';
  const isFlying  = phase === 'flying';
  const waiting   = phase === 'waiting';

  const lineProgress  = isFlying || crashed ? multToProgress(multiplier) : 0;
  const planeProgress = Math.min(lineProgress, PLANE_CAP);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width = containerRef.current.clientWidth;
    const H = canvas.height = containerRef.current.clientHeight;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, W, H);
    if (waiting || planeProgress <= 0) return;

    const startX = W * 0.05, startY = H * 0.92;
    const endX   = W * 0.95, endY   = H * 0.08;
    const curX   = startX + (endX - startX) * planeProgress;
    const curY   = startY + (endY - startY) * planeProgress;

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

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(curX, curY);
    ctx.strokeStyle = crashed ? '#ff2020' : '#ff4020';
    ctx.lineWidth   = 3;
    ctx.stroke();
  }, [multiplier, phase, planeProgress, waiting, crashed]);

  return (
    <div ref={containerRef} className="relative rounded-lg overflow-hidden flex-grow min-h-[180px] bg-[#0a0a0a] border border-[#222]">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      {isFlying && planeProgress > 0 && (
        <img src={planeImg} alt="" className="absolute pointer-events-none"
          style={{
            width: 46, left: `${(0.05 + 0.9 * planeProgress) * 100}%`, top: `${(0.92 - 0.84 * planeProgress) * 100}%`,
            transform: 'translate(-80%, -80%) rotate(-35deg)',
            zIndex: 5, transition: 'all 0.08s linear'
          }}
        />
      )}
      {waiting && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-black/70">
          <span className="text-white/60 font-bold text-[10px] tracking-widest uppercase">Ожидание ставок...</span>
          <div className="relative w-12 h-12 flex items-center justify-center">
            <svg className="absolute inset-0 -rotate-90" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
              <circle cx="32" cy="32" r="28" fill="none" stroke="#f0c020" strokeWidth="4" strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 28}`}
                strokeDashoffset={`${2 * Math.PI * 28 * (1 - countdown / WAITING_SECS)}`}
              />
            </svg>
            <span className="text-[#f0c020] font-black text-[18px]">{countdown}</span>
          </div>
        </div>
      )}
      {(isFlying || crashed) && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="font-black text-[40px] md:text-[50px]"
            style={{ 
                color: crashed ? '#ff4040' : '#fff',
                textShadow: crashed ? '0 0 20px #ff0000' : '0 0 30px rgba(255,220,100,0.9)'
            }}
          >{multiplier.toFixed(2)}x</span>
        </div>
      )}
      {crashed && (
        <div className="absolute inset-0 flex items-center justify-center bg-[rgba(180,0,0,0.15)]">
           <span className="text-[#ff4040] font-black text-[22px]">УЛЕТЕЛ! 💥</span>
        </div>
      )}
    </div>
  );
};

/* ── PAGE 25 ── */
const Page25 = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user     = useSelector(s => s.game.user);

  const usdt  = user?.usdt_balance ?? 0;
  const chips = user?.chips ?? user?.fishki_balance ?? 0;

  const [phase, setPhase]           = useState('waiting');
  const [countdown, setCountdown]   = useState(WAITING_SECS);
  const [history, setHistory]       = useState([1.27, 10.6, 1.69, 1.97, 2.3, 5.0, 1.1]);
  const [multiplier, setMultiplier] = useState(1.00);

  const [usdtBet, setUsdtBet]             = useState(1.00);
  const [usdtAutoStake, setUsdtAutoStake] = useState(false);
  const [usdtAutoCash, setUsdtAutoCash]   = useState(false);
  const [usdtCashVal, setUsdtCashVal]     = useState('2.50');
  const [usdtPlaced, setUsdtPlaced]       = useState(false);

  const [chipsBet, setChipsBet]             = useState(100);
  const [chipsAutoStake, setChipsAutoStake] = useState(false);
  const [chipsAutoCash, setChipsAutoCash]   = useState(false);
  const [chipsCashVal, setChipsCashVal]     = useState('2.50');
  const [chipsPlaced, setChipsPlaced]       = useState(false);

  // LOGIC REFS (Crucial for intervals)
  const usdtBetRef = useRef(usdtBet);
  const chipsBetRef = useRef(chipsBet);
  const usdtCashRef = useRef(usdtCashVal);
  const chipsCashRef = useRef(chipsCashVal);
  const usdtAutoStakeRef = useRef(usdtAutoStake);
  const chipsAutoStakeRef = useRef(chipsAutoStake);
  const usdtAutoCashRef = useRef(usdtAutoCash);
  const chipsAutoCashRef = useRef(chipsAutoCash);
  const usdtPlacedRef = useRef(usdtPlaced);
  const chipsPlacedRef = useRef(chipsPlaced);
  
  const tickRef = useRef(null);
  const crashValRef = useRef(null);
  const countdownRef = useRef(null);

  useEffect(() => { usdtBetRef.current = usdtBet; }, [usdtBet]);
  useEffect(() => { chipsBetRef.current = chipsBet; }, [chipsBet]);
  useEffect(() => { usdtCashRef.current = usdtCashVal; }, [usdtCashVal]);
  useEffect(() => { chipsCashRef.current = chipsCashVal; }, [chipsCashVal]);
  useEffect(() => { usdtAutoStakeRef.current = usdtAutoStake; }, [usdtAutoStake]);
  useEffect(() => { chipsAutoStakeRef.current = chipsAutoStake; }, [chipsAutoStake]);
  useEffect(() => { usdtAutoCashRef.current = usdtAutoCash; }, [usdtAutoCash]);
  useEffect(() => { chipsAutoCashRef.current = chipsAutoCash; }, [chipsAutoCash]);
  useEffect(() => { usdtPlacedRef.current = usdtPlaced; }, [usdtPlaced]);
  useEffect(() => { chipsPlacedRef.current = chipsPlaced; }, [chipsPlaced]);

  const handleUsdtAction = useCallback(() => {
    if (phase === 'flying' && usdtPlacedRef.current) {
      const win = +(usdtBetRef.current * multiplier).toFixed(2);
      dispatch(patchUser({ usdt_balance: +(usdt + win).toFixed(2) }));
      setUsdtPlaced(false);
    } else if (phase === 'waiting' && usdtPlacedRef.current) {
      dispatch(patchUser({ usdt_balance: +(usdt + usdtBetRef.current).toFixed(2) }));
      setUsdtPlaced(false);
    } else if (!usdtPlacedRef.current && phase !== 'crashed' && usdt >= usdtBetRef.current) {
      dispatch(patchUser({ usdt_balance: +(usdt - usdtBetRef.current).toFixed(2) }));
      setUsdtPlaced(true);
    }
  }, [phase, usdt, multiplier, dispatch]);

  const handleChipsAction = useCallback(() => {
    if (phase === 'flying' && chipsPlacedRef.current) {
      const win = Math.floor(chipsBetRef.current * multiplier);
      dispatch(patchUser({ chips: chips + win }));
      setChipsPlaced(false);
    } else if (phase === 'waiting' && chipsPlacedRef.current) {
      dispatch(patchUser({ chips: chips + chipsBetRef.current }));
      setChipsPlaced(false);
    } else if (!chipsPlacedRef.current && phase !== 'crashed' && chips >= chipsBetRef.current) {
      dispatch(patchUser({ chips: chips - chipsBetRef.current }));
      setChipsPlaced(true);
    }
  }, [phase, chips, multiplier, dispatch]);

  const startFlying = useCallback(() => {
    setPhase('flying');
    setMultiplier(1.00);
    crashValRef.current = +(1.05 + Math.random() * 10).toFixed(2);
    tickRef.current = setInterval(() => {
      setMultiplier(prev => {
        const next = +(prev * 1.012).toFixed(2);
        
        // Auto Cashout Checks
        if (usdtPlacedRef.current && usdtAutoCashRef.current && next >= parseFloat(usdtCashRef.current)) {
            handleUsdtAction();
        }
        if (chipsPlacedRef.current && chipsAutoCashRef.current && next >= parseFloat(chipsCashRef.current)) {
            handleChipsAction();
        }

        if (next >= crashValRef.current) {
          clearInterval(tickRef.current);
          setPhase('crashed');
          setHistory(h => [crashValRef.current, ...h].slice(0, 10));
          setUsdtPlaced(false); setChipsPlaced(false);
          return crashValRef.current;
        }
        return next;
      });
    }, 100);
  }, [handleUsdtAction, handleChipsAction]);

  const startWaiting = useCallback(() => {
    setPhase('waiting'); 
    setCountdown(WAITING_SECS);
    
    // Auto Stake Logic
    if (usdtAutoStakeRef.current && !usdtPlacedRef.current) handleUsdtAction();
    if (chipsAutoStakeRef.current && !chipsPlacedRef.current) handleChipsAction();

    let secs = WAITING_SECS;
    countdownRef.current = setInterval(() => {
      secs -= 1; setCountdown(secs);
      if (secs <= 0) {
        clearInterval(countdownRef.current);
        startFlying();
      }
    }, 1000);
  }, [startFlying, handleUsdtAction, handleChipsAction]);

  useEffect(() => {
    if (phase === 'crashed') setTimeout(startWaiting, 2500);
  }, [phase, startWaiting]);

  useEffect(() => {
    startWaiting();
    return () => { clearInterval(tickRef.current); clearInterval(countdownRef.current); };
  }, []);

  return (
    <div className="w-screen h-[100dvh] bg-black flex justify-center overflow-hidden">
      <div className="relative w-full max-w-[430px] h-full flex flex-col bg-[#0d0d0d] shadow-2xl overflow-hidden" 
           style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
        
        {/* HEADER - Logo Stretching Fixed */}
        <div className="shrink-0 flex flex-col items-center pt-3 pb-2 bg-[#dbdbdb] border-b border-[#999]">
          <div className="flex justify-center items-center mb-1.5" style={{ width: 140, height: 35 }}>
            <img src={logoDark} alt="" className="w-100 h-100 object-contain" />
          </div>
          <div className="rounded-full px-5 py-0.5 border border-[#888] bg-gradient-to-b from-[#e0e0e0] to-[#b0b0b0]">
            <span className="font-black text-[#cc1010] text-[13px]">Самолетик Бурмалдотик</span>
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 flex flex-col px-3 pt-3 overflow-hidden gap-1.5">
          
          {/* BALANCE BAR */}
          <div className="flex gap-2">
            <div className="flex-1 flex items-center gap-2 rounded-2xl px-3 py-1.5 border border-[#af8700] bg-gradient-to-b from-[#deba00] to-[#af8700]">
              <img src={usdtIcon} alt="" className="w-5 h-5 rounded-full" />
              <span className="text-white font-black text-[13px]">{usdt.toFixed(2)}</span>
            </div>
            <div className="flex-1 flex items-center gap-2 rounded-2xl px-3 py-1.5 border border-[#4aaa18] bg-gradient-to-b from-[#2a7a10] to-[#1a5008]">
              <img src={fishkiIcon} alt="" className="w-5 h-5 rounded-full" />
              <span className="text-white font-black text-[13px] flex-1">{chips.toLocaleString()}</span>
              <button onClick={() => navigate('/shop')} className="w-5 h-5 rounded bg-[#5aba20] border border-[#7ade30] text-white font-black">+</button>
            </div>
          </div>

          {/* HISTORY */}
          <div className="flex gap-1 overflow-x-auto no-scrollbar py-1">
            {history.map((v, i) => {
              const s = historyStyle(v);
              return <div key={i} className={`${s.bg} ${s.text} rounded px-2 py-0.5 font-black text-[9px] shrink-0`}>x{v}</div>;
            })}
          </div>

          {/* GAME CANVAS */}
          <GameCanvas multiplier={multiplier} phase={phase} countdown={countdown} />

          {/* BET PANELS */}
          <div className="flex flex-col gap-1.5 pb-2">
            <BetPanel
              currency="USDT" bet={usdtBet} setBet={setUsdtBet}
              autoStake={usdtAutoStake} setAutoStake={setUsdtAutoStake}
              autoCashout={usdtAutoCash} setAutoCashout={setUsdtAutoCash}
              autoCashoutVal={usdtCashVal} setAutoCashoutVal={setUsdtCashVal}
              onAction={handleUsdtAction} actionLabel={usdtPlaced ? (phase === 'flying' ? 'Вывести' : 'Отменить') : 'Ставка'}
              betPlaced={usdtPlaced} phase={phase} multiplier={multiplier}
            />
            <BetPanel
              currency="CHIPS" bet={chipsBet} setBet={setChipsBet}
              autoStake={chipsAutoStake} setAutoStake={setChipsAutoStake}
              autoCashout={chipsAutoCash} setAutoCashout={setChipsAutoCash}
              autoCashoutVal={chipsCashVal} setAutoCashoutVal={setChipsCashVal}
              onAction={handleChipsAction} actionLabel={chipsPlaced ? (phase === 'flying' ? 'Вывести' : 'Отменить') : 'Ставка'}
              betPlaced={chipsPlaced} phase={phase} multiplier={multiplier}
            />
          </div>

          {/* MASCOT */}
          <div className="flex items-center gap-2 px-1 pb-4 shrink-0">
            <img src={mascotImg} alt="" className="w-7 h-auto" />
            <span className="text-white font-bold text-[10px] bg-[#222] px-3 py-1 rounded-full">- Привет Артур!</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page25;