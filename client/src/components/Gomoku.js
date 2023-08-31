import React, { useState, useEffect, useContext, useCallback } from 'react';
import UserContext from '../context/UserContext.js';

function Gomoku({ gameId, socket }) {
  const boardSize = 225;
  const [board, setBoard] = useState(Array(boardSize).fill(null));
  const { currentUser, setShowGGame } = useContext(UserContext);
  const [currentPlayerId, setCurrentPlayerId] = useState(null);

  const [playerBlackId, setPlayerBlackId] = useState(null);
  const [playerWhiteId, setPlayerWhiteId] = useState(null);

  const [playerBlackUsername, setPlayerBlackUsername] = useState(null);
  const [playerWhiteUsername, setPlayerWhiteUsername] = useState(null);

  const [winner, setWinner] = useState(null);
  const [isDraw, setIsDraw] = useState(false);

  const nextPlayerSymbol = currentPlayerId === playerBlackId ? `${playerBlackUsername} (Black)` : `${playerWhiteUsername} (White)`;

  useEffect(() => {
    fetch(`/gomokus/${gameId}`)
      .then(response => response.json())
      .then(data => {
        setCurrentPlayerId(data.current_player_id);
        setPlayerBlackId(data.player_black_id);
        setPlayerBlackUsername(data.player_black.username);
        setPlayerWhiteId(data.player_white_id);
        setPlayerWhiteUsername(data.player_white.username);
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

  const renderSquare = (index) => {
    let content;
    if (board[index] === 'Black') {
      content = <div style={{ backgroundColor: 'black', width: '100%', height: '100%', borderRadius: '50%' }}></div>;
    } else if (board[index] === 'White') {
      content = <div style={{ backgroundColor: 'white', width: '100%', height: '100%', borderRadius: '50%', border: '1px solid black' }}></div>;
    }

    return (
      <button className="square btn btn-outline-dark" style={{ width: '30px', height: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0', margin: '0', borderRadius: '0%' }} onClick={() => handleClick(index)}>
        {content}
      </button>
    );
  };

  const renderRows = () => {
    const rows = [];
    for (let i = 0; i < 15; i++) {
      const row = [];
      for (let j = 0; j < 15; j++) {
        row.push(renderSquare(i * 15 + j));
      }
      rows.push(<div className="d-flex justify-content-center">{row}</div>);
    }
    return rows;
  };

  return (
    <div className="container mt-5">
      {winner ? <div className="alert alert-success text-center">Winner: {winner === 'Black' ? playerBlackUsername : playerWhiteUsername}</div> : null}
      {isDraw ? <div className="alert alert-info text-center">The game is a draw!</div> : null}
      {!winner && !isDraw ? <div className="alert alert-dark text-center">Next move: {nextPlayerSymbol}</div> : null}
      {(winner || isDraw) ?
        <div className="text-center my-3">
          <button className="btn btn-dark" onClick={() => setShowGGame(false)}>Return to Table</button>
        </div>
        : null}
      {renderRows()}
    </div>
  );
}

export default Gomoku;
