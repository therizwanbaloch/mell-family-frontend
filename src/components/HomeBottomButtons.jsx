import React, { useState, useEffect } from 'react'
import { BsLightningChargeFill } from 'react-icons/bs'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchTournaments } from '../redux/gameSlice'

const HomeBottomButtons = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { user, tournaments } = useSelector((s) => s.game)

  // ── Energy ───────────────────────────────────────────────
  const energy    = user?.energy ?? 0
  const maxEnergy = 1000
  const energyPct = Math.max(0, Math.min(100, (energy / maxEnergy) * 100))
  const energyLow = energyPct <= 30

  // ── Tournament countdown ─────────────────────────────────
  const [timeLeft, setTimeLeft] = useState('--:--:--')

  useEffect(() => { dispatch(fetchTournaments()) }, [dispatch])

  useEffect(() => {
    const endTs = tournaments?.ticket_tournament?.end_ts
    if (!endTs) return
    const tick = () => {
      const diff = Math.max(0, endTs - Math.floor(Date.now() / 1000))
      const h = String(Math.floor(diff / 3600)).padStart(2, '0')
      const m = String(Math.floor((diff % 3600) / 60)).padStart(2, '0')
      const s = String(diff % 60).padStart(2, '0')
      setTimeLeft(`${h}:${m}:${s}`)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [tournaments])

  // ── Shared gold button style ─────────────────────────────
  const goldStyle = {
    background: 'linear-gradient(180deg,#f0a800 0%,#da9d01 50%,#b87e00 100%)',
    border: '2px solid #b58030',
    boxShadow: '0 5px 0 #7a4e00, 0 7px 10px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.25)',
  }

  return (
    <div className="w-[92%] mx-auto flex flex-col gap-2 pb-4 mt-1">

      {/* Timer button — navigates to /nine */}
      <div
        onClick={() => navigate('/nine')}
        className="px-4 py-2 rounded-xl cursor-pointer active:scale-[0.97] transition-transform"
        style={{ width: 'fit-content', ...goldStyle }}
      >
        <h2
          className="font-black uppercase leading-tight"
          style={{
            fontSize: 'clamp(10px,3vw,14px)',
            color: '#412c05',
            textShadow: '0 1px 0 rgba(255,255,255,0.2)',
            whiteSpace: 'nowrap',
          }}
        >
          УСПЕЙ<br />ПОБЕДИТЬ!
        </h2>
        <h3 className="font-black" style={{ fontSize: 'clamp(16px,5vw,22px)', color: '#000' }}>
          {timeLeft}
        </h3>
      </div>

      {/* Energy bar + УЛУЧШАЙ */}
      <div className="flex items-center gap-2">

        {/* Energy bar row */}
        <div className="flex flex-1 items-center min-w-0">

          {/* Lightning circle */}
          <div
            className="shrink-0 rounded-full flex items-center justify-center z-10 -mr-3"
            style={{
              width: 'clamp(34px,9vw,42px)', height: 'clamp(34px,9vw,42px)',
              background: 'linear-gradient(180deg,#ffe033,#FFD700)',
              border: '2px solid #b58030',
              boxShadow: '0 4px 0 #7a4e00, 0 6px 8px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.3)',
            }}
          >
            <BsLightningChargeFill color="#000" style={{ fontSize: 'clamp(14px,4vw,20px)' }} />
          </div>

          {/* Bar */}
          <div
            className="flex-1 rounded-xl overflow-hidden relative"
            style={{
              paddingLeft: 'clamp(18px,5vw,24px)',
              height: 'clamp(34px,9vw,42px)',
              background: 'rgba(0,0,0,0.45)',
              border: '2px solid #FFD700',
              boxShadow: '0 4px 0 #1a5c00, 0 6px 8px rgba(0,0,0,0.4)',
            }}
          >
            {/* Fill */}
            <div
              className="absolute inset-0 rounded-[inherit] transition-[width,background] duration-300"
              style={{
                width: `${energyPct}%`,
                background: energyLow
                  ? 'linear-gradient(180deg,#ff6600,#ff3300)'
                  : 'linear-gradient(180deg,#53a00d,#0ab621)',
              }}
            />
            {/* Label */}
            <span
              className="absolute inset-0 flex items-center justify-center font-black z-10 whitespace-nowrap text-white"
              style={{
                fontSize: 'clamp(11px,3.5vw,15px)',
                textShadow: '0 1px 4px rgba(0,0,0,0.9)',
              }}
            >
              {Math.floor(energy)}/{maxEnergy}
            </span>
          </div>
        </div>

        {/* УЛУЧШАЙ button — navigates to /page14 */}
        <button
          onClick={() => navigate('/page14')}
          className="shrink-0 rounded-xl font-black uppercase tracking-wide active:scale-95 transition-transform"
          style={{
            paddingInline: 'clamp(10px,3vw,18px)',
            paddingBlock: 'clamp(6px,2vw,10px)',
            fontSize: 'clamp(10px,3vw,14px)',
            color: '#412c05',
            textShadow: '0 1px 0 rgba(255,255,255,0.2)',
            whiteSpace: 'nowrap',
            ...goldStyle,
          }}
        >
          УЛУЧШАЙ
        </button>

      </div>
    </div>
  )
}

export default HomeBottomButtons