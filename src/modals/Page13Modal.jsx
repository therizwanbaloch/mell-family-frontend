import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { IoClose } from 'react-icons/io5';

const PRIZES = [
  { place: '1 Место',        reward: '2300 USDT' },
  { place: '2-5 Место',      reward: '250 USDT'  },
  { place: '6-10 Место',     reward: '100 USDT'  },
  { place: '11-50 Место',    reward: '10 USDT'   },
  { place: '51-250 Место',   reward: '2 USDT'    },
  { place: '251-500 Место',  reward: '1 USDT'    },
  { place: '501-750 Место',  reward: '0.5 USDT'  },
  { place: '751-1000 Место', reward: '0.1 USDT'  },
  { place: '1000+ Место',    reward: '0 USDT'    },
];

// Live countdown from real end_ts — shows DD:HH:MM:SS
const useEndTsCountdown = (endTs) => {
  const calc = () => {
    if (!endTs) return '--:--:--:--'
    const diff = Math.max(0, endTs - Math.floor(Date.now() / 1000))
    const days = String(Math.floor(diff / 86400)).padStart(2, '0')
    const h    = String(Math.floor((diff % 86400) / 3600)).padStart(2, '0')
    const m    = String(Math.floor((diff % 3600) / 60)).padStart(2, '0')
    const s    = String(diff % 60).padStart(2, '0')
    return `${days}:${h}:${m}:${s}`
  }
  const [display, setDisplay] = useState(calc)
  useEffect(() => {
    setDisplay(calc())
    const id = setInterval(() => setDisplay(calc()), 1000)
    return () => clearInterval(id)
  }, [endTs])
  return display
}

