import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import pageBg    from '../assets/page1bg.webp';
import usdtIcon  from '../assets/page23Images/usdt-icon.webp';
import fishkiIcon from '../assets/page22Images/fa-icon.webp';
// ── Replace this path with your actual plane image ──
import planeImg  from '../assets/page25Images/plane.webp';
// ── Replace this path with your mascot character image ──
import mascotImg from '../assets/page25Images/mascot.webp';

/* ══════════════════════════════════════
   CONSTANTS
══════════════════════════════════════ */
const MAX_USDT_BET   = 50;
const MAX_CHIPS_BET  = 2000;
const HISTORY_COLORS = (v) => {
  if (v >= 25) return { bg:'#c8a000', text:'#fff' };   // yellow
  if (v >= 10) return { bg:'#1a8a10', text:'#fff' };   // green
  if (v >= 2)  return { bg:'#1060c8', text:'#fff' };   // blue
  return        { bg:'#555',          text:'#fff' };    // gray
};

/* ══════════════════════════════════════
   MOCK HISTORY (replace with Redux)
══════════════════════════════════════ */
const MOCK_HISTORY = [52.1, 1.27, 10.6, 1.69, 1.97, 2.3];

/* ── helpers ── */
function clamp(val, min, max) { return Math.min(Math.max(val, min), max); }

/* ── Toggle switch ── */
const Toggle = ({ value, onChange }) => (
  <div
    onClick={() => onChange(!value)}
    style={{
      width: 36, height: 20, borderRadius: 10, cursor: 'pointer',
      background: value ? '#4aaa18' : '#555',
      position: 'relative', transition: 'background 0.2s',
      flexShrink: 0,
    }}
  >
    <div style={{
      position: 'absolute', top: 3, left: value ? 18 : 3,
      width: 14, height: 14, borderRadius: '50%',
      background: '#fff', transition: 'left 0.2s',
    }} />
  </div>
);

