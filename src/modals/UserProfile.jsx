import React from 'react';
import userProfileImage from "../assets/page1bg.webp";
import usdtIcon from "../assets/UserProfileImages/usdtIcon.webp";
import btn1Icon from "../assets/UserProfileImages/OaIconProfilecard.webp";
import btn2Icon from "../assets/UserProfileImages/gameIcons.webp";
import btn3Icon from "../assets/UserProfileImages/gameIcons.webp";
import btn4Icon from "../assets/UserProfileImages/paCardIcon.webp";
import { IoAddCircle } from 'react-icons/io5';
import BonusCard from '../components/BonusCard';
import { useNavigate } from 'react-router-dom';

const UserProfile = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const navigate = useNavigate();
  const progress = 65;

  const bonuses = [
    { title: 'Награда за 1 Уровень', subtitle: '50 Фишек', buttonText: 'Получено', disabled: true },
    { title: 'Награда за 2 Уровень', subtitle: '100 Фишек', buttonText: 'Забрать', disabled: false },
    { title: 'Награда за 3 Уровень', subtitle: '25 Фишек', buttonText: 'Получено', disabled: true },
    { title: 'Ежедневный бонус', subtitle: '200 Фишек', buttonText: 'Забрать', disabled: false },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className='fixed inset-0 z-40'
        style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        onClick={onClose}
      />

      {/* Modal — bottom sheet */}
      <div
        className='fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl overflow-hidden'
        style={{
          height: '80vh',
          backgroundColor: '#474747',
          border: '2px solid #737373',
          borderBottom: 'none',
          boxShadow: '0 -8px 32px rgba(0,0,0,0.5)',
          maxWidth: '430px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Drag handle */}
        <div className='flex justify-center pt-2 pb-1 flex-shrink-0'>
          <div className='w-8 h-1 rounded-full' style={{ backgroundColor: '#737373' }} />
        </div>

        {/* Scrollable Content */}
        <div className='flex-1 overflow-y-auto px-4 pt-2 pb-6 flex flex-col gap-3'>

          {/* Profile Row */}
          <div className='flex items-center gap-3'>
            <div className='relative flex-shrink-0'>
              <div
                className='absolute inset-0 rounded-full'
                style={{ boxShadow: '0 0 0 2px #FFD700, 0 0 8px rgba(255,215,0,0.4)' }}
              />
              <img
                src={userProfileImage}
                alt='profile'
                className='w-14 h-14 rounded-full object-cover'
              />
              <div
                className='absolute -bottom-1 -right-1 w-5 h-5 rotate-45 flex items-center justify-center'
                style={{
                  background: 'linear-gradient(135deg, #FFE033, #deba00)',
                  border: '1.5px solid #af8700',
                  boxShadow: '0 0 5px rgba(255,215,0,0.6)',
                }}
              >
                <span className='-rotate-45 text-[9px] font-black text-black leading-none'>1</span>
              </div>
            </div>

            <div className='flex flex-col flex-1 min-w-0 gap-1.5'>
              <span
                className='text-yellow-400 text-sm font-black tracking-wide'
                style={{ textShadow: '0 0 6px rgba(255,215,0,0.3)' }}
              >
                PLAYER NAME
              </span>

              <div className='flex items-center gap-1.5'>
                <div className='relative flex-shrink-0 w-5 h-5 flex items-center justify-center'>
                  <div
                    className='w-4 h-4 rotate-45'
                    style={{
                      background: 'linear-gradient(135deg, #FFE033 0%, #deba00 60%, #c9a800 100%)',
                      border: '1.5px solid #af8700',
                      boxShadow: '0 0 6px rgba(255,215,0,0.6)',
                    }}
                  />
                  <span className='absolute text-[7px] font-black text-black leading-none'>1</span>
                </div>

                <div
                  className='flex-1 h-2 rounded-full overflow-hidden'
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.5)',
                  }}
                >
                  <div
                    className='h-full rounded-full relative overflow-hidden'
                    style={{
                      width: `${progress}%`,
                      background: progress >= 75
                        ? 'linear-gradient(90deg, #FFD700 0%, #22c55e 100%)'
                        : progress >= 55
                        ? 'linear-gradient(90deg, #FFD700 50%, #86efac 100%)'
                        : 'linear-gradient(90deg, #FFD700, #f59e0b)',
                      boxShadow: progress >= 60
                        ? '0 0 6px rgba(74,222,128,0.5)'
                        : '0 0 6px rgba(255,215,0,0.5)',
                      transition: 'width 0.5s ease',
                    }}
                  >
                    <div
                      className='absolute inset-0'
                      style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.25) 0%, transparent 60%)' }}
                    />
                  </div>
                </div>

                <div className='relative flex-shrink-0 w-5 h-5 flex items-center justify-center'>
                  <div
                    className='w-4 h-4 rotate-45'
                    style={{
                      background: 'linear-gradient(135deg, #4ade80 0%, #16a34a 60%, #15803d 100%)',
                      border: '1.5px solid #14532d',
                      boxShadow: '0 0 6px rgba(74,222,128,0.5)',
                    }}
                  />
                  <span className='absolute text-[7px] font-black text-white leading-none'>2</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2x2 BUTTON GRID */}
          <div className='grid grid-cols-2 gap-2'>

            {/* Row 1 Col 1 — Gold USDT */}
            <button
              className='flex items-center gap-2 px-2.5 py-2 rounded-xl w-full active:scale-95 transition-transform'
              style={{
                backgroundColor: '#deba00',
                border: '2px solid #af8700',
                boxShadow: '0 3px 0 #7a5800, inset 0 1px 0 rgba(255,255,255,0.2)',
              }}
            >
              <img src={usdtIcon} alt='usdt' className='w-7 h-7 object-contain flex-shrink-0' />
              <div className='flex flex-col items-start'>
                <span className='text-[10px] font-bold leading-tight' style={{ color: '#412c05' }}>USDT</span>
                <span className='text-sm font-black text-white leading-tight'>1 250.00</span>
              </div>
            </button>

            {/* Row 1 Col 2 — Green ФИШКИ → navigate to /shop */}
            <button
              onClick={() => { onClose(); navigate('/shop'); }}
              className='flex items-center gap-2 px-2.5 py-2 rounded-xl w-full active:scale-95 transition-transform'
              style={{
                backgroundColor: '#52810f',
                border: '2px solid #3f6011',
                boxShadow: '0 3px 0 #2a4008, inset 0 1px 0 rgba(255,255,255,0.1)',
              }}
            >
              <img src={btn1Icon} alt='icon' className='w-7 h-7 object-contain flex-shrink-0' />
              <div className='flex flex-col items-start flex-1 min-w-0'>
                <span className='text-[10px] font-bold leading-tight' style={{ color: '#d9d9d9' }}>ФИШКИ</span>
                <span className='text-sm font-black text-white leading-tight'>0000</span>
              </div>
              <IoAddCircle size={18} color='#a3e635' className='flex-shrink-0' />
            </button>

            {/* Row 2 Col 1 — Orange FA Коины */}
            <button
              className='flex items-center gap-2 px-2.5 py-2 rounded-xl w-full active:scale-95 transition-transform'
              style={{
                backgroundColor: '#da9d01',
                border: '2px solid #b58030',
                boxShadow: '0 3px 0 #7a4e00, inset 0 1px 0 rgba(255,255,255,0.15)',
              }}
            >
              <img src={btn2Icon} alt='icon' className='w-7 h-7 object-contain flex-shrink-0' />
              <div className='flex flex-col items-start'>
                <span className='text-[10px] font-bold leading-tight' style={{ color: '#412c05' }}>FA Коины</span>
                <span className='text-sm font-black text-white leading-tight'>0000</span>
              </div>
            </button>

            {/* Row 2 Col 2 — Grey БИЛЕТЫ → navigate to /shop */}
            <button
              onClick={() => { onClose(); navigate('/shop'); }}
              className='flex items-center gap-2 px-2.5 py-2 rounded-xl w-full active:scale-95 transition-transform'
              style={{
                backgroundColor: '#888784',
                border: '2px solid #6b6967',
                boxShadow: '0 3px 0 #4a4846, inset 0 1px 0 rgba(255,255,255,0.08)',
              }}
            >
              <img src={btn3Icon} alt='icon' className='w-7 h-7 object-contain flex-shrink-0' />
              <div className='flex flex-col items-start flex-1 min-w-0'>
                <span className='text-[10px] font-bold leading-tight' style={{ color: '#d9d9d9' }}>БИЛЕТЫ</span>
                <span className='text-sm font-black text-white leading-tight'>0000</span>
              </div>
              <IoAddCircle size={18} color='#e5e5e5' className='flex-shrink-0' />
            </button>

          </div>

          {/* Divider */}
          <div className='w-full h-px' style={{ backgroundColor: '#737373' }} />

          {/* Active Bonuses header */}
          <div className='flex flex-col gap-0.5'>
            <span
              className='text-sm font-black text-white tracking-wide'
              style={{ textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}
            >
              Активные Бонусы
            </span>
            <span
              className='text-xs font-semibold'
              style={{ color: '#9e9e9e' }}
            >
              Активных бонусов нет.
            </span>
          </div>

          {/* Divider */}
          <div className='w-full h-px' style={{ backgroundColor: '#737373' }} />

          {/* Bonus Cards */}
          <div className='flex flex-col gap-2'>
            {bonuses.map((bonus, index) => (
              <BonusCard
                key={index}
                title={bonus.title}
                subtitle={bonus.subtitle}
                buttonText={bonus.buttonText}
                buttonDisabled={bonus.disabled}
              />
            ))}
          </div>

        </div>
      </div>
    </>
  );
};

export default UserProfile;