import React, { useState } from 'react';
import { useNavigate }    from 'react-router-dom';
import { FaUserPlus }     from 'react-icons/fa';
import pageBg             from '../assets/page1bg.webp';
import SnackBar           from '../components/SnackBar';
import Page19Modal        from '../modals/Page19Modal';

// ── Images ────────────────────────────────────────────────────────────────
import imgHero from '../assets/page18Images/hero.webp';    // 3 guys photo
import imgCoin from '../assets/page14Images/fa_icon.webp'; // ФА coin icon

// ── Mock data — swap with backend ─────────────────────────────────────────
const REFERRAL_COUNT = 350;
const ROAD_MAX       = 1000;
const EARNED         = '3.15В';
const MILESTONES     = [0, 5, 10, 25, 50, 100, 200, 500, 1000];
const progressPct    = Math.min((REFERRAL_COUNT / ROAD_MAX) * 100, 100);

const REFERRALS = [
  { id: 1, avatar: null, name: 'Коля камазаяка', level: 9,  perHour: '406.8M в час', earned: '1.27В'  },
  { id: 2, avatar: null, name: 'zovbi1488',       level: 7,  perHour: '18.5M в час',  earned: '187.5M' },
  { id: 3, avatar: null, name: 'Биром ЧА',        level: 5,  perHour: '4.2M в час',   earned: '44.1M'  },
  { id: 4, avatar: null, name: 'Антон777',        level: 12, perHour: '1.1В в час',   earned: '8.9В'   },
  { id: 5, avatar: null, name: 'darkside_88',     level: 6,  perHour: '9.7M в час',   earned: '92.3M'  },
  { id: 6, avatar: null, name: 'Степан',          level: 3,  perHour: '1.2M в час',   earned: '11.5M'  },
  { id: 7, avatar: null, name: 'mell_fan99',      level: 8,  perHour: '74.6M в час',  earned: '520M'   },
];

// ── Referral row ──────────────────────────────────────────────────────────
const ReferralRow = ({ r }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '10px 12px', borderRadius: 20,
    background: 'rgba(30,30,30,0.92)',
    border: '1px solid #3a3a3a',
  }}>
    {/* Avatar */}
    <div style={{
      flexShrink: 0, width: 48, height: 48, borderRadius: '50%',
      background: '#2a2a2a', border: '2px solid #444',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 22, overflow: 'hidden',
    }}>
      {r.avatar
        ? <img src={r.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        : '👤'}
    </div>

    {/* Name + per hour */}
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 2 }}>
        <span style={{
          background: 'linear-gradient(180deg,#3a8a10,#236008)',
          border: '1px solid #4aaa20',
          borderRadius: 99, padding: '1px 6px',
          color: '#fff', fontWeight: 900, fontSize: 10,
          whiteSpace: 'nowrap', flexShrink: 0,
        }}>
          {r.level} lvl
        </span>
        <span style={{ color: '#fff', fontWeight: 700, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {r.name}
        </span>
      </div>
      <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, fontWeight: 500 }}>
        {r.perHour}
      </span>
    </div>

    {/* Earned pill */}
    <div style={{
      flexShrink: 0,
      background: 'linear-gradient(180deg,#2a2000,#1a1400)',
      border: '1.5px solid #7a5500', borderRadius: 12, padding: '5px 14px',
    }}>
      <span style={{ color: '#f0c020', fontWeight: 900, fontSize: 14, whiteSpace: 'nowrap' }}>
        {r.earned}
      </span>
    </div>
  </div>
);

