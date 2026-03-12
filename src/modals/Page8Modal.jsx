import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import ticketBannerImg from "../assets/page8Images/tournament-banner.webp";
import usdtBannerImg   from "../assets/page8Images/giveaway-banner.webp";
import faTicketIcon    from "../assets/page8Images/ticket-icon.webp";

const Page8Modal = ({ isOpen, onClose }) => {
  const [visible,   setVisible]   = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setAnimateIn(true)));
    } else {
      setAnimateIn(false);
      const t = setTimeout(() => setVisible(false), 350);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  if (!visible) return null;

  const goToNine   = () => { onClose(); navigate('/nine'); };
  const goToPage12 = () => { onClose(); navigate('/page12'); };

  return (
    <div
      onClick={onClose}
      className={`fixed inset-0 z-[60] flex items-end justify-center transition-all duration-300
        ${animateIn ? 'bg-black/55 backdrop-blur-sm' : 'bg-black/0 backdrop-blur-none'}`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-lg flex flex-col overflow-hidden rounded-t-3xl shadow-2xl
          transition-transform duration-[350ms] ease-[cubic-bezier(0.32,0.72,0,1)]
          ${animateIn ? 'translate-y-0' : 'translate-y-full'}`}
        style={{
          background: 'linear-gradient(180deg,#2a2a2a 0%,#1a1a1a 100%)',
          border: '1.5px solid #555',
          maxHeight: '88dvh',
        }}
      >
        <div className="mx-auto mt-2 mb-3 h-1 w-10 rounded-full bg-white/25 shrink-0" />

        <div className="flex-1 overflow-y-auto px-3 pb-5 flex flex-col gap-3">

          {/* Header */}
          <div className="flex items-center gap-3 px-1">
            <img src={faTicketIcon} alt="ticket"
              style={{ width: '56px', height: '56px', objectFit: 'contain', flexShrink: 0 }} />
            <div>
              <h2 style={{
                color: '#fff', fontWeight: 900,
                fontSize: 'clamp(22px,7vw,30px)',
                textTransform: 'uppercase',
                textShadow: '0 2px 8px rgba(0,0,0,0.8)',
                lineHeight: 1.1,
              }}>ТУРНИРЫ</h2>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '13px', fontWeight: 600, lineHeight: 1.3 }}>
                Бери участие в турнирах и розыгрышах и получай свои USDT!
              </p>
            </div>
          </div>

          {/* Top banner → /nine  |  text: TOP-RIGHT */}
          <div
            onClick={goToNine}
            className="active:scale-[0.98] transition-transform"
            style={{
              position: 'relative', borderRadius: '16px', overflow: 'hidden',
              cursor: 'pointer', WebkitTapHighlightColor: 'transparent',
              border: '1.5px solid rgba(255,255,255,0.15)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
              aspectRatio: '16/9',
            }}
          >
            <img src={ticketBannerImg} alt="Турнир на билеты"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />

            {/* Gradient darkens top-right corner */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(225deg, rgba(0,0,0,0.72) 0%, transparent 60%)',
              pointerEvents: 'none',
            }} />

            {/* Text — TOP RIGHT */}
            <div style={{
              position: 'absolute', top: '12px', right: '14px',
              display: 'flex', flexDirection: 'column', alignItems: 'flex-end',
            }}>
              <span style={{
                color: '#fff', fontWeight: 900,
                fontSize: 'clamp(16px,5vw,22px)',
                textTransform: 'uppercase', textAlign: 'right',
                textShadow: '0 2px 8px rgba(0,0,0,0.95)',
                lineHeight: 1.15,
              }}>ТУРНИР{'\n'}НА БИЛЕТЫ</span>
              <span style={{
                color: 'rgba(255,255,255,0.88)', fontWeight: 700,
                fontSize: 'clamp(10px,2.8vw,12px)', textAlign: 'right',
                textShadow: '0 1px 4px rgba(0,0,0,0.95)',
                marginTop: '3px',
              }}>Лучший забирает все</span>
            </div>
          </div>

          {/* Bottom banner → /page12  |  text: TOP-LEFT */}
          <div
            onClick={goToPage12}
            className="active:scale-[0.98] transition-transform"
            style={{
              position: 'relative', borderRadius: '16px', overflow: 'hidden',
              cursor: 'pointer', WebkitTapHighlightColor: 'transparent',
              border: '1.5px solid rgba(255,255,255,0.15)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
              aspectRatio: '16/9',
            }}
          >
            <img src={usdtBannerImg} alt="Розыгрыш USDT"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />

            {/* Gradient darkens top-left corner */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(135deg, rgba(0,0,0,0.72) 0%, transparent 60%)',
              pointerEvents: 'none',
            }} />

            {/* Text — TOP LEFT */}
            <div style={{
              position: 'absolute', top: '12px', left: '14px',
              display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
            }}>
              <span style={{
                color: '#fff', fontWeight: 900,
                fontSize: 'clamp(16px,5vw,22px)',
                textTransform: 'uppercase',
                textShadow: '0 2px 8px rgba(0,0,0,0.95)',
                lineHeight: 1.15,
              }}>РОЗЫГРЫШ</span>
              <span style={{
                color: '#FFD700', fontWeight: 900,
                fontSize: 'clamp(16px,5vw,22px)',
                textTransform: 'uppercase',
                textShadow: '0 2px 8px rgba(0,0,0,0.95)',
                lineHeight: 1.15,
              }}>USDT</span>
              <span style={{
                color: 'rgba(255,255,255,0.9)', fontWeight: 700,
                fontSize: 'clamp(10px,2.8vw,12px)',
                textShadow: '0 1px 4px rgba(0,0,0,0.95)',
                marginTop: '3px',
              }}>Заработай до 2300$</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Page8Modal;