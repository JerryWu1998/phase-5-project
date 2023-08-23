import React, { useState } from 'react';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import ChatNavbar from './ChatNavbar';

function ChatContainer() {
  const [newMessages, setNewMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const styles = {
    navbarSection: {
      borderRight: '1px solid #b0b0b0',
      maxHeight: '400px',
      overflowY: 'auto'
    }
  };

  return (
    <div className="chat-container container-fluid">
      <div className="row">
        <div className="navbar-section col-md-3" style={styles.navbarSection}>
          <ChatNavbar
            selectedUser={selectedUser}
            setSelectUser={setSelectedUser}
            newMessages={newMessages}
            setNewMessages={setNewMessages}
          />
        </div>
        <div className="messages-section col-md-9">
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
