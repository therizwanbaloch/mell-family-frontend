import React from 'react';
import faIcon from '../assets/page22Images/fa-icon.webp';

const DailyBonus = ({ onToast }) => {
  const days = [
    { day: 1, reward: '610B', desc: 'X10 вся прибыль на 15 минут' },
    { day: 2, reward: '813B', desc: '2 Фа Бокса, 500 Билетов', active: true },
    { day: 3, reward: '1.02T', desc: 'X15 вся прибыль на 30 минут' },
    { day: 4, reward: '1.22T', desc: '1 Пепе Бокс, 1000 Билетов, 3 Фишки' },
    { day: 5, reward: '1.42T', desc: 'X20 вся прибыль на 45 минут' },
    { day: 6, reward: '1.63T', desc: '2 Пепе Бокса, 1500 Билетов' },
    { day: 7, reward: '2.44T', desc: 'X25 вся прибыль на 90 минут, 1 Шнейне Бокс...', isLarge: true },
  ];

  return (
    <div className="mt-[15px] flex flex-col items-center w-full px-[-6px]">
      
      {/* ── HEADER PILL (Z-20: Hamesha Front par rahega) ── */}
      <div className="bg-[#800000] text-white border-2 border-[#372505] text-center relative z-20 text-[10px] font-nunito font-extrabold rounded-full w-[60%] py-1 shadow-md">
        ЕЖЕДНЕВНЫЙ БОНУС
      </div>

      {/* ── MAIN CONTAINER (Z-10: Pill ke peeche rahega) ── */}
      <div className="bg-[#af8700] border-[3px] border-[#372505] rounded-xl px-[10px] py-[15px] mt-[-10px] relative z-10 w-full shadow-lg">
        
        <div className="text-white text-center text-[9px] font-days mb-[8px] uppercase tracking-tight">
          Заходи каждый день и получай награду
        </div>

        {/* ── DAYS GRID (1-6) ── */}
        <div className="grid grid-cols-3 gap-[8px]">
          {days.slice(0, 6).map((item) => (
            <div
              key={item.day}

              className={`rounded-lg px-2 py-2 text-center border-b-[4px] relative active:scale-95 transition-transform ${
                item.active
                  ? 'bg-[linear-gradient(180deg,#589a1c,#2a5a08)] border-[#1a4008] shadow-[0_2px_10px_rgba(0,0,0,0.3)]'
                  : 'bg-[linear-gradient(180deg,#5a5a5a,#333)] border-[#222]'
              }`}
            >
              {/* ── REWARD PILL (Z-index applied like main header) ── */}
              <div className="relative z-30 bg-[#cc1a1a] text-white text-[9px] font-black rounded-full w-fit mx-auto mb-[5px] px-[8px] py-[1px] shadow-sm border border-white/10">
                {item.active ? 'ЗАБРАТЬ' : `ДЕНЬ ${item.day}`}
              </div>

              {/* Reward Amount */}
              <div className="text-white text-[13px] font-black">
                {item.reward}
              </div>

              {/* Icon */}
              <img src={faIcon} alt="reward-icon" className="w-[14px] my-[3px] mx-auto" />

              {/* Description */}
              <div className="text-[#ddd] text-[7px] leading-none font-bold uppercase">
                {item.desc}
              </div>
            </div>
          ))}
        </div>

        {/* ── DAY 7 (Special Large Row) ── */}
        <div className="mt-[10px] bg-[linear-gradient(135deg,#444,#222)] rounded-[12px] p-[12px] flex items-center border border-[#777] shadow-inner relative z-10 active:scale-[0.98] transition-transform">
          {/* LARGE CARD HEIGHT: 
              Yahan 'min-h-[80px]' add kar ke height control karein. 
          */}
          
          {/* Left Content */}
          <div className="flex-[1.5]">
            <div className="relative z-30 bg-[#cc1a1a] text-white text-[10px] font-black rounded-full w-fit px-[10px] py-[1px] mb-[6px] shadow-sm">
              ДЕНЬ 7
            </div>

            <div className="flex items-center gap-2">
              <span className="text-white text-[24px] font-black leading-none">
                2.44T
              </span>
              <img src={faIcon} alt="large-icon" className="w-[24px]" />
            </div>

            <div className="text-white text-[11px] font-black mt-1 uppercase italic">
              ПРИБЫЛЬ ЗА 24 ЧАСA
            </div>
          </div>

          {/* Right Content */}
          <div className="flex-1 text-[#bbb] text-[9px] text-right font-bold leading-tight uppercase pl-2">
            {days[6].desc}
          </div>
        </div>

      </div>
    </div>      
  );
};

export default DailyBonus;