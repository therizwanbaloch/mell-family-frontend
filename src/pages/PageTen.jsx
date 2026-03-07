import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoAdd, IoRemove, IoInformationCircle } from 'react-icons/io5';
import { FaTicketAlt } from 'react-icons/fa';


import heroBg from '../assets/page10Images/cardbg.webp';       
import ticketIcon from '../assets/page10Images/ticket-icon.webp'; 
import faIcon from '../assets/page10Images/ticket-small.webp';   

const PRESET_AMOUNTS = [10, 100, 1000, 10000];

const PageTen = () => {
  const navigate = useNavigate();

  
  const [betAmount, setBetAmount]         = useState(50);
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [timeLeft, setTimeLeft]           = useState(2 * 3600 + 19 * 60 + 54); // seconds

  // Dynamic data — swap with real API later
  const playerTickets  = 123;
  const currentBet     = 10;
  const playerRank     = 916;
  const prizePool      = '5 769 660';

  // ── Countdown timer ────────────────────────────────────
  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft(t => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const fmt = (s) => {
    const h  = String(Math.floor(s / 3600)).padStart(2, '0');
    const m  = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
    const sc = String(s % 60).padStart(2, '0');
    return `${h}:${m}:${sc}`;
  };

  // ── Bet controls ───────────────────────────────────────
  const decrement = () => {
    setSelectedPreset(null);
    setBetAmount(v => Math.max(1, v - 1));
  };
  const increment = () => {
    setSelectedPreset(null);
    setBetAmount(v => v + 1);
  };
  const pickPreset = (val) => {
    setSelectedPreset(val);
    setBetAmount(val);
  };
  const handleBet = () => {
    // TODO: call backend bet API
    console.log('Placing bet:', betAmount);
  };

  return (
    <div
      style={{
        maxWidth: '430px',
        margin: '0 auto',
        height: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#1a1a1a',
        overflow: 'hidden',
        fontFamily: "'Nunito', 'Segoe UI', sans-serif",
      }}
    >

      {/* ── TOP BAR ─────────────────────────────────────── */}
      <div
        style={{
          flexShrink: 0,
          paddingTop: 'clamp(10px, 3vw, 16px)',
          paddingBottom: 'clamp(6px, 2vw, 10px)',
          textAlign: 'center',
          background: 'linear-gradient(180deg, #000 0%, transparent 100%)',
        }}
      >
        <h1
          style={{
            color: '#ffffff',
            fontWeight: 900,
            fontSize: 'clamp(15px, 4.5vw, 20px)',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            margin: 0,
            lineHeight: 1.1,
          }}
        >
          DRUN FAMILY
        </h1>
        <p
          style={{
            color: 'rgba(255,255,255,0.55)',
            fontSize: 'clamp(10px, 2.5vw, 13px)',
            letterSpacing: '0.2em',
            margin: 0,
            fontStyle: 'italic',
          }}
        >
          game
        </p>
      </div>

      {/* ── HERO CARD ────────────────────────────────────── */}
      <div
        style={{
          flexShrink: 0,
          margin: '0 clamp(10px,3vw,16px)',
          borderRadius: '18px',
          overflow: 'hidden',
          border: '2px solid #c9940a',
          boxShadow: '0 4px 24px rgba(201,148,10,0.35)',
          position: 'relative',
        }}
      >
        {/* Hero image */}
        <img
          src={heroBg}
          alt="Tournament Hero"
          style={{
            width: '100%',
            height: 'clamp(160px, 38vw, 220px)',
            objectFit: 'cover',
            objectPosition: 'top center',
            display: 'block',
          }}
        />

        {/* Tickets badge — top left */}
        <div
          style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'linear-gradient(180deg, #2a2a2a, #111)',
            border: '2px solid #c9940a',
            borderRadius: '12px',
            padding: '5px 10px',
          }}
        >
          <img src={ticketIcon} alt="ticket" style={{ width: '22px', height: '22px', objectFit: 'contain' }} />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1 }}>
            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              БИЛЕТЫ
            </span>
            <span style={{ color: '#FFD700', fontSize: 'clamp(14px, 4vw, 18px)', fontWeight: 900 }}>
              {playerTickets}
            </span>
          </div>
          {/* + button */}
          <button
            style={{
              marginLeft: '4px',
              width: '26px',
              height: '26px',
              borderRadius: '8px',
              background: 'linear-gradient(180deg,#888,#555)',
              border: '1.5px solid #999',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
            }}
            onClick={() => navigate('/shop')}
          >
            <IoAdd size={16} />
          </button>
        </div>

        {/* Info button — top right */}
        <button
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            background: 'rgba(0,0,0,0.5)',
            border: '2px solid rgba(255,255,255,0.3)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <IoInformationCircle size={20} />
        </button>

        {/* Bottom label overlay */}
        <div
          style={{
            position: 'absolute',
            bottom: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'linear-gradient(180deg, #f0a800, #c87800)',
            border: '2px solid #8a5500',
            borderRadius: '9999px',
            padding: 'clamp(5px,1.5vw,8px) clamp(18px,5vw,28px)',
            boxShadow: '0 3px 12px rgba(0,0,0,0.5)',
            whiteSpace: 'nowrap',
          }}
        >
          <span
            style={{
              color: '#000',
              fontWeight: 900,
              fontSize: 'clamp(13px, 3.5vw, 17px)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}
          >
            ТУРНИР БИЛЕТОВ
          </span>
        </div>
      </div>

      {/* ── SCROLLABLE CONTENT ───────────────────────────── */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '0 clamp(10px,3vw,16px) clamp(12px,3vw,20px)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(8px,2vw,12px)',
        }}
      >

        {/* ── COUNTDOWN ─────────────────────────────────── */}
        <div
          style={{
            borderRadius: '14px',
            background: 'linear-gradient(180deg, #222 0%, #111 100%)',
            border: '1.5px solid #444',
            padding: 'clamp(10px,2.5vw,16px) 16px',
            textAlign: 'center',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
          }}
        >
          <p
            style={{
              color: 'rgba(255,255,255,0.6)',
              fontSize: 'clamp(11px,3vw,14px)',
              fontWeight: 700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              margin: '0 0 4px',
            }}
          >
            ОСТАЛОСЬ
          </p>
          <p
            style={{
              color: '#ffffff',
              fontSize: 'clamp(32px,9vw,48px)',
              fontWeight: 900,
              letterSpacing: '0.08em',
              margin: 0,
              lineHeight: 1,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {fmt(timeLeft)}
          </p>
        </div>

        {/* ── PRIZE POOL ────────────────────────────────── */}
        <div
          style={{
            borderRadius: '14px',
            background: 'linear-gradient(180deg, #2a2000, #1a1400)',
            border: '1.5px solid #c9940a',
            padding: 'clamp(8px,2vw,12px) 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 2px 12px rgba(201,148,10,0.2)',
          }}
        >
          <span
            style={{
              color: '#c9940a',
              fontSize: 'clamp(10px,2.8vw,13px)',
              fontWeight: 700,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
            }}
          >
            ПРИЗОВОЙ ФОНД
          </span>
          <img src={faIcon} alt="fa" style={{ width: '20px', height: '20px', objectFit: 'contain', flexShrink: 0 }} />
          <span
            style={{
              color: '#FFD700',
              fontSize: 'clamp(13px,3.5vw,16px)',
              fontWeight: 900,
              letterSpacing: '0.05em',
            }}
          >
            {prizePool}
          </span>
        </div>

        {/* ── STATS ROW ─────────────────────────────────── */}
        <div style={{ display: 'flex', gap: 'clamp(8px,2vw,12px)' }}>
          {/* Current Bet */}
          <div
            style={{
              flex: 1,
              borderRadius: '14px',
              background: 'linear-gradient(180deg, #222, #111)',
              border: '1.5px solid #444',
              padding: 'clamp(10px,2.5vw,14px) 12px',
              textAlign: 'center',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
            }}
          >
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 'clamp(10px,2.5vw,12px)', fontWeight: 700, margin: '0 0 6px', letterSpacing: '0.05em' }}>
              Текущая ставка
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <img src={ticketIcon} alt="ticket" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
              <span style={{ color: '#FFD700', fontSize: 'clamp(22px,6vw,30px)', fontWeight: 900, lineHeight: 1 }}>
                {currentBet}
              </span>
            </div>
          </div>

          {/* Ranking */}
          <div
            style={{
              flex: 1,
              borderRadius: '14px',
              background: 'linear-gradient(180deg, #222, #111)',
              border: '1.5px solid #444',
              padding: 'clamp(10px,2.5vw,14px) 12px',
              textAlign: 'center',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
            }}
          >
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 'clamp(10px,2.5vw,12px)', fontWeight: 700, margin: '0 0 6px', letterSpacing: '0.05em' }}>
              Место в рейтинге
            </p>
            <span style={{ color: '#ffffff', fontSize: 'clamp(22px,6vw,30px)', fontWeight: 900, lineHeight: 1 }}>
              {playerRank}
            </span>
          </div>
        </div>

        {/* ── BET INPUT ─────────────────────────────────── */}
        <div
          style={{
            borderRadius: '14px',
            background: 'linear-gradient(180deg, #2a2a2a, #1a1a1a)',
            border: '1.5px solid #444',
            padding: 'clamp(10px,2.5vw,14px) 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: 'clamp(8px,2vw,10px)',
          }}
        >
          {/* +/- row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
            <button
              onClick={decrement}
              style={{
                width: 'clamp(36px,9vw,44px)',
                height: 'clamp(36px,9vw,44px)',
                borderRadius: '50%',
                background: 'linear-gradient(180deg,#777,#555)',
                border: '2px solid #888',
                color: '#fff',
                fontSize: '20px',
                fontWeight: 900,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0,
                boxShadow: '0 3px 0 #333',
              }}
            >
              <IoRemove size={20} />
            </button>

            <span
              style={{
                flex: 1,
                textAlign: 'center',
                color: '#ffffff',
                fontSize: 'clamp(26px,7vw,36px)',
                fontWeight: 900,
                letterSpacing: '0.05em',
              }}
            >
              {betAmount}
            </span>

            <button
              onClick={increment}
              style={{
                width: 'clamp(36px,9vw,44px)',
                height: 'clamp(36px,9vw,44px)',
                borderRadius: '50%',
                background: 'linear-gradient(180deg,#777,#555)',
                border: '2px solid #888',
                color: '#fff',
                fontSize: '20px',
                fontWeight: 900,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0,
                boxShadow: '0 3px 0 #333',
              }}
            >
              <IoAdd size={20} />
            </button>
          </div>

          {/* Preset amounts grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(6px,1.5vw,10px)' }}>
            {PRESET_AMOUNTS.map((val) => {
              const isActive = selectedPreset === val;
              return (
                <button
                  key={val}
                  onClick={() => pickPreset(val)}
                  style={{
                    padding: 'clamp(8px,2vw,12px) 0',
                    borderRadius: '12px',
                    background: isActive
                      ? 'linear-gradient(180deg, #5ecb1a, #3a9010)'
                      : 'linear-gradient(180deg, #555, #3a3a3a)',
                    border: isActive ? '2px solid #2a6a08' : '2px solid #666',
                    color: '#ffffff',
                    fontSize: 'clamp(14px,4vw,18px)',
                    fontWeight: 900,
                    cursor: 'pointer',
                    boxShadow: isActive
                      ? '0 3px 0 #1a5008'
                      : '0 3px 0 #222',
                    transition: 'all 0.15s ease',
                    letterSpacing: '0.04em',
                  }}
                >
                  {val.toLocaleString()}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── PLACE BET BUTTON ──────────────────────────── */}
        <button
          onClick={handleBet}
          style={{
            width: '100%',
            padding: 'clamp(14px,3.5vw,18px) 0',
            borderRadius: '16px',
            background: 'linear-gradient(180deg, #5ecb1a 0%, #3a9010 100%)',
            border: '2px solid #2a6a08',
            boxShadow: '0 5px 0 #1a4a06, 0 8px 16px rgba(0,0,0,0.4)',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2px',
            transition: 'transform 0.1s ease',
          }}
          onPointerDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
          onPointerUp={e => e.currentTarget.style.transform = 'scale(1)'}
          onPointerLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <span
            style={{
              color: '#ffffff',
              fontSize: 'clamp(18px,5vw,24px)',
              fontWeight: 900,
              letterSpacing: '0.08em',
            }}
          >
            Ставка
          </span>
          <span
            style={{
              color: 'rgba(255,255,255,0.75)',
              fontSize: 'clamp(11px,2.8vw,13px)',
              fontWeight: 700,
              letterSpacing: '0.05em',
            }}
          >
            {betAmount} Билетов
          </span>
        </button>

      </div>
    </div>
  );
};

export default PageTen;