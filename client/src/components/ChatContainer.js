import React, { useState } from 'react';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import ChatNavbar from './ChatNavbar';

function ChatContainer() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [newMessages, setNewMessages] = useState([]);

  const styles = {
    navbarSection: {
      borderRight: '1px solid #b0b0b0',
      maxHeight: '400px',
      overflowY: 'auto'
    },
    messagesSection: {
      maxHeight: '400px',
      overflowY: 'auto'
    }
  };

  return (
    <div className="chat-container container-fluid">
      <div className="row">
        <div className="navbar-section col-md-3" style={styles.navbarSection}>
          <ChatNavbar
            onSelectUser={setSelectedUser}
            newMessages={newMessages}
            setNewMessages={setNewMessages}
          />
        </div>
        <div className="messages-section col-md-9" style={styles.messagesSection}>
          <MessageList selectedUser={selectedUser} setNewMessages={setNewMessages} />
          <div className="input-section mt-auto">
            <ChatInput selectedUser={selectedUser} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatContainer;
