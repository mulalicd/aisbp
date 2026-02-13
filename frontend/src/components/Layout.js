import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  if (isHome) {
    return (
      <div className="book-cover-layout w-full">
        {children}
      </div>
    );
  }

  return (
    <div className="app-layout relative">
      {/* Mobile Menu Button - Visible < 1024px */}
      <button
        className="fixed top-4 right-4 z-[60] p-2 bg-black text-white rounded lg:hidden shadow-lg hover:bg-gray-800 transition-colors"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        aria-label="Toggle Menu"
      >
        {isSidebarOpen ? 'Close X' : 'Menu ☰'}
      </button>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar with dynamic class */}
      <div className={`sidebar-wrapper ${isSidebarOpen ? 'translate-x-0' : ''}`}>
        <Sidebar className={isSidebarOpen ? 'open' : ''} onClose={() => setIsSidebarOpen(false)} />
      </div>

      <div className="main-content">
        {children}
      </div>
    </div>
  );
};

export default Layout;
