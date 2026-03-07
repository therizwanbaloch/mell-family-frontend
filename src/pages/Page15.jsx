import React from 'react';
import { useNavigate } from 'react-router-dom';
import pageBg from '../assets/page1bg.webp';

import imgFaIcon from '../assets/page14Images/fa_icon.webp';

// ─── Hero banners (wide landscape ~430x160px) ─────────────────────────────
import imgHeroDrunstroy from '../assets/page15Images/hero_drunstroy.webp';
import imgHeroGanzapad  from '../assets/page15Images/hero_ganzapad.webp';
import imgHeroSub5      from '../assets/page15Images/hero_sub5.webp';

// ─── DRUNSTROY upgrade icons ──────────────────────────────────────────────
import imgCasino   from '../assets/page15Images/casino.webp';
import imgStreams  from '../assets/page15Images/streams.webp';
import imgMemes    from '../assets/page15Images/memes.webp';
import imgClips    from '../assets/page15Images/clips.webp';
import imgDonates1 from '../assets/page15Images/donates.webp';

// ─── GANZAPAD upgrade icons ───────────────────────────────────────────────
import imgHype     from '../assets/page15Images/hype.webp';
import imgRap      from '../assets/page15Images/rap.webp';
import imgLook     from '../assets/page15Images/look.webp';
import imgStyle    from '../assets/page15Images/style.webp';
import imgDonates2 from '../assets/page15Images/donatesganz.webp';

// ─── SUB-5 upgrade icons ──────────────────────────────────────────────────
import imgPranks    from '../assets/page15Images/pranks.webp';
import imgScandals  from '../assets/page15Images/scandals.webp';
import imgVlog      from '../assets/page15Images/vlog.webp';
import imgInstagram from '../assets/page15Images/instagram.webp';
import imgColabs    from '../assets/page15Images/colabs.webp';
import SnackBar from '../components/SnackBar';

// ─── DATA ────────────────────────────────────────────────────────────────
const PLAYER_LEVEL     = 4;
const PLAYER_MAX_LEVEL = 5;
const PROGRESS_PCT     = 70;

const SECTIONS = [
  {
    id: 'drunstroy',
    hero: imgHeroDrunstroy,
    name: 'DRUNSTROY',
    // ── GREEN theme ──
    heroBorder: '#2a8a10',
    heroGlow:   'rgba(42,138,16,0.4)',
    heroNameColor: '#ffffff',
    heroNameShadow: '0 0 20px #000, 0 2px 8px #000',
    // hero image — name text on RIGHT side (as seen in design image 1)
    heroNameAlign: 'right',
    rowBg:     'linear-gradient(90deg,#1c4a0e,#0e2a08)',
    rowBorder: '#3a8a18',
    rowBgLocked: 'linear-gradient(90deg,#1a1a1a,#111)',
    rowBorderLocked: '#2a2a2a',
  },
  {
    id: 'ganzapad',
    hero: imgHeroGanzapad,
    name: 'GANZAPAD',
    // ── GREY theme ──
    heroBorder: '#666',
    heroGlow:   'rgba(80,80,80,0.4)',
    heroNameColor: '#dddddd',
    heroNameShadow: '0 0 20px #000, 0 2px 8px #000',
    heroNameAlign: 'right',
    rowBg:     'linear-gradient(90deg,#2e2e2e,#1a1a1a)',
    rowBorder: '#666',
    rowBgLocked: 'linear-gradient(90deg,#1a1a1a,#111)',
    rowBorderLocked: '#2a2a2a',
  },
  {
    id: 'sub5',
    hero: imgHeroSub5,
    name: 'SUB-5',
    // ── GOLD/BLACK theme — black bg, yellowish-orange border, name on RIGHT ──
    heroBorder: '#c89000',
    heroGlow:   'rgba(200,144,0,0.5)',
    heroNameColor: '#f0c020',
    heroNameShadow: '0 0 20px rgba(200,144,0,0.9), 0 2px 8px #000',
    heroNameAlign: 'right',
    rowBg:     'linear-gradient(90deg,#4a3000,#2e1e00)',
    rowBorder: '#c89000',
    rowBgLocked: 'linear-gradient(90deg,#1a1a1a,#111)',
    rowBorderLocked: '#2a2a2a',
  },
];

