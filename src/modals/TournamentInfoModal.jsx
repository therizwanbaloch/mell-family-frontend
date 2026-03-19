import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import imgModalBanner from "../assets/page9Images/modal-banner.webp";

const useEndTsCountdown = (endTs) => {
  const calc = () => {
    if (!endTs) return '03:00:00'
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

const TournamentInfoModal = ({ isOpen, onClose }) => {
  const [visible, setVisible] = useState(false)
  const [animateIn, setAnimateIn] = useState(false)

  const { tournaments } = useSelector((state) => state.game)
  const tournament = tournaments?.ticket_tournament || tournaments
  const endTs      = tournament?.end_ts
  const countdown = useEndTsCountdown(endTs)

  useEffect(() => {
    if (isOpen) {
      setVisible(true)
      // Double requestAnimationFrame ensures the browser paints before starting transition
      requestAnimationFrame(() => requestAnimationFrame(() => setAnimateIn(true)))
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    } else {
      setAnimateIn(false)
      document.body.style.overflow = '';
      const t = setTimeout(() => setVisible(false), 380)
      return () => clearTimeout(t)
    }
    return () => { document.body.style.overflow = ''; }
  }, [isOpen])

  if (!visible) return null

  return (
    <div
      onClick={onClose}
      className={`fixed inset-0 z-[100] flex flex-col justify-end transition-all duration-300
        ${animateIn ? 'bg-black/80 backdrop-blur-[2px]' : 'bg-black/0 backdrop-blur-none'}`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full mx-auto rounded-t-[32px] shadow-2xl flex flex-col
          transition-transform duration-[400ms] ease-[cubic-bezier(0.32,0.72,0,1)]
          ${animateIn ? 'translate-y-0' : 'translate-y-full'}`}
        style={{
          maxWidth: '430px',
          height: '75dvh', // Use dvh for dynamic viewport height (fixes mobile bars)
          background: '#4a4a4a', 
          border: '2px solid #000',
          borderBottom: 'none',
          paddingBottom: 'calc(env(safe-area-inset-bottom) + 16px)' // Essential for iPhone/Android nav bar
        }}
      >
        {/* Native Pull Handle */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-12 h-1.5 rounded-full bg-white/20" />
        </div>

        {/* Header with Close Button */}
        <div className="flex justify-end px-5 py-2 shrink-0">
          <button
            onClick={onClose}
            className="flex items-center gap-2 rounded-xl px-4 py-2 bg-[#b4b4b4] text-black font-black text-xs active:scale-90 transition-transform shadow-[0_2px_0_#000]"
            style={{ border: '1.5px solid #000' }}
          >
            <span>❌</span>
            Закрыть
          </button>
        </div>

        {/* Main Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-5 pb-4 space-y-4 no-scrollbar">
          
          {/* Banner */}
          <div className="rounded-2xl overflow-hidden border-2 border-black shadow-lg">
            <img
              src={imgModalBanner}
              alt="tournament"
              className="w-full aspect-video object-cover block"
            />
          </div>

          {/* Tagline Box */}
          <div className="rounded-xl px-4 py-3 bg-[#3d3838] border border-white/5">
            <p className="text-white text-center font-bold italic leading-tight" style={{ fontSize: '13px' }}>
              Ставь билеты и получи шанс стать самым богатым в DRUN FAMILY GAME!
            </p>
          </div>

          {/* Countdown Section */}
          <div className="rounded-2xl flex flex-col items-center justify-center py-5 bg-black border-2 border-[#da9d01] shadow-[0_0_20px_rgba(218,157,1,0.15)]">
            <p className="font-black text-[#888] uppercase tracking-[0.2em] mb-1" style={{ fontSize: '10px' }}>
              ОСТАЛОСЬ
            </p>
            <p className="font-days font-black text-white" style={{ fontSize: '40px', lineHeight: 1 }}>
              {countdown}
            </p>
          </div>

          {/* Info Blocks */}
          <div className="space-y-2">
            <div className="rounded-xl px-4 py-2 bg-[#3d3838] border border-white/5">
              <p className="text-[#ccc] text-center font-bold" style={{ fontSize: '11px' }}>
                Турнир проходит раз в три часа
              </p>
            </div>

            <div className="rounded-xl px-4 py-4 bg-[#3d3838] border border-white/5">
              <p className="text-white text-center font-medium leading-relaxed" style={{ fontSize: '12.5px' }}>
                Ставки может сделать каждый, но победит только друн, который поставит больше всех — он и заберет весь призовой фонд.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Tailwind helper to hide scrollbars */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  )
}

export default TournamentInfoModal;