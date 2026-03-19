import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaUserPlus } from 'react-icons/fa';
import { FiCheckCircle } from 'react-icons/fi';
import { doClaimDrunRoad, fetchState } from '../redux/gameSlice';

import pageBg      from '../assets/page1bg.webp';
import imgHero     from '../assets/page18Images/hero.webp';
import imgCoin     from '../assets/page14Images/fa_icon.webp';
import SnackBar    from '../components/SnackBar';
import Page19Modal from '../modals/Page19Modal';

const BOT_USERNAME = 'MellFamilyBot'
const ROAD_MAX     = 1000
const MILESTONES   = [0, 5, 10, 25, 50, 100, 200, 500, 1000]

const fmtFa = (n) => {
  if (!n && n !== 0) return '0'
  if (n >= 1e12) return `${(n / 1e12).toFixed(2)}T`
  if (n >= 1e9)  return `${(n / 1e9).toFixed(2)}B`
  if (n >= 1e6)  return `${(n / 1e6).toFixed(2)}M`
  if (n >= 1e3)  return `${(n / 1e3).toFixed(1)}K`
  return String(Math.floor(n))
}

const Skel = ({ className = '' }) => (
  <div className={`bg-white/10 rounded-lg animate-pulse inline-block ${className}`} />
)

// ── Referral row — matches reference exactly ──────────────────
const ReferralRow = ({ r }) => (
  <div
    className="flex items-center gap-3 px-3 py-2.5 rounded-2xl"
    style={{ background: 'rgba(18,18,18,0.9)', border: '1px solid #2a2a2a' }}
  >
    {/* Avatar */}
    <div className="shrink-0 w-11 h-11 rounded-full overflow-hidden border-2 border-[#3a3a3a] bg-[#222] flex items-center justify-center text-xl">
      {r.avatar
        ? <img src={r.avatar} alt="" className="w-full h-full object-cover" />
        : '👤'}
    </div>

    {/* Name + per hour */}
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
        {/* Level badge — gold pill */}
        <span
          className="shrink-0 px-1.5 py-0.5 rounded-full font-black text-[9px] whitespace-nowrap text-black"
          style={{ background: 'linear-gradient(180deg,#f0c020,#c89000)', border: '1px solid #8a6000' }}
        >
          {r.level} lvl
        </span>
        <span className="text-white font-bold text-[13px] truncate">{r.name}</span>
      </div>
      <span className="text-white/45 text-[11px]">{r.per_hour_fmt ?? ''} в час</span>
    </div>

    {/* Earned pill — gold outline, gold text */}
    <div
      className="shrink-0 px-3 py-1.5 rounded-xl"
      style={{ background: 'linear-gradient(180deg,#2a2000,#1a1400)', border: '1px solid #7a5500' }}
    >
      <span className="text-[#f0c020] font-black text-[13px] whitespace-nowrap">
        {fmtFa(r.earned_fa ?? 0)}
      </span>
    </div>
  </div>
)

