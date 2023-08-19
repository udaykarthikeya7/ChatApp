import React from 'react';

function Navbar({ user }) {

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span>Chat App</span>
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