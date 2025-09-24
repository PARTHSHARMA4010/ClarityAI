import { useState } from 'react';
import './AuthPage.css'; // <--- This is the missing line

function AuthPage({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAuth = async (event) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    const email = event.target.email.value;
    const password = event.target.password.value;
    
    const url = isLogin 
      ? 'http://localhost:8000/api/login' 
      : 'http://localhost:8000/api/register';

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Something went wrong');
      }
      
      onLogin(data.access_token);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isLogin ? 'Welcome Back!' : 'Create Your Account'}</h2>
        <form onSubmit={handleAuth}>
          {error && <p className="error-message">{error}</p>}
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" required />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" required />
          </div>
          <button type="submit" className="auth-button" disabled={isLoading}>
            {isLoading ? 'Loading...' : (isLogin ? 'Login' : 'Register')}
          </button>
        </form>
        <button 
          onClick={() => setIsLogin(!isLogin)} 
          className="toggle-button"
          disabled={isLoading}
        >
          {isLogin ? 'Need an account? Register' : 'Have an account? Login'}
        </button>
      </div>
    </div>
  );
}

export default AuthPage;