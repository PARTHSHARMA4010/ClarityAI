import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom"; // Import Routes and Route
import { jwtDecode } from "jwt-decode";
import "./App.css";
import AuthPage from "./components/AuthPage";
import TeacherDashboard from "./components/TeacherDashboard";
import StudentDashboard from "./components/StudentDashboard";
import LandingPage from "./components/LandingPage";
import AnalysisPage from "./components/AnalysisPage"; // Import the new page
import SubmissionsViewer from "./components/SubmissionsViewer";


function App() {
  const [user, setUser] = useState(null);
  const [showLanding, setShowLanding] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedUser = jwtDecode(token);
      setUser(decodedUser.user);
      setShowLanding(false);
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

  if (showLanding && !user) {
    return <LandingPage onNavigate={() => setShowLanding(false)} />;
  }

  if (!user) {
    return <AuthPage onLogin={handleLogin} />;
  }

  return (
    <div className="main-app-container">
      <header className="app-header">
        <h1>Clarity AI Dashboard</h1>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </header>
      <main>
        <Routes>
          {/* Main dashboard route */}
          <Route 
            path="/" 
            element={user.role === "teacher" ? <TeacherDashboard /> : <StudentDashboard />} 
          />
          {/* Route for the analysis page */}
          <Route 
            path="/assignment/:assignmentId" 
            element={user.role === "teacher" ? <AnalysisPage /> : <p>Access Denied</p>} 
          />
          <Route 
    path="/assignment/:assignmentId/submissions" 
    element={user.role === "teacher" ? <SubmissionsViewer /> : <p>Access Denied</p>} 
  />
        </Routes>
      </main>
    </div>
  );
}

export default App;