const UPGRADES = {
  drunstroy: [
    { id: 1, icon: imgCasino,   label: 'Казино',  level: 7, cost: '5.4m',  locked: false },
    { id: 2, icon: imgStreams,  label: 'Стримы',  level: 7, cost: '12.4m', locked: false },
    { id: 3, icon: imgMemes,    label: 'Мемость', level: 7, cost: '35.8m', locked: false },
    { id: 4, icon: imgClips,    label: 'Нарезки', level: 7, cost: '121m',  locked: false },
    { id: 5, icon: imgDonates1, label: 'Донаты',  level: 7, cost: '221m',  locked: true  },
  ],
  ganzapad: [
    { id: 1, icon: imgHype,    label: 'Хайп',   level: 7, cost: '5.4m',  locked: false },
    { id: 2, icon: imgRap,     label: 'Рэп',    level: 7, cost: '12.4m', locked: false },
    { id: 3, icon: imgLook,    label: 'Образ',  level: 7, cost: '35.8m', locked: false },
    { id: 4, icon: imgStyle,   label: 'Стиль',  level: 7, cost: '121m',  locked: false },
    { id: 5, icon: imgDonates2,label: 'Донаты', level: 7, cost: '221m',  locked: false },
  ],
  sub5: [
    { id: 1, icon: imgPranks,    label: 'Пранки',    level: 7, cost: '5.4m',  locked: false },
    { id: 2, icon: imgScandals,  label: 'Скандалы',  level: 7, cost: '12.4m', locked: false },
    { id: 3, icon: imgVlog,      label: 'Влог',      level: 7, cost: '35.8m', locked: false },
    { id: 4, icon: imgInstagram, label: 'Instagram', level: 7, cost: '121m',  locked: false },
    { id: 5, icon: imgColabs,    label: 'Колабы',    level: 7, cost: '221m',  locked: false },
  ],
};

// ─── Upgrade Row ──────────────────────────────────────────────────────────
const UpgradeRow = ({ upg, sec }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 'clamp(10px,2.5vw,14px)',
      padding: 'clamp(6px,1.5vw,9px) clamp(10px,2.5vw,14px) clamp(6px,1.5vw,9px) clamp(5px,1.2vw,8px)',
      borderRadius: '9999px',
      background: upg.locked ? sec.rowBgLocked : sec.rowBg,
      border: `2px solid ${upg.locked ? sec.rowBorderLocked : sec.rowBorder}`,
      boxShadow: upg.locked ? 'none' : '0 3px 12px rgba(0,0,0,0.5)',
      opacity: upg.locked ? 0.45 : 1,
      cursor: upg.locked ? 'default' : 'pointer',
      transition: 'transform 0.1s',
    }}
    onPointerDown={e => { if (!upg.locked) e.currentTarget.style.transform = 'scale(0.97)'; }}
    onPointerUp={e   => { e.currentTarget.style.transform = 'scale(1)'; }}
    onPointerLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
  >
    {/* Circle icon + level badge */}
    <div style={{ position: 'relative', flexShrink: 0 }}>
      <div style={{
        width: 'clamp(50px,13vw,64px)',
        height: 'clamp(50px,13vw,64px)',
        borderRadius: '50%',
        overflow: 'hidden',
        border: `2px solid ${upg.locked ? '#444' : sec.rowBorder}`,
        boxShadow: '0 2px 8px rgba(0,0,0,0.6)',
      }}>
        <img src={upg.icon} alt={upg.label}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      </div>
      {/* Level badge */}
      <div style={{
        position: 'absolute', bottom: '-2px', right: '-2px',
        width: '22px', height: '22px', borderRadius: '50%',
        background: 'linear-gradient(135deg,#f0c020,#c89000)',
        border: '1.5px solid #7a5000',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 1px 4px rgba(0,0,0,0.7)',
      }}>
        <span style={{ color: '#000', fontWeight: 900, fontSize: '11px', lineHeight: 1 }}>
          {upg.level}
        </span>
      </div>
    </div>

    {/* Label */}
    <span style={{
      flex: 1,
      color: upg.locked ? 'rgba(255,255,255,0.35)' : '#fff',
      fontWeight: 700,
      fontSize: 'clamp(16px,4.5vw,22px)',
      letterSpacing: '0.01em',
    }}>
      {upg.label}
    </span>

    {/* Cost pill — larger coin icon */}
    <div style={{
      display: 'flex', alignItems: 'center', gap: '6px',
      padding: 'clamp(5px,1.2vw,7px) clamp(10px,2.5vw,14px)',
      borderRadius: '9999px',
      background: 'linear-gradient(180deg,#d4a010,#a07008)',
      border: '2px solid #6a4a00',
      boxShadow: '0 3px 0 #3a2800',
      flexShrink: 0,
    }}>
      {/* BIGGER coin icon — was 14-18px, now 22-26px */}
      <img src={imgFaIcon} alt="fa"
        style={{ width: 'clamp(20px,5vw,26px)', height: 'clamp(20px,5vw,26px)', objectFit: 'contain', flexShrink: 0 }} />
      <span style={{
        color: '#fff', fontWeight: 900,
        fontSize: 'clamp(13px,3.5vw,16px)',
        whiteSpace: 'nowrap',
      }}>
        {upg.cost}
      </span>
    </div>
  </div>
);

