import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import pageBg from '../assets/page1bg.webp';

import imgDrunstroy from '../assets/page14Images/drunstroy.webp';
import imgGanzapad  from '../assets/page14Images/ganzapad.webp';
import imgSub5      from '../assets/page14Images/sub5.webp';
import imgFaIcon    from '../assets/page14Images/fa_icon.webp';
import SnackBar from '../components/SnackBar';

// ─── MOCK DATA ────────────────────────────────────────────────────────────
const CHARACTERS = [
  {
    id: 1,
    img: imgDrunstroy,
    name: 'DRUNSTROY',
    level: 47,
    perks: ['прибыль в слотах,', 'доход в час'],
    btnType: 'upgrade',
    btnLabel: 'Улучшить',
    cost: '16.9В',
    costIcon: imgFaIcon,
    timerSeconds: 0,
    avatarBg: 'linear-gradient(135deg,#8b0000 0%,#c0392b 50%,#7a0000 100%)',
    btnGradient: 'linear-gradient(180deg,#f0c020,#c89000)',
    btnBorder: '#8a6000',
    btnShadow: '#6a4000',
    btnTextColor: '#000',
  },
  {
    id: 2,
    img: imgGanzapad,
    name: 'GANZAPAD',
    level: 46,
    perks: ['доход за клик', 'время сбора денег'],
    btnType: 'timer',
    btnLabel: 'Осталось',
    cost: null,
    costIcon: null,
    timerSeconds: 1 * 3600 + 12 * 60 + 56,
    avatarBg: 'linear-gradient(135deg,#0a1a5a 0%,#1a4aa0 50%,#0a2060 100%)',
    btnGradient: 'linear-gradient(180deg,#9b5ff4,#6b2fc4)',
    btnBorder: '#5b1fa4',
    btnShadow: '#3b0f84',
    btnTextColor: '#fff',
  },
  {
    id: 3,
    img: imgSub5,
    name: 'SUB-5',
    level: 49,
    perks: ['прибыль с друнов,', 'доход с бонусов'],
    btnType: 'upgrade',
    btnLabel: 'Улучшить',
    cost: '1.4T',
    costIcon: imgFaIcon,
    timerSeconds: 0,
    avatarBg: 'linear-gradient(135deg,#5a3a00 0%,#c8880a 50%,#7a5000 100%)',
    btnGradient: 'linear-gradient(180deg,#888,#666)',
    btnBorder: '#555',
    btnShadow: '#333',
    btnTextColor: '#fff',
  },
];

const PLAYER_LEVEL     = 4;
const PLAYER_MAX_LEVEL = 5;
const PROGRESS_PCT     = 70;
const TABS = ['ПЕРСОНАЖИ', 'УЛУЧШЕНИЯ'];

