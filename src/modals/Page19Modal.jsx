import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { doClaimDrunRoad, fetchState } from '../redux/gameSlice';

import drunyPhoto from '../assets/page18Images/hero.webp';   

// ── Drun Road config ──────────────────────────────────────────
const ROAD_MAX   = 1000;
const MILESTONES = [0, 5, 10, 25, 50, 100, 200, 500, 1000];

const ROAD_REWARDS = [
  { threshold: 3,    label: '1 Шнейне бокс'  },
  { threshold: 5,    label: '10 000 Билетов'  },
  { threshold: 10,   label: '50 USDT'         },
  { threshold: 15,   label: '1 500 Билетов'   },
  { threshold: 20,   label: '2 000 Билетов'   },
  { threshold: 25,   label: '25 Фишек'        },
  { threshold: 50,   label: '5 000 Билетов'   },
  { threshold: 100,  label: '100 USDT'        },
  { threshold: 200,  label: '10 000 Билетов'  },
  { threshold: 500,  label: '500 USDT'        },
  { threshold: 1000, label: '5 000 USDT'      },
];

const extractClaimedSet = (user) => {
  const raw =
    user?.drunroad_claimed  ??
    user?.drun_road_claimed ??
    user?.claimed_rewards   ??
    user?.road_claimed      ??
    [];
  if (Array.isArray(raw)) {
    return new Set(raw.map(x =>
      typeof x === 'object' ? (x.threshold ?? x.id ?? x.level) : Number(x)
    ));
  }
  if (raw && typeof raw === 'object') {
    return new Set(
      Object.entries(raw).filter(([, v]) => v).map(([k]) => Number(k))
    );
  }
  return new Set();
};

// ── Colors matching design ────────────────────────────────────
// Background: #3a3a3a (sheet), #2a2a2a (cards)
// Gold text: #c89000 / #f0c020
// Progress: gold → green
// Claimed btn: #b4b4b4 text #555
// Available btn: gold gradient

