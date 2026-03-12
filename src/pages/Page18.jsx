import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaUserPlus } from 'react-icons/fa';
import { doClaimDrunRoad, fetchState } from '../redux/gameSlice';

import pageBg      from '../assets/page1bg.webp';
import imgHero     from '../assets/page18Images/hero.webp';
import imgCoin     from '../assets/page14Images/fa_icon.webp';
import SnackBar    from '../components/SnackBar';
import Page19Modal from '../modals/Page19Modal';

// ── Telegram bot username ─────────────────────────────────────
const BOT_USERNAME = 'MellFamilyBot'

// ── Drun Road config ──────────────────────────────────────────
const ROAD_MAX   = 1000
const MILESTONES = [0, 5, 10, 25, 50, 100, 200, 500, 1000]

// ── Format FA numbers ─────────────────────────────────────────
const fmtFa = (n) => {
  if (!n && n !== 0) return '0'
  if (n >= 1e12) return `${(n / 1e12).toFixed(2)}T`
  if (n >= 1e9)  return `${(n / 1e9).toFixed(2)}B`
  if (n >= 1e6)  return `${(n / 1e6).toFixed(2)}M`
  if (n >= 1e3)  return `${(n / 1e3).toFixed(1)}K`
  return String(Math.floor(n))
}

// ── Skeleton ──────────────────────────────────────────────────
const Skel = ({ className = '' }) => (
  <div className={`bg-white/10 rounded-lg animate-pulse inline-block ${className}`} />
)

