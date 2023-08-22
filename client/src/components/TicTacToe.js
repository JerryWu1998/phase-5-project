import React, { useState, useEffect, useContext, useCallback } from 'react';
import UserContext from '../context/UserContext.js';

function TicTacToe({ gameId, socket }) {
  const [board, setBoard] = useState(Array(9).fill(null));
  const { currentUser } = useContext(UserContext);
  const [currentPlayerId, setCurrentPlayerId] = useState(null);
  const [playerXId, setPlayerXId] = useState(null);
  const [playerOId, setPlayerOId] = useState(null);
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    fetch(`/tictactoes/${gameId}`)
      .then(response => response.json())
      .then(data => {
        setCurrentPlayerId(data.current_player_id);
        setPlayerXId(data.player_x_id);
        setPlayerOId(data.player_o_id);
      });
  }, [gameId]);

  const isCurrentUserTurn = () => currentUser.id === currentPlayerId;

  const symbolForUser = useCallback((userId) => {
    if (userId === playerXId) return 'X';
    if (userId === playerOId) return 'O';
    return null;
  }, [playerXId, playerOId]);

  useEffect(() => {
    const handleBroadcastStep = (data) => {
      if (data.game_id === gameId) {
        setBoard(prevBoard => {
          const newBoard = prevBoard.slice();
          newBoard[data.step_position - 1] = symbolForUser(data.player_id);
          return newBoard;
        });
        setCurrentPlayerId(prevPlayerId => (prevPlayerId === playerXId ? playerOId : playerXId));
        if (data.winner) {
          setWinner(symbolForUser(data.winner));
        }
      }
    };
    socket.on('broadcast_step', handleBroadcastStep);

    const handleAnnounceWinner = (data) => {
      if (data.game_id === gameId) {
        setWinner(symbolForUser(data.winner_id));
      }
    };
    socket.on('announce_winner', handleAnnounceWinner);

    return () => {
      socket.off('broadcast_step', handleBroadcastStep);
      socket.off('announce_winner', handleAnnounceWinner);
    };
  }, [gameId, playerXId, playerOId, socket, symbolForUser]);

  const handleClick = (index) => {
    if (!isCurrentUserTurn() || board[index]) return;

    const stepData = {
      game_id: gameId,
      player_id: currentUser.id,
      step_position: index + 1
    };

    fetch('/tictactoesteps', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(stepData)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        if (data.error) {
          console.error(data.error);
          return;
        }
        setBoard(prevBoard => {
          const newBoard = prevBoard.slice();
          newBoard[index] = symbolForUser(data.player_id);
          return newBoard;
        });
      })
      .catch(err => {
        console.error('Failed to post step:', err);
      });
  };

  const renderSquare = (index) => (
    <button className="square" onClick={() => handleClick(index)}>
      {board[index]}
    </button>
  );

  return (
    <div>
      {winner ? <div className="winner">Winner: {winner}</div> : null}
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  );
}

export default TicTacToe;
