// src/hooks/useTelegram.js
// ─────────────────────────────────────────────
// Drop this hook into any page component to
// control the Telegram header Back button.
// ─────────────────────────────────────────────
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const tg = window.Telegram?.WebApp;

export function useTelegram() {
  return tg;
}

// Use this on every SUB-PAGE (not home) to show ← Back in Telegram header
export function useTelegramBack(customCallback) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!tg) return;

    tg.BackButton.show();

    const handler = customCallback ?? (() => navigate(-1));
    tg.BackButton.onClick(handler);

    return () => {
      tg.BackButton.offClick(handler);
      tg.BackButton.hide();
    };
  }, []);
}