import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { doUpgradeCharacter, fetchState } from '../redux/gameSlice';

import pageBg      from '../assets/page1bg.webp';
import imgDrunstroy from '../assets/page14Images/drunstroy.webp';
import imgGanzapad  from '../assets/page14Images/ganzapad.webp';
import imgSub5      from '../assets/page14Images/sub5.webp';
import logoDark     from '../assets/logo-darkk.webp';
import StoryCard    from '../components/StoryCard';
import SnackBar     from '../components/SnackBar';

const Skel = ({ className = '' }) => (
  <div className={`bg-white/10 rounded animate-pulse ${className}`} />
)

const useCooldown = (ts) => {
  const calc = () => (ts ? Math.max(0, ts - Math.floor(Date.now() / 1000)) : 0)
  const [secs, setSecs] = useState(calc)
  useEffect(() => {
    setSecs(calc())
    const id = setInterval(() => setSecs(calc()), 1000)
    return () => clearInterval(id)
  }, [ts])
  return secs
}

const fmtTimer = (s) => {
  const h   = Math.floor(s / 3600)
  const m   = String(Math.floor((s % 3600) / 60)).padStart(2, '0')
  const sec = String(s % 60).padStart(2, '0')
  return h > 0 ? `${h}:${m}:${sec}` : `${m}:${sec}`
}

const fmtFa = (n) => {
  if (!n && n !== 0) return '?'
  if (n >= 1e12) return `${(n / 1e12).toFixed(1)}T`
  if (n >= 1e9)  return `${(n / 1e9).toFixed(1)}B`
  if (n >= 1e6)  return `${(n / 1e6).toFixed(1)}M`
  if (n >= 1e3)  return `${(n / 1e3).toFixed(1)}K`
  return String(Math.floor(n))
}

const CHARS = {
  drunstroy: {
    img: imgDrunstroy,
    name: 'DRUNSTROY',
    perks: ['прибыль в слотах,', 'доход в час'],
    avatarBg: 'linear-gradient(160deg,#8b0000,#c0392b,#7a0000)',
    baseCost: 16900000000 
  },
  ganzapad: {
    img: imgGanzapad,
    name: 'GANZAPAD',
    perks: ['доход за клик', 'время сбора денег'],
    avatarBg: 'linear-gradient(160deg,#0a1a5a,#1a4aa0,#0a2060)',
    baseCost: 5000000
  },
  sub5: {
    img: imgSub5,
    name: 'SUB-5',
    perks: ['прибыль с друнов,', 'доход с бонусов'],
    avatarBg: 'linear-gradient(160deg,#b87000,#e8a020,#8a5000)',
    baseCost: 1400000000000
  },
}

const CharacterCardWrapper = ({ charKey, charData, userFa, onUpgrade, upgrading, setMsg }) => {
  const cfg = CHARS[charKey];
  const currentLevel = charData?.level ?? 0;
  const cooldownEnd   = charData?.cooldown_end_ts ?? 0;
  const cost          = charData?.upgrade_cost || charData?.cost || cfg.baseCost;
  const cooldownSecs = useCooldown(cooldownEnd);
  const isCooling    = cooldownSecs > 0;
  const isMaxed      = charData?.is_maxed || false;
  const canAfford    = cost != null && userFa != null && userFa >= cost;
  const state        = isMaxed ? 'maxed' : isCooling ? 'timer' : canAfford ? 'upgrade' : 'broke';

  if (!cfg || !charData) return <Skel className="w-full h-[110px]" />;

  const handleDisabledClick = () => {
    if (state === 'timer') setMsg({ type: 'cooldown', text: `Cooldown: ${fmtTimer(cooldownSecs)}` });
    if (state === 'broke') setMsg({ type: 'error', text: `Insufficient FA: ${fmtFa(cost)}` });
    if (state === 'maxed') setMsg({ type: 'max', text: `Max Level Reached!` });
  };

  let buttonText, buttonBg, buttonBorder, buttonShadow, buttonTextColor, disableButton, onButtonClick;

  if (upgrading) {
    buttonText = '...';
    buttonBg = 'rgba(0,0,0,0.1)'; buttonBorder = 'transparent';
    buttonShadow = 'none'; buttonTextColor = '#888';
    disableButton = true;
  } 
  else if (state === 'timer') {
    buttonText = `${fmtTimer(cooldownSecs)}`;
    buttonBg = 'linear-gradient(180deg,#9b5ff4,#6b2fc4)'; buttonBorder = '#5b1fa4';
    buttonShadow = '0 3px 0 #3b0f84'; buttonTextColor = '#fff';
    disableButton = false; onButtonClick = handleDisabledClick;
  } 
  else if (state === 'maxed') {
    buttonText = 'MAX';
    buttonBg = 'rgba(0,0,0,0.2)'; buttonBorder = 'rgba(0,0,0,0.3)';
    buttonShadow = 'none'; buttonTextColor = '#666';
    disableButton = false; onButtonClick = handleDisabledClick;
  } 
  else if (state === 'broke') {
    buttonText = `${fmtFa(cost)}`;
    buttonBg = 'linear-gradient(180deg,#888888,#555555)'; buttonBorder = '#444';
    buttonShadow = '0 3px 0 #222'; buttonTextColor = '#ddd';
    disableButton = false; onButtonClick = handleDisabledClick;
  } 
  else {
    buttonText = `${fmtFa(cost)}`;
    buttonBg = 'linear-gradient(180deg,#f0c020,#c89000)'; buttonBorder = '#8a6000';
    buttonShadow = '0 3px 0 #6a4000'; buttonTextColor = '#000';
    disableButton = false; onButtonClick = () => onUpgrade(charKey);
  }

  return (
    <StoryCard
      cardBg={'#c0c0c0'}
      image={cfg.img}
      imageBg={cfg.avatarBg}
      imageBorder={'#333'}
      title={cfg.name}
      ypText={`ур. ${currentLevel}`}
      subtitle={
        <div>
          {cfg.perks.map((p, i) => (
            <p key={i} className="text-[#333] font-semibold text-[12px] leading-snug m-0">{p}</p>
          ))}
        </div>
      }
      buttonText={`Улучшить ${buttonText}`}
      buttonBg={buttonBg}
      buttonBorder={buttonBorder}
      buttonShadow={buttonShadow}
      buttonTextColor={buttonTextColor}
      onButtonClick={onButtonClick}
      disableButton={disableButton}
    />
  )
}

