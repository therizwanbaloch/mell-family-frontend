import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import pageBg     from '../assets/page1bg.webp';
import logoDark   from "../assets/logo-darkk.webp";
import usdtIcon   from '../assets/page23Images/usdt-icon.webp';
import fishkiIcon from '../assets/page23Images/chips.webp';
import slotGameImg  from '../assets/page23Images/slot-game.webp';
import planeGameImg from '../assets/page23Images/plane-game.webp';
import fogMinesImg  from '../assets/page23Images/fog-mines.webp';
import SnackBar   from '../components/SnackBar';

function formatNum(n) {
  if (!n && n !== 0) return '0';
  if (n >= 1e9)  return `${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6)  return `${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3)  return `${(n / 1e3).toFixed(1)}K`;
  return String(n);
}

const BalanceBar = ({ usdt, fishki, onAddFishki }) => (
  <div style={{ display:'flex', gap:8, padding:'8px 10px 6px', flexShrink:0 }}>
    {/* USDT */}
    <div style={{
      flex:1, display:'flex', alignItems:'center', gap:6,
      background:'linear-gradient(180deg,#b8860b,#7a5500)',
      borderRadius:20, padding:'5px 10px',
      border:'1.5px solid #d4a017',
      boxShadow:'0 2px 8px rgba(0,0,0,0.4)',
    }}>
      <img src={usdtIcon} alt="" style={{ width:28, height:28, borderRadius:'50%', objectFit:'cover', flexShrink:0 }} />
      <div>
        <div style={{ color:'rgba(255,255,255,0.6)', fontSize:9, fontWeight:700, letterSpacing:'0.1em' }}>USDT</div>
        <div style={{ color:'#fff', fontWeight:900, fontSize:'clamp(14px,4.5vw,20px)', lineHeight:1 }}>
          {typeof usdt === 'number' ? usdt.toFixed(2) : usdt ?? '0.00'}
        </div>
      </div>
    </div>

    {/* ФИШКИ */}
    <div style={{
      flex:1, display:'flex', alignItems:'center', gap:6,
      background:'#52810f',
      borderRadius:10, padding:'5px 10px',
      border:'2px solid #3f6011',
      boxShadow:'0 2px 8px rgba(0,0,0,0.4)',
    }}>
      <img src={fishkiIcon} alt="" style={{ width:28, height:28, borderRadius:'50%', objectFit:'cover', flexShrink:0 }} />
      <div style={{ flex:1 }}>
        <div style={{ color:'rgba(255,255,255,0.6)', fontSize:9, fontWeight:700, letterSpacing:'0.1em' }}>ФИШКИ</div>
        <div style={{ color:'#fff', fontWeight:900, fontSize:'clamp(14px,4.5vw,20px)', lineHeight:1 }}>
          {formatNum(fishki ?? 0)}
        </div>
      </div>
      <div
        onClick={onAddFishki}
        style={{
          width:28, height:28, borderRadius:8,
          background:'#53a00d',
          border:'1px solid #2c3d13',
          display:'flex', alignItems:'center', justifyContent:'center',
          fontWeight:900, fontSize:18, color:'#fff',
          flexShrink:0, cursor:'pointer',
        }}
      >+</div>
    </div>
  </div>
);

