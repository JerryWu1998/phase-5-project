import React, { useState, useContext } from 'react';
import GomokuTableList from './GomokuTableList';
import Gomoku from './Gomoku';
import socketIOClient from "socket.io-client";
import UserContext from '../context/UserContext.js';

function GomokuContainer() {
  const [gameId, setGameId] = useState(null);
  const socket = socketIOClient("/");
  const { showGame } = useContext(UserContext);

  return (
    <div>
      <h3 className="text-center">Gomoku</h3>
      {showGame
          ? <Gomoku socket={socket} gameId={gameId} />
          : <GomokuTableList socket={socket} setGameId={setGameId} />
      }
    </div>
  );
}

export default GomokuContainer;