// ─── Timer hook ───────────────────────────────────────────────────────────
const useTimer = (initial) => {
  const [t, setT] = useState(initial);
  useEffect(() => {
    if (initial <= 0) return;
    const id = setInterval(() => setT(p => (p > 0 ? p - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [initial]);
  const h = String(Math.floor(t / 3600)).padStart(1, '0');
  const m = String(Math.floor((t % 3600) / 60)).padStart(2, '0');
  const s = String(t % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
};

// ─── Character Card ───────────────────────────────────────────────────────
const CharacterCard = ({ char }) => {
  const timerStr = useTimer(char.timerSeconds);

  return (
    <div style={{
      borderRadius: '18px',
      background: 'linear-gradient(180deg,#3a3a3a,#222)',
      border: '1.5px solid #666',
      boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
      padding: 'clamp(10px,2.5vw,14px)',
      display: 'flex',
      alignItems: 'center',
      gap: 'clamp(10px,2.5vw,14px)',
    }}>

      {/* Avatar */}
      <div style={{
        flexShrink: 0,
        width: 'clamp(76px,19vw,94px)',
        height: 'clamp(76px,19vw,94px)',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '2px solid #777',
        boxShadow: '0 2px 12px rgba(0,0,0,0.7)',
        background: char.avatarBg,
      }}>
        <img src={char.img} alt={char.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ color: '#fff', fontWeight: 900, fontSize: 'clamp(14px,4vw,17px)', letterSpacing: '0.04em' }}>
            {char.name}
          </span>
          <span style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 700, fontSize: 'clamp(11px,3vw,13px)' }}>
            ур. {char.level}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
          {char.perks.map((p, i) => (
            <span key={i} style={{ color: 'rgba(255,255,255,0.72)', fontSize: 'clamp(11px,2.8vw,13px)', fontWeight: 500, lineHeight: 1.4 }}>
              {p}
            </span>
          ))}
        </div>

        {/* Upgrade button */}
        {char.btnType === 'upgrade' && (
          <button style={{
            marginTop: '4px',
            alignSelf: 'flex-start',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: 'clamp(5px,1.5vw,7px) clamp(12px,3vw,18px)',
            borderRadius: '9999px',
            background: char.btnGradient,
            border: `2px solid ${char.btnBorder}`,
            boxShadow: `0 4px 0 ${char.btnShadow}`,
            color: char.btnTextColor,
            fontWeight: 900,
            fontSize: 'clamp(12px,3.2vw,15px)',
            cursor: 'pointer',
            letterSpacing: '0.02em',
          }}
            onPointerDown={e => e.currentTarget.style.transform = 'scale(0.96) translateY(2px)'}
            onPointerUp={e => e.currentTarget.style.transform = 'scale(1)'}
            onPointerLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <span>{char.btnLabel} {char.cost}</span>
            {char.costIcon && (
              <img src={char.costIcon} alt="coin"
                style={{ width: '22px', height: '22px', objectFit: 'contain', flexShrink: 0 }} />
            )}
          </button>
        )}

        {/* Timer display */}
        {char.btnType === 'timer' && (
          <div style={{
            marginTop: '4px',
            alignSelf: 'flex-start',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: 'clamp(5px,1.5vw,7px) clamp(12px,3vw,18px)',
            borderRadius: '9999px',
            background: char.btnGradient,
            border: `2px solid ${char.btnBorder}`,
            boxShadow: `0 4px 0 ${char.btnShadow}`,
          }}>
            <span style={{ color: '#fff', fontWeight: 900, fontSize: 'clamp(12px,3.2vw,15px)', letterSpacing: '0.04em', fontVariantNumeric: 'tabular-nums' }}>
              Осталось {timerStr}
            </span>
          </div>
        )}

        {/* Maxed */}
        {char.btnType === 'maxed' && (
          <div style={{
            marginTop: '4px',
            alignSelf: 'flex-start',
            padding: 'clamp(5px,1.5vw,7px) clamp(12px,3vw,18px)',
            borderRadius: '9999px',
            background: 'rgba(255,255,255,0.08)',
            border: '1.5px solid rgba(255,255,255,0.15)',
          }}>
            <span style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 700, fontSize: 'clamp(12px,3vw,14px)' }}>Максимум</span>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────
const Page14 = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      maxWidth: '430px',
      margin: '0 auto',
      height: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      backgroundImage: `url(${pageBg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      fontFamily: "'Nunito', 'Segoe UI', sans-serif",
    }}>

      {/* ── HEADER ─────────────────────────────────── */}
      <div style={{
        flexShrink: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        paddingTop: 'clamp(10px,3vw,14px)',
        paddingBottom: '4px',
        background: 'linear-gradient(180deg,#000 0%,transparent 100%)',
      }}>
        <span style={{ color: '#fff', fontWeight: 900, fontSize: 'clamp(13px,4vw,18px)', letterSpacing: '0.15em', textTransform: 'uppercase', lineHeight: 1 }}>
          DRUN FAMILY
        </span>
        <div style={{ display: 'flex', alignItems: 'center', width: '100%', padding: '3px 20px' }}>
          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg,transparent,#666)' }} />
          <span style={{ color: '#888', fontSize: 'clamp(9px,2vw,11px)', letterSpacing: '0.3em', margin: '0 10px', fontStyle: 'italic' }}>game</span>
          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg,#666,transparent)' }} />
        </div>
      </div>

      {/* ── TABS — ПЕРСОНАЖИ active, УЛУЧШЕНИЯ navigates to Page15 ── */}
      <div style={{
        flexShrink: 0,
        display: 'flex', alignItems: 'center',
        padding: 'clamp(6px,2vw,10px) clamp(16px,4vw,24px) 0',
        gap: 'clamp(20px,6vw,40px)',
      }}>
        {TABS.map((tab, i) => (
          <button
            key={i}
            onClick={() => { if (i === 1) navigate('/page15'); }}
            style={{
              background: 'transparent', border: 'none', padding: '4px 0',
              color: i === 0 ? '#6ecf20' : 'rgba(255,255,255,0.65)',
              fontWeight: 900,
              fontSize: 'clamp(14px,4vw,18px)',
              letterSpacing: '0.06em',
              cursor: i === 1 ? 'pointer' : 'default',
              textTransform: 'uppercase',
              transition: 'color 0.2s ease',
              whiteSpace: 'nowrap',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── PROGRESS BAR — diamonds + bar ── */}
      <div style={{
        flexShrink: 0,
        display: 'flex', alignItems: 'center', gap: '8px',
        padding: 'clamp(6px,1.5vw,10px) clamp(16px,4vw,24px) 0',
      }}>
        {/* Left diamond — gold */}
        <div style={{ flexShrink: 0, position: 'relative', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '28px', height: '28px', background: 'linear-gradient(135deg,#ffe033,#f0c020,#c89000)', border: '2px solid #8a6000', transform: 'rotate(45deg)', boxShadow: '0 0 8px rgba(240,192,32,0.6)' }} />
          <span style={{ position: 'absolute', color: '#000', fontWeight: 900, fontSize: '14px', lineHeight: 1, zIndex: 1 }}>{PLAYER_LEVEL}</span>
        </div>

        <div style={{ flex: 1, height: '14px', borderRadius: '9999px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', overflow: 'hidden', boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.6)' }}>
          <div style={{ height: '100%', width: `${PROGRESS_PCT}%`, background: 'linear-gradient(90deg,#c89000 0%,#f0c020 45%,#86efac 80%,#6ecf20 100%)', borderRadius: '9999px', boxShadow: '0 0 10px rgba(110,207,32,0.5)', transition: 'width 0.5s ease' }} />
        </div>

        {/* Right diamond — green */}
        <div style={{ flexShrink: 0, position: 'relative', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '28px', height: '28px', background: 'linear-gradient(135deg,#6ecf20,#4aaf10,#2a8a00)', border: '2px solid #2a6a08', transform: 'rotate(45deg)', boxShadow: '0 0 8px rgba(110,207,32,0.6)' }} />
          <span style={{ position: 'absolute', color: '#fff', fontWeight: 900, fontSize: '14px', lineHeight: 1, zIndex: 1 }}>{PLAYER_MAX_LEVEL}</span>
        </div>
      </div>

      {/* ── DESCRIPTION CARD ── */}
      <div style={{
        flexShrink: 0,
        margin: 'clamp(6px,1.5vw,10px) clamp(12px,3vw,16px) 0',
        borderRadius: '18px',
        background: 'linear-gradient(180deg,rgba(18,14,4,0.98),rgba(10,8,2,0.98))',
        border: '1.5px solid #4a4a4a',
        boxShadow: '0 4px 20px rgba(0,0,0,0.7)',
        padding: 'clamp(10px,2.5vw,14px) clamp(14px,3.5vw,18px)',
      }}>
        <p style={{ color: 'rgba(255,255,255,0.88)', fontWeight: 700, fontSize: 'clamp(11px,3vw,13px)', lineHeight: 1.65, textAlign: 'center', margin: 0 }}>
          Улучшая персонажей, вы увеличиваете свой уровень. Каждый уровень дает +2% ко всем доходам, а на последнем уровне вам станет доступен вывод средств.
        </p>
      </div>

      {/* ── SCROLLABLE CONTENT ── */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: 'clamp(8px,2vw,10px) clamp(12px,3vw,16px) clamp(16px,4vw,24px)',
        display: 'flex', flexDirection: 'column',
        gap: 'clamp(8px,2vw,12px)',
        WebkitOverflowScrolling: 'touch',
      }}>
        {CHARACTERS.map((char) => (
          <CharacterCard key={char.id} char={char} />
        ))}
      </div>
        <SnackBar/>
    </div>
  );
};

export default Page14;