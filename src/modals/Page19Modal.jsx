import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { doClaimDrunRoad, fetchState } from '../redux/gameSlice';

const ROAD_MAX   = 1000;
const MILESTONES = [0, 5, 10, 25, 50, 100, 200, 500, 1000];

const ROAD_REWARDS = [
  { threshold: 3,    label: '1 Шнейне бокс'  },
  { threshold: 5,    label: '10000 Билетов'   },
  { threshold: 10,   label: '50 USDT'         },
  { threshold: 15,   label: '1500 Билетов'    },
  { threshold: 20,   label: '2000 Билетов'    },
  { threshold: 25,   label: '25 Фишек'        },
  { threshold: 50,   label: '5000 Билетов'    },
  { threshold: 100,  label: '100 USDT'        },
  { threshold: 200,  label: '10000 Билетов'   },
  { threshold: 500,  label: '500 USDT'        },
  { threshold: 1000, label: '5000 USDT'       },
];

const extractClaimedSet = (user) => {
  const raw =
    user?.drunroad_claimed  ??
    user?.drun_road_claimed ??
    user?.claimed_rewards   ??
    user?.road_claimed      ??
    [];
  if (Array.isArray(raw))
    return new Set(raw.map(x => typeof x === 'object' ? (x.threshold ?? x.id ?? x.level) : Number(x)));
  if (raw && typeof raw === 'object')
    return new Set(Object.entries(raw).filter(([, v]) => v).map(([k]) => Number(k)));
  return new Set();
};