const Page18 = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((s) => s.game)

  const [showRoad, setShowRoad] = useState(false)
  const [claiming, setClaiming] = useState(false)
  const [msg,      setMsg]      = useState(null)
  const [copied,   setCopied]   = useState(false)

  // ── Redux state ─────────────────────────────────────────────
  const userId         = user?.id                   ?? null
  const drunEarnedFa   = user?.drun_earned_fa       ?? 0
  const drunRoadPoints = user?.drunroad_points       ?? 0
  const refPercent     = user?.ref_percent_effective ?? 38
  const referrals      = user?.referrals             ?? []

  // Progress: orange covers 0→200 range, green covers 200→1000
  // We split the bar into two segments visually
  const ORANGE_MAX = 200
  const orangePct  = Math.min(drunRoadPoints, ORANGE_MAX) / ROAD_MAX * 100
  const greenPct   = Math.max(0, drunRoadPoints - ORANGE_MAX) / ROAD_MAX * 100
  const totalPct   = Math.min((drunRoadPoints / ROAD_MAX) * 100, 100)

  // ── Telegram invite ─────────────────────────────────────────
  const inviteLink = userId ? `https://t.me/${BOT_USERNAME}?start=ref_${userId}` : null
  const inviteText = userId
    ? `https://t.me/share/url?url=${encodeURIComponent(inviteLink)}&text=${encodeURIComponent('🎮 Играй в MELL FAMILY и зарабатывай!')}`
    : null

  const handleInvite = () => {
    if (!inviteText) return
    if (window.Telegram?.WebApp?.openTelegramLink) {
      window.Telegram.WebApp.openTelegramLink(inviteText)
    } else {
      window.open(inviteText, '_blank')
    }
  }

  const handleCopy = async () => {
    if (!inviteLink) return
    try {
      await navigator.clipboard.writeText(inviteLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  const handleClaim = async () => {
    if (claiming || drunEarnedFa <= 0) return
    setClaiming(true)
    try {
      await dispatch(doClaimDrunRoad()).unwrap()
      setMsg({ ok: true, text: '✅ Награда получена!' })
      dispatch(fetchState())
    } catch (e) {
      setMsg({ ok: false, text: `❌ ${e}` })
    }
    setClaiming(false)
    setTimeout(() => setMsg(null), 3000)
  }

  const canClaim = !claiming && drunEarnedFa > 0

  return (
    <div
      className="w-full h-dvh flex flex-col overflow-hidden relative"
      style={{ backgroundImage: `url(${pageBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      {/* Toast */}
      {msg && (
        <div className={`absolute top-2 left-3 right-3 z-[9999] rounded-xl px-3.5 py-2.5 text-center font-black text-[13px] text-white border border-white/15 shadow-[0_4px_20px_rgba(0,0,0,0.6)] pointer-events-none ${msg.ok ? 'bg-green-800/95' : 'bg-red-800/95'}`}>
          {msg.text}
        </div>
      )}

      {/* HEADER */}
      <div className="shrink-0 flex flex-col items-center pt-3 pb-1 bg-gradient-to-b from-black/90 to-transparent">
        <span className="text-white font-black text-[15px] tracking-[0.16em] uppercase leading-none">DRUN FAMILY</span>
        <div className="flex items-center w-full px-6 mt-0.5">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#666]" />
          <span className="text-[#888] text-[9px] tracking-[0.28em] mx-2 italic">game</span>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#666]" />
        </div>
      </div>

      {/* SCROLLABLE BODY */}
      <div className="flex-1 overflow-y-auto overscroll-contain" style={{ WebkitOverflowScrolling: 'touch' }}>

        {/* HERO */}
        <div className="mx-3 mt-1 rounded-2xl overflow-hidden" style={{ height: '28vh', minHeight: 180 }}>
          <img src={imgHero} alt="hero" className="w-full h-full object-cover object-top block" />
        </div>

        {/* INVITE CARD — overlaps hero */}
        <div
          className="mx-3 -mt-6 relative z-10 rounded-2xl px-3 py-2.5 border border-white"
          style={{ background: '#808080' }}
        >
          <p
            className="text-black font-black text-center uppercase leading-snug mb-2 text-[12px]"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            ПРИГЛАШАЙ ДРУНОВ И<br />ПОЛУЧАЙ {Math.round(refPercent)}% ОТ ИХ ДОХОДА
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleInvite}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-full font-black text-white text-[11px] uppercase tracking-wide cursor-pointer active:opacity-80"
              style={{ background: '#111', border: '2px solid #333', fontFamily: "'Inter', sans-serif" }}
            >
              ПРИГЛАСИТЬ ДРУНА
              <FaUserPlus size={14} />
            </button>
            <button
              onClick={handleCopy}
              className="shrink-0 flex items-center justify-center rounded-full cursor-pointer active:opacity-80 transition-all"
              style={{
                width: 46, height: 38,
                background: copied ? '#1a5a10' : '#111',
                border: `2px solid ${copied ? '#4aaa20' : '#333'}`,
              }}
            >
              {copied
                ? <FiCheckCircle size={18} color="#4aaa20" />
                : <svg width="26" height="16" viewBox="0 0 28 18" fill="none">
                    <rect x="1"  y="2" width="11" height="14" rx="7" stroke="white" strokeWidth="2.5"/>
                    <rect x="16" y="2" width="11" height="14" rx="7" stroke="white" strokeWidth="2.5"/>
                    <rect x="8"  y="6" width="12" height="6"  fill="#111"/>
                  </svg>
              }
            </button>
          </div>
        </div>

        {/* DRUN ROAD */}
        <div
          onClick={() => setShowRoad(true)}
          className="mx-3 mt-3 rounded-2xl px-3 pt-2.5 pb-5 cursor-pointer active:opacity-90 transition-opacity"
          style={{ background: 'radial-gradient(circle at 50% 50%, #808080, #989898)' }}
        >
          <h2 className="text-white font-black text-[18px] tracking-wide mb-0.5 italic">
            DRUN ROAD 1000
          </h2>
          <p className="text-white/80 font-black text-[9px] uppercase tracking-widest mb-3">
            ПРИГЛАШАЙ БОЛЬШЕ, ПОЛУЧАЙ БОЛЬШЕ
          </p>

          {/* PROGRESS BAR + DIAMONDS */}
          <div className="relative pb-5">
            {/* Bar: orange segment + green segment */}
            <div className="h-[5px] w-full rounded-full overflow-hidden flex" style={{ background: '#444' }}>
              {/* orange portion — up to 200 */}
              <div style={{ width: `${orangePct}%`, background: '#b58030', flexShrink: 0 }} />
              {/* green portion — from 200 onwards */}
              <div style={{ width: `${greenPct}%`, background: '#53a00d', flexShrink: 0 }} />
            </div>

            {/* Diamonds + labels — equally spaced by index */}
            <div className="absolute top-[-4px] left-0 w-full">
              {MILESTONES.map((m, idx) => {
                const pct     = (idx / (MILESTONES.length - 1)) * 100
                const done    = drunRoadPoints >= m
                // diamond color matches bar color at that milestone
                const isGreen = m >= 500
                const dotColor = done
                  ? (isGreen ? '#53a00d' : '#b58030')
                  : '#3a3a3a'
                return (
                  <div
                    key={m}
                    className="absolute flex flex-col items-center"
                    style={{ left: `${pct}%`, transform: 'translateX(-50%)' }}
                  >
                    {/* Diamond */}
                    <div
                      style={{
                        width: 11, height: 11,
                        transform: 'rotate(45deg)',
                        background: dotColor,
                        border: done ? 'none' : '1px solid #555',
                        flexShrink: 0,
                      }}
                    />
                    {/* Label */}
                    <span
                      className="font-bold whitespace-nowrap"
                      style={{ fontSize: 8, marginTop: 5, color: done ? '#111' : '#555' }}
                    >
                      {m}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* SECTION TITLE */}
        <h2 className="text-white font-black text-center text-xl mt-3 mb-2 px-3">
          Твои рефералы
        </h2>

        {/* EARNINGS + CLAIM — dark card matching reference */}
        <div
          className="mx-3 rounded-2xl px-4 py-3 flex items-center gap-3 mb-2.5"
          style={{ background: 'rgba(15,12,5,0.95)', border: '1.5px solid #3a2a00' }}
        >
          <div className="flex-1 min-w-0">
            <p className="text-white font-bold text-[13px] mb-0.5 leading-none">Друны заработали:</p>
            <div className="flex items-center gap-1.5 mt-1">
              {user
                ? <span className="text-[#f0c020] font-black leading-none" style={{ fontSize: 26 }}>
                    {fmtFa(drunEarnedFa)}
                  </span>
                : <Skel className="w-20 h-6" />
              }
              <img src={imgCoin} alt="" className="w-6 h-6 object-contain" />
            </div>
          </div>
          <button
            onClick={handleClaim}
            disabled={!canClaim}
            className="shrink-0 px-5 py-2.5 rounded-2xl font-black text-[17px] italic transition-all active:scale-95"
            style={{
              background: canClaim ? 'linear-gradient(180deg,#f0c020,#c89000)' : 'rgba(100,80,0,0.3)',
              border: '2px solid #8a6000',
              boxShadow: canClaim ? '0 4px 0 #5a3a00' : 'none',
              color: '#000',
              cursor: canClaim ? 'pointer' : 'not-allowed',
              opacity: canClaim ? 1 : 0.55,
            }}
          >
            {claiming ? '...' : 'забрать'}
          </button>
        </div>

        {/* REFERRAL LIST — from Redux user.referrals */}
        <div className="px-3 flex flex-col gap-2 pb-24">
          {!user ? (
            /* skeleton loading */
            [1,2,3].map(i => (
              <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-2xl"
                style={{ background: 'rgba(18,18,18,0.9)', border: '1px solid #2a2a2a' }}>
                <Skel className="w-11 h-11 rounded-full" />
                <div className="flex-1 flex flex-col gap-1.5">
                  <Skel className="w-28 h-3" />
                  <Skel className="w-20 h-3" />
                </div>
                <Skel className="w-14 h-7 rounded-xl" />
              </div>
            ))
          ) : referrals.length === 0 ? (
            /* empty state */
            <div className="flex flex-col items-center py-8 gap-3">
              <span className="text-5xl">👥</span>
              <p className="text-white/50 font-bold text-[14px] text-center m-0">
                У тебя пока нет рефералов.<br />Пригласи друзей!
              </p>
            </div>
          ) : (
            /* real referrals from Redux */
            referrals.map((r, i) => <ReferralRow key={r.id ?? i} r={r} />)
          )}
        </div>

      </div>

      <SnackBar />
      <Page19Modal isOpen={showRoad} onClose={() => setShowRoad(false)} />
    </div>
  )
}

export default Page18