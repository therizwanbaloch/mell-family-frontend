import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import imgModalBanner from "../assets/page9Images/modal-banner.webp";

const useEndTsCountdown = (endTs) => {
  const calc = () => {
    if (!endTs) return '03:00:00'
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

const TournamentInfoModal = ({ isOpen, onClose }) => {
  const [visible,   setVisible]   = useState(false)
  const [animateIn, setAnimateIn] = useState(false)

  const { tournaments } = useSelector((state) => state.game)
  const endTs     = tournaments?.ticket_tournament?.end_ts
  const countdown = useEndTsCountdown(endTs)

  useEffect(() => {
    if (isOpen) {
      setVisible(true)
      requestAnimationFrame(() => requestAnimationFrame(() => setAnimateIn(true)))
    } else {
      setAnimateIn(false)
      const t = setTimeout(() => setVisible(false), 380)
      return () => clearTimeout(t)
    }
  }, [isOpen])

  if (!visible) return null

  return (
    // backdrop — no flex centering, just sticks sheet to very bottom
    <div
      onClick={onClose}
      className={`fixed inset-0 z-50 transition-all duration-300
        ${animateIn ? 'bg-black/70 backdrop-blur-sm' : 'bg-black/0 backdrop-blur-none'}`}
    >
      {/* Sheet — absolute bottom:0, exact 65dvh, zero gap from bottom */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`absolute bottom-0 left-0 right-0 rounded-t-3xl shadow-2xl
          transition-transform duration-[380ms] ease-[cubic-bezier(0.32,0.72,0,1)]
          ${animateIn ? 'translate-y-0' : 'translate-y-full'}`}
        style={{
          height: '65dvh',
          maxWidth: '430px',
          margin: '0 auto',
          background: 'linear-gradient(180deg,#636363 0%,#474747 100%)',
          border: '2px solid #888',
          borderBottom: 'none',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-2 shrink-0">
          <div className="w-10 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.3)' }} />
        </div>

        {/* Close btn */}
        <div className="flex justify-end px-3 pt-1 pb-1 shrink-0">
          <button
            onClick={onClose}
            className="flex items-center gap-1 rounded-lg px-2.5 py-1 font-black text-white active:scale-95 transition-transform"
            style={{ background: 'linear-gradient(180deg,#555,#333)', border: '1.5px solid #777', fontSize: 12 }}
          >
            <span style={{ color: '#e03030', fontSize: 13 }}>✕</span>
            Закрыть
          </button>
        </div>

        {/* Content — fills remaining height, no overflow */}
        <div className="flex flex-col flex-1 px-3 pb-3 gap-2 min-h-0">

          {/* Banner — 1/3 of total sheet height */}
          <div
            className="rounded-xl overflow-hidden shrink-0"
            style={{ height: 'calc(65dvh / 3)', border: '1.5px solid #666' }}
          >
            <img
              src={imgModalBanner}
              alt="tournament"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>

          {/* Description */}
          <div
            className="rounded-xl px-3 py-2 shrink-0"
            style={{ background: 'linear-gradient(180deg,#585858,#3c3c3c)', border: '1.5px solid #666' }}
          >
            <p className="text-white font-bold text-center leading-tight" style={{ fontSize: 11 }}>
              Ставь билеты и получи шанс стать самым богатым в{' '}
              <span className="font-black">DRUN FAMILY GAME!</span>
            </p>
          </div>

          {/* Countdown */}
          <div
            className="rounded-xl flex flex-col items-center justify-center py-2 shrink-0"
            style={{ background: 'linear-gradient(180deg,#1a1a1a,#0d0d0d)', border: '2px solid #555' }}
          >
            <p className="font-black text-white uppercase" style={{ fontSize: 10, letterSpacing: '0.2em' }}>
              ОСТАЛОСЬ
            </p>
            <p className="font-black text-white" style={{ fontSize: '30px', letterSpacing: '0.05em', lineHeight: 1.15 }}>
              {countdown}
            </p>
            <p className="font-semibold text-center" style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginTop: 1 }}>
              Турнир проходит раз в три часа
            </p>
          </div>

          {/* Rules */}
          <div
            className="rounded-xl px-3 py-2 shrink-0"
            style={{ background: 'linear-gradient(180deg,#525252,#383838)', border: '1.5px solid #666' }}
          >
            <p className="text-white font-bold text-center leading-snug" style={{ fontSize: 11 }}>
              Ставки может сделать каждый, но победит только друн, который поставит больше всех — он и заберет все билеты.
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}

export default TournamentInfoModal