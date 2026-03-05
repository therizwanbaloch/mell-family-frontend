import React, { useState } from 'react';
import pageBg from '../assets/page1bg.webp';
import SnackBar from '../components/SnackBar';

const characters = [
  {
    id: 'drunstroy',
    name: 'DRUNSTROY',
    level: 47,
    desc: 'прибыль в слотах, доход в час',
    btnLabel: 'Улучшить 16.9В',
    btnStyle: 'gold',
    bgColor: '#1a2a1a',
    borderColor: '#3a6a20',
    upgrades: [
      { icon: '🎰', name: 'Казино',  price: '5.4m' },
      { icon: '📺', name: 'Стримы',  price: '12.4m' },
      { icon: '😂', name: 'Мемость', price: '35.8m' },
      { icon: '✂️', name: 'Нарезки', price: '121m' },
      { icon: '💸', name: 'Донаты',  price: '221m' },
    ],
  },
  {
    id: 'ganzapad',
    name: 'GANZAPAD',
    level: 46,
    desc: 'доход за клик время сбора денег',
    btnLabel: 'Осталось 1:12:56:34',
    btnStyle: 'purple',
    bgColor: '#1a1a2a',
    borderColor: '#3a3a6a',
    upgrades: [
      { icon: '⚡', name: 'Хайп',   price: '5.4m' },
      { icon: '🎤', name: 'Рэп',    price: '12.4m' },
      { icon: '🎭', name: 'Образ',  price: '35.8m' },
      { icon: '👗', name: 'Стиль',  price: '121m' },
      { icon: '💸', name: 'Донаты', price: '221m' },
    ],
  },
  {
    id: 'sub5',
    name: 'SUB-5',
    level: 49,
    desc: 'прибыль с друнов, доход с бонусов',
    btnLabel: 'Улучшить 1.4T',
    btnStyle: 'grey',
    bgColor: '#2a2a1a',
    borderColor: '#6a6a20',
    upgrades: [
      { icon: '🃏', name: 'Пранки',    price: '5.4m' },
      { icon: '📰', name: 'Скандалы',  price: '12.4m' },
      { icon: '📹', name: 'Влог',      price: '35.8m' },
      { icon: '📸', name: 'Instagram', price: '121m' },
      { icon: '🤝', name: 'Колабы',    price: '221m' },
    ],
  },
];

