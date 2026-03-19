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
const POOL_SCALE     = 10000;
const WAITING_SECS  = 5;
const PLANE_CAP     = 0.55;

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
    <div className="rounded-lg border border-[#3a3a3a] px-2.5 py-2 mb-1.5"
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

      <div className="flex gap-2 items-stretch">
        <div className="flex-1">
          <div className="flex items-center gap-1.5 mb-1.5">
            <button onClick={() => adjustBet(-step)} disabled={locked}
              className="w-7 h-7 rounded bg-[#3a3a3a] border border-[#555] text-white font-black text-[15px] flex items-center justify-center cursor-pointer disabled:opacity-40">−</button>
            <span className="flex-1 text-center font-black text-[17px]"
              style={{ color: locked ? 'rgba(255,255,255,0.4)' : 'white' }}>
              {currency === 'USDT' ? bet.toFixed(2) : Math.round(bet)}
            </span>
            <button onClick={() => adjustBet(step)} disabled={locked}
              className="w-7 h-7 rounded bg-[#3a3a3a] border border-[#555] text-white font-black text-[15px] flex items-center justify-center cursor-pointer disabled:opacity-40">+</button>
          </div>
          <div className="grid grid-cols-4 gap-1">
            {quickBtns.map((v, i) => (
              <button key={v} onClick={() => !locked && setBet(clamp(v, step, maxBet))} disabled={locked}
                className="rounded-full py-[3px] font-bold text-[11px] text-white border transition-opacity disabled:opacity-40"
                style={{
                  background: i === quickBtns.length - 1 ? 'linear-gradient(180deg,#4aaa18,#2a7008)' : 'linear-gradient(180deg,#3a3a3a,#2a2a2a)',
                  borderColor: i === quickBtns.length - 1 ? '#6ade30' : '#555',
                }}>{v}</button>
            ))}
          </div>
        </div>

        <button
          onClick={onAction}
          disabled={phase === 'crashed' || (phase === 'flying' && !betPlaced)}
          className="w-[42%] rounded-lg text-white font-black flex flex-col items-center justify-center cursor-pointer leading-tight border-2 shadow-[0_2px_8px_rgba(0,0,0,0.5)] disabled:opacity-40 transition-all"
          style={{
            fontSize: 'clamp(15px,4.5vw,20px)',
            background: btnBackground,
            borderColor: btnBorder,
          }}
        >
          <span>{actionLabel}</span>
          {!isCancel && (
            <span className="font-bold opacity-90 text-[10px]">
              {showPayout
                ? currency === 'USDT' ? `→ ${payoutUsdt} USDT` : `→ ${payoutChips?.toLocaleString()} Ф`
                : currency === 'USDT' ? `${bet.toFixed(2)} USDT` : `${Math.round(bet)} Фишек`
              }
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

/* ── GAME CANVAS ── */
const CANVAS_W = 380;
const CANVAS_H = 206;
const LINE_START = { x: CANVAS_W * 0.05, y: CANVAS_H * 0.92 };
const LINE_END   = { x: CANVAS_W * 0.95, y: CANVAS_H * 0.08 };

const GameCanvas = ({ multiplier, phase, countdown }) => {
  const canvasRef = useRef(null);
  const crashed   = phase === 'crashed';
  const isFlying  = phase === 'flying';
  const waiting   = phase === 'waiting';

  const lineProgress  = isFlying || crashed ? multToProgress(multiplier) : 0;
  const planeProgress = Math.min(lineProgress, PLANE_CAP);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, W, H);
    if (waiting || planeProgress <= 0) return;

    const p = Math.min(planeProgress, 1);
    const startX = W * 0.05, startY = H * 0.92;
    const endX   = W * 0.95, endY   = H * 0.08;
    const curX   = startX + (endX - startX) * p;
    const curY   = startY + (endY - startY) * p;

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
    ctx.shadowColor = crashed ? '#ff0000' : '#ff6040';
    ctx.shadowBlur  = 12;
    ctx.stroke();
    ctx.shadowBlur  = 0;
  }, [multiplier, phase, planeProgress, waiting, crashed]);

  const tipX_px   = LINE_START.x + (LINE_END.x - LINE_START.x) * planeProgress;
  const tipY_px   = LINE_START.y + (LINE_END.y - LINE_START.y) * planeProgress;
  const planeLeft = `${(tipX_px / CANVAS_W) * 100}%`;
  const planeTop  = `${(tipY_px / CANVAS_H) * 100}%`;

  return (
    <div className="relative rounded-lg overflow-hidden mb-1.5">
      <canvas ref={canvasRef} width={CANVAS_W} height={CANVAS_H} className="w-full block rounded-lg" />
      {isFlying && planeProgress > 0 && (
        <img src={planeImg} alt="" className="absolute pointer-events-none"
          style={{
            width: 46, height: 'auto', left: planeLeft, top: planeTop,
            transform: 'translate(-80%, -80%) rotate(-35deg)',
            filter: 'drop-shadow(0 0 8px rgba(255,100,0,0.9))',
            transition: lineProgress <= PLANE_CAP ? 'left 0.08s linear, top 0.08s linear' : 'none',
            zIndex: 5,
          }}
        />
      )}
      {waiting && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 rounded-lg bg-black/70">
          <span className="text-white/60 font-bold text-[12px] tracking-widest uppercase">Ожидание ставок...</span>
          <div className="relative w-[52px] h-[52px] flex items-center justify-center">
            <svg className="absolute inset-0 -rotate-90" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
              <circle cx="32" cy="32" r="28" fill="none" stroke="#f0c020" strokeWidth="4" strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 28}`}
                strokeDashoffset={`${2 * Math.PI * 28 * (1 - countdown / WAITING_SECS)}`}
                style={{ transition: 'stroke-dashoffset 0.9s linear' }}
              />
            </svg>
            <span className="text-[#f0c020] font-black text-[19px] leading-none">{countdown}</span>
          </div>
        </div>
      )}
      {(isFlying || crashed) && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="font-black leading-none"
            style={{
              fontSize: 'clamp(31px,10.5vw,54px)',
              color: crashed ? '#ff4040' : '#fff',
              textShadow: crashed ? '0 0 30px #ff0000' : '0 0 40px rgba(255,220,100,0.9), 0 2px 0 rgba(0,0,0,0.8)',
            }}
          >{multiplier.toFixed(2)}x</span>
        </div>
      )}
      {crashed && (
        <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-[rgba(180,0,0,0.25)]">
          <span className="text-[#ff4040] font-black text-[25px]" style={{ textShadow: '0 0 20px #ff0000' }}>УЛЕТЕЛ! 💥</span>
        </div>
      )}
    </div>
  );
};

/* ── MAIN PAGE ── */
const Page25 = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user     = useSelector(s => s.game.user);

  const usdt  = user?.usdt_balance ?? 0;
  const chips = user?.chips ?? user?.fishki_balance ?? 0;

  const [phase, setPhase]           = useState('waiting');
  const [countdown, setCountdown]   = useState(WAITING_SECS);
  const [history, setHistory]       = useState([52.1, 1.27, 10.6, 1.69, 1.97, 2.3]);
  const [multiplier, setMultiplier] = useState(1.00);
  const [showHistory, setShowHistory] = useState(false);
  const [chipsPool, setChipsPool]   = useState(0);

  // Toast Logic
  const [toast, setToast] = useState({ show: false, amount: '', currency: '' });

  const triggerToast = (amount, currency) => {
    setToast({ show: true, amount, currency });
    setTimeout(() => setToast({ show: false, amount: '', currency: '' }), 3000);
  };

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

  const tickRef = useRef(null);
  const crashValRef = useRef(null);
  const countdownRef = useRef(null);
  const usdtRef = useRef(usdt);
  const chipsRef = useRef(chips);

  useEffect(() => { usdtRef.current = usdt; }, [usdt]);
  useEffect(() => { chipsRef.current = chips; }, [chips]);

  const startFlying = useCallback((pool) => {
    setPhase('flying');
    setMultiplier(1.00);
    const reduction = Math.floor(pool / POOL_SCALE) * 0.5;
    crashValRef.current = +(1.05 + Math.random() * (Math.max(2.0, 22 - reduction) - 1.05)).toFixed(2);

    tickRef.current = setInterval(() => {
      setMultiplier(prev => {
        const next = +(prev * 1.012).toFixed(2);
        if (next >= crashValRef.current) {
          clearInterval(tickRef.current);
          setPhase('crashed');
          setHistory(h => [crashValRef.current, ...h].slice(0, 25));
          setUsdtPlaced(false); setChipsPlaced(false);
          return crashValRef.current;
        }
        return next;
      });
    }, 100);
  }, []);

  const startWaiting = useCallback(() => {
    setPhase('waiting'); setCountdown(WAITING_SECS); setMultiplier(1.00); setChipsPool(0);
    let secs = WAITING_SECS;
    countdownRef.current = setInterval(() => {
      secs -= 1; setCountdown(secs);
      if (secs <= 0) {
        clearInterval(countdownRef.current);
        startFlying(0);
      }
    }, 1000);
  }, [startFlying]);

  useEffect(() => {
    if (phase !== 'crashed') return;
    const t = setTimeout(startWaiting, 2500);
    return () => clearTimeout(t);
  }, [phase, startWaiting]);

  useEffect(() => {
    startWaiting();
    return () => { clearInterval(tickRef.current); clearInterval(countdownRef.current); };
  }, []);

  const handleUsdtAction = () => {
    if (phase === 'flying' && usdtPlaced) {
      const win = +(usdtBet * multiplier).toFixed(2);
      dispatch(patchUser({ usdt_balance: +(usdt + win).toFixed(2) }));
      setUsdtPlaced(false);
      triggerToast(win, 'USDT');
    } else if (phase === 'waiting' && usdtPlaced) {
      dispatch(patchUser({ usdt_balance: +(usdt + usdtBet).toFixed(2) }));
      setUsdtPlaced(false);
    } else if (!usdtPlaced && phase !== 'crashed' && usdt >= usdtBet) {
      dispatch(patchUser({ usdt_balance: +(usdt - usdtBet).toFixed(2) }));
      setUsdtPlaced(true);
    }
  };

  const handleChipsAction = () => {
    if (phase === 'flying' && chipsPlaced) {
      const win = Math.floor(chipsBet * multiplier);
      dispatch(patchUser({ chips: chips + win }));
      setChipsPlaced(false);
      triggerToast(win.toLocaleString(), 'Ф');
    } else if (phase === 'waiting' && chipsPlaced) {
      dispatch(patchUser({ chips: chips + chipsBet }));
      setChipsPlaced(false);
    } else if (!chipsPlaced && phase !== 'crashed' && chips >= chipsBet) {
      dispatch(patchUser({ chips: chips - chipsBet }));
      setChipsPlaced(true);
    }
  };

  return (
    <div className="relative max-w-[430px] mx-auto h-[100dvh] overflow-hidden flex flex-col"
      style={{ fontFamily: "'Nunito',sans-serif", background: '#0d0d0d' }}>

      {/* HEADER */}
      <div className="shrink-0 flex flex-col items-center pt-2 pb-2" style={{ background: '#dbdbdb' }}>
        <div className="flex justify-center overflow-hidden mx-auto mb-1.5" style={{ width: 144, height: 37, position: 'relative' }}>
          <img src={logoDark} alt="" style={{ position: 'absolute', width: 240, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
        </div>
        <div className="rounded-full px-4 py-0.5 border border-[#888]" style={{ background: 'linear-gradient(180deg,#e0e0e0,#b0b0b0)' }}>
          <span className="font-black text-[#cc1010] text-[15.5px]">Самолетик </span>
          <span className="font-black text-[#333] text-[15.5px]">Бурмалдотик</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col px-2 pt-1 pb-1 overflow-hidden">
        {/* BALANCE BAR */}
        <div className="flex gap-1.5 mb-1.5">
          <div className="flex-1 flex items-center gap-1.5 rounded-full px-2.5 py-1 border border-[#af8700]"
            style={{ background: 'linear-gradient(180deg,#deba00,#af8700)' }}>
            <img src={usdtIcon} alt="" className="w-[22px] h-[22px] rounded-full object-cover shrink-0" />
            <div className="flex-1">
              <div className="text-white/70 text-[7.5px] font-bold">USDT</div>
              <div className="text-white font-black text-[13.5px] leading-none">{usdt.toFixed(2)}</div>
            </div>
          </div>
          <div className="flex-1 flex items-center gap-1.5 rounded-full px-2.5 py-1 border border-[#4aaa18]"
            style={{ background: 'linear-gradient(180deg,#2a7a10,#1a5008)' }}>
            <img src={fishkiIcon} alt="" className="w-[22px] h-[22px] rounded-full object-cover shrink-0" />
            <div className="flex-1">
              <div className="text-white/60 text-[7.5px] font-bold">ФИШКИ</div>
              <div className="text-white font-black text-[13.5px] leading-none">{chips.toLocaleString()}</div>
            </div>
            <button onClick={() => navigate('/shop')} className="w-[26px] h-[26px] rounded-md flex items-center justify-center font-black text-[15px] text-white shrink-0 border border-[#7ade30] cursor-pointer" style={{ background: 'linear-gradient(180deg,#5aba20,#2a8008)' }}>+</button>
          </div>
        </div>

        {/* GAME AREA */}
        <div className="flex gap-1 mb-1 items-center overflow-x-auto no-scrollbar">
          {history.slice(0, 6).map((v, i) => {
            const s = historyStyle(v);
            return <div key={i} className={`${s.bg} ${s.text} rounded px-1.5 py-[1px] font-black text-[10.5px] shrink-0 min-w-[37px] text-center`}>x{v}</div>;
          })}
          <button onClick={() => setShowHistory(!showHistory)} className="bg-[#333] rounded px-1.5 py-[1px] text-[#aaa] font-black text-[11.5px] shrink-0">•••</button>
        </div>

        <GameCanvas multiplier={multiplier} phase={phase} countdown={countdown} />

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
          autoStake={chipsAutoStake} setAutoStake={setChipsAutoStake}
          autoCashout={chipsAutoCash} setAutoCashout={setChipsAutoCash}
          autoCashoutVal={chipsCashVal} setAutoCashoutVal={setChipsCashVal}
          onAction={handleChipsAction} actionLabel={chipsPlaced ? (phase === 'flying' ? 'Вывести' : 'Отменить') : 'Ставка'}
          betPlaced={chipsPlaced} phase={phase} multiplier={multiplier}
        />

        <div className="flex items-center gap-1.5 px-1 mt-auto pb-2">
          <img src={mascotImg} alt="" className="w-[33px] h-auto" />
          <span className="text-white font-bold text-[11.5px]">- Привет Артур!</span>
        </div>
      </div>

      {/* WINNING TOAST */}
      <div 
        className={`fixed bottom-20 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 pointer-events-none ${toast.show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      >
        <div 
          className="flex flex-col items-center justify-center px-6 py-2 rounded-xl border-2 border-[#5ade20] shadow-[0_0_20px_rgba(90,222,32,0.4)]"
          style={{ background: 'linear-gradient(180deg, #3aaa10, #1a7008)' }}
        >
          <span className="text-white text-[12px] font-bold uppercase tracking-wider opacity-80">Вы выиграли!</span>
          <span className="text-white text-[22px] font-black leading-tight">
            +{toast.amount} {toast.currency}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Page25;