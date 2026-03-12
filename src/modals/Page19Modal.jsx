import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { doClaimDrunRoad, fetchState } from '../redux/gameSlice';

// ── Drun Road config ──────────────────────────────────────────
const ROAD_MAX   = 1000;
const MILESTONES = [0, 5, 10, 25, 50, 100, 200, 500, 1000];

const ROAD_REWARDS = [
  { threshold: 3,    label: '1 Шнейне бокс'  },
  { threshold: 5,    label: '10000 Билетов'  },
  { threshold: 10,   label: '50 USDT'        },
  { threshold: 15,   label: '1500 Билетов'   },
  { threshold: 20,   label: '2000 Билетов'   },
  { threshold: 25,   label: '25 Фишек'       },
  { threshold: 50,   label: '5000 Билетов'   },
  { threshold: 100,  label: '100 USDT'       },
  { threshold: 200,  label: '10000 Билетов'  },
  { threshold: 500,  label: '500 USDT'       },
  { threshold: 1000, label: '5000 USDT'      },
];

// ── Safely extract claimed thresholds from ANY backend shape ──
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
      Object.entries(raw)
        .filter(([, v]) => v)
        .map(([k]) => Number(k))
    );
  }
  return new Set();
};

const Page19Modal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.game);

  const [visible,  setVisible]  = useState(false);
  const [animIn,   setAnimIn]   = useState(false);
  const [claiming, setClaiming] = useState(null);
  const [msg,      setMsg]      = useState(null);

  // ── Real data — tries every possible field name ───────────
  const drunRoadPoints = user?.drunroad_points ?? user?.drun_road_points ?? user?.road_points ?? 0;
  const claimedSet     = extractClaimedSet(user);
  const progressPct    = Math.min((drunRoadPoints / ROAD_MAX) * 100, 100);

  const getStatus = (threshold) => {
    if (claimedSet.has(threshold))   return 'claimed';
    if (drunRoadPoints >= threshold) return 'available';
    return 'locked';
  };

  // ── Animation ─────────────────────────────────────────────
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

  const close = () => {
    setAnimIn(false);
    setTimeout(onClose, 350);
  };

  const handleClaim = async (threshold) => {
    if (claiming) return;
    setClaiming(threshold);
    try {
      await dispatch(doClaimDrunRoad()).unwrap();
      setMsg({ ok: true, text: '✅ Награда получена!' });
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
      className="fixed inset-0 z-[300] flex items-end justify-center transition-opacity duration-300"
      style={{
        background: 'rgba(0,0,0,0.55)',
        opacity: animIn ? 1 : 0,
        fontFamily: "'Nunito','Segoe UI',sans-serif",
      }}
    >
      {/* SHEET */}
      <div
        onClick={e => e.stopPropagation()}
        className="relative w-full max-w-[430px] flex flex-col overflow-hidden rounded-t-[20px] shadow-[0_-6px_32px_rgba(0,0,0,0.7)] transition-transform duration-[350ms]"
        style={{
          maxHeight: '78dvh',
          background: '#808080',
          transform: animIn ? 'translateY(0)' : 'translateY(100%)',
          transitionTimingFunction: 'cubic-bezier(0.32,0.72,0,1)',
        }}
      >
        {/* Drag handle */}
        <div className="shrink-0 flex justify-center pt-2.5 pb-1">
          <div className="w-9 h-1 rounded-sm bg-black/30" />
        </div>

        {/* Snackbar */}
        {msg && (
          <div className={`absolute top-3 left-3 right-3 z-[9999] rounded-xl px-3.5 py-2 text-center font-black text-[13px] text-white border border-white/15 shadow-[0_4px_20px_rgba(0,0,0,0.5)] pointer-events-none ${
            msg.ok ? 'bg-green-800/95' : 'bg-red-800/95'
          }`}>
            {msg.text}
          </div>
        )}

        {/* Scrollable body */}
        <div
          className="flex-1 overflow-y-auto overscroll-contain flex flex-col gap-1.5 px-2.5 pt-1 pb-6"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >

          {/* ── HEADER CARD ── */}
          <div
            className="rounded-2xl border border-[#6e6e6e] shadow-[0_2px_12px_rgba(0,0,0,0.3)] px-3.5 pt-3 pb-3 mb-0.5"
            style={{ background: '#808080' }}
          >
            {/* Gold italic title */}
            <div
              className="font-black italic tracking-wide leading-none mb-2 text-[#c89000]"
              style={{
                fontSize: 'clamp(24px,7vw,30px)',
                textShadow: '0 2px 6px rgba(0,0,0,0.25)',
              }}
            >
              DRUN ROAD 1000
            </div>

            {/* Description box */}
            <div className="rounded-xl px-3 py-2 mb-2.5 bg-black/25">
              <p
                className="text-white font-bold text-center m-0 leading-snug"
                style={{ fontSize: 'clamp(10px,2.8vw,12px)' }}
              >
                Здесь ты можешь получить огромные награды просто приглашая рефералов. Каждый уровень приглашенных тобой друзей — очко в DRUN ROAD 1000.
              </p>
            </div>

            {/* Progress bar */}
            <div className="flex flex-col gap-1">
              <div className="h-5 rounded-full overflow-hidden bg-black/25">
                <div
                  className="h-full rounded-full transition-[width] duration-500 ease-out"
                  style={{
                    width: `${progressPct}%`,
                    background: 'linear-gradient(90deg,#c89000 0%,#c89000 45%,#48c800 100%)',
                  }}
                />
              </div>
              {/* Milestone labels */}
              <div className="relative h-3.5">
                {MILESTONES.map((m, i) => (
                  <span
                    key={i}
                    className="absolute font-bold whitespace-nowrap text-black/60"
                    style={{
                      left: `${(m / ROAD_MAX) * 100}%`,
                      transform: 'translateX(-50%)',
                      fontSize: 9,
                    }}
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ── REWARD ROWS ── */}
          {ROAD_REWARDS.map((r, i) => {
            const status    = getStatus(r.threshold);
            const isLocked  = status === 'locked';
            const isClaimed = status === 'claimed';
            const isAvail   = status === 'available';
            const isLoading = claiming === r.threshold;

            return (
              <div
                key={i}
                className={`flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-[#373737] transition-opacity ${isLocked ? 'opacity-40' : 'opacity-100'}`}
              >
                {/* Left: threshold + label */}
                <div className="flex-1 min-w-0">
                  <div className="text-white/55 font-bold leading-none mb-0.5 text-[10px]">
                    {r.threshold} / 1000
                  </div>
                  <div
                    className="text-white font-black leading-tight"
                    style={{ fontSize: 'clamp(14px,4vw,17px)' }}
                  >
                    {r.label}
                  </div>
                </div>

                {/* Right: button */}
                <button
                  onClick={() => isAvail && !claiming && handleClaim(r.threshold)}
                  disabled={!isAvail || !!claiming}
                  className="shrink-0 px-4 py-2 rounded-xl font-black whitespace-nowrap border-none transition-transform active:scale-95 min-w-[90px]"
                  style={{
                    background: isAvail
                      ? 'linear-gradient(180deg,#f0c020,#c89000)'
                      : '#b4b4b4',
                    boxShadow: isAvail ? '0 3px 0 #7a5000' : 'none',
                    color: isAvail ? '#000' : '#555',
                    fontSize: 'clamp(12px,3.5vw,14px)',
                    cursor: isAvail && !claiming ? 'pointer' : 'default',
                  }}
                >
                  {isLoading ? '...' : isClaimed ? 'Получено' : isAvail ? 'Забрать' : 'Получено'}
                </button>
              </div>
            );
          })}

        </div>
      </div>
    </div>
  );
};

export default Page19Modal;