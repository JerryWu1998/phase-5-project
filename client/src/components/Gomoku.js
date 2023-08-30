import React, { useState, useEffect, useContext, useCallback } from 'react';
import UserContext from '../context/UserContext.js';

function Gomoku({ gameId, socket }) {
  const boardSize = 225; // 15x15 board
  const [board, setBoard] = useState(Array(boardSize).fill(null));
  const { currentUser, setShowGGame } = useContext(UserContext);
  const [currentPlayerId, setCurrentPlayerId] = useState(null);

  const [playerBlackId, setPlayerBlackId] = useState(null);
  const [playerWhiteId, setPlayerWhiteId] = useState(null);

  const [winner, setWinner] = useState(null);
  const [isDraw, setIsDraw] = useState(false);

  useEffect(() => {
    fetch(`/gomokus/${gameId}`)
      .then(response => response.json())
      .then(data => {
        setCurrentPlayerId(data.current_player_id);
        setPlayerBlackId(data.player_black_id);
        setPlayerWhiteId(data.player_white_id);
      });
  }, [gameId]);

  const isCurrentUserTurn = () => currentUser.id === currentPlayerId;

  const symbolForUser = useCallback((userId) => {
    if (userId === playerBlackId) return 'Black';
    if (userId === playerWhiteId) return 'White';
    return null;
  }, [playerBlackId, playerWhiteId]);

  useEffect(() => {
    const handleBroadcastStep = (data) => {
      if (winner || isDraw) return;
      if (data.game_id === gameId) {
        setBoard(prevBoard => {
          const newBoard = [...prevBoard];
          newBoard[data.step_position] = symbolForUser(data.player_id);
          return newBoard;
        });
        setCurrentPlayerId(prevPlayerId => (prevPlayerId === playerBlackId ? playerWhiteId : playerBlackId));
      }
      if (data.winner) {
        setWinner(symbolForUser(data.winner));
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

    socket.on('gomoku_broadcast_step', handleBroadcastStep);
    socket.on('gomoku_announce_winner', handleAnnounceWinner);
    socket.on('gomoku_announce_draw', handleAnnounceDraw);

    return () => {
      socket.off('gomoku_broadcast_step', handleBroadcastStep);
      socket.off('gomoku_announce_winner', handleAnnounceWinner);
      socket.off('gomoku_announce_draw', handleAnnounceDraw);
    };
  }, [gameId, playerBlackId, playerWhiteId, socket, symbolForUser, winner, isDraw]);

  const handleClick = (index) => {
    if (winner || isDraw || !isCurrentUserTurn() || board[index]) return;
    const stepData = {
      game_id: gameId,
      player_id: currentUser.id,
      step_position: index
    };

    fetch('/gomokusteps', {
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
        const newBoard = [...prevBoard];
        newBoard[index] = symbolForUser(data.player_id);
        return newBoard;
      });
    })
    .catch(err => {
      console.error('Failed to post step:', err);
    });
  };

  const renderSquare = (index) => (
    <button className="square btn btn-outline-dark m-1" style={{ width: '25px', height: '25px' }} onClick={() => handleClick(index)}>
      {board[index]}
    </button>
  );

  const renderRows = () => {
    const rows = [];
    for (let i = 0; i < 15; i++) {
      const row = [];
      for (let j = 0; j < 15; j++) {
        row.push(renderSquare(i * 15 + j));
      }
      rows.push(<div className="d-flex justify-content-center mb-2">{row}</div>);
    }
    return rows;
  };

  return (
    <div className="container mt-5">
      {winner ? <div className="alert alert-success text-center">Winner: {winner}</div> : null}
      {isDraw ? <div className="alert alert-info text-center">The game is a draw!</div> : null}
      <div className="text-center my-3">
        <button className="btn btn-secondary" onClick={() => setShowGGame(false)}>Return to Table</button>
      </div>
      {renderRows()}
    </div>
  );
}

export default Gomoku;
