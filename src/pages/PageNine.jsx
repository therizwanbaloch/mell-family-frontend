import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { fetchTournaments, fetchTicketLeaderboard, doPlaceBet, fetchState } from '../redux/gameSlice'

import pageBg        from '../assets/page1bg.webp'
import imgHeroBanner from '../assets/page9Images/cardbg.webp'
import imgTicketIcon from '../assets/page9Images/ticket-icon.webp'
import imgTicketSmall from '../assets/page9Images/ticket-small.webp'
import imgMedal1     from '../assets/page9Images/medal-1.webp'
import imgMedal2     from '../assets/page9Images/medal-2.webp'
import imgMedal3     from '../assets/page9Images/medal-3.webp'
import imgModalBanner from '../assets/page9Images/modal-banner.webp'

// ── Skeleton ──────────────────────────────────────────────────
const Skel = ({ w = '80px', h = '16px', radius = '6px' }) => (
  <div style={{
    width: w, height: h, borderRadius: radius,
    background: 'rgba(255,255,255,0.1)',
    animation: 'skelPulse 1.4s ease-in-out infinite',
    display: 'inline-block',
  }} />
)

// ── Countdown hook ────────────────────────────────────────────
const useEndTsCountdown = (endTs) => {
  const calc = () => {
    if (!endTs) return '--:--:--'
    const diff = Math.max(0, endTs - Math.floor(Date.now() / 1000))
    const h = String(Math.floor(diff / 3600)).padStart(2, '0')
    const m = String(Math.floor((diff % 3600) / 60)).padStart(2, '0')
    const s = String(diff % 60).padStart(2, '0')
    return `${h}:${m}:${s}`
  }
  const [display, setDisplay] = useState(calc)
  useEffect(() => {
    const id = setInterval(() => setDisplay(calc()), 1000)
    return () => clearInterval(id)
  }, [endTs])
  return display
}

// ── Rank badge ────────────────────────────────────────────────
const RankBadge = ({ rank }) => {
  if (rank === 1) return <img src={imgMedal1} alt="1" className="w-9 h-9 object-contain" />
  if (rank === 2) return <img src={imgMedal2} alt="2" className="w-9 h-9 object-contain" />
  if (rank === 3) return <img src={imgMedal3} alt="3" className="w-9 h-9 object-contain" />
  return <span className="font-black text-white text-base w-9 text-center block">{rank}</span>
}

// ── Player row ────────────────────────────────────────────────
const PlayerRow = ({ player, highlight }) => {
  const rowBg =
    player.rank === 1 ? 'linear-gradient(90deg,#2a1a00,#3a2800)' :
    player.rank === 2 ? 'linear-gradient(90deg,#0a1a2a,#102040)' :
    player.rank === 3 ? 'linear-gradient(90deg,#1a1000,#2a1800)' :
    highlight         ? 'linear-gradient(90deg,#1a1a1a,#2a2a2a)' :
                        'linear-gradient(90deg,#111,#1a1a1a)'
  const rowBorder =
    player.rank === 1 ? '#c89000' :
    player.rank === 2 ? '#2060a0' :
    player.rank === 3 ? '#8a5000' :
    highlight         ? '#555'    : '#2a2a2a'

  const fmt = (n) => Number(n ?? 0).toLocaleString('ru-RU')

  return (
    <div
      className="flex items-center gap-2 rounded-2xl px-2 py-1.5 shrink-0"
      style={{ background: rowBg, border: `1.5px solid ${rowBorder}`, minHeight: '52px' }}
    >
      <div className="flex items-center justify-center shrink-0 w-9">
        <RankBadge rank={player.rank} />
      </div>
      <div
        className="rounded-full overflow-hidden shrink-0 flex items-center justify-center w-10 h-10"
        style={{ background: '#333', border: `2px solid ${rowBorder}` }}
      >
        {player.avatar
          ? <img src={player.avatar} alt={player.name} className="w-full h-full object-cover" />
          : <span className="text-xl">👤</span>
        }
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1 flex-wrap">
          {player.flag && <span className="text-sm">{player.flag}</span>}
          <span
            className="font-black text-white shrink-0 text-[11px] rounded-full px-1.5 py-px"
            style={{ background: '#2a5a2a', border: '1px solid #4a9a20' }}
          >
            {player.level ?? '?'} lvl
          </span>
          {player.isMe && <span className="font-black text-yellow-300 text-[13px]">ВЫ</span>}
          <span className="text-white font-semibold truncate text-[13px]">{player.name}</span>
        </div>
      </div>
      <div
        className="flex items-center gap-1 rounded-full px-2 py-1 shrink-0"
        style={{ background: 'linear-gradient(180deg,#5a4a00,#3a3000)', border: '1.5px solid #c89000' }}
      >
        <img src={imgTicketSmall} alt="ticket" className="w-4 h-4 object-contain" />
        <span className="font-black text-yellow-300 text-[13px]">{fmt(player.tickets)}</span>
      </div>
    </div>
  )
}

