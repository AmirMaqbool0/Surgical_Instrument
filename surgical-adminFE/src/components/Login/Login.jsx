import React, { useState } from 'react';
import { useAuth } from '../../AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';
import logo from '../../assets/react.svg';
import './style.css';

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const Login = () => {
  const { login, token } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (token) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(
        `${baseUrl.replace(/\/?$/, '/') + 'auth/admin/interaction/login'}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        }
      );
      const data = await res.json();
      if (data.status === 1 && data.data && data.data.token) {
        login(data.data.token, data.data.user);
        navigate('/');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-bg">
      <div className="login-container">
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-logo-block">
            <img src={logo} alt="Logo" className="login-logo-img" />
            <span className="login-logo-text">Surgical Admin</span>
          </div>
          <h2>Sign in to your account</h2>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login; 