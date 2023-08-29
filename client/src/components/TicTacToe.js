import React, { useState, useEffect, useContext, useCallback } from 'react';
import UserContext from '../context/UserContext.js';

function TicTacToe({ gameId, socket }) {
  const [board, setBoard] = useState(Array(9).fill(null));
  const { currentUser, setShowTGame } = useContext(UserContext);
  const [currentPlayerId, setCurrentPlayerId] = useState(null);
  
  const [playerXId, setPlayerXId] = useState(null);
  const [playerOId, setPlayerOId] = useState(null);

  const [playerXUsername, setPlayerXUsername] = useState(null);
  const [playerOUsername, setPlayerOUsername] = useState(null);

  const [winner, setWinner] = useState(null);
  const [isDraw, setIsDraw] = useState(false);

  const nextPlayerSymbol = currentPlayerId === playerXId ? `${playerXUsername} (X)` : `${playerOUsername} (O)`;

  useEffect(() => {
    fetch(`/tictactoes/${gameId}`)
      .then(response => response.json())
      .then(data => {
        setCurrentPlayerId(data.current_player_id);
        setPlayerXId(data.player_x_id);
        setPlayerXUsername(data.player_x.username)
        setPlayerOId(data.player_o_id);
        setPlayerOUsername(data.player_o.username)
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
      if (winner || isDraw) return;
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

    const handleAnnounceWinner = (data) => {
      if (winner || isDraw) return;
      if (data.game_id === gameId) {
        setWinner(symbolForUser(data.winner_id));
      }
    };

    const handleAnnounceDraw = (data) => {
      if (winner || isDraw) return;
      if (data.game_id === gameId) {
        setIsDraw(true);
      }
    };

    socket.on('broadcast_step', handleBroadcastStep);
    socket.on('announce_winner', handleAnnounceWinner);
    socket.on('announce_draw', handleAnnounceDraw);

    return () => {
      socket.off('broadcast_step', handleBroadcastStep);
      socket.off('announce_winner', handleAnnounceWinner);
      socket.off('announce_draw', handleAnnounceDraw);
    };
  }, [gameId, playerXId, playerOId, socket, symbolForUser, winner, isDraw]);

  const handleClick = (index) => {
    if (winner || isDraw || !isCurrentUserTurn() || board[index]) return;
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
    <button className="square btn btn-outline-dark m-2" style={{ width: '40px', height: '40px' }} onClick={() => handleClick(index)}>
      {board[index]}
    </button>
  );

  return (
    <div className="container mt-5">
        {winner ? <div className="alert alert-success text-center">Winner: {winner === 'X' ? playerXUsername : playerOUsername}</div> : null}
        {isDraw ? <div className="alert alert-info text-center">The game is a draw!</div> : null}
        {!winner && !isDraw ? 
            <div className="alert alert-primary text-center">Next move: {nextPlayerSymbol}</div> : null}
        {(winner || isDraw) ?
            <div className="text-center my-3">
                <button className="btn btn-secondary" onClick={() => setShowTGame(false)}>Return to Table</button>
            </div>
            : null}
        <div className="d-flex justify-content-center mb-2">
            {renderSquare(0)}
            {renderSquare(1)}
            {renderSquare(2)}
        </div>
        <div className="d-flex justify-content-center mb-2">
            {renderSquare(3)}
            {renderSquare(4)}
            {renderSquare(5)}
        </div>
        <div className="d-flex justify-content-center mb-2">
            {renderSquare(6)}
            {renderSquare(7)}
            {renderSquare(8)}
        </div>
    </div>
);
}

export default TicTacToe;
