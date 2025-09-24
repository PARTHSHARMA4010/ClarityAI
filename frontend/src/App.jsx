import { useState, useEffect } from 'react';
import './App.css';
import AuthPage from './components/AuthPage';

function App() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const handleLogin = (jwtToken) => {
    localStorage.setItem('token', jwtToken);
    setToken(jwtToken);
  };
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  if (!token) {
    return <AuthPage onLogin={handleLogin} />;
  }

  return (
    <div className="main-app-container">
      <header className="app-header">
        <h1>Clarity AI Dashboard</h1>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </header>
      <main>
        {/* We will build the teacher/student dashboards here next */}
        <p>You are successfully logged in!</p>
      </main>
    </div>
  );
}

export default App;