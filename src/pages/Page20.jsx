import React from "react";
import { useDispatch } from "react-redux";
import { doStoreBuy } from "../redux/gameSlice";

// ─── ASSETS ───────────────────────────────────────────────────────────────
import pageBg        from "../assets/page1bg.webp";
import logoDark      from "../assets/logo-darkk.webp";
import imgPakDrunov  from "../assets/page20Items/pak-drunov.webp";
import imgVatafa     from "../assets/page20Items/vatafa-pak.webp";
import imgBiznes     from "../assets/page20Items/biznes-pak.webp";
import imgVip        from "../assets/page20Items/vip-pak.webp";
import imgBoxFa      from "../assets/page20Items/box-fa.webp";
import imgBoxPepe    from "../assets/page20Items/box-pepe.webp";
import imgBoxShneine from "../assets/page20Items/box-shneyne.webp";

// ─── SnackBar + Shop ───────────────────────────────────────────────────────
import SnackBar from "../components/SnackBar";
import Shop from "./Shop";

// ═══════════════════════════════════════════════════════════════════════════
// SHARED SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

/** Gold pill section header */
const SectionHeader = ({ label }) => (
  <div className="flex justify-center" style={{ margin: "2.4vw 0" }}>
    <div
      className="rounded-full border-2 border-[#FF8C00] font-black italic uppercase tracking-widest text-black select-none"
      style={{
        background: "linear-gradient(180deg,#f5b800 0%,#b87e00 100%)",
        boxShadow: "0 4px 0 #744500",
        fontSize: "clamp(11px,3.5vw,15px)",
        padding: "1.2vw 9vw",
      }}
    >
      {label}
    </div>
  </div>
);

/** Amber buy button */
const BuyBtn = ({ children, onClick, white = false }) => (
  <button
    onClick={onClick}
    className="inline-flex items-center justify-center gap-1 rounded-full border-[1px] font-bold active:translate-y-[2px] active:shadow-none transition-all duration-75 select-none whitespace-nowrap w-fit"
    style={{
      backgroundColor: white ? "#ffffff" : "#deba00",
      borderColor: white ? "#d1d1d1" : "#9e650c",
      color: "#000000",
      boxShadow: white ? "0 0.7vw 0 #d1d1d1" : "0 0.7vw 0 #9e650c",
      padding: "0.5vw 4.5vw",
      fontSize: "clamp(9px,2.6vw,13px)",
    }}
  >
    {children}
  </button>
);

/** Diagonal corner badge */
const Badge = ({
  children,
  color = "#FF0000",
  rotate = "12deg",
  top = "8%",
  right = "3%",
}) => (
  <div
    className="absolute pointer-events-none font-black text-center leading-tight z-20"
    style={{
      color,
      top,
      right,
      transform: `rotate(${rotate})`,
      fontSize: "clamp(7px,2vw,10px)",
      textShadow: "0 1px 4px rgba(0,0,0,.85)",
    }}
  >
    {children}
  </div>
);

// ─── Card title & desc style helpers ─────────────────────────────────────
const cardTitle = (color, stroke) => ({
  color,
  WebkitTextStroke: `0.2vw ${stroke}`,
  fontSize: "clamp(12px,4.2vw,18px)",
  marginBottom: "1.2vw",
});

const cardDesc = (color) => ({
  color,
  fontSize: "clamp(6px,1.9vw,9px)",
  marginBottom: "1.8vw",
});

