import { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // <--- 1. ADD THIS LINE
import "./TeacherDashboard.css";
import { 
  FaChalkboardTeacher, 
  FaClipboardList, 
  FaPlusCircle, 
  FaFileAlt, 
  FaUsers, 
  FaClock 
} from "react-icons/fa";

function TeacherDashboard() {
  const [assignments, setAssignments] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignmentFile, setAssignmentFile] = useState(null);
  const [error, setError] = useState("");

  const fetchAssignments = async () => {
    // ... (Your existing fetchAssignments function is perfect)
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://clarityai-new.onrender.com/api/assignments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch assignments.");
      const data = await response.json();
      setAssignments(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleCreateAssignment = async (e) => {
    // ... (Your existing handleCreateAssignment function is perfect)
    e.preventDefault();
    setError("");
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (assignmentFile) {
      formData.append("assignmentFile", assignmentFile);
    }
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://clarityai-new.onrender.com/api/assignments", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || "Failed to create assignment.");
      }
      fetchAssignments();
      setTitle("");
      setDescription("");
      setAssignmentFile(null);
      document.getElementById("assignmentFile").value = null;
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="dashboard-container">
      {/* ... (Your Header and Quick Stats sections are perfect) ... */}
      <div className="dashboard-header">
        <FaChalkboardTeacher className="teacher-icon" />
        <div>
          <h2>Welcome, Teacher!</h2>
          <p>Manage assignments and track student progress easily.</p>
        </div>
      </div>
      <div className="stats-cards">
          <div className="stat-card">
                    <FaFileAlt className="stat-icon" />
                    <div>
                      <h3>12</h3>
                      <p>Total Assignments</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <FaUsers className="stat-icon" />
                    <div>
                      <h3>87</h3>
                      <p>Student Submissions</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <FaClock className="stat-icon" />
                    <div>
                      <h3>5</h3>
                      <p>Pending Reviews</p>
                    </div>
                  </div>
      </div>

      <div className="content-wrapper">
        {/* ... (Your Create Assignment form is perfect) ... */}
        <div className="dashboard-card assignment-form-container">
            <div className="card-header">
            <FaPlusCircle className="section-icon large-icon" /> <h3>Create New Assignment</h3>
          </div>
          <form onSubmit={handleCreateAssignment} className="assignment-form">
            {error && <p className="error-message">{error}</p>}
            <div className="input-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="4"
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="assignmentFile">Assignment File (Optional)</label>
              <input
                type="file"
                id="assignmentFile"
                onChange={(e) => setAssignmentFile(e.target.files[0])}
              />
            </div>
            <button type="submit" className="create-button">
              Create Assignment
            </button>
          </form>
            
        </div>

        <div className="dashboard-card assignment-list-container">
          <div className="card-header">
            <FaClipboardList className="section-icon large-icon"/> <h3>Existing Assignments</h3>
          </div>
          {assignments.length === 0 ? (
            <p>No assignments created yet.</p>
          ) : (
            <ul className="assignment-list">
              {assignments.map((assignment) => (
                <li key={assignment._id} className="assignment-item">
                  {/* vvv 2. THIS IS THE ONLY OTHER CHANGE vvv */}
                  <Link to={`/assignment/${assignment._id}`} className="assignment-link">
                    <div className="assignment-details">
                      <h4>{assignment.title}</h4>
                      <p>{assignment.description}</p>
                    </div>
                    <div className="submission-status">
                      <strong>{assignment.submissionCount}</strong> Submissions
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default TeacherDashboard;