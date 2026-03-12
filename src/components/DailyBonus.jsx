import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { doClaimDaily, fetchState, clearActionError } from '../redux/gameSlice';
import faIcon from '../assets/page22Images/fa-icon.webp';

function formatFa(n) {
  if (!n && n !== 0) return '—';
  if (n >= 1e12) return `${(n / 1e12).toFixed(1)}T`;
  if (n >= 1e9)  return `${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6)  return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3)  return `${(n / 1e3).toFixed(1)}K`;
  return String(n);
}
function periodLabel(mins) {
  if (mins >= 1440) return `${mins / 60}Ч`;
  if (mins >= 60)   return `${mins / 60}Ч`;
  return `${mins}М`;
}

const WEEK1 = [
  { day:1, x12_min:360,  line:'Х10 прибыль\n15 минут' },
  { day:2, x12_min:480,  line:'2 Фа Бокса\n500 Билетов' },
  { day:3, x12_min:600,  line:'Х15 прибыль\n30 минут' },
  { day:4, x12_min:720,  line:'1 Пепе Бокс\n1000 Бил, 3 Ф' },
  { day:5, x12_min:840,  line:'Х20 прибыль\n45 минут' },
  { day:6, x12_min:960,  line:'2 Пепе Бокса\n1500 Билетов' },
  { day:7, x12_min:1440, line:'Х25 прибыль 90 мин, 1 Шнейне Бокс, 2000 Билетов, 30 Фишек' },
];
const WEEK2 = [
  { day:1, x12_min:10,  line:'Х10 прибыль\n10 минут' },
  { day:2, x12_min:10,  line:'Х10 прибыль\n10 минут' },
  { day:3, x12_min:15,  line:'Х12 прибыль\n15 минут' },
  { day:4, x12_min:20,  line:'Х15 прибыль\n20 минут' },
  { day:5, x12_min:30,  line:'Х20 прибыль\n30 минут' },
  { day:6, x12_min:45,  line:'Х20 прибыль\n45 мин, 0.05$' },
  { day:7, x12_min:120, line:'Х25 прибыль 120 мин, 0.2 USDT + 1 Фа Бокс' },
];

const FaImg = ({ size = 16 }) => (
  <img src={faIcon} alt=""
    style={{ width:size, height:size, borderRadius:'50%', flexShrink:0, objectFit:'cover', display:'block' }} />
);

const DayBadge = ({ text, isToday }) => (
  <div style={{
    display:'inline-block',
    background: isToday
      ? 'linear-gradient(180deg,#4aaa18,#2a7008)'
      : 'linear-gradient(180deg,#dd2020,#990000)',
    border: isToday ? '1px solid #2a7008' : '1px solid #660000',
    borderRadius:4, padding:'1px 6px',
  }}>
    <span style={{ color:'#fff', fontWeight:900, fontSize:7, letterSpacing:'0.1em' }}>{text}</span>
  </div>
);

const SmallCard = ({ reward, cardState, hourly, onClick, loading }) => {
  const isToday = cardState === 'today';
  const isPast  = cardState === 'past';
  const bg     = isToday ? '#52810f' : isPast ? '#727272' : '#5b3600';
  const border = isToday ? '1.5px solid #274920' : isPast ? '1.5px solid #3c3c3c' : '1.5px solid #372505';
  const faAmt  = formatFa(Math.round(hourly * (reward.x12_min / 60)));

  return (
    <div
      onClick={isToday && !loading ? onClick : undefined}
      style={{
        borderRadius:7, overflow:'hidden', position:'relative',
        background:bg, border,
        boxShadow: isToday
          ? '0 0 0 1px #4aaa18,0 2px 6px rgba(0,0,0,0.5)'
          : '0 1px 4px rgba(0,0,0,0.4)',
        cursor: isToday ? 'pointer' : 'default',
        display:'flex', flexDirection:'column',
        padding:'3px 0 3px',
      }}
    >
      <div style={{ display:'flex', justifyContent:'center', marginBottom:2 }}>
        <DayBadge text={isToday ? 'ЗАБРАТЬ' : `ДЕНЬ ${reward.day}`} isToday={isToday} />
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:2, padding:'0 4px' }}>
        <span style={{ fontWeight:900, fontSize:'clamp(11px,3.2vw,14px)', color:'#fff', lineHeight:1 }}>
          {faAmt}
        </span>
        <FaImg size={13} />
      </div>
      <p style={{ color:'rgba(255,255,255,0.5)', fontSize:6, fontWeight:600, margin:'1px 4px 0', lineHeight:1.1 }}>
        ПРИБ. ЗА {periodLabel(reward.x12_min)}
      </p>
      <p style={{
        color: isToday ? '#d4f090' : isPast ? 'rgba(255,255,255,0.55)' : '#d4c040',
        fontSize:6.5, fontWeight:700, margin:'2px 4px 0', lineHeight:1.25, whiteSpace:'pre-line',
      }}>
        {reward.line}
      </p>
      {isPast && (
        <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.15)', borderRadius:6, pointerEvents:'none' }} />
      )}
      {loading && isToday && (
        <div style={{ position:'absolute', inset:0, borderRadius:6, background:'rgba(0,0,0,0.55)', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <span style={{ color:'#fff', fontWeight:900, fontSize:12 }}>•••</span>
        </div>
      )}
    </div>
  );
};

const DailyBonus = ({ onToast }) => {
  const dispatch  = useDispatch();
  const user      = useSelector(s => s.game.user);
  const rates     = useSelector(s => s.game.rates);
  const claiming  = useSelector(s => s.game.actionLoading);   // adjust key to match your slice

  const hourly    = rates?.fa_per_hour     ?? 1000;
  const dailyDay  = user?.daily_day        ?? 1;
  const dailyWeek = user?.daily_week       ?? 0;
  const dailyLast = user?.daily_last_claim ?? null;
  const todayStr  = new Date().toISOString().slice(0, 10);
  const claimed   = dailyLast === todayStr;
  const rewards   = dailyWeek === 0 ? WEEK1 : WEEK2;
  const todayIdx  = Math.min((dailyDay - 1) % 7, 6);

  const cardState = (i) => {
    if (i < todayIdx) return 'past';
    if (i === todayIdx && claimed) return 'past';
    if (i === todayIdx) return 'today';
    return 'future';
  };

  const handleClaim = async () => {
    if (claiming || claimed) return;
    const result = await dispatch(doClaimDaily());
    if (doClaimDaily.fulfilled.match(result)) {
      await dispatch(fetchState());
      onToast?.({ message: '🎉 Ежедневный бонус получен!', type: 'success' });
    } else {
      dispatch(clearActionError());
      onToast?.({ message: result.payload || 'Ошибка', type: 'error' });
    }
  };

  const day7      = rewards[6];
  const day7Fa    = formatFa(Math.round(hourly * (day7.x12_min / 60)));
  const isDay7Now = todayIdx === 6 && !claimed;
  const d7bg      = isDay7Now ? '#52810f' : cardState(6) === 'past' ? '#727272' : '#5b3600';
  const d7border  = isDay7Now
    ? '1.5px solid #274920'
    : cardState(6) === 'past' ? '1.5px solid #3c3c3c' : '1.5px solid #372505';

  return (
    <div style={{
      background:'linear-gradient(180deg,#5c4400,#3c2c00)',
      borderRadius:10, overflow:'hidden',
      marginBottom:5, flexShrink:0,
    }}>
      {/* ── Red header bar ── */}
      <div style={{ background:'linear-gradient(180deg,#cc1a1a,#8a0808)', textAlign:'center', padding:'4px 0' }}>
        <span style={{ color:'#fff', fontWeight:900, fontSize:'clamp(10px,3.2vw,13px)', letterSpacing:'0.15em', textTransform:'uppercase' }}>
          ЕЖЕДНЕВНЫЙ БОНУС
        </span>
      </div>

      {/* ── Subtitle ── */}
      <p style={{ color:'#fff', fontWeight:700, fontSize:'clamp(10px,3vw,12px)', textAlign:'center', margin:'4px 0 4px' }}>
        Заходи каждый день и получай награду
      </p>

      {/* ── Days 1–6 grid ── */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:4, padding:'0 7px 4px' }}>
        {rewards.slice(0, 6).map((r, i) => (
          <SmallCard
            key={r.day}
            reward={r}
            cardState={cardState(i)}
            hourly={hourly}
            onClick={handleClaim}
            loading={claiming}
          />
        ))}
      </div>

      {/* ── Day 7 full-width row ── */}
      <div
        onClick={isDay7Now && !claiming ? handleClaim : undefined}
        style={{
          margin:'0 7px 6px',
          borderRadius:8, padding:'6px 10px',
          background:d7bg, border:d7border,
          boxShadow: isDay7Now
            ? '0 0 0 1px #4aaa18,0 2px 8px rgba(0,0,0,0.5)'
            : '0 1px 6px rgba(0,0,0,0.4)',
          cursor: isDay7Now ? 'pointer' : 'default',
          display:'flex', alignItems:'center', gap:7,
          position:'relative',
        }}
      >
        {/* Left: amount + label */}
        <div style={{ flexShrink:0 }}>
          <span style={{ fontWeight:900, fontSize:'clamp(18px,5.5vw,24px)', color:'#fff', lineHeight:1, display:'block' }}>
            {day7Fa}
          </span>
          <span style={{ color:'rgba(255,255,255,0.45)', fontSize:6, fontWeight:700, letterSpacing:'0.05em' }}>
            ПРИБЫЛЬ ЗА 24Ч
          </span>
        </div>

        {/* Center: coin */}
        <FaImg size={28} />

        {/* Right: badge + description */}
        <div style={{ flex:1 }}>
          <div style={{ marginBottom:2 }}>
            <DayBadge text={isDay7Now ? 'ЗАБРАТЬ' : 'ДЕНЬ 7'} isToday={isDay7Now} />
          </div>
          <p style={{
            color: cardState(6) === 'past' ? 'rgba(255,255,255,0.6)' : '#e0f0a0',
            fontWeight:700, fontSize:'clamp(7px,2.2vw,9px)', margin:0, lineHeight:1.4,
          }}>
            {day7.line}
          </p>
        </div>

        {/* Loading overlay */}
        {claiming && isDay7Now && (
          <div style={{ position:'absolute', inset:0, borderRadius:7, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <span style={{ color:'#fff', fontWeight:900, fontSize:14 }}>•••</span>
          </div>
        )}
      </div>

      {/* ── Claimed message ── */}
      {claimed && (
        <p style={{ color:'#88ee44', textAlign:'center', fontWeight:700, fontSize:10, margin:'-2px 0 5px' }}>
          ✅ Бонус получен! Возвращайся завтра.
        </p>
      )}
    </div>
  );
};

export default DailyBonus;