// ── Referral Row — real data only ─────────────────────────────
const ReferralRow = ({ r }) => (
  <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-2xl border border-[#3a3a3a]"
    style={{ background: 'rgba(30,30,30,0.92)' }}
  >
    <div className="shrink-0 w-12 h-12 rounded-full bg-[#2a2a2a] border-2 border-[#444] flex items-center justify-center text-[22px] overflow-hidden">
      {r.avatar
        ? <img src={r.avatar} alt="" className="w-full h-full object-cover" />
        : '👤'}
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-1.5 mb-0.5">
        <span
          className="shrink-0 px-1.5 py-0.5 rounded-full text-white font-black text-[10px] whitespace-nowrap border border-[#4aaa20]"
          style={{ background: 'linear-gradient(180deg,#3a8a10,#236008)' }}
        >
          {r.level} lvl
        </span>
        <span className="text-white font-bold text-[13px] truncate">{r.name}</span>
      </div>
      <span className="text-white/45 text-[11px] font-medium">{r.per_hour_fmt ?? ''}</span>
    </div>
    <div
      className="shrink-0 px-3.5 py-1.5 rounded-xl border border-[#7a5500]"
      style={{ background: 'linear-gradient(180deg,#2a2000,#1a1400)' }}
    >
      <span className="text-[#f0c020] font-black text-sm whitespace-nowrap">
        {fmtFa(r.earned_fa ?? 0)}
      </span>
    </div>
  </div>
)

// ── Page 18 ───────────────────────────────────────────────────
const Page18 = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((s) => s.game)

  const [showRoad, setShowRoad] = useState(false)
  const [claiming, setClaiming] = useState(false)
  const [msg,      setMsg]      = useState(null)
  const [copied,   setCopied]   = useState(false)

  // ── Real values from Redux ──────────────────────────────────
  const userId         = user?.id                      ?? null
  const drunEarnedFa   = user?.drun_earned_fa          ?? 0
  const drunRoadPoints = user?.drunroad_points          ?? 0
  const refPercent     = user?.ref_percent_effective    ?? 38
  const referrals      = user?.referrals                ?? []   // array from API
  const progressPct    = Math.min((drunRoadPoints / ROAD_MAX) * 100, 100)

  // ── Telegram invite links ───────────────────────────────────
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
        <div className={`absolute top-2 left-3 right-3 z-[9999] rounded-xl px-3.5 py-2.5 text-center font-black text-[13px] text-white border border-white/15 shadow-[0_4px_20px_rgba(0,0,0,0.6)] pointer-events-none ${
          msg.ok ? 'bg-green-800/95' : 'bg-red-800/95'
        }`}>
          {msg.text}
        </div>
      )}

      {/* HEADER */}
      <div
        className="shrink-0 flex flex-col items-center pt-2.5 pb-0.5"
        style={{ background: 'linear-gradient(180deg,rgba(0,0,0,0.9),transparent)' }}
      >
        <span className="text-white font-black text-[15px] tracking-[0.16em] uppercase leading-none">
          DRUN FAMILY
        </span>
        <div className="flex items-center w-full px-6 mt-1">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#666]" />
          <span className="text-[#888] text-[10px] tracking-[0.28em] mx-2.5 italic">game</span>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#666]" />
        </div>
      </div>

      {/* SCROLLABLE BODY */}
      <div
        className="flex-1 overflow-y-auto overscroll-contain flex flex-col gap-2.5 px-3 pt-1.5 pb-5"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >

        {/* 1 — HERO */}
        <div className="shrink-0 rounded-2xl overflow-hidden border-2 border-[#2a2a2a] shadow-[0_4px_24px_rgba(0,0,0,0.9)]">
          <img
            src={imgHero} alt="hero"
            className="w-full object-cover object-top block"
            style={{ height: 'clamp(170px,44vw,220px)' }}
          />
        </div>

        {/* 2 — INVITE CARD */}
        <div className="shrink-0 rounded-2xl bg-[#808080] border border-[#666] shadow-[0_4px_16px_rgba(0,0,0,0.5)] p-3.5">
          <p
            className="text-white font-black text-center uppercase tracking-wide leading-snug m-0 mb-3"
            style={{ fontSize: 'clamp(13px,3.8vw,16px)', textShadow: '0 1px 3px rgba(0,0,0,0.4)' }}
          >
            ПРИГЛАШАЙ ДРУНОВ И<br />ПОЛУЧАЙ {Math.round(refPercent)}% ОТ ИХ ДОХОДА
          </p>

          <div className="flex gap-2">
            {/* Invite button */}
            <button
              onClick={handleInvite}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-2 rounded-2xl border-2 border-[#444] text-white font-black uppercase tracking-wider cursor-pointer active:opacity-80 transition-opacity"
              style={{
                background: 'linear-gradient(180deg,#1e1e1e,#0e0e0e)',
                fontSize: 'clamp(11px,3vw,13px)',
              }}
            >
              ПРИГЛАСИТЬ ДРУНА
              <FaUserPlus size={18} className="shrink-0" />
            </button>

            {/* Copy link button */}
            <button
              onClick={handleCopy}
              className="shrink-0 w-14 rounded-2xl flex items-center justify-center cursor-pointer active:opacity-80 transition-all duration-200"
              style={{
                background: copied ? 'linear-gradient(180deg,#1a5a10,#0e3008)' : 'linear-gradient(180deg,#1e1e1e,#0e0e0e)',
                border: `2px solid ${copied ? '#4aaa20' : '#444'}`,
                minHeight: 48,
              }}
            >
              {copied
                ? <span className="text-xl">✅</span>
                : <svg width="30" height="22" viewBox="0 0 30 22" fill="none">
                    <rect x="1"  y="4" width="13" height="13" rx="6.5" stroke="white" strokeWidth="2.5"/>
                    <rect x="16" y="4" width="13" height="13" rx="6.5" stroke="white" strokeWidth="2.5"/>
                    <rect x="9"  y="7" width="12" height="7"  rx="0"   fill="#111"/>
                  </svg>
              }
            </button>
          </div>
        </div>

        {/* 3 — DRUN ROAD */}
        <div
          onClick={() => setShowRoad(true)}
          className="shrink-0 rounded-2xl border border-[#5a5640] shadow-[0_4px_16px_rgba(0,0,0,0.6)] px-3.5 pt-3.5 pb-2.5 cursor-pointer active:opacity-90 transition-opacity"
          style={{ background: 'linear-gradient(180deg,rgba(55,52,40,0.97),rgba(30,28,20,0.97))' }}
        >
          <div className="mb-0.5">
            <span className="text-white font-black italic tracking-wide" style={{ fontSize: 'clamp(20px,5.5vw,26px)' }}>
              DRUN ROAD 1000
            </span>
          </div>
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-white/55 font-extrabold text-[11px] uppercase tracking-widest">
              ПРИГЛАШАЙ БОЛЬШЕ, ПОЛУЧАЙ БОЛЬШЕ
            </span>
            <span className="text-[#f0b800] font-black text-[13px] whitespace-nowrap">
              {user ? `${drunRoadPoints} / ${ROAD_MAX}` : <Skel className="w-12 h-3.5" />}
            </span>
          </div>

          {/* Progress bar with milestone diamonds */}
          <div className="relative mb-4">
            <div
              className="h-2.5 rounded-full border border-white/10 relative overflow-visible"
              style={{ background: 'rgba(255,255,255,0.08)' }}
            >
              <div
                className="h-full rounded-full transition-[width] duration-500 ease-out"
                style={{
                  width: `${progressPct}%`,
                  background: 'linear-gradient(90deg,#c89000,#f0b800 55%,#5ecf10)',
                }}
              />
              {MILESTONES.map((m, i) => {
                const pct  = (m / ROAD_MAX) * 100
                const done = drunRoadPoints >= m
                const end  = pct > 60
                return (
                  <div
                    key={i}
                    className="absolute w-2.5 h-2.5 z-10"
                    style={{
                      top: '50%', left: `${pct}%`,
                      transform: 'translate(-50%,-50%) rotate(45deg)',
                      background: done ? (end ? '#5ecf10' : '#f0b800') : 'rgba(255,255,255,0.15)',
                      border: `1.5px solid ${done ? (end ? '#2a8a00' : '#8a6000') : '#444'}`,
                    }}
                  />
                )
              })}
            </div>
            {/* Milestone labels */}
            <div className="relative h-3.5 mt-1">
              {MILESTONES.map((m, i) => (
                <span
                  key={i}
                  className="absolute text-white/40 font-semibold whitespace-nowrap"
                  style={{ left: `${(m / ROAD_MAX) * 100}%`, transform: 'translateX(-50%)', fontSize: 9 }}
                >
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 4 — SECTION TITLE */}
        <h2 className="text-white font-black text-center shrink-0 m-0" style={{ fontSize: 'clamp(18px,5vw,22px)' }}>
          Твои рефералы
        </h2>

        {/* 5 — EARNINGS + CLAIM */}
        <div
          className="shrink-0 rounded-2xl border border-[#5a5030] px-3.5 py-3 flex items-center gap-3"
          style={{ background: 'linear-gradient(180deg,rgba(42,38,22,0.97),rgba(24,20,10,0.97))' }}
        >
          <div className="flex-1">
            <div className="text-white font-bold text-sm mb-1">Друны заработали:</div>
            <div className="flex items-center gap-1.5">
              {user
                ? <span className="text-[#f0c020] font-black leading-none" style={{ fontSize: 'clamp(22px,6vw,28px)' }}>
                    {fmtFa(drunEarnedFa)}
                  </span>
                : <Skel className="w-24 h-7" />
              }
              <img src={imgCoin} alt="coin" className="w-7 h-7 object-contain" />
            </div>
          </div>

          <button
            onClick={handleClaim}
            disabled={!canClaim}
            className="shrink-0 px-6 py-3 rounded-2xl border-2 border-[#8a6000] font-black italic transition-all duration-150 active:translate-y-0.5"
            style={{
              background: canClaim ? 'linear-gradient(180deg,#f0c020,#c89000)' : 'rgba(100,80,0,0.4)',
              boxShadow: canClaim ? '0 4px 0 #5a3a00' : 'none',
              color: '#000',
              fontSize: 'clamp(14px,4vw,18px)',
              cursor: canClaim ? 'pointer' : 'not-allowed',
              opacity: canClaim ? 1 : 0.6,
            }}
          >
            {claiming ? '...' : 'забрать'}
          </button>
        </div>

        {/* 6 — REFERRAL LIST — real data only */}
        {!user ? (
          // Loading state
          <div className="flex flex-col gap-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center gap-2.5 px-3 py-2.5 rounded-2xl border border-[#3a3a3a]"
                style={{ background: 'rgba(30,30,30,0.92)' }}
              >
                <Skel className="w-12 h-12 rounded-full" />
                <div className="flex-1 flex flex-col gap-1.5">
                  <Skel className="w-24 h-3.5" />
                  <Skel className="w-16 h-3" />
                </div>
                <Skel className="w-16 h-8 rounded-xl" />
              </div>
            ))}
          </div>
        ) : referrals.length === 0 ? (
          // Empty state
          <div className="flex flex-col items-center justify-center py-8 gap-3">
            <span className="text-5xl">👥</span>
            <p className="text-white/50 font-bold text-[15px] text-center m-0">
              У тебя пока нет рефералов.<br />Пригласи друзей!
            </p>
          </div>
        ) : (
          // Real referral list
          <div className="flex flex-col gap-2">
            {referrals.map((r, i) => <ReferralRow key={r.id ?? i} r={r} />)}
          </div>
        )}

      </div>

      <SnackBar />
      <Page19Modal isOpen={showRoad} onClose={() => setShowRoad(false)} />
    </div>
  )
}

export default Page18