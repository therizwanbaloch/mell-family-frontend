import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { doUpgradeImprovement, fetchState } from '../redux/gameSlice';

import pageBg    from '../assets/page1bg.webp';
import imgFaIcon from '../assets/page14Images/fa_icon.webp';

import imgHeroDrunstroy from '../assets/page15Images/hero_drunstroy.webp';
import imgHeroGanzapad  from '../assets/page15Images/hero_ganzapad.webp';
import imgHeroSub5      from '../assets/page15Images/hero_sub5.webp';

import imgCasino   from '../assets/page15Images/casino.webp';
import imgStreams  from '../assets/page15Images/streams.webp';
import imgMemes   from '../assets/page15Images/memes.webp';
import imgClips   from '../assets/page15Images/clips.webp';
import imgDonates1 from '../assets/page15Images/donates.webp';

import imgHype    from '../assets/page15Images/hype.webp';
import imgRap     from '../assets/page15Images/rap.webp';
import imgLook    from '../assets/page15Images/look.webp';
import imgStyle   from '../assets/page15Images/style.webp';
import imgDonates2 from '../assets/page15Images/donatesganz.webp';

import imgPranks   from '../assets/page15Images/pranks.webp';
import imgScandals from '../assets/page15Images/scandals.webp';
import imgVlog     from '../assets/page15Images/vlog.webp';
import imgInstagram from '../assets/page15Images/instagram.webp';
import imgColabs   from '../assets/page15Images/colabs.webp';

// ── Skeleton ──────────────────────────────────────────────────
const Skel = ({ w = '60px', h = '18px', radius = '9999px' }) => (
  <div style={{
    width: w, height: h, borderRadius: radius,
    background: 'rgba(255,255,255,0.1)',
    animation: 'skelPulse 1.4s ease-in-out infinite',
    display: 'inline-block',
  }} />
)

// ── Format large FA numbers ───────────────────────────────────
// ── Format cooldown seconds (used in toast) ──────────────────
const fmtCdMain = (s) => {
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sc = s % 60
  if (h > 0) return `${h}ч ${String(m).padStart(2,'0')}м`
  if (m > 0) return `${m}м ${String(sc).padStart(2,'0')}с`
  return `${sc}с`
}

// ── Format large FA numbers ───────────────────────────────────
const fmtFa = (n) => {
  if (!n && n !== 0) return '?'
  if (n >= 1e12) return `${(n / 1e12).toFixed(1)}T`
  if (n >= 1e9)  return `${(n / 1e9).toFixed(1)}B`
  if (n >= 1e6)  return `${(n / 1e6).toFixed(1)}M`
  if (n >= 1e3)  return `${(n / 1e3).toFixed(1)}K`
  return String(Math.floor(n))
}

