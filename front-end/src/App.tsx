import React, { useState } from 'react';
import './App.css';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import Header from './components/Header/Header';
import Home from './pages/Home/Home';
import Footer from './components/Footer/Footer';
import Chat from './pages/Chat/Chat';

function App() {

  const [logIn, setLogIn] = useState(false);

  return (
    <BrowserRouter>
      <Header isConnected={logIn} logInFunc={ () => setLogIn(!logIn)} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
