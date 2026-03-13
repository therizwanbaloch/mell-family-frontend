import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { doUpgradeCharacter, fetchState } from '../redux/gameSlice';

import pageBg       from '../assets/page1bg.webp';
import imgDrunstroy from '../assets/page14Images/drunstroy.webp';
import imgGanzapad  from '../assets/page14Images/ganzapad.webp';
import imgSub5      from '../assets/page14Images/sub5.webp';
import imgFaIcon    from '../assets/page14Images/fa_icon.webp';
import SnackBar from '../components/SnackBar';

const Skel = ({ className = '' }) => (
  <div className={`bg-black/10 rounded-lg animate-pulse ${className}`} />
)

const useCooldown = (ts) => {
  const calc = () => ts ? Math.max(0, ts - Math.floor(Date.now() / 1000)) : 0
  const [secs, setSecs] = useState(calc)
  useEffect(() => {
    setSecs(calc())
    const id = setInterval(() => setSecs(calc()), 1000)
    return () => clearInterval(id)
  }, [ts])
  return secs
}

const fmtTimer = (s) => {
  const h = Math.floor(s / 3600)
  const m = String(Math.floor((s % 3600) / 60)).padStart(2, '0')
  const sec = String(s % 60).padStart(2, '0')
  return `${h}:${m}:${sec}`
}

const fmtFa = (n) => {
  if (!n && n !== 0) return '?'
  if (n >= 1e12) return `${(n / 1e12).toFixed(1)}T`
  if (n >= 1e9)  return `${(n / 1e9).toFixed(1)}B`
  if (n >= 1e6)  return `${(n / 1e6).toFixed(1)}M`
  if (n >= 1e3)  return `${(n / 1e3).toFixed(1)}K`
  return String(Math.floor(n))
}

const CHARS = {
  drunstroy: {
    img:        imgDrunstroy,
    name:       'DRUNSTROY',
    perks:      ['Прибыль в слотах', 'Доход в час'],
    avatarBg:   'linear-gradient(135deg,#8b0000,#c0392b,#7a0000)',
    accent:     '#c89000',
    levelBg:    'bg-[#c89000]',
    levelColor: 'text-black',
    btnClass:   'bg-gradient-to-b from-[#f0c020] to-[#c89000] border-[#8a6000] shadow-[0_4px_0_#6a4000] text-black',
    btnDisabled:'bg-black/15 border-transparent shadow-none text-[#555]',
    displayLevel: 47,
  },
  ganzapad: {
    img:        imgGanzapad,
    name:       'GANZAPAD',
    perks:      ['Доход за клик', 'Время сбора денег'],
    avatarBg:   'linear-gradient(135deg,#0a1a5a,#1a4aa0,#0a2060)',
    accent:     '#7b3ff2',
    levelBg:    'bg-[#7b3ff2]',
    levelColor: 'text-white',
    btnClass:   'bg-gradient-to-b from-[#9b5ff4] to-[#6b2fc4] border-[#5b1fa4] shadow-[0_4px_0_#3b0f84] text-white',
    btnDisabled:'bg-black/15 border-transparent shadow-none text-[#555]',
    displayLevel: 46,
  },
  sub5: {
    img:        imgSub5,
    name:       'SUB-5',
    perks:      ['Прибыль с друнов', 'Доход с бонусов'],
    avatarBg:   'linear-gradient(135deg,#7a5000,#c8880a,#5a3a00)',
    accent:     '#888',
    levelBg:    'bg-[#888]',
    levelColor: 'text-white',
    btnClass:   'bg-gradient-to-b from-[#777] to-[#555] border-[#444] shadow-[0_4px_0_#222] text-white',
    btnDisabled:'bg-black/15 border-transparent shadow-none text-[#555]',
    displayLevel: 49,
  },
}

const COSTS = {
  drunstroy: 16_900_000_000,
  ganzapad:  null,
  sub5:      1_400_000_000_000,
}

