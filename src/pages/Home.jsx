import React, { useState } from 'react';
import mainBg from '../assets/page1bg.webp';
import profilePic from '../assets/page1bg.webp';
import coinImage from '../assets/coin.webp';
import BattleLayout from '../components/BattleLayout';
import HomeBottomButtons from '../components/HomeBottomButtons';
import UserProfile from '../modals/UserProfile';
import BalanceModal from '../modals/BalanceModal'; // 👈 IMPORT
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const progress = 65;

  const [profileOpen, setProfileOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false); // 👈 NEW STATE

  return (
    <div
      className="w-full bg-cover bg-center"
      style={{
        backgroundImage: `url(${mainBg})`,
        maxWidth: '430px',
        margin: '0 auto',
        height: '100dvh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* TOP TITLE CARD */}
      <div
        className="w-[92%] mx-auto flex flex-col items-center px-4 py-2 mt-4 rounded-2xl flex-shrink-0"
        style={{
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          backgroundColor: 'rgba(0,0,0,0.35)',
          border: '1px solid rgba(255,215,0,0.15)',
          boxShadow:
            '0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,215,0,0.08)',
        }}
      >
        <h1
          className="text-yellow-400 font-extrabold text-center tracking-widest uppercase mb-1 whitespace-nowrap"
          style={{
            fontSize: 'clamp(16px, 6vw, 26px)',
            textShadow: `
              0 1px 2px #7a5800,
              0 0 12px rgba(255,215,0,0.5),
              0 0 24px rgba(255,215,0,0.2)
            `,
            letterSpacing: '0.2em',
          }}
        >
          DRUN FAMILY
        </h1>

        <div className="flex items-center w-full">
          <div
            className="flex-1 h-px"
            style={{
              background:
                'linear-gradient(90deg, transparent, rgba(255,215,0,0.5))',
            }}
          ></div>
          <span
            className="text-yellow-400/80 text-xs font-semibold mx-4 tracking-[0.3em] uppercase"
            style={{ textShadow: `0 0 8px rgba(255,215,0,0.4)` }}
          >
            GAME
          </span>
          <div
            className="flex-1 h-px"
            style={{
              background:
                'linear-gradient(90deg, rgba(255,215,0,0.5), transparent)',
            }}
          ></div>
        </div>
      </div>

      {/* PLAYER INFO CARD */}
      <div
        className="w-[92%] mx-auto mt-2 px-4 py-3 rounded-2xl flex items-center gap-3 flex-shrink-0"
        style={{
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(0,0,0,0.45)',
          border: '1px solid rgba(255,215,0,0.12)',
          boxShadow:
            '0 4px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)',
        }}
      >
        {/* Profile */}
        <div
          className="relative flex-shrink-0 cursor-pointer active:scale-95 transition-transform"
          onClick={() => setProfileOpen(true)}
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{
              boxShadow: '0 0 0 2px #FFD700, 0 0 12px rgba(255,215,0,0.5)',
              borderRadius: '9999px',
            }}
          />
          <img
            src={profilePic}
            alt="profile"
            className="w-11 h-11 rounded-full object-cover"
          />
        </div>

        {/* Right Section */}
        <div className="flex flex-col flex-1 min-w-0 gap-1">
          <div className="flex items-center justify-between">
            <span className="text-yellow-400 text-sm font-bold tracking-wide">
              PLAYER NAME
            </span>
            <span className="text-yellow-400/40 text-[10px] font-medium tracking-widest uppercase">
              {progress}% XP
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Progress Bar */}
            <div
              className="flex-1 h-2 rounded-full overflow-hidden"
              style={{
                background: 'rgba(255,255,255,0.08)',
                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.5)',
              }}
            >
              <div
                className="h-full rounded-full"
                style={{
                  width: `${progress}%`,
                  background:
                    'linear-gradient(90deg, #FFD700 50%, #86efac 100%)',
                  transition: 'width 0.5s ease',
                }}
              />
            </div>

            {/* Вывод Button */}
            <button
              className="flex-shrink-0 px-4 py-1.5 text-black text-xs font-extrabold rounded-lg active:scale-95 transition-transform tracking-wide uppercase"
              style={{
                backgroundColor: '#deba00',
                border: '1.5px solid #af8700',
                boxShadow:
                  '0 2px 8px rgba(175,135,0,0.5), inset 0 1px 0 rgba(255,255,255,0.3)',
              }}
              onClick={(e) => {
                e.stopPropagation();
                setWithdrawOpen(true); // 👈 OPEN MODAL
              }}
            >
              Вывод
            </button>
          </div>
        </div>
      </div>

      {/* BattleLayout */}
      <div className="flex-1 min-h-0">
        <BattleLayout />
      </div>

      {/* Bottom Buttons */}
      <div className="flex-shrink-0 mt-3">
        <HomeBottomButtons />
      </div>

      {/* Profile Modal */}
      <UserProfile
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
      />

      {/* Withdraw Modal */}
      <BalanceModal
        isOpen={withdrawOpen}
        onClose={() => setWithdrawOpen(false)}
      />
    </div>
  );
};

export default Home;