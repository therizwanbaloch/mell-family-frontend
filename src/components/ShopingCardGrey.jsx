import React from 'react';

const ShopCard = ({ image, label, price, emoji, objectPosition = 'center', onClick, loading }) => (
  <div
    className='flex flex-col items-center rounded-xl overflow-hidden'
    style={{
      backgroundColor: '#474747',
      border: '1.5px solid #272727',
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
        className='text-white text-center font-bold leading-tight'
        style={{ fontSize: 'clamp(8px, 2.2vw, 10px)' }}
      >
        {label}
      </p>
    </div>

    {/* Buy button */}
    <div className='w-full flex justify-center pb-2 pt-1' style={{ height: '22%' }}>
      <button
        onClick={onClick}
        disabled={loading}
        className='active:scale-95 transition-transform font-black rounded-lg flex items-center justify-center gap-0.5'
        style={{
          width: '50%',
          height: '100%',
          paddingLeft: '4px',
          paddingRight: '4px',
          fontSize: 'clamp(8px, 2vw, 10px)',
          background: loading
            ? 'linear-gradient(180deg,#888,#666)'
            : 'linear-gradient(180deg, #d4ac00 0%, #b89200 100%)',
          border: '1.5px solid #8a6500',
          color: '#fff',
          boxShadow: loading ? 'none' : '0 2px 0 #6b4e00, inset 0 1px 0 rgba(255,255,255,0.15)',
          textShadow: '0 1px 1px rgba(0,0,0,0.3)',
          whiteSpace: 'nowrap',
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? '...' : `${price} ${emoji}`}
      </button>
    </div>
  </div>
);

export default ShopCard;