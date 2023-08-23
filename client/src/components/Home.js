import React, { useContext } from 'react';
import UserContext from '../context/UserContext.js';
import ChatContainer from './ChatContainer';
import TicTacToeContainer from './TicTacToeContainer.js';

function Home() {
  const { loggedIn } = useContext(UserContext);

  const boxStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    padding: '20px',
    borderRadius: '10px',
    margin: 'auto'
  };

  return (
    <div className="home-container container mt-5">
      {!loggedIn ? (
        <div className="text-center" style={{ ...boxStyle, width: '800px' }}>
          <h2>Welcome to Play&Chat!</h2>
          <p>Please login or signup to start playing and chatting.</p>
        </div>
      ) : (
        <div className="d-flex flex-column align-items-center">
          <div className="chess-section my-3" style={{ ...boxStyle, width: '800px' }}>
            <h2 className='text-center'>Play</h2>
            <hr style={{ width: '100%', maxWidth: '800px' }} />
            <TicTacToeContainer />
          </div>

          <div className="chat-section my-3" style={{ ...boxStyle, width: '800px' }}>
            <h2 className='text-center'>Chat</h2>
            <hr style={{ width: '100%' }} />
            <ChatContainer />
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