const Page13Modal = ({ isOpen, onClose }) => {
  const [visible, setVisible] = useState(false)
  const [animIn,  setAnimIn]  = useState(false)

  // Real end_ts from Redux
  const { tournaments } = useSelector((s) => s.game)
  const endTs    = tournaments?.usdt_tournament?.end_ts
  const countdown = useEndTsCountdown(endTs)

  useEffect(() => {
    if (isOpen) {
      setVisible(true)
      requestAnimationFrame(() => requestAnimationFrame(() => setAnimIn(true)))
    } else {
      setAnimIn(false)
      const t = setTimeout(() => setVisible(false), 350)
      return () => clearTimeout(t)
    }
  }, [isOpen])

  if (!visible) return null

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 60,
          backgroundColor: animIn ? 'rgba(0,0,0,0.70)' : 'rgba(0,0,0,0)',
          backdropFilter: animIn ? 'blur(4px)' : 'blur(0px)',
          WebkitBackdropFilter: animIn ? 'blur(4px)' : 'blur(0px)',
          transition: 'all 0.35s ease',
        }}
      />

      {/* Bottom sheet */}
      <div
        style={{
          position: 'fixed', bottom: 0, left: '50%',
          transform: animIn ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(100%)',
          transition: 'transform 0.35s cubic-bezier(0.32,0.72,0,1)',
          zIndex: 61,
          width: '100%', maxWidth: '430px', maxHeight: '88dvh',
          display: 'flex', flexDirection: 'column',
          borderRadius: '20px 20px 0 0', overflow: 'hidden',
          background: '#3a3a3a',
          borderTop: '1.5px solid #555', borderLeft: '1.5px solid #555', borderRight: '1.5px solid #555',
          boxShadow: '0 -8px 40px rgba(0,0,0,0.7)',
        }}
      >
        {/* Drag handle */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 10, paddingBottom: 4, flexShrink: 0 }}>
          <div style={{ width: 36, height: 4, borderRadius: 9999, background: 'rgba(255,255,255,0.2)' }} />
        </div>

        {/* Scrollable body */}
        <div style={{
          flex: 1, overflowY: 'auto',
          padding: 'clamp(10px,3vw,16px) clamp(12px,3vw,18px) clamp(16px,4vw,24px)',
          display: 'flex', flexDirection: 'column',
          gap: 'clamp(10px,2.5vw,14px)',
        }}>

          {/* Close button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={onClose} style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '5px 14px', borderRadius: 10,
              background: 'rgba(255,255,255,0.10)', border: '1.5px solid rgba(255,255,255,0.18)',
              color: '#fff', fontSize: 'clamp(11px,3vw,13px)', fontWeight: 700,
              cursor: 'pointer', letterSpacing: '0.04em',
            }}>
              <IoClose size={14} color="#ff4444" />
              Закрыть
            </button>
          </div>

          {/* Countdown — real backend end_ts */}
          <div style={{
            borderRadius: 14,
            background: 'linear-gradient(180deg,#1e1e1e,#111)',
            border: '1.5px solid #4a4a4a',
            padding: 'clamp(12px,3vw,18px) 16px',
            textAlign: 'center',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05), 0 2px 10px rgba(0,0,0,0.4)',
          }}>
            <p style={{
              color: 'rgba(255,255,255,0.55)',
              fontSize: 'clamp(11px,3vw,14px)', fontWeight: 800,
              letterSpacing: '0.22em', textTransform: 'uppercase', margin: '0 0 6px',
            }}>
              ОСТАЛОСЬ
            </p>
            <p style={{
              color: '#fff',
              fontSize: 'clamp(28px,8vw,42px)', fontWeight: 900,
              letterSpacing: '0.06em', margin: 0, lineHeight: 1,
              fontVariantNumeric: 'tabular-nums',
            }}>
              {countdown}
            </p>
            {/* DD:HH:MM:SS labels */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 0, marginTop: 4 }}>
              {['дн', 'ч', 'мин', 'сек'].map((label, i) => (
                <span key={i} style={{
                  color: 'rgba(255,255,255,0.35)', fontSize: 10, fontWeight: 700,
                  width: i < 3 ? 'calc((100% - 48px) / 4 + 12px)' : 'auto',
                  textAlign: 'center', letterSpacing: '0.05em',
                }}>
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* Description */}
          <div style={{
            borderRadius: 14,
            background: 'rgba(0,0,0,0.2)',
            border: '1px solid rgba(255,255,255,0.08)',
            padding: 'clamp(12px,3vw,16px) clamp(14px,3.5vw,18px)',
          }}>
            <p style={{
              color: 'rgba(255,255,255,0.88)',
              fontSize: 'clamp(12px,3.2vw,14px)', fontWeight: 600,
              lineHeight: 1.7, textAlign: 'center', margin: 0,
            }}>
              Каждые две недели проходит огромный турнир. Все твои билеты будут зачислены в твою ставку. По истечению таймера 90% билетов сгорают, а победители получают награды:
            </p>
          </div>

          {/* Prize table */}
          <div style={{
            borderRadius: 14,
            background: 'rgba(0,0,0,0.2)',
            border: '1px solid rgba(255,255,255,0.08)',
            overflow: 'hidden',
          }}>
            {PRIZES.map((row, i) => {
              const isZero = row.reward === '0 USDT'
              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: 'clamp(10px,2.5vw,13px) clamp(14px,3.5vw,20px)',
                  borderBottom: i < PRIZES.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none',
                  background: i % 2 === 0 ? 'rgba(255,255,255,0.03)' : 'transparent',
                }}>
                  <span style={{ color: 'rgba(255,255,255,0.92)', fontSize: 'clamp(12px,3.2vw,15px)', fontWeight: 700 }}>
                    {row.place}
                  </span>
                  <span style={{
                    color: isZero ? 'rgba(255,255,255,0.35)' : '#FFD700',
                    fontSize: 'clamp(13px,3.5vw,16px)', fontWeight: 900, letterSpacing: '0.03em',
                  }}>
                    {row.reward}
                  </span>
                </div>
              )
            })}
          </div>

        </div>
      </div>
    </>
  )
}

export default Page13Modal