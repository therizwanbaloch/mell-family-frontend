import React from "react"
import betonBanner from "../assets/page22Images/beton-banner.webp"
import faIcon      from "../assets/page22Images/fa-icon.webp"

const BetonCard = () => {
  return (
    <div className="bg-gradient-to-b from-[#201e10] to-[#141408] rounded-[10px] py-[3px] mb-[5px] flex flex-col shrink-0">

      <p className="text-white font-bold text-[11px] text-center mb-0.5">
        Особенные бонусы
      </p>

      <div className="w-full rounded-[10px] border-4 border-[#e8ff01] overflow-hidden bg-gradient-to-b from-[#2a1e00] to-[#1a1200] shadow-[0_3px_14px_rgba(0,0,0,0.8)] flex flex-col">

        {/* ── IMAGE SECTION ── */}
        <div className="w-full px-1 py-1 flex justify-center items-center">
          <img
            src={betonBanner}
            alt="BETON"
            className="w-100" 
            style={{ 
              height: "120", 
              maxHeight: "42px",  
              display: "block"
            }} 
          />
        </div>

        {/* ── CONTENT SECTION (Headline) ── */}
        <div className="flex items-center px-3 pt-2 pb-[2px]">
          <span
            className="font-black text-[#53a00d] leading-none uppercase"
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

        {/* ── 1B LINE ── */}
        <div className="flex gap-0 items-center px-3">
          <span
            className="font-black text-white leading-none"
            style={{ fontSize: 'clamp(18px,5.5vw,24px)', minWidth: 'fit-content' }}
          >
            1B
          </span>
          <div className="flex gap-0 items-center">
            <img
              src={faIcon}
              alt=""
              className="rounded-full object-cover shrink-0"
              style={{ width: 35, height: 35, marginLeft: 0, marginRight: 0 }} 
            />
            <span
              className="text-[#c8e800] font-bold leading-tight"
              style={{ fontSize: '10px', marginLeft: 0 }}
            >
              За подписку на канал BETON
            </span>
          </div>
        </div>

        {/* ── 100B LINE ── */}
        <div className="flex gap-0 items-center px-3 pb-[8px]"> 
          <span
            className="font-black text-[#c8e800] leading-none"
            style={{ fontSize: 'clamp(18px,5.5vw,24px)', minWidth: 'fit-content' }}
          >
            100B
          </span>
          <div className="flex gap-0 items-center">
            <img
              src={faIcon}
              alt=""
              className="rounded-full object-cover shrink-0"
              style={{ width: 35, height: 35, marginLeft: 0, marginRight: 0 }}
            />
            <span
              className="text-[#c8e800] font-bold leading-tight"
              style={{ fontSize: '10px', marginLeft: 0 }}
            >
              За первый депозит
            </span>
          </div>
        </div>

      </div>
    </div>
  )
}

export default BetonCard;