import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './SubmissionsViewer.css';

function SubmissionsViewer() {
  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { assignmentId } = useParams();

  useEffect(() => {
    const fetchSubmissions = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`https://clarityai-new.onrender.com/api/assignments/${assignmentId}/submissions`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Failed to fetch submissions.');
        const data = await response.json();
        setSubmissions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSubmissions();
  }, [assignmentId]);

  if (isLoading) return <p>Loading submissions...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="submissions-container">
      <Link to={`/assignment/${assignmentId}`} className="back-link">&larr; Back to Analysis</Link>
      <h2>Student Submissions</h2>
      {submissions.length === 0 ? (
        <p>No students have submitted this assignment yet.</p>
      ) : (
        <ul className="submission-list">
          {submissions.map(sub => (
            <li key={sub._id} className="submission-item">
              <span className="student-email">{sub.studentId.email}</span>
              <div className="submission-actions">
                <button className="view-qa-btn">View Q&A Format</button>
                
                {/* --- HARDCODED DOWNLOAD LINK --- */}
                <a 
                  href="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="download-submission-link"
                >
                  Download Submission
                </a>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SubmissionsViewer;