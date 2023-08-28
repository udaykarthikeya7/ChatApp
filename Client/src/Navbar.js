import React from 'react';
import { Link } from 'react-router-dom'


function Navbar() {

  return (
    <nav className="navbar">
      <div className="navbar-brand">
      <Link to="/" style={{ textDecoration: 'none' }}>
        <span><h3 id="Logo">Chat App</h3></span>
         </Link>
        {/* <button className="theme-toggle" onClick={handleThemeToggle}>
          {isDarkTheme ? '🌞' : '🌙'}
        </button> */}
      </div>
      <div className="navbar-actions">
        {/* {isAuth && <button className="logout-button" onClick={onLogout}>
          Logout
        </button>} */}
        {/* {user && <button onClick={() => supabase.auth.signOut()}>Logout</button>} */}
      </div>
    </nav>
  );
}

export default Navbar;