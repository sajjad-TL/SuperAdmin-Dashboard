import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminPanel from '../pages/AdminPanel';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/admin" element={<AdminPanel />} />
      {/* Add more routes here as needed */}
    </Routes>
  );
};

export default AppRoutes;