const Page14 = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, characters } = useSelector((s) => s.game);
  const [upgradingKey, setUpgradingKey] = useState(null);
  const [msg, setMsg] = useState(null);

  const userFa = user?.fa ?? 0;

  const handleUpgrade = async (key) => {
    setUpgradingKey(key);
    try {
      await dispatch(doUpgradeCharacter(key)).unwrap();
      setMsg({ type: 'success', text: `Upgrade Successful!` });
      dispatch(fetchState());
    } catch (e) {
      setMsg({ type: 'error', text: e?.message || `Failed` });
    }
    setUpgradingKey(null);
    setTimeout(() => setMsg(null), 2500);
  }

  const getToastColors = () => {
    switch (msg?.type) {
      case 'success':  return 'bg-green-500/80 border-green-400 text-white';
      case 'error':    return 'bg-red-500/80 border-red-400 text-white';
      case 'cooldown': return 'bg-purple-600/80 border-purple-400 text-white';
      case 'max':      return 'bg-cyan-600/80 border-cyan-400 text-white';
      default:         return 'bg-black/60 border-white/20 text-white';
    }
  };

  return (
    <div
      className="w-full h-dvh flex flex-col overflow-hidden relative"
      style={{ backgroundImage: `url(${pageBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      {/* FLOATING TOAST */}
      <div className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-[10000] w-[85%] transition-all duration-500 ease-out transform ${msg ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-90 pointer-events-none'}`}>
        <div className={`py-3 px-5 rounded-2xl border backdrop-blur-lg flex items-center justify-center shadow-[0_10px_25px_rgba(0,0,0,0.4)] ${getToastColors()}`}>
            <span className="font-bold text-[13px] uppercase tracking-wider text-center drop-shadow-sm">
              {msg?.text}
            </span>
        </div>
      </div>

      {/* HEADER - PAGE 15 STYLE */}
      <div className="shrink-0 border-white/10 px-4 pt-3 pb-4 space-y-3" style={{ background: '#dbdbdb' }}>
        <div className="flex justify-center overflow-hidden mx-auto" style={{ width: 160, height: 41, position: 'relative' }}>
          <img src={logoDark} alt="Logo" style={{ position: 'absolute', width: 266, height: 'auto', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
        </div>

        <div className="flex justify-between px-2">
            <button className="bg-transparent border-none font-black text-xs tracking-widest uppercase text-[#6ecf20] cursor-default">
            ПЕРСОНАЖИ
          </button>
          <button onClick={() => navigate('/page15')} className="bg-transparent border-none font-black text-xs tracking-widest uppercase text-black cursor-pointer">
            УЛУЧШЕНИЯ
          </button>
        </div>

        <div className="relative w-full h-[4px] rounded-full mx-1">
          <div className="absolute left-0 top-0 h-[4px] w-1/2 bg-[#6ecf20] rounded-l-full" />
          <div className="absolute left-1/2 top-0 h-[4px] w-1/2 bg-black rounded-r-full" />
          <div className="absolute -left-2 top-1/2 -translate-y-1/2 rotate-45 w-4 h-4 bg-[#6ecf20]" />
          <div className="absolute -right-2 top-1/2 -translate-y-1/2 rotate-45 w-4 h-4 bg-black" />
        </div>
      </div>

      {/* INFO BAR */}
      <div className="shrink-0 mx-4 mt-2 mb-2 rounded-xl px-3 py-1.5 border border-white bg-black">
        <p className="text-white text-[10px] leading-snug text-center m-0 font-days">
          Улучшая персонажей, вы увеличиваете свой уровень. Каждый уровень даёт +2% ко всем доходам.
        </p>
      </div>

      {/* LIST */}
      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 pb-36 flex flex-col gap-3">
        {['drunstroy', 'ganzapad', 'sub5'].map((key) => (
          <CharacterCardWrapper
            key={key}
            charKey={key}
            charData={characters?.[key] ?? null}
            userFa={userFa}
            onUpgrade={handleUpgrade}
            upgrading={upgradingKey === key}
            setMsg={setMsg}
          />
        ))}
      </div>

      <SnackBar />
    </div>
  )
}

export default Page14;