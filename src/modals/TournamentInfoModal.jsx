import { useState, useEffect } from "react";

// ── replace with your actual image path ──
import imgModalBanner from "../assets/page9Images/modal-banner.webp";

const useCountdown = (initial) => {
  const [time, setTime] = useState(initial);
  useEffect(() => {
    const t = setInterval(() => setTime(p => p > 0 ? p - 1 : 0), 1000);
    return () => clearInterval(t);
  }, []);
  const h = String(Math.floor(time / 3600)).padStart(2, '0');
  const m = String(Math.floor((time % 3600) / 60)).padStart(2, '0');
  const s = String(time % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
};

const TournamentInfoModal = ({ isOpen, onClose }) => {
  const [visible, setVisible]     = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const countdown = useCountdown(3 * 3600);

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

  return (
    <div
      onClick={onClose}
      className={`fixed inset-0 z-50 flex items-center justify-center px-4
        transition-all duration-300
        ${animateIn ? 'bg-black/70 backdrop-blur-sm' : 'bg-black/0 backdrop-blur-none'}`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-sm flex flex-col rounded-3xl overflow-hidden shadow-2xl
          transition-all duration-350
          ${animateIn ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'}`}
        style={{
          background: 'linear-gradient(180deg,#6a6a6a 0%,#4a4a4a 100%)',
          border: '2px solid #888',
          maxHeight: '88dvh',
          overflowY: 'auto',
        }}
      >

        {/* ── Close button row ── */}
        <div className="flex justify-end px-4 pt-4 pb-2 shrink-0">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 font-black text-white active:scale-95 transition-transform"
            style={{ background: 'linear-gradient(180deg,#555,#333)', border: '1.5px solid #777', fontSize: 14 }}
          >
            <span style={{ color: '#e03030', fontSize: 16 }}>✕</span>
            Закрыть
          </button>
        </div>

        {/* ── Banner image ── */}
        <div className="px-4 shrink-0">
          <div className="rounded-2xl overflow-hidden" style={{ border: '1.5px solid #666' }}>
            <img
              src={imgModalBanner}
              alt="tournament"
              className="w-full object-cover"
              style={{ height: '210px' }}
            />
          </div>
        </div>

        {/* ── Description text ── */}
        <div className="px-5 pt-4 pb-3 shrink-0">
          <p
            className="text-white font-bold text-center leading-snug"
            style={{ fontSize: 'clamp(14px,4vw,16px)' }}
          >
            Ставь билеты и получи шанс стать самым богатым в{' '}
            <span className="font-black">DRUN FAMILY GAME!</span>
          </p>
        </div>

        {/* ── Countdown card ── */}
        <div className="px-4 pb-2 shrink-0">
          <div
            className="rounded-2xl flex flex-col items-center justify-center py-4"
            style={{
              background: 'linear-gradient(180deg,#1a1a1a,#0d0d0d)',
              border: '2px solid #555',
            }}
          >
            <p
              className="font-black text-white uppercase tracking-widest"
              style={{ fontSize: 13, letterSpacing: '0.2em' }}
            >
              ОСТАЛОСЬ
            </p>
            <p
              className="font-black text-white"
              style={{ fontSize: 'clamp(38px,12vw,52px)', letterSpacing: '0.06em', lineHeight: 1.1 }}
            >
              {countdown}
            </p>
          </div>
        </div>

        {/* ── Frequency note ── */}
        <div className="px-5 py-2 shrink-0">
          <p
            className="text-white font-semibold text-center"
            style={{ fontSize: 'clamp(13px,3.5vw,15px)' }}
          >
            Турнир проходит раз в три часа
          </p>
        </div>

        {/* ── Rules card ── */}
        <div className="px-4 pb-5 shrink-0">
          <div
            className="rounded-2xl px-4 py-4"
            style={{
              background: 'linear-gradient(180deg,#555,#3a3a3a)',
              border: '1.5px solid #666',
            }}
          >
            <p
              className="text-white font-bold text-center leading-relaxed"
              style={{ fontSize: 'clamp(13px,3.5vw,15px)' }}
            >
              Ставки может сделать каждый, но победит только друн, который поставит больше всех – он и заберет все билеты.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TournamentInfoModal;