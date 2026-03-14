import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Page8Modal from "./Page8Modal";

import imgUSDTCoin   from "../assets/page1to6Images/usdt.webp";
import imgFishki     from "../assets/page1to6Images/OaIcon.webp";
import imgGoalBadge  from "../assets/page1to6Images/OaIcon.webp";
import imgSlots      from "../assets/page1to6Images/Слоты.webp";
import imgTournament from "../assets/page1to6Images/Турниры.webp";
import imgBoxes      from "../assets/page1to6Images/Боксы.webp";

const Skel = ({ w = '60px', h = '14px', radius = '6px' }) => (
  <div style={{
    width: w, height: h, borderRadius: radius,
    background: 'rgba(255,255,255,0.15)',
    animation: 'skelPulse 1.4s ease-in-out infinite',
    display: 'inline-block',
  }} />
)

const USDT_WITHDRAW_MIN  = 100
const CHIPS_WITHDRAW_MIN = 5000

const BalanceModal = ({ isOpen, onClose }) => {
  const [visible,      setVisible]      = useState(false);
  const [animateIn,    setAnimateIn]    = useState(false);
  const [tab,          setTab]          = useState('balance');
  const [currency,     setCurrency]     = useState('usdt');
  const [showHowTo,    setShowHowTo]    = useState(false);
  const [showPage8,    setShowPage8]    = useState(false);
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.game);
  const isReady  = !!user

  const usdt   = Number(user?.usdt  ?? 0)
  const chips  = Number(user?.chips ?? 0)
  const isUSDT = currency === 'usdt'

  const usdtPct  = Math.min(100, (usdt  / USDT_WITHDRAW_MIN)  * 100)
  const chipsPct = Math.min(100, (chips / CHIPS_WITHDRAW_MIN) * 100)
  const pct      = isUSDT ? usdtPct : chipsPct

  const usdtRemaining  = Math.max(0, USDT_WITHDRAW_MIN  - usdt).toFixed(2)
  const chipsRemaining = Math.max(0, CHIPS_WITHDRAW_MIN - chips)
  const canWithdrawUsdt  = usdt  >= USDT_WITHDRAW_MIN
  const canWithdrawChips = chips >= CHIPS_WITHDRAW_MIN

  const fmtUsdt  = (n) => Number(n).toFixed(2)
  const fmtChips = (n) => Math.floor(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '\u00A0')

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setAnimateIn(true)));
    } else {
      setAnimateIn(false);
      const t = setTimeout(() => setVisible(false), 380);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  if (!visible) return null;

  return (
    <>
      <style>{`
        @keyframes skelPulse {
          0%,100% { opacity: 0.35; }
          50%      { opacity: 0.8; }
        }
      `}</style>

      <div
        onClick={onClose}
        className={`fixed inset-0 z-50 flex items-end justify-center transition-all duration-300
          ${animateIn ? 'bg-black/65 backdrop-blur-sm' : 'bg-black/0 backdrop-blur-none'}`}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={`w-full max-w-lg flex flex-col overflow-hidden rounded-t-3xl shadow-2xl
            transition-transform duration-[380ms] ease-[cubic-bezier(0.32,0.72,0,1)]
            ${animateIn ? 'translate-y-0' : 'translate-y-full'}`}
          style={{
            /* ── KEY FIX: extra bottom padding so content clears the SnackBar ── */
            paddingBottom: '70px',
            maxHeight: 'calc(85dvh - 70px)',
            minHeight: '420px',
            background: 'linear-gradient(180deg,#3a7a1a 0%,#2d6010 100%)',
            border: '1.5px solid #4a9a20',
          }}
        >
          <div className="mx-auto mt-2 mb-1 h-1 w-10 rounded-full bg-white/25 shrink-0" />

          {/* Tabs */}
          <div className="flex mx-3 mb-1 rounded-xl overflow-hidden shrink-0" style={{ background: 'rgba(0,0,0,0.2)' }}>
            <button onClick={() => setTab('balance')} className="flex-1 py-2 font-black text-xs transition-all"
              style={{ background: tab === 'balance' ? 'linear-gradient(180deg,#5ab82a,#3a8a10)' : 'transparent', color: '#fff', borderRadius: '10px' }}>
              Баланс
            </button>
            <button onClick={() => setTab('howto')} className="flex-1 py-2 font-black text-xs transition-all"
              style={{ background: tab === 'howto' ? 'linear-gradient(180deg,#5ab82a,#3a8a10)' : 'transparent', color: tab === 'howto' ? '#fff' : 'rgba(255,255,255,0.7)', borderRadius: '10px' }}>
              Как зарабатывать?
            </button>
          </div>

          <div className="flex-1 flex flex-col px-3 pb-3 overflow-y-auto">

            {/* TAB 1: BALANCE */}
            {tab === 'balance' && (
              <div className="flex flex-col gap-2 h-full">
                <div className="flex rounded-xl overflow-hidden" style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <button onClick={() => setCurrency('usdt')} className="flex-1 py-1.5 text-xs font-bold transition-all"
                    style={{ background: isUSDT ? 'linear-gradient(180deg,#aaa,#888)' : 'transparent', color: '#fff', borderRadius: '10px' }}>USDT</button>
                  <button onClick={() => setCurrency('fishki')} className="flex-1 py-1.5 text-xs font-bold transition-all"
                    style={{ background: !isUSDT ? 'linear-gradient(180deg,#888,#666)' : 'transparent', color: '#fff', borderRadius: '10px' }}>Фишки</button>
                </div>

                <div>
                  <p className="text-white font-black text-sm">Баланс:</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {isReady
                      ? <span className="font-black text-black" style={{ fontSize: 'clamp(30px,9vw,46px)' }}>
                          {isUSDT ? fmtUsdt(usdt) : fmtChips(chips)}
                        </span>
                      : <Skel w="120px" h="42px" radius="8px" />
                    }
                    <img src={isUSDT ? imgUSDTCoin : imgFishki} alt="" style={{ width: '42px', height: '42px', objectFit: 'contain', flexShrink: 0 }} />
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <p className="text-white font-bold text-xs">
                      {isReady
                        ? isUSDT
                          ? canWithdrawUsdt ? 'Вывод доступен! 🎉' : `Осталось ${usdtRemaining}$ до вывода`
                          : canWithdrawChips ? 'Вывод доступен! 🎉' : `Осталось ${fmtChips(chipsRemaining)} до вывода`
                        : <Skel w="140px" h="12px" />
                      }
                    </p>
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full"
                      style={{ background: 'linear-gradient(180deg,#6ecf20,#4a9a10)', border: '1.5px solid #3a7a08' }}>
                      <span className="text-black font-black text-xs">{isUSDT ? USDT_WITHDRAW_MIN : fmtChips(CHIPS_WITHDRAW_MIN)}</span>
                      <img src={imgGoalBadge} alt="" style={{ width: '16px', height: '16px', objectFit: 'contain' }} />
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <div className="rounded-full overflow-hidden flex" style={{ height: '16px', border: '2px solid rgba(0,0,0,0.3)' }}>
                    <div style={{ width: `${pct}%`, background: 'linear-gradient(90deg,#cc0000,#aa0000)', borderRadius: '9999px 0 0 9999px', transition: 'width 0.5s ease' }} />
                    <div style={{ flex: 1, background: 'linear-gradient(90deg,#1a4a08,#0d2a04)' }} />
                  </div>
                  <img src={isUSDT ? imgUSDTCoin : imgFishki} alt=""
                    style={{ position: 'absolute', left: `calc(${pct}% - 12px)`, top: '50%', transform: 'translateY(-50%)', width: '24px', height: '24px', objectFit: 'contain', pointerEvents: 'none', filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.6))', transition: 'left 0.5s ease' }} />
                </div>

                <button onClick={() => setShowHowTo(!showHowTo)} className="w-full py-2 rounded-xl font-black text-white text-xs active:scale-95 transition-transform"
                  style={{ background: 'linear-gradient(180deg,#5ab82a,#3a8a10)', border: '1.5px solid #2a6a08', boxShadow: '0 3px 0 #1a4a04' }}>
                  Как вывести деньги? {showHowTo ? '▲' : '▼'}
                </button>

                {showHowTo && (
                  <div className="rounded-xl p-2" style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <p className="text-white font-bold text-xs text-center leading-relaxed">
                      {isUSDT
                        ? `Когда на балансе будет ${USDT_WITHDRAW_MIN}$, появится возможность вывести деньги на карту или крипто кошелек`
                        : `Когда на балансе будет ${fmtChips(CHIPS_WITHDRAW_MIN)} Фишек, появится возможность вывести деньги. 250 Фишек = 1 USDT.`}
                    </p>
                    <p className="text-yellow-300 font-bold text-xs text-center mt-1 italic">
                      {isUSDT ? 'Для вывода средств нужен максимальный уровень всех персонажей' : 'Для вывода средств нужен 3 уровень профиля'}
                    </p>
                  </div>
                )}

                {/* Withdraw button */}
                <button
                  disabled={isUSDT ? !canWithdrawUsdt : !canWithdrawChips}
                  className="w-full py-3 rounded-2xl font-black text-base active:scale-95 transition-transform mt-auto"
                  style={{
                    background: isUSDT
                      ? 'linear-gradient(180deg,#d0d0d0,#a0a0a0)'   /* grey for USDT */
                      : 'linear-gradient(180deg,#f0c020,#c89000)',   /* gold for chips */
                    border: isUSDT ? '2px solid #888' : '2px solid #8a6000',
                    boxShadow: isUSDT ? '0 4px 0 #555' : '0 4px 0 #6a4000',
                    cursor: (isUSDT ? canWithdrawUsdt : canWithdrawChips) ? 'pointer' : 'not-allowed',
                    opacity: (isUSDT ? canWithdrawUsdt : canWithdrawChips) ? 1 : 0.5,
                    color: '#000',
                  }}
                >
                  Вывести деньги
                </button>
              </div>
            )}

            {/* TAB 2: HOW TO EARN */}
            {tab === 'howto' && (
              <div className="flex flex-col gap-2 h-full justify-center">
                {[
                  {
                    img: imgSlots, title: 'Слоты',
                    desc: 'Шанс на выигрыш USDT, монеты и Casino фишки',
                    btn: 'Слот',
                    action: () => { onClose(); navigate('/page24'); }
                  },
                  {
                    img: imgTournament, title: 'Турниры',
                    desc: 'Бери участие в турнире и получи шанс выиграть много USDT',
                    btn: 'Турнир',
                    action: () => setShowPage8(true)
                  },
                  {
                    img: imgBoxes, title: 'Боксы',
                    desc: 'Покупай боксы и забирай свои USDT, фишки, монеты.',
                    btn: 'Боксы',
                    action: () => { onClose(); navigate('/page20'); }
                  },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col rounded-2xl overflow-hidden"
                    style={{ flex: 1, background: 'rgba(0,0,0,0.22)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <div className="flex items-center gap-3 px-3 pt-3 pb-2">
                      <img src={item.img} alt={item.title} style={{ width: '44px', height: '53px', objectFit: 'contain', flexShrink: 0 }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-black leading-tight" style={{ fontSize: 'clamp(14px,4vw,17px)' }}>{item.title}</p>
                        <p className="text-white/70 leading-snug mt-0.5" style={{ fontSize: 'clamp(11px,2.8vw,13px)' }}>{item.desc}</p>
                      </div>
                    </div>
                    <div className="flex justify-center pb-2.5">
                      <button onClick={item.action} className="rounded-xl font-black text-black active:scale-95 transition-transform"
                        style={{ width: '70%', padding: '7px 0', fontSize: 'clamp(12px,3.2vw,14px)', background: 'linear-gradient(180deg,#f0c020,#d4a000)', border: '1.5px solid #8a6000', boxShadow: '0 3px 0 #6a4000' }}>
                        {item.btn}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      </div>

      <Page8Modal isOpen={showPage8} onClose={() => setShowPage8(false)} />
    </>
  );
};

export default BalanceModal;