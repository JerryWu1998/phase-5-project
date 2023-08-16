import React, { useState, useEffect, useContext } from 'react';
import UserContext from '../context/UserContext.js';
import { Link } from 'react-router-dom';

const ChatNavbar = ({ onSelectUser, newMessages, setNewMessages }) => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { currentUser } = useContext(UserContext);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/users');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users
    .filter(user => user.username.toLowerCase().includes(searchTerm.toLowerCase()) && user.id !== currentUser.id)
    .sort((a, b) => (newMessages.includes(b.id) ? 1 : 0) - (newMessages.includes(a.id) ? 1 : 0));

  return (
    <div className="chat-navbar">
      <div className="input-group mb-3">
        <input 
          type="text"
          className="form-control"
          placeholder="Search users..."
          aria-label="Search"
          aria-describedby="basic-addon1"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="list-group">
        {filteredUsers.map(user => (
          <Link 
            to="#"
            key={user.id} 
            className="list-group-item list-group-item-action"
            onClick={() => {
              onSelectUser(user);
              if (newMessages.includes(user.id)) {
                setNewMessages(prevMessages => prevMessages.filter(id => id !== user.id));
              }
            }}
          >
            {user.username}
            {newMessages.includes(user.id) && <span className="badge bg-dark ml-2 ms-2">New</span>}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ChatNavbar;
