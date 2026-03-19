import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { fetchTournaments, fetchUsdtLeaderboard, fetchState } from '../redux/gameSlice'

import pageBg         from '../assets/page1bg.webp'
import logoHeader     from '../assets/page26Images/26-logo.webp' 
import imgHeroBanner  from '../assets/page12Images/cardbg.webp'
import imgTicketIcon  from '../assets/page12Images/ticket-icon.webp'
import imgTicketSmall from '../assets/page12Images/ticket-small.webp'
import imgMedal1      from '../assets/page12Images/medal-1.webp'
import imgMedal2      from '../assets/page12Images/medal-2.webp'
import imgMedal3      from '../assets/page12Images/medal-3.webp'

import Page13Modal from '../modals/Page13Modal'

// Helper for formatting numbers
const fmt = (n) => Number(n ?? 0).toLocaleString('ru-RU')

// ── Skeleton ──────────────────────────────────────────────────
const Skel = ({ w = '80px', h = '16px', radius = '6px' }) => (
  <div className="inline-block" style={{
    width: w, height: h, borderRadius: radius,
    background: 'rgba(255,255,255,0.1)',
    animation: 'skelPulse 1.4s ease-in-out infinite',
  }} />
)

// ── Countdown Hook ───────────────────────────────────────────
const useEndTsCountdown = (endTs) => {
  const calc = () => {
    if (!endTs) return '--:--:--:--';
    const now = Math.floor(Date.now() / 1000);
    const diff = Math.max(0, endTs - now);
    const dd = String(Math.floor(diff / 86400)).padStart(2, '0');
    const hh = String(Math.floor((diff % 86400) / 3600)).padStart(2, '0');
    const mm = String(Math.floor((diff % 3600) / 60)).padStart(2, '0');
    const ss = String(diff % 60).padStart(2, '0');
    return `${dd}:${hh}:${mm}:${ss}`;
  }
  const [display, setDisplay] = useState(calc);
  useEffect(() => {
    setDisplay(calc()); 
    const id = setInterval(() => setDisplay(calc()), 1000);
    return () => clearInterval(id);
  }, [endTs]);
  return display;
}

// ── Rank Badge ────────────────────────────────────────────────
const RankBadge = ({ rank }) => {
  if (rank === 1) return <img src={imgMedal1} alt="1" className="w-9 h-9 object-contain" />
  if (rank === 2) return <img src={imgMedal2} alt="2" className="w-9 h-9 object-contain" />
  if (rank === 3) return <img src={imgMedal3} alt="3" className="w-9 h-9 object-contain" />
  return <span className="font-black text-white text-base w-9 text-center block">{rank}</span>
}

