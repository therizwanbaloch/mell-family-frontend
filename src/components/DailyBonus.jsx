import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { doClaimDaily } from "../redux/gameSlice";
import faIcon from "../assets/page22Images/fa-icon.webp";

/**
 * ── BONUS CARD COMPONENT (DAYS 1-6) ──
 */
const BonusCard = ({ day, reward, desc, active, isClaimed, onClick }) => {
  const getBgColor = () => {
    if (isClaimed) return "bg-[#727272] border-[#444] opacity-80";
    if (active) return "bg-[#52810f] border-[#3e5f08] active:scale-95 cursor-pointer shadow-lg";
    return "bg-[#5b3600] border-[#3d2500]";
  };

  return (
    <div
      onClick={active && !isClaimed ? onClick : null}
      className={`relative w-full flex flex-col justify-center px-1 py-2 box-border border-[2px] rounded-lg transition-transform h-[68px] ${getBgColor()}`}
    >
      <div className="absolute top-[-8px] left-1/2 -translate-x-1/2 z-30 text-white text-[7px] font-black px-[8px] py-[1px] rounded-full whitespace-nowrap border border-white/10 shadow-md bg-[#800000]">
        {isClaimed ? "ВЗЯТО" : active ? "ЗАБРАТЬ" : `ДЕНЬ ${day}`}
      </div>

      <div className="flex flex-col items-center justify-center mt-1">
        <div className="flex items-center justify-center gap-1">
          <h1 className="text-white text-[13px] font-black leading-none">{reward}</h1>
          <img src={faIcon} alt="icon" className="w-[22px] h-[22px] object-contain drop-shadow-md" />
        </div>
        <p className="text-white text-[5px] font-bold mt-[1px] opacity-60 tracking-tighter uppercase">Прибыль за 6 часов</p>
      </div>

      <div className="mt-1 text-center leading-none">
        <p className="text-[#ddd] text-[5.5px] font-medium opacity-80 overflow-hidden text-ellipsis line-clamp-2 px-1">{desc}</p>
      </div>
    </div>
  );
};

/**
 * ── MAIN DAILY BONUS COMPONENT ──
 */
const DailyBonus = ({ onToast }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.game.user);
  const actionLoading = useSelector((state) => state.game.actionLoading);

  const currentDay = user?.daily_day ?? 1;

  // Logic to determine if the user has already claimed today based on date string
  const canClaim = useMemo(() => {
    if (!user?.daily_last_claim) return true;
    
    const lastClaimDate = new Date(user.daily_last_claim).toDateString();
    const todayDate = new Date().toDateString();
    
    return lastClaimDate !== todayDate;
  }, [user?.daily_last_claim]);

  // Diagnostics log for debugging state
  useEffect(() => {
    console.group("🛠️ [Page 22] Daily Sync Log");
    console.log("Current daily_day:", currentDay);
    console.log("Raw daily_last_claim:", user?.daily_last_claim);
    console.log("Can Claim (Computed):", canClaim);
    console.groupEnd();
  }, [user, currentDay, canClaim]);

  const daysData = [
    { day: 1, reward: "610B", desc: "X10 вся прибыль на 15 минут" },
    { day: 2, reward: "813B", desc: "2 Фа Бокса, 500 Билетов" },
    { day: 3, reward: "1.02T", desc: "X15 вся прибыль на 30 минут" },
    { day: 4, reward: "1.22T", desc: "1 Пепе Бокс, 1000 Билетов, 3 Фишки" },
    { day: 5, reward: "1.42T", desc: "X20 вся прибыль на 45 минут" },
    { day: 6, reward: "1.63T", desc: "2 Пепе Бокса, 1500 Билетов" },
    { day: 7, reward: "2.44T", desc: "X25 вся прибыль на 90 минут, 1 Шнейне Бокс, 2000 Билетов, 30 Фишек" },
  ];

  // Updated handleClaim with the requested Toast logic
  const handleClaim = async () => {
    if (!canClaim || actionLoading) return;

    const resultAction = await dispatch(doClaimDaily());

    if (doClaimDaily.fulfilled.match(resultAction)) {
      const reward = resultAction.payload;

      if (onToast) {
        if (reward?.amount) {
          onToast(`+${reward.amount} coins received 🚀`);
        } else {
          onToast("Награда получена!");
        }
      }
    } else {
      if (onToast) onToast(resultAction.payload || "Ошибка сервера");
    }
  };

  return (
    <div className="w-full h-full overflow-y-auto overflow-x-hidden pb-6 custom-scrollbar bg-black/20">
      <div className="mt-[15px] flex flex-col items-center w-full px-2 max-w-[412px] mx-auto">
        <div className="bg-[#800000] text-white border-2 border-[#372505] text-center relative z-20 text-[10px] font-black rounded-full px-6 py-1 shadow-md uppercase">
          Ежедневный бонус
        </div>

        <div className="bg-[#af8700] border-[3px] border-[#372505] rounded-xl px-3 py-5 mt-[-12px] relative z-10 w-full shadow-lg">
          <div className="text-white text-center text-[9px] font-bold mb-4 uppercase drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
            Заходи каждый день и получай награду
          </div>

          <div className="grid grid-cols-3 gap-x-2 gap-y-5">
            {daysData.slice(0, 6).map((item, index) => {
              const dayNum = index + 1;
              const isClaimed = dayNum < currentDay || (dayNum === currentDay && !canClaim);
              const isActive = dayNum === currentDay && canClaim;

              return (
                <BonusCard
                  key={item.day}
                  {...item}
                  active={isActive}
                  isClaimed={isClaimed}
                  onClick={handleClaim}
                />
              );
            })}
          </div>

          {/* Day 7 Highlight Card */}
          {(() => {
            const isClaimed7 = 7 < currentDay || (7 === currentDay && !canClaim);
            const isActive7 = 7 === currentDay && canClaim;
            const bg7 = isClaimed7 ? "bg-[#727272] border-[#444]" : 
                        isActive7 ? "bg-[#52810f] border-[#3e5f08]" : 
                        "bg-[#5b3600] border-[#3d2500]";

            return (
              <div
                onClick={isActive7 ? handleClaim : null}
                className={`mt-5 rounded-lg p-2 flex items-center border-[2px] relative z-10 h-[75px] transition-transform ${bg7} ${isActive7 ? "active:scale-95 cursor-pointer shadow-xl" : ""}`}
              >
                <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 z-30 text-white text-[8px] font-black rounded-full px-4 py-[1.5px] shadow-md border border-white/10 bg-[#800000]">
                  {isClaimed7 ? "ВЗЯТО" : isActive7 ? "ЗАБРАТЬ" : "ДЕНЬ 7"}
                </div>
                <div className="flex flex-col justify-center items-start pl-2 flex-shrink-0 w-[35%]">
                  <span className="text-white text-[18px] font-black leading-none">{daysData[6].reward}</span>
                  <div className="text-white text-[6px] font-black uppercase opacity-80 mt-1 whitespace-nowrap">Прибыль за 24 часа</div>
                </div>
                <div className="flex justify-center items-center w-[30%]">
                  <img src={faIcon} alt="large-icon" className="w-[48px] h-[48px] object-contain drop-shadow-lg" />
                </div>
                <div className="flex-1 text-white text-[7px] font-bold leading-[1.1] uppercase opacity-90 pr-1 text-right">
                  {daysData[6].desc}
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export default DailyBonus;