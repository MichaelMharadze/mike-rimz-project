import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages
import AdminLogin from './pages/AdminLogin';
import RimsDashboard from './pages/RimsDashboard';
import ManageRims from './pages/ManageRims';
import RimsHomepage from './pages/RimsHomepage';

// Styles
import './App.css';      // <-- global base styles
import './styles/rims.css'; // <-- detailed rims styles

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RimsHomepage />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/dashboard" element={<RimsDashboard />} />
        <Route path="/manage-rims" element={<ManageRims />} />
      </Routes>
    </Router>
  );
}

export default App;
