import React, { useState } from 'react';
import pageBg from '../assets/page1bg.webp';
import SnackBar from '../components/SnackBar';

const leaderboard = [
  { rank: 1, name: 'Коля камазаяка 2', level: 9, score: '896 960', avatar: '🥷', color: '#c8a020' },
  { rank: 2, name: 'zovbi1488',         level: 7, score: '245 670', avatar: '🔴', color: '#4a90c0' },
  { rank: 3, name: 'Ганвест UA',        level: 8, score: '123 450', avatar: '😜', color: '#a06020' },
  { rank: 4, name: 'Коля камазаяка 3',  level: 9, score: '96 960',  avatar: '🥷', color: '#555' },
];

const TournamentsPage = () => {
  const [infoModal, setInfoModal] = useState(false);
  const [betModal, setBetModal] = useState(false);
  const [activeTournament, setActiveTournament] = useState('билеты'); // 'билеты' | 'usdt'
  const [betAmount, setBetAmount] = useState(50);

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
        position: 'relative',
      }}
    >
      {/* Header */}
      <div className='flex flex-col items-center pt-3 pb-1 flex-shrink-0'>
        <span className='font-black text-white uppercase tracking-widest' style={{ fontSize: 'clamp(14px,4vw,18px)' }}>DRUN FAMILY</span>
        <div className='flex items-center w-[60%]'>
          <div className='flex-1 h-px' style={{ background: 'rgba(255,255,255,0.4)' }} />
          <span className='text-gray-400 text-xs mx-2 tracking-widest'>game</span>
          <div className='flex-1 h-px' style={{ background: 'rgba(255,255,255,0.4)' }} />
        </div>
      </div>

      {/* Scrollable content */}
      <div className='flex-1 overflow-y-auto pb-20'>

        {/* Hero card */}
        <div className='relative mx-2 rounded-2xl overflow-hidden flex-shrink-0' style={{ height: '220px' }}>
          <div className='absolute inset-0' style={{ background: 'linear-gradient(180deg,#b8860020,#b8860080)', backgroundImage: `url(${pageBg})`, backgroundSize: 'cover' }} />
          {/* Tickets balance top left */}
          <div className='absolute top-2 left-2 flex items-center gap-1.5 px-2 py-1 rounded-lg' style={{ background: '#6e6e6e', border: '1.5px solid #000' }}>
            <span className='text-lg'>🎫</span>
            <div>
              <p className='text-white text-xs font-bold leading-none'>БИЛЕТЫ</p>
              <p className='text-white text-sm font-black leading-none'>123</p>
            </div>
            <button className='ml-1 text-white font-black text-lg'>+</button>
          </div>
          {/* Info top right */}
          <button onClick={() => setInfoModal(true)} className='absolute top-2 right-2 w-8 h-8 rounded-lg flex items-center justify-center' style={{ border: '1.5px solid #d9d9d9', background: 'rgba(0,0,0,0.4)' }}>
            <span className='text-white font-black text-sm'>i</span>
          </button>
          {/* Tournament name bottom */}
          <div className='absolute bottom-2 left-1/2 -translate-x-1/2'>
            <div className='px-6 py-1.5 rounded-full font-black text-black uppercase' style={{ background: 'linear-gradient(180deg,#f0c020,#c89000)', border: '2px solid #7a5000', fontSize: 'clamp(14px,4vw,18px)' }}>
              {activeTournament === 'билеты' ? 'ТУРНИР БИЛЕТОВ' : 'РОЗЫГРЫШ USDT'}
            </div>
          </div>
        </div>

        {/* Timer */}
        <div className='mx-2 mt-2 rounded-xl py-3 flex flex-col items-center' style={{ background: 'linear-gradient(180deg,#1a1a1a,#0d0d0d)', border: '1.5px solid #444' }}>
          <p className='text-white font-black text-sm tracking-widest uppercase opacity-70'>ОСТАЛОСЬ</p>
          <p className='text-white font-black' style={{ fontSize: 'clamp(32px,9vw,42px)', letterSpacing: '0.05em' }}>
            {activeTournament === 'билеты' ? '02:19:54' : '13:19:24:48'}
          </p>
        </div>

        {/* Prize pool */}
        <div className='mx-2 mt-2 rounded-xl py-2 px-4 flex items-center justify-between' style={{ background: 'linear-gradient(180deg,#6a4a10,#4a3008)', border: '1.5px solid #8a6020' }}>
          <span className='text-yellow-300 font-black text-xs tracking-widest uppercase'>ПРИЗОВОЙ ФОНД</span>
          <div className='flex items-center gap-1'>
            <span className='text-lg'>🎫</span>
            <span className='text-yellow-300 font-black'>{activeTournament === 'билеты' ? '5 769 660' : '5 000 USDT'}</span>
          </div>
        </div>

        {/* Leaderboard */}
        <div className='mx-2 mt-2 flex flex-col gap-1.5'>
          {leaderboard.map((p) => (
            <div key={p.rank} className='flex items-center gap-2 px-3 py-2 rounded-xl' style={{ background: 'linear-gradient(90deg,#2a2a2a,#1a1a1a)', border: `1.5px solid ${p.color}44` }}>
              <span className='font-black text-lg w-6 text-center' style={{ color: p.color }}>{p.rank <= 3 ? ['🥇','🥈','🥉'][p.rank-1] : p.rank}</span>
              <div className='w-9 h-9 rounded-full flex items-center justify-center text-xl' style={{ background: '#333', border: `2px solid ${p.color}` }}>{p.avatar}</div>
              <div className='flex-1'>
                <p className='text-xs text-gray-400'>{p.level} lvl</p>
                <p className='text-white font-bold text-sm'>{p.name}</p>
              </div>
              <div className='flex items-center gap-1 px-2 py-1 rounded-full' style={{ background: '#3a3a3a', border: '1px solid #555' }}>
                <span className='text-sm'>🎫</span>
                <span className='text-yellow-300 font-bold text-sm'>{p.score}</span>
              </div>
            </div>
          ))}

          {/* Current user */}
          <div className='flex items-center gap-2 px-3 py-2 rounded-xl' style={{ background: 'linear-gradient(90deg,#1a2a1a,#0d1a0d)', border: '1.5px solid #3a6a20' }}>
            <span className='font-black text-lg w-6 text-center text-gray-400'>916</span>
            <div className='w-9 h-9 rounded-full flex items-center justify-center text-xl' style={{ background: '#333', border: '2px solid #3a6a20' }}>🥷</div>
            <div className='flex-1'>
              <p className='text-white font-bold text-sm'>ВЫ Коля камазаяка</p>
            </div>
            <div className='flex items-center gap-1 px-2 py-1 rounded-full' style={{ background: '#3a3a3a', border: '1px solid #555' }}>
              <span className='text-sm'>🎫</span>
              <span className='text-yellow-300 font-bold text-sm'>10</span>
            </div>
          </div>
        </div>

        {/* Bet button */}
        <div className='mx-2 mt-3'>
          <button onClick={() => setBetModal(true)} className='w-full py-4 rounded-2xl font-black text-black text-xl active:scale-95' style={{ background: 'linear-gradient(180deg,#f0c020,#d4a000)', border: '2px solid #8a6000', boxShadow: '0 4px 0 #6a4000' }}>
            Сделать ставку
          </button>
        </div>
      </div>

      {/* Bet modal */}
      {betModal && (
        <div className='absolute inset-0 flex flex-col justify-end' style={{ background: 'rgba(0,0,0,0.5)', zIndex: 40 }}>
          <div className='rounded-t-3xl p-4 flex flex-col gap-3' style={{ background: 'linear-gradient(180deg,#2a2a2a,#1a1a1a)', border: '1.5px solid #555' }}>
            <div className='flex justify-between items-center'>
              <p className='text-white font-black text-lg'>Ставка</p>
              <button onClick={() => setBetModal(false)} className='px-3 py-1 rounded-lg text-sm font-bold' style={{ background: '#444', color: '#fff', border: '1px solid #666' }}>✕ Закрыть</button>
            </div>

            {/* Current bet / rank */}
            <div className='flex gap-2'>
              <div className='flex-1 rounded-xl p-3 text-center' style={{ background: '#1a1a1a', border: '1px solid #333' }}>
                <p className='text-gray-400 text-xs'>Текущая ставка</p>
                <div className='flex items-center justify-center gap-1'><span>🎫</span><span className='text-yellow-300 font-black text-xl'>10</span></div>
              </div>
              <div className='flex-1 rounded-xl p-3 text-center' style={{ background: '#1a1a1a', border: '1px solid #333' }}>
                <p className='text-gray-400 text-xs'>Место в рейтинге</p>
                <p className='text-white font-black text-xl'>916</p>
              </div>
            </div>

            {/* Amount selector */}
            <div className='flex items-center gap-2 rounded-xl p-2' style={{ background: '#1a1a1a', border: '1px solid #333' }}>
              <button onClick={() => setBetAmount(Math.max(1, betAmount - 10))} className='w-9 h-9 rounded-full font-black text-white text-xl flex items-center justify-center' style={{ background: '#444' }}>−</button>
              <span className='flex-1 text-center text-white font-black text-2xl'>{betAmount}</span>
              <button onClick={() => setBetAmount(betAmount + 10)} className='w-9 h-9 rounded-full font-black text-white text-xl flex items-center justify-center' style={{ background: '#444' }}>+</button>
            </div>
            <div className='grid grid-cols-4 gap-2'>
              {[10, 100, 1000, 10000].map(v => (
                <button key={v} onClick={() => setBetAmount(v)} className='py-2 rounded-xl font-bold text-white text-sm' style={{ background: betAmount === v ? 'linear-gradient(180deg,#5ab82a,#3a8a10)' : '#333', border: betAmount === v ? '1px solid #3a8a10' : '1px solid #444' }}>{v}</button>
              ))}
            </div>

            <button className='w-full py-3 rounded-2xl font-black text-white text-base active:scale-95' style={{ background: 'linear-gradient(180deg,#5ab82a,#3a8a10)', border: '1.5px solid #2a6a08', boxShadow: '0 3px 0 #1a4a04' }}>
              Ставка<br /><span className='text-sm font-normal'>{betAmount} Билетов</span>
            </button>
          </div>
        </div>
      )}

      {/* Info modal */}
      {infoModal && (
        <div className='absolute inset-0 flex flex-col justify-end' style={{ background: 'rgba(0,0,0,0.5)', zIndex: 40 }}>
          <div className='rounded-t-3xl p-4 flex flex-col gap-3' style={{ background: 'linear-gradient(180deg,#2a2a2a,#1a1a1a)', border: '1.5px solid #555' }}>
            <div className='flex justify-end'>
              <button onClick={() => setInfoModal(false)} className='px-3 py-1 rounded-lg text-sm font-bold' style={{ background: '#444', color: '#fff', border: '1px solid #666' }}>✕ Закрыть</button>
            </div>
            <div className='rounded-xl overflow-hidden' style={{ height: '150px', background: '#333' }}>
              <div className='w-full h-full' style={{ backgroundImage: `url(${pageBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
            </div>
            <p className='text-white font-bold text-center text-sm leading-relaxed'>Ставь билеты и получи шанс стать самым богатым в DRUN FAMILY GAME!</p>
            <div className='rounded-xl py-3 flex flex-col items-center' style={{ background: 'linear-gradient(180deg,#1a1a1a,#0d0d0d)', border: '1.5px solid #444' }}>
              <p className='text-white font-black text-sm tracking-widest uppercase opacity-70'>ОСТАЛОСЬ</p>
              <p className='text-white font-black text-4xl'>03:00:00</p>
            </div>
            <p className='text-white text-center text-sm'>Турнир проходит раз в три часа</p>
            <div className='rounded-xl p-3' style={{ background: '#1a1a1a', border: '1px solid #333' }}>
              <p className='text-white font-bold text-sm text-center leading-relaxed'>Ставки может сделать каждый, но победит только друн, который поставит больше всех – он и заберет все билеты.</p>
            </div>
          </div>
        </div>
      )}

      <SnackBar activeTab={1} />
    </div>
  );
};

export default TournamentsPage;
