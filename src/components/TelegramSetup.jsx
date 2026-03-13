// src/components/TelegramSetup.jsx
// ─────────────────────────────────────────────
// Paste <TelegramSetup /> once inside your
// App.jsx, just inside the Router.
// It runs once on mount and sets everything up.
// ─────────────────────────────────────────────
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const tg = window.Telegram?.WebApp;

const TelegramSetup = () => {
  const navigate  = useNavigate();
  const location  = useLocation();

  useEffect(() => {
    if (!tg) return;

    // 1. Tell Telegram the app is ready
    tg.ready();

    // 2. Expand to full screen so no white gap at bottom
    tg.expand();

    // 3. Black header bar (matches design)
    tg.setHeaderColor('#000000');

    // 4. Black background
    tg.setBackgroundColor('#000000');

    // 5. Disable closing the app by swipe (prevents accidental close)
    tg.disableVerticalSwipes?.();

  }, []);

  // Show/hide Telegram Back button based on current route
  useEffect(() => {
    if (!tg) return;

    const isHome = location.pathname === '/' || location.pathname === '/page1';

    if (isHome) {
      tg.BackButton.hide();
    } else {
      tg.BackButton.show();
      const handler = () => navigate(-1);
      tg.BackButton.onClick(handler);
      return () => tg.BackButton.offClick(handler);
    }
  }, [location.pathname]);

  return null;
};

export default TelegramSetup;