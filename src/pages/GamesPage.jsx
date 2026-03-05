import React, { useState } from 'react';
import pageBg from '../assets/page1bg.webp';
import SnackBar from '../components/SnackBar';

// ─── Aviator sub-page ───────────────────────────────────────────────
const AviatorGame = ({ onBack }) => {
  const [betUSDT, setBetUSDT] = useState(50);
  const [betFishki, setBetFishki] = useState(179);
  const multiplier = 75.97;
  const history = [52.1, 1.27, 10.6, 1.69, 1.97, 2.3];

  return (
    <div className='flex flex-col flex-1 overflow-hidden'>
      {/* Title */}
      <div className='flex items-center justify-between px-3 py-2 flex-shrink-0' style={{ background: 'linear-gradient(180deg,#c8c8c8,#a0a0a0)' }}>
        <button onClick={onBack} className='text-black font-bold text-sm'>← Назад</button>
        <span className='font-black text-black text-base'>Самолетик Бурмалдотик</span>
        <div />
      </div>

      {/* Balances */}
      <div className='flex gap-2 px-2 pt-2 flex-shrink-0'>
        <div className='flex-1 flex items-center gap-1.5 px-3 py-2 rounded-xl' style={{ background: 'linear-gradient(90deg,#f0c020,#d4a000)', border: '1.5px solid #8a6000' }}>
          <span className='text-lg'>🪙</span>
          <div><p className='text-black text-xs font-bold uppercase leading-none'>USDT</p><p className='text-black font-black text-lg leading-none'>32.24</p></div>
        </div>
        <div className='flex-1 flex items-center gap-1.5 px-3 py-2 rounded-xl' style={{ background: 'linear-gradient(90deg,#3a8a10,#2a6a08)', border: '1.5px solid #1a4a04' }}>
          <span className='text-lg'>🎰</span>
          <div><p className='text-white text-xs font-bold uppercase leading-none'>ФИШКИ</p><p className='text-white font-black text-lg leading-none'>34508</p></div>
          <button className='ml-auto w-7 h-7 rounded-lg text-white font-black flex items-center justify-center' style={{ background: '#1a5a08', border: '1px solid #fff' }}>+</button>
        </div>
      </div>

      {/* History */}
      <div className='flex gap-1.5 px-2 pt-2 flex-shrink-0 overflow-x-auto'>
        {history.map((h, i) => (
          <span key={i} className='px-2 py-0.5 rounded-full font-bold text-xs flex-shrink-0' style={{ background: h > 2 ? '#c8a020' : '#3a8a10', color: '#fff' }}>x{h}</span>
        ))}
        <span className='px-2 py-0.5 rounded-full font-bold text-xs flex-shrink-0' style={{ background: '#333', color: '#fff' }}>•••</span>
      </div>

      {/* Game display */}
      <div className='mx-2 mt-2 rounded-2xl overflow-hidden flex-shrink-0' style={{ background: '#0a0a0a', border: '1.5px solid #333', height: '200px', position: 'relative' }}>
        <div className='absolute inset-0 flex items-center justify-center'>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, top: 0, background: 'linear-gradient(135deg,transparent 60%,#cc000033)' }} />
          <div style={{ position: 'absolute', bottom: 0, left: '10%', width: '90%', height: '70%', background: 'linear-gradient(135deg,transparent 0%,#cc000066 100%)', clipPath: 'polygon(0 100%,100% 0,100% 100%)' }} />
          <span className='font-black text-white z-10' style={{ fontSize: 'clamp(36px,11vw,52px)', textShadow: '0 0 20px rgba(255,200,0,0.8)' }}>{multiplier}x</span>
          <span style={{ position: 'absolute', top: '20%', right: '15%', fontSize: '28px' }}>✈️</span>
        </div>
      </div>

      {/* Betting panels */}
      <div className='flex-1 overflow-y-auto px-2 pb-2 flex flex-col gap-2 mt-2'>
        {[{ label: 'USDT', val: betUSDT, setVal: setBetUSDT, presets: [0.1, 0.5, 1, 5], autoOff: true },
          { label: 'Фишки', val: betFishki, setVal: setBetFishki, presets: [1, 5, 20, 100], autoOff: false }].map((panel, pi) => (
          <div key={pi} className='rounded-xl p-2' style={{ background: '#1a1a1a', border: '1px solid #333' }}>
            <div className='flex items-center gap-2 mb-1.5'>
              <div className='flex-1 flex items-center gap-2'>
                <span className='text-gray-400 text-xs'>Автоставка</span>
                <div className='w-8 h-4 rounded-full' style={{ background: panel.autoOff ? '#333' : '#53a00d' }} />
              </div>
              <div className='flex items-center gap-2'>
                <span className='text-gray-400 text-xs'>Автовывод</span>
                <div className='w-8 h-4 rounded-full' style={{ background: panel.autoOff ? '#333' : '#53a00d' }} />
                <span className='text-white text-xs'>{panel.autoOff ? '2.50x' : '100x'}</span>
              </div>
            </div>
            <div className='flex gap-2'>
              <div className='flex-1 flex flex-col gap-1'>
                <div className='flex items-center rounded-xl overflow-hidden' style={{ background: '#0d0d0d', border: '1px solid #333' }}>
                  <button onClick={() => panel.setVal(Math.max(1, panel.val - 1))} className='px-3 py-2 text-white font-black text-lg' style={{ background: '#333' }}>−</button>
                  <span className='flex-1 text-center text-white font-black text-xl'>{panel.val}</span>
                  <button onClick={() => panel.setVal(panel.val + 1)} className='px-3 py-2 text-white font-black text-lg' style={{ background: '#333' }}>+</button>
                </div>
                <div className='grid grid-cols-4 gap-1'>
                  {panel.presets.map(p => (
                    <button key={p} onClick={() => panel.setVal(p)} className='py-1 rounded-lg text-white font-bold text-xs' style={{ background: panel.val === p ? '#53a00d' : '#2a2a2a', border: '1px solid #444' }}>{p}</button>
                  ))}
                </div>
              </div>
              <button className='flex-1 rounded-xl font-black text-white flex flex-col items-center justify-center active:scale-95' style={{ background: 'linear-gradient(180deg,#5ab82a,#3a8a10)', border: '1.5px solid #2a6a08', boxShadow: '0 3px 0 #1a4a04' }}>
                <span className='text-lg'>Ставка</span>
                <span className='text-xs opacity-80'>{panel.val} {panel.label}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Mines sub-page ─────────────────────────────────────────────────
const MinesGame = ({ onBack }) => {
  const [betAmount, setBetAmount] = useState(179);
  const [bombs, setBombs] = useState(3);
  const grid = Array(25).fill(null).map((_, i) => {
    if (i === 4) return 'coin';
    if (i === 6) return 'fog';
    if (i === 14) return 'coin';
    if (i === 19) return 'coin';
    return 'hidden';
  });
  const multipliers = [1.11, 1.27, 1.46, 1.69, 1.97, 2.32, 2.74];

  return (
    <div className='flex flex-col flex-1 overflow-hidden'>
      {/* Title */}
      <div className='flex items-center justify-between px-3 py-2 flex-shrink-0' style={{ background: 'linear-gradient(180deg,#c8c8c8,#a0a0a0)' }}>
        <button onClick={onBack} className='text-black font-bold text-sm'>← Назад</button>
        <span className='font-black text-black text-lg'>FOG x MINES</span>
        <div />
      </div>

      <div className='flex gap-2 px-2 pt-2 flex-shrink-0'>
        <div className='flex items-center gap-2 px-3 py-1.5 rounded-xl' style={{ background: '#cc2020', border: '1.5px solid #880000' }}>
          <span className='text-xl'>💣</span>
          <span className='text-white font-black text-xl'>{bombs}</span>
        </div>
        <div className='flex-1 flex items-center gap-1.5 px-3 py-1.5 rounded-xl' style={{ background: 'linear-gradient(90deg,#3a8a10,#2a6a08)', border: '1.5px solid #1a4a04' }}>
          <span className='text-lg'>🎰</span>
          <div><p className='text-white text-xs font-bold uppercase leading-none'>ФИШКИ</p><p className='text-white font-black text-lg leading-none'>34508</p></div>
          <button className='ml-auto w-7 h-7 rounded-lg text-white font-black flex items-center justify-center' style={{ background: '#1a5a08', border: '1px solid #fff' }}>+</button>
        </div>
      </div>

      {/* Grid */}
      <div className='grid grid-cols-5 gap-1 px-2 pt-2 flex-shrink-0'>
        {grid.map((cell, i) => (
          <div key={i} className='rounded-xl flex items-center justify-center' style={{ aspectRatio: '1', background: cell === 'hidden' ? 'linear-gradient(180deg,#444,#2a2a2a)' : cell === 'coin' ? 'linear-gradient(180deg,#1a1a1a,#0d0d0d)' : 'linear-gradient(180deg,#1a1a1a,#0d0d0d)', border: '1.5px solid #555', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)' }}>
            {cell === 'coin' && <span className='text-2xl'>🎰</span>}
            {cell === 'fog' && <span className='text-2xl'>👻</span>}
          </div>
        ))}
      </div>

      {/* Multiplier bar */}
      <div className='flex gap-1 px-2 pt-2 overflow-x-auto flex-shrink-0'>
        {multipliers.map((m, i) => (
          <div key={i} className='flex-shrink-0 flex flex-col items-center rounded-xl px-2 py-1' style={{ background: '#1a1a1a', border: '1px solid #333', minWidth: '44px' }}>
            <span className='text-gray-400 text-xs'>{i + 1}</span>
            <span className='text-yellow-300 font-bold text-xs'>x{m}</span>
          </div>
        ))}
      </div>

      {/* Bet controls */}
      <div className='px-2 pt-2 flex-shrink-0'>
        <div className='rounded-xl p-2' style={{ background: '#1a1a1a', border: '1px solid #333' }}>
          <div className='flex gap-2 items-center mb-1.5'>
            <div className='flex items-center rounded-xl overflow-hidden' style={{ background: '#0d0d0d', border: '1px solid #333' }}>
              <button className='px-3 py-2 text-white font-black' style={{ background: '#333' }}>−</button>
              <span className='px-4 text-white font-black text-xl'>{betAmount}</span>
              <button className='px-3 py-2 text-white font-black' style={{ background: '#333' }}>+</button>
            </div>
            <button className='flex-1 py-3 rounded-xl font-black text-white text-lg active:scale-95' style={{ background: 'linear-gradient(180deg,#5ab82a,#3a8a10)', border: '1.5px solid #2a6a08', boxShadow: '0 3px 0 #1a4a04' }}>
              Ставка<br /><span className='text-xs font-normal'>{betAmount} Фишек</span>
            </button>
          </div>
          <div className='grid grid-cols-4 gap-1'>
            {[1, 5, 20, 100].map(p => (
              <button key={p} onClick={() => setBetAmount(p)} className='py-1 rounded-lg text-white font-bold text-sm' style={{ background: betAmount === p ? '#53a00d' : '#2a2a2a', border: '1px solid #444' }}>{p}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Bomb count */}
      <div className='px-2 pt-2 pb-2 flex-shrink-0'>
        <div className='rounded-xl p-2' style={{ background: '#1a1a1a', border: '1px solid #333' }}>
          <p className='text-white font-bold text-sm mb-1.5'>Количество бомб</p>
          <div className='flex gap-2'>
            {[2, 3, 5, 7].map(b => (
              <button key={b} onClick={() => setBombs(b)} className='flex-1 py-2 rounded-xl font-black text-white text-base' style={{ background: bombs === b ? 'linear-gradient(180deg,#666,#444)' : '#2a2a2a', border: bombs === b ? '1.5px solid #fff' : '1px solid #444' }}>{b}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main Games page ─────────────────────────────────────────────────
const GamesPage = () => {
  const [currentGame, setCurrentGame] = useState(null); // null | 'aviator' | 'mines'

  if (currentGame === 'aviator') return (
    <div className='w-full flex flex-col' style={{ maxWidth: '430px', margin: '0 auto', height: '100dvh', overflow: 'hidden', background: '#0a0a0a' }}>
      <AviatorGame onBack={() => setCurrentGame(null)} />
    </div>
  );

  if (currentGame === 'mines') return (
    <div className='w-full flex flex-col' style={{ maxWidth: '430px', margin: '0 auto', height: '100dvh', overflow: 'hidden', background: '#111' }}>
      <MinesGame onBack={() => setCurrentGame(null)} />
    </div>
  );

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
      <div className='flex flex-col items-center pt-2 pb-1 flex-shrink-0' style={{ background: 'linear-gradient(180deg,#c8c8c8,#a0a0a0)' }}>
        <span className='font-black text-black uppercase tracking-widest' style={{ fontSize: 'clamp(9px,2.8vw,13px)' }}>DRUN FAMILY</span>
        <div className='flex items-center w-full px-4 my-0.5'>
          <div className='flex-1 h-px' style={{ background: 'linear-gradient(90deg,transparent,#000)' }} />
          <span className='font-bold mx-2 uppercase text-black' style={{ fontSize: 'clamp(7px,1.8vw,9px)', letterSpacing: '0.3em' }}>GAME</span>
          <div className='flex-1 h-px' style={{ background: 'linear-gradient(90deg,#000,transparent)' }} />
        </div>
        <span className='font-black text-gray-300 uppercase' style={{ fontSize: 'clamp(22px,8vw,32px)', letterSpacing: '0.15em', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>ИГРЫ</span>
      </div>

      <div className='flex-1 overflow-y-auto pb-20 px-2 pt-2'>
        {/* Balances */}
        <div className='flex gap-2 mb-3'>
          <div className='flex-1 flex items-center gap-1.5 px-3 py-2 rounded-xl' style={{ background: 'linear-gradient(90deg,#f0c020,#d4a000)', border: '1.5px solid #8a6000' }}>
            <span>🪙</span><div><p className='text-black text-xs font-bold leading-none'>USDT</p><p className='text-black font-black text-xl leading-none'>32.24</p></div>
          </div>
          <div className='flex-1 flex items-center gap-1.5 px-3 py-2 rounded-xl' style={{ background: 'linear-gradient(90deg,#3a8a10,#2a6a08)', border: '1.5px solid #1a4a04' }}>
            <span>🎰</span><div><p className='text-white text-xs font-bold leading-none'>ФИШКИ</p><p className='text-white font-black text-xl leading-none'>34508</p></div>
            <button className='ml-auto w-7 h-7 rounded-lg text-white font-black text-lg flex items-center justify-center' style={{ background: '#1a5a08', border: '1px solid #fff' }}>+</button>
          </div>
        </div>

        {/* Game cards */}
        {[
          { id: 'slots', label: 'Бурмалда', desc: 'Старые добрые слоты с огромным заработком и бесплатными вращениями!', icon: '🎰', bg: 'linear-gradient(135deg,#3a2a10,#201808)', border: '#c8a020', btnText: 'ИГРАТЬ' },
          { id: 'aviator', label: 'Самолетик Бурмалдотик', desc: 'Подними свои USDT и Фишки в небеса вместе с частным самолетом мела!', icon: '✈️', bg: 'linear-gradient(135deg,#1a1a3a,#0d0d20)', border: '#3a3a8a', btnText: 'ИГРАТЬ' },
          { id: 'mines', label: 'FOG mines', desc: 'Ищи Фишки в одной из многоэтажек Мурино, только не наткнись на Фога!', icon: '💣', bg: 'linear-gradient(135deg,#2a2a2a,#1a1a1a)', border: '#555', btnText: 'ИГРАТЬ' },
        ].map(game => (
          <div key={game.id} className='flex rounded-2xl overflow-hidden mb-3' style={{ background: game.bg, border: `1.5px solid ${game.border}` }}>
            {(game.id === 'aviator' || game.id === 'mines') && (
              <div className='w-28 flex-shrink-0 flex items-center justify-center text-6xl' style={{ background: 'rgba(0,0,0,0.3)' }}>{game.icon}</div>
            )}
            <div className='flex-1 p-3'>
              {game.id === 'slots' && <div className='flex gap-3 items-center mb-2'><span className='text-5xl'>{game.icon}</span><span className='text-yellow-400 font-black text-xl uppercase'>{game.label}</span></div>}
              {game.id !== 'slots' && <p className='text-white font-black text-base'>{game.label}</p>}
              <p className='text-gray-300 text-xs mt-1'>{game.desc}</p>
              <button onClick={() => setCurrentGame(game.id)} className='mt-2 px-6 py-1.5 rounded-xl font-black text-black text-sm active:scale-95' style={{ background: 'linear-gradient(90deg,#f0c020,#d4a000)', border: '1.5px solid #8a6000', boxShadow: '0 2px 0 #6a4000' }}>
                {game.btnText}
              </button>
            </div>
            {game.id === 'slots' && <div className='w-28 flex-shrink-0 flex items-center justify-center text-5xl' style={{ background: 'rgba(0,0,0,0.3)' }}>🃏</div>}
          </div>
        ))}

        {/* Coming soon */}
        <div className='rounded-2xl flex items-center justify-center py-6' style={{ background: 'linear-gradient(180deg,#2a2a2a,#1a1a1a)', border: '1.5px solid #444' }}>
          <span className='text-white font-black text-2xl'>Скоро в игре!</span>
        </div>
      </div>

      <SnackBar activeTab={1} />
    </div>
  );
};

export default GamesPage;
