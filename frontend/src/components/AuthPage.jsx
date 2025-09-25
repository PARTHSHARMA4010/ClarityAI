import { useState } from 'react';
import './AuthPage.css';

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
    const role = event.target.role ? event.target.role.value : undefined;
    
    const url = isLogin 
      ? 'http://localhost:8000/api/login' 
      : 'http://localhost:8000/api/register';

    const body = isLogin
      ? JSON.stringify({ email, password })
      : JSON.stringify({ email, password, role });

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body,
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
          {!isLogin && (
            <div className="input-group">
              <label htmlFor="role">Register as</label>
              <select id="role" name="role" required>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </select>
            </div>
          )}
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