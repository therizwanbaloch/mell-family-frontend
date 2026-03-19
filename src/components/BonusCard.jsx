import React from 'react';

const BonusCard = ({
  title = 'Награда за 1 Уровень',
  subtitle = '50 Фишек',
  buttonText = 'Получено',
  onPress,
  buttonDisabled = true,
}) => {
  return (
    <div
      className='flex items-center justify-between px-3 py-3 rounded-xl'
      style={{
        backgroundColor: '#373737',
        border: '1px solid #000000',
        boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
      }}
    >
      {/* Left — texts */}
      <div className='flex flex-col gap-0.5'>
        <span
          className='text-lg font-semibold'
          style={{ color: '#d9d9d9' }}
        >
          {title}
        </span>
        <span
          className='text-sm font-black text-white'
        >
          {subtitle}
        </span>
      </div>

      {/* Right — button */}
      <button
        onClick={onPress}
        disabled={buttonDisabled}
        className='px-3 py-1.5 rounded-lg text-xs font-bold flex-shrink-0'
        style={{
          backgroundColor: '#b4b4b4',
          border: '1.5px solid #888784',
          color: '#474747',
          boxShadow: '0 2px 0 #6e6e6e, inset 0 1px 0 rgba(255,255,255,0.2)',
          opacity: buttonDisabled ? 0.7 : 1,
          cursor: buttonDisabled ? 'not-allowed' : 'pointer',
        }}
      >
        {buttonText}
      </button>
    </div>
  );
};

export default BonusCard;