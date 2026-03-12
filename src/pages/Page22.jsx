import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearActionError } from '../redux/gameSlice';
import pageBg    from '../assets/page1bg.webp';
import faIcon    from '../assets/page22Images/fa-icon.webp';
import taskIcon1 from '../assets/page22Images/task-icon.webp';
import taskIcon2 from '../assets/page22Images/task-icon.webp';
import taskIcon3 from '../assets/page22Images/task-icon.webp';
import SnackBar   from '../components/SnackBar';
import BetonCard  from '../components/BetonCard';
import DailyBonus from '../components/DailyBonus';

const Toast = ({ message, type, onClose }) => {
  if (!message) return null;
  return (
    <div onClick={onClose} style={{
      position:'fixed', top:12, left:'50%', transform:'translateX(-50%)',
      zIndex:9999, borderRadius:10, padding:'10px 16px',
      background: type==='error'
        ? 'linear-gradient(135deg,#dd1010,#aa0000)'
        : 'linear-gradient(135deg,#2a8a10,#1a6008)',
      border: type==='error' ? '2px solid #ff4444' : '2px solid #5aba20',
      color:'#fff', fontWeight:900, fontSize:12, maxWidth:280,
      textAlign:'center', boxShadow:'0 4px 20px rgba(0,0,0,0.5)', cursor:'pointer',
    }}>{message}</div>
  );
};

const FaImg = ({ size = 16 }) => (
  <img src={faIcon} alt=""
    style={{ width:size, height:size, borderRadius:'50%', flexShrink:0, objectFit:'cover', display:'block' }} />
);

const TaskRow = ({ label, reward, icon, dim }) => (
  <div style={{
    display:'flex', alignItems:'stretch',
    borderRadius:10, overflow:'hidden',
    marginBottom:5,
    border:'1.5px solid #3a6010',
    boxShadow:'0 2px 8px rgba(0,0,0,0.5)',
    opacity: dim ? 0.55 : 1,
    cursor:'pointer',
  }}>
    <div style={{ width:44, flexShrink:0, background:'#b09878', overflow:'hidden', position:'relative' }}>
      <img src={icon} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
      <div style={{
        position:'absolute', top:3, left:3, background:'#2aabee',
        borderRadius:4, width:14, height:14,
        display:'flex', alignItems:'center', justifyContent:'center',
        fontSize:9, color:'#fff',
      }}>✈</div>
    </div>
    <div style={{ flex:1, background:'linear-gradient(180deg,#3d7a14,#285008)', padding:'6px 10px' }}>
      <p style={{ color:'#fff', fontWeight:900, fontSize:'clamp(11px,3.5vw,13px)', margin:'0 0 2px', lineHeight:1.2 }}>{label}</p>
      <div style={{ display:'flex', alignItems:'center', gap:4 }}>
        <FaImg size={12} />
        <span style={{ color:'#c8e840', fontWeight:700, fontSize:11 }}>+{reward}</span>
      </div>
    </div>
    <div style={{
      width:36, flexShrink:0,
      background:'linear-gradient(180deg,#606060,#3a3a3a)',
      borderLeft:'1.5px solid #3a6010',
      display:'flex', alignItems:'center', justifyContent:'center',
      color:'#ccc', fontSize:22, fontWeight:900,
    }}>›</div>
  </div>
);

const Page22 = () => {
  const dispatch = useDispatch();
  const [toast, setToast] = useState(null);

  const clearToast = () => { setToast(null); dispatch(clearActionError()); };

  return (
    <div style={{
      backgroundImage:`url(${pageBg})`,
      backgroundSize:'cover', backgroundPosition:'center',
      maxWidth:430, margin:'0 auto',
      height:'100dvh', overflow:'hidden',
      display:'flex', flexDirection:'column',
    }}>
      <Toast message={toast?.message} type={toast?.type} onClose={clearToast} />

      {/* ── HEADER ── */}
      <div style={{
        background:'linear-gradient(180deg,#c8c8c8,#a0a0a0)',
        display:'flex', flexDirection:'column', alignItems:'center',
        paddingTop:6, paddingBottom:2, flexShrink:0,
      }}>
        <span style={{ fontWeight:900, color:'#000', textTransform:'uppercase', letterSpacing:'0.2em', fontSize:11 }}>
          DRUN FAMILY
        </span>
        <div style={{ display:'flex', alignItems:'center', width:'100%', padding:'1px 16px' }}>
          <div style={{ flex:1, height:1, background:'linear-gradient(90deg,transparent,#000)' }} />
          <span style={{ fontWeight:700, color:'#000', fontSize:8, letterSpacing:'0.3em', textTransform:'uppercase', margin:'0 8px' }}>GAME</span>
          <div style={{ flex:1, height:1, background:'linear-gradient(90deg,#000,transparent)' }} />
        </div>
        <span style={{
          fontWeight:900, fontStyle:'italic', textTransform:'uppercase',
          fontSize:'clamp(22px,7vw,30px)', letterSpacing:'0.08em',
          color:'#6ade10',
          textShadow:'0 2px 0 #1e6000, 0 0 20px rgba(80,210,10,0.8)',
          WebkitTextStroke:'1px #1e6000', lineHeight:1,
        }}>БОНУСЫ</span>
      </div>

      {/* ── BODY ── */}
      <div style={{ flex:1, overflowY:'auto', WebkitOverflowScrolling:'touch', padding:'5px 8px 0', paddingBottom:90 }}>

        {/* ══ ОСОБЕННЫЕ БОНУСЫ ══ */}
        <BetonCard />

        {/* ══ ЕЖЕДНЕВНЫЙ БОНУС ══ */}
        <DailyBonus onToast={setToast} />

        {/* ══ ЗАДАНИЯ ══ */}
        <div style={{
          background:'linear-gradient(180deg,#181810,#0d0d08)',
          borderRadius:10, padding:'5px 8px 6px',
          flex:1,
        }}>
          <p style={{ color:'#fff', fontWeight:700, fontStyle:'italic', fontSize:'clamp(13px,4vw,17px)', textAlign:'center', margin:'0 0 5px' }}>
            Задания
          </p>
          <TaskRow label="Подпишись на шляпбет" reward="100m" icon={taskIcon1} />
          <TaskRow label="Подпишись на шляпбет" reward="100m" icon={taskIcon2} dim />
          <TaskRow label="Подпишись на шляпбет" reward="100m" icon={taskIcon3} dim />
        </div>

      </div>

      <SnackBar activeTab={4} />
    </div>
  );
};

export default Page22;