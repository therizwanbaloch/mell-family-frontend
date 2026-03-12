import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginAsync } from "./redux/authSlice";
import { fetchState } from "./redux/gameSlice";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import PageNine from "./pages/PageNine";
import DrunyPage from "./pages/DrunyPage";
import BonusesPage from "./pages/BonusesPage";
import GamesPage from "./pages/GamesPage";
import Page20 from "./pages/Page20";
import Page12 from "./pages/Page12";
import Page15 from "./pages/Page15";
import Page14 from "./pages/Page14";
import PageTen from "./pages/PageTen";
import Page18 from "./pages/Page18";
import Page22 from "./pages/Page22";
import Page23 from "./pages/Page23";
import Page25 from "./pages/Page25";
import Page26 from "./pages/Page26";
import Page24 from "./pages/Page24";

function App() {
  const dispatch = useDispatch();
  const { ready, loading, error } = useSelector((state) => state.auth);

  // Step 1: login on app start
  useEffect(() => {
    dispatch(loginAsync());
  }, [dispatch]);

  // Step 2: once logged in, load game state
  useEffect(() => {
    if (ready) {
      dispatch(fetchState());
    }
  }, [ready, dispatch]);

  // ── Loading screen ───────────────────────────────────────
  if (loading || (!ready && !error)) {
    return (
      <div style={styles.center}>
        <div style={styles.spinner} />
        <p style={styles.text}>Loading...</p>
      </div>
    );
  }

  // ── Error screen ─────────────────────────────────────────
  if (error) {
    return (
      <div style={styles.center}>
        <p style={styles.errorText}>⚠️ Failed to connect</p>
        <p style={styles.subText}>{error}</p>
        <button style={styles.retryBtn} onClick={() => dispatch(loginAsync())}>
          Retry
        </button>
      </div>
    );
  }

  // ── App ───────────────────────────────────────────────────
  return (
    <Routes>
      <Route path="/"            element={<Home />} />
      <Route path="/shop"        element={<Shop />} />
      <Route path="/nine"        element={<PageNine />} />
      <Route path="/druny"       element={<DrunyPage />} />
      <Route path="/bonuses"     element={<BonusesPage />} />
      <Route path="/games"       element={<GamesPage />} />
      <Route path="/page20"      element={<Page20 />} />
      <Route path="/page12"      element={<Page12 />} />
      <Route path="/page10"      element={<PageTen />} />
      <Route path="/page14"      element={<Page14 />} />
      <Route path="/page15"      element={<Page15 />} />
      <Route path="/page18"      element={<Page18 />} />
      <Route path="/page22"      element={<Page22/>} />
      <Route path="/page23"      element={<Page23/>} />
      <Route path="/page24"      element={<Page24/>} />
      <Route path="/page25"      element={<Page25/>} />
      <Route path="/page26"      element={<Page26/>} />
    </Routes>
  );
}

// ── Minimal inline styles (replace with your own CSS) ────────

const styles = {
  center: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    background: "#0f0f0f",
    gap: "12px",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "4px solid #333",
    borderTop: "4px solid #fff",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  text: {
    color: "#aaa",
    fontSize: "14px",
  },
  errorText: {
    color: "#ff4444",
    fontSize: "18px",
    fontWeight: "bold",
  },
  subText: {
    color: "#888",
    fontSize: "13px",
    maxWidth: "280px",
    textAlign: "center",
  },
  retryBtn: {
    marginTop: "8px",
    padding: "10px 24px",
    background: "#fff",
    color: "#000",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    cursor: "pointer",
  },
};

// spinner keyframe — inject once
const styleTag = document.createElement("style");
styleTag.innerHTML = `@keyframes spin { to { transform: rotate(360deg); } }`;
document.head.appendChild(styleTag);

export default App;