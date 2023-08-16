import React, { useState, useEffect, useContext } from 'react';
import io from 'socket.io-client';
import UserContext from '../context/UserContext.js';

const ChatInput = ({ selectedUser }) => {
  const [message, setMessage] = useState('');
  const { currentUser } = useContext(UserContext);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io.connect('http://localhost:5555');
    newSocket.on('connect_error', (err) => {
      console.error("Connection failed!", err);
    });
    setSocket(newSocket);
    return () => {
      newSocket.close();
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!message.trim() || !selectedUser || !currentUser) return;

    if (socket) {
      const messageData = {
        sender_id: currentUser.id,
        receiver_id: selectedUser.id,
        message_content: message
      };
      socket.emit('send_message', messageData);
      setMessage('');
    } else {
      console.error("Socket is not connected!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-inline d-flex">
      <input
        type="text"
        className="form-control flex-grow-1 mr-2"
        value={message}
        onChange={e => setMessage(e.target.value)}
        placeholder="Type a message..."
        disabled={!selectedUser}
      />
      <button type="submit" className="btn btn-outline-dark ms-2" disabled={!selectedUser}>Send</button>
    </form>
  );
};

export default ChatInput;
