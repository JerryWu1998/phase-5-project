import React, { useState, useContext } from 'react';
import TicTacToeTableList from './TicTacToeTableList';
import TicTacToe from './TicTacToe';
import GomokuTableList from './GomokuTableList';
import Gomoku from './Gomoku';
import socketIOClient from "socket.io-client";
import UserContext from '../context/UserContext.js';

function GameContainer() {
  const [gameId, setGameId] = useState(null);
  const socket = socketIOClient("/");
  const { showTGame, showGGame } = useContext(UserContext);

  return (
    <div className="container">
      <h3 className="text-center">Game Room</h3>
      {showTGame ? (
        <TicTacToe socket={socket} gameId={gameId} />
      ) : showGGame ? (
        <Gomoku socket={socket} gameId={gameId} />
      ) : (
        <div className="row">
          <div className="col-md-6">
            <h4 className="text-center">Tic Tac Toe</h4>
            <TicTacToeTableList socket={socket} setGameId={setGameId} />
          </div>
          <div className="col-md-6">
            <h4 className="text-center">Gomoku</h4>
            <GomokuTableList socket={socket} setGameId={setGameId} />
          </div>
        </div>
      )}
    </div>
  );
}

export default GameContainer;
