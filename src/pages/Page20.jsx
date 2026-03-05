import React from 'react';
import { useNavigate } from 'react-router-dom';
import pageBg from '../assets/page1bg.webp';
import SnackBar from '../components/SnackBar';

import imgPakDrunov  from '../assets/page20Items/pak-drunov.webp';
import imgVatafaPak  from '../assets/page20Items/vatafa-pak.webp';
import imgBiznesPak  from '../assets/page20Items/biznes-pak.webp';
import imgVipPak     from '../assets/page20Items/vip-pak.webp';
import imgBoxFa      from '../assets/page20Items/box-fa.webp';
import imgBoxPepe    from '../assets/page20Items/box-pepe.webp';
import imgBoxShneyne from '../assets/page20Items/box-shneyne.webp';

const SectionLabel = ({ children }) => (
  <div className="flex justify-center my-2">
    <div
      className="px-10 py-1 rounded-full font-black text-black uppercase tracking-widest"
      style={{ fontSize: '15px', background: 'linear-gradient(180deg,#f0c020,#c89000)', border: '2px solid #8a6000', boxShadow: '0 3px 0 #6a4000' }}
    >
      {children}
    </div>
  </div>
);

const StarPrice = ({ price, crossed, dark }) => (
  <div className="flex items-center gap-1">
    {crossed && (
      <span className="line-through font-black" style={{ fontSize: '11px', color: dark ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.5)' }}>
        {crossed}
      </span>
    )}
    <div
      className="flex items-center gap-0.5 rounded-full font-black text-black"
      style={{ fontSize: '12px', padding: '3px 10px', background: 'linear-gradient(180deg,#f0c020,#c89000)', border: '1.5px solid #8a6000' }}
    >
      {price} <span style={{ fontSize: '13px' }}>☆</span>
    </div>
  </div>
);

const Page20 = () => {
  const navigate = useNavigate();

  return (
    <div
      className="w-full flex flex-col"
      style={{
        backgroundImage: `url(${pageBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        maxWidth: '430px',
        margin: '0 auto',
        height: '100dvh',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div className="flex flex-col items-center pt-2 pb-1 flex-shrink-0" style={{ background: 'linear-gradient(180deg,#c8c8c8,#a0a0a0)' }}>
        <span className="font-black text-black uppercase tracking-widest" style={{ fontSize: 'clamp(9px,2.8vw,13px)' }}>DRUN FAMILY</span>
        <div className="flex items-center w-full px-4 my-0.5">
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg,transparent,#000)' }} />
          <span className="font-bold mx-2 uppercase text-black" style={{ fontSize: 'clamp(7px,1.8vw,9px)', letterSpacing: '0.3em' }}>GAME</span>
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg,#000,transparent)' }} />
        </div>
        <span
          className="font-black uppercase"
          style={{ fontSize: 'clamp(26px,9vw,36px)', letterSpacing: '0.15em', color: '#c89000', textShadow: '0 2px 0 #8a6000, 0 0 20px rgba(200,144,0,0.4)' }}
        >
          МАГАЗИН
        </span>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto pb-20 px-2" style={{ WebkitOverflowScrolling: 'touch' }}>

        <SectionLabel>АКЦИИ</SectionLabel>

        {/* ── GREEN: Пак Друнов ── */}
        <div
          className="relative rounded-2xl overflow-hidden mb-2"
          style={{ height: '138px', background: 'linear-gradient(135deg,#2a8a10,#1a6008)', border: '2px solid #5aba20' }}
        >
          <div className="absolute top-0 right-0 z-10 px-2 py-1 font-black text-white text-center leading-tight rounded-bl-xl rounded-tr-2xl"
            style={{ background: 'linear-gradient(135deg,#dd1010,#aa0000)', fontSize: '10px' }}>
            25 USDT В<br />ПОДАРОК
          </div>
          <div className="flex h-full">
            <div className="flex flex-col justify-between p-3" style={{ width: '42%' }}>
              <div>
                <p className="font-black text-yellow-300 uppercase leading-tight" style={{ fontSize: 'clamp(15px,4.5vw,19px)', textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
                  ПАК ДРУНОВ
                </p>
                <p className="text-white font-semibold leading-snug mt-1" style={{ fontSize: '10px' }}>
                  +44% прибыли друнов<br />
                  1111 фишек, 333 FS,<br />
                  222 очка в DRUN ROAD
                </p>
              </div>
              <StarPrice price="321" />
            </div>
            <div className="flex items-end justify-center" style={{ width: '58%', height: '100%' }}>
              <img src={imgPakDrunov} alt="Пак Друнов"
                style={{ width: '100%', height: `${(8/9)*100}%`, objectFit: 'cover', objectPosition: 'top center' }} />
            </div>
          </div>
        </div>

        {/* ── GREY + BLUE ── */}
        <div className="grid grid-cols-2 gap-2 mb-2">

          {/* GREY — Ватафа Пак */}
          <div
            className="relative rounded-2xl overflow-hidden"
            style={{ height: '146px', background: 'linear-gradient(180deg,#6e6e6e,#5a5a5a)', border: '2px solid #272626' }}
          >
            <div className="flex h-full">
              <div className="flex flex-col justify-between p-2" style={{ width: '48%' }}>
                <div>
                  <p className="font-black text-yellow-300 uppercase leading-tight" style={{ fontSize: 'clamp(11px,3.2vw,14px)' }}>
                    ВАТАФА<br />ПАК
                  </p>
                  <p className="text-white/90 leading-snug mt-1" style={{ fontSize: '8.5px' }}>
                    +20% прибыли за тап<br />
                    7 пепе боксов, 77FS<br />
                    777 фишек<br />
                    77 очков в DRUN ROAD
                  </p>
                </div>
                <StarPrice price="249" crossed="777" />
              </div>
              <div className="flex items-end justify-center" style={{ width: '52%', height: '100%' }}>
                <img src={imgVatafaPak} alt="Ватафа Пак"
                  style={{ width: '100%', height: `${(8/9.5)*100}%`, objectFit: 'cover', objectPosition: 'top center' }} />
              </div>
            </div>
          </div>

          {/* BLUE — Бизнес Пак */}
          <div
            className="relative rounded-2xl overflow-hidden"
            style={{ height: '146px', background: 'linear-gradient(180deg,#26a4e3,#1a7ab0)', border: '2px solid #272626' }}
          >
            <div className="absolute top-0 right-0 z-10 px-1.5 py-0.5 font-black text-white text-center leading-tight rounded-bl-xl rounded-tr-2xl"
              style={{ background: 'linear-gradient(135deg,#dd1010,#aa0000)', fontSize: '8.5px' }}>
              САМОЕ<br />ВЫГОДНОЕ
            </div>
            <div className="flex h-full">
              <div className="flex flex-col justify-between p-2" style={{ width: '48%' }}>
                <div>
                  <p className="font-black text-white uppercase leading-tight" style={{ fontSize: 'clamp(11px,3.2vw,14px)' }}>
                    БИЗНЕС<br />ПАК
                  </p>
                  <p className="text-white/90 leading-snug mt-1" style={{ fontSize: '8.5px' }}>
                    х12 доход на 6 часов,<br />
                    6 шнейне боксы, 66 FS,<br />
                    1666 фишки, 66 пепе<br />
                    120 очки DRUN ROAD
                  </p>
                </div>
                <StarPrice price="666" />
              </div>
              <div className="flex items-end justify-center" style={{ width: '52%', height: '100%' }}>
                <img src={imgBiznesPak} alt="Бизнес Пак"
                  style={{ width: '100%', height: `${(8/9.5)*100}%`, objectFit: 'cover', objectPosition: 'top center' }} />
              </div>
            </div>
          </div>
        </div>

        {/* ── VIP GOLD ── */}
        <div
          className="relative rounded-2xl overflow-hidden mb-2"
          style={{
            height: '138px',
            background: 'linear-gradient(90deg,#ffc500,#ffad31)',
            border: '2px solid #372505',
            boxShadow: '0 5px 0 #372505',
          }}
        >
          <div className="flex h-full">
            <div className="flex flex-col justify-between p-3" style={{ width: '75%' }}>
              <div>
                <p className="font-black text-black uppercase leading-none" style={{ fontSize: 'clamp(20px,6.5vw,28px)' }}>
                  VIP
                  <span className="font-black text-black" style={{ fontSize: 'clamp(13px,3.8vw,17px)' }}> БУРМУЛДА ПАК</span>
                </p>
                <p className="text-black/75 font-semibold leading-snug mt-1" style={{ fontSize: '10px' }}>
                  x2 вся прибыль на 6 дней, 61666 билетов в<br />
                  начале каждого турнира, 166 очков DRUN<br />
                  ROAD, 6166 фишек, 16 шнейне боксов
                </p>
              </div>
              <StarPrice price="1666" dark />
            </div>
            <div className="relative shrink-0" style={{ width: '25%', height: '100%', overflow: 'visible' }}>
              <img src={imgVipPak} alt="VIP Бурмулда Пак"
                style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: `${(10/9)*100}%`, objectFit: 'cover', objectPosition: 'top center' }} />
            </div>
          </div>
        </div>

        {/* ── БОКСЫ ── */}
        <SectionLabel>БОКСЫ</SectionLabel>

        <div className="grid grid-cols-3 gap-2 mb-4">

          {/* Фа Бокс — grey */}
          <div
            className="rounded-2xl overflow-hidden flex flex-col"
            style={{ background: 'linear-gradient(180deg,#c8c8c8,#989898)', border: '2px solid #b0b0b0', boxShadow: '0 3px 0 #707070' }}
          >
            <div className="flex-1 flex items-center justify-center p-2">
              <img src={imgBoxFa} alt="Фа Бокс" className="w-full object-contain" style={{ maxHeight: '80px' }} />
            </div>
            <div
              className="flex flex-col items-center gap-1 py-1.5"
              style={{ background: 'linear-gradient(180deg,#b0b0b0,#888)', borderTop: '1.5px solid #707070' }}
            >
              <p className="text-black font-black text-center" style={{ fontSize: '11px' }}>Фа Бокс</p>
              <StarPrice price="10" />
            </div>
          </div>

          {/* Пепе Бокс — green */}
          <div
            className="rounded-2xl overflow-hidden flex flex-col"
            style={{ background: 'linear-gradient(180deg,#3a8a10,#1a5a08)', border: '2px solid #5aba20', boxShadow: '0 3px 0 #0d3a04' }}
          >
            <div className="flex-1 flex items-center justify-center p-2">
              <img src={imgBoxPepe} alt="Пепе Бокс" className="w-full object-contain" style={{ maxHeight: '80px' }} />
            </div>
            <div
              className="flex flex-col items-center gap-1 py-1.5"
              style={{ background: 'linear-gradient(180deg,#2a7a08,#1a5004)', borderTop: '1.5px solid #0d3a04' }}
            >
              <p className="text-white font-black text-center" style={{ fontSize: '11px' }}>Пепе Бокс</p>
              <StarPrice price="40" />
            </div>
          </div>

          {/* Шнейне Бокс — dark green */}
          <div
            className="rounded-2xl overflow-hidden flex flex-col"
            style={{ background: 'linear-gradient(180deg,#1a6010,#0a3a08)', border: '2px solid #5aba20', boxShadow: '0 3px 0 #062004' }}
          >
            <div className="flex-1 flex items-center justify-center p-2">
              <img src={imgBoxShneyne} alt="Шнейне Бокс" className="w-full object-contain" style={{ maxHeight: '80px' }} />
            </div>
            <div
              className="flex flex-col items-center gap-1 py-1.5"
              style={{ background: 'linear-gradient(180deg,#0e4a08,#062004)', borderTop: '1.5px solid #062004' }}
            >
              <p className="text-white font-black text-center" style={{ fontSize: '11px' }}>Шнейне Бокс</p>
              <StarPrice price="100" />
            </div>
          </div>

        </div>
      </div>

      <SnackBar activeTab={0} />
    </div>
  );
};

export default Page20;