import React, { useState, useContext } from 'react';
import UserContext from '../context/UserContext.js';

function Profile() {
  const { currentUser } = useContext(UserContext);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);

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
          <>
            <h4>Change Password</h4>
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
            {error && <div className="alert alert-danger" role="alert">{error}</div>}
            {success && <div className="alert alert-success" role="alert">{success}</div>}
            <button className="btn btn-danger" onClick={handlePasswordChange}>Change Password</button>
            <button className="btn btn-secondary ms-3" onClick={handleCancelChange}>Cancel Change</button>
          </>
        ) : (
          <button className="btn btn-dark" onClick={() => setShowChangePasswordForm(true)}>Change Password</button>
        )}
      </div>
    </div>
  );
}

export default Profile;
