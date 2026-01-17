import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

function ProtectedRoute({ children }) {
  const [allowed, setAllowed] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setAllowed(false);
      return;
    }

    axios
      .post(`${API_URL}/api/admin/verify`, { token })
      .then(() => setAllowed(true))
      .catch(() => {
        localStorage.removeItem('token');
        setAllowed(false);
      });
  }, []);

  if (allowed === null) return null; // loading
  if (!allowed) return <Navigate to="/admin-login" replace />;

  return children;
}

export default ProtectedRoute;
