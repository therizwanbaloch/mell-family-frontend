import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { doStoreBuy, doOpenBox } from '../redux/gameSlice';

// Assets
import pageBg      from '../assets/page1bg.webp';
import logoDark    from "../assets/logo-darkk.webp";
import starIcon    from '../assets/page22Images/fa-icon.webp'; // Using as Star/Currency icon

import imgPakDrunov  from '../assets/page20Items/pak-drunov.webp';
import imgVatafaPak  from '../assets/page20Items/vatafa-pak.webp';
import imgBiznesPak  from '../assets/page20Items/biznes-pak.webp';
import imgVipPak     from '../assets/page20Items/vip-pak.webp';
import imgBoxFa      from '../assets/page20Items/box-fa.webp';
import imgBoxPepe    from '../assets/page20Items/box-pepe.webp';
import imgBoxShneyne from '../assets/page20Items/box-shneyne.webp';

import SnackBar from '../components/SnackBar';

const SectionHeader = ({ label }) => (
  <div style={{ display: 'flex', justifyContent: 'center', margin: '12px 0 8px' }}>
    <div style={{ 
      background: 'linear-gradient(180deg, #f0a800, #b87e00)',
      padding: '2px 40px', borderRadius: 20, border: '2px solid #000',
      boxShadow: '0 3px 0 #000'
    }}>
      <span style={{ color: '#000', fontWeight: 900, fontSize: '14px', fontStyle: 'italic', textTransform: 'uppercase' }}>
        {label}
      </span>
    </div>
  </div>
);

