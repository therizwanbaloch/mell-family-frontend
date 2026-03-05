import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import pageBg from '../assets/page1bg.webp';
import SnackBar from '../components/SnackBar';

const BalancePage = () => {
  const [tab, setTab] = useState('balance');
  const [currency, setCurrency] = useState('usdt');
  const [showHowTo, setShowHowTo] = useState(false);
  const navigate = useNavigate();

  const isUSDT = currency === 'usdt';

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
      <div className='flex flex-col items-center pt-3 pb-2 flex-shrink-0'>
        <span className='font-black text-yellow-400 uppercase tracking-widest' style={{ fontSize: 'clamp(20px,6vw,28px)', textShadow: '0 2px 8px rgba(0,0,0,0.7)' }}>DRUN FAMILY</span>
        <div className='flex items-center w-[80%]'>
          <div className='flex-1 h-px bg-yellow-600 opacity-60' />
          <span className='text-gray-300 text-xs mx-2 tracking-widest'>game</span>
          <div className='flex-1 h-px bg-yellow-600 opacity-60' />
        </div>
      </div>

      {/* Green bottom sheet */}
      <div className='flex-1 mx-2 rounded-2xl overflow-hidden flex flex-col' style={{ background: 'linear-gradient(180deg, #3a7a1a 0%, #2d6010 100%)', border: '1.5px solid #4a9a20' }}>

        {/* Tab switcher */}
        <div className='flex m-2 rounded-xl overflow-hidden' style={{ background: 'rgba(0,0,0,0.2)' }}>
          <button
            onClick={() => setTab('balance')}
            className='flex-1 py-2.5 font-black text-sm transition-all'
            style={{ background: tab === 'balance' ? 'linear-gradient(180deg,#5ab82a,#3a8a10)' : 'transparent', color: '#fff', borderRadius: '10px' }}
          >
            Баланс
          </button>
          <button
            onClick={() => setTab('howto')}
            className='flex-1 py-2.5 font-black text-sm transition-all'
            style={{ background: tab === 'howto' ? 'linear-gradient(180deg,#5ab82a,#3a8a10)' : 'transparent', color: tab === 'howto' ? '#fff' : 'rgba(255,255,255,0.7)', borderRadius: '10px' }}
          >
            Как зарабатывать?
          </button>
        </div>

        {tab === 'balance' && (
          <div className='flex flex-col px-3 gap-3'>
            {/* Currency toggle */}
            <div className='flex rounded-xl overflow-hidden' style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <button
                onClick={() => setCurrency('usdt')}
                className='flex-1 py-2 text-sm font-bold transition-all'
                style={{ background: isUSDT ? 'linear-gradient(180deg,#aaa,#888)' : 'transparent', color: '#fff', borderRadius: '10px' }}
              >
                USDT
              </button>
              <button
                onClick={() => setCurrency('fishki')}
                className='flex-1 py-2 text-sm font-bold transition-all'
                style={{ background: !isUSDT ? 'linear-gradient(180deg,#888,#666)' : 'transparent', color: '#fff', borderRadius: '10px' }}
              >
                Фишки
              </button>
            </div>

            {/* Balance display */}
            <div>
              <p className='text-white font-black text-xl'>Баланс:</p>
              <div className='flex items-center gap-2 mt-1'>
                <span className='font-black text-black' style={{ fontSize: 'clamp(44px,13vw,60px)' }}>{isUSDT ? '32.24' : '34508'}</span>
                <span className='text-3xl'>{isUSDT ? '🪙' : '🎰'}</span>
              </div>
              <div className='flex items-center justify-between mt-1'>
                <p className='text-white font-bold text-sm'>{isUSDT ? 'Осталось 67.76$ до вывода' : 'Вывод доступен!'}</p>
                <div className='flex items-center gap-1 px-2 py-1 rounded-full' style={{ background: 'linear-gradient(180deg,#6ecf20,#4a9a10)', border: '1.5px solid #3a7a08' }}>
                  <span className='text-black font-black text-sm'>{isUSDT ? '100' : '5000'}</span>
                  <span className='text-xs'>🪙</span>
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className='rounded-full overflow-hidden flex' style={{ height: '22px', border: '2px solid rgba(0,0,0,0.3)' }}>
              <div style={{ width: isUSDT ? '32%' : '100%', background: 'linear-gradient(90deg,#cc0000,#aa0000)', borderRadius: '9999px 0 0 9999px' }} />
              <div style={{ flex: 1, background: 'linear-gradient(90deg,#1a4a08,#0d2a04)' }} />
            </div>

            {/* How to withdraw button */}
            <button
              onClick={() => setShowHowTo(!showHowTo)}
              className='w-full py-3 rounded-xl font-black text-white text-base active:scale-95 transition-transform'
              style={{ background: 'linear-gradient(180deg,#5ab82a,#3a8a10)', border: '1.5px solid #2a6a08', boxShadow: '0 3px 0 #1a4a04' }}
            >
              Как вывести деньги? {showHowTo ? '▲' : '▼'}
            </button>

            {showHowTo && (
              <div className='rounded-xl p-3' style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <p className='text-white font-bold text-sm text-center leading-relaxed'>
                  {isUSDT
                    ? 'Когда на балансе будет 100$, появиться возможность вывести деньги на карту или крипто кошелек'
                    : 'Когда на балансе будет 5000 Фишек, появиться возможность вывести деньги на карту или крипто кошелек. 250 Фишек равняются 1 USDT.'}
                </p>
                <p className='text-yellow-300 font-bold text-sm text-center mt-2 italic'>
                  {isUSDT ? 'для вывода средств нужен максимальный уровень всех персонажей' : 'для вывода средств нужен 3 уровень профиля'}
                </p>
              </div>
            )}

            {/* Withdraw button */}
            <button
              className='w-full py-4 rounded-2xl font-black text-black text-xl active:scale-95 transition-transform'
              style={{ background: isUSDT ? 'linear-gradient(180deg,#d0d0d0,#a0a0a0)' : 'linear-gradient(180deg,#f0c020,#d4a000)', border: '2px solid #888', boxShadow: '0 4px 0 #444' }}
            >
              Вывести деньги
            </button>
          </div>
        )}

        {tab === 'howto' && (
          <div className='flex flex-col gap-3 px-3 pb-4'>
            {[
              { icon: '🎰', title: 'Слоты',   desc: 'Шанс на выигрыш USDT, монеты и Casino фишки',              btn: 'Слот',   route: '/page24' },
              { icon: '🏆', title: 'Турниры', desc: 'Бери участие в турнире и получи шанс выиграть много USDT',  btn: 'Турнир', route: '/page8'  },
              { icon: '📦', title: 'Боксы',   desc: 'Покупай боксы и забирай свои USDT, фишки, монеты.',         btn: 'Боксы',  route: '/page20' },
            ].map((item, i) => (
              <div key={i}>
                <div className='flex items-center gap-3 mb-2'>
                  <span className='text-4xl'>{item.icon}</span>
                  <div>
                    <p className='text-white font-black text-xl'>{item.title}</p>
                    <p className='text-white text-sm'>{item.desc}</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate(item.route)}
                  className='w-full py-3 rounded-xl font-black text-black text-base active:scale-95 transition-transform'
                  style={{ background: 'linear-gradient(180deg,#f0c020,#d4a000)', border: '1.5px solid #8a6000', boxShadow: '0 3px 0 #6a4000' }}
                >
                  {item.btn}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <SnackBar />
    </div>
  );
};

export default BalancePage;