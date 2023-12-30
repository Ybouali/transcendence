import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import Home from './pages/Home';
import NotFound from './pages/NotFound';

function App() {
  return (
    <div className='flex items-center justify-between' >
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home/" element={<Home />} />
          <Route Component={NotFound} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
