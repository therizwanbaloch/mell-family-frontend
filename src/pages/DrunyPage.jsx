import React, { useState } from 'react';
import pageBg from '../assets/page1bg.webp';
import SnackBar from '../components/SnackBar';

const milestones = [0, 5, 10, 25, 50, 100, 200, 500, 1000];
const currentProgress = 650;

const referrals = [
  { name: 'Коля камазаяка', level: 9, perHour: '406.8M', earned: '1.27В', avatar: '🥷' },
  { name: 'zovbi1488',      level: 7, perHour: '18.5M',  earned: '187.5M', avatar: '🔴' },
  { name: 'Ганвест UA',     level: 8, perHour: '12.1M',  earned: '98.2M',  avatar: '😜' },
];

const roadRewards = [
  { req: '3 / 1000', reward: '1 Шнейне бокс',  claimed: true },
  { req: '5 / 1000', reward: '10000 Билетов',   claimed: true },
  { req: '10 / 1000', reward: '50 USDT',        claimed: true },
  { req: '15 / 1000', reward: '1500 Билетов',   claimed: true },
  { req: '20 / 1000', reward: '2000 Билетов',   claimed: true },
  { req: '25 / 1000', reward: '25 Фишек',       claimed: false },
];

const DrunyPage = () => {
  const [showRoad, setShowRoad] = useState(false);

  const progressPct = Math.min((currentProgress / 1000) * 100, 100);

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
      <div className='flex flex-col items-center pt-2 pb-1 flex-shrink-0' style={{ background: 'rgba(0,0,0,0.6)' }}>
        <span className='font-black text-white uppercase tracking-widest' style={{ fontSize: 'clamp(12px,3.5vw,16px)' }}>DRUN FAMILY</span>
        <div className='flex items-center w-[60%]'>
          <div className='flex-1 h-px' style={{ background: 'rgba(255,255,255,0.3)' }} />
          <span className='text-gray-400 text-xs mx-2 tracking-widest'>game</span>
          <div className='flex-1 h-px' style={{ background: 'rgba(255,255,255,0.3)' }} />
        </div>
      </div>

      <div className='flex-1 overflow-y-auto pb-20'>
        {/* Hero image */}
        <div className='relative w-full overflow-hidden' style={{ height: '180px' }}>
          <div className='w-full h-full' style={{ backgroundImage: `url(${pageBg})`, backgroundSize: 'cover', backgroundPosition: 'center top' }} />
          <div className='absolute inset-0' style={{ background: 'linear-gradient(180deg,transparent 40%,rgba(0,0,0,0.7))' }} />
        </div>

        {/* Invite card */}
        <div className='mx-2 -mt-2 rounded-2xl p-3' style={{ background: 'linear-gradient(180deg,#3a3a3a,#2a2a2a)', border: '1.5px solid #555' }}>
          <p className='text-white font-black text-center uppercase tracking-wide text-sm'>ПРИГЛАШАЙ ДРУНОВ И ПОЛУЧАЙ 38% ОТ ИХ ДОХОДА</p>
          <div className='flex gap-2 mt-2'>
            <button className='flex-1 py-2.5 rounded-xl font-black text-white text-sm flex items-center justify-center gap-2 active:scale-95' style={{ background: '#1a1a1a', border: '1.5px solid #fff' }}>
              ПРИГЛАСИТЬ ДРУНА 👤+
            </button>
            <button className='px-4 py-2.5 rounded-xl font-black text-white text-lg active:scale-95' style={{ background: '#1a1a1a', border: '1.5px solid #fff' }}>
              🔗
            </button>
          </div>
        </div>

        {/* DRUN ROAD card */}
        <div className='mx-2 mt-2 rounded-2xl p-3' style={{ background: 'linear-gradient(180deg,#3a3a3a,#2a2a2a)', border: '1.5px solid #555' }}>
          <button className='w-full flex items-center justify-between' onClick={() => setShowRoad(!showRoad)}>
            <span className='font-black text-white uppercase' style={{ fontSize: 'clamp(14px,4.5vw,20px)', letterSpacing: '0.1em' }}>DRUN ROAD 1000</span>
          </button>
          <p className='text-gray-300 text-xs mt-1 uppercase tracking-widest'>ПРИГЛАШАЙ БОЛЬШЕ, ПОЛУЧАЙ БОЛЬШЕ</p>

          {/* Progress bar with milestones */}
          <div className='mt-2 relative'>
            <div className='rounded-full overflow-hidden flex' style={{ height: '10px' }}>
              <div style={{ width: `${progressPct}%`, background: 'linear-gradient(90deg,#b58030,#53a00d)' }} />
              <div style={{ flex: 1, background: '#1a1a1a' }} />
            </div>
            <div className='flex justify-between mt-1'>
              {milestones.map(m => (
                <span key={m} className='text-gray-400 font-bold' style={{ fontSize: '8px' }}>{m}</span>
              ))}
            </div>
          </div>

          {showRoad && (
            <div className='mt-3 flex flex-col gap-2'>
              <div className='rounded-xl p-2' style={{ background: '#1a1a1a', border: '1px solid #333' }}>
                <p className='text-white text-xs text-center leading-relaxed'>Здесь ты можешь получить огромные награды просто приглашая рефералов. Каждый уровень приглашенных тобой друзей – очко в DRUN ROAD 1000.</p>
              </div>
              {roadRewards.map((r, i) => (
                <div key={i} className='flex items-center justify-between px-3 py-2 rounded-xl' style={{ background: '#1a1a1a', border: '1px solid #333' }}>
                  <div>
                    <p className='text-gray-400 text-xs'>{r.req}</p>
                    <p className='text-white font-bold text-sm'>{r.reward}</p>
                  </div>
                  <button className='px-3 py-1.5 rounded-xl font-bold text-sm' style={{ background: r.claimed ? 'linear-gradient(180deg,#888,#666)' : 'linear-gradient(180deg,#f0c020,#d4a000)', color: r.claimed ? '#fff' : '#000', border: '1px solid #444' }}>
                    {r.claimed ? 'Получено' : 'Получить'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Referrals */}
        <div className='mx-2 mt-2'>
          <p className='text-white font-black text-lg text-center mb-2'>Твои рефералы</p>

          {/* Total earned */}
          <div className='rounded-2xl px-4 py-3 flex items-center justify-between mb-2' style={{ background: 'linear-gradient(180deg,#2a2a2a,#1a1a1a)', border: '1.5px solid #444' }}>
            <div>
              <p className='text-white font-bold text-sm'>Друны заработали:</p>
              <div className='flex items-center gap-1'><span className='text-yellow-400 font-black text-2xl'>3.15В</span><span className='text-xl'>🪙</span></div>
            </div>
            <button className='px-4 py-2 rounded-xl font-black text-black active:scale-95' style={{ background: 'linear-gradient(180deg,#f0c020,#d4a000)', border: '1.5px solid #8a6000', boxShadow: '0 3px 0 #6a4000' }}>
              забрать
            </button>
          </div>

          {/* Referral list */}
          {referrals.map((r, i) => (
            <div key={i} className='flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1.5' style={{ background: 'linear-gradient(90deg,#2a2a2a,#1a1a1a)', border: '1px solid #444' }}>
              <div className='w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0' style={{ background: '#333', border: '2px solid #555' }}>{r.avatar}</div>
              <div className='flex-1'>
                <div className='flex items-center gap-1'>
                  <span className='text-xs px-1.5 py-0.5 rounded-full font-bold' style={{ background: '#53a00d', color: '#fff' }}>{r.level} lvl</span>
                  <span className='text-white font-bold text-sm'>{r.name}</span>
                </div>
                <p className='text-gray-400 text-xs'>{r.perHour} в час</p>
              </div>
              <span className='text-yellow-300 font-black text-sm'>{r.earned}</span>
            </div>
          ))}
        </div>
      </div>

      <SnackBar activeTab={3} />
    </div>
  );
};

export default DrunyPage;
