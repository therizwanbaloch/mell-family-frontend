import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { doTap, fetchState, fetchTournaments } from "../redux/gameSlice";
import { BsLightningChargeFill } from "react-icons/bs";
import { FaSackDollar } from "react-icons/fa6";
import { PiCursorClick } from "react-icons/pi";

import mainBg     from "../assets/page1bg.webp";
import profilePic from "../assets/page1bg.webp";
import coinImage  from "../assets/coin.webp";
import logoImg    from "../assets/logo.webp";
import layout1    from "../assets/layout1.webp";
import layout2    from "../assets/layout2.webp";
import layout3    from "../assets/layout3.webp";
import layout4    from "../assets/layout4.webp";
import layout5    from "../assets/layout5.webp";
import layout6    from "../assets/layout6.webp";
import layoutMain from "../assets/layoutMain.webp";

import UserProfile  from "../modals/UserProfile";
import BalanceModal from "../modals/BalanceModal";
import Page8Modal   from "../modals/Page8Modal";
import SnackBar     from "../components/SnackBar";

/* ─── Floating +FA label ─────────────────────────────────────── */
const FloatingLabel = ({ x, y, value }) => (
  <div style={{
    position: "fixed", left: x, top: y,
    transform: "translate(-50%,-50%)",
    pointerEvents: "none", zIndex: 9999,
    animation: "floatUp 0.85s ease-out forwards",
    color: "#FFD700", fontWeight: 900, fontSize: 18,
    textShadow: "0 2px 8px rgba(0,0,0,0.9),0 0 16px rgba(255,215,0,0.7)",
    whiteSpace: "nowrap",
  }}>+{value}</div>
);

/* ─── Side icon — size scales with dvh ──────────────────────── */
const SideIcon = ({ src, label, onClick, iconSize }) => (
  <div className="flex flex-col items-center gap-0.5 cursor-pointer active:opacity-70 transition-opacity" onClick={onClick}>
    <img
      src={src} alt={label}
      style={{
        width: iconSize, height: iconSize,
        borderRadius: 8, objectFit: "cover", display: "block",
        boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
      }}
    />
    <span className="text-white font-extrabold uppercase" style={{ fontSize: iconSize * 0.23, letterSpacing: "0.04em", textShadow: "0 1px 3px rgba(0,0,0,0.8)" }}>
      {label}
    </span>
  </div>
);

/* ─── Helpers ────────────────────────────────────────────────── */
const fmtFa    = (n) => Math.floor(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
const fmtShort = (n) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}М`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}К`;
  return String(Math.floor(n));
};

const GOLD_BTN = {
  background: "linear-gradient(180deg,#deba00,#c87800)",
  border: "2.5px solid #af8700",
  boxShadow: "0 3px 8px rgba(175,135,0,0.55)",
};