// ── Static config — icons, labels, themes, hardcoded costs ──
const SECTIONS = [
  {
    id: 'drunstroy', hero: imgHeroDrunstroy, name: 'DRUNSTROY',
    heroBorder: '#2a8a10', heroGlow: 'rgba(42,138,16,0.4)',
    heroNameColor: '#ffffff', heroNameShadow: '0 0 20px #000, 0 2px 8px #000',
    rowBg: 'linear-gradient(90deg,#1c4a0e,#0e2a08)', rowBorder: '#3a8a18',
    rowBgLocked: 'linear-gradient(90deg,#1a1a1a,#111)', rowBorderLocked: '#2a2a2a',
    slots: [
      { slot: 1, icon: imgCasino,   label: 'Казино',   cost: '5.4m'  },
      { slot: 2, icon: imgStreams,  label: 'Стримы',   cost: '12.4m' },
      { slot: 3, icon: imgMemes,   label: 'Мемость',  cost: '35.8m' },
      { slot: 4, icon: imgClips,   label: 'Нарезки',  cost: '121m'  },
      { slot: 5, icon: imgDonates1,label: 'Донаты',   cost: '221m'  },
    ],
  },
  {
    id: 'ganzapad', hero: imgHeroGanzapad, name: 'GANZAPAD',
    heroBorder: '#666', heroGlow: 'rgba(80,80,80,0.4)',
    heroNameColor: '#dddddd', heroNameShadow: '0 0 20px #000, 0 2px 8px #000',
    rowBg: 'linear-gradient(90deg,#2e2e2e,#1a1a1a)', rowBorder: '#666',
    rowBgLocked: 'linear-gradient(90deg,#1a1a1a,#111)', rowBorderLocked: '#2a2a2a',
    slots: [
      { slot: 1, icon: imgHype,    label: 'Хайп',   cost: '5.4m'  },
      { slot: 2, icon: imgRap,     label: 'Рэп',    cost: '12.4m' },
      { slot: 3, icon: imgLook,    label: 'Образ',  cost: '35.8m' },
      { slot: 4, icon: imgStyle,   label: 'Стиль',  cost: '121m'  },
      { slot: 5, icon: imgDonates2,label: 'Донаты', cost: '221m'  },
    ],
  },
  {
    id: 'sub5', hero: imgHeroSub5, name: 'SUB-5',
    heroBorder: '#c89000', heroGlow: 'rgba(200,144,0,0.5)',
    heroNameColor: '#f0c020', heroNameShadow: '0 0 20px rgba(200,144,0,0.9), 0 2px 8px #000',
    rowBg: 'linear-gradient(90deg,#4a3000,#2e1e00)', rowBorder: '#c89000',
    rowBgLocked: 'linear-gradient(90deg,#1a1a1a,#111)', rowBorderLocked: '#2a2a2a',
    slots: [
      { slot: 1, icon: imgPranks,   label: 'Пранки',    cost: '5.4m'  },
      { slot: 2, icon: imgScandals, label: 'Скандалы',  cost: '12.4m' },
      { slot: 3, icon: imgVlog,     label: 'Влог',      cost: '35.8m' },
      { slot: 4, icon: imgInstagram,label: 'Instagram', cost: '121m'  },
      { slot: 5, icon: imgColabs,   label: 'Колабы',    cost: '221m'  },
    ],
  },
]

// ── Upgrade Row ───────────────────────────────────────────────
// ── Cost string → number  e.g. "5.4m" → 5400000
function parseCost(str) {
  if (!str) return Infinity
  const s = String(str).trim().toLowerCase()
  if (s.endsWith('b')) return parseFloat(s) * 1e9
  if (s.endsWith('m')) return parseFloat(s) * 1e6
  if (s.endsWith('k')) return parseFloat(s) * 1e3
  return parseFloat(s) || Infinity
}

