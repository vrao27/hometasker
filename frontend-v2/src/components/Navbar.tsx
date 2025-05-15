import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import  { useState, useEffect } from 'react';
// NavLink instead of Link allows dynamic styling for the "active" route

const Navbar: React.FC = () => {
  const navigate = useNavigate(); // useNavigate hook to programmatically redirect

  //add new state for current user
  const [me, setMe] = useState<{ _id: string; name: string; avatarUrl?: string; lives?: number; xp?: number; energy?: number } | null>(null);


  //load current user on mount 
  useEffect(() => {
    import('../services/authService').then(({ getMe }) =>
      getMe().then(setMe).catch(console.error)
    );
  }, []);
  
  // Called when the user clicks “Logout”
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove the JWT token
    navigate('/', { replace: true }); // Redirect to login and prevent back nav
  };

  return (
    <div>
    <nav className="navbar navbar-expand-lg navbar-light header-banner px-4">
      {/* Brand/logo on the left */}
      <NavLink className="navbar-brand text-white" to="/dashboard">
        HomeTasker
      </NavLink>

      {/* Collapsible hamburger menu for mobile */}
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarContent"
      >
        <span className="navbar-toggler-icon" />
      </button>

      {/* Collapsible container for nav links */}
      <div className="collapse navbar-collapse" id="navbarContent">
        <ul className="navbar-nav me-auto">
          {/* NavLink adds 'active' class when the route matches */}
          <li className="nav-item">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                'nav-link' + (isActive ? ' active fw-bold text-primary' : '')
              }
            >
              Dashboard
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink
              to="/scoreboard"
              className={({ isActive }) =>
                'nav-link' + (isActive ? ' active fw-bold text-primary' : '')
              }
            >
              Scoreboard
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                'nav-link' + (isActive ? ' active fw-bold text-primary' : '')
              }
            >
              Settings
            </NavLink>
          </li>
        </ul>

        {/* Logout button aligned right */}
        <button className="btn btn-outline-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* NEW: avatar badge inside the header */}
       {me && (
          <div className="avatar-badge">
            <img
              src={me.avatarUrl || '/default-avatar.png'}
              alt={`${me.name}'s avatar`}
            />
          </div>
        )}
    </nav>
       {/* NEW: stat ribbon below the header */}
      {me && (
        <div className="stat-ribbon">
          <span className="stat-pill">
            <span role="img" aria-label="lives">
              ❤️
            </span>{' '}
            {me.lives ?? 0}
          </span>
          <span className="stat-pill">
            <span role="img" aria-label="xp">
              ⭐
            </span>{' '}
            {me.xp ?? 0}
          </span>
          <span className="stat-pill">
            <span role="img" aria-label="energy">
              ⚡
            </span>{' '}
            {me.energy ?? 0}
          </span>
        </div>
      )}
    </div>

  );
};

export default Navbar;








