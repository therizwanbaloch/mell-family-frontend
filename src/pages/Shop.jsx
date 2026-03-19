import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchState, clearActionError } from '../redux/gameSlice';

// Assets
import shopBg from '../assets/page1bg.webp';
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

// Components
import ShopCard from '../components/ShopingCardGrey';
import ShopCardGreen from '../components/ShopCardGreen';
import SnackBar from '../components/SnackBar';

const TOKEN_KEY = 'mell_api_token';

// ── Payment Logic (Keep unchanged) ───────────────────────────
const openStarsPayment = (key, qty = 1, onSuccess, onError, onLoading) => {
  onLoading?.(true);
  fetch('/api/store/invoice', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
    },
    body: JSON.stringify({ key, qty }),
  })
    .then(r => { if (!r.ok) throw new Error(`Invoice failed`); return r.json(); })
    .then(({ invoice_link }) => {
      const tg = window.Telegram?.WebApp;
      if (!tg?.openInvoice) {
        onLoading?.(false); onSuccess?.(); return;
      }
      tg.openInvoice(invoice_link, (status) => {
        onLoading?.(false);
        if (status === 'paid') onSuccess?.();
        else if (status === 'cancelled') onError?.(null);
        else onError?.('Ошибка оплаты');
      });
    })
    .catch(err => { onLoading?.(false); onError?.(err.message); });
};

// ── Shared Category Title Component ──────────────────────────
const CategoryTitle = ({ children }) => (
  <div className='flex justify-center mt-6 first:mt-4'>
    <button
      className='font-black rounded-xl select-none'
      style={{
        padding: '3px 52px',
        background: 'linear-gradient(90deg, #ffc500 0%, #ffad31 100%)',
        border: '2px solid #744500',
        color: '#3a2200',
        fontSize: 'clamp(16px, 5.5vw, 20px)',
        boxShadow: '0 3px 0 #4a2c00, 0 5px 10px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.3)',
        letterSpacing: '0.05em',
      }}
    >
      {children}
    </button>
  </div>
);

const Shop = () => {
  const dispatch = useDispatch();
  const [buyingKey, setBuyingKey] = useState(null);

  const handleBuy = (key, label) => {
    if (buyingKey) return;
    openStarsPayment(key, 1, 
      async () => {
        await dispatch(fetchState());
        setBuyingKey(null);
      },
      () => setBuyingKey(null),
      (loading) => setBuyingKey(loading ? key : null)
    );
  };

  const GREY_ITEMS = [
    { key: 'chips_20', image: shopItem1, label: '20 Фишек', price: '4' },
    { key: 'chips_100', image: shopItem2, label: '100 Фишек', price: '19' },
    { key: 'chips_500', image: shopItem3, label: '500 Фишек', price: '90' },
    { key: 'chips_2000', image: shopItem4, label: '2000 Фишек', price: '350' },
    { key: 'chips_10000', image: shopItem5, label: '10000 Фишек', price: '1720' },
    { key: 'chips_50000', image: shopItem6, label: '50000 Фишек', price: '8500' },
  ];

  const GREEN_ITEMS = [
    { key: 'tickets_200', image: greenItem1, label: '200 Билетов', price: '4' },
    { key: 'tickets_1000', image: greenItem2, label: '1000 Билетов', price: '19' },
    { key: 'tickets_5000', image: greenItem3, label: '5000 Билетов', price: '90' },
    { key: 'tickets_20000', image: greenItem4, label: '20000 Билетов', price: '350' },
    { key: 'tickets_100000', image: greenItem5, label: '100000 Билетов', price: '1720' },
    { key: 'tickets_500000', image: greenItem6, label: '500000 Билетов', price: '8500' },
  ];

  return (
    <div
      className='w-full max-w-[430px] mx-auto h-dvh overflow-hidden flex flex-col'
      style={{ backgroundImage: `url(${shopBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className='flex-1 overflow-y-auto pb-24 scrollbar-hide'>
        
        <CategoryTitle>Фишки</CategoryTitle>
        <div className='grid grid-cols-3 gap-2 px-3 mt-4'>
          {GREY_ITEMS.map((item) => (
            <ShopCard
              key={item.key}
              {...item}
              emoji='⭐'
              loading={buyingKey === item.key}
              onClick={() => handleBuy(item.key, item.label)}
            />
          ))}
        </div>

        <CategoryTitle>Билеты</CategoryTitle>
        <div className='grid grid-cols-3 gap-2 px-3 mt-4'>
          {GREEN_ITEMS.map((item) => (
            <ShopCardGreen
              key={item.key}
              {...item}
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