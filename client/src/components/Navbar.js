import React, { useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import UserContext from '../context/UserContext.js';

function Navbar() {
  const { loggedIn, setLoggedIn } = useContext(UserContext);
  const history = useHistory();

  const handleLogout = () => {
    fetch('/logout', {
      method: "DELETE",
    }).then(() => {
      setLoggedIn(false);
      history.push('/');
    });
  }

  const handleLogin = () => {
    history.push('/login');
  }

  const handleSignup = () => {
    history.push('/signup');
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-white" style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)' }}>
      <div className="d-flex justify-content-between w-100">
        {/* Logo and Home link */}
        <div className="d-flex align-items-center ms-2">
          <Link to="/">
            <img src="https://cdn-icons-png.flaticon.com/512/2965/2965874.png"
              alt="Wiccapedia Logo" style={{ width: '40px', marginRight: '5px' }}/>
          </Link>
          <Link className="navbar-brand" to="/">Chess&Chat</Link>
        </div>

        {/* Login/Logout */}
        <div>
          {loggedIn ? (
            <>
              <Link className="btn btn-outline-dark me-2" to="/profile">Profile</Link>
              <button className="btn btn-outline-dark me-2" onClick={handleLogout}>Log Out</button>
            </>
          ) : (
            <>
              <button className="btn btn-outline-dark me-2" onClick={handleSignup}>Sign Up</button>
              <button className="btn btn-outline-dark me-2" onClick={handleLogin}>Log In</button>
            </>
          )}
        </div>
      </div>
    </nav>
);

}

export default Navbar;
