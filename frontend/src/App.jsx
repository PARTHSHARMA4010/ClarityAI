import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import "./App.css";
import AuthPage from "./components/AuthPage";
import TeacherDashboard from "./components/TeacherDashboard";
import StudentDashboard from "./components/StudentDashboard";
import LandingPage from "./components/LandingPage";

function App() {
  const [user, setUser] = useState(null);
  const [showLanding, setShowLanding] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedUser = jwtDecode(token);
      setUser(decodedUser.user);
      setShowLanding(false); // skip landing page if already logged in
    }
  }, []);

  const handleLogin = (token) => {
    localStorage.setItem("token", token);
    const decodedUser = jwtDecode(token);
    setUser(decodedUser.user);
    setShowLanding(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setShowLanding(true);
  };

  // Show Landing Page first
  if (showLanding && !user) {
    return <LandingPage onNavigate={() => setShowLanding(false)} />;
  }

  // Show Auth Page if user is not logged in
  if (!user) {
    return <AuthPage onLogin={handleLogin} />;
  }

  // Logged-in dashboard
  return (
    <div className="main-app-container">
      <header className="app-header">
        <h1>Clarity AI Dashboard</h1>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </header>
      <main>
        {user.role === "teacher" ? <TeacherDashboard /> : <StudentDashboard />}
      </main>
    </div>
  );
}

export default App;
