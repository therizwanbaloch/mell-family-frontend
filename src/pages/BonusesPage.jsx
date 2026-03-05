import React from 'react';
import pageBg from '../assets/page1bg.webp';
import SnackBar from '../components/SnackBar';

const dailyDays = [
  { day: 1, reward: '610В', sub: 'ПРИБЫЛЬ ЗА 6 ЧАСОВ', desc: 'Х10 вся прибыль на 15 минут', claimed: false },
  { day: 2, reward: '813В', sub: 'ПРИБЫЛЬ ЗА 8 ЧАСОВ', desc: '2 Фа Бокса, 500 Билетов', claimed: true, active: true },
  { day: 3, reward: '1.02T', sub: 'ПРИБЫЛЬ ЗА 10 ЧАСОВ', desc: 'Х15 вся прибыль на 30 минут', claimed: false },
  { day: 4, reward: '1.22T', sub: 'ПРИБЫЛЬ ЗА 12 ЧАСОВ', desc: '1 Пепе Бокс, 1000 Билетов, 3 Фишки', claimed: false },
  { day: 5, reward: '1.42T', sub: 'ПРИБЫЛЬ ЗА 14 ЧАСОВ', desc: 'Х20 вся прибыль на 45 минут', claimed: false },
  { day: 6, reward: '1.63T', sub: 'ПРИБЫЛЬ ЗА 16 ЧАСОВ', desc: '2 Пепе Бокса, 1500 Билетов', claimed: false },
];

const tasks = [
  { icon: '📱', title: 'Подпишись на шляпбет', reward: '+100m', done: false },
  { icon: '📱', title: 'Подпишись на шляпбет', reward: '+100m', done: false },
  { icon: '📱', title: 'Подпишись на шляпбет', reward: '+100m', done: true },
];

const BonusesPage = () => {
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
        <span className='font-black text-green-400 uppercase' style={{ fontSize: 'clamp(22px,8vw,32px)', letterSpacing: '0.1em', textShadow: '0 0 12px rgba(83,160,13,0.6)' }}>БОНУСЫ</span>
      </div>

      <div className='flex-1 overflow-y-auto pb-20 px-2'>

        {/* BETON special bonus */}
        <p className='text-white font-black text-base text-center mt-3'>Особенные бонусы</p>
        <div className='mt-2 rounded-2xl p-3' style={{ background: 'linear-gradient(135deg,#0a1a0a,#051005)', border: '2px solid #b8e010' }}>
          <p className='font-black text-center uppercase' style={{ fontSize: 'clamp(28px,9vw,40px)', color: '#b8e010', letterSpacing: '0.1em', textShadow: '0 0 12px rgba(184,224,16,0.5)' }}>BETON</p>
          <p className='text-green-400 font-black text-center uppercase text-base'>ДАЕТ МЕГА БОНУС +100FS</p>
          <div className='flex items-center gap-2 mt-1'>
            <span className='text-yellow-400 font-black text-xl'>1В</span>
            <span className='text-lg'>🪙</span>
            <span className='text-white font-bold text-sm'>За подписку на канал BETON</span>
          </div>
          <div className='flex items-center gap-2 mt-0.5'>
            <span className='text-yellow-400 font-black text-xl'>100В</span>
            <span className='text-lg'>🪙</span>
            <span className='text-white font-bold text-sm'>За первый депозит</span>
          </div>
        </div>

        {/* Daily bonus */}
        <div className='mt-3 rounded-2xl p-3' style={{ background: 'linear-gradient(180deg,#3a2a10,#201808)', border: '1.5px solid #8a6020' }}>
          <div className='flex justify-center mb-2'>
            <div className='px-4 py-0.5 rounded-full font-black text-black uppercase text-xs' style={{ background: 'linear-gradient(90deg,#f0c020,#c89000)', border: '1px solid #8a6000' }}>ЕЖЕДНЕВНЫЙ БОНУС</div>
          </div>
          <p className='text-white font-bold text-sm text-center mb-2'>Заходи каждый день и получай награду</p>
          <div className='grid grid-cols-3 gap-1.5'>
            {dailyDays.map(d => (
              <div key={d.day} className='rounded-xl p-2 flex flex-col items-center' style={{ background: d.active ? 'linear-gradient(180deg,#3a7a10,#1a5008)' : 'linear-gradient(180deg,#2a2a2a,#1a1a1a)', border: d.active ? '2px solid #6ecf20' : '1px solid #444' }}>
                <span className='text-xs text-gray-400 font-bold'>ДЕНЬ {d.day}</span>
                <span className='font-black text-yellow-300 text-base'>{d.reward}</span>
                <span className='text-xs text-gray-300 text-center leading-tight'>🪙</span>
                <p className='text-xs text-center text-gray-300 mt-0.5 leading-tight' style={{ fontSize: '9px' }}>{d.desc}</p>
              </div>
            ))}
          </div>
          {/* Day 7 special */}
          <div className='mt-1.5 rounded-xl p-2 flex items-center gap-3' style={{ background: 'linear-gradient(180deg,#2a2a2a,#1a1a1a)', border: '1px solid #444' }}>
            <div>
              <span className='text-xs text-gray-400 font-bold'>ДЕНЬ 7</span>
              <div className='flex items-center gap-1'><span className='font-black text-yellow-300 text-xl'>2.44T</span><span>🪙</span></div>
              <span className='text-xs text-gray-400'>ПРИБЫЛЬ ЗА 24 ЧАСА</span>
            </div>
            <p className='flex-1 text-xs text-gray-300 leading-tight'>Х25 вся прибыль на 90 минут, 1 Шнейне Бокс, 2000 Билетов, 30 Фишек</p>
          </div>
        </div>

        {/* Tasks */}
        <p className='text-white font-black text-xl text-center mt-3'>Задания</p>
        <div className='flex flex-col gap-2 mt-2'>
          {tasks.map((task, i) => (
            <div key={i} className='flex items-center gap-3 px-3 py-2.5 rounded-2xl' style={{ background: task.done ? 'linear-gradient(90deg,#1a3a10,#0d2008)' : 'linear-gradient(90deg,#2a2a2a,#1a1a1a)', border: task.done ? '1.5px solid #3a7a20' : '1.5px solid #444' }}>
              <div className='w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-2xl' style={{ background: '#333' }}>{task.icon}</div>
              <div className='flex-1'>
                <p className='text-white font-bold text-base'>{task.title}</p>
                <div className='flex items-center gap-1'><span className='text-sm'>🪙</span><span className='text-yellow-300 font-bold text-sm'>{task.reward}</span></div>
              </div>
              <span className='text-white font-black text-xl'>{task.done ? '✓' : '>'}</span>
            </div>
          ))}
        </div>
      </div>

      <SnackBar activeTab={4} />
    </div>
  );
};

export default BonusesPage;