// ── Page 18 ───────────────────────────────────────────────────────────────
const Page18 = () => {
  const navigate = useNavigate();
  const [showRoad, setShowRoad] = useState(false);

  return (
    <div style={{
      maxWidth: 430, margin: '0 auto',
      height: '100dvh',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
      backgroundImage: `url(${pageBg})`,
      backgroundSize: 'cover', backgroundPosition: 'center',
      fontFamily: "'Nunito', 'Segoe UI', sans-serif",
    }}>

      {/* ── HEADER ────────────────────────────────────── */}
      <div style={{
        flexShrink: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        paddingTop: 10, paddingBottom: 2,
        background: 'linear-gradient(180deg,rgba(0,0,0,0.9),transparent)',
      }}>
        <span style={{
          color: '#fff', fontWeight: 900,
          fontSize: 'clamp(14px,4.2vw,18px)',
          letterSpacing: '0.16em', textTransform: 'uppercase', lineHeight: 1,
        }}>
          DRUN FAMILY
        </span>
        <div style={{ display: 'flex', alignItems: 'center', width: '100%', padding: '4px 24px' }}>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg,transparent,#666)' }} />
          <span style={{ color: '#888', fontSize: 10, letterSpacing: '0.28em', margin: '0 10px', fontStyle: 'italic' }}>game</span>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg,#666,transparent)' }} />
        </div>
      </div>

      {/* ── SCROLLABLE BODY ───────────────────────────── */}
      <div style={{
        flex: 1, overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
        display: 'flex', flexDirection: 'column',
        gap: 10, padding: '6px 12px 20px',
      }}>

        {/* 1 ── HERO PHOTO */}
        <div style={{
          borderRadius: 20, overflow: 'hidden',
          border: '2px solid #2a2a2a',
          boxShadow: '0 4px 24px rgba(0,0,0,0.9)',
          flexShrink: 0,
        }}>
          <img src={imgHero} alt="hero" style={{
            width: '100%', height: 'clamp(180px,46vw,230px)',
            objectFit: 'cover', objectPosition: 'top center', display: 'block',
          }} />
        </div>

        {/* 2 ── INVITE CARD — bg: #808080 */}
        <div style={{
          flexShrink: 0, borderRadius: 18,
          background: '#808080',
          border: '1px solid #666',
          boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
          padding: '14px',
        }}>
          <p style={{
            color: '#fff', fontWeight: 900,
            fontSize: 'clamp(13px,3.8vw,16px)',
            textAlign: 'center', margin: '0 0 12px',
            textTransform: 'uppercase', letterSpacing: '0.04em', lineHeight: 1.45,
            textShadow: '0 1px 3px rgba(0,0,0,0.4)',
          }}>
            ПРИГЛАШАЙ ДРУНОВ И<br />ПОЛУЧАЙ 38% ОТ ИХ ДОХОДА
          </p>

          <div style={{ display: 'flex', gap: 8 }}>
            {/* Invite friend */}
            <button
              onClick={() => console.log('invite')}
              style={{
                flex: 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                padding: '12px 8px', borderRadius: 14,
                background: 'linear-gradient(180deg,#1e1e1e,#0e0e0e)',
                border: '2px solid #444',
                color: '#fff', fontWeight: 900,
                fontSize: 'clamp(11px,3vw,13px)',
                letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer',
              }}
              onPointerDown={e => e.currentTarget.style.opacity = '0.8'}
              onPointerUp={e => e.currentTarget.style.opacity = '1'}
              onPointerLeave={e => e.currentTarget.style.opacity = '1'}
            >
              ПРИГЛАСИТЬ ДРУНА
              <FaUserPlus size={18} color="#fff" style={{ flexShrink: 0 }} />
            </button>

            {/* Copy link */}
            <button
              onClick={() => console.log('copy link')}
              style={{
                flexShrink: 0, width: 58, minHeight: 48, borderRadius: 14,
                background: 'linear-gradient(180deg,#1e1e1e,#0e0e0e)',
                border: '2px solid #444',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
              }}
              onPointerDown={e => e.currentTarget.style.opacity = '0.8'}
              onPointerUp={e => e.currentTarget.style.opacity = '1'}
              onPointerLeave={e => e.currentTarget.style.opacity = '1'}
            >
              {/* Chain link icon */}
              <svg width="30" height="22" viewBox="0 0 30 22" fill="none">
                <rect x="1"  y="4" width="13" height="13" rx="6.5" stroke="white" strokeWidth="2.5"/>
                <rect x="16" y="4" width="13" height="13" rx="6.5" stroke="white" strokeWidth="2.5"/>
                <rect x="9"  y="7" width="12" height="7"  rx="0"   fill="#111"/>
              </svg>
            </button>
          </div>
        </div>

        {/* 3 ── DRUN ROAD card */}
        <div
          onClick={() => setShowRoad(true)}
          style={{
            flexShrink: 0, borderRadius: 18,
            background: 'linear-gradient(180deg,rgba(55,52,40,0.97),rgba(30,28,20,0.97))',
            border: '1px solid #5a5640',
            boxShadow: '0 4px 16px rgba(0,0,0,0.6)',
            padding: '14px 14px 10px',
            cursor: 'pointer',
          }}
        >
          <div style={{ marginBottom: 2 }}>
            <span style={{
              color: '#fff', fontWeight: 900,
              fontSize: 'clamp(20px,5.5vw,26px)',
              fontStyle: 'italic', letterSpacing: '0.04em',
            }}>
              DRUN ROAD 1000
            </span>
          </div>
          <div style={{ marginBottom: 10 }}>
            <span style={{
              color: 'rgba(255,255,255,0.55)', fontWeight: 800, fontSize: 11,
              textTransform: 'uppercase', letterSpacing: '0.08em',
            }}>
              ПРИГЛАШАЙ БОЛЬШЕ, ПОЛУЧАЙ БОЛЬШЕ
            </span>
          </div>

          {/* Progress bar with diamond milestones */}
          <div style={{ position: 'relative', marginBottom: 18 }}>
            <div style={{
              height: 10, borderRadius: 9999,
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.1)',
              position: 'relative', overflow: 'visible',
            }}>
              <div style={{
                height: '100%', width: `${progressPct}%`,
                background: 'linear-gradient(90deg,#c89000 0%,#f0b800 55%,#5ecf10 100%)',
                borderRadius: 9999,
              }} />
              {MILESTONES.map((m, i) => {
                const pct  = (m / ROAD_MAX) * 100;
                const done = REFERRAL_COUNT >= m;
                const end  = pct > 60;
                return (
                  <div key={i} style={{
                    position: 'absolute', top: '50%', left: `${pct}%`,
                    width: 10, height: 10,
                    background: done ? (end ? '#5ecf10' : '#f0b800') : 'rgba(255,255,255,0.15)',
                    border: `1.5px solid ${done ? (end ? '#2a8a00' : '#8a6000') : '#444'}`,
                    transform: 'translate(-50%,-50%) rotate(45deg)',
                    zIndex: 2,
                  }} />
                );
              })}
            </div>
            <div style={{ position: 'relative', height: 14, marginTop: 5 }}>
              {MILESTONES.map((m, i) => (
                <span key={i} style={{
                  position: 'absolute', left: `${(m / ROAD_MAX) * 100}%`,
                  transform: 'translateX(-50%)',
                  color: 'rgba(255,255,255,0.4)',
                  fontSize: 9, fontWeight: 600, whiteSpace: 'nowrap',
                }}>{m}</span>
              ))}
            </div>
          </div>
        </div>

        {/* 4 ── ТВОИ РЕФЕРАЛЫ */}
        <h2 style={{
          color: '#fff', fontWeight: 900,
          fontSize: 'clamp(18px,5vw,22px)',
          textAlign: 'center', margin: '4px 0 0', flexShrink: 0,
        }}>
          Твои рефералы
        </h2>

        {/* 5 ── EARNINGS + CLAIM */}
        <div style={{
          flexShrink: 0, borderRadius: 18,
          background: 'linear-gradient(180deg,rgba(42,38,22,0.97),rgba(24,20,10,0.97))',
          border: '1px solid #5a5030',
          padding: '12px 14px',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 14, marginBottom: 4 }}>
              Друны заработали:
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: '#f0c020', fontWeight: 900, fontSize: 'clamp(22px,6vw,28px)', lineHeight: 1 }}>
                {EARNED}
              </span>
              <img src={imgCoin} alt="coin" style={{ width: 28, height: 28, objectFit: 'contain' }} />
            </div>
          </div>
          <button
            onClick={() => console.log('claim')}
            style={{
              flexShrink: 0, padding: '12px 24px', borderRadius: 14,
              background: 'linear-gradient(180deg,#f0c020,#c89000)',
              border: '2px solid #8a6000',
              boxShadow: '0 4px 0 #5a3a00',
              color: '#000', fontWeight: 900,
              fontSize: 'clamp(16px,4.5vw,20px)',
              cursor: 'pointer', fontStyle: 'italic',
            }}
            onPointerDown={e => { e.currentTarget.style.transform = 'translateY(2px)'; e.currentTarget.style.boxShadow = '0 2px 0 #5a3a00'; }}
            onPointerUp={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 0 #5a3a00'; }}
            onPointerLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 0 #5a3a00'; }}
          >
            забрать
          </button>
        </div>

        {/* 6 ── REFERRAL LIST */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {REFERRALS.map(r => <ReferralRow key={r.id} r={r} />)}
        </div>

      </div>

      {/* ── BOTTOM NAV ────────────────────────────────── */}
      <SnackBar />

      {/* ── PAGE 19 MODAL ─────────────────────────────── */}
      <Page19Modal isOpen={showRoad} onClose={() => setShowRoad(false)} />
    </div>
  );
};

export default Page18;