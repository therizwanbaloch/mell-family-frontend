import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchState, clearActionError } from '../redux/gameSlice';
import shopBg  from '../assets/page1bg.webp';
import logoDark from '../assets/logo-darkk.webp';
import shopItem1 from '../assets/ShopCardImages/item1.webp';
import shopItem2 from '../assets/ShopCardImages/item2.webp';
import shopItem3 from '../assets/ShopCardImages/item3.webp';
import shopItem4 from '../assets/ShopCardImages/item4.webp';
import shopItem5 from '../assets/ShopCardImages/item5.webp';
import shopItem6 from '../assets/ShopCardImages/item6.webp';
import greenItem1 from '../assets/ShopCardImages/greenItem1.webp';
import greenItem2 from '../assets/ShopCardImages/greenItem2.webp';
import greenItem3 from '../assets/ShopCardImages/greenItem3.webp';
import greenItem4 from '../assets/ShopCardImages/greenItem4.webp';
import greenItem5 from '../assets/ShopCardImages/greenItem5.webp';
import greenItem6 from '../assets/ShopCardImages/greenItem6.webp';
import ShopCard from '../components/ShopingCardGrey';
import ShopCardGreen from '../components/ShopCardGreen';
import SnackBar from '../components/SnackBar';

// ── Telegram Stars Payment ────────────────────────────────────
//
// HOW IT WORKS:
// 1. Frontend requests a one-time invoice link from your backend
// 2. Backend creates a Telegram invoice via Bot API (createInvoiceLink)
//    and returns the link to frontend
// 3. Frontend calls window.Telegram.WebApp.openInvoice(link, callback)
// 4. Telegram handles EVERYTHING:
//    - If user HAS enough stars → deducts instantly, returns status="paid"
//    - If user DOESN'T have stars → Telegram opens its own "Buy Stars" screen,
//      user buys stars, then payment completes, returns status="paid"
//    - If user cancels → returns status="cancelled"
// 5. On "paid": backend webhook (pre_checkout_query + successful_payment)
//    fires automatically. Then we call fetchState to sync the new inventory.
//
// BACKEND REQUIREMENTS:
// POST /api/store/invoice  body: { key, qty }
// Returns: { invoice_link: "https://t.me/$invoice..." }
//
// Your backend must also handle the Telegram webhook:
//   - pre_checkout_query → answer with answerPreCheckoutQuery(ok=true)
//   - successful_payment → credit the item to the user

const TOKEN_KEY = 'mell_api_token'

const openStarsPayment = (key, qty = 1, onSuccess, onError, onLoading) => {
  onLoading?.(true)

  // Step 1 — ask backend to create invoice link
  fetch('/api/store/invoice', {
    method:  'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
    },
    body: JSON.stringify({ key, qty }),
  })
    .then(r => {
      if (!r.ok) throw new Error(`Invoice failed (${r.status})`)
      return r.json()
    })
    .then(({ invoice_link }) => {
      if (!invoice_link) throw new Error('No invoice_link in response')

      const tg = window.Telegram?.WebApp

      if (!tg?.openInvoice) {
        // ── DEV FALLBACK (browser, no Telegram) ──────────────────
        // In production this branch never runs.
        // In dev, simulate a successful payment so you can test the flow.
        console.warn('[Stars] No Telegram WebApp — simulating paid')
        onLoading?.(false)
        onSuccess?.()
        return
      }

      // Step 2 — open Telegram payment sheet
      // Telegram automatically shows "Buy Stars" if user has insufficient balance
      tg.openInvoice(invoice_link, (status) => {
        onLoading?.(false)
        if (status === 'paid') {
          // ✅ Stars deducted, item will be credited via backend webhook
          onSuccess?.()
        } else if (status === 'cancelled') {
          // User closed the sheet without paying — silent, no error toast
          onError?.(null)
        } else {
          // status === 'failed' or unknown
          onError?.('Ошибка оплаты. Попробуй ещё раз.')
        }
      })
    })
    .catch(err => {
      onLoading?.(false)
      onError?.(err.message || 'Не удалось создать счёт')
    })
}

// ── Toast ─────────────────────────────────────────────────────
const Toast = ({ message, type, onClose }) => {
  if (!message) return null;
  return (
    <div
      className='fixed top-4 left-1/2 z-50 rounded-xl font-black text-white text-center px-5 py-3 shadow-xl'
      style={{
        transform: 'translateX(-50%)',
        background: type === 'error'
          ? 'linear-gradient(135deg,#dd1010,#aa0000)'
          : 'linear-gradient(135deg,#2a8a10,#1a6008)',
        fontSize: '13px',
        maxWidth: '320px',
        border: type === 'error' ? '2px solid #ff4444' : '2px solid #5aba20',
      }}
      onClick={onClose}
    >
      {message}
    </div>
  );
};

// ── Item definitions ──────────────────────────────────────────
const GREY_ITEMS = [
  { key: 'chips_20',    image: shopItem1, label: '20 Фишек',    price: '4',    objectPosition: 'center' },
  { key: 'chips_100',   image: shopItem2, label: '100 Фишек',   price: '19',   objectPosition: 'center' },
  { key: 'chips_500',   image: shopItem3, label: '500 Фишек',   price: '90',   objectPosition: 'center' },
  { key: 'chips_2000',  image: shopItem4, label: '2000 Фишек',  price: '350',  objectPosition: 'center' },
  { key: 'chips_10000', image: shopItem5, label: '10000 Фишек', price: '1720', objectPosition: 'top'    },
  { key: 'chips_50000', image: shopItem6, label: '50000 Фишек', price: '8500', objectPosition: 'top'    },
];