const UpgradeRow = ({ sec, slot, slotData, onUpgrade, onToast, upgrading, userFa }) => {
  const locked   = slotData?.locked ?? false
  const level    = slotData?.level ?? 0

  // ── Live cooldown countdown ──
  const [secsLeft, setSecsLeft] = React.useState(0)
  React.useEffect(() => {
    const calc = () => {
      const ts = slotData?.cooldown_end_ts
      return ts ? Math.max(0, ts - Math.floor(Date.now() / 1000)) : 0
    }
    setSecsLeft(calc())
    if (!slotData?.cooldown_end_ts) return
    const iv = setInterval(() => {
      const s = calc()
      setSecsLeft(s)
      if (s <= 0) clearInterval(iv)
    }, 1000)
    return () => clearInterval(iv)
  }, [slotData?.cooldown_end_ts])
  const isCooling = secsLeft > 0

  // ── Cost: prefer backend next_cost, fallback to static config ──
  const costNum  = slotData?.next_cost ?? slotData?.cost ?? parseCost(slot.cost)
  const costStr  = costNum !== undefined && costNum !== Infinity ? fmtFa(costNum) : slot.cost

  const canAfford  = (userFa ?? 0) >= costNum
  const canUpgrade = !locked && !isCooling && canAfford
  const rowBg     = locked ? sec.rowBgLocked : !canAfford ? 'linear-gradient(90deg,#2a1a1a,#1a1010)' : sec.rowBg
  const rowBorder = locked ? sec.rowBorderLocked : !canAfford ? '#5a2a2a' : sec.rowBorder

  // Format cooldown as MM:SS or HH:MM:SS
  const fmtCd = (s) => {
    const h = Math.floor(s / 3600)
    const m = Math.floor((s % 3600) / 60)
    const sc = s % 60
    if (h > 0) return `${h}:${String(m).padStart(2,'0')}:${String(sc).padStart(2,'0')}`
    return `${String(m).padStart(2,'0')}:${String(sc).padStart(2,'0')}`
  }

  return (
    <div
      onClick={() => {
        if (upgrading) return
        if (locked)      { onToast('locked');   return }
        if (isCooling)   { onToast('cooling', secsLeft); return }
        if (!canAfford)  { onToast('broke', costNum);    return }
        onUpgrade(sec.id, slot.slot)
      }}
      style={{
        display: 'flex', alignItems: 'center',
        gap: 'clamp(10px,2.5vw,14px)',
        padding: 'clamp(6px,1.5vw,9px) clamp(10px,2.5vw,14px) clamp(6px,1.5vw,9px) clamp(5px,1.2vw,8px)',
        borderRadius: 9999,
        background: upgrading ? 'rgba(80,80,80,0.4)' : rowBg,
        border: `2px solid ${rowBorder}`,
        boxShadow: locked ? 'none' : '0 3px 12px rgba(0,0,0,0.5)',
        opacity: locked ? 0.45 : 1,
        cursor: canUpgrade && !upgrading ? 'pointer' : 'default',
        transition: 'transform 0.1s',
      }}
      onPointerDown={e => { if (canUpgrade && !upgrading) e.currentTarget.style.transform = 'scale(0.97)' }}
      onPointerUp={e => { e.currentTarget.style.transform = 'scale(1)' }}
      onPointerLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
    >
      {/* Circle icon + level badge */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <div style={{
          width: 'clamp(50px,13vw,64px)', height: 'clamp(50px,13vw,64px)',
          borderRadius: '50%', overflow: 'hidden',
          border: `2px solid ${locked ? '#444' : rowBorder}`,
          boxShadow: '0 2px 8px rgba(0,0,0,0.6)',
        }}>
          <img src={slot.icon} alt={slot.label}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        </div>
        {/* Level badge */}
        <div style={{
          position: 'absolute', bottom: -2, right: -2,
          width: 22, height: 22, borderRadius: '50%',
          background: 'linear-gradient(135deg,#f0c020,#c89000)',
          border: '1.5px solid #7a5000',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 1px 4px rgba(0,0,0,0.7)',
        }}>
          {slotData
            ? <span style={{ color: '#000', fontWeight: 900, fontSize: 11, lineHeight: 1 }}>{level}</span>
            : <Skel w="12px" h="12px" radius="50%" />
          }
        </div>
      </div>

      {/* Label */}
      <span style={{
        flex: 1,
        color: locked ? 'rgba(255,255,255,0.35)' : '#fff',
        fontWeight: 700, fontSize: 'clamp(16px,4.5vw,22px)', letterSpacing: '0.01em',
      }}>
        {slot.label}
      </span>

      {/* Cost pill */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: 'clamp(5px,1.2vw,7px) clamp(10px,2.5vw,14px)',
        borderRadius: 9999,
        background: 'linear-gradient(180deg,#d4a010,#a07008)',
        border: '2px solid #6a4a00', boxShadow: '0 3px 0 #3a2800',
        flexShrink: 0,
        opacity: locked ? 0.5 : 1,
      }}>
        <img src={imgFaIcon} alt="fa"
          style={{ width: 'clamp(20px,5vw,26px)', height: 'clamp(20px,5vw,26px)', objectFit: 'contain', flexShrink: 0 }} />
        <span style={{ color: '#fff', fontWeight: 900, fontSize: 'clamp(13px,3.5vw,16px)', whiteSpace: 'nowrap' }}>
          {upgrading ? '...' : isCooling ? `⏳ ${fmtCd(secsLeft)}` : costStr}
        </span>
      </div>
    </div>
  )
}

