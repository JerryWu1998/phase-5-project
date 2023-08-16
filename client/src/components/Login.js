import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import UserContext from '../context/UserContext.js';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const { setLoggedIn, setCurrentUser } = useContext(UserContext);
  const history = useHistory();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data)
        setLoggedIn(true);
        setCurrentUser(data.user);
        history.push('/');
        window.location.reload();
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to login.');
      }
    } catch (err) {
      setError('Failed to login. Please try again.');
    }
  };


  const boxStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    padding: '20px',
    borderRadius: '10px',
    width: '100%',
    margin: 'auto'
  };

  return (
    <div className="container h-100 mt-5">
      <div className="row justify-content-center align-items-center h-100">
        <div className="col-md-5">
          <div style={boxStyle}>
            <form onSubmit={handleSubmit}>
              <div>
                <h2 className="text-center">Login</h2>
              </div>
              {error && <div className="alert alert-danger">{error}</div>}
              <div className="mb-3">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  className="form-control"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="d-flex justify-content-center">
                <button type="submit" className="btn btn-dark">
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
