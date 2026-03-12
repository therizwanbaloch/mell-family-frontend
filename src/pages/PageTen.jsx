import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { fetchTournaments, fetchTicketLeaderboard, doPlaceBet, fetchState } from '../redux/gameSlice'
import { IoAdd, IoRemove, IoInformationCircle } from 'react-icons/io5'
import TournamentInfoModal from '../modals/TournamentInfoModal'

import heroBg     from '../assets/page10Images/cardbg.webp'
import ticketIcon from '../assets/page10Images/ticket-icon.webp'
import faIcon     from '../assets/page10Images/ticket-small.webp'

const PRESET_AMOUNTS = [10, 100, 1000, 10000]

// ── Skeleton ──────────────────────────────────────────────────
const Skel = ({ w = '60px', h = '20px', radius = '6px' }) => (
  <div
    className="inline-block"
    style={{
      width: w, height: h, borderRadius: radius,
      background: 'rgba(255,255,255,0.1)',
      animation: 'skelPulse 1.4s ease-in-out infinite',
    }}
  />
)

// ── Live countdown hook ───────────────────────────────────────
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
    setDisplay(calc())
    const id = setInterval(() => setDisplay(calc()), 1000)
    return () => clearInterval(id)
  }, [endTs])
  return display
}

// ── PageTen ───────────────────────────────────────────────────
const PageTen = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { user, tournaments, ticketLeaderboard, actionLoading } = useSelector((s) => s.game)

  const [betAmount,      setBetAmount]      = useState(10)
  const [selectedPreset, setSelectedPreset] = useState(null)
  const [showInfo,       setShowInfo]       = useState(false)
  const [msg,            setMsg]            = useState(null)

  // Fetch fresh data on mount
  useEffect(() => {
    dispatch(fetchTournaments())
    dispatch(fetchTicketLeaderboard(100))
  }, [dispatch])

  // ── Derived data from Redux ──────────────────────────────────
  const isReady    = !!user
  const myTickets  = user?.tickets  ?? 0
  const myUserId   = user?.user_id
  const tournament = tournaments?.ticket_tournament
  const endTs      = tournament?.end_ts
  const prizePool  = tournament?.prize_pool_tickets ?? 0
  const countdown  = useEndTsCountdown(endTs)

  // My rank + current bet from leaderboard
  const rawList = Array.isArray(ticketLeaderboard)
    ? ticketLeaderboard
    : (ticketLeaderboard?.leaderboard ?? ticketLeaderboard?.entries ?? [])
  const myEntry = rawList.find((p) => p.user_id === myUserId)
  const myBet   = myEntry?.bet_amount ?? 0
  const myRank  = myEntry ? rawList.indexOf(myEntry) + 1 : '—'

  const fmtNum = (n) => Math.floor(n ?? 0).toLocaleString('ru-RU')

  // ── Bet controls ─────────────────────────────────────────────
  const decrement  = () => { setSelectedPreset(null); setBetAmount(v => Math.max(1, v - 1)) }
  const increment  = () => { setSelectedPreset(null); setBetAmount(v => Math.min(myTickets, v + 1)) }
  const pickPreset = (val) => { setSelectedPreset(val); setBetAmount(Math.min(val, myTickets)) }

  const canBet = isReady && myTickets > 0 && betAmount > 0 && betAmount <= myTickets && !actionLoading

  const handleBet = async () => {
    if (!canBet) return
    try {
      await dispatch(doPlaceBet(betAmount)).unwrap()
      setMsg({ ok: true, text: `✅ Ставка ${betAmount} билетов принята!` })
      dispatch(fetchTournaments())
      dispatch(fetchTicketLeaderboard(100))
      dispatch(fetchState())
    } catch (e) {
      setMsg({ ok: false, text: `❌ ${String(e)}` })
    }
    setTimeout(() => setMsg(null), 3000)
  }

  return (
    <div
      className="flex flex-col overflow-hidden"
      style={{
        maxWidth: '430px', margin: '0 auto',
        height: '100dvh', backgroundColor: '#1a1a1a',
        fontFamily: "'Nunito','Segoe UI',sans-serif",
      }}
    >
      <style>{`@keyframes skelPulse { 0%,100%{opacity:0.3} 50%{opacity:0.7} }`}</style>

      {/* ── TOP BAR ─────────────────────────────────────────── */}
      <div
        className="shrink-0 text-center"
        style={{
          paddingTop: 'clamp(10px,3vw,16px)', paddingBottom: 'clamp(6px,2vw,10px)',
          background: 'linear-gradient(180deg,#000 0%,transparent 100%)',
        }}
      >
        <h1
          className="text-white font-black uppercase m-0 leading-tight"
          style={{ fontSize: 'clamp(15px,4.5vw,20px)', letterSpacing: '0.15em' }}
        >
          DRUN FAMILY
        </h1>
        <p
          className="text-white/55 m-0 italic"
          style={{ fontSize: 'clamp(10px,2.5vw,13px)', letterSpacing: '0.2em' }}
        >
          game
        </p>
      </div>

      {/* ── HERO CARD ───────────────────────────────────────── */}
      <div
        className="shrink-0 relative rounded-[18px] overflow-hidden"
        style={{
          margin: '0 clamp(10px,3vw,16px)',
          border: '2px solid #c9940a',
          boxShadow: '0 4px 24px rgba(201,148,10,0.35)',
        }}
      >
        <img
          src={heroBg} alt="Tournament Hero"
          className="w-full block object-cover object-top"
          style={{ height: 'clamp(160px,38vw,220px)' }}
        />

        {/* Tickets badge — top left → /page21 */}
        <div
          onClick={() => navigate('/page21')}
          className="absolute top-2.5 left-2.5 flex items-center gap-1.5 rounded-xl cursor-pointer active:scale-95 transition-transform"
          style={{
            background: 'linear-gradient(180deg,#2a2a2a,#111)',
            border: '2px solid #c9940a', padding: '5px 10px',
          }}
        >
          <img src={ticketIcon} alt="ticket" className="w-[22px] h-[22px] object-contain" />
          <div className="flex flex-col items-start leading-none">
            <span
              className="text-white/60 font-bold uppercase"
              style={{ fontSize: 9, letterSpacing: '0.1em' }}
            >БИЛЕТЫ</span>
            {isReady
              ? <span className="text-yellow-300 font-black" style={{ fontSize: 'clamp(14px,4vw,18px)' }}>{fmtNum(myTickets)}</span>
              : <Skel w="40px" h="18px" />
            }
          </div>
          <button
            className="flex items-center justify-center rounded-lg text-white ml-1 active:scale-95"
            style={{
              width: 26, height: 26, marginLeft: 4,
              background: 'linear-gradient(180deg,#888,#555)', border: '1.5px solid #999',
            }}
          >
            <IoAdd size={16} />
          </button>
        </div>

        {/* Info btn — top right → Page11 tooltip */}
        <button
          onClick={() => setShowInfo(true)}
          className="absolute top-2.5 right-2.5 flex items-center justify-center rounded-full text-white active:scale-95 transition-transform"
          style={{
            width: 34, height: 34,
            background: 'rgba(0,0,0,0.5)', border: '2px solid rgba(255,255,255,0.3)',
          }}
        >
          <IoInformationCircle size={20} />
        </button>

        {/* Bottom label */}
        <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap">
          <div
            className="font-black text-black uppercase"
            style={{
              background: 'linear-gradient(180deg,#f0a800,#c87800)',
              border: '2px solid #8a5500', borderRadius: 9999,
              padding: 'clamp(5px,1.5vw,8px) clamp(18px,5vw,28px)',
              boxShadow: '0 3px 12px rgba(0,0,0,0.5)',
              fontSize: 'clamp(13px,3.5vw,17px)', letterSpacing: '0.12em',
            }}
          >
            ТУРНИР БИЛЕТОВ
          </div>
        </div>
      </div>

      {/* ── SCROLLABLE CONTENT ──────────────────────────────── */}
      <div
        className="flex-1 overflow-y-auto flex flex-col"
        style={{
          padding: '0 clamp(10px,3vw,16px) clamp(12px,3vw,20px)',
          gap: 'clamp(8px,2vw,12px)',
        }}
      >

        {/* Snackbar */}
        {msg && (
          <div
            className="rounded-xl text-center font-extrabold text-[13px] text-white mt-2"
            style={{
              padding: '10px 14px',
              background: msg.ok ? 'rgba(40,140,40,0.92)' : 'rgba(180,40,40,0.92)',
              border: '1.5px solid rgba(255,255,255,0.15)',
            }}
          >
            {msg.text}
          </div>
        )}

        {/* ── COUNTDOWN ───────────────────────────────────── */}
        <div
          className="rounded-[14px] text-center mt-2"
          style={{
            background: 'linear-gradient(180deg,#222,#111)',
            border: '1.5px solid #444',
            padding: 'clamp(10px,2.5vw,16px) 16px',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
          }}
        >
          <p
            className="text-white/60 font-bold uppercase m-0 mb-1"
            style={{ fontSize: 'clamp(11px,3vw,14px)', letterSpacing: '0.2em' }}
          >
            ОСТАЛОСЬ
          </p>
          <p
            className="text-white font-black m-0 leading-none tabular-nums"
            style={{ fontSize: 'clamp(32px,9vw,48px)', letterSpacing: '0.08em' }}
          >
            {countdown}
          </p>
        </div>

        {/* ── PRIZE POOL ──────────────────────────────────── */}
        <div
          className="rounded-[14px] flex items-center justify-center gap-2"
          style={{
            background: 'linear-gradient(180deg,#2a2000,#1a1400)',
            border: '1.5px solid #c9940a',
            padding: 'clamp(8px,2vw,12px) 16px',
            boxShadow: '0 2px 12px rgba(201,148,10,0.2)',
          }}
        >
          <span
            className="font-bold uppercase"
            style={{ color: '#c9940a', fontSize: 'clamp(10px,2.8vw,13px)', letterSpacing: '0.18em' }}
          >
            ПРИЗОВОЙ ФОНД
          </span>
          <img src={faIcon} alt="ticket" className="w-5 h-5 object-contain shrink-0" />
          {tournaments !== null
            ? <span className="text-yellow-300 font-black" style={{ fontSize: 'clamp(13px,3.5vw,16px)' }}>{fmtNum(prizePool)}</span>
            : <Skel w="80px" h="16px" />
          }
        </div>

        {/* ── STATS ROW ───────────────────────────────────── */}
        <div className="flex gap-2" style={{ gap: 'clamp(8px,2vw,12px)' }}>

          {/* Current bet */}
          <div
            className="flex-1 rounded-[14px] text-center"
            style={{
              background: 'linear-gradient(180deg,#222,#111)',
              border: '1.5px solid #444',
              padding: 'clamp(10px,2.5vw,14px) 12px',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
            }}
          >
            <p className="text-white/55 font-bold m-0 mb-1.5" style={{ fontSize: 'clamp(10px,2.5vw,12px)', letterSpacing: '0.05em' }}>
              Текущая ставка
            </p>
            <div className="flex items-center justify-center gap-1.5">
              <img src={ticketIcon} alt="ticket" className="w-6 h-6 object-contain" />
              {isReady
                ? <span className="text-yellow-300 font-black leading-none" style={{ fontSize: 'clamp(22px,6vw,30px)' }}>{fmtNum(myBet)}</span>
                : <Skel w="40px" h="28px" />
              }
            </div>
          </div>

          {/* My rank */}
          <div
            className="flex-1 rounded-[14px] text-center"
            style={{
              background: 'linear-gradient(180deg,#222,#111)',
              border: '1.5px solid #444',
              padding: 'clamp(10px,2.5vw,14px) 12px',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
            }}
          >
            <p className="text-white/55 font-bold m-0 mb-1.5" style={{ fontSize: 'clamp(10px,2.5vw,12px)', letterSpacing: '0.05em' }}>
              Место в рейтинге
            </p>
            {isReady
              ? <span className="text-white font-black leading-none" style={{ fontSize: 'clamp(22px,6vw,30px)' }}>{myRank}</span>
              : <Skel w="40px" h="28px" />
            }
          </div>
        </div>

        {/* ── BET INPUT ───────────────────────────────────── */}
        <div
          className="rounded-[14px] flex flex-col"
          style={{
            background: 'linear-gradient(180deg,#2a2a2a,#1a1a1a)',
            border: '1.5px solid #444',
            padding: 'clamp(10px,2.5vw,14px) 12px',
            gap: 'clamp(8px,2vw,10px)',
          }}
        >
          {/* +/- stepper */}
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={decrement}
              className="shrink-0 flex items-center justify-center rounded-full text-white active:scale-95 transition-transform"
              style={{
                width: 'clamp(36px,9vw,44px)', height: 'clamp(36px,9vw,44px)',
                background: 'linear-gradient(180deg,#777,#555)',
                border: '2px solid #888', boxShadow: '0 3px 0 #333',
              }}
            >
              <IoRemove size={20} />
            </button>

            <span
              className="flex-1 text-center text-white font-black"
              style={{ fontSize: 'clamp(26px,7vw,36px)', letterSpacing: '0.05em' }}
            >
              {betAmount}
            </span>

            <button
              onClick={increment}
              className="shrink-0 flex items-center justify-center rounded-full text-white active:scale-95 transition-transform"
              style={{
                width: 'clamp(36px,9vw,44px)', height: 'clamp(36px,9vw,44px)',
                background: 'linear-gradient(180deg,#777,#555)',
                border: '2px solid #888', boxShadow: '0 3px 0 #333',
              }}
            >
              <IoAdd size={20} />
            </button>
          </div>

          {/* Preset grid */}
          <div className="grid grid-cols-2" style={{ gap: 'clamp(6px,1.5vw,10px)' }}>
            {PRESET_AMOUNTS.map((val) => {
              const isActive = selectedPreset === val
              const disabled = val > myTickets
              return (
                <button
                  key={val}
                  onClick={() => !disabled && pickPreset(val)}
                  className="rounded-xl font-black transition-all duration-150"
                  style={{
                    padding: 'clamp(8px,2vw,12px) 0',
                    fontSize: 'clamp(14px,4vw,18px)',
                    letterSpacing: '0.04em',
                    background: disabled
                      ? 'rgba(60,60,60,0.5)'
                      : isActive
                        ? 'linear-gradient(180deg,#5ecb1a,#3a9010)'
                        : 'linear-gradient(180deg,#555,#3a3a3a)',
                    border: isActive ? '2px solid #2a6a08' : '2px solid #666',
                    color: disabled ? 'rgba(255,255,255,0.25)' : '#fff',
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    boxShadow: isActive ? '0 3px 0 #1a5008' : '0 3px 0 #222',
                  }}
                >
                  {val.toLocaleString()}
                </button>
              )
            })}
          </div>

          

          
          <p className="text-white/40 text-[11px] text-center m-0">
            Доступно:{' '}
            <span className="text-yellow-300 font-extrabold">{fmtNum(myTickets)}</span> билетов
          </p>
        </div>

    


        <button
          onClick={handleBet}
          disabled={!canBet}
          className="w-full flex flex-col items-center justify-center gap-0.5 rounded-2xl transition-transform duration-100"
          style={{
            padding: 'clamp(14px,3.5vw,18px) 0',
            background: canBet ? 'linear-gradient(180deg,#5ecb1a,#3a9010)' : 'rgba(80,80,80,0.5)',
            border: canBet ? '2px solid #2a6a08' : '2px solid #444',
            boxShadow: canBet ? '0 5px 0 #1a4a06, 0 8px 16px rgba(0,0,0,0.4)' : 'none',
            cursor: canBet ? 'pointer' : 'not-allowed',
            opacity: canBet ? 1 : 0.5,
          }}
          onPointerDown={(e) => canBet && (e.currentTarget.style.transform = 'scale(0.97)')}
          onPointerUp={(e)   => (e.currentTarget.style.transform = 'scale(1)')}
          onPointerLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <span className="text-white font-black" style={{ fontSize: 'clamp(18px,5vw,24px)', letterSpacing: '0.08em' }}>
            {actionLoading ? 'Отправка...' : 'Ставка'}
          </span>
          <span className="text-white/75 font-bold" style={{ fontSize: 'clamp(11px,2.8vw,13px)' }}>
            {betAmount} Билетов
          </span>
        </button>

      </div>



      <TournamentInfoModal isOpen={showInfo} onClose={() => setShowInfo(false)} />
    </div>
  )
}

export default PageTen