// ── Character Section ─────────────────────────────────────────
const Section = ({ sec, improvData, showDivider, onUpgrade, onToast, upgradingKey, userFa }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(7px,1.8vw,10px)' }}>
    {showDivider && (
      <div style={{ height: 1, margin: '6px 0 10px', background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent)' }} />
    )}

    {/* Hero banner */}
    <div style={{
      borderRadius: 18, overflow: 'hidden',
      border: `2.5px solid ${sec.heroBorder}`,
      boxShadow: `0 4px 24px rgba(0,0,0,0.8), 0 0 18px ${sec.heroGlow}`,
      position: 'relative', background: '#000',
    }}>
      <img src={sec.hero} alt={sec.name} style={{
        width: '100%', height: 'clamp(140px,35vw,185px)',
        objectFit: 'cover', objectPosition: 'center top', display: 'block',
      }} />
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: 'clamp(10px,2.5vw,14px) clamp(14px,3.5vw,20px)',
        background: 'linear-gradient(0deg,rgba(0,0,0,0.8),transparent)',
        display: 'flex', justifyContent: 'flex-end',
      }}>
        <span style={{ color: sec.heroNameColor, fontWeight: 900, fontSize: 'clamp(22px,6vw,30px)', letterSpacing: '0.07em', textShadow: sec.heroNameShadow }}>
          {sec.name}
        </span>
      </div>
    </div>

    {/* Upgrade rows */}
    {sec.slots.map((slot) => (
      <UpgradeRow
        key={slot.slot}
        sec={sec}
        slot={slot}
        slotData={
            improvData?.[`slot${slot.slot}`] ??
            improvData?.[slot.slot] ??
            (Array.isArray(improvData) ? improvData[slot.slot - 1] : null)
          }
        onUpgrade={onUpgrade}
        onToast={onToast}
        upgrading={upgradingKey === `${sec.id}-${slot.slot}`}
        userFa={userFa}
      />
    ))}
  </div>
)