// ─── Character Section ────────────────────────────────────────────────────
const Section = ({ sec, upgrades, showDivider }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(7px,1.8vw,10px)' }}>

    {showDivider && (
      <div style={{
        height: '1px',
        margin: '6px 0 10px',
        background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent)',
      }} />
    )}

    {/* Hero Banner — black background, name on RIGHT side, border color matches theme */}
    <div style={{
      borderRadius: '18px',
      overflow: 'hidden',
      border: `2.5px solid ${sec.heroBorder}`,
      boxShadow: `0 4px 24px rgba(0,0,0,0.8), 0 0 18px ${sec.heroGlow}`,
      position: 'relative',
      background: '#000',           // ← black bg for all hero banners
    }}>
      <img
        src={sec.hero}
        alt={sec.name}
        style={{
          width: '100%',
          height: 'clamp(140px,35vw,185px)',
          objectFit: 'cover',
          objectPosition: 'center top',
          display: 'block',
        }}
      />
      {/* Name overlay — pinned to BOTTOM-RIGHT */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: 'clamp(10px,2.5vw,14px) clamp(14px,3.5vw,20px)',
        background: 'linear-gradient(0deg,rgba(0,0,0,0.8) 0%,transparent 100%)',
        display: 'flex',
        justifyContent: sec.heroNameAlign === 'right' ? 'flex-end' : 'flex-start',
      }}>
        <span style={{
          color: sec.heroNameColor,
          fontWeight: 900,
          fontSize: 'clamp(22px,6vw,30px)',
          letterSpacing: '0.07em',
          textShadow: sec.heroNameShadow,
        }}>
          {sec.name}
        </span>
      </div>
    </div>

    {/* Upgrade rows */}
    {upgrades.map(upg => (
      <UpgradeRow key={upg.id} upg={upg} sec={sec} />
    ))}
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────
const Page15 = () => {
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

      {/* ── HEADER ──────────────────────────────────────── */}
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

      {/* ── TABS — ПЕРСОНАЖИ goes to Page14 | УЛУЧШЕНИЯ active ── */}
      <div style={{
        flexShrink: 0,
        display: 'flex', alignItems: 'center',
        padding: 'clamp(6px,2vw,10px) clamp(16px,4vw,24px) 0',
        gap: 'clamp(20px,6vw,40px)',
      }}>
        <button
          onClick={() => navigate('/page14')}
          style={{
            background: 'transparent', border: 'none', padding: '4px 0',
            color: 'rgba(255,255,255,0.65)',
            fontWeight: 900,
            fontSize: 'clamp(14px,4vw,18px)',
            letterSpacing: '0.06em',
            cursor: 'pointer',
            textTransform: 'uppercase',
          }}
        >
          ПЕРСОНАЖИ
        </button>
        <button style={{
          background: 'transparent', border: 'none', padding: '4px 0',
          color: '#6ecf20',
          fontWeight: 900,
          fontSize: 'clamp(14px,4vw,18px)',
          letterSpacing: '0.06em',
          cursor: 'default',
          textTransform: 'uppercase',
        }}>
          УЛУЧШЕНИЯ
        </button>
      </div>

      {/* ── PROGRESS BAR ───────────────────────────────── */}
      <div style={{
        flexShrink: 0,
        display: 'flex', alignItems: 'center', gap: '8px',
        padding: 'clamp(6px,1.5vw,10px) clamp(16px,4vw,24px) 0',
      }}>
        <div style={{ flexShrink: 0, position: 'relative', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '28px', height: '28px', background: 'linear-gradient(135deg,#ffe033,#f0c020,#c89000)', border: '2px solid #8a6000', transform: 'rotate(45deg)', boxShadow: '0 0 8px rgba(240,192,32,0.6)' }} />
          <span style={{ position: 'absolute', color: '#000', fontWeight: 900, fontSize: '14px', lineHeight: 1, zIndex: 1 }}>{PLAYER_LEVEL}</span>
        </div>

        <div style={{ flex: 1, height: '14px', borderRadius: '9999px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', overflow: 'hidden', boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.6)' }}>
          <div style={{ height: '100%', width: `${PROGRESS_PCT}%`, background: 'linear-gradient(90deg,#c89000 0%,#f0c020 45%,#86efac 80%,#6ecf20 100%)', borderRadius: '9999px', boxShadow: '0 0 10px rgba(110,207,32,0.5)', transition: 'width 0.5s ease' }} />
        </div>

        <div style={{ flexShrink: 0, position: 'relative', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '28px', height: '28px', background: 'linear-gradient(135deg,#6ecf20,#4aaf10,#2a8a00)', border: '2px solid #2a6a08', transform: 'rotate(45deg)', boxShadow: '0 0 8px rgba(110,207,32,0.6)' }} />
          <span style={{ position: 'absolute', color: '#fff', fontWeight: 900, fontSize: '14px', lineHeight: 1, zIndex: 1 }}>{PLAYER_MAX_LEVEL}</span>
        </div>
      </div>

      {/* ── INFO BOX ─────────────────────────────────────── */}
      <div style={{
        flexShrink: 0,
        margin: 'clamp(6px,1.5vw,10px) clamp(12px,3vw,16px) 0',
        borderRadius: '16px',
        background: 'linear-gradient(180deg,rgba(20,20,20,0.97),rgba(10,10,10,0.97))',
        border: '1.5px solid #4a4a4a',
        boxShadow: '0 4px 20px rgba(0,0,0,0.7)',
        padding: 'clamp(10px,2.5vw,14px) clamp(14px,3.5vw,18px)',
      }}>
        <p style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 700, fontSize: 'clamp(11px,3vw,13px)', lineHeight: 1.65, textAlign: 'center', margin: 0 }}>
          Прокачивая улучшения, становятся доступными новые уровни персонажей. прокачав все улучшения персонажа до определенного уровня вы сможете улучшить персонажа до этого уровня.
        </p>
      </div>

      {/* ── SEAMLESS SCROLL — all 3 character sections ── */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: 'clamp(10px,2.5vw,14px) clamp(12px,3vw,16px) clamp(24px,6vw,36px)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'clamp(8px,2vw,12px)',
        WebkitOverflowScrolling: 'touch',
      }}>
        {SECTIONS.map((sec, i) => (
          <Section
            key={sec.id}
            sec={sec}
            upgrades={UPGRADES[sec.id]}
            showDivider={i > 0}
          />
        ))}
      </div>
      <SnackBar/>

    </div>
  );
};

export default Page15;