/* ── Bet panel (used for both USDT and Chips) ── */
const BetPanel = ({
  currency,       // 'USDT' | 'CHIPS'
  bet, setBet,
  autoStake, setAutoStake,
  autoCashout, setAutoCashout,
  autoCashoutVal, setAutoCashoutVal,
  onAction,       // callback for Ставка / Вывести
  actionLabel,    // 'Ставка' | 'Вывести'
  betPlaced,
}) => {
  const maxBet   = currency === 'USDT' ? MAX_USDT_BET : MAX_CHIPS_BET;
  const quickBtns = currency === 'USDT'
    ? [0.1, 0.5, 1, 5]
    : [1, 5, 20, 100];

  const adjustBet = (delta) => setBet(b => clamp(+(b + delta).toFixed(2), 0.1, maxBet));

  return (
    <div style={{
      background: 'linear-gradient(180deg,#2a2a2a,#1a1a1a)',
      borderRadius: 12, border: '1px solid #3a3a3a',
      padding: '8px 10px', marginBottom: 8,
    }}>
      {/* Row 1: Автоставка + Автовывод */}
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
        <div style={{ display:'flex', alignItems:'center', gap:5, flex:1 }}>
          <span style={{ color:'#aaa', fontSize:10, fontWeight:700 }}>Автоставка</span>
          <Toggle value={autoStake} onChange={setAutoStake} />
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:5, flex:1 }}>
          <span style={{ color:'#aaa', fontSize:10, fontWeight:700 }}>Автовывод</span>
          <Toggle value={autoCashout} onChange={setAutoCashout} />
          <input
            type="number"
            value={autoCashoutVal}
            onChange={e => setAutoCashoutVal(e.target.value)}
            style={{
              width: 44, background:'#333', border:'1px solid #555',
              borderRadius:6, color:'#fff', fontWeight:700, fontSize:11,
              textAlign:'center', padding:'2px 4px',
            }}
          />
          <span style={{ color:'#aaa', fontSize:10 }}>x</span>
        </div>
      </div>

      {/* Row 2: bet amount + action button */}
      <div style={{ display:'flex', gap:8, alignItems:'stretch' }}>

        {/* Left: amount controls */}
        <div style={{ flex:1 }}>
          {/* − amount + */}
          <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:5 }}>
            <button
              onClick={() => adjustBet(-( currency === 'USDT' ? 0.1 : 1))}
              disabled={betPlaced}
              style={{
                width:28, height:28, borderRadius:6,
                background:'#3a3a3a', border:'1px solid #555',
                color:'#fff', fontWeight:900, fontSize:16, cursor:'pointer',
                display:'flex', alignItems:'center', justifyContent:'center',
              }}
            >−</button>
            <span style={{ flex:1, textAlign:'center', color:'#fff', fontWeight:900, fontSize:'clamp(16px,5vw,22px)' }}>
              {currency === 'USDT' ? bet.toFixed(2) : Math.round(bet)}
            </span>
            <button
              onClick={() => adjustBet(currency === 'USDT' ? 0.1 : 1)}
              disabled={betPlaced}
              style={{
                width:28, height:28, borderRadius:6,
                background:'#3a3a3a', border:'1px solid #555',
                color:'#fff', fontWeight:900, fontSize:16, cursor:'pointer',
                display:'flex', alignItems:'center', justifyContent:'center',
              }}
            >+</button>
          </div>

          {/* Quick bet buttons */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:4 }}>
            {quickBtns.map((v, i) => (
              <button
                key={v}
                onClick={() => !betPlaced && setBet(clamp(v, 0.1, maxBet))}
                disabled={betPlaced}
                style={{
                  borderRadius: 20, padding:'4px 0',
                  background: i === quickBtns.length - 1
                    ? 'linear-gradient(180deg,#4aaa18,#2a7008)'
                    : 'linear-gradient(180deg,#3a3a3a,#2a2a2a)',
                  border: i === quickBtns.length - 1 ? '1px solid #6ade30' : '1px solid #555',
                  color: '#fff', fontWeight:700, fontSize:12,
                  cursor: betPlaced ? 'default' : 'pointer',
                  opacity: betPlaced ? 0.6 : 1,
                }}
              >{v}</button>
            ))}
          </div>
        </div>

        {/* Right: action button */}
        <button
          onClick={onAction}
          style={{
            width: '48%', borderRadius: 12,
            background: actionLabel === 'Вывести'
              ? 'linear-gradient(180deg,#e8a020,#b06010)'
              : 'linear-gradient(180deg,#3aaa10,#1a7008)',
            border: actionLabel === 'Вывести'
              ? '2px solid #f0c030'
              : '2px solid #5ade20',
            color: '#fff', fontWeight: 900,
            fontSize: 'clamp(18px,5.5vw,26px)',
            cursor: 'pointer',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 3px 12px rgba(0,0,0,0.5)',
            lineHeight: 1.1,
          }}
        >
          <span>{actionLabel}</span>
          <span style={{ fontSize: 'clamp(10px,3vw,13px)', fontWeight:700, opacity:0.9 }}>
            {currency === 'USDT'
              ? `${bet.toFixed(2)} USDT`
              : `${Math.round(bet)} Фишек`}
          </span>
        </button>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════
   GAME CANVAS — plane + multiplier
