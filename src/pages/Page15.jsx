import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { doUpgradeImprovement, fetchState } from '../redux/gameSlice';

import pageBg    from '../assets/page1bg.webp';
import imgFaIcon from '../assets/page14Images/fa_icon.webp';

import imgHeroDrunstroy from '../assets/page15Images/hero_drunstroy.webp';
import imgHeroGanzapad  from '../assets/page15Images/hero_ganzapad.webp';
import imgHeroSub5      from '../assets/page15Images/hero_sub5.webp';

import imgCasino    from '../assets/page15Images/casino.webp';
import imgStreams   from '../assets/page15Images/streams.webp';
import imgMemes     from '../assets/page15Images/memes.webp';
import imgClips     from '../assets/page15Images/clips.webp';
import imgDonates1  from '../assets/page15Images/donates.webp';

import imgHype     from '../assets/page15Images/hype.webp';
import imgRap      from '../assets/page15Images/rap.webp';
import imgLook     from '../assets/page15Images/look.webp';
import imgStyle    from '../assets/page15Images/style.webp';
import imgDonates2 from '../assets/page15Images/donatesganz.webp';

import imgPranks    from '../assets/page15Images/pranks.webp';
import imgScandals  from '../assets/page15Images/scandals.webp';
import imgVlog      from '../assets/page15Images/vlog.webp';
import imgInstagram from '../assets/page15Images/instagram.webp';
import imgColabs    from '../assets/page15Images/colabs.webp';

import SnackBar from '../components/SnackBar';

// ── Skeleton ──────────────────────────────────────────────────
const Skel = ({ className = '' }) => (
  <div className={`bg-white/10 rounded-full animate-pulse inline-block ${className}`} />
)

// ── Static config ─────────────────────────────────────────────
const SECTIONS = [
  {
    id: 'drunstroy', hero: imgHeroDrunstroy, name: 'DRUNSTROY',
    heroBorder: '#2a8a10', heroGlow: 'rgba(42,138,16,0.4)',
    heroNameColor: '#ffffff',
    heroNameShadow: '0 0 20px #000, 0 2px 8px #000',
    rowBg: 'linear-gradient(90deg,#1c4a0e,#0e2a08)',
    rowBorder: '#3a8a18',
    rowBgLocked: 'linear-gradient(90deg,#1a1a1a,#111)',
    rowBorderLocked: '#2a2a2a',
    slots: [
      { slot: 1, icon: imgCasino,    label: 'Казино',   cost: '5.4m'  },
      { slot: 2, icon: imgStreams,   label: 'Стримы',   cost: '12.4m' },
      { slot: 3, icon: imgMemes,    label: 'Мемость',  cost: '35.8m' },
      { slot: 4, icon: imgClips,    label: 'Нарезки',  cost: '121m'  },
      { slot: 5, icon: imgDonates1, label: 'Донаты',   cost: '221m'  },
    ],
  },
  {
    id: 'ganzapad', hero: imgHeroGanzapad, name: 'GANZAPAD',
    heroBorder: '#666', heroGlow: 'rgba(80,80,80,0.4)',
    heroNameColor: '#dddddd',
    heroNameShadow: '0 0 20px #000, 0 2px 8px #000',
    rowBg: 'linear-gradient(90deg,#2e2e2e,#1a1a1a)',
    rowBorder: '#666',
    rowBgLocked: 'linear-gradient(90deg,#1a1a1a,#111)',
    rowBorderLocked: '#2a2a2a',
    slots: [
      { slot: 1, icon: imgHype,     label: 'Хайп',   cost: '5.4m'  },
      { slot: 2, icon: imgRap,      label: 'Рэп',    cost: '12.4m' },
      { slot: 3, icon: imgLook,     label: 'Образ',  cost: '35.8m' },
      { slot: 4, icon: imgStyle,    label: 'Стиль',  cost: '121m'  },
      { slot: 5, icon: imgDonates2, label: 'Донаты', cost: '221m'  },
    ],
  },
  {
    id: 'sub5', hero: imgHeroSub5, name: 'SUB-5',
    heroBorder: '#c89000', heroGlow: 'rgba(200,144,0,0.5)',
    heroNameColor: '#f0c020',
    heroNameShadow: '0 0 20px rgba(200,144,0,0.9), 0 2px 8px #000',
    rowBg: 'linear-gradient(90deg,#4a3000,#2e1e00)',
    rowBorder: '#c89000',
    rowBgLocked: 'linear-gradient(90deg,#1a1a1a,#111)',
    rowBorderLocked: '#2a2a2a',
    slots: [
      { slot: 1, icon: imgPranks,    label: 'Пранки',    cost: '5.4m'  },
      { slot: 2, icon: imgScandals,  label: 'Скандалы',  cost: '12.4m' },
      { slot: 3, icon: imgVlog,      label: 'Влог',      cost: '35.8m' },
      { slot: 4, icon: imgInstagram, label: 'Instagram', cost: '121m'  },
      { slot: 5, icon: imgColabs,    label: 'Колабы',    cost: '221m'  },
    ],
  },
]

