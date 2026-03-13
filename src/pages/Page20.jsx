import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { doStoreBuy, doOpenBox, fetchState } from '../redux/gameSlice';
import pageBg from '../assets/page1bg.webp';
import SnackBar from '../components/SnackBar';

import imgPakDrunov  from '../assets/page20Items/pak-drunov.webp';
import imgVatafaPak  from '../assets/page20Items/vatafa-pak.webp';
import imgBiznesPak  from '../assets/page20Items/biznes-pak.webp';
import imgVipPak     from '../assets/page20Items/vip-pak.webp';
import imgBoxFa      from '../assets/page20Items/box-fa.webp';
import imgBoxPepe    from '../assets/page20Items/box-pepe.webp';
import imgBoxShneyne from '../assets/page20Items/box-shneyne.webp';

// ── Safely read box count from ANY backend shape ──────────────
const getBoxCount = (inventory, user, boxKey) => {
  const keys = [boxKey, `box_${boxKey}`, `${boxKey}_box`];
  const inv  = inventory ?? user?.inventory ?? null;
  if (inv) {
    if (!Array.isArray(inv)) {
      for (const k of keys) if (inv[k] != null) return Number(inv[k]);
      const nested = inv.boxes ?? inv.items ?? null;
      if (nested) for (const k of keys) if (nested[k] != null) return Number(nested[k]);
    } else {
      const found = inv.find(x => keys.includes(x.key) || keys.includes(x.type));
      if (found) return Number(found.qty ?? found.count ?? 0);
    }
  }
  if (user) {
    const ub = user.boxes;
    if (ub && typeof ub === 'object')
      for (const k of keys) if (ub[k] != null) return Number(ub[k]);
    for (const k of keys) if (user[k] != null) return Number(user[k]);
  }
  return 0;
};

// ── Reusable UI ──────────────────────────────────────────────

const SectionLabel = ({ children }) => (
  <div className="flex justify-center my-3">
    <div
      className="px-10 py-1.5 rounded-full font-black text-black uppercase tracking-widest text-[15px] border-2 border-[#8a6000] shadow-[0_3px_0_#6a4000]"
      style={{ background: 'linear-gradient(180deg,#f0c020,#c89000)' }}
    >
      {children}
    </div>
  </div>
);

const PricePill = ({ price, crossed, dark }) => (
  <div className="flex items-center gap-1.5">
    {crossed && (
      <span
        className="line-through font-black text-[13px]"
        style={{ color: dark ? 'rgba(0,0,0,0.45)' : 'rgba(255,255,255,0.55)' }}
      >
        {crossed}
      </span>
    )}
    <div
      className="flex items-center gap-1 rounded-full font-black text-black px-3 py-1 border border-[#8a6000]"
      style={{
        background: 'linear-gradient(180deg,#f0c020,#c89000)',
        fontSize: 13,
        boxShadow: '0 2px 0 #7a5000',
      }}
    >
      {price} <span className="text-[14px]">☆</span>
    </div>
  </div>
);

// Lock icon SVG — no emoji
const LockIcon = () => (
  <svg width="22" height="26" viewBox="0 0 22 26" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="11" width="20" height="14" rx="3" fill="rgba(0,0,0,0.7)" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5"/>
    <path d="M6 11V7.5C6 4.46 8.24 2 11 2s5 2.46 5 5.5V11" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" fill="none"/>
    <circle cx="11" cy="17" r="2.5" fill="rgba(255,255,255,0.55)"/>
    <rect x="10" y="17" width="2" height="3.5" rx="1" fill="rgba(255,255,255,0.55)"/>
  </svg>
);

// ── Page20 ───────────────────────────────────────────────────

