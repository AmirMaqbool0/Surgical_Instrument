import React, { useState, useRef, useEffect } from 'react';
import './style.css';
import { Bell, MessageSquare, Search, Settings, ChevronRight, Menu } from 'lucide-react';
import profileImage from '../../assets/profile.png';
import { useAuth } from '../../AuthContext';

const Header = ({ toggleSidebar }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const notificationsRef = useRef(null);
  const userDropdownRef = useRef(null);
  const { user, logout } = useAuth();

  console.log('Header user object:', user);

  // Notification data matching the screenshot exactly
  const notifications = [
    {
      id: 1,
      title: 'Discount available',
      details: [
        'Notice supplements, articles at rhonous et.',
        'Littancorper nec diam.'
      ]
    },
    {
      id: 2,
      title: 'Account has been verified',
      details: [
        'Muntis libero ex, faculis vitae rhoncus et.'
      ]
    },
    {
      id: 3,
      title: 'Order shipped successfully',
      details: [
        'Notification of expenses distribution satisfaction'
      ]
    },
    {
      id: 4,
      title: 'Order pending: ID 305830',
      details: [
        'Purchase at rhoncus et. Littancorper'
      ]
    }
  ];

  // Close notifications and user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        if (!event.target.closest('.icon-wrapper')) {
          setShowNotifications(false);
        }
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        if (!event.target.closest('.user-profile')) {
          setShowUserDropdown(false);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="header">
      {/* <div className="search-box">
        <input type="text" placeholder="Search here..." />
        <button className="search-icon"><Search /></button>
      </div> */}

      <div className="header-left">
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          <Menu size={24} />
        </button>
        <div className="search-box">
          <input type="text" placeholder="Search here..." />
          <button className="search-icon">
            <Search size={16}/>
            </button>
        </div>
      </div>

      <div className="header-right">
        <div
          className="icon-wrapper"
          onClick={() => setShowNotifications(!showNotifications)}
        >
          <Bell size={18} />
          <span className="notification-badge orange">{notifications.length}</span>
        </div>

        <div className="icon-wrapper">
          <MessageSquare size={18} />
          <span className="notification-badge blue">1</span>
        </div>

        <div className="user-profile" onClick={() => setShowUserDropdown(v => !v)}>
          <img src={profileImage} alt="User" />
          <div className="user-info">
            <span className="user-name">{
              user && (user.firstName || user.lastName)
                ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
                : user?.email || 'User'
            }</span>
            <span className="user-role">Admin</span>
          </div>
        </div>

        {showUserDropdown && (
          <div className="user-dropdown" ref={userDropdownRef} style={{ position: 'absolute', top: 60, right: 30, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, boxShadow: '0 4px 16px rgba(0,0,0,0.10)', zIndex: 1001, minWidth: 160 }}>
            <div style={{ padding: '12px 18px', borderBottom: '1px solid #f3f4f6', fontWeight: 600, color: '#222' }}>{
              user && (user.firstName || user.lastName)
                ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
                : user?.email || 'User'
            }</div>
            <button style={{ width: '100%', background: 'none', border: 'none', color: '#ef4444', fontWeight: 600, padding: '12px 18px', cursor: 'pointer', textAlign: 'left' }} onClick={logout}>Log out</button>
          </div>
        )}

        <Settings size={22} className="settings-icon" />

        {/* Notification Popup - Exact match to screenshot */}
        {showNotifications && (
          <div className="notifications-popup" ref={notificationsRef}>
            <div className="notifications-header">
              <h3>Notifications</h3>
            </div>

            <div className="notifications-list">
              {notifications.map((notification, index) => (
                <div key={notification.id} className="notification-item">
                  <div className="notification-number">{index + 1}.</div>
                  <div className="notification-content">
                    <div className="notification-title">{notification.title}</div>
                    {notification.details.map((detail, i) => (
                      <div key={i} className="notification-detail">
                        <ChevronRight size={12} className="chevron-icon" />
                        {detail}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="notifications-footer">
              <button className="view-all-btn">View all</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;