const GameCardGold = ({ title, desc, image, onPlay }) => (
  <div style={{
    background:'linear-gradient(180deg,#7a5500,#4a3200)',
    borderRadius:14, overflow:'hidden',
    border:'1.5px solid #c8900a',
    boxShadow:'0 3px 12px rgba(0,0,0,0.6)',
    display:'flex', alignItems:'stretch',
    marginBottom:10,
  }}>
    <div style={{ flex:1, padding:'12px 10px 12px 14px', display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
      <div>
        <h3 style={{
          color:'#f0c830', fontWeight:900, fontStyle:'italic',
          fontSize:'clamp(18px,5.5vw,24px)', margin:'0 0 6px',
          textShadow:'0 1px 4px rgba(0,0,0,0.6)',
        }}>{title}</h3>
        <p style={{ color:'rgba(255,255,255,0.85)', fontWeight:600, fontSize:'clamp(10px,3vw,12px)', margin:0, lineHeight:1.4 }}>
          {desc}
        </p>
      </div>
      <button onClick={onPlay} style={{
        marginTop:10,
        background:'linear-gradient(180deg,#e8a020,#b06010)',
        border:'1.5px solid #f0c030', borderRadius:20, padding:'6px 0',
        color:'#fff', fontWeight:900, fontSize:'clamp(11px,3.5vw,14px)',
        letterSpacing:'0.15em', textTransform:'uppercase',
        cursor:'pointer', width:'100%', boxShadow:'0 2px 8px rgba(0,0,0,0.4)',
      }}>ИГРАТЬ</button>
    </div>
    <div style={{ width:'42%', flexShrink:0, position:'relative', overflow:'hidden' }}>
      <img src={image} alt={title} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
      <div style={{ position:'absolute', inset:0, background:'linear-gradient(90deg,rgba(74,50,0,0.5),transparent)', pointerEvents:'none' }} />
    </div>
  </div>
);

const GameCardGray = ({ title, desc, image, onPlay }) => (
  <div style={{
    background:'linear-gradient(180deg,#4a4a4a,#2a2a2a)',
    borderRadius:14, overflow:'hidden',
    border:'1.5px solid #6a6a6a',
    boxShadow:'0 3px 12px rgba(0,0,0,0.6)',
    display:'flex', alignItems:'stretch',
    marginBottom:10,
  }}>
    <div style={{ width:'42%', flexShrink:0, position:'relative', overflow:'hidden' }}>
      <img src={image} alt={title} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
      <div style={{ position:'absolute', inset:0, background:'linear-gradient(270deg,rgba(42,42,42,0.5),transparent)', pointerEvents:'none' }} />
    </div>
    <div style={{ flex:1, padding:'12px 14px 12px 10px', display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
      <div>
        <h3 style={{
          color:'#e0e0e0', fontWeight:900,
          fontSize:'clamp(14px,4.5vw,18px)', margin:'0 0 6px', lineHeight:1.2,
          whiteSpace:'pre-line',
        }}>{title}</h3>
        <p style={{ color:'rgba(255,255,255,0.7)', fontWeight:600, fontSize:'clamp(10px,3vw,12px)', margin:0, lineHeight:1.4 }}>
          {desc}
        </p>
      </div>
      <button onClick={onPlay} style={{
        marginTop:10,
        background:'linear-gradient(180deg,#e8a020,#b06010)',
        border:'1.5px solid #f0c030', borderRadius:20, padding:'6px 0',
        color:'#fff', fontWeight:900, fontSize:'clamp(11px,3.5vw,14px)',
        letterSpacing:'0.15em', textTransform:'uppercase',
        cursor:'pointer', width:'100%', boxShadow:'0 2px 8px rgba(0,0,0,0.4)',
      }}>ИГРАТЬ</button>
    </div>
  </div>
);

const ComingSoonCard = () => (
  <div style={{
    background:'linear-gradient(180deg,#3a3a3a,#1e1e1e)',
    borderRadius:14, border:'1.5px solid #555',
    boxShadow:'0 3px 12px rgba(0,0,0,0.6)',
    padding:'32px 0',
    display:'flex', alignItems:'center', justifyContent:'center',
    marginBottom:10,
  }}>
    <span style={{
      color:'#fff', fontWeight:900, fontStyle:'italic',
      fontSize:'clamp(18px,5.5vw,26px)',
      textShadow:'0 2px 8px rgba(0,0,0,0.6)',
    }}>Скоро в игре!</span>
  </div>
);

const Page23 = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user   = useSelector(s => s.game.user);
  const usdt   = user?.usdt_balance   ?? 0;
  const fishki = user?.chips ?? user?.fishki_balance ?? 0;

  const handleAddFishki = () => navigate('/shop');

  return (
    <div style={{
      backgroundImage:`url(${pageBg})`,
      backgroundSize:'cover', backgroundPosition:'center',
      maxWidth:430, margin:'0 auto',
      height:'100dvh', overflow:'hidden',
      display:'flex', flexDirection:'column', fontFamily: "'Nunito', sans-serif",
    }}>

      {/* ── HEADER ── */}
      <div style={{ background: "#dbdbdb", padding: "4px 0", flexShrink: 0, borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
        <div style={{ width: 130, height: 28, position: "relative", margin: "0 auto" }}>
          <img 
            src={logoDark} 
            alt="Logo" 
            style={{ position: "absolute", width: 210, top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} 
          />
        </div>
        <div style={{ textAlign: "center", marginTop: "0px" }}>
          <span style={{ 
            fontWeight: 900, textTransform: 'uppercase',  
            fontSize: "18px", color: "#b4b4b4", WebkitTextStroke: "1.5px black", lineHeight: 1
          }}> игры </span>
        </div>
      </div>

      {/* ── BODY ── */}
      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', paddingBottom: 90 }}>
        
        <BalanceBar
          usdt={usdt}
          fishki={fishki}
          onAddFishki={handleAddFishki}
        />

        <div style={{ padding:'0 10px' }}>
          <GameCardGold
            title="Бурмалда"
            desc={"Старые добрые слоты с\nогромным заработком и\nбесплатными вращениями!"}
            image={slotGameImg}
            onPlay={() => navigate('/page24')}
          />

          <GameCardGray
            title={"Самолетик\nБурмалдотик"}
            desc={"Подними свои USDT и\nФишки в небеса вместе с\nчастным самолетом мела!"}
            image={planeGameImg}
            onPlay={() => navigate('/page25')}
          />

          <GameCardGold
            title="FOG mines"
            desc={"Ищи Фишки в одной из\nмногоэтажек Мурино,\nтолько не наткнись на Фога!"}
            image={fogMinesImg}
            onPlay={() => navigate('/page26')}
          />

          <ComingSoonCard />
        </div>
      </div>

      <SnackBar activeTab={1} />
    </div>
  );
};

export default Page23;