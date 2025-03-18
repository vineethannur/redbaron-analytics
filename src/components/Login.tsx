import React, { useState, useEffect } from 'react';
import '../styles/Login.css';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // On mount, reset dark mode when on login screen
  useEffect(() => {
    document.body.classList.remove('dark-mode');
    localStorage.setItem('darkMode', 'false');
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate credentials
    if (email === 'admin@redbaron.in' && password === 'Password@123') {
      // Set authentication state
      localStorage.setItem('isAuthenticated', 'true');
      // Call the onLogin callback
      onLogin();
    } else {
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo">
          <img src="../assets/logo.png" alt="Logo" className="logo" />
           
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="text-left">User Name</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password" className="text-left">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          
          <button type="submit" className="login-button">
            Sign In
          </button>
        </form>
        
        <div className="login-footer">
          &copy; 2025 Redbaron
        </div>
      </div>
    </div>
  );
};

export default Login; 