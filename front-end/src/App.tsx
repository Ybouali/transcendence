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
import Header from './components/Header/Header';
import { prepareUrl } from './utils/utils';
import ErrorPage from './pages/error-page/ErrorPage';
import { SocketProvider } from './context/SocketProvider';
import CommunityHub from './pages/community-hub/CommunityHub';

function App() {

  const loginIntra = async () => {

    try {
      
      const url = prepareUrl("auth/42/");
    
      // make call to server to login with the intra 42
      window.location.href = url;

    } catch (error) {
      return ;
    }
  }

  return (
    <ConnectedProvider>
      <BrowserRouter>
        <Header logInFunc={loginIntra} />
        <SocketProvider>
        <Routes>
          <Route path="/" element={<Home logInFunc={loginIntra} />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/friends" element={<CommunityHub type="friends" />} />
          <Route path="/groups" element={<CommunityHub type="rooms" />} />
          <Route path="/game" element={<Game />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:userId" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/notauth" element={<NotAuth />} />
          <Route path="/tow-factor" element={<TwoFactorValidation />} />
          <Route path="/error-page/:code" element={<ErrorPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </SocketProvider>
        <Footer />
      </BrowserRouter>
    </ConnectedProvider>
  );
}

export default App;
