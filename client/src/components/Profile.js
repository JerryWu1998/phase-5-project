import React, { useState, useContext, useEffect } from 'react';
import UserContext from '../context/UserContext.js';

function Profile() {
  const { currentUser } = useContext(UserContext);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);
  const [gameRecords, setGameRecords] = useState([]);
  const [gomokuRecords, setGomokuRecords] = useState([]);

  // TicTacToe records
  useEffect(() => {
    const fetchGameRecords = async () => {
      try {
        const response = await fetch('/tictactoes');
        const data = await response.json();

        if (response.ok) {
          const filteredGames = data.filter(game =>
            game.player_x_id === currentUser.id || game.player_o_id === currentUser.id
          );
          setGameRecords(filteredGames);
        } else {
          setError('Failed to fetch game records');
        }
      } catch (error) {
        setError('An error occurred while fetching game records');
      }
    };

    if (currentUser) {
      fetchGameRecords();
    }
  }, [currentUser]);

  // Gomoku records
  useEffect(() => {
    const fetchGomokuRecords = async () => {
      try {
        const response = await fetch('/gomokus');
        const data = await response.json();

        if (response.ok) {
          const filteredGames = data.filter(game =>
            game.player_black_id === currentUser.id || game.player_white_id === currentUser.id
          );
          setGomokuRecords(filteredGames);
        } else {
          setError('Failed to fetch Gomoku game records');
        }
      } catch (error) {
        setError('An error occurred while fetching Gomoku game records');
      }
    };

    if (currentUser) {
      fetchGomokuRecords();
    }
  }, [currentUser]);

  const handlePasswordChange = async () => {
    setSuccess('');
    setError('');

    if (newPassword.length < 6 || newPassword.length > 16) {
      setError("New password must be between 6 to 16 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }
    if (newPassword === oldPassword) {
      setError("New password cannot be the same as the old password.");
      return;
    }

    const requestOptions = {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        old_password: oldPassword,
        new_password: newPassword
      }),
    };

    try {
      const response = await fetch('/change_password', requestOptions);
      const data = await response.json();

      if (response.ok) {
        setSuccess("Password changed successfully!");
      } else {
        setError(`Failed to change password: ${data.error}`);
      }
    } catch (error) {
      setError('An error occurred while changing the password');
    }
  };


  const handleCancelChange = () => {
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setSuccess('');
    setShowChangePasswordForm(false);
  };

  const boxStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    padding: '20px',
    borderRadius: '10px',
    margin: 'auto',
    textAlign: 'center',
  };

  const inputStyle = {
    width: '60%',
    marginBottom: '10px',
    display: 'block',
    margin: '10px auto'
  };

  return (
    <div className="profile-container container mt-5" style={{ ...boxStyle, width: '800px' }}>
      <h2>My Profile</h2>
      <hr />
      <h4>Username: {currentUser ? currentUser.username : 'Loading...'}</h4>

      <div className="mt-4" style={{ textAlign: 'center' }}>
        {showChangePasswordForm ? (
          <div>
            <h4>Change Password</h4>
            {error && <div className="alert alert-danger" role="alert">{error}</div>}
            {success && <div className="alert alert-success" role="alert">{success}</div>}
            <div className="form-group" style={inputStyle}>
              <input
                type="password"
                className="form-control text-center"
                placeholder="Old Password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </div>
            <div className="form-group" style={inputStyle}>
              <input
                type="password"
                className="form-control text-center"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="form-group" style={inputStyle}>
              <input
                type="password"
                className="form-control text-center"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <button className="btn btn-danger" onClick={handlePasswordChange}>Change Password</button>
            <button className="btn btn-secondary ms-3" onClick={handleCancelChange}>Cancel Change</button>
          </div>
        ) : (
          <button className="btn btn-dark" onClick={() => setShowChangePasswordForm(true)}>Change Password</button>
        )}
      </div>
      {/* TicTacToe records */}
      <h4 className='mt-5'>TicTacToe Records</h4>
      <div className="mt-2" style={{ padding: '20px', maxHeight: '400px', margin: 'auto', overflowY: 'auto' }}>
        {gameRecords.length ? (
          <table className="table table-striped">
            <thead>
              <tr>
                <th style={{ width: '33%', textAlign: 'center' }}>Player X</th>
                <th style={{ width: '33%', textAlign: 'center' }}>Player O</th>
                <th style={{ width: '33%', textAlign: 'center' }}>Results</th>
              </tr>
            </thead>
            <tbody>
              {gameRecords.map((record, index) => (
                <tr key={index}>
                  <td style={{ textAlign: 'center' }}>{record.player_x.username}</td>
                  <td style={{ textAlign: 'center' }}>{record.player_o.username}</td>
                  <td style={{ textAlign: 'center' }}>
                    {record.winner_id === currentUser.id ? 'Won' : record.winner_id ? 'Lost' : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No game records found.</p>
        )}
      </div>

      {/* Gomoku Records */}
      <h4 className='mt-2'>Gomoku Records</h4>
      <div className="mt-2" style={{ padding: '20px', maxHeight: '400px', margin: 'auto', overflowY: 'auto' }}>
        {gomokuRecords.length ? (
          <table className="table table-striped">
            <thead>
              <tr>
                <th style={{ width: '33%', textAlign: 'center' }}>Player Black</th>
                <th style={{ width: '33%', textAlign: 'center' }}>Player White</th>
                <th style={{ width: '33%', textAlign: 'center' }}>Results</th>
              </tr>
            </thead>
            <tbody>
              {gomokuRecords.map((record, index) => (
                <tr key={index}>
                  <td style={{ textAlign: 'center' }}>{record.player_black.username}</td>
                  <td style={{ textAlign: 'center' }}>{record.player_white.username}</td>
                  <td style={{ textAlign: 'center' }}>
                    {record.winner_id === currentUser.id ? 'Won' : record.winner_id ? 'Lost' : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No Gomoku game records found.</p>
        )}
      </div>


    </div>
  );
}

export default Profile;
