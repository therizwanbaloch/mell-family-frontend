import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { fetchTournaments, fetchUsdtLeaderboard, doSyncUsdtTickets, fetchState } from '../redux/gameSlice'

import pageBg         from '../assets/page1bg.webp'
import imgHeroBanner  from '../assets/page12Images/cardbg.webp'
import imgTicketIcon  from '../assets/page12Images/ticket-icon.webp'
import imgTicketSmall from '../assets/page12Images/ticket-small.webp'
import imgMedal1      from '../assets/page12Images/medal-1.webp'
import imgMedal2      from '../assets/page12Images/medal-2.webp'
import imgMedal3      from '../assets/page12Images/medal-3.webp'

import Page13Modal from '../modals/Page13Modal'

// ── Skeleton ──────────────────────────────────────────────────
const Skel = ({ w = '80px', h = '16px', radius = '6px' }) => (
  <div className="inline-block" style={{
    width: w, height: h, borderRadius: radius,
    background: 'rgba(255,255,255,0.1)',
    animation: 'skelPulse 1.4s ease-in-out infinite',
  }} />
)

// ── DD:HH:MM:SS countdown from end_ts ─────────────────────────
const useEndTsCountdown = (endTs) => {
  const calc = () => {
    if (!endTs) return '--:--:--:--'
    const diff = Math.max(0, endTs - Math.floor(Date.now() / 1000))
    const dd = String(Math.floor(diff / 86400)).padStart(2, '0')
    const hh = String(Math.floor((diff % 86400) / 3600)).padStart(2, '0')
    const mm = String(Math.floor((diff % 3600) / 60)).padStart(2, '0')
    const ss = String(diff % 60).padStart(2, '0')
    return `${dd}:${hh}:${mm}:${ss}`
  }
  const [display, setDisplay] = useState(calc)
  useEffect(() => {
    setDisplay(calc())
    const id = setInterval(() => setDisplay(calc()), 1000)
    return () => clearInterval(id)
  }, [endTs])
  return display
}

// ── Rank badge ────────────────────────────────────────────────
const RankBadge = ({ rank }) => {
  if (rank === 1) return <img src={imgMedal1} alt="1" className="w-10 h-10 object-contain" />
  if (rank === 2) return <img src={imgMedal2} alt="2" className="w-10 h-10 object-contain" />
  if (rank === 3) return <img src={imgMedal3} alt="3" className="w-10 h-10 object-contain" />
  return (
    <span className="font-black text-white text-base w-9 text-center block leading-none">
      {rank}
    </span>
  )
}

// ── Player row — pill shape matching design ───────────────────
const PlayerRow = ({ player, highlight }) => {
  const isTop3 = player.rank <= 3

  const rowBg =
    player.rank === 1 ? 'linear-gradient(90deg,#1a1200,#2a1e00)' :
    player.rank === 2 ? 'linear-gradient(90deg,#071525,#0e2040)' :
    player.rank === 3 ? 'linear-gradient(90deg,#1a0e00,#2a1800)' :
    highlight         ? 'linear-gradient(90deg,#1c1c1c,#282828)' :
                        'linear-gradient(90deg,#111,#181818)'

  const rowBorder =
    player.rank === 1 ? '#c89000' :
    player.rank === 2 ? '#2565b5' :
    player.rank === 3 ? '#8a5500' :
    highlight         ? '#666'    : '#2e2e2e'

  const fmt = (n) => Number(n ?? 0).toLocaleString('ru-RU')

  return (
    <div
      className="flex items-center gap-2 rounded-full px-2 py-1 shrink-0"
      style={{
        background: rowBg,
        border: `2px solid ${rowBorder}`,
        minHeight: '56px',
        boxShadow: isTop3 ? `0 2px 12px ${rowBorder}55` : 'none',
      }}
    >
      {/* Rank */}
      <div className="flex items-center justify-center shrink-0 w-10">
        <RankBadge rank={player.rank} />
      </div>

      {/* Avatar */}
      <div
        className="rounded-full overflow-hidden shrink-0 flex items-center justify-center w-10 h-10"
        style={{ background: '#2a2a2a', border: `2px solid ${rowBorder}` }}
      >
        {player.avatar
          ? <img src={player.avatar} alt={player.name} className="w-full h-full object-cover" />
          : <span className="text-xl">👤</span>
        }
      </div>

      {/* Name + info */}
      <div className="flex-1 min-w-0 flex items-center gap-1 flex-wrap">
        {player.flag && <span className="text-sm">{player.flag}</span>}
        <span
          className="font-black text-white shrink-0 text-[11px] rounded-full px-1.5 py-px"
          style={{ background: '#1e4a1e', border: '1px solid #3a8a20' }}
        >
          {player.level ?? '?'} lvl
        </span>
        {player.isMe && (
          <span className="font-black text-white text-[13px] uppercase">ВЫ</span>
        )}
        <span className="text-white font-semibold truncate text-[13px]">{player.name}</span>
      </div>

      {/* Ticket score — grey pill */}
      <div
        className="flex items-center gap-1 rounded-full px-3 py-1.5 shrink-0"
        style={{
          background: 'linear-gradient(180deg,#4a4030,#2e2820)',
          border: '1.5px solid #8a7030',
        }}
      >
        <img src={imgTicketSmall} alt="ticket" className="w-4 h-4 object-contain" />
        <span className="font-black text-yellow-300 text-[14px] tabular-nums">
          {fmt(player.tickets)}
        </span>
      </div>
    </div>
  )
}

