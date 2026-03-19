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
  const [visible, setVisible] = useState(false)
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
    <div
      onClick={onClose}
      className={`fixed inset-0 z-50 transition-all duration-300
        ${animateIn ? 'bg-black/70 backdrop-blur-sm' : 'bg-black/0 backdrop-blur-none'}`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`absolute bottom-0 left-0 right-0 rounded-t-3xl shadow-2xl
          transition-transform duration-[380ms] ease-[cubic-bezier(0.32,0.72,0,1)]
          ${animateIn ? 'translate-y-0' : 'translate-y-full'}`}
        style={{
          height: '83vh',
          maxWidth: '430px',
          margin: '0 auto',
          background: '#545454', 
          border: '2px solid #000', 
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          marginLeft: '4px',
          marginRight: '4px'
        }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-2 shrink-0">
          <div className="w-10 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.3)' }} />
        </div>

        {/* Close button */}
        <div className="flex justify-end px-3  pb-2 shrink-0">
          <button
            onClick={onClose}
            className="flex items-center gap-1 rounded-lg px-2.5 py-1 text-black text-sm active:scale-95 transition-transform bg-[#b4b4b4]"
          >
            <span className="texy-sm">❌</span>
            Закрыть
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 px-3 pb-3 gap-2 min-h-0">

          {/* Banner image */}
          <div
            className="rounded-xl overflow-hidden shrink-0"
            style={{
              height: '40%', 
              border: '2px solid #000', 
            }}
          >
            <img
              src={imgModalBanner}
              alt="tournament"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>

          {/* Grayish text div attached to image */}
          <div
            className="rounded-lg px-3 py-2 shrink-0"
            style={{ background: '#3d3838', marginTop: '-7px' }}
          >
            <p className="text-white text-center text-sm" style={{ fontSize: 11 }}>
              Ставь билеты и получи шанс <br /> стать самым богатым в DRUN <br /> FAMILY GAME!
            </p>
          </div>

          {/* Countdown div */}
          <div
            className="rounded-xl flex flex-col items-center justify-center py-2 shrink-0"
            style={{
              background: '#000',
              border: '3px solid #fff',
            }}
          >
            <p className="font-black text-white uppercase font-nunito" style={{ fontSize: 10, letterSpacing: '0.2em' }}>
              ОСТАЛОСЬ
            </p>
            <p className="font-black text-white" style={{ fontSize: '30px', letterSpacing: '0.05em', lineHeight: 1.15 }}>
              {countdown}
            </p>
            
          </div>

          <div
            className="rounded-lg px-3 py-1 shrink-0 mt-2"
            style={{ background: '#3d3838', marginTop: '-7px' }}
          >
            <p className="text-white text-center text-sm" style={{ fontSize: 11 }}>
              Турнир проходит раз в три часа
            </p>
          </div>


              {/* Final info text */}
          
          <div
            className="rounded-lg px-3 py-1 shrink-0 "
            style={{ background: '#3d3838', marginTop: '4px' }}
          >
            <p className="text-white text-center text-sm" style={{ fontSize: 11 }}>
              Ставки может сделать каждый, <br /> но победит только друн, который<br /> поставит больше всех - он и <br /> заберет все билеты.
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}

export default TournamentInfoModal