// ═══════════════════════════════════════════════════════════════════════════
// PAGE 20 — МАГАЗИН
// ═══════════════════════════════════════════════════════════════════════════
const Page20 = () => {
  const dispatch = useDispatch();
  const buy = (id) => dispatch(doStoreBuy(id));

  return (
    <div
      className="relative mx-auto flex flex-col overflow-hidden"
      style={{
        fontFamily: "'Nunito', sans-serif",
        maxWidth: 430,
        height: "100dvh",
        backgroundImage: `url(${pageBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* ── HEADER ────────────────────────────────────────────────────── */}
      {/* Logo sits flush to top, МАГАЗИН kissing directly below it — no gap */}
      <header
        className="shrink-0 text-center z-10 flex flex-col items-center"
        style={{
          background: "linear-gradient(180deg,#e4e4e4 0%,#c8c8c8 100%)",
          padding: 0,
          lineHeight: 1,
        }}
      >
        <img
          src={logoDark}
          alt="Drun Family Game"
          style={{
            width: "clamp(90px,34vw,148px)",
            display: "block",
            marginTop: "-2vw",      /* pulls logo up so it bleeds into top edge */
            marginBottom: 0,
          }}
        />
        <p
          className="font-black italic uppercase font-extrabold"
          style={{
            color: "#deba00",
            textShadow: "0.5px 0.5px 0px #9e650c",
            WebkitTextStroke: "0.2px #9e650c",
            /* pull text up tightly under image — removes all white gap */
            marginTop: "-4.5vw",
            marginBottom: 0,
            paddingBottom: "1.2vw",
            fontSize: "clamp(18px,6vw,28px)",
            lineHeight: 1,
          }}
        >
          МАГАЗИН
        </p>
      </header>

      {/* ── SCROLLABLE BODY ───────────────────────────────────────────── */}
      <main
        className="flex-1 overflow-y-auto z-10 [&::-webkit-scrollbar]:hidden"
        style={{ padding: "0 2.4vw 20vw", scrollbarWidth: "none" }}
      >
        {/* ════ АКЦИИ ════ */}
        <SectionHeader label="АКЦИИ" />

        {/* ① ПАК ДРУНОВ — full-width green card */}
        <div
          className="relative flex flex-row overflow-hidden"
          style={{
            background: "linear-gradient(90deg,#039b2e,#28660e)",
            border: "0.7vw solid #2c3d13",
            borderRadius: "2.5vw",
            marginBottom: "2.4vw",
            minHeight: "28vw",
          }}
        >
          <Badge top="2%" right="3%">
            25 USDT В<br />ПОДАРОК
          </Badge>

          <div
            className="flex flex-col justify-center z-10 shrink-0"
            style={{ padding: "3vw 0 3vw 3vw" }}
          >
            <h2
              className="font-bold italic uppercase leading-none bg-clip-text text-transparent"
              style={{
                backgroundImage: "radial-gradient(circle, #c2a200 50%, #b98914 50%)",
                WebkitTextStroke: "0.25vw #372505",
                fontSize: "clamp(14px,5.2vw,22px)",
                marginBottom: "1.6vw",
              }}
            >
              ПАК ДРУНОВ
            </h2>
            <p
              className="font-bold leading-[1.35] bg-clip-text text-transparent"
              style={{
                backgroundImage: "radial-gradient(circle, #e69e31 50%, #e8b325 50%)",
                WebkitTextStroke: "0.08vw #272626",
                fontSize: "clamp(8px,2.4vw,11px)",
                marginBottom: "2vw",
              }}
            >
              +44% прибыли друнов<br />
              1111 фишек, 333 FS,<br />
              222 очка в DRUN ROAD
            </p>
            <BuyBtn onClick={() => buy("pak_drunov")}>321 ⭐</BuyBtn>
          </div>

          <img
            src={imgPakDrunov}
            alt="Pak Drunov"
            className="block self-stretch ml-auto"
            style={{
              width: "auto",
              maxWidth: "55%",
              objectFit: "contain",
              objectPosition: "bottom right",
            }}
          />
        </div>

        {/* ② ВАТАФА + БИЗНЕС — 2-column row */}
        <div
          className="grid grid-cols-2"
          style={{ gap: "2.4vw", marginBottom: "2.4vw" }}
        >
          {/* ВАТАФА ПАК — grey card */}
          <div
            className="relative overflow-hidden"
            style={{
              background: "linear-gradient(180deg,#6e6e6e 0%,#5a5a5a 100%)",
              border: "0.7vw solid #272626",
              borderRadius: "2.5vw",
              minHeight: "38vw",
            }}
          >
            <Badge top="4%" right="2%" rotate="14deg" color="#FF2200">
              САМОЕ<br />ВЫГОДНОЕ
            </Badge>
            <div
              className="flex flex-col justify-center z-10 relative"
              style={{ padding: "2.4vw 0 2.4vw 2.4vw", maxWidth: "65%" }}
            >
              <h2 className="font-black italic uppercase leading-none" style={cardTitle("#deba00", "#000000")}>
                ВАТАФА<br />ПАК
              </h2>
              <p className="font-bold leading-[1.3]" style={cardDesc("#e8e8e8")}>
                +20% прибыли за тап<br />
                7 пепе боксов, 77FS<br />
                777 фишек<br />
                77 очков в <br />DRUN ROAD
              </p>
              <BuyBtn onClick={() => buy("vatafa_pak")}>
                <span className="opacity-60">777</span> 249 ⭐
              </BuyBtn>
            </div>
            <img
              src={imgVatafa}
              alt="Vatafa"
              className="absolute bottom-0 right-[-10px] z-30 pointer-events-none"
              style={{ height: "72%", width: "auto", objectFit: "contain", objectPosition: "bottom right" }}
            />
          </div>

          {/* БИЗНЕС ПАК — sky blue card */}
          <div
            className="relative overflow-hidden"
            style={{
              background: "linear-gradient(180deg,#56b4e9 0%,#2980b9 100%)",
              border: "0.7vw solid #002557",
              borderRadius: "2.5vw",
              minHeight: "38vw",
            }}
          >
            <div
              className="flex flex-col justify-center z-10 relative"
              style={{ padding: "2.4vw 0 2.4vw 2.4vw", maxWidth: "65%" }}
            >
              <h2 className="font-black italic uppercase leading-none" style={cardTitle("#4b9960", "#002557")}>
                БИЗНЕС<br />ПАК
              </h2>
              <p className="font-bold leading-[1.3]" style={cardDesc("#ffffff")}>
                x12 доход на 6 часов,<br />
                6 шнейне боксы, 66 FS,<br />
                1666 фишки, 66 пепе боксы<br />
                120 очки DRUN ROAD
              </p>
              <BuyBtn onClick={() => buy("biznes_pak")}>666 ⭐</BuyBtn>
            </div>
            <img
              src={imgBiznes}
              alt="Biznes"
              className="absolute bottom-0 right-0 z-30 pointer-events-none"
              style={{ height: "72%", width: "auto", objectFit: "contain", objectPosition: "bottom right" }}
            />
          </div>
        </div>

        {/* ③ VIP БУРМУЛДА ПАК — full-width gold card */}
        <div
          className="relative flex flex-row overflow-hidden"
          style={{
            background: "linear-gradient(90deg,#ffc500 0%,#ffad31 100%)",
            border: "0.7vw solid #744500",
            borderRadius: "2.5vw",
            marginBottom: "2.4vw",
            minHeight: "28vw",
          }}
        >
          <div
            className="flex flex-col justify-center z-10 shrink-0"
            style={{ padding: "3vw 0 3vw 3vw" }}
          >
            <div className="flex items-baseline" style={{ gap: "1.5vw", marginBottom: "1.4vw" }}>
              <span
                className="font-black italic uppercase leading-none"
                style={{
                  color: "#372505",
                  fontSize: "clamp(22px,8vw,34px)",
                  WebkitTextStroke: "0.2vw #1a1000",
                }}
              >
                VIP
              </span>
              <span
                className="font-black uppercase leading-tight"
                style={{
                  color: "#372505",
                  fontSize: "clamp(11px,3.6vw,16px)",
                  WebkitTextStroke: "0.15vw #1a1000",
                }}
              >
                БУРМУЛДА<br />ПАК
              </span>
            </div>
            <p
              className="font-bold leading-[1.35]"
              style={{
                color: "#372505",
                fontSize: "clamp(7px,2.1vw,10px)",
                marginBottom: "2vw",
              }}
            >
              x2 вся прибыль на 6 дней,<br />
              61666 билетов в начале<br />
              каждого турнира, 166 очков<br />
              DRUN ROAD, 6166 фишек,<br />
              16 шнейне боксов
            </p>
            <button
              onClick={() => buy("vip_burmulda")}
              className="inline-flex items-center justify-center gap-1 rounded-full border-[1px] font-bold active:translate-y-[2px] active:shadow-none transition-all duration-75 select-none whitespace-nowrap w-fit"
              style={{
                background: "radial-gradient(circle at 50% 50%, #c2a200, #bd8914)",
                borderColor: "#9e650c",
                color: "#000000",
                boxShadow: "0 0.7vw 0 #9e650c",
                padding: "0.5vw 4.5vw",
                fontSize: "clamp(9px,2.6vw,13px)",
              }}
            >
              1666 ⭐
            </button>
          </div>

          <img
            src={imgVip}
            alt="VIP Burmulda"
            className="block ml-auto"
            style={{
              width: "auto",
              height: "28vw",
              maxWidth: "45%",
              objectFit: "contain",
              objectPosition: "bottom center",
              alignSelf: "flex-end",
              mixBlendMode: "multiply",
            }}
          />
        </div>

        {/* ════ БОКСЫ ════ */}
        <SectionHeader label="БОКСЫ" />

        <div
          className="grid grid-cols-3"
          style={{ gap: "2.4vw", paddingBottom: "2.4vw" }}
        >
          {/* FA BOX */}
          <div
            className="flex flex-col items-center overflow-hidden"
            style={{
              background: "#b4b4b4",
              border: "0.7vw solid #6e6e6e",
              borderRadius: "2.5vw",
              boxShadow: "0 0.8vw 0 #4a4a4a",
              padding: "2vw 2vw 2.5vw",
              gap: "1.5vw",
            }}
          >
            <img src={imgBoxFa} alt="Фа Бокс" className="w-full" style={{ aspectRatio: "1", objectFit: "contain" }} />
            <span className="font-bold text-center" style={{ color: "#2a2a2a", fontSize: "clamp(8px,2.5vw,11px)" }}>Фа Бокс</span>
            <BuyBtn onClick={() => buy("box_fa")}>10 ⭐</BuyBtn>
          </div>

          {/* PEPE BOX */}
          <div
            className="flex flex-col items-center overflow-hidden"
            style={{
              background: "#53a00d",
              border: "0.7vw solid #274920",
              borderRadius: "2.5vw",
              boxShadow: "0 0.8vw 0 #1a3214",
              padding: "2vw 2vw 2.5vw",
              gap: "1.5vw",
            }}
          >
            <img src={imgBoxPepe} alt="Пепе Бокс" className="w-full" style={{ aspectRatio: "1", objectFit: "contain" }} />
            <span className="font-bold text-center text-white" style={{ fontSize: "clamp(8px,2.5vw,11px)" }}>Пепе Бокс</span>
            <BuyBtn onClick={() => buy("box_pepe")}>40 ⭐</BuyBtn>
          </div>

          {/* SHNEINE BOX */}
          <div
            className="flex flex-col items-center overflow-hidden"
            style={{
              background: "radial-gradient(circle at 50% 50%, #ffc500, #bd8914)",
              border: "0.7vw solid #9e650c",
              borderRadius: "2.5vw",
              boxShadow: "0 0.8vw 0 #744500",
              padding: "2vw 2vw 2.5vw",
              gap: "1.5vw",
            }}
          >
            <img src={imgBoxShneine} alt="Шнейне Бокс" className="w-full" style={{ aspectRatio: "1", objectFit: "contain" }} />
            <span className="font-bold text-center" style={{ color: "#372505", fontSize: "clamp(8px,2.5vw,11px)" }}>Шнейне Бокс</span>
            <BuyBtn onClick={() => buy("box_shneine")}>100 ⭐</BuyBtn>
          </div>
        </div>

        {/* ════ ФИШКИ + БИЛЕТЫ (Shop component) ════ */}
        <Shop />

      </main>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50">
        <SnackBar activeTab={0} />
      </div>
    </div>
  );
};

export default Page20;