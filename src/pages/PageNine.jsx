import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { fetchTournaments, fetchTicketLeaderboard, fetchState } from '../redux/gameSlice'
import { IoAdd, IoInformationCircle } from 'react-icons/io5'

import TournamentInfoModal from '../modals/TournamentInfoModal'
import pageBg         from '../assets/page1bg.webp'
import logoHeader     from '../assets/page26Images/26-logo.webp' 
import heroBg         from '../assets/page10Images/cardbg.webp'
import ticketIcon     from '../assets/page10Images/ticket-icon.webp'
import imgTicketSmall from '../assets/page10Images/ticket-small.webp'

import imgMedal1      from '../assets/page9Images/medal-1.webp'
import imgMedal2      from '../assets/page9Images/medal-2.webp'
import imgMedal3      from '../assets/page9Images/medal-3.webp'

const Skel = ({ w = '80px', h = '16px', radius = '6px' }) => (
  <div style={{ width: w, height: h, borderRadius: radius, background: 'rgba(255,255,255,0.1)', animation: 'skelPulse 1.4s ease-in-out infinite', display: 'inline-block' }} />
)

const useEndTsCountdown = (endTs) => {
  const calc = () => {
    if (!endTs) return '--:--:--'
    const ts = endTs > 10000000000 ? Math.floor(endTs / 1000) : endTs;
    const now = Math.floor(Date.now() / 1000)
    const diff = Math.max(0, ts - now)
    const h = String(Math.floor(diff / 3600)).padStart(2, '0')
    const m = String(Math.floor((diff % 3600) / 60)).padStart(2, '0')
    const s = String(diff % 60).padStart(2, '0')
    return `${h}:${m}:${s}`
  }
  const [display, setDisplay] = useState(calc())
  useEffect(() => {
    setDisplay(calc())
    const id = setInterval(() => setDisplay(calc()), 1000)
    return () => clearInterval(id)
  }, [endTs])
  return display
}

const RankBadge = ({ rank }) => {
  if (rank === 1) return <img src={imgMedal1} alt="1" className="w-9 h-9 object-contain" />
  if (rank === 2) return <img src={imgMedal2} alt="2" className="w-9 h-9 object-contain" />
  if (rank === 3) return <img src={imgMedal3} alt="3" className="w-9 h-9 object-contain" />
  return <span className="font-black text-white text-base w-9 text-center block">{rank}</span>
}

const PlayerRow = ({ player, highlight }) => {
  const rowBg = player.rank === 1 ? 'linear-gradient(90deg,#2a1a00,#3a2800)' : player.rank === 2 ? 'linear-gradient(90deg,#0a1a2a,#102040)' : player.rank === 3 ? 'linear-gradient(90deg,#1a1000,#2a1800)' : highlight ? 'linear-gradient(90deg,#1a1a1a,#2a2a2a)' : 'linear-gradient(90deg,#111,#1a1a1a)'
  const rowBorder = player.rank === 1 ? '#c89000' : player.rank === 2 ? '#2060a0' : player.rank === 3 ? '#8a5000' : highlight ? '#555' : '#2a2a2a'
  const fmt = (n) => Number(n ?? 0).toLocaleString('ru-RU')
  return (
    <div className="flex items-center gap-2 rounded-2xl px-2 py-1.5 shrink-0" style={{ background: rowBg, border: `1.5px solid ${rowBorder}`, minHeight: '52px' }}>
      <div className="flex items-center justify-center shrink-0 w-9"><RankBadge rank={player.rank} /></div>
      <div className="rounded-full overflow-hidden shrink-0 flex items-center justify-center w-10 h-10" style={{ background: '#333', border: `2px solid ${rowBorder}` }}>
        {player.avatar ? <img src={player.avatar} alt={player.name} className="w-full h-full object-cover" /> : <span className="text-xl">👤</span>}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1 flex-wrap">
          <span className="font-black text-white shrink-0 text-[11px] rounded-full px-1.5 py-px" style={{ background: '#2a5a2a', border: '1px solid #4a9a20' }}>{player.level ?? '?'} lvl</span>
          {player.isMe && <span className="font-black text-yellow-300 text-[13px]">ВЫ</span>}
          <span className="text-white font-semibold truncate text-[13px]">{player.name}</span>
        </div>
      </div>
      <div className="flex items-center gap-1 rounded-full px-2 py-1 shrink-0" style={{ background: 'linear-gradient(180deg,#5a4a00,#3a3000)', border: '1.5px solid #c89000' }}>
        <img src={imgTicketSmall} alt="ticket" className="w-4 h-4 object-contain" />
        <span className="font-black text-yellow-300 text-[13px]">{fmt(player.tickets)}</span>
      </div>
    </div>
  )
}

