import React, { useState, useEffect, useContext } from 'react';
import socketIOClient from "socket.io-client";
import UserContext from '../context/UserContext.js';

function TicTacToeTableList() {
  const [tables, setTables] = useState([]);
  const { currentUser } = useContext(UserContext);
  
  // 在state中管理socket，以确保它只被创建一次
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = socketIOClient("/"); // 实例化socket连接
    setSocket(newSocket);

    // 获取初始游戏桌列表
    fetch('/tictactoetables')
      .then(response => response.json())
      .then(data => setTables(data));

    // 监听新的游戏桌事件
    newSocket.on("broadcast_table", newTable => {
      setTables(prevTables => [...prevTables, newTable]);
    });

    // 监听游戏桌更新事件
    newSocket.on("update_table", updatedTable => {
      setTables(prevTables => 
        prevTables.map(table => table.id === updatedTable.id ? updatedTable : table)
      );
    });

    // 断开socket连接
    return () => newSocket.disconnect();

  }, []); // 这里的空数组表示这个effect只在组件mount和unmount时运行

  const joinTable = (tableId, position) => {
    socket.emit('join_table', {
      table_id: tableId,
      position: position === "X" ? "player_x_id" : "player_o_id",
      user_id: currentUser.id
    });
  };

  return (
    <div>
      {tables.map(table => (
        <div key={table.id} className="table">
          <button 
            className="btn btn-primary" 
            disabled={table.player_x_id && table.player_x_id !== currentUser.id}
            onClick={() => joinTable(table.id, "X")}>
              {table.player_x_id ? (table.player_x_id === currentUser.id ? 'You (X)' : 'Taken') : 'X'}
          </button>
          <button 
            className="btn btn-secondary" 
            disabled={table.player_o_id && table.player_o_id !== currentUser.id}
            onClick={() => joinTable(table.id, "O")}>
              {table.player_o_id ? (table.player_o_id === currentUser.id ? 'You (O)' : 'Taken') : 'O'}
          </button>
        </div>
      ))}
    </div>
  );
}

export default TicTacToeTableList;
