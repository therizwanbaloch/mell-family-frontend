import React from 'react';

const ShopCardGreen = ({ image, label, price, objectPosition = 'center' }) => (
  <div
    className='flex flex-col items-center rounded-xl overflow-hidden'
    style={{
      backgroundColor: '#52810f',
      border: '1.5px solid #274920',
      boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
      width: '100%',
      aspectRatio: '7.6 / 9',
    }}
  >
    {/* Image — 63% height */}
    <div className='w-full' style={{ height: '63%', flexShrink: 0 }}>
      <img
        src={image}
        alt={label}
        className='w-full h-full object-cover'
        style={{ objectPosition }}
      />
    </div>

    {/* Label */}
    <div className='w-full px-1 pt-1' style={{ height: '15%' }}>
      <p
        className='text-center font-bold leading-tight'
        style={{
          fontSize: 'clamp(8px, 2.2vw, 10px)',
          color: '#000000',
        }}
      >
        {label}
      </p>
    </div>

    {/* Buy button */}
    <div className='w-full flex justify-center pb-2 pt-1' style={{ height: '22%' }}>
      <button
        className='active:scale-95 transition-transform font-black rounded-lg flex items-center justify-center gap-0.5'
        style={{
          width: '50%',
          height: '100%',
          paddingLeft: '4px',
          paddingRight: '4px',
          fontSize: 'clamp(8px, 2vw, 10px)',
          background: 'linear-gradient(180deg, #d4ac00 0%, #b89200 100%)',
          border: '1.5px solid #8a6500',
          color: '#000000',
          boxShadow: '0 2px 0 #6b4e00, inset 0 1px 0 rgba(255,255,255,0.15)',
          whiteSpace: 'nowrap',
        }}
      >
        <span style={{ color: '#000000' }}>{price}</span>
        <span style={{ color: '#000000' }}> ⭐</span>
      </button>
    </div>
  </div>
);

export default ShopCardGreen;