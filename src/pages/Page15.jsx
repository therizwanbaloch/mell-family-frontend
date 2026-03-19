import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { doUpgradeImprovement, fetchState } from '../redux/gameSlice';

import pageBg    from '../assets/page1bg.webp';
import imgFaIcon from '../assets/page14Images/fa_icon.webp';
import logoDark  from '../assets/logo-darkk.webp';

import imgHeroDrunstroy from '../assets/page15Images/hero_drunstroy.webp';
import imgHeroGanzapad  from '../assets/page15Images/hero_ganzapad.webp';
import imgHeroSub5      from '../assets/page15Images/hero_sub5.webp';

import imgCasino   from '../assets/page15Images/casino.webp';
import imgStreams  from '../assets/page15Images/streams.webp';
import imgMemes    from '../assets/page15Images/memes.webp';
import imgClips    from '../assets/page15Images/clips.webp';
import imgDonates1 from '../assets/page15Images/donates.webp';

import imgHype     from '../assets/page15Images/hype.webp';
import imgRap      from '../assets/page15Images/rap.webp';
import imgLook     from '../assets/page15Images/look.webp';
import imgStyle    from '../assets/page15Images/style.webp';
import imgDonates2 from '../assets/page15Images/donatesganz.webp';

import imgPranks   from '../assets/page15Images/pranks.webp';
import imgScandals from '../assets/page15Images/scandals.webp';
import imgVlog     from '../assets/page15Images/vlog.webp';
import imgInstagram from '../assets/page15Images/instagram.webp';
import imgColabs   from '../assets/page15Images/colabs.webp';
import SnackBar from '../components/SnackBar';

const fmtCdMain = (s) => {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sc = s % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${sc}s`;
  return `${sc}s`;
}

const fmtFa = (n) => {
  if (!n && n !== 0) return '?';
  if (n >= 1e9)  return `${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6)  return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3)  return `${(n / 1e3).toFixed(1)}K`;
  return String(Math.floor(n));
}

const SECTIONS = [
  {
    id: 'drunstroy', hero: imgHeroDrunstroy, name: 'DRUNSTROY',
    heroBorder: '#039b2e',
    rowBg: 'linear-gradient(90deg, #039b2e, #28660e)', 
    rowBorder: '#039b2e',
    slots: [
      { slot: 1, icon: imgCasino,   label: 'Казино',   cost: 5400000  },
      { slot: 2, icon: imgStreams,  label: 'Стримы',   cost: 12400000 },
      { slot: 3, icon: imgMemes,    label: 'Мемость',  cost: 35800000 },
      { slot: 4, icon: imgClips,    label: 'Нарезки',  cost: 121000000 },
      { slot: 5, icon: imgDonates1, label: 'Донаты',   cost: 221000000 },
    ],
  },
  {
    id: 'ganzapad', hero: imgHeroGanzapad, name: 'GANZAPAD',
    heroBorder: '#888888',
    rowBg: 'linear-gradient(90deg, #888888, #464646)', 
    rowBorder: '#888888',
    slots: [
      { slot: 1, icon: imgHype,     label: 'Хайп',   cost: 5400000  },
      { slot: 2, icon: imgRap,      label: 'Рэп',    cost: 12400000 },
      { slot: 3, icon: imgLook,     label: 'Образ',  cost: 35800000 },
      { slot: 4, icon: imgStyle,    label: 'Стиль',  cost: 121000000 },
      { slot: 5, icon: imgDonates2, label: 'Донаты', cost: 221000000 },
    ],
  },
  {
    id: 'sub5', hero: imgHeroSub5, name: 'SUB-5',
    heroBorder: '#c46e15',
    rowBg: 'linear-gradient(90deg, #c46e15, #ffa40a)', 
    rowBorder: '#ffa40a',
    slots: [
      { slot: 1, icon: imgPranks,   label: 'Пранки',    cost: 5400000  },
      { slot: 2, icon: imgScandals, label: 'Скандалы',  cost: 12400000 },
      { slot: 3, icon: imgVlog,     label: 'Влог',      cost: 35800000 },
      { slot: 4, icon: imgInstagram,label: 'Instagram', cost: 121000000 },
      { slot: 5, icon: imgColabs,   label: 'Колабы',    cost: 221000000 },
    ],
  },
];

