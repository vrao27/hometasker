import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
// NavLink instead of Link allows dynamic styling for the "active" route

const Navbar: React.FC = () => {
  const navigate = useNavigate(); // useNavigate hook to programmatically redirect

  // Called when the user clicks “Logout”
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove the JWT token
    navigate('/', { replace: true }); // Redirect to login and prevent back nav
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-4 shadow-sm">
      {/* Brand/logo on the left */}
      <NavLink className="navbar-brand" to="/dashboard">
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
    </nav>
  );
};

export default Navbar;








