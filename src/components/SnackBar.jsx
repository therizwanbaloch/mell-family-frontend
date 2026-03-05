import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const SnackBar = () => {
  const [active, setActive] = useState(2);

  const tabs = [
    { id: 0, label: 'Магазин' },
    { id: 1, label: 'Игры' },
    { id: 2, label: 'ГЛАВНАЯ' },
    { id: 3, label: 'Друны' },
    { id: 4, label: 'Бонусы' },
  ];

  return (
    <div
      className='fixed bottom-0 left-0 right-0 z-50 flex items-end px-2 pb-2'
      style={{
        background: 'linear-gradient(180deg, #bfbfbf 0%, #a0a0a0 100%)',
        maxWidth: '430px',
        margin: '0 auto',
        gap: '6px',
        paddingTop: '6px',
      }}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActive(tab.id)}
          className='flex-1 flex flex-col items-center justify-center rounded-xl transition-all duration-200 active:scale-95'
          style={{
            paddingTop: active === tab.id ? '10px' : '6px',
            paddingBottom: active === tab.id ? '10px' : '6px',
            marginTop: active === tab.id ? '-8px' : '0px',
            background: active === tab.id
              ? 'linear-gradient(180deg, #515151 0%, #444444 100%)'
              : 'transparent',
            border: active === tab.id
              ? '1.5px solid #ffffff'
              : '1.5px solid transparent',
            boxShadow: active === tab.id
              ? '0 -3px 12px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.2)'
              : 'none',
          }}
        >
          {/* Bottom indicator line */}
          <div
            className='w-6 h-0.5 rounded-full mb-1'
            style={{
              backgroundColor: active === tab.id ? '#888784' : 'transparent',
            }}
          />

          <span
            className='font-black leading-none'
            style={{
              fontSize: active === tab.id
                ? 'clamp(12px, 3.5vw, 15px)'
                : 'clamp(9px, 2.5vw, 11px)',
              color: active === tab.id ? '#ffffff' : '#000000',
              textShadow: active === tab.id
                ? '0 1px 2px rgba(0,0,0,0.4)'
                : 'none',
              whiteSpace: 'nowrap',
            }}
          >
            {tab.label}
          </span>
        </button>
      ))}
    </div>
  );
};

export default SnackBar;