const GREEN_ITEMS = [
  { key: 'tickets_200',    image: greenItem1, label: '200 Билетов',    price: '4',    objectPosition: 'center' },
  { key: 'tickets_1000',   image: greenItem2, label: '1000 Билетов',   price: '19',   objectPosition: 'center' },
  { key: 'tickets_5000',   image: greenItem3, label: '5000 Билетов',   price: '90',   objectPosition: 'center' },
  { key: 'tickets_20000',  image: greenItem4, label: '20000 Билетов',  price: '350',  objectPosition: 'center' },
  { key: 'tickets_100000', image: greenItem5, label: '100000 Билетов', price: '1720', objectPosition: 'top'    },
  { key: 'tickets_500000', image: greenItem6, label: '500000 Билетов', price: '8500', objectPosition: 'top'    },
];

// ── Shop ──────────────────────────────────────────────────────
const Shop = () => {
  const dispatch  = useDispatch();

  const [buyingKey, setBuyingKey] = useState(null);
  const [toast,     setToast]     = useState(null);

  const clearToast = () => {
    setToast(null);
    dispatch(clearActionError());
  };

  // Opens Telegram Stars invoice — Telegram handles stars deduction
  // or prompts user to buy stars if balance is insufficient
  const handleBuy = (key, label) => {
    if (buyingKey) return
    openStarsPayment(
      key, 1,
      async () => {
        // paid — sync state so inventory/balance updates
        await dispatch(fetchState())
        setToast({ message: `✅ ${label} куплено!`, type: 'success' })
        setBuyingKey(null)
      },
      (err) => {
        // null = user cancelled silently, string = real error
        if (err) setToast({ message: err, type: 'error' })
        setBuyingKey(null)
      },
      (loading) => {
        // loading=true while waiting for invoice link from backend
        setBuyingKey(loading ? key : null)
      }
    )
  }

  return (
    <div
      className='w-full'
      style={{
        backgroundImage: `url(${shopBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        maxWidth: '430px',
        margin: '0 auto',
        height: '100dvh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Toast message={toast?.message} type={toast?.type} onClose={clearToast} />

      {/* Header — Page14 style, NO star balance, NO tabs */}
      <div className="shrink-0 px-4 pt-3 pb-4" style={{ background: '#dbdbdb' }}>

        {/* LOGO IMAGE — same as Page14 */}
        <div
          className="flex justify-center overflow-hidden mx-auto mb-2"
          style={{ width: 160, height: 41, position: 'relative' }}
        >
          <img
            src={logoDark}
            alt="Drun Family Game"
            style={{ position: 'absolute', width: 266, height: 'auto', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}
          />
        </div>

        {/* МАГАЗИН title — gold with dark orange stroke, centered */}
        <h2
          className='font-black uppercase text-center'
          style={{
            fontSize: 'clamp(26px, 9vw, 38px)',
            color: '#deba00',
            letterSpacing: '0.15em',
            textShadow: '0 1px 0 #af8700, 0 3px 6px rgba(0,0,0,0.4)',
            WebkitTextStroke: '1px #af8700',
            margin: 0,
            lineHeight: 1.1,
          }}
        >
          Магазин
        </h2>

      </div>

      <div className='flex-1 overflow-y-auto pb-24' style={{ WebkitOverflowScrolling: 'touch' }}>

        {/* ФИШКИ */}
        <div className='flex justify-center mt-4'>
          <button
            className='font-black rounded-xl'
            style={{
              paddingTop: '3px', paddingBottom: '3px',
              paddingLeft: '52px', paddingRight: '52px',
              background: 'linear-gradient(90deg, #ffc500 0%, #ffad31 100%)',
              border: '2px solid #744500',
              color: '#3a2200',
              fontSize: 'clamp(16px, 5.5vw, 20px)',
              boxShadow: '0 3px 0 #4a2c00, 0 5px 10px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.3)',
              letterSpacing: '0.05em',
            }}
          >
            Фишки
          </button>
        </div>

        <div className='grid grid-cols-3 gap-2 px-3 mt-4'>
          {GREY_ITEMS.map((item) => (
            <ShopCard
              key={item.key}
              image={item.image}
              label={item.label}
              price={item.price}
              emoji='⭐'
              objectPosition={item.objectPosition}
              loading={buyingKey === item.key}
              onClick={() => handleBuy(item.key, item.label)}
            />
          ))}
        </div>

        {/* БИЛЕТЫ */}
        <div className='flex justify-center mt-6'>
          <button
            className='font-black rounded-xl'
            style={{
              paddingTop: '3px', paddingBottom: '3px',
              paddingLeft: '52px', paddingRight: '52px',
              background: 'linear-gradient(90deg, #ffc500 0%, #ffad31 100%)',
              border: '2px solid #744500',
              color: '#3a2200',
              fontSize: 'clamp(16px, 5.5vw, 20px)',
              boxShadow: '0 3px 0 #4a2c00, 0 5px 10px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.3)',
              letterSpacing: '0.05em',
            }}
          >
            Билеты
          </button>
        </div>

        <div className='grid grid-cols-3 gap-2 px-3 mt-4'>
          {GREEN_ITEMS.map((item) => (
            <ShopCardGreen
              key={item.key}
              image={item.image}
              label={item.label}
              price={item.price}
              objectPosition={item.objectPosition}
              loading={buyingKey === item.key}
              onClick={() => handleBuy(item.key, item.label)}
            />
          ))}
        </div>

      </div>

      <SnackBar />
    </div>
  );
};

export default Shop;