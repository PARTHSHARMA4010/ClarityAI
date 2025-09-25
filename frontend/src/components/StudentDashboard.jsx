import { useState, useEffect } from 'react';
import './StudentDashboard.css';

function StudentDashboard() {
  const [assignments, setAssignments] = useState([]);
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  // In frontend/src/components/StudentDashboard.jsx

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8000/api/assignments/student', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Failed to fetch assignments.');
        const data = await response.json();
        
        // ADD THIS LINE
        console.log('--- FRONTEND CHECK --- Received data:', data); 
        
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
      alert('Please select a file to submit.');
      return;
    }
    const formData = new FormData();
    formData.append('submissionFile', selectedFile);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/assignments/${assignmentId}/submit`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });
      if (!response.ok) throw new Error('Submission failed.');
      alert('Assignment submitted successfully!');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Student Dashboard</h2>
      <h3>Your Assignments</h3>
      {error && <p className="error-message">{error}</p>}
      <div className="student-assignment-list">
        {assignments.length > 0 ? assignments.map(assignment => (
          <div key={assignment._id} className="student-assignment-item">
            <h4>{assignment.title}</h4>
            <p>{assignment.description}</p>
            {assignment.fileUrl && <a href={assignment.fileUrl} target="_blank" rel="noopener noreferrer">Download Assignment File</a>}
            <div className="submission-area">
              <input type="file" onChange={handleFileChange} />
              <button onClick={() => handleSubmit(assignment._id)}>Submit</button>
            </div>
          </div>
        )) : <p>No assignments found.</p>}
      </div>
    </div>
  );
}

export default StudentDashboard;