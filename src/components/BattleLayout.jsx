import React, { useState, useCallback, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { doTap, fetchState } from '../redux/gameSlice'

import layout1    from '../assets/layout1.webp'
import layout2    from '../assets/layout2.webp'
import layout3    from '../assets/layout3.webp'
import layout4    from '../assets/layout4.webp'
import layout5    from '../assets/layout5.webp'
import layout6    from '../assets/layout6.webp'
import layoutMain from '../assets/layoutMain.webp'

import Page8Modal from '../modals/Page8Modal'

// ── Floating +FA label ────────────────────────────────────────
const FloatingLabel = ({ x, y, value }) => (
  <div style={{
    position: 'fixed', left: x, top: y,
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none', zIndex: 9999,
    animation: 'floatUp 0.85s ease-out forwards',
    color: '#FFD700', fontWeight: 900, fontSize: '22px',
    textShadow: '0 2px 8px rgba(0,0,0,0.9), 0 0 16px rgba(255,215,0,0.7)',
    whiteSpace: 'nowrap',
  }}>
    +{value}
  </div>
)

// ── Side icon button ──────────────────────────────────────────
const SideIcon = ({ src, label, onClick }) => (
  <div
    className="flex flex-col items-center gap-0.5 cursor-pointer active:opacity-70 transition-opacity"
    onClick={onClick}
  >
    <img
      src={src} alt={label}
      className="w-[46px] h-[46px] rounded-[10px] object-cover block"
      style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.5)' }}
    />
    <span
      className="text-white text-[9px] font-extrabold tracking-[0.04em] uppercase"
      style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}
    >
      {label}
    </span>
  </div>
)

// ── BattleLayout ──────────────────────────────────────────────
const BattleLayout = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, rates } = useSelector((s) => s.game)

  const serverFa     = user?.fa     ?? 0
  const serverEnergy = user?.energy ?? 0
  const faPerTap     = rates?.fa_per_tap ?? 1

  const [localFa,     setLocalFa]     = useState(null)
  const [localEnergy, setLocalEnergy] = useState(null)
  const [tapping,     setTapping]     = useState(false)
  const [floats,      setFloats]      = useState([])
  const [showPage8,   setShowPage8]   = useState(false)

  const floatIdRef   = useRef(0)
  const tapBufferRef = useRef(0)
  const tapTimerRef  = useRef(null)

  const fmtShort = (n) => {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}М`
    if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}К`
    return String(Math.floor(n))
  }

  const flushTaps = useCallback(() => {
    const count = tapBufferRef.current
    tapBufferRef.current = 0
    tapTimerRef.current  = null
    if (count <= 0) return
    setTapping(false)
    dispatch(doTap(count)).then(() => {
      dispatch(fetchState()).then(() => {
        setLocalFa(null)
        setLocalEnergy(null)
      })
    })
  }, [dispatch])

  const handleTap = useCallback((e) => {
    e.preventDefault()
    const touches = e.touches || e.changedTouches
    const points  = touches ? Array.from(touches) : [{ clientX: e.clientX, clientY: e.clientY }]
    const curEnergy = localEnergy !== null ? localEnergy : serverEnergy
    if (curEnergy <= 0) return
    const tapsNow = Math.min(points.length, curEnergy)

    setLocalFa((prev)     => (prev !== null ? prev : serverFa) + faPerTap * tapsNow)
    setLocalEnergy((prev) => Math.max(0, (prev !== null ? prev : serverEnergy) - tapsNow))
    setTapping(true)

    points.slice(0, tapsNow).forEach(({ clientX, clientY }) => {
      const id = floatIdRef.current++
      setFloats((prev) => [...prev, { id, x: clientX, y: clientY }])
      setTimeout(() => setFloats((prev) => prev.filter((f) => f.id !== id)), 900)
    })

    tapBufferRef.current += tapsNow
    if (tapTimerRef.current) clearTimeout(tapTimerRef.current)
    tapTimerRef.current = setTimeout(flushTaps, 300)
  }, [serverFa, serverEnergy, localFa, localEnergy, faPerTap, flushTaps])

  // ── Left icons ────────────────────────────────────────────
  const leftIcons = [
    { src: layout1, label: 'ТУРНИРЫ', action: () => setShowPage8(true) },
    { src: layout2, label: 'БОКСЫ',   action: () => navigate('/page20') },
    { src: layout3, label: 'ПОДАРОК', action: () => {} },
  ]

  // ── Right icons ───────────────────────────────────────────
  const rightIcons = [
    { src: layout4, label: 'СЛОТЫ',   action: () => navigate('/page24') },
    { src: layout5, label: 'AVIATOR', action: () => navigate('/page25') },
    { src: layout6, label: 'BETON',   action: () => {} },
  ]

  return (
    <>
      <style>{`
        @keyframes floatUp {
          0%   { opacity: 1; transform: translate(-50%,-50%) scale(1.3); }
          100% { opacity: 0; transform: translate(-50%,-100px) scale(0.9); }
        }
        @keyframes tapBounce {
          0%,100% { transform: scale(1); }
          50%     { transform: scale(0.92); }
        }
      `}</style>

      {/* Floating +FA labels */}
      {floats.map((f) => (
        <FloatingLabel key={f.id} x={f.x} y={f.y} value={fmtShort(faPerTap)} />
      ))}

      {/* Турниры popup — stays mounted when opened */}
      <Page8Modal isOpen={showPage8} onClose={() => setShowPage8(false)} />

      <div className="flex flex-col h-full pb-[2px]">

        {/* Main row */}
        <div className="flex items-center justify-between flex-1 px-[10px]">

          {/* Left icons */}
          <div className="flex flex-col gap-2 items-center">
            {leftIcons.map(({ src, label, action }) => (
              <SideIcon key={label} src={src} label={label} onClick={action} />
            ))}
          </div>

          {/* Tap target */}
          <div
            onTouchStart={handleTap}
            onClick={handleTap}
            className="relative cursor-pointer shrink-0 select-none"
            style={{
              WebkitTapHighlightColor: 'transparent',
              animation: tapping ? 'tapBounce 0.15s ease' : 'none',
            }}
          >
            <img
              src={layoutMain} alt="tap" draggable={false}
              className="w-[160px] h-[160px] object-contain block"
              style={{
                WebkitUserSelect: 'none',
                userSelect: 'none',
                filter: 'drop-shadow(0 0 16px rgba(255,215,0,0.3))',
              }}
            />

            {/* Curved TAP text */}
            <svg
              viewBox="0 0 160 55"
              className="absolute bottom-[-2px] left-0 w-[160px] h-[55px] pointer-events-none"
            >
              <defs><path id="tapCurve" d="M 14,48 Q 80,4 146,48" /></defs>
              <text style={{ fill: '#fff', fontSize: '21px', fontWeight: 900, letterSpacing: '0.3em', fontFamily: 'inherit' }}>
                <textPath href="#tapCurve" startOffset="50%" textAnchor="middle">ТАП</textPath>
              </text>
            </svg>
          </div>

          {/* Right icons */}
          <div className="flex flex-col gap-2 items-center">
            {rightIcons.map(({ src, label, action }) => (
              <SideIcon key={label} src={src} label={label} onClick={action} />
            ))}
          </div>

        </div>
      </div>
    </>
  )
}

export default BattleLayout