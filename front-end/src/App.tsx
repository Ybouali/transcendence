import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import Footer from './components/Footer/Footer';
import Chat from './pages/Chat/Chat';
import NotFound from './pages/NotFound/NotFound';
import Friends from './pages/Friends/Friends';
import Game from './pages/Game/Game';
import Leaderboard from './pages/Leaderboard/Leaderboard';
import Profile from './pages/Profile/Profile';
import Settings from './pages/Settings/Settings';
import NotAuth from './pages/NotAuth/NotAuth';
import ConnectedProvider from './context/ConnectedContextProvider';
import TwoFactorValidation from './pages/TowFactor/TwoFactorValidation';

function App() {

  return (
    <ConnectedProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/game" element={<Game />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:userId" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/notauth" element={<NotAuth />} />
          <Route path="/tow-factor" element={<TwoFactorValidation />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </ConnectedProvider>
  );
}

export default App;