const GOLD = {
  background: "linear-gradient(180deg,#f0a800 0%,#da9d01 50%,#b87e00 100%)",
  border: "2px solid #b58030",
  boxShadow: "0 5px 0 #7a4e00, 0 7px 10px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.25)",
};

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, rates, tournaments, stateLoading } = useSelector((s) => s.game);

  const serverFa     = user?.fa           ?? 0;
  const serverEnergy = user?.energy       ?? 0;
  const faPerTap     = rates?.fa_per_tap  ?? 1;
  const faPerHour    = rates?.fa_per_hour ?? 0;
  const playerName   = user?.username || user?.first_name || "PLAYER";
  const profileLevel = user?.profile_level ?? 1;
  const mainLevel    = user?.main_level    ?? 1;
  const levelInMain  = ((profileLevel - 1) % 10) + 1;
  const progress     = (levelInMain / 10) * 100;
  const maxEnergy    = 1000;

  const [localFa,     setLocalFa]     = useState(null);
  const [localEnergy, setLocalEnergy] = useState(null);
  const [tapping,     setTapping]     = useState(false);
  const [floats,      setFloats]      = useState([]);

  /* ── dvh-based scale factor computed once on mount/resize ── */
  const [dvh, setDvh] = useState(window.innerHeight / 100);
  useEffect(() => {
    const onResize = () => setDvh(window.innerHeight / 100);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* All key sizes scale with dvh:
     - reference screen 844px tall = 8.44dvh per 100px
     - tap image: 150px on 844px → 17.8dvh, clamped 130–220px
     - side icons: 34px on 844px → 4dvh, clamped 30–52px
     - coin: 56px on 844px → 6.6dvh, clamped 44–72px
     - balance font: 24px on 844px → 2.8dvh, clamped 20–32px
  */
  const tapSize   = Math.min(220, Math.max(130, dvh * 17.8));
  const iconSize  = Math.min(52,  Math.max(30,  dvh * 4.0));
  const coinSize  = Math.min(72,  Math.max(44,  dvh * 6.6));
  const balFont   = Math.min(32,  Math.max(20,  dvh * 2.8));
  const profileH  = Math.min(54,  Math.max(40,  dvh * 5.5));  /* profile avatar */
  const rateFont  = Math.min(11,  Math.max(8,   dvh * 1.0));  /* rate pill text */
  const btmGap    = Math.min(14,  Math.max(6,   dvh * 1.0));  /* gap between timer & energy */

  const displayFa     = localFa     !== null ? localFa     : serverFa;
  const displayEnergy = localEnergy !== null ? localEnergy : serverEnergy;
  const energyPct     = Math.max(0, Math.min(100, (displayEnergy / maxEnergy) * 100));
  const energyLow     = energyPct <= 30;

  const [profileOpen,  setProfileOpen]  = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [showPage8,    setShowPage8]    = useState(false);

  const [timeLeft, setTimeLeft] = useState("--:--:--");
  useEffect(() => { dispatch(fetchTournaments()); }, [dispatch]);
  useEffect(() => {
    const endTs = tournaments?.ticket_tournament?.end_ts;
    if (!endTs) return;
    const tick = () => {
      const d = Math.max(0, endTs - Math.floor(Date.now() / 1000));
      setTimeLeft(
        `${String(Math.floor(d / 3600)).padStart(2,"0")}:` +
        `${String(Math.floor((d % 3600) / 60)).padStart(2,"0")}:` +
        `${String(d % 60).padStart(2,"0")}`
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [tournaments]);

  const floatIdRef   = useRef(0);
  const tapBufferRef = useRef(0);
  const tapTimerRef  = useRef(null);
  const localEngRef  = useRef(null);
  localEngRef.current = localEnergy;

  const flushTaps = useCallback(() => {
    const count = tapBufferRef.current;
    tapBufferRef.current = 0;
    tapTimerRef.current  = null;
    if (count <= 0) return;
    setTapping(false);
    dispatch(doTap(count)).then(() => {
      dispatch(fetchState()).then(() => {
        setLocalFa(null);
        setLocalEnergy(null);
      });
    });
  }, [dispatch]);

  const handleTap = useCallback((e) => {
    e.preventDefault();
    const touches = e.touches || e.changedTouches;
    const points  = touches ? Array.from(touches) : [{ clientX: e.clientX, clientY: e.clientY }];
    const curEnergy = localEngRef.current !== null ? localEngRef.current : serverEnergy;
    if (curEnergy <= 0) return;
    const tapsNow = Math.min(points.length, curEnergy);

    setLocalFa((prev)     => (prev !== null ? prev : serverFa) + faPerTap * tapsNow);
    setLocalEnergy((prev) => Math.max(0, (prev !== null ? prev : serverEnergy) - tapsNow));
    setTapping(true);

    points.slice(0, tapsNow).forEach(({ clientX, clientY }) => {
      const id = floatIdRef.current++;
      setFloats((prev) => [...prev, { id, x: clientX, y: clientY }]);
      setTimeout(() => setFloats((prev) => prev.filter((f) => f.id !== id)), 900);
    });

    tapBufferRef.current += tapsNow;
    if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
    tapTimerRef.current = setTimeout(flushTaps, 300);
  }, [serverFa, serverEnergy, faPerTap, flushTaps]);

  const leftIcons = [
    { src: layout1, label: "ТУРНИРЫ", action: () => setShowPage8(true) },
    { src: layout2, label: "БОКСЫ",   action: () => navigate("/page20") },
    { src: layout3, label: "ПОДАРОК", action: () => {} },
  ];
  const rightIcons = [
    { src: layout4, label: "СЛОТЫ",   action: () => navigate("/page24") },
    { src: layout5, label: "AVIATOR", action: () => navigate("/page25") },
    { src: layout6, label: "BETON",   action: () => {} },
  ];

  return (
    <div
      className="max-w-[430px] mx-auto h-dvh overflow-hidden flex flex-col bg-cover bg-center"
      style={{ backgroundImage: `url(${mainBg})`, fontFamily: "'Nunito', sans-serif" }}
    >
      <style>{`
        @keyframes floatUp {
          0%   { opacity:1; transform:translate(-50%,-50%) scale(1.3); }
          100% { opacity:0; transform:translate(-50%,-100px) scale(0.9); }
        }
        @keyframes tapBounce {
          0%,100% { transform:scale(1); }
          50%     { transform:scale(0.92); }
        }
      `}</style>

      {floats.map((f) => (
        <FloatingLabel key={f.id} x={f.x} y={f.y} value={fmtShort(faPerTap)} />
      ))}

      {/* ══ LOGO — scales with dvh ══ */}
      <img
        src={logoImg}
        alt="DRUN FAMILY"
        style={{
          height: `${Math.min(160, Math.max(80, dvh * 14))}px`,
          width: "80%",
          marginLeft: "auto", marginRight: "auto",
          marginTop: `${dvh * 0.5}px`,
          objectFit: "contain", display: "block", flexShrink: 0,
          filter: "drop-shadow(0 0 14px rgba(255,210,0,0.5))",
        }}
      />

      {/* ══ PROFILE ROW ══ */}
      <div
        className="flex items-center bg-neutral-900 rounded-xl shrink-0 w-full mx-1"
        style={{ marginTop: `${dvh * 0.8}px` }}
      >
        <div className="flex items-center w-full px-3 gap-1" style={{ paddingBlock: `${dvh * 0.7}px` }}>
          <div className="relative shrink-0 cursor-pointer" onClick={() => setProfileOpen(true)}>
            <img
              src={user?.photo_url || profilePic}
              alt="profile"
              onError={(e) => { e.target.src = profilePic; }}
              className="rounded-full object-cover border-2 border-yellow-400"
              style={{ width: profileH, height: profileH }}
            />
            <div style={{
              position: "absolute", bottom: -3, right: -3,
              width: 18, height: 18,
              background: "linear-gradient(135deg,#f0a800,#c87800)",
              border: "2px solid #8a5500",
              transform: "rotate(45deg)",
              display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10,
            }}>
              <span style={{ transform: "rotate(-45deg)", fontSize: 9, fontWeight: 900, color: "#fff", lineHeight: 1 }}>
                {mainLevel}
              </span>
            </div>
          </div>

          <div className="flex flex-col flex-1 min-w-0 gap-1">
            <p className="text-white font-semibold truncate m-0" style={{ fontSize: `${Math.min(15, Math.max(12, dvh * 1.6))}px` }}>
              {stateLoading ? "..." : playerName}
            </p>
            <div style={{ position: "relative", width: "100%", height: 5, borderRadius: 99, overflow: "visible" }}>
              <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${progress}%`, background: "#b58030", borderRadius: 99 }} />
              <div style={{ position: "absolute", left: `${progress}%`, top: 0, height: "100%", width: `${100 - progress}%`, background: "#4b4b4b", borderRadius: 99 }} />
              <div style={{ position: "absolute", right: -9, top: "50%", transform: "translateY(-50%) rotate(45deg)", width: 18, height: 18, background: "#53a00d", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10 }}>
                <span style={{ transform: "rotate(-45deg)", fontSize: 9, fontWeight: 900, color: "#fff", lineHeight: 1 }}>
                  {Math.min(levelInMain + 1, 10)}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); setWithdrawOpen(true); }}
            className="shrink-0 font-black uppercase cursor-pointer"
            style={{ ...GOLD_BTN, borderRadius: 18, padding: "6px 14px", color: "#fff", fontSize: `${Math.min(13, Math.max(10, dvh * 1.3))}px`, letterSpacing: "0.05em", whiteSpace: "nowrap" }}
          >
            ВЫВОД
          </button>
        </div>
      </div>

      {/* ══ BALANCE ══ */}
      <div
        className="flex items-center justify-center shrink-0 gap-1"
        style={{ paddingTop: `${dvh * 0.7}px`, paddingBottom: `${dvh * 0.3}px` }}
      >
        <img src={coinImage} alt="fa" style={{ width: coinSize, height: coinSize, objectFit: "contain" }} />
        <span
          className="text-white font-black"
          style={{
            fontFamily: "Days One",
            fontSize: `${balFont}px`,
            letterSpacing: "0.06em",
            textShadow: "0 2px 10px rgba(0,0,0,0.9)",
          }}
        >
          {fmtFa(displayFa)}
        </span>
      </div>

      {/* ══ RATES ══ */}
      <div
        className="flex items-center justify-center shrink-0 gap-2.5"
        style={{ paddingBottom: `${dvh * 0.6}px` }}
      >
        <div className="flex items-center gap-1.5 px-2 rounded-full"
          style={{ background: "linear-gradient(180deg,#5ecb1a,#3a9010)", border: "2px solid #2a6a08", boxShadow: "0 2px 8px rgba(0,0,0,0.4)" }}>
          <span className="text-white font-black whitespace-nowrap" style={{ fontSize: rateFont }}>
            {stateLoading ? "..." : `${fmtShort(faPerHour)}В/час`}
          </span>
          <FaSackDollar color="#fff" size={rateFont + 1} />
        </div>
        <div className="flex items-center gap-1.5 px-2 rounded-full"
          style={{ background: "linear-gradient(180deg,#f0a800,#c87800)", border: "2px solid #8a5500", boxShadow: "0 2px 8px rgba(0,0,0,0.4)" }}>
          <span className="text-white font-black whitespace-nowrap" style={{ fontSize: rateFont }}>
            {stateLoading ? "..." : `${fmtShort(faPerTap)}М/тап`}
          </span>
          <PiCursorClick color="#fff" size={rateFont + 1} />
        </div>
      </div>

      {/* ══ BATTLE AREA — flex-1 fills remaining, capped so short screens don't overflow ══ */}
      <div className="min-h-0 flex flex-col" style={{ flex: "1 1 0", maxHeight: `${dvh * 42}px` }}>
        <div className="flex items-center justify-between flex-1 px-2">
          <div className="flex flex-col items-center" style={{ gap: `${dvh * 1.5}px` }}>
            {leftIcons.map(({ src, label, action }) => (
              <SideIcon key={label} src={src} label={label} onClick={action} iconSize={iconSize} />
            ))}
          </div>

          {/* Tap button — size scales with dvh */}
          <div
            onTouchStart={handleTap}
            onClick={handleTap}
            className="relative cursor-pointer shrink-0 select-none"
            style={{
              WebkitTapHighlightColor: "transparent",
              animation: tapping ? "tapBounce 0.15s ease" : "none",
              width: tapSize,
            }}
          >
            <img
              src={layoutMain} alt="tap" draggable={false}
              style={{
                width: tapSize, height: tapSize,
                objectFit: "contain", display: "block",
                WebkitUserSelect: "none", userSelect: "none",
                filter: "drop-shadow(0 0 16px rgba(255,215,0,0.35))",
              }}
            />
            <svg
              viewBox={`0 0 ${tapSize} 48`}
              style={{
                position: "absolute",
                bottom: -6, left: 0,
                width: tapSize, height: 48,
                pointerEvents: "none",
              }}
            >
              <defs>
                <path id="tapCurve" d={`M 8,42 Q ${tapSize/2},6 ${tapSize-8},42`} />
              </defs>
              <text style={{ fill: "#fff", fontSize: `${Math.min(24, Math.max(16, dvh * 2.4))}px`, fontWeight: 900, letterSpacing: "0.28em", fontFamily: "inherit" }}>
                <textPath href="#tapCurve" startOffset="50%" textAnchor="middle">ТАП</textPath>
              </text>
            </svg>
          </div>

          <div className="flex flex-col items-center" style={{ gap: `${dvh * 1.5}px` }}>
            {rightIcons.map(({ src, label, action }) => (
              <SideIcon key={label} src={src} label={label} onClick={action} iconSize={iconSize} />
            ))}
          </div>
        </div>
      </div>

      {/* ══ BOTTOM BUTTONS ══ */}
      <div
        className="relative z-20 w-[92%] mx-auto flex flex-col shrink-0"
        style={{ gap: `${btmGap}px`, paddingBottom: `${dvh * 14}px` }}
      >
        {/* Timer */}
        <div
          onClick={() => navigate("/nine")}
          className="px-4 rounded-xl cursor-pointer active:scale-[0.97] transition-transform"
          style={{ paddingBlock: `${dvh * 0.8}px`, width: "fit-content", ...GOLD }}
        >
          <h2
            className="font-black uppercase leading-tight m-0"
            style={{ fontSize: `${Math.min(15, Math.max(10, dvh * 1.5))}px`, color: "#412c05", textShadow: "0 1px 0 rgba(255,255,255,0.2)", whiteSpace: "nowrap" }}
          >
            УСПЕЙ<br />ПОБЕДИТЬ!
          </h2>
          <h3 className="font-black m-0" style={{ fontSize: `${Math.min(26, Math.max(16, dvh * 2.4))}px`, color: "#000" }}>
            {timeLeft}
          </h3>
        </div>

        {/* Energy bar + УЛУЧШАЙ */}
        <div className="flex items-center gap-1">
          <div
            className="shrink-0 rounded-full flex items-center justify-center z-10 -mr-3"
            style={{
              width: `${Math.min(48, Math.max(34, dvh * 4.5))}px`,
              height: `${Math.min(48, Math.max(34, dvh * 4.5))}px`,
              background: "linear-gradient(180deg,#ffe033,#FFD700)",
              border: "2px solid #b58030",
              boxShadow: "0 4px 0 #7a4e00, 0 6px 8px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.3)",
            }}
          >
            <BsLightningChargeFill color="#000" style={{ fontSize: `${Math.min(22, Math.max(14, dvh * 2))}px` }} />
          </div>

          <div
            className="flex-1 rounded-xl overflow-hidden relative"
            style={{
              paddingLeft: `${Math.min(26, Math.max(18, dvh * 2.4))}px`,
              height: `${Math.min(48, Math.max(34, dvh * 4.5))}px`,
              background: "rgba(0,0,0,0.45)",
              border: "2px solid #FFD700",
              boxShadow: "0 4px 0 #1a5c00, 0 6px 8px rgba(0,0,0,0.4)",
            }}
          >
            <div
              className="absolute inset-0 rounded-[inherit] transition-[width,background] duration-300"
              style={{
                width: `${energyPct}%`,
                background: energyLow
                  ? "linear-gradient(180deg,#ff6600,#ff3300)"
                  : "linear-gradient(180deg,#53a00d,#0ab621)",
              }}
            />
            <span
              className="absolute inset-0 flex items-center justify-center font-black z-10 whitespace-nowrap text-white"
              style={{ fontSize: `${Math.min(17, Math.max(11, dvh * 1.6))}px`, textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}
            >
              {Math.floor(displayEnergy)}/{maxEnergy}
            </span>
          </div>

          <button
            onClick={() => navigate("/page14")}
            className="shrink-0 rounded-xl font-black uppercase tracking-wide active:scale-95 transition-transform"
            style={{
              paddingInline: `${Math.min(20, Math.max(10, dvh * 1.8))}px`,
              paddingBlock: `${Math.min(12, Math.max(6, dvh * 1.0))}px`,
              fontSize: `${Math.min(17, Math.max(10, dvh * 1.5))}px`,
              color: "#412c05",
              textShadow: "0 1px 0 rgba(255,255,255,0.2)",
              whiteSpace: "nowrap",
              ...GOLD,
            }}
          >
            УЛУЧШАЙ
          </button>
        </div>
      </div>

      <Page8Modal   isOpen={showPage8}    onClose={() => setShowPage8(false)} />
      <UserProfile  isOpen={profileOpen}  onClose={() => setProfileOpen(false)} />
      <BalanceModal isOpen={withdrawOpen} onClose={() => setWithdrawOpen(false)} />
      <SnackBar />
    </div>
  );
};

export default Home;