const Page20 = () => {
  const dispatch      = useDispatch();
  const user          = useSelector(s => s.game.user);
  const inventory     = useSelector(s => s.game.inventory);

  const [msg, setMsg] = useState(null);
  const [openingBox, setOpeningBox] = useState(null);

  const stars = user?.stars ?? 0;

  const showMsg = (text, ok = true) => {
    setMsg({ text, ok });
    setTimeout(() => setMsg(null), 3000);
  };

  // ── Box counts ────────────────────────────────────────────
  const faCount      = getBoxCount(inventory, user, 'fa');
  const pepeCount    = getBoxCount(inventory, user, 'pepe');
  const shneineCount = getBoxCount(inventory, user, 'shneine');

  // All 3 boxes always shown; count=0 means locked
  const BOX_CONFIGS = [
    {
      key: 'fa',      img: imgBoxFa,      label: 'Фа Бокс',     price: '10',  count: faCount,
      cardBg: 'linear-gradient(180deg,#c8c8c8,#989898)', cardBorder: '#b0b0b0', cardShadow: '#707070',
      footerBg: 'linear-gradient(180deg,#b0b0b0,#888)', footerBorder: '#707070', nameColor: '#111',
    },
    {
      key: 'pepe',    img: imgBoxPepe,    label: 'Пепе Бокс',   price: '40',  count: pepeCount,
      cardBg: 'linear-gradient(180deg,#3a8a10,#1a5a08)', cardBorder: '#5aba20', cardShadow: '#0d3a04',
      footerBg: 'linear-gradient(180deg,#2a7a08,#1a5004)', footerBorder: '#0d3a04', nameColor: '#fff',
    },
    {
      key: 'shneine', img: imgBoxShneyne, label: 'Шнейне Бокс', price: '100', count: shneineCount,
      cardBg: 'linear-gradient(180deg,#1a6010,#0a3a08)', cardBorder: '#5aba20', cardShadow: '#062004',
      footerBg: 'linear-gradient(180deg,#0e4a08,#062004)', footerBorder: '#062004', nameColor: '#fff',
    },
  ];

  // ── Handlers ─────────────────────────────────────────────
  const handleBuy = async (key, qty = 1, label = 'товар') => {
    const result = await dispatch(doStoreBuy({ key, qty }));
    if (doStoreBuy.fulfilled.match(result)) {
      await dispatch(fetchState());
      showMsg(`${label} куплен!`, true);
    } else {
      showMsg(result.payload || 'Ошибка покупки', false);
    }
  };

  const handleOpenBox = async (box) => {
    if (box.count === 0) return; // locked — do nothing
    setOpeningBox(box.key);
    const result = await dispatch(doOpenBox(box.key));
    if (doOpenBox.fulfilled.match(result)) {
      await dispatch(fetchState());
      const reward = result.payload?.reward;
      showMsg(reward ? `${box.label}: ${JSON.stringify(reward)}` : `${box.label} открыт!`, true);
    } else {
      showMsg(result.payload || 'Ошибка открытия', false);
    }
    setTimeout(() => setOpeningBox(null), 600);
  };

  return (
    <div
      className="relative max-w-[430px] mx-auto h-[100dvh] flex flex-col overflow-hidden"
      style={{
        backgroundImage: `url(${pageBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        fontFamily: "'Nunito','Segoe UI',sans-serif",
      }}
    >
      {/* ── SNACKBAR ── */}
      {msg && (
        <div
          className={`absolute top-2 left-3 right-3 z-[9999] rounded-xl px-3.5 py-2.5 text-center font-black text-[13px] text-white border border-white/15 shadow-[0_4px_20px_rgba(0,0,0,0.5)] pointer-events-none transition-all ${
            msg.ok ? 'bg-green-800/95' : 'bg-red-800/95'
          }`}
        >
          {msg.text}
        </div>
      )}

      {/* ── HEADER ── */}
      <div
        className="shrink-0 flex flex-col items-center pt-2 pb-1.5"
        style={{ background: 'linear-gradient(180deg,#c8c8c8,#a0a0a0)' }}
      >
        <span className="font-black text-black uppercase tracking-widest text-[11px]">DRUN FAMILY</span>
        <div className="flex items-center w-full px-4 my-0.5">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-black/60" />
          <span className="font-bold mx-2 uppercase text-black text-[8px] tracking-[0.3em]">GAME</span>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-black/60" />
        </div>
        <span
          className="font-black uppercase tracking-[0.12em]"
          style={{
            fontSize: 'clamp(28px,9vw,38px)',
            color: '#c89000',
            textShadow: '0 2px 0 #8a6000, 0 0 24px rgba(200,144,0,0.4)',
          }}
        >
          МАГАЗИН
        </span>
        {/* Stars balance — no store balance per requirements */}
        <div
          className="flex items-center gap-1 rounded-full px-3 py-0.5 mb-1 border border-[#8a6000]"
          style={{ background: 'linear-gradient(180deg,#f0c020,#c89000)' }}
        >
          <span className="font-black text-black text-[13px]">☆ {stars.toLocaleString()}</span>
        </div>
      </div>

      {/* ── SCROLLABLE BODY ── */}
      <div
        className="flex-1 overflow-y-auto overscroll-contain pb-24 px-2.5"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <SectionLabel>АКЦИИ</SectionLabel>

        {/* ── ПАК ДРУНОВ — full-width green banner ── */}
        <div
          className="relative rounded-2xl overflow-hidden mb-2.5 border-2 border-[#5aba20] active:scale-[0.98] transition-transform cursor-pointer"
          style={{
            height: 160,
            background: 'linear-gradient(135deg,#2a8a10 0%,#1a6008 100%)',
            boxShadow: '0 5px 0 #0a3004',
          }}
          onClick={() => handleBuy('pack_drun', 1, 'Пак Друнов')}
        >
          {/* Red corner badge */}
          <div
            className="absolute top-0 right-0 z-10 px-2 py-1 font-black text-white text-center leading-tight rounded-bl-2xl rounded-tr-[14px] text-[9px] uppercase"
            style={{ background: 'linear-gradient(135deg,#dd1010,#aa0000)' }}
          >
            25 USDT В<br />ПОДАРОК
          </div>

          {/* Left: text */}
          <div className="absolute inset-y-0 left-0 w-[50%] flex flex-col justify-between p-3 z-10">
            <div>
              <p
                className="font-black text-yellow-300 uppercase leading-tight m-0"
                style={{ fontSize: 'clamp(17px,5vw,22px)', textShadow: '0 1px 6px rgba(0,0,0,0.6)' }}
              >
                ПАК ДРУНОВ
              </p>
              <p className="text-white font-semibold leading-snug mt-1 text-[10px] m-0">
                +44% прибыли друнов<br />
                1111 фишек, 333 FS,<br />
                222 очка в DRUN ROAD
              </p>
            </div>
            <PricePill price="321" />
          </div>

          {/* Right: person image fills & overflows top */}
          <div className="absolute right-0 top-0 w-[52%] h-full">
            <img
              src={imgPakDrunov}
              alt="Пак Друнов"
              className="w-full h-full object-cover object-top"
            />
          </div>
        </div>

        {/* ── ВАТАФА + БИЗНЕС — 2-col ── */}
        <div className="grid grid-cols-2 gap-2 mb-2.5">

          {/* Grey — Ватафа */}
          <div
            className="relative rounded-2xl overflow-hidden border-2 border-[#272626] cursor-pointer active:scale-[0.97] transition-transform"
            style={{
              height: 185,
              background: 'linear-gradient(180deg,#6e6e6e,#5a5a5a)',
              boxShadow: '0 4px 0 #222',
            }}
            onClick={() => handleBuy('pack_watafa', 1, 'Ватафа Пак')}
          >
            <div className="absolute inset-y-0 left-0 w-[55%] flex flex-col justify-between p-2.5 z-10">
              <div>
                <p className="font-black text-yellow-300 uppercase leading-tight m-0 text-[13px]">
                  ВАТАФА<br />ПАК
                </p>
                <p className="text-white/90 leading-snug mt-1 text-[8.5px] m-0">
                  +20% прибыли за тап<br />
                  7 пепе боксов, 77FS<br />
                  777 фишек<br />
                  77 очков DRUN ROAD
                </p>
              </div>
              <PricePill price="249" crossed="777" />
            </div>
            <div className="absolute right-0 top-0 w-[48%] h-full">
              <img
                src={imgVatafaPak}
                alt="Ватафа Пак"
                className="w-full object-cover object-top"
                style={{ height: '120%', marginTop: '-10%' }}
              />
            </div>
          </div>

          {/* Blue — Бизнес */}
          <div
            className="relative rounded-2xl overflow-hidden border-2 border-[#272626] cursor-pointer active:scale-[0.97] transition-transform"
            style={{
              height: 185,
              background: 'linear-gradient(180deg,#26a4e3,#1a7ab0)',
              boxShadow: '0 4px 0 #0e4a70',
            }}
            onClick={() => handleBuy('pack_business', 1, 'Бизнес Пак')}
          >
            <div
              className="absolute top-0 right-0 z-10 px-1.5 py-0.5 font-black text-white text-center leading-tight rounded-bl-xl rounded-tr-2xl text-[8px] uppercase"
              style={{ background: 'linear-gradient(135deg,#dd1010,#aa0000)' }}
            >
              САМОЕ<br />ВЫГОДНОЕ
            </div>
            <div className="absolute inset-y-0 left-0 w-[55%] flex flex-col justify-between p-2.5 z-10">
              <div>
                <p className="font-black text-white uppercase leading-tight m-0 text-[13px]">
                  БИЗНЕС<br />ПАК
                </p>
                <p className="text-white/90 leading-snug mt-1 text-[8.5px] m-0">
                  х12 доход на 6 часов,<br />
                  6 шнейне боксы, 66FS,<br />
                  1666 фишки, 66 пепе<br />
                  120 очки DRUN ROAD
                </p>
              </div>
              <PricePill price="666" />
            </div>
            <div className="absolute right-0 top-0 w-[48%] h-full">
              <img
                src={imgBiznesPak}
                alt="Бизнес Пак"
                className="w-full object-cover object-top"
                style={{ height: '120%', marginTop: '-10%' }}
              />
            </div>
          </div>
        </div>

        {/* ── VIP GOLD — full-width banner ── */}
        <div
          className="relative rounded-2xl overflow-hidden mb-2.5 border-2 border-[#7a4000] cursor-pointer active:scale-[0.98] transition-transform"
          style={{
            height: 160,
            background: 'linear-gradient(90deg,#ffc500,#ffad31)',
            boxShadow: '0 5px 0 #372505',
          }}
          onClick={() => handleBuy('pack_burmulda', 1, 'VIP Бурмулда Пак')}
        >
          <div className="absolute inset-y-0 left-0 w-[62%] flex flex-col justify-between p-3 z-10">
            <div>
              <p
                className="font-black text-black uppercase leading-tight m-0"
                style={{ fontSize: 'clamp(18px,5.5vw,24px)' }}
              >
                VIP <span style={{ fontSize: 'clamp(13px,4vw,17px)' }}>БУРМУЛДА ПАК</span>
              </p>
              <p className="text-black/70 font-semibold leading-snug mt-1.5 text-[9.5px] m-0">
                x2 вся прибыль на 6 дней, 61666 билетов<br />
                в начале каждого турнира, 166 очков<br />
                DRUN ROAD, 6166 фишек, 16 шнейне боксов
              </p>
            </div>
            <PricePill price="1666" dark />
          </div>
          <div className="absolute right-0 bottom-0 w-[40%]" style={{ height: '130%' }}>
            <img
              src={imgVipPak}
              alt="VIP Бурмулда Пак"
              className="w-full h-full object-cover object-top"
            />
          </div>
        </div>

        {/* ── БОКСЫ — always shown; locked when count=0 ── */}
        <SectionLabel>БОКСЫ</SectionLabel>

        <div className="grid grid-cols-3 gap-2 mb-6">
          {BOX_CONFIGS.map((box) => {
            const locked   = box.count === 0;
            const isOpening = openingBox === box.key;

            return (
              <div
                key={box.key}
                className="rounded-2xl overflow-hidden flex flex-col transition-transform"
                style={{
                  background: box.cardBg,
                  border: `2px solid ${locked ? 'rgba(255,255,255,0.12)' : box.cardBorder}`,
                  boxShadow: locked ? '0 4px 0 rgba(0,0,0,0.5)' : `0 4px 0 ${box.cardShadow}`,
                  opacity: locked ? 0.72 : 1,
                  cursor: locked ? 'default' : 'pointer',
                  transform: isOpening ? 'scale(0.93)' : undefined,
                  filter: locked ? 'saturate(0.45) brightness(0.7)' : undefined,
                }}
                onClick={() => !locked && handleOpenBox(box)}
              >
                {/* Image area */}
                <div className="relative flex items-center justify-center p-3 pb-1">
                  <img
                    src={box.img}
                    alt={box.label}
                    className="w-full object-contain"
                    style={{ height: 88 }}
                  />

                  {/* Lock overlay — only when locked */}
                  {locked && (
                    <div
                      className="absolute inset-0 flex flex-col items-center justify-center gap-1"
                      style={{ background: 'rgba(0,0,0,0.45)' }}
                    >
                      <LockIcon />
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div
                  className="flex flex-col items-center gap-1 py-2 px-1"
                  style={{
                    background: box.footerBg,
                    borderTop: `1.5px solid ${locked ? 'rgba(255,255,255,0.08)' : box.footerBorder}`,
                  }}
                >
                  <p
                    className="font-black text-center text-[11px] m-0"
                    style={{ color: locked ? 'rgba(255,255,255,0.4)' : box.nameColor }}
                  >
                    {box.label}
                  </p>

                  {/* Unlocked: show count if >1, then open price */}
                  {!locked && (
                    <>
                      {box.count > 1 && (
                        <span className="font-bold text-[9px]" style={{ color: 'rgba(255,255,255,0.55)' }}>
                          x{box.count}
                        </span>
                      )}
                      <PricePill price={box.price} />
                    </>
                  )}

                  {/* Locked: show buy price dimmed */}
                  {locked && (
                    <div
                      className="flex items-center gap-1 rounded-full font-black px-2.5 py-0.5 border"
                      style={{
                        background: 'rgba(200,144,0,0.25)',
                        borderColor: 'rgba(138,96,0,0.4)',
                        fontSize: 11,
                        color: 'rgba(255,200,0,0.45)',
                      }}
                    >
                      {box.price} <span className="text-[12px]">☆</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>

      <SnackBar activeTab={0} />
    </div>
  );
};

export default Page20;