const CharactersPage = () => {
  const [tab, setTab] = useState('персонажи'); // 'персонажи' | 'улучшения'
  const [selectedChar, setSelectedChar] = useState(null);

  const activeChar = characters.find(c => c.id === selectedChar) || null;

  const getBtnStyle = (style) => {
    if (style === 'gold') return { background: 'linear-gradient(90deg,#f0c020,#d4a000)', border: '1.5px solid #8a6000', color: '#000' };
    if (style === 'purple') return { background: 'linear-gradient(90deg,#8a40e0,#6020c0)', border: '1.5px solid #4a10a0', color: '#fff' };
    return { background: 'linear-gradient(90deg,#666,#444)', border: '1.5px solid #333', color: '#fff' };
  };

  const getCharBg = (id) => {
    if (id === 'drunstroy') return { background: 'linear-gradient(135deg,#2a4a10,#1a3008)' };
    if (id === 'ganzapad') return { background: 'linear-gradient(135deg,#1a1a3a,#0d0d20)' };
    return { background: 'linear-gradient(135deg,#3a2a10,#201808)' };
  };

  return (
    <div
      className='w-full flex flex-col'
      style={{
        backgroundImage: `url(${pageBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        maxWidth: '430px',
        margin: '0 auto',
        height: '100dvh',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div className='flex flex-col items-center pt-2 pb-1 flex-shrink-0' style={{ background: 'rgba(0,0,0,0.5)' }}>
        <span className='font-black text-white uppercase tracking-widest' style={{ fontSize: 'clamp(12px,3.5vw,16px)' }}>DRUN FAMILY</span>
        <div className='flex items-center w-[60%]'>
          <div className='flex-1 h-px' style={{ background: 'rgba(255,255,255,0.3)' }} />
          <span className='text-gray-400 text-xs mx-2 tracking-widest'>game</span>
          <div className='flex-1 h-px' style={{ background: 'rgba(255,255,255,0.3)' }} />
        </div>

        {/* Tab bar */}
        <div className='flex items-center w-full px-4 mt-1 gap-4'>
          {['персонажи', 'улучшения'].map(t => (
            <button key={t} onClick={() => { setTab(t); setSelectedChar(null); }}
              className='flex-1 py-1 font-black uppercase text-sm'
              style={{ color: tab === t ? '#53a00d' : '#ffffff', borderBottom: tab === t ? '2px solid #53a00d' : 'none' }}>
              {t}
            </button>
          ))}
        </div>

        {/* Diamond progress bar */}
        <div className='flex items-center w-full px-4 mt-1 gap-1 mb-1'>
          <div className='relative w-5 h-5 flex items-center justify-center flex-shrink-0'>
            <div className='w-4 h-4 rotate-45' style={{ background: 'linear-gradient(135deg,#6ecf20,#53a00d)', border: '1.5px solid #3a7009', boxShadow: '0 0 8px rgba(83,160,13,0.8)' }} />
            <div className='absolute w-1.5 h-1.5 rounded-full bg-white' />
          </div>
          <div className='flex-1 flex rounded-full overflow-hidden' style={{ height: '6px' }}>
            <div style={{ width: '50%', background: 'linear-gradient(90deg,#53a00d,#8fd62f)' }} />
            <div style={{ width: '50%', background: '#1a1a1a' }} />
          </div>
          <div className='relative w-5 h-5 flex items-center justify-center flex-shrink-0'>
            <div className='w-4 h-4 rotate-45' style={{ background: 'linear-gradient(135deg,#3a3a3a,#1a1a1a)', border: '1.5px solid #000' }} />
            <div className='absolute w-1.5 h-1.5 rounded-full bg-white opacity-60' />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className='flex-1 overflow-y-auto pb-20 px-2 pt-2'>
        {tab === 'персонажи' && (
          <div className='flex flex-col gap-3'>
            {/* Info card */}
            <div className='rounded-2xl p-3' style={{ background: 'rgba(0,0,0,0.6)', border: '1.5px solid #333' }}>
              <div className='flex items-center gap-2 mb-1'>
                <div className='relative w-5 h-5 flex items-center justify-center flex-shrink-0'>
                  <div className='w-4 h-4 rotate-45' style={{ background: 'linear-gradient(135deg,#b58030,#b58030)', border: '1.5px solid #8a6000' }} />
                  <div className='absolute w-1.5 h-1.5 rounded-full bg-white' />
                </div>
                <div className='flex-1 h-1.5 rounded-full' style={{ background: 'linear-gradient(90deg,#b58030,#53a00d)' }} />
                <div className='relative w-5 h-5 flex items-center justify-center flex-shrink-0'>
                  <div className='w-4 h-4 rotate-45' style={{ background: 'linear-gradient(135deg,#53a00d,#3a7009)', border: '1.5px solid #2a5007' }} />
                  <div className='absolute w-1.5 h-1.5 rounded-full bg-white' />
                </div>
              </div>
              <div className='flex justify-between px-1'>
                <span className='text-yellow-500 font-black text-xs'>4</span>
                <span className='text-green-500 font-black text-xs'>5</span>
              </div>
              <p className='text-white text-xs text-center mt-2 leading-relaxed'>Улучшая персонажей, вы увеличиваете свой уровень. Каждый уровень дает +2% ко всем доходам, а на последнем уровне вам станет доступен вывод средств.</p>
            </div>

            {characters.map(char => (
              <div key={char.id} className='rounded-2xl overflow-hidden' style={{ background: 'linear-gradient(180deg,#2a2a2a,#1a1a1a)', border: `1.5px solid ${char.borderColor}` }}>
                <div className='flex items-center gap-3 p-3'>
                  <div className='w-16 h-16 rounded-xl flex-shrink-0 overflow-hidden' style={{ ...getCharBg(char.id), border: `2px solid ${char.borderColor}` }}>
                    <div className='w-full h-full flex items-center justify-center text-3xl'>
                      {char.id === 'drunstroy' ? '🧔' : char.id === 'ganzapad' ? '🎭' : '😊'}
                    </div>
                  </div>
                  <div className='flex-1'>
                    <div className='flex items-center gap-2'>
                      <span className='font-black text-white' style={{ fontSize: 'clamp(13px,3.5vw,16px)' }}>{char.name}</span>
                      <span className='text-gray-400 text-xs'>ур. {char.level}</span>
                    </div>
                    <p className='text-gray-300 text-xs mt-0.5'>{char.desc}</p>
                    <button className='mt-2 px-4 py-1.5 rounded-xl font-bold text-xs active:scale-95' style={getBtnStyle(char.btnStyle)}>
                      {char.btnLabel} {char.btnStyle === 'gold' && '🪙'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'улучшения' && (
          <div className='flex flex-col gap-3'>
            <div className='rounded-xl p-3' style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid #444' }}>
              <p className='text-white text-xs text-center leading-relaxed'>Прокачивая улучшения, становятся доступными новые уровни персонажей. прокачав все улучшения персонажа до определенного уровня вы сможете улучшить персонажа до этого уровня.</p>
            </div>

            {characters.map(char => (
              <div key={char.id}>
                {/* Character banner */}
                <div className='rounded-2xl overflow-hidden mb-2' style={{ height: '110px', ...getCharBg(char.id), border: `1.5px solid ${char.borderColor}`, position: 'relative' }}>
                  <div className='absolute inset-0 flex items-end pb-2 px-3'>
                    <span className='font-black text-white text-2xl' style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>{char.name}</span>
                  </div>
                </div>
                {/* Upgrades list */}
                {char.upgrades.map((upg, i) => (
                  <div key={i} className='flex items-center gap-2 px-3 py-2 rounded-xl mb-1.5' style={{ background: `linear-gradient(90deg,${char.bgColor},#111)`, border: `1px solid ${char.borderColor}44` }}>
                    <div className='w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0' style={{ background: char.borderColor + '44', border: `1.5px solid ${char.borderColor}`, position: 'relative' }}>
                      {upg.icon}
                      <span className='absolute -bottom-1 -right-1 w-4 h-4 rounded-full text-white text-xs flex items-center justify-center font-black' style={{ background: '#333', border: '1px solid #555' }}>7</span>
                    </div>
                    <span className='flex-1 text-white font-bold text-base'>{upg.name}</span>
                    <div className='flex items-center gap-1 px-2 py-1 rounded-full' style={{ background: 'linear-gradient(90deg,#c8860040,#c8860080)', border: `1px solid ${char.borderColor}` }}>
                      <span className='text-sm'>🪙</span>
                      <span className='text-yellow-300 font-bold text-sm'>{upg.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      <SnackBar activeTab={2} />
    </div>
  );
};

export default CharactersPage;
