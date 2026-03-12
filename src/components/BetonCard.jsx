import React from "react";
import betonBanner from "../assets/page22Images/beton-banner.webp";
import faIcon from "../assets/page22Images/fa-icon.webp";

const BetonCard = () => {
  return (
    <div className="bg-gradient-to-b from-[#201e10] to-[#141408] rounded-[10px] px-2 py-[5px] mb-[5px] flex flex-col shrink-0">
      
      {/* Section title */}
      <p className="text-white font-bold text-[12px] text-center mb-1">
        Особенные бонусы
      </p>

      {/* Yellow bordered card */}
      <div className="w-full rounded-[10px] border-2 border-[#e8ff01] overflow-hidden bg-gradient-to-b from-[#2a1e00] to-[#1a1200] shadow-[0_3px_14px_rgba(0,0,0,0.8)] flex flex-col">

        {/* Banner — centered, not stretched */}
        <div className="flex justify-center items-center py-2 px-4">
          <img
            src={betonBanner}
            alt="BETON"
            className="h-[52px] w-auto object-contain block"
          />
        </div>

        {/* ДАЕТ МЕГА БОНУС (80%) + 100FS (20%) */}
        <div className="flex items-center px-3 pb-[4px]">
          <span className="w-[80%] font-black text-[clamp(18px,5.5vw,24px)] text-[#53a00d] leading-[1.1]">
            ДАЕТ МЕГА БОНУС
          </span>
          <span className="w-[20%] font-black text-[clamp(14px,4vw,18px)] text-white text-right leading-[1.1]">
            +100FS
          </span>
        </div>

        {/* Row 1: 1B */}
        <div className="flex items-center gap-[8px] px-3 py-[5px] border-t border-white/10">
          <span className="font-black text-[clamp(22px,6.5vw,28px)] text-white leading-none min-w-[52px]">
            1B
          </span>
          <img
            src={faIcon}
            alt=""
            className="w-[26px] h-[26px] rounded-full object-cover shrink-0"
          />
          <span className="text-[#c8e800] font-bold text-[clamp(10px,3vw,13px)] leading-tight">
            За подписку на канал BETON
          </span>
        </div>

        {/* Row 2: 100B */}
        <div className="flex items-center gap-[8px] px-3 py-[5px] pb-[8px]">
          <span className="font-black text-[clamp(22px,6.5vw,28px)] text-[#c8e800] leading-none min-w-[52px]">
            100B
          </span>
          <img
            src={faIcon}
            alt=""
            className="w-[26px] h-[26px] rounded-full object-cover shrink-0"
          />
          <span className="text-[#c8e800] font-bold text-[clamp(10px,3vw,13px)] leading-tight">
            За первый депозит
          </span>
        </div>

      </div>
    </div>
  );
};

export default BetonCard;