const Page19Modal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.game);

  const [visible,  setVisible]  = useState(false);
  const [animIn,   setAnimIn]   = useState(false);
  const [claiming, setClaiming] = useState(null);
  const [msg,      setMsg]      = useState(null);

  const drunRoadPoints = user?.drunroad_points ?? user?.drun_road_points ?? user?.road_points ?? 0;
  const claimedSet     = extractClaimedSet(user);
  const progressPct    = Math.min((drunRoadPoints / ROAD_MAX) * 100, 100);

  const getStatus = (threshold) => {
    if (claimedSet.has(threshold))   return 'claimed';
    if (drunRoadPoints >= threshold) return 'available';
    return 'locked';
  };

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setAnimIn(true)));
    } else {
      setAnimIn(false);
      const t = setTimeout(() => setVisible(false), 350);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  if (!visible) return null;

  const close = () => { setAnimIn(false); setTimeout(onClose, 350); };

  const handleClaim = async (threshold) => {
    if (claiming) return;
    setClaiming(threshold);
    try {
      await dispatch(doClaimDrunRoad()).unwrap();
      setMsg({ ok: true,  text: '✅ Награда получена!' });
      dispatch(fetchState());
    } catch (e) {
      setMsg({ ok: false, text: `❌ ${e}` });
    }
    setClaiming(null);
    setTimeout(() => setMsg(null), 3000);
  };

  return (
    <div
      onClick={close}
      style={{
        position: 'fixed', inset: 0, zIndex: 300,
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        background: 'rgba(0,0,0,0.65)',
        opacity: animIn ? 1 : 0,
        transition: 'opacity 0.3s',
        fontFamily: "'Nunito','Segoe UI',sans-serif",
      }}
    >
      <style>{`
        @keyframes shimGold { 0%,100%{opacity:.7} 50%{opacity:1} }
      `}</style>

      {/* ── BOTTOM SHEET ── */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: 'relative',
          width: '100%', maxWidth: 430,
          maxHeight: '88dvh',
          display: 'flex', flexDirection: 'column',
          borderRadius: '20px 20px 0 0',
          background: '#3a3a3a',
          boxShadow: '0 -8px 40px rgba(0,0,0,0.8)',
          transform: animIn ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 350ms cubic-bezier(0.32,0.72,0,1)',
          overflow: 'hidden',
        }}
      >
        {/* Drag handle */}
        <div style={{ flexShrink: 0, display: 'flex', justifyContent: 'center', padding: '10px 0 6px' }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.2)' }} />
        </div>

        {/* Snackbar */}
        {msg && (
          <div style={{
            position: 'absolute', top: 12, left: 12, right: 12, zIndex: 9999,
            borderRadius: 12, padding: '10px 14px', textAlign: 'center',
            fontWeight: 900, fontSize: 13, color: '#fff',
            background: msg.ok ? 'rgba(30,120,30,0.96)' : 'rgba(160,30,30,0.96)',
            border: '1px solid rgba(255,255,255,0.15)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
            pointerEvents: 'none',
          }}>
            {msg.text}
          </div>
        )}

        {/* ── SCROLLABLE BODY ── */}
        <div style={{
          flex: 1, overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          display: 'flex', flexDirection: 'column',
        }}>

          {/* ── PHOTO BANNER ── */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <img
              src={drunyPhoto}
              alt="Druny"
              style={{
                width: '100%',
                height: 'clamp(180px,48vw,240px)',
                objectFit: 'cover',
                objectPosition: 'center top',
                display: 'block',
              }}
            />
            {/* Dark gradient overlay at bottom of photo */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              height: 80,
              background: 'linear-gradient(0deg,#3a3a3a,transparent)',
            }} />
          </div>

          {/* ── SUBTITLE BELOW PHOTO ── */}
          <div style={{
            flexShrink: 0,
            padding: '4px 16px 12px',
            textAlign: 'center',
          }}>
            <p style={{
              margin: 0,
              color: '#fff',
              fontWeight: 900,
              fontSize: 'clamp(14px,4.5vw,18px)',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              textShadow: '0 2px 8px rgba(0,0,0,0.8)',
            }}>
              ПРИГЛАШАЙ ДРУНОВ И<br />
              ПОЛУЧАЙ 38% ОТ ИХ ДОХОДА
            </p>
          </div>

          {/* ── DRUN ROAD CARD ── */}
          <div style={{
            flexShrink: 0,
            margin: '0 10px 10px',
            borderRadius: 18,
            background: '#4a4a4a',
            border: '1.5px solid #606060',
            boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
            padding: '14px 14px 12px',
          }}>
            {/* Gold title */}
            <div style={{
              fontWeight: 900,
              fontStyle: 'italic',
              fontSize: 'clamp(26px,8vw,34px)',
              color: '#c89000',
              letterSpacing: '0.04em',
              lineHeight: 1,
              marginBottom: 10,
              textShadow: '0 2px 8px rgba(0,0,0,0.4)',
              animation: 'shimGold 2.5s ease-in-out infinite',
            }}>
              DRUN ROAD 1000
            </div>

            {/* Description */}
            <div style={{
              background: 'rgba(0,0,0,0.25)',
              borderRadius: 12,
              padding: '10px 12px',
              marginBottom: 12,
            }}>
              <p style={{
                margin: 0, color: '#fff',
                fontWeight: 700,
                fontSize: 'clamp(11px,3vw,13px)',
                lineHeight: 1.55,
                textAlign: 'center',
              }}>
                Здесь ты можешь получить огромные награды просто приглашая рефералов.
                Каждый уровень приглашённых тобой друзей — очко в DRUN ROAD 1000.
              </p>
            </div>

            {/* Progress bar */}
            <div style={{ marginBottom: 4 }}>
              <div style={{
                height: 22, borderRadius: 9999,
                background: 'rgba(0,0,0,0.3)',
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.1)',
              }}>
                <div style={{
                  height: '100%',
                  width: `${progressPct}%`,
                  borderRadius: 9999,
                  background: 'linear-gradient(90deg,#c89000 0%,#c89000 50%,#48c800 100%)',
                  boxShadow: '0 0 8px rgba(200,144,0,0.5)',
                  transition: 'width 0.6s ease',
                  minWidth: progressPct > 0 ? 22 : 0,
                }} />
              </div>

              {/* Milestone ticks */}
              <div style={{ position: 'relative', height: 18, marginTop: 3 }}>
                {MILESTONES.map((m, i) => (
                  <span key={i} style={{
                    position: 'absolute',
                    left: `${(m / ROAD_MAX) * 100}%`,
                    transform: 'translateX(-50%)',
                    fontSize: 9,
                    fontWeight: 700,
                    color: 'rgba(0,0,0,0.55)',
                    whiteSpace: 'nowrap',
                  }}>
                    {m}
                  </span>
                ))}
              </div>
            </div>

            {/* Current points */}
            <div style={{ textAlign: 'center', marginTop: 2 }}>
              <span style={{ color: '#c89000', fontWeight: 900, fontSize: 13 }}>
                {drunRoadPoints}
              </span>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 700 }}>
                {' '}/ 1000 очков
              </span>
            </div>
          </div>

          {/* ── REWARD ROWS ── */}
          <div style={{
            display: 'flex', flexDirection: 'column',
            gap: 6, padding: '0 10px 28px',
          }}>
            {ROAD_REWARDS.map((r, i) => {
              const status    = getStatus(r.threshold);
              const isLocked  = status === 'locked';
              const isClaimed = status === 'claimed';
              const isAvail   = status === 'available';
              const isLoading = claiming === r.threshold;

              return (
                <div
                  key={i}
                  style={{
                    display: 'flex', alignItems: 'center',
                    gap: 10,
                    padding: '10px 14px',
                    borderRadius: 9999,
                    background: '#2a2a2a',
                    border: isAvail
                      ? '1.5px solid rgba(200,144,0,0.4)'
                      : '1.5px solid rgba(255,255,255,0.07)',
                    opacity: isLocked ? 0.4 : 1,
                    transition: 'opacity 0.2s',
                  }}
                >
                  {/* Left: threshold + label */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      color: 'rgba(255,255,255,0.5)',
                      fontWeight: 700, fontSize: 10,
                      lineHeight: 1, marginBottom: 2,
                    }}>
                      {r.threshold} / 1000
                    </div>
                    <div style={{
                      color: '#fff',
                      fontWeight: 900,
                      fontSize: 'clamp(15px,4.5vw,18px)',
                      lineHeight: 1.1,
                    }}>
                      {r.label}
                    </div>
                  </div>

                  {/* Right: claim button */}
                  <button
                    onClick={() => {
                      if (isLocked)  return
                      if (isClaimed) return
                      if (isAvail && !claiming) handleClaim(r.threshold)
                    }}
                    style={{
                      flexShrink: 0,
                      minWidth: 100,
                      padding: '9px 16px',
                      borderRadius: 9999,
                      border: 'none',
                      fontWeight: 900,
                      fontSize: 'clamp(13px,4vw,15px)',
                      whiteSpace: 'nowrap',
                      cursor: isAvail && !claiming ? 'pointer' : 'default',
                      background: isAvail
                        ? 'linear-gradient(180deg,#f0c020,#c89000)'
                        : '#b4b4b4',
                      color: isAvail ? '#000' : '#555',
                      boxShadow: isAvail ? '0 3px 0 #7a5000' : 'none',
                      transition: 'transform 0.1s',
                    }}
                    onPointerDown={e => { if (isAvail) e.currentTarget.style.transform = 'scale(0.95) translateY(2px)' }}
                    onPointerUp={e   => e.currentTarget.style.transform = ''}
                    onPointerLeave={e => e.currentTarget.style.transform = ''}
                  >
                    {isLoading ? '...' : isClaimed ? 'Получено' : isAvail ? 'Забрать' : 'Получено'}
                  </button>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Page19Modal;