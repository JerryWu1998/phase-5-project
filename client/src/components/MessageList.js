import React, { useState, useEffect, useContext, useRef } from 'react';
import io from 'socket.io-client';
import UserContext from '../context/UserContext.js';

const MessageList = ({ selectedUser, setNewMessages }) => {
  const [messages, setMessages] = useState([]);
  const { currentUser } = useContext(UserContext);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (currentUser) {
      const newSocket = io.connect('http://localhost:5555');

      newSocket.on('broadcast_message', (newMessage) => {
        if (newMessage.sender_id === currentUser.id || newMessage.receiver_id === currentUser.id) {
          setMessages((prevMessages) => [...prevMessages, newMessage]);
          if (newMessage.sender_id !== currentUser.id) {
            setNewMessages((prev) => [...prev, newMessage.sender_id]);
          }
        }
      });

      return () => newSocket.close();
    }
  }, [currentUser, setNewMessages]);

  useEffect(() => {
    if (currentUser) {
      const fetchMessages = async () => {
        try {
          const response = await fetch('/chats');
          const data = await response.json();
          const userMessages = data.filter(msg => msg.sender_id === currentUser.id || msg.receiver_id === currentUser.id);
          setMessages(userMessages);
        } catch (error) {
          console.error("Error fetching the messages:", error);
        }
      };
      fetchMessages();
    }
  }, [currentUser]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedUser, messages]);

  const categorizeMessages = () => {
    let categorized = {};
    messages.forEach(message => {
      const otherUser = message.sender_id === currentUser.id ? message.receiver : message.sender;
      if (!categorized[otherUser.id]) {
        categorized[otherUser.id] = {
          username: otherUser.username,
          messages: []
        };
      }
      categorized[otherUser.id].messages.push(message);
    });
    return categorized;
  }

  const categorizedMessages = categorizeMessages();

  return (
    <div>
      {selectedUser ? <h3 className="d-flex justify-content-center my-2">Messages with {selectedUser.username}</h3> :
        <h3 className="d-flex justify-content-center my-2">Select a user</h3>
      }
      {selectedUser && categorizedMessages[selectedUser.id] && (
        <div>
          {categorizedMessages[selectedUser.id].messages.map((message, index) => {
            const isSentByCurrentUser = message.sender_id === currentUser.id;
            return (
              <div key={index} className={`d-flex ${isSentByCurrentUser ? 'justify-content-end' : 'justify-content-start'} my-2`}>
                <div
                  className={`d-inline-block p-2 rounded ${isSentByCurrentUser ? 'bg-dark text-white' : 'bg-white text-black'}`}
                  style={{ maxWidth: '70%' }}
                >
                  {message.message_content}
                </div>
              </div>
            )
          })}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
};

export default MessageList;
