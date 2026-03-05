import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import PageNine from "./pages/PageNine";
import BalancePage from "./pages/BalancePage";
import TournamentsPage from "./pages/TournamentsPage";
import CharactersPage from "./pages/CharactersPage";
import DrunyPage from "./pages/DrunyPage";
import BonusesPage from "./pages/BonusesPage";
import GamesPage from "./pages/GamesPage";
import Page20 from "./pages/Page20";

function App() {
  return (
    <Routes>
      <Route path="/"            element={<Home />} />
      <Route path="/shop"        element={<Shop />} />
      <Route path="/nine"        element={<PageNine />} />
      <Route path="/balance"     element={<BalancePage />} />
      <Route path="/tournaments" element={<TournamentsPage />} />
      <Route path="/characters"  element={<CharactersPage />} />
      <Route path="/druny"       element={<DrunyPage />} />
      <Route path="/bonuses"     element={<BonusesPage />} />
      <Route path="/games"       element={<GamesPage />} />
      <Route path="/page20"       element={<Page20 />} />
    </Routes>
  );
}

export default App;