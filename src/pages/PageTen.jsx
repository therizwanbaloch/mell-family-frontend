import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { fetchTournaments, fetchTicketLeaderboard, doPlaceBet, fetchState } from '../redux/gameSlice'
import { IoAdd, IoRemove, IoInformationCircle } from 'react-icons/io5'
import TournamentInfoModal from '../modals/TournamentInfoModal'
import logoHeader     from '../assets/page26Images/26-logo.webp' 
import heroBg         from '../assets/page10Images/cardbg.webp'
import ticketIcon     from '../assets/page10Images/ticket-icon.webp'
import faIcon         from '../assets/page10Images/ticket-small.webp'

const PRESET_AMOUNTS = [10, 100, 1000, 10000]

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

const useEndTsCountdown = (endTs) => {
  const calc = () => {
    if (!endTs) return '--:--:--'
    const ts = endTs > 10000000000 ? Math.floor(endTs / 1000) : endTs;
    const diff = Math.max(0, ts - Math.floor(Date.now() / 1000))
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

const PageTen = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { user, tournaments, ticketLeaderboard, actionLoading } = useSelector((s) => s.game)

  const [betAmount,      setBetAmount]      = useState(10)
  const [selectedPreset, setSelectedPreset] = useState(null)
  const [showInfo,        setShowInfo]       = useState(false)
  const [msg,             setMsg]            = useState(null)

  useEffect(() => {
    dispatch(fetchState())
    dispatch(fetchTournaments())
    dispatch(fetchTicketLeaderboard(100))
  }, [dispatch])

  const isReady    = !!user
  const myTickets  = user?.tickets  ?? 0
  const myUserId   = user?.user_id
  const tournament = tournaments?.ticket_tournament || tournaments
  const endTs      = tournament?.end_ts
  const prizePool  = tournament?.prize_pool_tickets ?? 0
  const countdown  = useEndTsCountdown(endTs)

  const rawList = Array.isArray(ticketLeaderboard)
    ? ticketLeaderboard
    : (ticketLeaderboard?.leaderboard ?? ticketLeaderboard?.entries ?? [])
  const myEntry = rawList.find((p) => p.user_id === myUserId)
  const myBet   = myEntry?.bet_amount ?? 0
  const myRank  = myEntry ? rawList.indexOf(myEntry) + 1 : '—'

  const fmtNum = (n) => Math.floor(n ?? 0).toLocaleString('ru-RU')

  const decrement  = () => { 
    setSelectedPreset(null); 
    setBetAmount(v => Math.max(1, v - 10)) 
  }
  const increment  = () => { 
    setSelectedPreset(null); 
    setBetAmount(v => (v + 10 > myTickets ? myTickets : v + 10)) 
  }
  const pickPreset = (val) => { 
    setSelectedPreset(val); 
    setBetAmount(Math.min(val, myTickets)) 
  }

  const canBet = isReady && myTickets >= betAmount && betAmount > 0 && !actionLoading

  const handleBet = async () => {
    if (!canBet) return
    try {
      await dispatch(doPlaceBet(betAmount)).unwrap()
      setMsg({ ok: true, text: `Ставка ${betAmount} приняta!` })
      dispatch(fetchState()) 
      dispatch(fetchTournaments())
      dispatch(fetchTicketLeaderboard(100))
      setBetAmount(10)
      setSelectedPreset(null)
    } catch (e) {
      setMsg({ ok: false, text: `${String(e)}` })
    }
    setTimeout(() => setMsg(null), 3000)
  }

  // Exact Gradient Style from Page 12
  const prizeTextStyle = {
    background: 'linear-gradient(180deg, #e7aa51, #ffe499, #8d5a1b, #e7aa51, #ac7031)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  };

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

      {/* HEADER WITH LOGO */}
      <div className="shrink-0">
        <div style={{ background: "#000", padding: "10px 0", borderBottom: "1px solid #222" }}>
          <div style={{ width: 130, height: 28, position: "relative", margin: "0 auto" }}>
            <img src={logoHeader} alt="Logo" style={{ position: "absolute", width: 210, top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />
          </div>
        </div>
      </div>

      {/* HERO CARD */}
      <div className="shrink-0 relative rounded-[18px] overflow-hidden" style={{ margin: '-4px clamp(10px,3vw,16px) 0', border: '2px solid #c9940a', boxShadow: '0 4px 24px rgba(201,148,10,0.35)' }}>
        <img src={heroBg} alt="Hero" className="w-full block object-cover object-top" style={{ height: 'clamp(160px,38vw,220px)' }} />

        <div onClick={() => navigate('/shop')} className="absolute top-1 left-1 flex items-center gap-1.5 rounded-xl cursor-pointer active:scale-95 transition-transform" style={{ background: '#888784', border: '2px solid #000', padding: '5px 10px' }}>
          <img src={ticketIcon} alt="ticket" className="w-[30px] h-[30px] object-contain" />
          <div className="flex flex-col items-start leading-none">
            <span className="text-white/60 font-bold uppercase" style={{ fontSize: 9, letterSpacing: '0.1em' }}>БИЛЕТЫ</span>
            {isReady ? <span className="text-white font-black" style={{ fontSize: 'clamp(14px,4vw,18px)' }}>{fmtNum(myTickets)}</span> : <Skel w="40px" h="18px" />}
          </div>
          <button className="flex items-center justify-center rounded-lg text-white ml-1" style={{ width: 26, height: 26, background: 'linear-gradient(180deg,#888,#555)', border: '1.5px solid #000' }}>
            <IoAdd size={16} />
          </button>
        </div>

        <button onClick={() => setShowInfo(true)} className="absolute top-1 right-1 flex items-center justify-center rounded-full text-white active:scale-95" style={{ width: 34, height: 34, background: 'rgba(0,0,0,0.5)', border: '2px solid rgba(255,255,255,0.3)' }}>
          <IoInformationCircle size={20} />
        </button>

        <div className="absolute bottom-0 left-0 right-0 flex justify-center z-10">
          <div className="font-days font-black uppercase rounded-2xl text-black text-center" style={{ fontSize: 'clamp(15px, 4.5vw, 19px)', letterSpacing: '0.05em', background: '#da9d01', border: '2px solid black', boxShadow: '0 4px 16px rgba(0,0,0,0.7)', padding: '0.25rem 1.5rem' }}>
            ТУРНИР БИЛЕТОВ
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col" style={{ padding: '0 clamp(10px,3vw,16px) clamp(8px,3vw,15px)', gap: 'clamp(5px,1.6vw,9px)' }}>
        
        {msg && <div className="rounded-xl text-center font-extrabold text-[10.5px] text-white mt-1" style={{ padding: '7px 11px', background: msg.ok ? 'rgba(40,140,40,0.92)' : 'rgba(180,40,40,0.92)', border: '1.5px solid rgba(255,255,255,0.15)' }}>{msg.text}</div>}

        {/* Countdown */}
        <div className="rounded-2xl flex flex-col items-center justify-center mt-1" style={{ background: '#000', border: '2.2px solid #888', padding: '0.75rem' }}>
          <p className="font-days font-black uppercase tracking-widest" style={{ color: '#B0B0B0', fontSize: '9.5px' }}>ОСТАЛОСЬ</p>
          <p className="font-days font-black text-white mt-1 text-center" style={{ fontSize: 'clamp(24px, 8.5vw, 36px)', lineHeight: 1.1 }}>{countdown}</p>
        </div>

        {/* Prize Pool (FIXED WITH GRADIENT) */}
        <div className="rounded-[14px] flex items-center justify-center gap-1.5" style={{ background: 'linear-gradient(180deg,#2a2000,#1a1400)', border: '1.5px solid #c9940a', padding: 'clamp(5px,1.6vw,9px) 12px' }}>
          <span className="font-black uppercase tracking-widest" style={{ ...prizeTextStyle, fontSize: 'clamp(7.5px,2.3vw,10.5px)', letterSpacing: '0.15em' }}>
            ПРИЗОВОЙ ФОНД
          </span>
          <img src={faIcon} alt="ticket" className="w-3.5 h-3.5" />
          {tournaments ? (
            <span className="font-black" style={{ ...prizeTextStyle, fontSize: 'clamp(10px,2.8vw,13px)' }}>
              {fmtNum(prizePool)}
            </span>
          ) : (
            <Skel w="65px" />
          )}
        </div>

        {/* Stats */}
        <div className="flex gap-1.5">
          <div className="flex-1 rounded-[14px] text-center" style={{ background: 'linear-gradient(180deg,#222,#111)', border: '1.4px solid #444', padding: 'clamp(5px,2vw,7px)' }}>
            <p className="text-white font-bold m-0 mb-1" style={{ fontSize: '9.5px' }}>Текущая ставка</p>
            <div className="flex items-center justify-center gap-1">
              <img src={ticketIcon} alt="ticket" className="w-4 h-4" />
              <span className="text-yellow-300 font-black" style={{ fontSize: 'clamp(17px,4.8vw,24px)' }}>{fmtNum(myBet)}</span>
            </div>
          </div>
          <div className="flex-1 rounded-[14px] text-center" style={{ background: 'linear-gradient(180deg,#222,#111)', border: '1.4px solid #444', padding: 'clamp(7px,2vw,11px)' }}>
            <p className="text-white font-bold m-0 mb-1" style={{ fontSize: '9.5px' }}>Место</p>
            <span className="text-white font-black" style={{ fontSize: 'clamp(17px,4.8vw,24px)' }}>{myRank}</span>
          </div>
        </div>

        {/* Input Container */}
        <div className="rounded-[14px] flex flex-col" style={{ background: 'linear-gradient(180deg,#2a2a2a,#1a1a1a)', border: '1.4px solid #444', padding: '9px', gap: '7px' }}>
          <div className="flex items-center justify-between gap-1.5">
            <button onClick={decrement} className="shrink-0 rounded-full flex items-center justify-center text-white active:scale-95" style={{ width: '32px', height: '32px', background: 'linear-gradient(180deg,#777,#555)', border: '1.7px solid #888', boxShadow: '0 2.2px 0 #333' }}><IoRemove size={15}/></button>
            <span className="flex-1 text-center text-white font-black" style={{ fontSize: '24px' }}>{betAmount}</span>
            <button onClick={increment} className="shrink-0 rounded-full flex items-center justify-center text-white active:scale-95" style={{ width: '32px', height: '32px', background: 'linear-gradient(180deg,#777,#555)', border: '1.7px solid #888', boxShadow: '0 2.2px 0 #333' }}><IoAdd size={15}/></button>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            {PRESET_AMOUNTS.map((val) => {
              const isActive = selectedPreset === val;
              const disabled = val > myTickets;
              return (
                <button
                  key={val}
                  onClick={() => !disabled && pickPreset(val)}
                  className={`rounded-xl font-black transition-all ${disabled ? 'opacity-30 cursor-not-allowed' : 'active:scale-95'}`}
                  style={{
                    padding: '7.5px 0',
                    fontSize: '11px',
                    background: disabled ? '#333' : isActive ? 'linear-gradient(180deg,#5ecb1a,#3a9010)' : 'linear-gradient(180deg,#555,#3a3a3a)',
                    border: isActive ? '1.7px solid #2a6a08' : '1.7px solid #666',
                    color: '#fff',
                    boxShadow: isActive ? '0 2.2px 0 #1a5008' : '0 2.2px 0 #222'
                  }}
                >
                  {val.toLocaleString()}
                </button>
              )
            })}
          </div>
          <p className="text-white/40 text-[9px] text-center m-0">Доступно: <span className="text-yellow-300 font-extrabold">{fmtNum(myTickets)}</span> билетов</p>
        </div>

        {/* Main Action Button */}
        <button
          onClick={handleBet}
          disabled={!canBet}
          className="w-full flex flex-col items-center justify-center rounded-2xl transition-transform duration-100"
          style={{
            padding: '12px 0',
            background: canBet ? 'linear-gradient(180deg,#5ecb1a,#3a9010)' : 'rgba(80,80,80,0.5)',
            border: canBet ? '1.7px solid #2a6a08' : '1.7px solid #444',
            boxShadow: canBet ? '0 3.8px 0 #1a4a06' : 'none',
            cursor: canBet ? 'pointer' : 'not-allowed',
            opacity: canBet ? 1 : 0.6
          }}
        >
          <span className="text-white font-black" style={{ fontSize: '19px' }}>{actionLoading ? 'Ждите...' : 'Ставка'}</span>
          <span className="text-white/75 font-bold" style={{ fontSize: '10.5px' }}>{betAmount} Билетов</span>
        </button>
      </div>

      <TournamentInfoModal isOpen={showInfo} onClose={() => setShowInfo(false)} />
    </div>
  )
}

export default PageTen;