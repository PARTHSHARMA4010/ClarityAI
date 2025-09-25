import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import './App.css';
import AuthPage from './components/AuthPage';
import TeacherDashboard from './components/TeacherDashboard';
import StudentDashboard from './components/StudentDashboard';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedUser = jwtDecode(token);
      setUser(decodedUser.user);
    }
  }, []);

  const handleLogin = (token) => {
    localStorage.setItem('token', token);
    const decodedUser = jwtDecode(token);
    setUser(decodedUser.user);
  };
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  if (!user) {
    return <AuthPage onLogin={handleLogin} />;
  }

  return (
    <div className="main-app-container">
      <header className="app-header">
        <h1>Clarity AI Dashboard</h1>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </header>
      <main>
        {user.role === 'teacher' ? <TeacherDashboard /> : <StudentDashboard />}
      </main>
    </div>
  );
}

export default App;