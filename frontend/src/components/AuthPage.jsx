import { useState } from "react";
import { FaEnvelope, FaLock, FaUserGraduate, FaChalkboardTeacher } from "react-icons/fa";
import "./AuthPage.css";

function AuthPage({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState("student");

  const handleAuth = async (event) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    const email = event.target.email.value;
    const password = event.target.password.value;

    const url = isLogin
      ? "http://localhost:8000/api/login"
      : "http://localhost:8000/api/register";

    const body = isLogin
      ? JSON.stringify({ email, password })
      : JSON.stringify({ email, password, role });

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: body,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || "Something went wrong");
      }
      onLogin(data.access_token);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      {/* Left Side */}
      <div className="auth-left">
        <h1>✨ Clarity AI</h1>
        <p>Your personalized AI-powered learning companion.</p>
        {/* <img 
  src="https://cdn-icons-png.flaticon.com/512/2232/2232688.png" 
  alt="Books" 
  className="auth-illustration" 
/> */}

          <FaGraduationCap size={120} color="#7c3aed" />

      </div>

      {/* Right Side - Form */}
      <div className="auth-container">
        <div className="auth-card">
          <h2>{isLogin ? "Welcome Back 👋" : "Create Your Account 🚀"}</h2>

          {error && <div className="error-box">{error}</div>}

          <form onSubmit={handleAuth}>
            <div className="input-group">
              <FaEnvelope className="input-icon" />
              <input type="email" id="email" name="email" placeholder="Email" required />
            </div>

            <div className="input-group">
              <FaLock className="input-icon" />
              <input type="password" id="password" name="password" placeholder="Password" required />
            </div>

            {!isLogin && (
              <div className="role-toggle">
                <button
                  type="button"
                  className={`role-btn ${role === "student" ? "active" : ""}`}
                  onClick={() => setRole("student")}
                >
                  <FaUserGraduate /> Student
                </button>
                <button
                  type="button"
                  className={`role-btn ${role === "teacher" ? "active" : ""}`}
                  onClick={() => setRole("teacher")}
                >
                  <FaChalkboardTeacher /> Teacher
                </button>
              </div>
            )}

            <button type="submit" className="auth-button" disabled={isLoading}>
              {isLoading ? "Loading..." : isLogin ? "Login" : "Register"}
            </button>
          </form>

          <button
            onClick={() => setIsLogin(!isLogin)}
            className="toggle-button"
            disabled={isLoading}
          >
            {isLogin ? "Need an account? Register" : "Have an account? Login"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
