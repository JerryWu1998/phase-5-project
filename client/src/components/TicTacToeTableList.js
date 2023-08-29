import React, { useState, useEffect, useContext } from 'react';
import UserContext from '../context/UserContext.js';

function TicTacToeTableList({ socket, setGameId }) {
  const [tables, setTables] = useState([]);
  const { currentUser, setShowGame } = useContext(UserContext);

  useEffect(() => {
    fetch('/tictactoetables')
      .then(response => response.json())
      .then(data => setTables(data));

    if (!socket) return;

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

    socket.on("game_started", (data) => {
      setGameId(data.game_id);
      setShowGame(true);
    });

    return () => {
      socket.off();
    };
  }, [setShowGame, socket, setGameId]);

  const isUserAlreadySeated = () => {
    return tables.some(table => table.player_x_id === currentUser.id || table.player_o_id === currentUser.id);
  };

  const isSeatTaken = (seatUserId) => {
    return seatUserId && seatUserId !== currentUser.id;
  };

  const joinTable = (tableId, position) => {
    if (!socket) return;

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
    <div className="d-flex flex-column align-items-center">
      {tables.map((table, index) => (
        <div key={table.id} className="table mb-3">
          <h5 className="mb-2 text-center">Table #{index + 1}</h5>
          <div className="d-flex justify-content-center align-items-center">
            <button
              style={{ height: '40px' }}
              className="btn btn-dark mx-2"
              disabled={(isUserAlreadySeated() && table.player_x_id !== currentUser.id) || isSeatTaken(table.player_x_id)}
              onClick={() => joinTable(table.id, "X")}>
              {table.player_x_id ? `${table.player_x.username} (X)` : 'X'}
            </button>
            <img src="https://www.shareicon.net/data/512x512/2017/01/16/871735_table_512x512.png"
              alt="Table" style={{ width: '100px', height: '80px' }} />
            <button
              style={{ height: '40px' }}
              className="btn btn-dark mx-2"
              disabled={(isUserAlreadySeated() && table.player_o_id !== currentUser.id) || isSeatTaken(table.player_o_id)}
              onClick={() => joinTable(table.id, "O")}>
              {table.player_o_id ? `${table.player_o.username} (O)` : 'O'}
            </button>
          </div>
        </div>
      ))}
    </div>
);
}

export default TicTacToeTableList;
