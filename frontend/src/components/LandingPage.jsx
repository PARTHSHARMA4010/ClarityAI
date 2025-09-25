import React from "react";
import "./LandingPage.css";

const LandingPage = ({ onNavigate }) => {
  return (
    <div className="landing-container">

      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">Clarity AI</div>
        <ul className="nav-links">
          <li><a href="#how-it-works">How It Works</a></li>
          <li><a href="#features">Features</a></li>
          <li><a href="#about">About Us</a></li>
          <li><a href="#testimonials">Testimonials</a></li>
        </ul>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Clarity AI</h1>
          <p>An AI-powered dashboard that analyzes a class’s student submissions to identify misconceptions, giving teachers instant actionable insights.</p>
          <div className="hero-buttons">
            <button onClick={() => onNavigate('student')} className="student-btn">Student Login / Signup</button>
            <button onClick={() => onNavigate('teacher')} className="teacher-btn">Teacher Login / Signup</button>
          </div>
        </div>
        <div className="hero-image">
          <img src="https://cdn-icons-png.flaticon.com/512/2910/2910762.png" alt="AI Dashboard" />
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="how-it-works">
        <h2>How Clarity AI Works</h2>
        <div className="steps">
          <div className="step-card">
            <img src="https://cdn-icons-png.flaticon.com/512/3159/3159067.png" alt="Upload" />
            <h3>1. Upload Student Responses</h3>
            <p>Teachers upload CSV or text files containing essays, answers, or code submissions.</p>
          </div>
          <div className="step-card">
            <img src="https://cdn-icons-png.flaticon.com/512/3405/3405343.png" alt="AI Analysis" />
            <h3>2. AI Analysis</h3>
            <p>Our AI clusters the responses and identifies recurring misconceptions.</p>
          </div>
          <div className="step-card">
            <img src="https://cdn-icons-png.flaticon.com/512/994/994464.png" alt="Clusters" />
            <h3>3. Misconception Clusters</h3>
            <p>Each cluster shows a title, explanation, anonymized examples, and actionable suggestions.</p>
          </div>
          <div className="step-card">
            <img src="https://cdn-icons-png.flaticon.com/512/545/545682.png" alt="Insights" />
            <h3>4. Insight Dashboard</h3>
            <p>Visual dashboard gives teachers a clear, data-driven view of class-wide struggles.</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="features">
        <h2>Key Features</h2>
        <div className="feature-cards">
          <div className="card">
            <img src="https://cdn-icons-png.flaticon.com/512/4396/4396432.png" alt="Flashcards" />
            <h3>Interactive Flashcards</h3>
            <p>Quickly memorize and review key misconceptions with AI-generated flashcards.</p>
          </div>
          <div className="card">
            <img src="https://cdn-icons-png.flaticon.com/512/4265/4265183.png" alt="Analytics" />
            <h3>Class Analytics</h3>
            <p>See visual trends in student understanding and pinpoint problem areas instantly.</p>
          </div>
          <div className="card">
            <img src="https://cdn-icons-png.flaticon.com/512/3448/3448446.png" alt="Collaboration" />
            <h3>Teacher Collaboration</h3>
            <p>Share insights, resources, and suggestions easily with colleagues.</p>
          </div>
        </div>
      </section>

      {/* About Us */}
      <section id="about" className="about">
        <h2>About Clarity AI</h2>
        <p>
          Clarity AI reduces teacher burnout and student frustration by transforming hours of grading into instant insights. Teachers get actionable data to improve teaching, students get targeted help, and the learning process becomes smarter and more efficient.
        </p>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="testimonials">
        <h2>What Our Users Say</h2>
        <div className="testimonial-cards">
          <div className="testimonial-card">
            <img src="https://randomuser.me/api/portraits/women/65.jpg" alt="User" />
            <p>"Clarity AI instantly showed me the class's common mistakes. I could teach smarter, not harder."</p>
            <h4>- Priya S., Teacher</h4>
          </div>
          <div className="testimonial-card">
            <img src="https://randomuser.me/api/portraits/men/43.jpg" alt="User" />
            <p>"Finally, a tool that helps me understand exactly what I'm struggling with. Learning is fun now!"</p>
            <h4>- Rohit K., Student</h4>
          </div>
          <div className="testimonial-card">
            <img src="https://randomuser.me/api/portraits/women/22.jpg" alt="User" />
            <p>"The insight dashboard is amazing! It saves me hours of grading and helps target the lessons better."</p>
            <h4>- Anjali K., Teacher</h4>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2025 Clarity AI. All rights reserved.</p>
        <p>Contact: info@clarityai.com</p>
      </footer>

    </div>
  );
};

export default LandingPage;
