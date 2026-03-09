import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import PageNine from "./pages/PageNine";
import BalancePage from "./pages/BalancePage";
import TournamentsPage from "./pages/TournamentsPage";
import DrunyPage from "./pages/DrunyPage";
import BonusesPage from "./pages/BonusesPage";
import GamesPage from "./pages/GamesPage";
import Page20 from "./pages/Page20";
import Page12 from "./pages/Page12";
import Page15 from "./pages/Page15";
import Page14 from "./pages/Page14";
import PageTen from "./pages/PageTen";
import Page18 from "./pages/Page18";

function App() {
  return (
    <Routes>
      <Route path="/"            element={<Home />} />
      <Route path="/shop"        element={<Shop />} />
      <Route path="/nine"        element={<PageNine />} />
      <Route path="/balance"     element={<BalancePage />} />
      <Route path="/tournaments" element={<TournamentsPage />} />
      <Route path="/druny"       element={<DrunyPage />} />
      <Route path="/bonuses"     element={<BonusesPage />} />
      <Route path="/games"       element={<GamesPage />} />
      <Route path="/page20"       element={<Page20 />} />
      <Route path="/page12"       element={<Page12 />} />
      <Route path="/page10"       element={<PageTen />} />
      <Route path="/page14"       element={<Page14/>} />
      <Route path="/page15"       element={<Page15 />} />
      <Route path="/page18"       element={<Page18 />} />
    </Routes>
  );
}

export default App;