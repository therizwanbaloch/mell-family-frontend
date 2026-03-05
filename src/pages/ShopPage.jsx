import React from 'react';
import pageBg from '../assets/page1bg.webp';
import SnackBar from '../components/SnackBar';

const ShopPage = () => {
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
        <span className='font-black text-yellow-400 uppercase' style={{ fontSize: 'clamp(22px,8vw,32px)', letterSpacing: '0.1em', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>МАГАЗИН</span>
      </div>

      <div className='flex-1 overflow-y-auto pb-20'>

        {/* АКЦИИ section */}
        <div className='flex justify-center mt-3'>
          <div className='px-8 py-1 rounded-full font-black text-black uppercase' style={{ background: 'linear-gradient(90deg,#c8a020,#a08010)', border: '1.5px solid #7a6010', fontSize: 'clamp(12px,3.5vw,16px)' }}>
            АКЦИИ
          </div>
        </div>

        <div className='px-2 mt-2 flex flex-col gap-2'>
          {/* PAK DRUNOV */}
          <div className='rounded-2xl overflow-hidden p-3' style={{ background: 'linear-gradient(135deg,#2a6a10,#1a4a08)', border: '1.5px solid #3a8a20' }}>
            <div className='flex gap-2'>
              <div className='flex-1'>
                <p className='text-yellow-400 font-black text-lg uppercase'>ПАК ДРУНОВ</p>
                <p className='text-white text-xs mt-1'>+44% прибыли друнов<br />1111 фишек, 333 FS,<br />222 очка в DRUN ROAD</p>
                <button className='mt-2 px-4 py-1 rounded-full font-black text-black flex items-center gap-1' style={{ background: 'linear-gradient(90deg,#f0c020,#d4a000)', border: '1.5px solid #8a6000' }}>
                  321 ⭐
                </button>
              </div>
              <div className='w-28 h-24 rounded-xl overflow-hidden flex-shrink-0' style={{ background: '#1a1a1a' }}>
                <div className='w-full h-full flex items-center justify-center text-4xl'>🎁</div>
              </div>
            </div>
            <div className='absolute top-2 right-2 px-2 py-0.5 rounded text-xs font-black text-red-500' style={{ background: 'rgba(0,0,0,0.6)' }}>25 USDT В ПОДАРОК</div>
          </div>

          {/* VATAFA + BIZNES */}
          <div className='flex gap-2'>
            <div className='flex-1 rounded-2xl p-3' style={{ background: 'linear-gradient(135deg,#1a1a1a,#0d0d0d)', border: '1.5px solid #53a00d' }}>
              <p className='text-yellow-400 font-black text-sm uppercase'>ВАТАФА ПАК</p>
              <p className='text-white text-xs mt-1'>+20% прибыли за тап, 7 пепе боксов, 77FS, 777 фишек, 77 очков в DRUN ROAD</p>
              <div className='flex items-center gap-1 mt-2'>
                <span className='text-gray-400 line-through text-xs'>777</span>
                <button className='px-3 py-0.5 rounded-full font-black text-black text-sm' style={{ background: 'linear-gradient(90deg,#f0c020,#d4a000)', border: '1px solid #8a6000' }}>249 ⭐</button>
              </div>
            </div>
            <div className='flex-1 rounded-2xl p-3 relative' style={{ background: 'linear-gradient(135deg,#1a2a4a,#0d1a30)', border: '1.5px solid #3a6aa0' }}>
              <div className='absolute -top-2 right-1 px-2 py-0.5 rounded text-xs font-black' style={{ background: '#f0c020', color: '#000' }}>САМОЕ ВЫГОДНОЕ</div>
              <p className='text-yellow-400 font-black text-sm uppercase'>БИЗНЕС ПАК</p>
              <p className='text-white text-xs mt-1'>x12 доход на 6 часов, 6 шнейне боксы, 66 FS, 1666 фишки, 66 пепе боксы, 120 очки DRUN ROAD</p>
              <button className='mt-2 px-3 py-0.5 rounded-full font-black text-black text-sm' style={{ background: 'linear-gradient(90deg,#f0c020,#d4a000)', border: '1px solid #8a6000' }}>666 ⭐</button>
            </div>
          </div>

          {/* VIP PAK */}
          <div className='rounded-2xl p-3 flex gap-3' style={{ background: 'linear-gradient(135deg,#3a2a10,#201808)', border: '1.5px solid #c8a020' }}>
            <div className='flex-1'>
              <p className='text-yellow-400 font-black text-lg'><span className='text-2xl'>VIP</span> БУРМУЛДА ПАК</p>
              <p className='text-white text-xs mt-1'>x2 вся прибыль на 6 дней, 61666 билетов в начале каждого турнира, 166 очков DRUN ROAD, 6166 фишек, 16 шнейне боксов</p>
              <button className='mt-2 px-4 py-1 rounded-full font-black text-black flex items-center gap-1' style={{ background: 'linear-gradient(90deg,#f0c020,#d4a000)', border: '1.5px solid #8a6000' }}>
                1666 ⭐
              </button>
            </div>
            <div className='w-20 flex-shrink-0 flex items-center justify-center text-5xl'>👑</div>
          </div>
        </div>

        {/* БОКСЫ section */}
        <div className='flex justify-center mt-4'>
          <div className='px-8 py-1 rounded-full font-black text-black uppercase' style={{ background: 'linear-gradient(90deg,#c8a020,#a08010)', border: '1.5px solid #7a6010', fontSize: 'clamp(12px,3.5vw,16px)' }}>
            БОКСЫ
          </div>
        </div>

        <div className='grid grid-cols-3 gap-2 px-2 mt-2'>
          {[
            { name: 'Фа Бокс',     price: '10',  bg: '#2a2a2a', border: '#555',   icon: '📦' },
            { name: 'Пепе Бокс',   price: '40',  bg: '#1a3a10', border: '#3a8a20', icon: '🎁' },
            { name: 'Шнейне Бокс', price: '100', bg: '#3a2a10', border: '#c8a020', icon: '💎' },
          ].map((box, i) => (
            <div key={i} className='rounded-2xl flex flex-col items-center py-3 px-1' style={{ background: `linear-gradient(180deg,${box.bg},#111)`, border: `1.5px solid ${box.border}` }}>
              <div className='text-5xl mb-2'>{box.icon}</div>
              <p className='text-white text-xs font-bold text-center'>{box.name}</p>
              <button className='mt-2 px-3 py-1 rounded-full font-black text-black text-sm' style={{ background: 'linear-gradient(90deg,#f0c020,#d4a000)', border: '1px solid #8a6000' }}>
                {box.price} ⭐
              </button>
            </div>
          ))}
        </div>

        {/* ФИШКИ section */}
        <div className='flex justify-center mt-4'>
          <div className='px-8 py-1 rounded-full font-black text-black uppercase' style={{ background: 'linear-gradient(90deg,#c8a020,#a08010)', border: '1.5px solid #7a6010', fontSize: 'clamp(12px,3.5vw,16px)' }}>
            ФИШКИ
          </div>
        </div>
        <div className='grid grid-cols-3 gap-2 px-2 mt-2'>
          {[
            { label: '20 Фишек',    price: '4' },
            { label: '100 Фишек',   price: '19' },
            { label: '500 Фишек',   price: '90' },
            { label: '2000 Фишек',  price: '350' },
            { label: '10000 Фишек', price: '1720' },
            { label: '50000 Фишек', price: '8500' },
          ].map((item, i) => (
            <div key={i} className='rounded-2xl flex flex-col items-center py-3 px-1' style={{ background: 'linear-gradient(180deg,#474747,#272727)', border: '1.5px solid #272727' }}>
              <div className='text-3xl mb-1'>🎰</div>
              <p className='text-white text-xs text-center'>{item.label}</p>
              <button className='mt-1.5 px-3 py-1 rounded-full font-black text-black text-xs' style={{ background: 'linear-gradient(180deg,#d4ac00,#b89200)', border: '1.5px solid #8a6500' }}>
                {item.price} ⭐
              </button>
            </div>
          ))}
        </div>

        {/* БИЛЕТЫ section */}
        <div className='flex justify-center mt-4'>
          <div className='px-8 py-1 rounded-full font-black text-black uppercase' style={{ background: 'linear-gradient(90deg,#c8a020,#a08010)', border: '1.5px solid #7a6010', fontSize: 'clamp(12px,3.5vw,16px)' }}>
            БИЛЕТЫ
          </div>
        </div>
        <div className='grid grid-cols-3 gap-2 px-2 mt-2 mb-4'>
          {[
            { label: '200 Билетов',    price: '4' },
            { label: '1000 Билетов',   price: '19' },
            { label: '5000 Билетов',   price: '90' },
            { label: '20000 Билетов',  price: '350' },
            { label: '100000 Билетов', price: '1720' },
            { label: '500000 Билетов', price: '8500' },
          ].map((item, i) => (
            <div key={i} className='rounded-2xl flex flex-col items-center py-3 px-1' style={{ background: 'linear-gradient(180deg,#52810f,#274920)', border: '1.5px solid #274920' }}>
              <div className='text-3xl mb-1'>🎫</div>
              <p className='text-black text-xs text-center font-bold'>{item.label}</p>
              <button className='mt-1.5 px-3 py-1 rounded-full font-black text-black text-xs' style={{ background: 'linear-gradient(180deg,#d4ac00,#b89200)', border: '1.5px solid #8a6500' }}>
                {item.price} ⭐
              </button>
            </div>
          ))}
        </div>
      </div>

      <SnackBar activeTab={0} />
    </div>
  );
};

export default ShopPage;
