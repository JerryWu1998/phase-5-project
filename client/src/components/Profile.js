import React, { useContext } from 'react';
import UserContext from '../context/UserContext.js';

function Profile() {
  const { currentUser } = useContext(UserContext);

  const boxStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    padding: '20px',
    borderRadius: '10px',
    margin: 'auto'
  };

  if (!currentUser) {
      return (
          <div className="profile-container container mt-5" style={{ ...boxStyle, width: '800px' }}>
              <h2>Error: User not loaded!</h2>
          </div>
      );
  }

  return (
      <div className="profile-container container mt-5" style={{ ...boxStyle, width: '800px' }}>
          <h2>My Profile</h2>
          <p><strong>Username:</strong> {currentUser.username}</p>
      </div>
  );
}


export default Profile;
