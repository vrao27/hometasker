import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
    const navigate = useNavigate(); //useNavigate hook for navigation 

// Called when the user clicks “Logout”
const handleLogout = () => {
    //follows logic same as in ProtectedRoute.tsx
    // Remove the JWT token from localStorage
    localStorage.removeItem('token');
    // Redirect back to the login page, replacing history so Back won’t return here
    navigate('/', { replace: true });

};

return (
    <nav
      className="navbar navbar-expand-lg navbar-light bg-light px-4"
      //   ↑ Bootstrap classes for a light-colored navbar with horizontal padding
    >
      {/* Brand/logo on the left */}
      <Link className="navbar-brand" to="/dashboard">
        HomeTasker
      </Link>

      {/* Collapsible menu (links) */}
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav me-auto">
          {/* Dashboard link */}
          <li className="nav-item">
            <Link className="nav-link" to="/dashboard">
              Dashboard
            </Link>
          </li>
          {/* Scoreboard link */}
          <li className="nav-item">
            <Link className="nav-link" to="/scoreboard">
              Scoreboard
            </Link>
          </li>
          {/* Settings link */}
          <li className="nav-item">
            <Link className="nav-link" to="/settings">
              Settings
            </Link>
          </li>
        </ul>

        {/* Logout button on the right */}
        <button
          className="btn btn-outline-danger"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;









