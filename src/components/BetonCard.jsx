import React from "react"
import betonBanner from "../assets/page22Images/beton-banner.webp"
import faIcon      from "../assets/page22Images/fa-icon.webp"

const BetonCard = () => {
  return (
    <div className="bg-gradient-to-b from-[#201e10] to-[#141408] rounded-[10px] px-2 py-[3px] mb-[5px] flex flex-col shrink-0">

      <p className="text-white font-bold text-[11px] text-center mb-0.5">
        Особенные бонусы
      </p>

      <div className="w-full rounded-[10px] border-2 border-[#e8ff01] overflow-hidden bg-gradient-to-b from-[#2a1e00] to-[#1a1200] shadow-[0_3px_14px_rgba(0,0,0,0.8)] flex flex-col">

        {/* Banner — slightly larger */}
        <div className="flex justify-center items-center pt-1.5 pb-1 px-4">
          <img
            src={betonBanner}
            alt="BETON"
            className="object-contain block"
            style={{ width: '70%', height: 'auto', maxHeight: 44 }}
          />
        </div>

        {/* ДАЕТ МЕГА БОНУС + 100FS */}
        <div className="flex items-center px-3 pb-[2px]">
          <span
            className="font-black text-[#53a00d] leading-none"
            style={{ width: '80%', fontSize: 'clamp(16px,5vw,22px)' }}
          >
            ДАЕТ МЕГА БОНУС
          </span>
          <span
            className="font-black text-white text-right leading-none"
            style={{ width: '20%', fontSize: 'clamp(13px,3.8vw,18px)' }}
          >
            +100FS
          </span>
        </div>

        {/* Row 1: 1B — gap-[3px] so coin is close */}
        <div className="flex items-center px-3 py-[3px] border-t border-white/10">
          <span
            className="font-black text-white leading-none"
            style={{ fontSize: 'clamp(18px,5.5vw,24px)', minWidth: 44 }}
          >
            1B
          </span>
          <img
            src={faIcon}
            alt=""
            className="rounded-full object-cover shrink-0"
            style={{ width: 24, height: 24, marginLeft: 2, marginRight: 6 }}
          />
          <span
            className="text-[#c8e800] font-bold leading-tight"
            style={{ fontSize: 'clamp(10px,2.8vw,13px)' }}
          >
            За подписку на канал BETON
          </span>
        </div>

        {/* Row 2: 100B — same tight spacing */}
        <div className="flex items-center px-3 py-[3px] pb-[6px]">
          <span
            className="font-black text-[#c8e800] leading-none"
            style={{ fontSize: 'clamp(18px,5.5vw,24px)', minWidth: 44 }}
          >
            100B
          </span>
          <img
            src={faIcon}
            alt=""
            className="rounded-full object-cover shrink-0"
            style={{ width: 24, height: 24, marginLeft: 2, marginRight: 6 }}
          />
          <span
            className="text-[#c8e800] font-bold leading-tight"
            style={{ fontSize: 'clamp(10px,2.8vw,13px)' }}
          >
            За первый депозит
          </span>
        </div>

      </div>
    </div>
  )
}

export default BetonCard