// ── Player row ─────────────────────
const PlayerRow = ({ player, highlight }) => {
  if (!player) return null;
  
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

// ── Main Page ─────────────────────────────────────────────────
const Page12 = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [showInfo, setShowInfo] = useState(false)

  const { user, tournaments, usdtLeaderboard } = useSelector((s) => s.game)

  useEffect(() => {
    dispatch(fetchTournaments())
    dispatch(fetchUsdtLeaderboard(50))
    dispatch(fetchState())
  }, [dispatch])

  const tournament = tournaments?.usdt_draw;
  const endTs      = tournament?.end_ts;
  const prizePool  = tournament?.prize_pool_usdt || 0;
  const myTickets  = user?.tickets ?? 0;
  const countdown  = useEndTsCountdown(endTs);

  const leaderRows = useMemo(() => {
    const raw = Array.isArray(usdtLeaderboard) ? usdtLeaderboard : (usdtLeaderboard?.leaderboard || [])
    return raw.map((p, i) => ({
      rank: i + 1,
      avatar: p.photo_url || null,
      level: p.main_level ?? 1,
      name: p.username || p.first_name || `Player${p.user_id}`,
      tickets: p.tickets ?? p.ticket_count ?? 0,
      isMe: p.user_id === user?.user_id,
    }))
  }, [usdtLeaderboard, user])

  const meRow = leaderRows.find(p => p.isMe) || { 
    rank: 999, name: user?.first_name || 'Вы', tickets: 0, level: user?.main_level || 1, isMe: true 
  };

  return (
    <div className="w-full flex flex-col overflow-hidden h-[100dvh]" style={{ backgroundImage: `url(${pageBg})`, backgroundSize: 'cover' }}>
      <style>{`@keyframes skelPulse { 0%,100%{opacity:0.3} 50%{opacity:0.7} }`}</style>
      
      {/* ── HEADER (EXACT PAGE 9 MATCH) ── */}
      <div className="shrink-0">
        <div style={{ background: "#000", padding: "10px 0", borderBottom: "1px solid #222" }}>
          <div style={{ width: 130, height: 28, position: "relative", margin: "0 auto" }}>
            <img src={logoHeader} alt="Logo" style={{ position: "absolute", width: 210, top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2">
        {/* HERO CARD */}
        <div className="relative rounded-2xl overflow-hidden mt-0]" style={{ border: '2px solid #c89000' }}>
          <div className="relative" style={{ height: `${Math.round(414 / 2.2)}px` }}>
            <img src={imgHeroBanner} alt="hero" className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg,transparent 50%,rgba(0,0,0,0.6) 100%)' }} />

            <div onClick={() => navigate('/shop')} className="absolute top-1 left-1 z-20 flex items-center gap-2 rounded-xl px-2 py-1 border-black border-2 cursor-pointer active:scale-95 transition-transform" style={{ background: '#888784' }}>
              <img src={imgTicketIcon} alt="ticket" className="w-[30px] h-[30px] object-contain" />
              <div className="flex flex-col leading-none">
                <span className="font-days font-bold uppercase" style={{ fontSize: '10px', letterSpacing: '1px', background: 'linear-gradient(0deg, #5b5b5b, #ffffff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>БИЛЕТЫ</span>
                <span className="font-days font-black text-white text-sm">{fmt(myTickets)}</span>
              </div>
              <button className="flex items-center justify-center rounded-lg font-black text-white text-lg leading-none" style={{ width: 26, height: 26, background: '#6e6e6e', border: '1.5px solid #000' }}>+</button>
            </div>

            <button onClick={() => setShowInfo(true)} className="absolute top-1 right-1 z-20 flex items-center justify-center rounded-full font-black text-white text-base active:scale-95 transition-transform" style={{ width: 36, height: 36, background: 'rgba(0,0,0,0.45)', border: '2px solid rgba(255,255,255,0.45)' }}>i</button>

            <div className="absolute bottom-0 left-0 right-0 flex justify-center z-10">
              <div className="font-days font-black uppercase rounded-2xl text-black text-center" style={{ fontSize: 'clamp(15px, 4.5vw, 19px)', letterSpacing: '0.05em', background: '#da9d01', border: '2px solid black', boxShadow: '0 4px 16px rgba(0,0,0,0.7)', padding: '0.25rem 1.5rem' }}>
                ТУРНИР USDT
              </div>
            </div>
          </div>
        </div>

        {/* COUNTDOWN BOX */}
        <div className="rounded-2xl flex flex-col items-center justify-center py-3 mt-2" style={{ background: '#000000', border: '3px solid #888888', padding: '1rem' }}>
          <p className="font-days font-black uppercase tracking-widest" style={{ color: '#B0B0B0', fontSize: '12px', letterSpacing: '0.05em' }}>ОСТАЛОСЬ</p>
          <p className="font-days font-black text-white mt-1 text-center" style={{ fontSize: 'clamp(34px, 11vw, 50px)', letterSpacing: '0.05em', lineHeight: 1.1 }}>{countdown}</p>
        </div>

        {/* PRIZE POOL */}
        <div
          className="flex items-center justify-center gap-2 rounded-full py-2 mt-2"
          style={{ 
            background: 'linear-gradient(180deg,#1a1200,#0a0800)', 
            border: '1.5px solid #c89000' 
          }}
        >
          <span 
            className="font-black uppercase tracking-widest text-[11px]"
            style={{
              background: 'linear-gradient(180deg, #e7aa51, #ffe499, #8d5a1b, #e7aa51, #ac7031)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            ПРИЗОВОЙ ФОНД
          </span>

          <img src={imgTicketSmall} alt="ticket" className="w-[18px] h-[18px] object-contain" />
          
          {tournament ? (
            <span 
              className="font-black"
              style={{ 
                fontSize: '15px',
                background: 'linear-gradient(180deg, #e7aa51, #ffe499, #8d5a1b, #e7aa51, #ac7031)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {fmt(prizePool)}
            </span>
          ) : (
            <Skel w="60px" h="16px" />
          )}
        </div>

        {/* LEADERBOARD */}
        <div className="flex flex-col gap-1.5 mt-2 mb-32">
          {usdtLeaderboard ? (
            leaderRows.length > 0 ? (
              leaderRows.map((player) => <PlayerRow key={player.rank} player={player} highlight={player.isMe} />)
            ) : (
              <p className="text-white/50 text-center py-4 font-bold">Нет участников. Будь первым!</p>
            )
          ) : (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="rounded-2xl px-2 py-1.5" style={{ background: 'linear-gradient(90deg,#111,#1a1a1a)', border: '1.5px solid #2a2a2a', minHeight: 52 }}>
                <Skel w="100%" h="36px" radius="10px" />
              </div>
            ))
          )}
        </div>
      </div>

      {/* STICKY BOTTOM */}
      <div className="shrink-0 px-2 pt-1.5 pb-2" style={{ background: 'linear-gradient(180deg,rgba(0,0,0,0.97),#000)', borderTop: '1px solid #2a2a2a' }}>
        <PlayerRow player={meRow} highlight />
      </div>

      <Page13Modal isOpen={showInfo} onClose={() => setShowInfo(false)} />
    </div>
  )
}

export default Page12;