import { useState, useEffect } from "react";
import "./StudentDashboard.css";

function StudentDashboard() {
  const [assignments, setAssignments] = useState([]);
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  // Dummy progress stats (hardcoded for visuals)
  const completedAssignments = 6;
  const pendingAssignments = 3;
  const totalAssignments = completedAssignments + pendingAssignments;

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:8000/api/assignments/student",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch assignments.");
        const data = await response.json();

        console.log("--- FRONTEND CHECK --- Received data:", data);
        setAssignments(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchAssignments();
  }, []);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (assignmentId) => {
    if (!selectedFile) {
      alert("Please select a file to submit.");
      return;
    }
    const formData = new FormData();
    formData.append("submissionFile", selectedFile);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8000/api/assignments/${assignmentId}/submit`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );
      if (!response.ok) throw new Error("Submission failed.");
      alert("Assignment submitted successfully!");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Student Dashboard</h2>
      <h3>Your Learning Progress</h3>

      {/* Progress Overview Section */}
      <div className="progress-overview">
        <div className="progress-card">
          <h4>Completed Assignments</h4>
          <p className="progress-number">{completedAssignments}</p>
        </div>
        <div className="progress-card">
          <h4>Pending Assignments</h4>
          <p className="progress-number pending">{pendingAssignments}</p>
        </div>
        <div className="progress-card">
          <h4>Total Assignments</h4>
          <p className="progress-number total">{totalAssignments}</p>
        </div>
      </div>

      {/* Simple Progress Bar Visualization */}
      <div className="progress-chart">
        <h4>Overall Completion</h4>
        <div className="bar-container">
          <div
            className="bar-completed"
            style={{
              width: `${(completedAssignments / totalAssignments) * 100}%`,
            }}
          ></div>
          <div
            className="bar-pending"
            style={{
              width: `${(pendingAssignments / totalAssignments) * 100}%`,
            }}
          ></div>
        </div>
        <div className="bar-legend">
          <span className="legend-completed">Completed</span>
          <span className="legend-pending">Pending</span>
        </div>
      </div>

      <h3>Your Assignments</h3>
      {error && <p className="error-message">{error}</p>}

      <div className="student-assignment-list">
        {assignments.length > 0 ? (
          assignments.map((assignment) => (
            <div key={assignment._id} className="student-assignment-item">
              <h4>{assignment.title}</h4>
              <p>{assignment.description}</p>
              {assignment.fileUrl && (
                <a
                  href={assignment.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  📄 Download Assignment File
                </a>
              )}
              <div className="submission-area">
                <input type="file" onChange={handleFileChange} />
                <button onClick={() => handleSubmit(assignment._id)}>
                  Submit
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No assignments found.</p>
        )}
      </div>
    </div>
  );
}

export default StudentDashboard;