// ── Upgrade Row ───────────────────────────────────────────────
const UpgradeRow = ({ sec, slot, slotData, onUpgrade, upgrading }) => {
  const locked    = slotData?.locked ?? false
  const level     = slotData?.level ?? 0
  const isCooling = slotData?.cooldown_end_ts
    ? Math.max(0, slotData.cooldown_end_ts - Math.floor(Date.now() / 1000)) > 0
    : false
  const canUpgrade = !locked && !isCooling && !upgrading

  return (
    <div
      onClick={() => canUpgrade && onUpgrade(sec.id, slot.slot)}
      className={`flex items-center gap-3 px-3 py-2 rounded-full border-2 transition-transform select-none ${canUpgrade ? 'cursor-pointer active:scale-[0.97]' : 'cursor-default'}`}
      style={{
        background: upgrading ? 'rgba(80,80,80,0.4)' : locked ? sec.rowBgLocked : sec.rowBg,
        borderColor: locked ? sec.rowBorderLocked : sec.rowBorder,
        boxShadow: locked ? 'none' : '0 3px 12px rgba(0,0,0,0.5)',
        opacity: locked ? 0.45 : 1,
      }}
    >
      {/* Icon + level badge */}
      <div className="relative shrink-0">
        <div
          className="w-14 h-14 rounded-full overflow-hidden border-2"
          style={{ borderColor: locked ? '#444' : sec.rowBorder, boxShadow: '0 2px 8px rgba(0,0,0,0.6)' }}
        >
          <img src={slot.icon} alt={slot.label} className="w-full h-full object-cover block" />
        </div>
        {/* Level badge */}
        <div className="absolute -bottom-0.5 -right-0.5 w-[22px] h-[22px] rounded-full flex items-center justify-center border border-[#7a5000] shadow-[0_1px_4px_rgba(0,0,0,0.7)]"
          style={{ background: 'linear-gradient(135deg,#f0c020,#c89000)' }}
        >
          {slotData
            ? <span className="text-black font-black text-[11px] leading-none">{level}</span>
            : <Skel className="w-3 h-3" />
          }
        </div>
      </div>

      {/* Label */}
      <span
        className="flex-1 font-bold text-lg tracking-tight"
        style={{ color: locked ? 'rgba(255,255,255,0.35)' : '#fff' }}
      >
        {slot.label}
      </span>

      {/* Cost pill */}
      <div
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 border-[#6a4a00] shadow-[0_3px_0_#3a2800] shrink-0"
        style={{
          background: 'linear-gradient(180deg,#d4a010,#a07008)',
          opacity: locked ? 0.5 : 1,
        }}
      >
        <img src={imgFaIcon} alt="fa" className="w-6 h-6 object-contain shrink-0" />
        <span className="text-white font-black text-sm whitespace-nowrap">
          {upgrading ? '...' : isCooling ? '⏳' : slot.cost}
        </span>
      </div>
    </div>
  )
}

// ── Character Section ─────────────────────────────────────────
const Section = ({ sec, improvData, showDivider, onUpgrade, upgradingKey }) => (
  <div className="flex flex-col gap-2">
    {showDivider && (
      <div className="h-px my-1.5" style={{ background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent)' }} />
    )}

    {/* Hero banner */}
    <div
      className="rounded-2xl overflow-hidden relative bg-black"
      style={{
        border: `2.5px solid ${sec.heroBorder}`,
        boxShadow: `0 4px 24px rgba(0,0,0,0.8), 0 0 18px ${sec.heroGlow}`,
      }}
    >
      <img
        src={sec.hero}
        alt={sec.name}
        className="w-full object-cover object-top block"
        style={{ height: 'clamp(130px,32vw,175px)' }}
      />
      <div className="absolute bottom-0 left-0 right-0 px-4 py-3 flex justify-end"
        style={{ background: 'linear-gradient(0deg,rgba(0,0,0,0.8),transparent)' }}
      >
        <span
          className="font-black text-2xl tracking-widest"
          style={{ color: sec.heroNameColor, textShadow: sec.heroNameShadow }}
        >
          {sec.name}
        </span>
      </div>
    </div>

    {/* Upgrade rows */}
    {sec.slots.map((slot) => {
      // Support multiple possible shapes from the API:
      // improvements.drunstroy = { slot1: {...}, slot2: {...} }
      // improvements.drunstroy = { 1: {...}, 2: {...} }
      // improvements.drunstroy = [{...}, {...}]  (array, 0-indexed)
      const slotData =
        improvData?.[`slot${slot.slot}`] ??
        improvData?.[slot.slot] ??
        (Array.isArray(improvData) ? improvData[slot.slot - 1] : null)

      return (
        <UpgradeRow
          key={slot.slot}
          sec={sec}
          slot={slot}
          slotData={slotData}
          onUpgrade={onUpgrade}
          upgrading={upgradingKey === `${sec.id}-${slot.slot}`}
        />
      )
    })}
  </div>
)

// ── Main Page ─────────────────────────────────────────────────
const Page15 = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { user, improvements } = useSelector((s) => s.game)

  const [upgradingKey, setUpgradingKey] = useState(null)
  const [msg,          setMsg]          = useState(null)

  const profileLevel    = user?.profile_level    ?? 0
  const profileLevelMax = user?.profile_level_max ?? (profileLevel + 1)
  const profileXp       = user?.profile_xp        ?? 0
  const profileXpNeeded = user?.profile_xp_needed  ?? 100
  const progressPct     = profileXpNeeded > 0
    ? Math.min(100, Math.round((profileXp / profileXpNeeded) * 100))
    : 0

  const handleUpgrade = async (charKey, slot) => {
    const key = `${charKey}-${slot}`
    setUpgradingKey(key)
    try {
      await dispatch(doUpgradeImprovement({ charKey, slot })).unwrap()
      setMsg({ ok: true, text: '✅ Улучшение прокачано!' })
      dispatch(fetchState())
    } catch (e) {
      setMsg({ ok: false, text: `❌ ${e}` })
    }
    setUpgradingKey(null)
    setTimeout(() => setMsg(null), 3000)
  }

  return (
    <div
      className="max-w-[430px] mx-auto h-[100dvh] flex flex-col overflow-hidden relative"
      style={{
        backgroundImage: `url(${pageBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        fontFamily: "'Nunito','Segoe UI',sans-serif",
      }}
    >
      {/* SNACKBAR — absolute overlay, never affects layout */}
      {msg && (
        <div
          className={`absolute top-2 left-3 right-3 z-[9999] rounded-xl px-3.5 py-2.5 text-center font-black text-[13px] text-white border border-white/15 shadow-[0_4px_20px_rgba(0,0,0,0.6)] pointer-events-none ${
            msg.ok ? 'bg-green-800/95' : 'bg-red-800/95'
          }`}
        >
          {msg.text}
        </div>
      )}

      {/* HEADER */}
      <div className="shrink-0 flex flex-col items-center pt-2 pb-0.5 bg-gradient-to-b from-black to-transparent">
        <span className="text-white font-black text-[14px] tracking-[0.15em] uppercase">
          DRUN FAMILY
        </span>
        <div className="flex items-center w-full px-5 mt-0.5">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#666]" />
          <span className="text-[#888] text-[9px] tracking-[0.3em] mx-2 italic">game</span>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#666]" />
        </div>
      </div>

      {/* TABS */}
      <div className="shrink-0 flex items-center px-5 pt-1.5 gap-8">
        <button
          onClick={() => navigate('/page14')}
          className="bg-transparent border-x-0 border-t-0 border-b-2 border-b-transparent pb-0.5 font-black text-[15px] tracking-wider uppercase text-white/55 cursor-pointer whitespace-nowrap"
        >
          ПЕРСОНАЖИ
        </button>
        <button
          className="bg-transparent border-x-0 border-t-0 border-b-2 border-b-[#6ecf20] pb-0.5 font-black text-[15px] tracking-wider uppercase text-[#6ecf20] cursor-default whitespace-nowrap"
        >
          УЛУЧШЕНИЯ
        </button>
      </div>

      {/* PROGRESS BAR */}
      <div className="shrink-0 flex items-center gap-2 px-5 pt-1.5">
        <div className="shrink-0 relative w-8 h-8 flex items-center justify-center">
          <div className="w-6 h-6 bg-gradient-to-br from-[#ffe033] via-[#f0c020] to-[#c89000] border-2 border-[#8a6000] rotate-45 shadow-[0_0_8px_rgba(240,192,32,0.6)]" />
          <span className="absolute text-black font-black text-[12px] z-10">
            {user ? profileLevel : <Skel className="w-3 h-3" />}
          </span>
        </div>

        <div className="flex-1 h-2.5 rounded-full bg-white/[0.07] border border-white/15 overflow-hidden shadow-[inset_0_2px_6px_rgba(0,0,0,0.6)]">
          <div
            className="h-full rounded-full transition-[width] duration-500 ease-out"
            style={{
              width: `${progressPct}%`,
              background: 'linear-gradient(90deg,#c89000,#f0c020 45%,#86efac 80%,#6ecf20)',
            }}
          />
        </div>

        <div className="shrink-0 relative w-8 h-8 flex items-center justify-center">
          <div className="w-6 h-6 bg-gradient-to-br from-[#6ecf20] via-[#4aaf10] to-[#2a8a00] border-2 border-[#2a6a08] rotate-45 shadow-[0_0_8px_rgba(110,207,32,0.6)]" />
          <span className="absolute text-white font-black text-[12px] z-10">
            {user ? profileLevelMax : <Skel className="w-3 h-3" />}
          </span>
        </div>
      </div>

      {/* INFO BOX */}
      <div className="shrink-0 mx-3.5 mt-1.5 rounded-xl border border-[#4a4a4a] px-3.5 py-2 shadow-[0_4px_20px_rgba(0,0,0,0.7)]"
        style={{ background: 'linear-gradient(180deg,rgba(20,20,20,0.97),rgba(10,10,10,0.97))' }}
      >
        <p className="text-white/90 font-bold text-[11px] leading-relaxed text-center m-0">
          Прокачивая улучшения, становятся доступными новые уровни персонажей. Прокачав все улучшения персонажа до определённого уровня, вы сможете улучшить персонажа до этого уровня.
        </p>
      </div>

      {/* SCROLLABLE SECTIONS */}
      <div
        className="flex-1 overflow-y-auto overscroll-contain px-3.5 pt-2 pb-8 flex flex-col gap-2"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {SECTIONS.map((sec, i) => (
          <Section
            key={sec.id}
            sec={sec}
            improvData={improvements?.[sec.id] ?? null}
            showDivider={i > 0}
            onUpgrade={handleUpgrade}
            upgradingKey={upgradingKey}
          />
        ))}
      </div>

      <SnackBar />
    </div>
  )
}

export default Page15