const UpgradeRow = ({ sec, slot, slotData, onUpgrade, onToast, upgrading, userFa }) => {
  const locked   = slotData?.locked ?? false;
  const level    = slotData?.level ?? 0;
  const isMax    = level >= 25; 

  const [secsLeft, setSecsLeft] = useState(0);
  useEffect(() => {
    if (!slotData?.cooldown_end_ts) return;
    const iv = setInterval(() => {
      const ts = slotData.cooldown_end_ts;
      const left = Math.max(0, ts - Math.floor(Date.now() / 1000));
      setSecsLeft(left);
      if (left <= 0) clearInterval(iv);
    }, 1000);
    return () => clearInterval(iv);
  }, [slotData?.cooldown_end_ts]);

  const costNum   = slotData?.next_cost ?? slotData?.cost ?? slot.cost ?? 0;
  const canAfford = (userFa ?? 0) >= costNum;
  const isCooling = secsLeft > 0;

  return (
    <div
      onClick={() => {
        if (upgrading || isMax) return;
        if (locked)      { onToast('error', 'Locked Slot!'); return; }
        if (isCooling)   { onToast('cooldown', `Wait: ${fmtCdMain(secsLeft)}`); return; }
        if (!canAfford)  { onToast('error', `Need ${fmtFa(costNum)} FA!`); return; }
        onUpgrade(sec.id, slot.slot);
      }}
      className="mx-2"
      style={{
        display: 'flex', alignItems: 'center', gap: 12, height: 68,
        padding: '0 14px 0 8px', borderRadius: 999,
        background: locked ? '#1a1a1a' : sec.rowBg,
        border: `2px solid ${locked ? '#333' : sec.rowBorder}`,
        opacity: locked ? 0.6 : 1,
        transition: 'transform 0.1s active:scale-95',
        cursor: isMax ? 'default' : 'pointer',
        boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
      }}
    >
      <div style={{ position: 'relative', width: 52, height: 52, flexShrink: 0 }}>
        <img src={slot.icon} alt={slot.label} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '2px solid #fff' }} />
        <div style={{ position: 'absolute', bottom: -2, right: -2, width: 22, height: 22, background: '#f0c020', borderRadius: '50%', fontSize: 10, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', border: '1.5px solid #000' }}>
          {level}
        </div>
      </div>

      <span style={{ flex: 1, color: '#fff', fontWeight: 800, fontSize: 16, fontFamily: "'Jost', sans-serif", whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {slot.label}
      </span>

      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        width: 105, height: 40, borderRadius: 999,
        background: isMax ? '#444' : 'radial-gradient(circle at 50% 50%, #e8b325, #e69e31)',
        border: isMax ? '2px solid #666' : '2px solid #6a4a00',
        boxShadow: isMax ? 'none' : '0 3px 0 #3a2800',
        flexShrink: 0
      }}>
        {!isMax && !isCooling && !upgrading && <img src={imgFaIcon} alt="fa" style={{ width: 18, height: 18 }} />}
        <span style={{ color: '#fff', fontWeight: 900, fontSize: 14 }}>
          {upgrading ? '...' : isMax ? 'MAX' : isCooling ? fmtCdMain(secsLeft) : fmtFa(costNum)}
        </span>
      </div>
    </div>
  );
};