// ── Info modal (Page 11 tooltip) ──────────────────────────────
const TournamentInfoModal = ({ isOpen, onClose, endTs }) => {
  const [visible,   setVisible]   = useState(false)
  const [animateIn, setAnimateIn] = useState(false)
  const countdown = useEndTsCountdown(endTs)

  useEffect(() => {
    if (isOpen) {
      setVisible(true)
      requestAnimationFrame(() => requestAnimationFrame(() => setAnimateIn(true)))
    } else {
      setAnimateIn(false)
      const t = setTimeout(() => setVisible(false), 350)
      return () => clearTimeout(t)
    }
  }, [isOpen])

  if (!visible) return null

  return (
    <div
      onClick={onClose}
      className={`fixed inset-0 z-50 flex items-center justify-center px-4 transition-all duration-300
        ${animateIn ? 'bg-black/70 backdrop-blur-sm' : 'bg-black/0 backdrop-blur-none'}`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-sm flex flex-col rounded-3xl overflow-hidden shadow-2xl
          transition-all duration-300 overflow-y-auto
          ${animateIn ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'}`}
        style={{
          background: 'linear-gradient(180deg,#6a6a6a,#4a4a4a)',
          border: '2px solid #888',
          maxHeight: '88dvh',
        }}
      >
        {/* Close */}
        <div className="flex justify-end px-4 pt-4 pb-2 shrink-0">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 font-black text-white text-sm active:scale-95 transition-transform"
            style={{ background: 'linear-gradient(180deg,#555,#333)', border: '1.5px solid #777' }}
          >
            <span className="text-red-400 text-base">✕</span> Закрыть
          </button>
        </div>

        {/* Banner */}
        <div className="px-4 shrink-0">
          <div className="rounded-2xl overflow-hidden" style={{ border: '1.5px solid #666' }}>
            <img src={imgModalBanner} alt="tournament" className="w-full object-cover h-[210px]" />
          </div>
        </div>

        {/* Description */}
        <div className="px-5 pt-4 pb-3 shrink-0">
          <p className="text-white font-bold text-center leading-snug" style={{ fontSize: 'clamp(14px,4vw,16px)' }}>
            Ставь билеты и получи шанс стать самым богатым в{' '}
            <span className="font-black">DRUN FAMILY GAME!</span>
          </p>
        </div>

        {/* Countdown */}
        <div className="px-4 pb-2 shrink-0">
          <div
            className="rounded-2xl flex flex-col items-center justify-center py-4"
            style={{ background: 'linear-gradient(180deg,#1a1a1a,#0d0d0d)', border: '2px solid #555' }}
          >
            <p className="font-black text-white uppercase tracking-widest text-[13px]">ОСТАЛОСЬ</p>
            <p className="font-black text-white" style={{ fontSize: 'clamp(38px,12vw,52px)', letterSpacing: '0.06em', lineHeight: 1.1 }}>
              {countdown}
            </p>
          </div>
        </div>

        {/* Subtitle */}
        <div className="px-5 py-2 shrink-0">
          <p className="text-white font-semibold text-center" style={{ fontSize: 'clamp(13px,3.5vw,15px)' }}>
            Турнир проходит раз в три часа
          </p>
        </div>

        {/* Rules */}
        <div className="px-4 pb-5 shrink-0">
          <div
            className="rounded-2xl px-4 py-4"
            style={{ background: 'linear-gradient(180deg,#555,#3a3a3a)', border: '1.5px solid #666' }}
          >
            <p className="text-white font-bold text-center leading-relaxed" style={{ fontSize: 'clamp(13px,3.5vw,15px)' }}>
              Ставки может сделать каждый, но победит только друн, который поставит больше всех – он и заберет все билеты.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────
const PageNine = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [showInfo, setShowInfo] = useState(false)
  const [betMsg,   setBetMsg]   = useState(null)

  const { user, tournaments, ticketLeaderboard } = useSelector((s) => s.game)

  useEffect(() => {
    dispatch(fetchTournaments())
    dispatch(fetchTicketLeaderboard(50))
  }, [dispatch])

  const tournament = tournaments?.ticket_tournament
  const endTs      = tournament?.end_ts
  const prizePool  = tournament?.prize_pool_tickets ?? 0
  const countdown  = useEndTsCountdown(endTs)

  const myTickets  = user?.tickets ?? 0
  const myName     = user?.username || user?.first_name || 'ВЫ'
  const myLevel    = user?.main_level ?? 1
  const myUserId   = user?.user_id

  const rawList = Array.isArray(ticketLeaderboard)
    ? ticketLeaderboard
    : (ticketLeaderboard?.leaderboard ?? ticketLeaderboard?.entries ?? ticketLeaderboard?.players ?? [])

  const leaderRows = rawList.map((p, i) => ({
    rank:    i + 1,
    avatar:  p.photo_url || null,
    flag:    null,
    level:   p.main_level ?? 1,
    name:    p.username || p.first_name || `Player${p.user_id}`,
    tickets: p.bet_amount ?? p.tickets ?? 0,
    isMe:    p.user_id === myUserId,
  }))

  const myRankInBoard = leaderRows.findIndex((r) => r.isMe)
  const myRankNumber  = myRankInBoard >= 0 ? myRankInBoard + 1 : '?'
  const myBetAmount   = myRankInBoard >= 0 ? leaderRows[myRankInBoard].tickets : 0

  const meRow = {
    rank:    typeof myRankNumber === 'number' ? myRankNumber : 999,
    avatar:  null, flag: null, level: myLevel,
    name:    myName, tickets: myBetAmount, isMe: true,
  }

  const fmt = (n) => Number(n ?? 0).toLocaleString('ru-RU')

  return (
    <div
      className="w-full flex flex-col"
      style={{
        backgroundImage: `url(${pageBg})`,
        backgroundSize: 'cover', backgroundPosition: 'center',
        maxWidth: '430px', margin: '0 auto',
        height: '100dvh', overflow: 'hidden',
      }}
    >
      <style>{`
        @keyframes skelPulse { 0%,100%{opacity:0.3} 50%{opacity:0.7} }
      `}</style>

      {/* ── HEADER ───────────────────────────────────────────── */}
      <div
        className="flex flex-col items-center pt-2 pb-1 shrink-0"
        style={{ background: 'linear-gradient(180deg,#111,#000)' }}
      >
        <span className="font-black text-white uppercase tracking-widest" style={{ fontSize: 'clamp(9px,2.8vw,13px)' }}>
          DRUN FAMILY
        </span>
        <div className="flex items-center w-full px-4 my-0.5">
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg,transparent,#888)' }} />
          <span className="font-bold mx-2 text-gray-400 uppercase" style={{ fontSize: 'clamp(7px,1.8vw,9px)', letterSpacing: '0.3em' }}>
            game
          </span>
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg,#888,transparent)' }} />
        </div>
      </div>

      {/* ── SCROLLABLE BODY ──────────────────────────────────── */}
      <div
        className="flex-1 overflow-y-auto px-2"
        style={{ WebkitOverflowScrolling: 'touch', paddingBottom: '140px' }}
      >

        {/* HERO CARD */}
        <div className="relative rounded-2xl overflow-hidden mt-2" style={{ border: '2px solid #c89000' }}>
          <div className="relative" style={{ height: `${Math.round(414 / 2)}px` }}>
            <img src={imgHeroBanner} alt="hero" className="w-full h-full object-cover" />
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(180deg,transparent 50%,rgba(0,0,0,0.6) 100%)' }}
            />

            {/* TOP LEFT: ticket count → /page21 (store) */}
            <div
              onClick={() => navigate('/page21')}
              className="absolute top-3 left-3 z-20 flex items-center gap-2 rounded-2xl px-3 py-1.5 cursor-pointer active:scale-95 transition-transform"
              style={{ background: '#888784' }}
            >
              <img src={imgTicketIcon} alt="ticket" className="w-[30px] h-[30px] object-contain" />
              <div className="flex flex-col leading-none">
                <span className="font-bold text-white/80 uppercase" style={{ fontSize: 8, letterSpacing: 1 }}>БИЛЕТЫ</span>
                {user
                  ? <span className="font-black text-white text-lg">{fmt(myTickets)}</span>
                  : <Skel w="40px" h="18px" radius="4px" />
                }
              </div>
              {/* + button → /page21 */}
              <button
                className="flex items-center justify-center rounded-lg font-black text-white ml-1 text-lg leading-none"
                style={{ width: 26, height: 26, background: 'linear-gradient(180deg,#666,#444)', border: '1.5px solid #999' }}
              >
                +
              </button>
            </div>

            {/* TOP RIGHT: info → Page11 tooltip */}
            <button
              onClick={() => setShowInfo(true)}
              className="absolute top-3 right-3 z-20 flex items-center justify-center rounded-full font-black text-white text-base active:scale-95 transition-transform"
              style={{ width: 36, height: 36, background: 'rgba(0,0,0,0.45)', border: '2px solid rgba(255,255,255,0.45)' }}
            >
              i
            </button>

            {/* BOTTOM: title pill */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-3 z-10">
              <div
                className="px-6 py-2 font-black text-white uppercase"
                style={{
                  fontSize: 'clamp(15px,4.5vw,19px)', letterSpacing: '0.05em',
                  background: 'linear-gradient(180deg,#3a2800,#1a1200)',
                  border: '2px solid #c89000', borderRadius: 99,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.7)',
                }}
              >
                ТУРНИР БИЛЕТОВ
              </div>
            </div>
          </div>
        </div>

        {/* COUNTDOWN */}
        <div
          className="rounded-2xl flex flex-col items-center justify-center py-3 mt-2"
          style={{ background: 'linear-gradient(180deg,#1a1200,#0a0800)', border: '1.5px solid #c89000' }}
        >
          <p className="text-white/60 font-black uppercase tracking-widest text-[12px]">ОСТАЛОСЬ</p>
          <p className="font-black text-white" style={{ fontSize: 'clamp(34px,11vw,50px)', letterSpacing: '0.05em', lineHeight: 1.1 }}>
            {countdown}
          </p>
        </div>

        {/* PRIZE POOL */}
        <div
          className="flex items-center justify-center gap-2 rounded-full py-2 mt-2"
          style={{ background: 'linear-gradient(180deg,#1a1200,#0a0800)', border: '1.5px solid #c89000' }}
        >
          <span className="text-white/60 font-black uppercase tracking-widest text-[11px]">ПРИЗОВОЙ ФОНД</span>
          <img src={imgTicketSmall} alt="ticket" className="w-[18px] h-[18px] object-contain" />
          {ticketLeaderboard !== null
            ? <span className="font-black text-yellow-300 text-[15px]">{fmt(prizePool)}</span>
            : <Skel w="80px" h="16px" />
          }
        </div>

        {/* Snackbar */}
        {betMsg && (
          <div
            className="mt-2 rounded-xl px-4 py-3 text-center font-black text-white text-[13px]"
            style={{
              background: betMsg.startsWith('✅') ? 'rgba(40,140,40,0.9)' : 'rgba(180,40,40,0.9)',
              border: '1.5px solid rgba(255,255,255,0.2)',
            }}
          >
            {betMsg}
          </div>
        )}

        {/* LEADERBOARD — scrollable to rank 50 */}
        <div className="flex flex-col gap-1.5 mt-2">
          {ticketLeaderboard !== null
            ? leaderRows.length > 0
              ? leaderRows.map((player) => (
                  <PlayerRow key={player.rank} player={player} highlight={player.isMe} />
                ))
              : <p className="text-white/50 text-center py-4 font-bold">Нет ставок. Будь первым!</p>
            : Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i} className="rounded-2xl px-2 py-1.5"
                  style={{ background: 'linear-gradient(90deg,#111,#1a1a1a)', border: '1.5px solid #2a2a2a', minHeight: 52 }}
                >
                  <Skel w="100%" h="36px" radius="10px" />
                </div>
              ))
          }
        </div>
      </div>

      {/* ── STICKY BOTTOM ─────────────────────────────────────── */}
      <div
        className="shrink-0 px-2 pt-1.5"
        style={{ background: 'linear-gradient(180deg,rgba(0,0,0,0.97),#000)', borderTop: '1px solid #2a2a2a' }}
      >
        {/* My rank row always visible */}
        <PlayerRow player={meRow} highlight />

        {/* Сделать ставку → /page10 */}
        <button
          onClick={() => navigate('/page10')}
          className="w-full mt-1.5 rounded-2xl font-black text-black active:scale-95 transition-transform italic"
          style={{
            fontSize: 'clamp(20px,6vw,26px)',
            padding: '11px 0',
            marginBottom: '6px',
            background: 'linear-gradient(180deg,#f0c020,#c89000)',
            border: '2px solid #8a6000',
            boxShadow: '0 4px 0 #6a4000',
          }}
        >
          Сделать ставку
        </button>
      </div>

      {/* ── INFO MODAL (Page 11 tooltip) ──────────────────────── */}
      <TournamentInfoModal isOpen={showInfo} onClose={() => setShowInfo(false)} endTs={endTs} />
    </div>
  )
}

export default PageNine