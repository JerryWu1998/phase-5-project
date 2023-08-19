import React, { useState } from 'react';
import TicTacToeTableList from './TicTacToeTableList';
import TicTacToe from './TicTacToe';
import socketIOClient from "socket.io-client";

function TicTacToeContainer() {
  const [showGame, setShowGame] = useState(false);
  const [tableId, setTableId] = useState(null);
  const socket = socketIOClient("/");

  const startGame = (id) => {
      setTableId(id);
      setShowGame(true);
  };

  return (
      <div>
          <h3>Tic Tac Toe</h3>
          {showGame 
              ? <TicTacToe socket={socket} tableId={tableId} /> 
              : <TicTacToeTableList socket={socket} startGame={startGame} setShowGame={setShowGame} />
          }
      </div>
  );
}



export default TicTacToeContainer;