// ── Main Page ─────────────────────────────────────────────────
const Page15 = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { user, improvements } = useSelector((s) => s.game)

  const [upgradingKey, setUpgradingKey] = useState(null)
  const [msg,          setMsg]          = useState(null)

  const profileLevel    = user?.profile_level ?? 0
  const profileLevelMax = user?.profile_level_max ?? (profileLevel + 1)
  const profileXp       = user?.profile_xp ?? 0
  const profileXpNeeded = user?.profile_xp_needed ?? 100
  const progressPct     = profileXpNeeded > 0 ? Math.min(100, Math.round((profileXp / profileXpNeeded) * 100)) : 0

  const handleToast = (type, extra) => {
    if (type === 'locked')  setMsg({ ok: false, text: '🔒 Это улучшение заблокировано' })
    if (type === 'cooling') setMsg({ ok: false, text: `⏳ Перезарядка: ${fmtCdMain(extra)}` })
    if (type === 'broke')   setMsg({ ok: false, text: `❌ Нужно ${fmtFa(extra)} FA — недостаточно средств` })
    setTimeout(() => setMsg(null), 3000)
  }

  const handleUpgrade = async (charKey, slot) => {
    // Find cost and guard client-side (belt-and-suspenders on top of UI disable)
    // Get cost: prefer live backend value, fallback to static config
    const secCfg   = SECTIONS.find(s => s.id === charKey)
    const slotCfg  = secCfg?.slots.find(s => s.slot === slot)
    const improvSec = improvements?.[charKey]
    const improvSlot = improvSec?.[`slot${slot}`] ?? improvSec?.[slot] ??
      (Array.isArray(improvSec) ? improvSec[slot - 1] : null)
    const costNum  = improvSlot?.next_cost ?? improvSlot?.cost ?? parseCost(slotCfg?.cost)
    if ((user?.fa ?? 0) < costNum) {
      setMsg({ ok: false, text: '❌ Недостаточно FA для улучшения' })
      setTimeout(() => setMsg(null), 3000)
      return
    }
    const key = `${charKey}-${slot}`
    setUpgradingKey(key)
    try {
      await dispatch(doUpgradeImprovement({ charKey, slot })).unwrap()
      setMsg({ ok: true, text: `✅ Улучшение прокачано!` })
      dispatch(fetchState())
    } catch (e) {
      setMsg({ ok: false, text: `❌ ${e}` })
    }
    setUpgradingKey(null)
    setTimeout(() => setMsg(null), 3000)
  }

  return (
    <div style={{
      maxWidth: '430px', margin: '0 auto',
      height: '100dvh', display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
      backgroundImage: `url(${pageBg})`,
      backgroundSize: 'cover', backgroundPosition: 'center',
      fontFamily: "'Nunito','Segoe UI',sans-serif",
    }}>
      <style>{`@keyframes skelPulse { 0%,100%{opacity:0.3} 50%{opacity:0.7} }`}</style>

      {/* HEADER */}
      <div style={{
        flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        paddingTop: 'clamp(8px,2.5vw,12px)', paddingBottom: 6,
        paddingLeft: 'clamp(12px,3vw,16px)', paddingRight: 'clamp(12px,3vw,16px)',
        background: 'linear-gradient(180deg,rgba(0,0,0,0.95),transparent)',
      }}>
        {/* Back button → Home */}
        <button onClick={() => navigate('/')} style={{
          background: 'linear-gradient(180deg,#3a2a08,#251a04)',
          border: '2px solid #7a5a10', borderRadius: 8,
          padding: '5px 13px', color: '#f0c060',
          fontWeight: 800, fontSize: 12, cursor: 'pointer',
          boxShadow: '0 3px 0 #1a1000',
        }}>← НАЗАД</button>

        {/* Title */}
        <div style={{ textAlign: 'center' }}>
          <span style={{ color: '#fff', fontWeight: 900, fontSize: 'clamp(13px,4vw,17px)', letterSpacing: '0.15em', textTransform: 'uppercase', lineHeight: 1, display: 'block' }}>
            DRUN FAMILY
          </span>
          <span style={{ color: '#888', fontSize: 'clamp(8px,2vw,10px)', letterSpacing: '0.3em', fontStyle: 'italic' }}>game</span>
        </div>

        {/* Spacer to balance back button */}
        <div style={{ width: 70 }} />
      </div>

      {/* TABS */}
      <div style={{
        flexShrink: 0, display: 'flex', alignItems: 'center',
        padding: 'clamp(6px,2vw,10px) clamp(16px,4vw,24px) 0',
        gap: 'clamp(20px,6vw,40px)',
      }}>
        <button onClick={() => navigate('/page14')} style={{
          background: 'transparent', border: 'none', padding: '4px 0',
          color: 'rgba(255,255,255,0.65)', fontWeight: 900,
          fontSize: 'clamp(14px,4vw,18px)', letterSpacing: '0.06em',
          cursor: 'pointer', textTransform: 'uppercase',
        }}>
          ПЕРСОНАЖИ
        </button>
        <button style={{
          background: 'transparent', border: 'none', padding: '4px 0',
          color: '#6ecf20', fontWeight: 900,
          fontSize: 'clamp(14px,4vw,18px)', letterSpacing: '0.06em',
          cursor: 'default', textTransform: 'uppercase',
        }}>
          УЛУЧШЕНИЯ
        </button>
      </div>

      {/* PROGRESS BAR */}
      <div style={{
        flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8,
        padding: 'clamp(6px,1.5vw,10px) clamp(16px,4vw,24px) 0',
      }}>
        <div style={{ flexShrink: 0, position: 'relative', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 28, height: 28, background: 'linear-gradient(135deg,#ffe033,#f0c020,#c89000)', border: '2px solid #8a6000', transform: 'rotate(45deg)', boxShadow: '0 0 8px rgba(240,192,32,0.6)' }} />
          <span style={{ position: 'absolute', color: '#000', fontWeight: 900, fontSize: 14, lineHeight: 1, zIndex: 1 }}>
            {user ? profileLevel : '?'}
          </span>
        </div>
        <div style={{ flex: 1, height: 14, borderRadius: 9999, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', overflow: 'hidden', boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.6)' }}>
          <div style={{ height: '100%', width: `${progressPct}%`, background: 'linear-gradient(90deg,#c89000,#f0c020 45%,#86efac 80%,#6ecf20)', borderRadius: 9999, boxShadow: '0 0 10px rgba(110,207,32,0.5)', transition: 'width 0.5s ease' }} />
        </div>
        <div style={{ flexShrink: 0, position: 'relative', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 28, height: 28, background: 'linear-gradient(135deg,#6ecf20,#4aaf10,#2a8a00)', border: '2px solid #2a6a08', transform: 'rotate(45deg)', boxShadow: '0 0 8px rgba(110,207,32,0.6)' }} />
          <span style={{ position: 'absolute', color: '#fff', fontWeight: 900, fontSize: 14, lineHeight: 1, zIndex: 1 }}>
            {user ? profileLevelMax : '?'}
          </span>
        </div>
      </div>

      {/* INFO BOX */}
      <div style={{
        flexShrink: 0,
        margin: 'clamp(6px,1.5vw,10px) clamp(12px,3vw,16px) 0',
        borderRadius: 16,
        background: 'linear-gradient(180deg,rgba(20,20,20,0.97),rgba(10,10,10,0.97))',
        border: '1.5px solid #4a4a4a', boxShadow: '0 4px 20px rgba(0,0,0,0.7)',
        padding: 'clamp(10px,2.5vw,14px) clamp(14px,3.5vw,18px)',
      }}>
        <p style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 700, fontSize: 'clamp(11px,3vw,13px)', lineHeight: 1.65, textAlign: 'center', margin: 0 }}>
          Прокачивая улучшения, становятся доступными новые уровни персонажей. Прокачав все улучшения персонажа до определённого уровня, вы сможете улучшить персонажа до этого уровня.
        </p>
      </div>

      {/* Snackbar */}
      {msg && (
        <div style={{
          margin: '6px clamp(12px,3vw,16px) 0', borderRadius: 12,
          padding: '10px 14px', textAlign: 'center', fontWeight: 800, fontSize: 13, color: '#fff',
          background: msg.ok ? 'rgba(40,140,40,0.92)' : 'rgba(180,40,40,0.92)',
          border: '1.5px solid rgba(255,255,255,0.15)', flexShrink: 0,
        }}>
          {msg.text}
        </div>
      )}

      {/* SCROLLABLE SECTIONS */}
      <div style={{
        flex: 1, overflowY: 'auto',
        padding: 'clamp(10px,2.5vw,14px) clamp(12px,3vw,16px) clamp(24px,6vw,36px)',
        display: 'flex', flexDirection: 'column', gap: 'clamp(8px,2vw,12px)',
        WebkitOverflowScrolling: 'touch',
      }}>
        {SECTIONS.map((sec, i) => (
          <Section
            key={sec.id}
            sec={sec}
            improvData={improvements?.[sec.id] ?? null}
            showDivider={i > 0}
            onUpgrade={handleUpgrade}
            onToast={handleToast}
            upgradingKey={upgradingKey}
            userFa={user?.fa ?? 0}
          />
        ))}
      </div>
    </div>
  )
}

export default Page15