const Page20 = () => {
  const dispatch = useDispatch();

  const handleBuy = (id) => dispatch(doStoreBuy(id));
  const handleOpen = (id) => dispatch(doOpenBox(id));

  return (
    <div style={{
      backgroundImage: `url(${pageBg})`, backgroundSize: 'cover', backgroundPosition: 'center',
      maxWidth: 412, margin: '0 auto', height: '100dvh', overflow: 'hidden',
      display: 'flex', flexDirection: 'column', fontFamily: "'Nunito', sans-serif",
    }}>
      
      {/* ── HEADER (Same as Page 22) ── */}
      <div style={{ background: "#dbdbdb", padding: "4px 0", flexShrink: 0 }}>
        <div style={{ width: 130, height: 28, position: "relative", margin: "0 auto" }}>
          <img src={logoDark} alt="Logo" style={{ position: "absolute", width: 210, top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />
        </div>
        <div style={{ textAlign: "center" }}>
          <span style={{ 
            fontWeight: 900, fontStyle: 'italic', textTransform: 'uppercase', 
            fontSize: "18px", color: "#f0a800", WebkitTextStroke: "1px #372505", lineHeight: 1
          }}> МАГАЗИН </span>
        </div>
      </div>

      {/* ── BODY ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 10px 100px' }} className="scrollbar-hide">
        
        <SectionHeader label="АКЦИИ" />

        {/* 1. ПАК ДРУНОВ (Main Card) */}
        <div style={{ 
          background: '#4CAF50', borderRadius: 12, border: '2px solid #000', position: 'relative',
          height: 120, overflow: 'hidden', marginBottom: 8, display: 'flex'
        }}>
          <div style={{ padding: '10px', flex: 1, zIndex: 2 }}>
            <h2 style={{ color: '#FFD700', margin: 0, fontWeight: 900, fontSize: 18, fontStyle: 'italic' }}>ПАК ДРУНОВ</h2>
            <p style={{ color: '#fff', fontSize: 10, fontWeight: 700, margin: '4px 0', lineHeight: 1.2 }}>
              +44% прибыли друнов<br/>1111 фишек, 333 FS,<br/>222 очка в DRUN ROAD
            </p>
            <button onClick={() => handleBuy('pak_drunov')} style={{ 
              background: '#FFD700', border: '1.5px solid #000', borderRadius: 15, 
              padding: '2px 12px', fontWeight: 900, fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 
            }}>
              321 <span style={{ fontSize: 10 }}>⭐</span>
            </button>
          </div>
          <img src={imgPakDrunov} alt="" style={{ height: '100%', position: 'absolute', right: 0, bottom: 0, zIndex: 1 }} />
          <div style={{ position: 'absolute', top: 5, right: 5, color: '#ff0000', fontWeight: 900, fontSize: 8, transform: 'rotate(5deg)' }}>
            25 USDT В ПОДАРОК
          </div>
        </div>

        {/* 2. Grid for Vatafa & Biznes Pak */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
          {/* Vatafa */}
          <div style={{ background: '#333', borderRadius: 12, border: '2px solid #000', height: 160, position: 'relative', overflow: 'hidden', padding: 10, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <img src={imgVatafaPak} style={{ position: 'absolute', width: '100%', opacity: 0.5, bottom: 0, left: 0 }} alt=""/>
            <div style={{ zIndex: 2 }}>
              <h2 style={{ color: '#FFD700', margin: 0, fontWeight: 900, fontSize: 14, fontStyle: 'italic' }}>ВАТАФА ПАК</h2>
              <p style={{ color: '#fff', fontSize: 8, fontWeight: 600, margin: '4px 0' }}>+20% прибыли за тап...</p>
            </div>
            <button style={{ background: '#FFD700', border: '1.5px solid #000', borderRadius: 15, padding: '2px 8px', fontWeight: 900, fontSize: 11, zIndex: 2 }}>
               <span style={{ textDecoration: 'line-through', opacity: 0.6, marginRight: 4 }}>777</span> 249 ⭐
            </button>
          </div>
          {/* Biznes */}
          <div style={{ background: '#2196F3', borderRadius: 12, border: '2px solid #000', height: 160, position: 'relative', overflow: 'hidden', padding: 10, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
             <img src={imgBiznesPak} style={{ position: 'absolute', width: '90%', bottom: 0, right: 0 }} alt=""/>
             <div style={{ zIndex: 2 }}>
              <h2 style={{ color: '#0D47A1', margin: 0, fontWeight: 900, fontSize: 14, fontStyle: 'italic' }}>БИЗНЕС ПАК</h2>
              <p style={{ color: '#fff', fontSize: 8, fontWeight: 600, margin: '4px 0' }}>x12 доход на 6 часов...</p>
            </div>
            <button style={{ background: '#FFD700', border: '1.5px solid #000', borderRadius: 15, padding: '2px 8px', fontWeight: 900, fontSize: 11, zIndex: 2, width: 'fit-content' }}>
               666 ⭐
            </button>
            <div style={{ position: 'absolute', top: 5, right: 5, color: '#ff0000', fontWeight: 900, fontSize: 7, textAlign: 'right' }}>САМОЕ ВЫГОДНОЕ</div>
          </div>
        </div>

        {/* 3. VIP ПАК */}
        <div style={{ 
          background: 'linear-gradient(90deg, #FFD700, #FFA000)', borderRadius: 12, border: '2px solid #000', 
          height: 110, position: 'relative', overflow: 'hidden', marginBottom: 12, display: 'flex', padding: 10
        }}>
          <div style={{ flex: 1, zIndex: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ background: '#000', color: '#FFD700', padding: '0 4px', borderRadius: 4, fontWeight: 900, fontSize: 14 }}>VIP</span>
              <h2 style={{ color: '#000', margin: 0, fontWeight: 900, fontSize: 14 }}>БУРМУЛДА ПАК</h2>
            </div>
            <p style={{ color: '#000', fontSize: 9, fontWeight: 800, margin: '6px 0', maxWidth: '70%' }}>
              x2 вся прибыль на 6 дней, 61666 билетов, 166 очков DRUN ROAD...
            </p>
            <button style={{ background: 'rgba(0,0,0,0.1)', border: '1px solid #000', borderRadius: 15, padding: '2px 12px', fontWeight: 900, fontSize: 12 }}>
              1666 ⭐
            </button>
          </div>
          <img src={imgVipPak} alt="" style={{ height: '100%', position: 'absolute', right: 0, bottom: 0 }} />
        </div>

        <SectionHeader label="БОКСЫ" />

        {/* 4. Boxes Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          {[
            { img: imgBoxFa, name: 'Фа Бокс', price: 10, bg: '#9E9E9E' },
            { img: imgBoxPepe, name: 'Пепе Бокс', price: 40, bg: '#4CAF50' },
            { img: imgBoxShneyne, name: 'Шнейне Бокс', price: 100, bg: '#fbc02d' },
          ].map((box, idx) => (
            <div key={idx} style={{ 
              background: box.bg, borderRadius: 12, border: '2px solid #000', 
              padding: '8px 4px', display: 'flex', flexDirection: 'column', alignItems: 'center' 
            }}>
              <img src={box.img} alt="" style={{ width: '80%', marginBottom: 5 }} />
              <span style={{ fontWeight: 800, fontSize: 10, color: '#000' }}>{box.name}</span>
              <button style={{ 
                marginTop: 4, background: 'rgba(0,0,0,0.2)', border: '1px solid #000', 
                borderRadius: 10, width: '90%', fontWeight: 900, fontSize: 11 
              }}>
                {box.price} ⭐
              </button>
            </div>
          ))}
        </div>

      </div>

      <SnackBar activeTab={0} />
    </div>
  );
};

export default Page20;