const CharacterCard = ({ charKey, charData, onUpgrade, upgrading }) => {
  const cfg          = CHARS[charKey]
  const cooldownSecs = useCooldown(charData?.cooldown_end_ts)
  const isCooling    = cooldownSecs > 0
  const isMaxed      = charData?.is_maxed || false
  const reqLevel     = charData?.required_level ?? charData?.level ?? cfg.displayLevel
  const cost         = charData?.upgrade_cost ?? COSTS[charKey]
  const state        = isMaxed ? 'maxed' : isCooling ? 'timer' : 'upgrade'

  if (!cfg) return null

  const pillBase = 'w-full flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-full font-black text-xs whitespace-nowrap border-2'

  const ActionBtn = () => {
    if (!charData) return <Skel className="w-full h-8 rounded-full" />

    if (state === 'upgrade') return (
      <button
        onClick={() => onUpgrade(charKey)}
        disabled={upgrading}
        className={`${pillBase} transition-transform active:scale-95 active:translate-y-0.5 ${
          upgrading
            ? `${cfg.btnDisabled} cursor-not-allowed opacity-70`
            : `${cfg.btnClass} cursor-pointer`
        }`}
      >
        {upgrading ? 'Улучшение...' : (
          <>
            <span>Улучшить</span>
            <span className="flex items-center gap-1">
              {cost != null ? fmtFa(cost) : '—'}
              <img src={imgFaIcon} alt="" className="w-4 h-4 object-contain shrink-0" />
            </span>
          </>
        )}
      </button>
    )

    if (state === 'timer') return (
      <div className={`${pillBase} ${cfg.btnClass}`}>
        Осталось {fmtTimer(cooldownSecs)}
      </div>
    )

    return (
      <div className={`${pillBase} bg-black/10 border-black/20 text-[#444]`}>
        Максимум
      </div>
    )
  }

  return (
    <div className="rounded-2xl bg-[#b4b4b4] border border-[#999] shadow-[0_4px_16px_rgba(0,0,0,0.35)] overflow-hidden flex items-stretch h-[108px] shrink-0">
      {/* LEFT */}
      <div
        className="shrink-0 w-[108px] h-[108px] p-2 box-border"
        style={{ background: cfg.avatarBg, borderRight: `2px solid ${cfg.accent}55` }}
      >
        <img src={cfg.img} alt={cfg.name} className="w-full h-full object-cover rounded-lg block" />
      </div>

      {/* RIGHT */}
      <div className="flex-1 min-w-0 flex flex-col justify-between p-2 pl-2.5 relative overflow-hidden">
        <span className={`absolute top-1.5 right-2 ${cfg.levelBg} ${cfg.levelColor} font-black text-[10px] px-1.5 py-0.5 rounded-full whitespace-nowrap z-10`}>
          ур. {reqLevel}
        </span>

        <span className="text-[#111] font-black text-[15px] tracking-wider leading-tight pr-14">
          {cfg.name}
        </span>

        <div className="flex flex-col gap-0.5">
          {cfg.perks.map((p, i) => (
            <span key={i} className="text-[#444] font-semibold text-[11px] leading-tight">{p}</span>
          ))}
        </div>

        <ActionBtn />
      </div>
    </div>
  )
}


const Page14 = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user, characters } = useSelector((s) => s.game)

  const [upgradingKey, setUpgradingKey] = useState(null)
  const [msg,          setMsg]          = useState(null)

  const profileLevel    = user?.profile_level ?? 0
  const profileLevelMax = user?.profile_level_max ?? (profileLevel + 1)
  const profileXp       = user?.profile_xp ?? 0
  const profileXpNeeded = user?.profile_xp_needed ?? 100
  const progressPct     = profileXpNeeded > 0 ? Math.min(100, Math.round((profileXp / profileXpNeeded) * 100)) : 0

  const handleUpgrade = async (key) => {
    setUpgradingKey(key)
    try {
      await dispatch(doUpgradeCharacter(key)).unwrap()
      setMsg({ ok: true, text: `${CHARS[key]?.name} улучшен!` })
      dispatch(fetchState())
    } catch (e) {
      setMsg({ ok: false, text: `${e}` })
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
      {/* SNACKBAR */}
      {msg && (
        <div
          className={`absolute top-2 left-3 right-3 z-[9999] rounded-xl px-3 py-2 text-center font-black text-[13px] text-white border border-white/15 shadow-[0_4px_20px_rgba(0,0,0,0.6)] pointer-events-none ${
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
        {['ПЕРСОНАЖИ', 'УЛУЧШЕНИЯ'].map((tab, i) => (
          <button
            key={i}
            onClick={() => i === 1 && navigate('/page15')}
            className={`bg-transparent border-x-0 border-t-0 border-b-2 pb-0.5 font-black text-[15px] tracking-wider uppercase whitespace-nowrap ${
              i === 0
                ? 'text-[#6ecf20] border-b-[#6ecf20] cursor-default'
                : 'text-white/55 border-b-transparent cursor-pointer'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* PROGRESS BAR */}
      <div className="shrink-0 flex items-center gap-2 px-5 pt-1.5">
        <div className="shrink-0 relative w-8 h-8 flex items-center justify-center">
          <div className="w-6 h-6 bg-gradient-to-br from-[#ffe033] via-[#f0c020] to-[#c89000] border-2 border-[#8a6000] rotate-45 shadow-[0_0_8px_rgba(240,192,32,0.6)]" />
          <span className="absolute text-black font-black text-[12px] z-10">
            {user ? profileLevel : <Skel className="w-3 h-3 rounded-sm" />}
          </span>
        </div>

        <div className="flex-1 h-2.5 rounded-full bg-white/[0.07] border border-white/15 overflow-hidden">
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
            {user ? profileLevelMax : <Skel className="w-3 h-3 rounded-sm" />}
          </span>
        </div>
      </div>

      {/* DESCRIPTION */}
      <div className="shrink-0 mx-3.5 mt-1.5 rounded-xl bg-black/70 border border-white/10 px-3 py-2">
        <p className="text-white/[0.82] font-semibold text-[11px] leading-relaxed text-center m-0">
          Улучшая персонажей, вы увеличиваете свой уровень. Каждый уровень даёт +2% ко всем доходам, а на последнем уровне станет доступен вывод средств.
        </p>
      </div>

      {/* CARDS — min-h-0 makes flex child respect parent height, scroll only when needed */}
      <div
        className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-3.5 pt-2 pb-24 flex flex-col gap-2.5"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {['drunstroy', 'ganzapad', 'sub5'].map((key) => (
          <CharacterCard
            key={key}
            charKey={key}
            charData={characters?.[key] ?? null}
            onUpgrade={handleUpgrade}
            upgrading={upgradingKey === key}
          />
        ))}
      </div>

      <SnackBar />
    </div>
  )
}

export default Page14