const Page15 = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, improvements } = useSelector((s) => s.game);
  const [upgradingKey, setUpgradingKey] = useState(null);
  const [msg, setMsg] = useState(null);

  const showToast = (type, text) => {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 2500);
  };

  const handleUpgrade = async (charKey, slot) => {
    setUpgradingKey(`${charKey}-${slot}`);
    try {
      await dispatch(doUpgradeImprovement({ charKey, slot })).unwrap();
      showToast('success', 'Upgrade Successful!');
      dispatch(fetchState());
    } catch (e) {
      showToast('error', e?.message || 'Upgrade Failed!');
    } finally {
      setUpgradingKey(null);
    }
  };

  const getToastColors = () => {
    switch (msg?.type) {
      case 'success':  return 'bg-green-500/80 border-green-400 text-white';
      case 'error':    return 'bg-red-500/80 border-red-400 text-white';
      case 'cooldown': return 'bg-purple-600/80 border-purple-400 text-white';
      default:         return 'bg-black/60 border-white/20 text-white';
    }
  };

  return (
    <div className="w-full h-dvh flex flex-col overflow-hidden relative" style={{ backgroundImage: `url(${pageBg})`, backgroundSize: 'cover' }}>
      
      {/* FLOATING TOAST - PLACED AT BOTTOM-24 */}
      <div className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-[10000] w-[85%] transition-all duration-500 ease-out transform ${msg ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-90 pointer-events-none'}`}>
        <div className={`py-3 px-5 rounded-2xl border backdrop-blur-lg flex items-center justify-center shadow-[0_10px_25px_rgba(0,0,0,0.4)] ${getToastColors()}`}>
            <span className="font-bold text-[13px] uppercase tracking-wider text-center drop-shadow-sm">
              {msg?.text}
            </span>
        </div>
      </div>

      {/* HEADER */}
      <div className="shrink-0 border-white/10 px-4 pt-3 pb-4 space-y-3" style={{ background: '#dbdbdb' }}>
        <div className="flex justify-center overflow-hidden mx-auto" style={{ width: 160, height: 41, position: 'relative' }}>
          <img src={logoDark} alt="Logo" style={{ position: 'absolute', width: 266, height: 'auto', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
        </div>
        <div className="flex justify-between px-2">
          <button onClick={() => navigate('/page14')} className="bg-transparent border-none font-black text-xs tracking-widest uppercase text-black">
            ПЕРСОНАЖИ
          </button>
          <button className="bg-transparent border-none font-black text-xs tracking-widest uppercase text-[#6ecf20]">
            УЛУЧШЕНИЯ
          </button>
        </div>
        <div className="relative w-full h-[4px] rounded-full mx-1">
          <div className="absolute left-0 top-0 h-[4px] w-1/2 bg-black rounded-l-full" />
          <div className="absolute left-1/2 top-0 h-[4px] w-1/2 bg-[#6ecf20] rounded-r-full" />
          <div className="absolute -left-2 top-1/2 -translate-y-1/2 rotate-45 w-4 h-4 bg-[#6ecf20]" />
          <div className="absolute -right-2 top-1/2 -translate-y-1/2 rotate-45 w-4 h-4 bg-[#6ecf20]" />
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex-1 overflow-y-auto pb-32 pt-4 flex flex-col gap-8">
        {SECTIONS.map((sec) => (
          <div key={sec.id} className="flex flex-col gap-3">
            <div className="mx-2" style={{ borderRadius: 20, overflow: 'hidden', border: `3px solid ${sec.heroBorder}`, position: 'relative', boxShadow: '0 6px 12px rgba(0,0,0,0.4)' }}>
              <img src={sec.hero} alt={sec.name} className="w-full h-40 object-cover" />
              <div className="absolute bottom-2 right-4 text-white font-black text-3xl italic tracking-tighter" style={{ textShadow: '2px 2px 4px #000' }}>
                {sec.name}
              </div>
            </div>
            
            <div className="flex flex-col gap-2.5">
              {sec.slots.map((slot) => (
                <UpgradeRow
                  key={slot.slot}
                  sec={sec} slot={slot}
                  slotData={improvements?.[sec.id]?.[slot.slot]}
                  onUpgrade={handleUpgrade}
                  onToast={showToast}
                  upgrading={upgradingKey === `${sec.id}-${slot.slot}`}
                  userFa={user?.fa}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <SnackBar />
    </div>
  );
};

export default Page15;