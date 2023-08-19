import React, { useState, useEffect, useContext } from 'react';
import UserContext from '../context/UserContext.js';

function TicTacToe({ tableId, socket }) {
  const [board, setBoard] = useState(Array(9).fill(null));
  const { currentUser } = useContext(UserContext);

  useEffect(() => {
    const handleBroadcastStep = (data) => {
      if (data.game_id === tableId) {
        setBoard(prevBoard => {
          const newBoard = prevBoard.slice();
          newBoard[data.step_position - 1] = currentUser.id === data.player_id ? 'X' : 'O';
          return newBoard;
        });
      }
    };


    socket.on('broadcast_step', handleBroadcastStep);

    return () => {
      socket.off('broadcast_step', handleBroadcastStep);
    };
  }, [tableId, currentUser.id, socket]);

  const handleClick = (index) => {
    if (board[index]) return;

    const stepData = {
      game_id: tableId,
      player_id: currentUser.id,
      step_position: index + 1
    };


    // 问题在这 没有game id
    // 问题在这 没有game id
    // 问题在这 没有game id
    // 问题在这 没有game id
    // 问题在这 没有game id
    console.log(stepData)

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
          console.error(data.error); // Or display it to the user using a modal or notification
          return;
        }
        setBoard(prevBoard => {
          const newBoard = prevBoard.slice();
          newBoard[index] = currentUser.id === data.player_id ? 'X' : 'O';
          return newBoard;
        });
      })
      .catch(err => {
        console.error('Failed to post step:', err);
        // Optionally: Display an error to the user
      });
  };


  const renderSquare = (index) => (
    <button className="square" onClick={() => handleClick(index)}>
      {board[index]}
    </button>
  );

  return (
    <div>
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
