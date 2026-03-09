import React, { useState, useEffect } from 'react';

// ── Data — swap with backend ───────────────────────────────────────────────
const REFERRAL_COUNT = 350;
const ROAD_MAX       = 1000;
const MILESTONES     = [0, 5, 10, 25, 50, 100, 200, 500, 1000];
const progressPct    = Math.min((REFERRAL_COUNT / ROAD_MAX) * 100, 100);

const ROAD_REWARDS = [
  { threshold: 3,    label: '1 Шнейне бокс',  status: 'claimed'   },
  { threshold: 5,    label: '10000 Билетов',   status: 'claimed'   },
  { threshold: 10,   label: '50 USDT',         status: 'claimed'   },
  { threshold: 15,   label: '1500 Билетов',    status: 'claimed'   },
  { threshold: 20,   label: '2000 Билетов',    status: 'claimed'   },
  { threshold: 25,   label: '25 Фишек',        status: 'claimed'   },
  { threshold: 50,   label: '5000 Билетов',    status: 'available' },
  { threshold: 100,  label: '100 USDT',        status: 'locked'    },
  { threshold: 200,  label: '10000 Билетов',   status: 'locked'    },
  { threshold: 500,  label: '500 USDT',        status: 'locked'    },
  { threshold: 1000, label: '5000 USDT',       status: 'locked'    },
];

const Page19Modal = ({ isOpen, onClose }) => {
  const [visible, setVisible] = useState(false);
  const [animIn,  setAnimIn]  = useState(false);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      const r = requestAnimationFrame;
      r(() => r(() => setAnimIn(true)));
    } else {
      setAnimIn(false);
      const t = setTimeout(() => setVisible(false), 350);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  if (!visible) return null;

  const close = () => {
    setAnimIn(false);
    setTimeout(onClose, 350);
  };

  return (
    <div
      onClick={close}
      style={{
        position: 'fixed', inset: 0, zIndex: 300,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        opacity: animIn ? 1 : 0,
        transition: 'opacity 0.3s ease',
        fontFamily: "'Nunito','Segoe UI',sans-serif",
      }}
    >
      {/* ── SHEET ── */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 430,
          maxHeight: '75dvh',          /* sheet covers bottom ~75% — hero/text visible above */
          borderRadius: '20px 20px 0 0',
          background: '#808080',
          boxShadow: '0 -6px 32px rgba(0,0,0,0.7)',
          display: 'flex', flexDirection: 'column',
          transform: animIn ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.35s cubic-bezier(0.32,0.72,0,1)',
          overflow: 'hidden',
        }}
      >
        {/* drag handle */}
        <div style={{ flexShrink: 0, display: 'flex', justifyContent: 'center', padding: '10px 0 6px' }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(0,0,0,0.3)' }} />
        </div>

        {/* scrollable body */}
        <div style={{
          flex: 1, overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          padding: '4px 10px 28px',
          display: 'flex', flexDirection: 'column', gap: 8,
        }}>

          {/* ── DRUN ROAD CARD ── */}
          <div style={{
            borderRadius: 16,
            background: '#808080',
            border: '1.5px solid #6e6e6e',
            boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
            padding: '14px 14px 10px',
          }}>
            {/* Gold italic title — large, heavy */}
            <div style={{
              color: '#c89000',
              fontWeight: 900,
              fontSize: 'clamp(28px,8vw,34px)',
              fontStyle: 'italic',
              letterSpacing: '0.04em',
              lineHeight: 1,
              marginBottom: 12,
              textShadow: '0 2px 6px rgba(0,0,0,0.25)',
            }}>
              DRUN ROAD 1000
            </div>

            {/* Dark grey description box */}
            <div style={{
              borderRadius: 10,
              background: 'rgba(0,0,0,0.25)',
              padding: '12px 12px',
              marginBottom: 14,
            }}>
              <p style={{
                color: '#fff',
                fontWeight: 700,
                fontSize: 'clamp(12px,3.2vw,14px)',
                lineHeight: 1.65,
                textAlign: 'center',
                margin: 0,
              }}>
                Здесь ты можешь получить огромные награды просто приглашая рефералов. Каждый уровень приглашенных тобой друзей – очко в DRUN ROAD 1000.
              </p>
            </div>

            {/* Progress bar — tall, gold→green, no dots */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{
                height: 22,
                borderRadius: 9999,
                background: 'rgba(0,0,0,0.25)',
                overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%',
                  width: `${progressPct}%`,
                  background: 'linear-gradient(90deg, #c89000 0%, #c89000 45%, #48c800 100%)',
                  borderRadius: 9999,
                }} />
              </div>
              {/* milestone labels */}
              <div style={{ position: 'relative', height: 14 }}>
                {MILESTONES.map((m, i) => (
                  <span key={i} style={{
                    position: 'absolute',
                    left: `${(m / ROAD_MAX) * 100}%`,
                    transform: 'translateX(-50%)',
                    color: 'rgba(0,0,0,0.6)',
                    fontSize: 9, fontWeight: 700, whiteSpace: 'nowrap',
                  }}>
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ── REWARD ROWS ── */}
          {ROAD_REWARDS.map((r, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 10px 10px 16px',
                borderRadius: 16,              /* rounded rectangle — not full pill */
                background: 'radial-gradient(circle at 50% 50%, #a5a5a5, #6c6c6c)',
                opacity: r.status === 'locked' ? 0.4 : 1,
              }}
            >
              {/* left: threshold + reward name */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  color: 'rgba(255,255,255,0.7)',
                  fontSize: 11,
                  fontWeight: 700,
                  lineHeight: 1,
                  marginBottom: 3,
                }}>
                  {r.threshold} / 1000
                </div>
                <div style={{
                  color: '#fff',
                  fontWeight: 900,
                  fontSize: 'clamp(16px,4.5vw,20px)',
                  lineHeight: 1.1,
                }}>
                  {r.label}
                </div>
              </div>

              {/* right: Получено / Забрать button */}
              <button
                style={{
                  flexShrink: 0,
                  padding: '10px 18px',
                  borderRadius: 12,
                  background: r.status === 'available'
                    ? 'linear-gradient(180deg,#f0c020,#c89000)'
                    : 'rgba(255,255,255,0.3)',
                  border: 'none',
                  boxShadow: r.status === 'available' ? '0 3px 0 #7a5000' : 'none',
                  color: r.status === 'available' ? '#000' : '#fff',
                  fontWeight: 900,
                  fontSize: 'clamp(14px,4vw,16px)',
                  whiteSpace: 'nowrap',
                  cursor: r.status === 'available' ? 'pointer' : 'default',
                  fontFamily: 'inherit',
                }}
                onPointerDown={e => r.status === 'available' && (e.currentTarget.style.transform = 'scale(0.96)')}
                onPointerUp={e => (e.currentTarget.style.transform = 'scale(1)')}
                onPointerLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
              >
                {r.status === 'available' ? 'Забрать' : 'Получено'}
              </button>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
};

export default Page19Modal;