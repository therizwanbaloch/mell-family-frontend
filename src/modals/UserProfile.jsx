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
import { useSelector, useDispatch } from 'react-redux';
import { doClaimDaily, fetchState } from '../redux/gameSlice';

// Skeleton pulse
const Skel = ({ w = '60px', h = '14px', radius = '6px' }) => (
  <div style={{
    width: w, height: h, borderRadius: radius,
    background: 'rgba(255,255,255,0.12)',
    animation: 'skelPulse 1.4s ease-in-out infinite',
    display: 'inline-block',
  }} />
)

const UserProfile = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const navigate  = useNavigate();
  const dispatch  = useDispatch();
  const { user, stateLoading, actionLoading } = useSelector((state) => state.game);

  const isReady      = !!user
  const playerName   = user?.username || user?.first_name || 'PLAYER'
  const profileLevel = user?.profile_level ?? 1
  const mainLevel    = user?.main_level    ?? 1
  const levelInMain  = ((profileLevel - 1) % 10) + 1
  const progress     = (levelInMain / 10) * 100

  // Balances
  const fa      = user?.fa      ?? 0
  const usdt    = user?.usdt    ?? 0
  const chips   = user?.chips   ?? 0
  const tickets = user?.tickets ?? 0

  // Daily bonus
  const canClaimDaily = user?.daily_last_claim !== new Date().toISOString().split('T')[0]
  const dailyDay      = (user?.daily_day ?? 0) + 1

  // Active buffs
  const now = Math.floor(Date.now() / 1000)
  const activeBonuses = []
  if (user?.x12_until_ts > now) activeBonuses.push(`x12 множитель до ${new Date(user.x12_until_ts * 1000).toLocaleTimeString()}`)
  if (user?.x5_until_ts  > now) activeBonuses.push(`x5 множитель до ${new Date(user.x5_until_ts  * 1000).toLocaleTimeString()}`)
  if (user?.x3_until_ts  > now) activeBonuses.push(`x3 множитель до ${new Date(user.x3_until_ts  * 1000).toLocaleTimeString()}`)
  if (user?.x2_until_ts  > now) activeBonuses.push(`x2 множитель до ${new Date(user.x2_until_ts  * 1000).toLocaleTimeString()}`)
  if (user?.tap_perm_20   === 1) activeBonuses.push('Постоянный +20% к тапу')

  // Format number with spaces
  const fmt = (n) => Math.floor(n ?? 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '\u00A0')
  const fmtUsdt = (n) => Number(n ?? 0).toFixed(2)

  const handleClaimDaily = async () => {
    await dispatch(doClaimDaily())
    dispatch(fetchState())
  }

  // Build bonus cards from profile level rewards + daily
  const bonusCards = [
    {
      title: `Ежедневный бонус (день ${dailyDay})`,
      subtitle: 'Фишки + награда',
      buttonText: canClaimDaily ? 'Забрать' : 'Получено',
      disabled: !canClaimDaily || actionLoading,
      onPress: canClaimDaily ? handleClaimDaily : null,
    },
  ]

  return (
    <>
      <style>{`
        @keyframes skelPulse {
          0%,100% { opacity: 0.35; }
          50%      { opacity: 0.75; }
        }
      `}</style>

      {/* Backdrop */}
      <div
        className='fixed inset-0 z-40'
        style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        onClick={onClose}
      />

      {/* Bottom sheet */}
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

        {/* Scrollable content */}
        <div className='flex-1 overflow-y-auto px-4 pt-2 pb-6 flex flex-col gap-3'>

          {/* Profile row */}
          <div className='flex items-center gap-3'>
            <div className='relative flex-shrink-0'>
              <div className='absolute inset-0 rounded-full' style={{ boxShadow: '0 0 0 2px #FFD700, 0 0 8px rgba(255,215,0,0.4)' }} />
              <img
                src={user?.photo_url || userProfileImage}
                alt='profile'
                className='w-14 h-14 rounded-full object-cover'
              />
              {/* Level diamond badge */}
              <div
                className='absolute -bottom-1 -right-1 w-5 h-5 rotate-45 flex items-center justify-center'
                style={{
                  background: 'linear-gradient(135deg, #FFE033, #deba00)',
                  border: '1.5px solid #af8700',
                  boxShadow: '0 0 5px rgba(255,215,0,0.6)',
                }}
              >
                <span className='-rotate-45 text-[9px] font-black text-black leading-none'>{mainLevel}</span>
              </div>
            </div>

            <div className='flex flex-col flex-1 min-w-0 gap-1.5'>
              {isReady
                ? <span className='text-yellow-400 text-sm font-black tracking-wide' style={{ textShadow: '0 0 6px rgba(255,215,0,0.3)' }}>
                    {playerName}
                  </span>
                : <Skel w="100px" h="14px" />
              }

              {/* XP bar with diamonds */}
              <div className='flex items-center gap-1.5'>
                {/* Left diamond */}
                <div className='relative flex-shrink-0 w-5 h-5 flex items-center justify-center'>
                  <div className='w-4 h-4 rotate-45' style={{
                    background: 'linear-gradient(135deg, #FFE033 0%, #deba00 60%, #c9a800 100%)',
                    border: '1.5px solid #af8700',
                    boxShadow: '0 0 6px rgba(255,215,0,0.6)',
                  }} />
                  <span className='absolute text-[7px] font-black text-black leading-none'>{levelInMain}</span>
                </div>

                <div className='flex-1 h-2 rounded-full overflow-hidden' style={{
                  background: 'rgba(255,255,255,0.08)',
                  boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.5)',
                }}>
                  <div className='h-full rounded-full relative overflow-hidden' style={{
                    width: `${progress}%`,
                    background: progress >= 75
                      ? 'linear-gradient(90deg, #FFD700 0%, #22c55e 100%)'
                      : progress >= 55
                      ? 'linear-gradient(90deg, #FFD700 50%, #86efac 100%)'
                      : 'linear-gradient(90deg, #FFD700, #f59e0b)',
                    transition: 'width 0.5s ease',
                  }}>
                    <div className='absolute inset-0' style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.25) 0%, transparent 60%)' }} />
                  </div>
                </div>

                {/* Right diamond */}
                <div className='relative flex-shrink-0 w-5 h-5 flex items-center justify-center'>
                  <div className='w-4 h-4 rotate-45' style={{
                    background: 'linear-gradient(135deg, #4ade80 0%, #16a34a 60%, #15803d 100%)',
                    border: '1.5px solid #14532d',
                    boxShadow: '0 0 6px rgba(74,222,128,0.5)',
                  }} />
                  <span className='absolute text-[7px] font-black text-white leading-none'>{Math.min(levelInMain + 1, 10)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2x2 balance grid */}
          <div className='grid grid-cols-2 gap-2'>

            {/* USDT */}
            <button className='flex items-center gap-2 px-2.5 py-2 rounded-xl w-full active:scale-95 transition-transform' style={{
              backgroundColor: '#deba00', border: '2px solid #af8700',
              boxShadow: '0 3px 0 #7a5800, inset 0 1px 0 rgba(255,255,255,0.2)',
            }}>
              <img src={usdtIcon} alt='usdt' className='w-7 h-7 object-contain flex-shrink-0' />
              <div className='flex flex-col items-start'>
                <span className='text-[10px] font-bold leading-tight' style={{ color: '#412c05' }}>USDT</span>
                {isReady
                  ? <span className='text-sm font-black text-white leading-tight'>{fmtUsdt(usdt)}</span>
                  : <Skel w="50px" h="14px" />
                }
              </div>
            </button>

            {/* ФИШКИ */}
            <button onClick={() => { onClose(); navigate('/shop'); }}
              className='flex items-center gap-2 px-2.5 py-2 rounded-xl w-full active:scale-95 transition-transform' style={{
                backgroundColor: '#52810f', border: '2px solid #3f6011',
                boxShadow: '0 3px 0 #2a4008, inset 0 1px 0 rgba(255,255,255,0.1)',
              }}>
              <img src={btn1Icon} alt='icon' className='w-7 h-7 object-contain flex-shrink-0' />
              <div className='flex flex-col items-start flex-1 min-w-0'>
                <span className='text-[10px] font-bold leading-tight' style={{ color: '#d9d9d9' }}>ФИШКИ</span>
                {isReady
                  ? <span className='text-sm font-black text-white leading-tight'>{fmt(chips)}</span>
                  : <Skel w="50px" h="14px" />
                }
              </div>
              <IoAddCircle size={18} color='#a3e635' className='flex-shrink-0' />
            </button>

            {/* FA Коины */}
            <button className='flex items-center gap-2 px-2.5 py-2 rounded-xl w-full active:scale-95 transition-transform' style={{
              backgroundColor: '#da9d01', border: '2px solid #b58030',
              boxShadow: '0 3px 0 #7a4e00, inset 0 1px 0 rgba(255,255,255,0.15)',
            }}>
              <img src={btn2Icon} alt='icon' className='w-7 h-7 object-contain flex-shrink-0' />
              <div className='flex flex-col items-start'>
                <span className='text-[10px] font-bold leading-tight' style={{ color: '#412c05' }}>FA Коины</span>
                {isReady
                  ? <span className='text-sm font-black text-white leading-tight'>{fmt(fa)}</span>
                  : <Skel w="50px" h="14px" />
                }
              </div>
            </button>

            {/* БИЛЕТЫ */}
            <button onClick={() => { onClose(); navigate('/shop'); }}
              className='flex items-center gap-2 px-2.5 py-2 rounded-xl w-full active:scale-95 transition-transform' style={{
                backgroundColor: '#888784', border: '2px solid #6b6967',
                boxShadow: '0 3px 0 #4a4846, inset 0 1px 0 rgba(255,255,255,0.08)',
              }}>
              <img src={btn3Icon} alt='icon' className='w-7 h-7 object-contain flex-shrink-0' />
              <div className='flex flex-col items-start flex-1 min-w-0'>
                <span className='text-[10px] font-bold leading-tight' style={{ color: '#d9d9d9' }}>БИЛЕТЫ</span>
                {isReady
                  ? <span className='text-sm font-black text-white leading-tight'>{fmt(tickets)}</span>
                  : <Skel w="50px" h="14px" />
                }
              </div>
              <IoAddCircle size={18} color='#e5e5e5' className='flex-shrink-0' />
            </button>

          </div>

          {/* Divider */}
          <div className='w-full h-px' style={{ backgroundColor: '#737373' }} />

          {/* Active bonuses */}
          <div className='flex flex-col gap-0.5'>
            <span className='text-sm font-black text-white tracking-wide' style={{ textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}>
              Активные Бонусы
            </span>
            {activeBonuses.length > 0
              ? activeBonuses.map((b, i) => (
                  <span key={i} className='text-xs font-semibold' style={{ color: '#FFD700' }}>• {b}</span>
                ))
              : <span className='text-xs font-semibold' style={{ color: '#9e9e9e' }}>Активных бонусов нет.</span>
            }
          </div>

          {/* Divider */}
          <div className='w-full h-px' style={{ backgroundColor: '#737373' }} />

          {/* Bonus cards */}
          <div className='flex flex-col gap-2'>
            {bonusCards.map((bonus, index) => (
              <BonusCard
                key={index}
                title={bonus.title}
                subtitle={bonus.subtitle}
                buttonText={bonus.buttonText}
                buttonDisabled={bonus.disabled}
                onPress={bonus.onPress}
              />
            ))}
          </div>

        </div>
      </div>
    </>
  );
};

export default UserProfile;