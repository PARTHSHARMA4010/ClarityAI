import { useState, useEffect } from 'react';
import './TeacherDashboard.css';

function TeacherDashboard() {
  const [assignments, setAssignments] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignmentFile, setAssignmentFile] = useState(null);
  const [error, setError] = useState('');

  const fetchAssignments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/assignments', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch assignments.');
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
    e.preventDefault();
    setError('');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    if (assignmentFile) {
      formData.append('assignmentFile', assignmentFile);
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/assignments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || 'Failed to create assignment.');
      }

      // Refresh the list of assignments after creating a new one
      fetchAssignments();
      
      // Clear the form
      setTitle('');
      setDescription('');
      setAssignmentFile(null);
      document.getElementById('assignmentFile').value = null; // Clear file input

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Teacher Dashboard</h2>
      <div className="content-wrapper">
        <div className="assignment-form-container">
          <h3>Create New Assignment</h3>
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
            <button type="submit" className="create-button">Create Assignment</button>
          </form>
        </div>
        <div className="assignment-list-container">
          <h3>Existing Assignments</h3>
          {assignments.length === 0 ? (
            <p>No assignments created yet.</p>
          ) : (
            <ul className="assignment-list">
              {assignments.map(assignment => (
                <li key={assignment._id} className="assignment-item">
                  <div className="assignment-details">
                    <h4>{assignment.title}</h4>
                    <p>{assignment.description}</p>
                  </div>
                  <div className="submission-status">
                    <span>{assignment.submissionCount}</span>
                    Submissions
                  </div>
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