import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages
import AdminLogin from './pages/AdminLogin';
import RimsDashboard from './pages/RimsDashboard';
import ManageRims from './pages/ManageRims';
import RimsHomepage from './pages/RimsHomepage';

// Components
import ProtectedRoute from './components/ProtectedRoute';

// Styles
import './App.css';
import './styles/rims.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RimsHomepage />} />
        <Route path="/admin-login" element={<AdminLogin />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <RimsDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manage-rims"
          element={
            <ProtectedRoute>
              <ManageRims />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