══════════════════════════════════════ */
const GameCanvas = ({ multiplier, isFlying, crashed }) => {
  const canvasRef = useRef(null);
  const animRef   = useRef(null);
  const progressRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      // background
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, W, H);

      if (!isFlying && !crashed) {
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.font = 'bold 18px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Ожидание ставок...', W / 2, H / 2);
        return;
      }

      const prog  = Math.min(progressRef.current, 1);
      const startX = W * 0.05;
      const startY = H * 0.92;
      const endX   = W * 0.95;
      const endY   = H * 0.08;
      const curX   = startX + (endX - startX) * prog;
      const curY   = startY + (endY - startY) * prog;

      // filled triangle (red glow area)
      const grad = ctx.createLinearGradient(startX, startY, curX, curY);
      grad.addColorStop(0, crashed ? 'rgba(180,20,20,0.9)' : 'rgba(200,20,20,0.85)');
      grad.addColorStop(1, crashed ? 'rgba(80,0,0,0.4)' : 'rgba(255,60,0,0.3)');
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(curX,   curY);
      ctx.lineTo(curX,   startY);
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
      ctx.shadowBlur = 0;
    };

    if (isFlying) {
      const speed = 0.004;
      const animate = () => {
        progressRef.current = Math.min(progressRef.current + speed, 1);
        draw();
        if (progressRef.current < 1) animRef.current = requestAnimationFrame(animate);
      };
      animRef.current = requestAnimationFrame(animate);
    } else {
      if (!isFlying && !crashed) progressRef.current = 0;
      draw();
    }

    return () => cancelAnimationFrame(animRef.current);
  }, [isFlying, crashed]);

  return (
    <div style={{ position:'relative', borderRadius:12, overflow:'hidden', marginBottom:8 }}>
      <canvas
        ref={canvasRef}
        width={380} height={220}
        style={{ width:'100%', display:'block', borderRadius:12 }}
      />
      {/* Multiplier overlay */}
      <div style={{
        position:'absolute', inset:0,
        display:'flex', alignItems:'center', justifyContent:'center',
        pointerEvents:'none',
      }}>
        <span style={{
          fontWeight:900,
          fontSize:'clamp(36px,12vw,60px)',
          color: crashed ? '#ff4040' : '#fff',
          textShadow: crashed
            ? '0 0 30px #ff0000'
            : '0 0 40px rgba(255,220,100,0.9), 0 2px 0 rgba(0,0,0,0.8)',
          lineHeight:1,
        }}>
          {multiplier.toFixed(2)}x
        </span>
      </div>
      {/* Plane icon (top-right area when flying) */}
      {isFlying && (
        <img
          src={planeImg}
          alt=""
          style={{
            position:'absolute', right:'12%', top:'15%',
            width: 52, height: 'auto',
            filter:'drop-shadow(0 0 8px rgba(255,100,0,0.8))',
            transform:'rotate(-20deg)',
          }}
        />
      )}
      {crashed && (
        <div style={{
          position:'absolute', inset:0, background:'rgba(180,0,0,0.25)',
          display:'flex', alignItems:'center', justifyContent:'center',
          borderRadius:12,
        }}>
          <span style={{ color:'#ff4040', fontWeight:900, fontSize:28, textShadow:'0 0 20px #ff0000' }}>
            УЛЕТЕЛ! 💥
          </span>
        </div>
      )}
    </div>
  );
};

