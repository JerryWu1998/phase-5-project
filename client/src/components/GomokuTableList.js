import React, { useState, useEffect, useContext } from 'react';
import UserContext from '../context/UserContext.js';

function GomokuTableList({ socket, setGameId }) {
  const [tables, setTables] = useState([]);
  const { currentUser, setShowGGame } = useContext(UserContext);

  useEffect(() => {
    fetch('/gomokutables')
      .then(response => response.json())
      .then(data => setTables(data));

    if (!socket) return;

    socket.on("gomoku_update_table", updatedTable => {
      setTables(prevTables =>
        prevTables.map(table => table.id === updatedTable.id ? updatedTable : table)
      );
      if (updatedTable.player_black_id && updatedTable.player_white_id) {
        setShowGGame(true);
      }
    });

    socket.on("gomoku_game_started", (data) => {
      setGameId(data.game_id);
      setShowGGame(true);
    });

    return () => {
      socket.off();
    };
  }, [setShowGGame, socket, setGameId]);

  const isUserAlreadySeated = () => {
    return tables.some(table => table.player_black_id === currentUser.id || table.player_white_id === currentUser.id);
  };

  const isSeatTaken = (seatUserId) => {
    return seatUserId && seatUserId !== currentUser.id;
  };

  const joinTable = (tableId, position) => {
    if (!socket) return;

    const currentPosition = position === "Black" ? "player_black_id" : "player_white_id";
    const table = tables.find(table => table.id === tableId);

    if (isUserAlreadySeated() && table[currentPosition] !== currentUser.id) {
      return;
    }

    socket.emit('gomoku_join_table', {
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
              disabled={(isUserAlreadySeated() && table.player_black_id !== currentUser.id) || isSeatTaken(table.player_black_id)}
              onClick={() => joinTable(table.id, "Black")}>
              {table.player_black_id ? `${table.player_black.username} (Black)` : 'Black'}
            </button>
            <img src="https://www.shareicon.net/data/512x512/2017/01/16/871735_table_512x512.png"
              alt="Table" style={{ width: '100px', height: '80px' }} />
            <button
              style={{ height: '40px' }}
              className="btn btn-dark mx-2"
              disabled={(isUserAlreadySeated() && table.player_white_id !== currentUser.id) || isSeatTaken(table.player_white_id)}
              onClick={() => joinTable(table.id, "White")}>
              {table.player_white_id ? `${table.player_white.username} (White)` : 'White'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default GomokuTableList;
