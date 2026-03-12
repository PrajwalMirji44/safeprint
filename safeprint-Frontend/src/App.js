import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import AppPage from './pages/AppPage.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/upload" element={<AppPage />} />
        <Route path="/print" element={<AppPage />} />
      </Routes>
    </Router>
  );
}

export default App;
