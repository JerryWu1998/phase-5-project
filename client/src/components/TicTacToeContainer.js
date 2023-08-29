import React, { useState, useContext } from 'react';
import TicTacToeTableList from './TicTacToeTableList';
import TicTacToe from './TicTacToe';
import socketIOClient from "socket.io-client";
import UserContext from '../context/UserContext.js';

function TicTacToeContainer() {
  const [gameId, setGameId] = useState(null); 
  const socket = socketIOClient("/");
  const { showTGame } = useContext(UserContext);

  return (
    <div>
      <h3 className="text-center">Tic Tac Toe</h3>
      {showTGame 
          ? <TicTacToe socket={socket} gameId={gameId} /> 
          : <TicTacToeTableList socket={socket} setGameId={setGameId} />
      }
    </div>
  );
}

export default TicTacToeContainer;