const PageNine = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [showInfo, setShowInfo] = useState(false)
  const { user, tournaments, ticketLeaderboard } = useSelector((s) => s.game)

  useEffect(() => {
    dispatch(fetchState())
    dispatch(fetchTournaments())
    dispatch(fetchTicketLeaderboard(50))
  }, [dispatch])

  const tournament = tournaments?.ticket_tournament || tournaments;
  const endTs      = tournament?.end_ts;
  const prizePool  = tournament?.prize_pool_tickets ?? 0;
  const countdown  = useEndTsCountdown(endTs);

  const myTickets  = user?.tickets ?? 0
  const myName     = user?.username || user?.first_name || 'ВЫ'
  const myLevel    = user?.main_level ?? 1
  const myUserId   = user?.user_id

  const rawList = Array.isArray(ticketLeaderboard) ? ticketLeaderboard : (ticketLeaderboard?.leaderboard ?? ticketLeaderboard?.entries ?? [])
  const leaderRows = rawList.map((p, i) => ({ rank: i + 1, avatar: p.photo_url || null, level: p.main_level ?? 1, name: p.username || p.first_name || `Player${p.user_id}`, tickets: p.bet_amount ?? p.tickets ?? 0, isMe: p.user_id === myUserId }))
  const myRankInBoard = leaderRows.findIndex((r) => r.isMe)
  const myRankNumber = myRankInBoard >= 0 ? myRankInBoard + 1 : '?'
  const myBetAmount = myRankInBoard >= 0 ? leaderRows[myRankInBoard].tickets : 0
  const meRow = { rank: typeof myRankNumber === 'number' ? myRankNumber : 999, avatar: null, level: myLevel, name: myName, tickets: myBetAmount, isMe: true }
  const fmt = (n) => Number(n ?? 0).toLocaleString('ru-RU')

  // Prize Style from Page 12
  const prizeTextStyle = {
    background: 'linear-gradient(180deg, #e7aa51, #ffe499, #8d5a1b, #e7aa51, #ac7031)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  };

  return (
    <div className="w-full flex flex-col" style={{ backgroundImage: `url(${pageBg})`, backgroundSize: 'cover', backgroundPosition: 'center', maxWidth: '430px', margin: '0 auto', height: '100dvh', overflow: 'hidden' }}>
      <style>{`@keyframes skelPulse { 0%,100%{opacity:0.3} 50%{opacity:0.7} }`}</style>
      
      <div className="shrink-0">
        <div style={{ background: "#000", padding: "10px 0", borderBottom: "1px solid #222" }}>
          <div style={{ width: 130, height: 28, position: "relative", margin: "0 auto" }}>
            <img src={logoHeader} alt="Logo" style={{ position: "absolute", width: 210, top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pt-3" style={{ WebkitOverflowScrolling: 'touch', paddingBottom: '140px' }}>
        <div className="shrink-0 relative rounded-[18px] overflow-hidden mx-2" style={{ border: '2px solid #c9940a', boxShadow: '0 4px 24px rgba(201,148,10,0.35)' }}>
          <img src={heroBg} alt="Hero" className="w-full h-full block object-cover object-top" style={{ height: 'clamp(160px,38vw,220px)' }} />
          <div onClick={() => navigate('/page21')} className="absolute top-1 left-1 flex items-center gap-1.5 rounded-xl cursor-pointer active:scale-95 transition-transform" style={{ background: '#888784', border: '2px solid #000', padding: '5px 10px' }}>
            <img src={ticketIcon} alt="ticket" className="w-[30px] h-[30px] object-contain" />
            <div className="flex flex-col items-start leading-none">
              <span className="text-white/60 font-bold uppercase" style={{ fontSize: 9, letterSpacing: '0.1em' }}>БИЛЕТЫ</span>
              {user ? <span className="text-white font-black" style={{ fontSize: 'clamp(14px,4vw,18px)' }}>{fmt(myTickets)}</span> : <Skel w="40px" h="18px" />}
            </div>
            <button className="flex items-center justify-center rounded-lg text-white ml-1" style={{ width: 26, height: 26, background: 'linear-gradient(180deg,#888,#555)', border: '1.5px solid #000' }}><IoAdd size={16} /></button>
          </div>
          <button onClick={() => setShowInfo(true)} className="absolute top-1 right-1 flex items-center justify-center rounded-full text-white active:scale-95" style={{ width: 34, height: 34, background: 'rgba(0,0,0,0.5)', border: '2px solid rgba(255,255,255,0.3)' }}><IoInformationCircle size={20} /></button>
          <div className="absolute bottom-0 left-0 right-0 flex justify-center z-10">
            <div className="font-days font-black uppercase rounded-2xl text-black text-center" style={{ fontSize: 'clamp(15px, 4.5vw, 19px)', letterSpacing: '0.05em', background: '#da9d01', border: '2px solid black', boxShadow: '0 4px 16px rgba(0,0,0,0.7)', padding: '0.25rem 1.5rem' }}>ТУРНИР БИЛЕТОВ</div>
          </div>
        </div>
        
        <div className="rounded-2xl flex flex-col items-center justify-center py-3 mt-2" style={{ background: '#000000', border: '3px solid #888888', padding: '1rem' }}>
          <p className="font-days font-black uppercase tracking-widest" style={{ color: '#B0B0B0', fontSize: '12px' }}>ОСТАЛОСЬ</p>
          <p className="font-days font-black text-white mt-1 text-center" style={{ fontSize: 'clamp(34px, 11vw, 50px)', letterSpacing: '0.05em', lineHeight: 1.1 }}>{countdown}</p>
        </div>

        {/* PRIZE POOL SECTION (MATCHED WITH PAGE 12) */}
        <div className="flex items-center justify-center gap-2 rounded-full py-2 mt-2" style={{ background: 'linear-gradient(180deg,#1a1200,#0a0800)', border: '1.5px solid #c89000' }}>
          <span className="font-black uppercase tracking-widest text-[11px]" style={prizeTextStyle}>
            ПРИЗОВОЙ ФОНД
          </span>
          <img src={imgTicketSmall} alt="ticket" className="w-[18px] h-[18px] object-contain" />
          {tournaments ? (
            <span className="font-black" style={{ ...prizeTextStyle, fontSize: '15px' }}>
              {fmt(prizePool)}
            </span>
          ) : (
            <Skel w="80px" h="16px" />
          )}
        </div>

        <div className="flex flex-col gap-1.5 mt-2">
          {ticketLeaderboard !== null ? leaderRows.length > 0 ? leaderRows.map((player) => (<PlayerRow key={player.rank} player={player} highlight={player.isMe} />)) : <p className="text-white/50 text-center py-4 font-bold">Нет ставок. Будь первым!</p> : Array.from({ length: 5 }).map((_, i) => (<div key={i} className="rounded-2xl px-2 py-1.5" style={{ background: 'linear-gradient(90deg,#111,#1a1a1a)', border: '1.5px solid #2a2a2a', minHeight: 52 }}><Skel w="100%" h="36px" radius="10px" /></div>))}
        </div>
      </div>

      <div className="shrink-0 px-2 pt-1.5" style={{ background: 'linear-gradient(180deg,rgba(0,0,0,0.97),#000)', borderTop: '1px solid #2a2a2a' }}>
        <PlayerRow player={meRow} highlight />
        <button onClick={() => navigate('/page10')} className="w-full mt-1.5 rounded-2xl font-black text-black active:scale-95 transition-transform italic" style={{ fontSize: 'clamp(20px,6vw,26px)', padding: '11px 0', marginBottom: '10px', background: 'linear-gradient(180deg,#f0c020,#c89000)', border: '4px solid #8a6000', boxShadow: '0 4px 0 #6a4000' }}>Сделать ставку</button>
      </div>
      <TournamentInfoModal isOpen={showInfo} onClose={() => setShowInfo(false)} endTs={endTs} />
    </div>
  )
}

export default PageNine;