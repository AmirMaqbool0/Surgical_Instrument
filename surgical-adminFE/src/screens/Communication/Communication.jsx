import React, { useEffect, useState, useRef } from 'react';
import './style.css';

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const Communication = () => {
  const [chats, setChats] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [pollingInterval, setPollingInterval] = useState(null);
  const initialLoad = useRef(true);
  const [connectionStatus, setConnectionStatus] = useState('connected'); // 'connected' | 'disconnected'

  // Fetch all chats and user info
  useEffect(() => {
    const fetchChats = async () => {
      if (initialLoad.current) setLoading(true);
      try {
        // Use the new /v1/chat/all endpoint
        const res = await fetch(`${baseUrl}/v1/chat/all`);
        const data = await res.json();
        // Filter chats: ongoing = last message is not __end_chat__
        const ongoingChats = data.filter(chat => {
          if (!chat.messages || chat.messages.length === 0) return false;
          const lastMsg = chat.messages[chat.messages.length - 1];
          return !(lastMsg.sender === 'admin' && lastMsg.text === '__end_chat__');
        });
        setChats(ongoingChats);
        // Combine users and guests for the sidebar
        const userList = ongoingChats.map(chat => {
          if (chat.user) {
            return { ...chat.user, type: 'user', chatId: chat._id };
          } else if (chat.guest) {
            return { ...chat.guest, type: 'guest', chatId: chat._id };
          } else {
            return null;
          }
        }).filter(Boolean);
        setUsers(userList);
        if (userList.length > 0) {
          setConnectionStatus('connected');
        } else {
          setConnectionStatus('disconnected');
        }
      } catch (err) {
        setChats([]);
        setUsers([]);
        setConnectionStatus('disconnected');
      }
      if (initialLoad.current) {
        setLoading(false);
        initialLoad.current = false;
      }
    };
    fetchChats();
    // Optionally poll for new chats
    const interval = setInterval(fetchChats, 10000);
    setPollingInterval(interval);
    return () => clearInterval(interval);
  }, []);

  // Fetch messages for selected user or guest
  useEffect(() => {
    if (!selectedUser) return;
    const fetchMessages = async () => {
      setLoading(true);
      try {
        let url;
        if (selectedUser.type === 'user') {
          url = `${baseUrl}/v1/chat/conversation/${selectedUser._id || selectedUser.id}`;
        } else if (selectedUser.type === 'guest') {
          url = `${baseUrl}/v1/chat/conversation/guest/${selectedUser.guestId}`;
        }
        const res = await fetch(url);
        const data = await res.json();
        setMessages(data.messages || []);
      } catch (err) {
        setMessages([]);
      }
      setLoading(false);
    };
    fetchMessages();
    // Poll for new messages
    const interval = setInterval(fetchMessages, 2500);
    return () => clearInterval(interval);
  }, [selectedUser]);

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || !selectedUser) return;
    setSending(true);
    try {
      let body;
      if (selectedUser.type === 'user') {
        body = {
          userId: selectedUser._id || selectedUser.id,
          sender: 'admin',
          text: inputValue.trim(),
        };
      } else if (selectedUser.type === 'guest') {
        body = {
          guestId: selectedUser.guestId,
          sender: 'admin',
          text: inputValue.trim(),
        };
      }
      await fetch(`${baseUrl}/v1/chat/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      setInputValue('');
    } catch (err) {}
    setSending(false);
  };

  const handleEndChat = async () => {
    if (!selectedUser) return;
    setSending(true);
    try {
      let body;
      if (selectedUser.type === 'user') {
        body = {
          userId: selectedUser._id || selectedUser.id,
          sender: 'admin',
          text: '__end_chat__',
        };
      } else if (selectedUser.type === 'guest') {
        body = {
          guestId: selectedUser.guestId,
          sender: 'admin',
          text: '__end_chat__',
        };
      }
      await fetch(`${baseUrl}/v1/chat/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
    } catch (err) {}
    setSending(false);
  };

  return (
    <>
      <div className="communication-container">
        <aside className="user-list-sidebar">
          <h2>Users</h2>
          <ul className="user-list">
            {users.filter(Boolean).map(user => (
              <li
                key={user.type === 'user' ? (user._id || user.id) : user.guestId}
                className={selectedUser && ((user.type === 'user' ? (user._id || user.id) : user.guestId) === (selectedUser.type === 'user' ? (selectedUser._id || selectedUser.id) : selectedUser.guestId)) ? 'active' : ''}
                onClick={() => handleUserClick(user)}
              >
                <div className="user-avatar">
                  {user.type === 'user' ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}` : 'G'}
                </div>
                <div className="user-info">
                  <div className="user-name">{user.type === 'user' ? `${user.firstName} ${user.lastName}` : 'Guest'}</div>
                  <div className="user-email">{user.type === 'user' ? user.email : `Guest ID: ${user.guestId.slice(0, 8)}...`}</div>
                </div>
              </li>
            ))}
          </ul>
        </aside>
        <main className="chat-area">
          <div className="chat-header-row">
            <h2>Conversation</h2>
            <div className="connection-status connection-status-global">
              <span className={`status-dot ${connectionStatus}`}></span>
              <span className={`status-text ${connectionStatus}`}>{connectionStatus === 'connected' ? 'Connected' : 'Disconnected'}</span>
            </div>
          </div>
          {selectedUser ? (
            <>
              <div className="chat-messages">
                {messages.length === 0 && <div className="empty-chat">No messages yet.</div>}
                {messages.map((msg, idx) => (
                  <div key={idx} className={`message ${msg.sender === 'admin' ? 'admin' : 'user'}`}>
                    <div className="message-content">
                      <span>{msg.text === '__end_chat__' ? <i>Chat ended by admin</i> : msg.text}</span>
                      <span className="timestamp">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                ))}
              </div>
              <form className="chat-input" onSubmit={handleSend}>
                <input
                  type="text"
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  placeholder="Type a message..."
                  disabled={sending || (messages[messages.length-1]?.text === '__end_chat__')}
                />
                <button type="submit" disabled={sending || !inputValue.trim() || (messages[messages.length-1]?.text === '__end_chat__')}>Send</button>
                <button type="button" className="end-chat-btn" onClick={handleEndChat} disabled={sending || (messages[messages.length-1]?.text === '__end_chat__')}>End Chat</button>
              </form>
            </>
          ) : (
            <div className="empty-chat">Select a user to view the conversation.</div>
          )}
        </main>
      </div>
    </>
  );
};

export default Communication; 