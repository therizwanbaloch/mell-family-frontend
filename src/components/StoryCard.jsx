import React from "react";
import coinImage from "../assets/coin.webp";

const StoryCard = ({
  cardBg = "#c0c0c0",
  image,
  imageBg = "linear-gradient(160deg,#8b0000,#c0392b,#7a0000)",
  imageBorder = "#333",
  title = "TITLE",
  ypText = "ур. 0",
  subtitle = "",
  buttonText = "Улучшить",
  buttonBg = "linear-gradient(180deg,#f0c020,#c89000)",
  buttonBorder = "#8a6000",
  buttonShadow = "0 3px 0 #6a4000",
  buttonTextColor = "#000",
  onButtonClick,
  disableButton = false,
}) => {
  return (
    <div
      className="flex w-full rounded-xl border-[2.5px] border-[#888] shadow-[0_4px_12px_rgba(0,0,0,0.5)] overflow-hidden p-2 gap-3 min-h-[110px]"
      style={{ background: cardBg }}
    >
      {/* LEFT — image */}
      <div
        className="shrink-0 rounded-lg overflow-hidden border-2 self-stretch min-h-[90px] w-[90px]"
        style={{ borderColor: imageBorder, background: imageBg }}
      >
        <img
          src={image}
          alt={title}
          className="w-full h-full block object-cover object-top min-h-[90px]"
        />
      </div>

      {/* RIGHT */}
      <div className="flex-1 min-w-0 flex flex-col gap-1 py-1 relative">

        {/* YP TOP RIGHT */}
        <span className="absolute top-0 right-0 font-bold text-[11px] text-[#555]">
          {ypText}
        </span>

        {/* Row 1: title */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-black text-[15px] text-black tracking-wide leading-tight">
            {title}
          </span>
        </div>

        {/* Row 2: perks */}
        <div className="flex-1">
          {typeof subtitle === "string" ? (
            <p className="text-black font-nunito font-extralight text-[12px] m-0">
              {subtitle}
            </p>
          ) : (
            subtitle
          )}
        </div>

        {/* Row 3: button */}
        <button
          onClick={disableButton ? undefined : onButtonClick}
          className="flex items-center justify-center w-full rounded-full text-[12px] border-[2.5px] font-nunito  px-3 shrink-0 min-h-[26px] whitespace-nowrap active:scale-95 transition-transform"
          style={{
            background: buttonBg,
            borderColor: buttonBorder,
            boxShadow: buttonShadow,
            color: buttonTextColor,
            cursor: disableButton ? "default" : "pointer",
          }}
        >
          <span>{buttonText}</span>
          <img
            src={coinImage}
            alt="coin"
            className="w-7 h-7 object-contain shrink-0"
          />
        </button>
      </div>
    </div>
  );
};

export default StoryCard;