const Page19Modal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.game);

  const [visible,  setVisible]  = useState(false);
  const [animIn,   setAnimIn]   = useState(false);
  const [claiming, setClaiming] = useState(null);
  const [msg,      setMsg]      = useState(null);

  const drunRoadPoints = user?.drunroad_points ?? user?.drun_road_points ?? user?.road_points ?? 0;
  const claimedSet     = extractClaimedSet(user);

  const ORANGE_MAX = 200;
  const orangePct  = (Math.min(drunRoadPoints, ORANGE_MAX) / ROAD_MAX) * 100;
  const greenPct   = drunRoadPoints > ORANGE_MAX
    ? ((drunRoadPoints - ORANGE_MAX) / ROAD_MAX) * 100
    : 0;

  const getStatus = (t) => {
    if (claimedSet.has(t))   return 'claimed';
    if (drunRoadPoints >= t) return 'available';
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
      // Pass threshold to the thunk so backend knows which reward to claim
      await dispatch(doClaimDrunRoad(threshold)).unwrap();
      setMsg({ ok: true, text: 'Награда получена!' });
      dispatch(fetchState());
    } catch (e) {
      setMsg({ ok: false, text: `${e}` });
    }
    setClaiming(null);
    setTimeout(() => setMsg(null), 3000);
  };

  return (
    <div
      onClick={close}
      className="fixed inset-0 z-[300] flex items-end justify-center"
      style={{ background: 'rgba(0,0,0,0.5)' }}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="w-full max-w-[430px] rounded-t-2xl flex flex-col relative overflow-hidden"
        style={{
          height: '80vh',
          background: '#888784',
          boxShadow: '0 -8px 40px rgba(0,0,0,0.8)',
          transform: animIn ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 350ms cubic-bezier(0.32,0.72,0,1)',
        }}
      >
        {/* Drag handle */}
        <div className="shrink-0 flex justify-center pt-2.5 pb-1">
          <div className="w-9 h-1 rounded-full bg-black" />
        </div>

        {/* Toast */}
        {msg && (
          <div className={`absolute top-3 left-3 right-3 z-[9999] rounded-xl px-3 py-2.5 text-center font-black text-[13px] text-white border border-white/15 ${msg.ok ? 'bg-green-800/95' : 'bg-red-800/95'}`}>
            {msg.text}
          </div>
        )}

        <div className="flex-1 min-h-0 flex flex-col p-3">

          {/* HEADER */}
          <div className="shrink-0 border-b border-[#8a5a20] pb-2">
            <h2 className="text-[#e3921a] font-black text-2xl text-center">
              DRUN ROAD 1000
            </h2>
          </div>

          {/* INFO */}
          <div className="mx-1 my-1 bg-gray-800 text-white px-2 py-1 rounded-lg">
            <p className="text-[11px]">Приглашай друнов и получай очки DRUN ROAD.</p>
            <p className="text-[11px]">Каждый уровень приглашённого — 1 очко.</p>
            <p className="text-[11px]">Набирай очки и забирай огромные награды.</p>
            <p className="text-[11px]">
              Прогресс: <span className="text-white font-bold">{drunRoadPoints} / {ROAD_MAX}</span>
            </p>
          </div>

          {/* PROGRESS BAR */}
          <div className="mt-3 shrink-0">
            <div className="h-6 w-full border border-black rounded-full overflow-hidden relative">
              <div className="absolute left-0 top-0 h-full bg-[#b58030]" style={{ width: `${orangePct}%` }} />
              <div className="absolute top-0 h-full" style={{ left: `${orangePct}%`, width: `${greenPct}%`, background: '#53a00d' }} />
              <div className="absolute top-0 h-full bg-[#333]" style={{ left: `${orangePct + greenPct}%`, width: `${100 - (orangePct + greenPct)}%` }} />
            </div>
            <div className="relative h-4 mt-1">
              {MILESTONES.map((m, i) => (
                <span
                  key={i}
                  className="absolute font-bold whitespace-nowrap"
                  style={{ left: `${(i / (MILESTONES.length - 1)) * 100}%`, transform: 'translateX(-50%)', fontSize: 8, color: '#ffffff' }}
                >
                  {m}
                </span>
              ))}
            </div>
          </div>

          {/* REWARD CARDS */}
          <div className="mt-3 flex-1 overflow-y-auto space-y-2 pr-1">
            {ROAD_REWARDS.map((r, i) => {
              const status    = getStatus(r.threshold);
              const isLocked  = status === 'locked';
              const isClaimed = status === 'claimed';
              const isAvail   = status === 'available';
              const isLoading = claiming === r.threshold;

              /* ── Button style logic ──
                 locked   → grey bg, grey border, dark text, not clickable
                 available → white bg, black border, black text, clickable
                 claimed  → grey bg, grey border, muted text, not clickable
              */
              const btnStyle = isAvail
                ? {
                    background:  '#ffffff',
                    borderColor: '#000000',
                    color:       '#000000',
                    boxShadow:   '0 2px 0 #555',
                    cursor:      'pointer',
                    opacity:     1,
                  }
                : {
                    background:  '#555555',
                    borderColor: '#333333',
                    color:       '#aaaaaa',
                    boxShadow:   'none',
                    cursor:      'not-allowed',
                    opacity:     1,
                  };

              const btnLabel = isLoading
                ? '...'
                : isClaimed
                  ? 'Получено'
                  : isAvail
                    ? 'Забрать'
                    : 'Заблок.';

              return (
                <div
                  key={i}
                  className="bg-[#000] rounded-xl p-2 flex justify-between items-center border-2 border-[#000]"
                  style={{ opacity: isLocked ? 0.55 : 1 }}
                >
                  <div>
                    <p className="text-[10px] text-white">{r.threshold} / 1000</p>
                    <h3 className="text-white text-sm font-semibold">{r.label}</h3>
                  </div>

                  <button
                    onClick={() => { if (isAvail && !claiming) handleClaim(r.threshold); }}
                    disabled={!isAvail || !!claiming}
                    className="px-3 py-1 rounded-md text-sm border active:scale-95 transition-transform font-bold"
                    style={{ ...btnStyle, minWidth: 80 }}
                  >
                    {btnLabel}
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