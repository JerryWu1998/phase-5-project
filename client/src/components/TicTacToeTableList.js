import React, { useState, useEffect, useContext } from 'react';
import UserContext from '../context/UserContext.js';

function TicTacToeTableList({ socket, setShowGame }) {
  const [tables, setTables] = useState([]);
  const { currentUser } = useContext(UserContext);

  useEffect(() => {
    fetch('/tictactoetables')
      .then(response => response.json())
      .then(data => setTables(data));

    if (!socket) return;  // Ensure that the socket has been initialized

    socket.on("broadcast_table", newTable => {
      setTables(prevTables => [...prevTables, newTable]);
    });

    socket.on("update_table", updatedTable => {
      setTables(prevTables =>
        prevTables.map(table => table.id === updatedTable.id ? updatedTable : table)
      );

      if (updatedTable.player_x_id && updatedTable.player_o_id) {
        setShowGame(true);
      }
    });

    return () => socket.off();
  }, [setShowGame, socket]);

  const isUserAlreadySeated = () => {
    return tables.some(table => table.player_x_id === currentUser.id || table.player_o_id === currentUser.id);
  };

  const isSeatTaken = (seatUserId) => {
    return seatUserId && seatUserId !== currentUser.id;
  };

  const joinTable = (tableId, position) => {
    if (!socket) return; // Ensure that the socket has been initialized

    const currentPosition = position === "X" ? "player_x_id" : "player_o_id";
    const table = tables.find(table => table.id === tableId);

    if (isUserAlreadySeated() && table[currentPosition] !== currentUser.id) {
      return;
    }

    socket.emit('join_table', {
      table_id: tableId,
      position: currentPosition,
      user_id: currentUser.id
    });
  };

  return (
    <div>
      {tables.map(table => (
        <div key={table.id} className="table">
          <button
            className="btn btn-primary"
            disabled={(isUserAlreadySeated() && table.player_x_id !== currentUser.id) || isSeatTaken(table.player_x_id)}
            onClick={() => joinTable(table.id, "X")}>
            {table.player_x_id ? (table.player_x_id === currentUser.id ? 'You (X)' : 'Taken') : 'X'}
          </button>
          <button
            className="btn btn-secondary"
            disabled={(isUserAlreadySeated() && table.player_o_id !== currentUser.id) || isSeatTaken(table.player_o_id)}
            onClick={() => joinTable(table.id, "O")}>
            {table.player_o_id ? (table.player_o_id === currentUser.id ? 'You (O)' : 'Taken') : 'O'}
          </button>
        </div>
      ))}
    </div>
  );
}

export default TicTacToeTableList;
