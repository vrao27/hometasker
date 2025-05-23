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
      {/* Single .header-banner on the <nav> */}
      <nav className="navbar header-banner navbar-expand-lg p-0">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          {/* Brand */}
          <NavLink to="/dashboard" className="navbar-brand text-white">
            HomeTasker
          </NavLink>

          {/* Mobile menu toggler */}
          <button
            className="navbar-toggler border-0"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNav"
            aria-controls="mainNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        
          
          {/* Nav Links */}
          <div className="collapse navbar-collapse" id="mainNav">
            <ul className="navbar-nav ms-auto align-items-center">
              <li className="nav-item">
                <NavLink to="/dashboard" className={({ isActive }) => `nav-link${isActive ? ' active fw-bold' : ''}`}>Dashboard</NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/scoreboard" className={({ isActive }) => `nav-link${isActive ? ' active fw-bold' : ''}`}>Scoreboard</NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/settings" className={({ isActive }) => `nav-link${isActive ? ' active fw-bold' : ''}`}>Settings</NavLink>
              </li>
            </ul>
          </div>

          {/* Logout button & avatar */}
          <div className="d-flex align-items-center gap-3">
            <button className="btn btn-logout" onClick={handleLogout}>
              Logout
            </button>
            {me && (
              <div className="avatar-badge">
                <img src={me.avatarUrl || '/default-avatar.png'} alt={`${me.name}'s avatar`} />
              </div>
            )}
          </div>
        </div>
       
      </nav>
       {/* STAT RIBBON OVERLAPPING NAVBAR BOTTOM*/}
        {me && (
          <div className="stat-ribbon">
            <span className="stat-pill">❤️ {me.lives ?? 0}</span>
            <span className="stat-pill">⭐ {me.xp ?? 0}</span>
            <span className="stat-pill">⚡ {me.energy ?? 0}</span>
          </div>
        )}
    </header>
  );
}
export default Navbar;









