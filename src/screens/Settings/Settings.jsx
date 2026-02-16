import React from 'react';
import './style.css';

const Settings = () => {
  return (
    <div className="admin-settings-container">
      {/* User Access & Security */}
      <div className="settings-section">
        <h2>User Access & Security</h2>
        <div className="form-grid">
          <div className="form-group">
            <label>Multi-Factor Authentication (MFA)</label>
            <select>
              <option>Enable</option>
              <option>Disable</option>
            </select>
          </div>
          <div className="form-group">
            <label>Session Timeout</label>
            <select>
              <option>60s</option>
              <option>120s</option>
              <option>300s</option>
            </select>
          </div>
          <div className="form-group">
            <label>Login Attempt Limits</label>
            <select>
              <option>5</option>
              <option>3</option>
              <option>10</option>
            </select>
          </div>
          <div className="form-group">
            <label>Audit Logs</label>
            <select>
              <option>Enable logging of admin actions</option>
              <option>Disable</option>
            </select>
          </div>
        </div>
        <div className="button-group">
          <button className="save-btn">Save</button>
        </div>
      </div>

      {/* Notifications & Alerts */}
      <div className="settings-section">
        <h2>Notifications & Alerts</h2>
        <div className="form-grid">
          <div className="form-group">
            <label>Email Notifications</label>
            <select>
              <option>System Orders</option>
              <option>Disable</option>
            </select>
          </div>
          <div className="form-group">
            <label>SMS Notifications</label>
            <select>
              <option>Enable</option>
              <option>Disable</option>
            </select>
          </div>
          <div className="form-group">
            <label>Notification Preferences</label>
            <select>
              <option>Enable</option>
              <option>Disable</option>
            </select>
          </div>
        </div>
        <div className="button-group">
          <button className="save-btn">Save</button>
        </div>
      </div>

      {/* System Integration & API */}
      <div className="settings-section">
        <h2>System Integration & API</h2>
        <div className="form-grid">
          <div className="form-group">
            <label>API Access</label>
            <select>
              <option>Enable API access for external integrations</option>
              <option>Disable</option>
            </select>
          </div>
          <div className="form-group">
            <label>API Keys Management</label>
            <select>
              <option>Generate and revoke API keys</option>
              <option>Disable</option>
            </select>
          </div>
          <div className="form-group">
            <label>Webhook Configuration</label>
            <select>
              <option>Setup webhooks for real-time event notifications</option>
              <option>Disable</option>
            </select>
          </div>
          <div className="form-group">
            <label>Third-Party Integrations</label>
            <select>
              <option>Manage connections to payment gateways, analytics, shipping</option>
              <option>Disable</option>
            </select>
          </div>
        </div>
        <div className="button-group">
          <button className="save-btn">Save</button>
        </div>
      </div>

      {/* Change Password */}
      <div className="settings-section">
        <h2>Change Password</h2>
        <div className="form-grid">
          <div className="form-group">
            <label>Current Password</label>
            <input type="password" placeholder="Enter current password" />
          </div>
          <div className="form-group">
            <label>New Password</label>
            <input type="password" placeholder="Enter new password" />
          </div>
          <div className="form-group">
            <label>Repeat New Password</label>
            <input type="password" placeholder="Repeat new password" />
          </div>
           <div className="password-actions">
          <a href="#" className="forgot-password">Forgot password?</a>
          <button className="change-password-btn">Change password</button>
        </div>
        </div>
       
      </div>
    </div>
  );
};

export default Settings;
