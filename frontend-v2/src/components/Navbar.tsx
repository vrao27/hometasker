import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { getMe } from '../services/authService'; // Get current user info

const Navbar: React.FC = () => {
  // ─── State ─────────────────────────────────────────────────────────────────────
  // Holds authenticated user’s basic info and stats
  const [me, setMe] = useState<{
    _id: string;
    name: string;
    avatarUrl?: string;
    lives?: number;
    xp?: number;
    energy?: number;
  } | null>(null);

  // Router helper to programmatically redirect
  const navigate = useNavigate();

  // ─── Load “Me” on Mount ────────────────────────────────────────────────────────
  useEffect(() => {
    getMe()
      .then(setMe)         // populate state with API result
      .catch(console.error);
  }, []);

  // ─── Logout Handler ───────────────────────────────────────────────────────────
  const handleLogout = () => {
    localStorage.removeItem('token');      // clear JWT
    navigate('/', { replace: true });      // go back to login
  };

  return (
    <header>
      {/* ─── Gradient Header Banner ────────────────────────────────────────────── */}
      <nav className="navbar navbar-expand-lg p-0">
        <div className="header-banner w-100">
          <div className="container d-flex justify-content-between align-items-center">
            {/* Brand / Logo */}
            <NavLink to="/dashboard" className="navbar-brand text-white">
              HomeTasker
            </NavLink>
            {/* Logout */}
            <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        {/* ─── Stat Ribbon ───────────────────────────────────────────────────────── */}
        {me && (
          <div className="stat-ribbon">
            <span className="stat-pill">❤️ {me.lives ?? 0}</span>
            <span className="stat-pill">⭐ {me.xp ?? 0}</span>
            <span className="stat-pill">⚡ {me.energy ?? 0}</span>
          </div>
        )}

        {/* ─── Collapsible Nav Links ─────────────────────────────────────────────── */}
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <NavLink
                to="/dashboard"
                className={({ isActive }) => `nav-link${isActive ? ' active fw-bold' : ''}`}
              >
                Dashboard
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/scoreboard"
                className={({ isActive }) => `nav-link${isActive ? ' active fw-bold' : ''}`}
              >
                Scoreboard
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/settings"
                className={({ isActive }) => `nav-link${isActive ? ' active fw-bold' : ''}`}
              >
                Settings
              </NavLink>
            </li>
          </ul>
        </div>

        {/* ─── Avatar Badge ───────────────────────────────────────────────────────── */}
        {me && (
          <div className="avatar-badge">
            <img
              src={me.avatarUrl || '/default-avatar.png'}
              alt={`${me.name}'s avatar`}
            />
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;









