//shows nabar across all protected routes
// This component is used to wrap around protected routes and display a navbar

import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const ProtectedLayout: React.FC = () => (
  <>
    <Navbar />
    <main className="py-4">
      <Outlet />
    </main>
  </>
);

export default ProtectedLayout;