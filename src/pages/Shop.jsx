import React from 'react';
import shopBg from '../assets/page1bg.webp';
import shopItem1 from '../assets/ShopCardImages/item1.webp';
import shopItem2 from '../assets/ShopCardImages/item2.webp';
import shopItem3 from '../assets/ShopCardImages/item3.webp';
import shopItem4 from '../assets/ShopCardImages/item4.webp';
import shopItem5 from '../assets/ShopCardImages/item5.webp';
import shopItem6 from '../assets/ShopCardImages/item6.webp';
import greenItem1 from '../assets/ShopCardImages/greenItem1.webp';
import greenItem2 from '../assets/ShopCardImages/greenItem2.webp';
import greenItem3 from '../assets/ShopCardImages/greenItem3.webp';
import greenItem4 from '../assets/ShopCardImages/greenItem4.webp';
import greenItem5 from '../assets/ShopCardImages/greenItem5.webp';
import greenItem6 from '../assets/ShopCardImages/greenItem6.webp';
import ShopCard from '../components/ShopingCardGrey';
import ShopCardGreen from '../components/ShopCardGreen';
import SnackBar from '../components/SnackBar';

const Shop = () => {
  const greyItems = [
    { image: shopItem1, label: '20 Фишек',    price: '4',    emoji: '⭐', objectPosition: 'center' },
    { image: shopItem2, label: '100 Фишек',   price: '19',   emoji: '⭐', objectPosition: 'center' },
    { image: shopItem3, label: '500 Фишек',   price: '90',   emoji: '⭐', objectPosition: 'center' },
    { image: shopItem4, label: '2000 Фишек',  price: '350',  emoji: '⭐', objectPosition: 'center' },
    { image: shopItem5, label: '10000 Фишек', price: '1720', emoji: '⭐', objectPosition: 'top' },
    { image: shopItem6, label: '50000 Фишек', price: '8500', emoji: '⭐', objectPosition: 'top' },
  ];

  const greenItems = [
    { image: greenItem1, label: '20 Билетов',    price: '4',    objectPosition: 'center' },
    { image: greenItem2, label: '100 Билетов',   price: '19',   objectPosition: 'center' },
    { image: greenItem3, label: '500 Билетов',   price: '90',   objectPosition: 'center' },
    { image: greenItem4, label: '2000 Билетов',  price: '350',  objectPosition: 'center' },
    { image: greenItem5, label: '10000 Билетов', price: '1720', objectPosition: 'top' },
    { image: greenItem6, label: '50000 Билетов', price: '8500', objectPosition: 'top' },
  ];

  return (
    <div
      className='w-full'
      style={{
        backgroundImage: `url(${shopBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        maxWidth: '430px',
        margin: '0 auto',
        height: '100dvh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header Card */}
      <div
        className='w-[92%] mx-auto mt-4 px-4 py-1.5 rounded-2xl flex flex-col items-center flex-shrink-0'
        style={{
          background: 'linear-gradient(180deg, #7a7a7a 0%, #565656 100%)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
        }}
      >
        {/* DRUN FAMILY — smaller + black */}
        <h1
          className='font-extrabold uppercase'
          style={{
            fontSize: 'clamp(9px, 2.8vw, 13px)',
            letterSpacing: '0.2em',
            color: '#000000',
          }}
        >
          DRUN FAMILY
        </h1>

        {/* GAME divider — black */}
        <div className='flex items-center w-full my-0.5'>
          <div className='flex-1 h-px' style={{ background: 'linear-gradient(90deg, transparent, #000)' }} />
          <span
            className='font-bold mx-2 uppercase'
            style={{
              fontSize: 'clamp(7px, 1.8vw, 9px)',
              letterSpacing: '0.3em',
              color: '#000000',
            }}
          >
            GAME
          </span>
          <div className='flex-1 h-px' style={{ background: 'linear-gradient(90deg, #000, transparent)' }} />
        </div>

        {/* МАГАЗИН */}
        <h2
          className='font-black uppercase'
          style={{
            fontSize: 'clamp(26px, 9vw, 38px)',
            color: '#deba00',
            letterSpacing: '0.15em',
            textShadow: '0 0 12px rgba(222,186,0,0.4), 0 1px 0 #af8700, 0 3px 6px rgba(0,0,0,0.5)',
            WebkitTextStroke: '1px #af8700',
          }}
        >
          Магазин
        </h2>
      </div>

      {/* Scrollable body */}
      <div className='flex-1 overflow-y-auto pb-24'>

        {/* — ФИШКИ SECTION — */}
        <div className='flex justify-center mt-4'>
          <button
            className='font-black rounded-xl active:scale-95 transition-transform'
            style={{
              paddingTop: '3px',
              paddingBottom: '3px',
              paddingLeft: '52px',
              paddingRight: '52px',
              background: 'linear-gradient(90deg, #ffc500 0%, #ffad31 100%)',
              border: '2px solid #744500',
              color: '#3a2200',
              fontSize: 'clamp(16px, 5.5vw, 20px)',
              boxShadow: '0 3px 0 #4a2c00, 0 5px 10px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.3)',
              letterSpacing: '0.05em',
              textAlign: 'center',
            }}
          >
            Фишки
          </button>
        </div>

        <div className='grid grid-cols-3 gap-2 px-3 mt-4'>
          {greyItems.map((item, index) => (
            <ShopCard
              key={index}
              image={item.image}
              label={item.label}
              price={item.price}
              emoji={item.emoji}
              objectPosition={item.objectPosition}
            />
          ))}
        </div>

        {/* — БИЛЕТЫ SECTION — */}
        <div className='flex justify-center mt-6'>
          <button
            className='font-black rounded-xl active:scale-95 transition-transform'
            style={{
              paddingTop: '3px',
              paddingBottom: '3px',
              paddingLeft: '52px',
              paddingRight: '52px',
              background: 'linear-gradient(90deg, #ffc500 0%, #ffad31 100%)',
              border: '2px solid #744500',
              color: '#e9ebec',
              fontSize: 'clamp(16px, 5.5vw, 20px)',
              boxShadow: '0 3px 0 #4a2c00, 0 5px 10px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.3)',
              letterSpacing: '0.05em',
              textAlign: 'center',
            }}
          >
            Билеты
          </button>
        </div>

        <div className='grid grid-cols-3 gap-2 px-3 mt-4'>
          {greenItems.map((item, index) => (
            <ShopCardGreen
              key={index}
              image={item.image}
              label={item.label}
              price={item.price}
              objectPosition={item.objectPosition}
            />
          ))}
        </div>

      </div>

      <SnackBar />

    </div>
  );
};

export default Shop;