// ── Sync confirm modal ────────────────────────────────────────
const SyncModal = ({ isOpen, onClose, myTickets, onConfirm, loading }) => {
  const [visible,   setVisible]   = useState(false)
  const [animateIn, setAnimateIn] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setVisible(true)
      requestAnimationFrame(() => requestAnimationFrame(() => setAnimateIn(true)))
    } else {
      setAnimateIn(false)
      const t = setTimeout(() => setVisible(false), 300)
      return () => clearTimeout(t)
    }
  }, [isOpen])

  if (!visible) return null

  return (
    <div
      onClick={onClose}
      className={`fixed inset-0 z-[70] flex items-center justify-center px-4 transition-all duration-300
        ${animateIn ? 'bg-black/70 backdrop-blur-sm' : 'bg-black/0 backdrop-blur-none'}`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl transition-all duration-300
          ${animateIn ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
        style={{ background: 'linear-gradient(180deg,#2a2a2a,#1a1a1a)', border: '2px solid #c89000' }}
      >
        <div className="px-5 pt-5 pb-5 flex flex-col gap-3 text-center">
          <h3 className="text-white font-black text-[18px]">Участвовать в розыгрыше</h3>
          <p className="text-white/70 text-[13px]">
            Синхронизировать ваши билеты с розыгрышем USDT?
          </p>
          <div
            className="flex items-center justify-center gap-2 rounded-xl px-4 py-3"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1.5px solid #444' }}
          >
            <img src={imgTicketSmall} alt="ticket" className="w-5 h-5" />
            <span className="font-black text-yellow-300 text-[22px]">
              {Number(myTickets ?? 0).toLocaleString('ru-RU')}
            </span>
            <span className="text-white/60 font-bold text-[13px]">билетов</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-2xl font-black text-white active:scale-95 transition-transform"
              style={{ background: 'rgba(255,255,255,0.1)', border: '1.5px solid #555' }}
            >
              Отмена
            </button>
            <button
              onClick={() => !loading && onConfirm(myTickets)}
              disabled={loading}
              className="flex-1 py-3 rounded-2xl font-black text-black active:scale-95 transition-transform"
              style={{
                background: 'linear-gradient(180deg,#f0c020,#c89000)',
                border: '2px solid #8a6000',
                boxShadow: '0 4px 0 #6a4000',
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? '...' : 'Участвовать'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main Page12 ───────────────────────────────────────────────
const Page12 = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [showInfo, setShowInfo] = useState(false)
  const [showSync, setShowSync] = useState(false)
  const [msg,      setMsg]      = useState(null)

  const { user, tournaments, usdtLeaderboard, actionLoading } = useSelector((s) => s.game)

  useEffect(() => {
    dispatch(fetchTournaments())
    dispatch(fetchUsdtLeaderboard(50))
  }, [dispatch])

  // ── Real data ────────────────────────────────────────────────
  const isReady   = !!user
  const myTickets = user?.tickets  ?? 0
  const myUserId  = user?.user_id
  const myName    = user?.username || user?.first_name || 'ВЫ'
  const myLevel   = user?.main_level ?? 1

  const tournament = tournaments?.usdt_tournament
  const endTs      = tournament?.end_ts
  const prizePool  = tournament?.prize_pool_usdt ?? 0
  const countdown  = useEndTsCountdown(endTs)

  const rawList = Array.isArray(usdtLeaderboard)
    ? usdtLeaderboard
    : (usdtLeaderboard?.leaderboard ?? usdtLeaderboard?.entries ?? [])

  const leaderRows = rawList.map((p, i) => ({
    rank:    i + 1,
    avatar:  p.photo_url || null,
    flag:    p.flag || null,
    level:   p.main_level ?? 1,
    name:    p.username || p.first_name || `Player${p.user_id}`,
    tickets: p.tickets ?? p.ticket_count ?? 0,
    isMe:    p.user_id === myUserId,
  }))

  const myRankInBoard    = leaderRows.findIndex((r) => r.isMe)
  const myRankNumber     = myRankInBoard >= 0 ? myRankInBoard + 1 : '?'
  const myTicketsInBoard = myRankInBoard >= 0 ? leaderRows[myRankInBoard].tickets : myTickets

  const meRow = {
    rank:    typeof myRankNumber === 'number' ? myRankNumber : 999,
    avatar:  user?.photo_url || null,
    flag:    null,
    level:   myLevel,
    name:    myName,
    tickets: myTicketsInBoard,
    isMe:    true,
  }

  const fmtPool = (n) => Math.floor(n ?? 0).toLocaleString('ru-RU')

  const handleSyncConfirm = async (tickets) => {
    try {
      await dispatch(doSyncUsdtTickets(tickets)).unwrap()
      setShowSync(false)
      setMsg({ ok: true, text: '✅ Вы участвуете в розыгрыше USDT!' })
      dispatch(fetchUsdtLeaderboard(50))
      dispatch(fetchState())
    } catch (e) {
      setMsg({ ok: false, text: `❌ ${String(e)}` })
    }
    setTimeout(() => setMsg(null), 3000)
  }

  const canSync = isReady && myTickets > 0

  return (
    <div
      className="w-full flex flex-col overflow-hidden"
      style={{
        backgroundImage: `url(${pageBg})`,
        backgroundSize: 'cover', backgroundPosition: 'center',
        maxWidth: '430px', margin: '0 auto', height: '100dvh',
      }}
    >
      <style>{`@keyframes skelPulse { 0%,100%{opacity:0.3} 50%{opacity:0.7} }`}</style>

      {/* ── HEADER ───────────────────────────────────────────── */}
      <div
        className="flex flex-col items-center pt-2 pb-1 shrink-0"
        style={{ background: 'linear-gradient(180deg,#111,#000)' }}
      >
        <span
          className="font-black text-white uppercase tracking-widest"
          style={{ fontSize: 'clamp(9px,2.8vw,13px)' }}
        >
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
        style={{ WebkitOverflowScrolling: 'touch', paddingBottom: '148px' }}
      >

        {/* ── HERO CARD ──────────────────────────────────────── */}
        <div
          className="relative rounded-2xl overflow-hidden mt-2"
          style={{ border: '2px solid #5a9a10' }}
        >
          <img
            src={imgHeroBanner} alt="USDT giveaway"
            className="w-full object-cover block"
            style={{ height: 'clamp(180px,44vw,240px)', objectPosition: 'top center' }}
          />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(180deg,transparent 55%,rgba(0,0,0,0.55) 100%)' }}
          />

          {/* TOP LEFT: FA coin + билеты → /page21 */}
          <div
            onClick={() => navigate('/shop')}
            className="absolute top-2.5 left-2.5 z-20 flex items-center gap-1.5 rounded-2xl px-2.5 py-1.5 cursor-pointer active:scale-95 transition-transform"
            style={{ background: 'rgba(80,76,70,0.92)', border: '1.5px solid #666' }}
          >
            <img src={imgTicketIcon} alt="ticket" className="w-7 h-7 object-contain" />
            <div className="flex flex-col leading-none">
              <span className="text-white/70 font-bold uppercase" style={{ fontSize: 8, letterSpacing: 1 }}>БИЛЕТЫ</span>
              {isReady
                ? <span className="font-black text-white text-lg leading-tight">{fmtPool(myTickets)}</span>
                : <Skel w="38px" h="18px" radius="4px" />
              }
            </div>
            {/* + btn */}
            <div
              className="flex items-center justify-center rounded-lg text-white ml-1 font-black text-base leading-none"
              style={{ width: 28, height: 28, background: 'linear-gradient(180deg,#666,#444)', border: '1.5px solid #999' }}
            >
              +
            </div>
          </div>

          {/* TOP RIGHT: info → Page13Modal */}
          <button
            onClick={() => setShowInfo(true)}
            className="absolute top-2.5 right-2.5 z-20 flex items-center justify-center rounded-full text-white active:scale-95 transition-transform font-black text-[17px]"
            style={{ width: 38, height: 38, background: 'rgba(0,0,0,0.5)', border: '2.5px solid rgba(255,255,255,0.5)' }}
          >
            i
          </button>

          {/* BOTTOM: title pill */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-3 z-10">
            <div
              className="font-black text-black uppercase px-7 py-2"
              style={{
                fontSize: 'clamp(15px,4.5vw,20px)', letterSpacing: '0.08em',
                background: 'linear-gradient(180deg,#f0c020,#c87800)',
                border: '2.5px solid #8a5500', borderRadius: 9999,
                boxShadow: '0 4px 16px rgba(0,0,0,0.7)',
              }}
            >
              РОЗЫГРЫШ USDT
            </div>
          </div>
        </div>

        {/* ── COUNTDOWN — dark green bordered box ──────────────── */}
        <div
          className="rounded-2xl flex flex-col items-center justify-center mt-2 py-3"
          style={{
            background: 'linear-gradient(180deg,#0d1a08,#080f05)',
            border: '2px solid #4a7a18',
            boxShadow: 'inset 0 1px 0 rgba(120,200,40,0.08)',
          }}
        >
          <p className="text-white/55 font-black uppercase tracking-[0.25em] text-[12px] mb-0.5">
            ОСТАЛОСЬ
          </p>
          <p
            className="font-black text-white tabular-nums leading-none"
            style={{ fontSize: 'clamp(32px,10vw,48px)', letterSpacing: '0.06em' }}
          >
            {countdown}
          </p>
        </div>

        {/* ── PRIZE POOL — rounded pill, gold border ─────────── */}
        <div
          className="flex items-center justify-center gap-2 rounded-full py-2.5 mt-2"
          style={{
            background: 'linear-gradient(180deg,#1e1400,#100b00)',
            border: '1.5px solid #8a6a10',
          }}
        >
          <span
            className="font-bold uppercase tracking-[0.15em]"
            style={{ color: '#b8960a', fontSize: 'clamp(11px,3vw,14px)' }}
          >
            ПРИЗОВОЙ ФОНД
          </span>
          {tournaments !== null
            ? <span className="font-black text-yellow-300" style={{ fontSize: 'clamp(13px,3.5vw,15px)' }}>
                {fmtPool(prizePool)} USDT
              </span>
            : <Skel w="100px" h="16px" />
          }
        </div>

        {/* Snackbar */}
        {msg && (
          <div
            className="mt-2 rounded-xl px-4 py-3 text-center font-black text-white text-[13px]"
            style={{
              background: msg.ok ? 'rgba(40,140,40,0.9)' : 'rgba(180,40,40,0.9)',
              border: '1.5px solid rgba(255,255,255,0.2)',
            }}
          >
            {msg.text}
          </div>
        )}

        {/* ── LEADERBOARD ──────────────────────────────────────── */}
        <div className="flex flex-col gap-1.5 mt-2">
          {usdtLeaderboard !== null
            ? leaderRows.length > 0
              ? leaderRows.map((player) => (
                  <PlayerRow key={player.rank} player={player} highlight={player.isMe} />
                ))
              : <p className="text-white/50 text-center py-4 font-bold">Нет участников. Будь первым!</p>
            : Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i} className="rounded-full px-2 py-1"
                  style={{ background: 'linear-gradient(90deg,#111,#1a1a1a)', border: '1.5px solid #2a2a2a', minHeight: 52 }}
                >
                  <Skel w="100%" h="36px" radius="9999px" />
                </div>
              ))
          }
        </div>
      </div>

      {/* ── STICKY BOTTOM ─────────────────────────────────────── */}
      <div
        className="shrink-0 px-2 pt-1.5 pb-1.5"
        style={{
          background: 'linear-gradient(180deg,rgba(0,0,0,0.97),#000)',
          borderTop: '1px solid #252525',
        }}
      >
        {/* My rank row */}
        <PlayerRow player={meRow} highlight />

        {/* Участвовать button */}
        <button
          onClick={() => setShowSync(true)}
          disabled={!canSync}
          className="w-full mt-1.5 rounded-2xl font-black italic active:scale-95 transition-transform"
          style={{
            fontSize: 'clamp(20px,6vw,26px)',
            padding: '11px 0',
            marginBottom: '4px',
            background: canSync
              ? 'linear-gradient(180deg,#f0c020,#c89000)'
              : 'rgba(100,100,100,0.4)',
            border: '2px solid #8a6000',
            boxShadow: canSync ? '0 4px 0 #6a4000' : 'none',
            color: canSync ? '#000' : '#666',
            cursor: canSync ? 'pointer' : 'not-allowed',
          }}
        >
          {canSync ? 'Участвовать' : 'Нет билетов'}
        </button>
      </div>

      {/* ── MODALS ───────────────────────────────────────────── */}
      <Page13Modal isOpen={showInfo} onClose={() => setShowInfo(false)} />
      <SyncModal
        isOpen={showSync}
        onClose={() => setShowSync(false)}
        myTickets={myTickets}
        onConfirm={handleSyncConfirm}
        loading={actionLoading}
      />
    </div>
  )
}

export default Page12