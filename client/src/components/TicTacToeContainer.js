import React, { useState } from 'react';
import TicTacToeTableList from './TicTacToeTableList';
import TicTacToe from './TicTacToe';
import socketIOClient from "socket.io-client";

function TicTacToeContainer() {
  const [showGame, setShowGame] = useState(false);
  const [gameId, setGameId] = useState(null); 
  const socket = socketIOClient("/");


  return (
    <div>
      <h3 className="text-center">Tic Tac Toe</h3>
      {showGame 
          ? <TicTacToe socket={socket} gameId={gameId} setShowGame={setShowGame} /> 
          : <TicTacToeTableList socket={socket} setGameId={setGameId} setShowGame={setShowGame} />
      }
    </div>
  );
}

export default TicTacToeContainer;
