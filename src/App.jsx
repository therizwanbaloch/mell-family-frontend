import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginAsync } from "./redux/authSlice";
import { fetchState } from "./redux/gameSlice";

import Home     from "./pages/Home";
import Shop     from "./pages/Shop";
import PageNine from "./pages/PageNine";
import Page20   from "./pages/Page20";
import Page12   from "./pages/Page12";
import Page15   from "./pages/Page15";
import Page14   from "./pages/Page14";
import PageTen  from "./pages/PageTen";
import Page18   from "./pages/Page18";
import Page22   from "./pages/Page22";
import Page23   from "./pages/Page23";
import Page25   from "./pages/Page25";
import Page26   from "./pages/Page26";
import Page24   from "./pages/Page24";

import TelegramSetup from "./components/TelegramSetup";
import { useTelegram } from "./hooks/useTelegram";
import MobileOnly from "./MobileOnly";
import NewShop from "./pages/NewShop";
import BonusSection from "./components/BonusCard";

function App() {
  const dispatch = useDispatch();
  const { ready, loading, error } = useSelector((state) => state.auth);

  const tg = useTelegram();


  
  const isDev             = import.meta.env.DEV;
  const isInsideTelegram  = Boolean(tg?.initData);
  const isVercel          = typeof window !== "undefined" &&
                            (window.location.hostname.endsWith(".vercel.app") ||
                             window.location.hostname.endsWith(".vercel.com"));

  const canRender = isDev || isInsideTelegram || isVercel;

  useEffect(() => {
    dispatch(loginAsync());
  }, [dispatch]);

  useEffect(() => {
    if (ready) {
      dispatch(fetchState());
    }
  }, [ready, dispatch]);

  if (!canRender) {
    return <MobileOnly />;
  }

  if (loading) {
    return (
      <div style={styles.center}>
        <div style={styles.spinner} />
        <p style={styles.text}>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.center}>
        <p style={styles.errorText}>Failed to connect</p>
        <p style={styles.subText}>{error}</p>
        <button style={styles.retryBtn} onClick={() => dispatch(loginAsync())}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      <TelegramSetup />
      <Routes>
        <Route path="/"       element={<Home />} />
        <Route path="/shop"   element={<Shop />} />
        <Route path="/nine"   element={<PageNine />} />
        <Route path="/page20" element={<Page20 />} />
        <Route path="/page12" element={<Page12 />} />
        <Route path="/page10" element={<PageTen />} />
        <Route path="/page14" element={<Page14 />} />
        <Route path="/page15" element={<Page15 />} />
        <Route path="/page18" element={<Page18 />} />
        <Route path="/page22" element={<Page22 />} />
        <Route path="/page23" element={<Page23 />} />
        <Route path="/page24" element={<Page24 />} />
        <Route path="/page25" element={<Page25 />} />
        <Route path="/page26" element={<Page26 />} />
        <Route path="/new" element={<NewShop />} />
      </Routes>
    </>
  );
}

const styles = {
  center:    { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", background: "#0f0f0f", gap: "12px" },
  spinner:   { width: "40px", height: "40px", border: "4px solid #333", borderTop: "4px solid #fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" },
  text:      { color: "#aaa", fontSize: "14px" },
  errorText: { color: "#ff4444", fontSize: "18px", fontWeight: "bold" },
  subText:   { color: "#888", fontSize: "13px", maxWidth: "280px", textAlign: "center" },
  retryBtn:  { marginTop: "8px", padding: "10px 24px", background: "#fff", color: "#000", border: "none", borderRadius: "8px", fontSize: "14px", cursor: "pointer" },
};

const styleTag = document.createElement("style");
styleTag.innerHTML = `@keyframes spin { to { transform: rotate(360deg); } }`;
document.head.appendChild(styleTag);

export default App;