/* ══════════════════════════════════════
   PAGE 25 — САМОЛЕТИК БУРМАЛДОТИК
══════════════════════════════════════ */
const Page25 = () => {
  const navigate  = useNavigate();
  const dispatch  = useDispatch();
  const user      = useSelector(s => s.game.user);

  const usdt   = user?.usdt_balance   ?? 0;
  const fishki = user?.chips ?? user?.fishki_balance ?? 0;

  /* ── game state ── */
  const [history,      setHistory]      = useState(MOCK_HISTORY);
  const [multiplier,   setMultiplier]   = useState(1.00);
  const [isFlying,     setIsFlying]     = useState(false);
  const [crashed,      setCrashed]      = useState(false);
  const [showHistory,  setShowHistory]  = useState(false);

  /* ── USDT bet panel ── */
  const [usdtBet,        setUsdtBet]        = useState(1.00);
  const [usdtAutoStake,  setUsdtAutoStake]  = useState(false);
  const [usdtAutoCash,   setUsdtAutoCash]   = useState(false);
  const [usdtCashVal,    setUsdtCashVal]    = useState('2.50');
  const [usdtPlaced,     setUsdtPlaced]     = useState(false);

  /* ── Chips bet panel ── */
  const [chipsBet,       setChipsBet]       = useState(179);
  const [chipsAutoStake, setChipsAutoStake] = useState(true);
  const [chipsAutoCash,  setChipsAutoCash]  = useState(true);
  const [chipsCashVal,   setChipsCashVal]   = useState('100');
  const [chipsPlaced,    setChipsPlaced]    = useState(false);

  /* ── multiplier ticker ── */
  const tickRef    = useRef(null);
  const crashRef   = useRef(null);

  const startRound = useCallback(() => {
    setCrashed(false);
    setMultiplier(1.00);
    setIsFlying(true);

    // random crash point weighted by total chips bet (mock logic)
    const crashAt = +(1.1 + Math.random() * 20).toFixed(2);
    crashRef.current = crashAt;

    tickRef.current = setInterval(() => {
      setMultiplier(prev => {
        const next = +(prev * 1.012).toFixed(2);
        if (next >= crashAt) {
          clearInterval(tickRef.current);
          setIsFlying(false);
          setCrashed(true);
          setHistory(h => [crashAt, ...h].slice(0, 25));
          setUsdtPlaced(false);
          setChipsPlaced(false);
          return crashAt;
        }
        return next;
      });
    }, 100);
  }, []);

  useEffect(() => {
    // auto-start first round after 2s
    const t = setTimeout(startRound, 2000);
    return () => { clearTimeout(t); clearInterval(tickRef.current); };
  }, [startRound]);

  // restart after crash
  useEffect(() => {
    if (crashed) {
      const t = setTimeout(startRound, 3000);
      return () => clearTimeout(t);
    }
  }, [crashed, startRound]);

  const handleUsdtAction = () => {
    if (!isFlying && !usdtPlaced) { setUsdtPlaced(true); return; }
    if (isFlying && usdtPlaced)   { setUsdtPlaced(false); /* cashout dispatch */ }
    if (!isFlying)                 { setUsdtPlaced(true); }
  };

  const handleChipsAction = () => {
    if (!isFlying && !chipsPlaced) { setChipsPlaced(true); return; }
    if (isFlying && chipsPlaced)   { setChipsPlaced(false); /* cashout dispatch */ }
    if (!isFlying)                  { setChipsPlaced(true); }
  };

  const usdtLabel  = isFlying && usdtPlaced  ? 'Вывести' : 'Ставка';
  const chipsLabel = isFlying && chipsPlaced ? 'Вывести' : 'Ставка';

  return (
    <div style={{
      backgroundImage:`url(${pageBg})`,
      backgroundSize:'cover', backgroundPosition:'center',
      maxWidth:430, margin:'0 auto',
      height:'100dvh', overflow:'hidden',
      display:'flex', flexDirection:'column',
      background:'#0d0d0d',
    }}>

      {/* ── HEADER ── */}
      <div style={{
        background:'linear-gradient(180deg,#c8c8c8,#a0a0a0)',
        display:'flex', flexDirection:'column', alignItems:'center',
        paddingTop:6, paddingBottom:2, flexShrink:0,
      }}>
        <span style={{ fontWeight:900, color:'#000', textTransform:'uppercase', letterSpacing:'0.2em', fontSize:11 }}>
          DRUN FAMILY
        </span>
        <div style={{ display:'flex', alignItems:'center', width:'100%', padding:'1px 16px' }}>
          <div style={{ flex:1, height:1, background:'linear-gradient(90deg,transparent,#000)' }} />
          <span style={{ fontWeight:700, color:'#000', fontSize:8, letterSpacing:'0.3em', textTransform:'uppercase', margin:'0 8px' }}>GAME</span>
          <div style={{ flex:1, height:1, background:'linear-gradient(90deg,#000,transparent)' }} />
        </div>
        {/* Page title pill */}
        <div style={{
          background:'linear-gradient(180deg,#e0e0e0,#b0b0b0)',
          borderRadius:20, padding:'4px 20px', margin:'4px 0 2px',
          border:'1px solid #888',
        }}>
          <span style={{ fontWeight:900, fontSize:'clamp(14px,4.5vw,20px)', color:'#cc1010' }}>Самолетик </span>
          <span style={{ fontWeight:900, fontSize:'clamp(14px,4.5vw,20px)', color:'#333' }}>Бурмалдотик</span>
        </div>
      </div>

      {/* ── BODY ── */}
      <div style={{ flex:1, overflowY:'auto', WebkitOverflowScrolling:'touch', padding:'6px 8px 16px', background:'#0d0d0d' }}>

        {/* Balance bar */}
        <div style={{ display:'flex', gap:8, marginBottom:6 }}>
          {/* USDT */}
          <div style={{
            flex:1, display:'flex', alignItems:'center', gap:6,
            background:'linear-gradient(180deg,#b8860b,#7a5500)',
            borderRadius:20, padding:'5px 10px',
            border:'1.5px solid #d4a017',
          }}>
            <img src={usdtIcon} alt="" style={{ width:26, height:26, borderRadius:'50%', objectFit:'cover', flexShrink:0 }} />
            <div>
              <div style={{ color:'rgba(255,255,255,0.6)', fontSize:8, fontWeight:700 }}>USDT</div>
              <div style={{ color:'#fff', fontWeight:900, fontSize:'clamp(13px,4vw,18px)', lineHeight:1 }}>
                {typeof usdt === 'number' ? usdt.toFixed(2) : usdt}
              </div>
            </div>
          </div>
          {/* ФИШКИ */}
          <div style={{
            flex:1, display:'flex', alignItems:'center', gap:6,
            background:'linear-gradient(180deg,#2a7a10,#1a5008)',
            borderRadius:20, padding:'5px 10px',
            border:'1.5px solid #4aaa18',
          }}>
            <img src={fishkiIcon} alt="" style={{ width:26, height:26, borderRadius:'50%', objectFit:'cover', flexShrink:0 }} />
            <div style={{ flex:1 }}>
              <div style={{ color:'rgba(255,255,255,0.6)', fontSize:8, fontWeight:700 }}>ФИШКИ</div>
              <div style={{ color:'#fff', fontWeight:900, fontSize:'clamp(13px,4vw,18px)', lineHeight:1 }}>
                {typeof fishki === 'number' ? fishki.toLocaleString() : fishki}
              </div>
            </div>
            <div
              onClick={() => navigate('/page21')}
              style={{
                width:26, height:26, borderRadius:7,
                background:'linear-gradient(180deg,#5aba20,#2a8008)',
                border:'1.5px solid #7ade30',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontWeight:900, fontSize:17, color:'#fff', cursor:'pointer', flexShrink:0,
              }}
            >+</div>
          </div>
        </div>

        {/* History row */}
        <div style={{ display:'flex', gap:4, marginBottom:6, alignItems:'center', overflowX:'auto' }}>
          {history.slice(0, 6).map((v, i) => {
            const c = HISTORY_COLORS(v);
            return (
              <div key={i} style={{
                background: c.bg, borderRadius:6, padding:'3px 7px',
                fontWeight:900, fontSize:12, color:c.text, flexShrink:0,
                minWidth:42, textAlign:'center',
              }}>x{v}</div>
            );
          })}
          <div
            onClick={() => setShowHistory(s => !s)}
            style={{
              background:'#333', borderRadius:6, padding:'3px 8px',
              color:'#aaa', fontWeight:900, fontSize:13, cursor:'pointer', flexShrink:0,
            }}
          >•••</div>
        </div>

        {/* History popup */}
        {showHistory && (
          <div style={{
            background:'#1a1a1a', borderRadius:10, padding:10,
            border:'1px solid #333', marginBottom:6,
          }}>
            <p style={{ color:'#aaa', fontSize:11, fontWeight:700, margin:'0 0 6px', textAlign:'center' }}>
              Последние 25 коэффициентов
            </p>
            <div style={{ display:'flex', flexWrap:'wrap', gap:4 }}>
              {history.map((v, i) => {
                const c = HISTORY_COLORS(v);
                return (
                  <div key={i} style={{
                    background:c.bg, borderRadius:6, padding:'3px 7px',
                    fontWeight:900, fontSize:11, color:c.text,
                  }}>x{v}</div>
                );
              })}
            </div>
          </div>
        )}

        {/* Game canvas */}
        <GameCanvas multiplier={multiplier} isFlying={isFlying} crashed={crashed} />

        {/* USDT bet panel */}
        <BetPanel
          currency="USDT"
          bet={usdtBet}          setBet={setUsdtBet}
          autoStake={usdtAutoStake}  setAutoStake={setUsdtAutoStake}
          autoCashout={usdtAutoCash} setAutoCashout={setUsdtAutoCash}
          autoCashoutVal={usdtCashVal} setAutoCashoutVal={setUsdtCashVal}
          onAction={handleUsdtAction}
          actionLabel={usdtLabel}
          betPlaced={isFlying && usdtPlaced}
        />

        {/* Chips bet panel */}
        <BetPanel
          currency="CHIPS"
          bet={chipsBet}           setBet={setChipsBet}
          autoStake={chipsAutoStake}  setAutoStake={setChipsAutoStake}
          autoCashout={chipsAutoCash} setAutoCashout={setChipsAutoCash}
          autoCashoutVal={chipsCashVal} setAutoCashoutVal={setChipsCashVal}
          onAction={handleChipsAction}
          actionLabel={chipsLabel}
          betPlaced={isFlying && chipsPlaced}
        />

        {/* Mascot */}
        <div style={{ display:'flex', alignItems:'center', gap:8, padding:'4px 4px 0' }}>
          <img src={mascotImg} alt="" style={{ width:44, height:'auto', objectFit:'contain' }} />
          <span style={{ color:'#fff', fontWeight:700, fontSize:13 }}>- Привет Артур!</span>
        </div>

      </div>
    </div>
  );
};

export default Page25;