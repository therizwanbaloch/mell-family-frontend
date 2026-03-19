import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const tabs = [
  { id: 0, label: 'МАГАЗИН',  route: '/shop' },
  { id: 1, label: 'ИГРЫ',     route: '/page23'  },
  { id: 2, label: 'ГЛАВНАЯ',  route: '/'       },
  { id: 3, label: 'ДРУНЫ',    route: '/page18' },
  { id: 4, label: 'БОНУСЫ',   route: '/page22' },
];

const SnackBar = () => {
  const navigate  = useNavigate();
  const location  = useLocation();

  // Derive active tab from current URL so it stays correct on direct navigation
  const activeId = (() => {
    const path = location.pathname;
    // exact matches first
    const exact = tabs.find(t => t.route === path);
    if (exact) return exact.id;
    // also treat /shop as магазин
    if (path === '/shop') return 0;
    return -1; // no tab highlighted (e.g. /page14)
  })();

  return (
    <div
      className='fixed bottom-0 left-0 right-0 z-50 flex items-end px-2 pb-2'
      style={{
        background: 'linear-gradient(180deg,#bfbfbf 0%,#a0a0a0 100%)',
        maxWidth: '430px',
        margin: '0 auto',
        gap: '6px',
        paddingTop: '6px',
      }}
    >
      {tabs.map((tab) => {
        const active = activeId === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => navigate(tab.route)}
            className='flex-1 flex flex-col items-center justify-center rounded-xl transition-all duration-200 active:scale-95'
            style={{
              paddingTop:    active ? '10px' : '6px',
              paddingBottom: active ? '10px' : '6px',
              marginTop:     active ? '-8px' : '0px',
              background:    active
                ? 'linear-gradient(180deg,#515151 0%,#444444 100%)'
                : 'transparent',
              border:    active ? '1.5px solid #ffffff' : '1.5px solid transparent',
              boxShadow: active
                ? '0 -3px 12px rgba(0,0,0,0.3),0 2px 8px rgba(0,0,0,0.2)'
                : 'none',
            }}
          >
            <div
              className='w-6 h-0.5 rounded-full mb-1'
              style={{ backgroundColor: active ? '#888784' : 'transparent' }}
            />
            <span
              className='font-black leading-none'
              style={{
                fontSize:   active ? 'clamp(12px,3.5vw,15px)' : 'clamp(9px,2.5vw,11px)',
                color:      active ? '#ffffff' : '#000000',
                textShadow: active ? '0 1px 2px rgba(0,0,0,0.4)' : 'none',
                whiteSpace: 'nowrap',
              }}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default SnackBar;
