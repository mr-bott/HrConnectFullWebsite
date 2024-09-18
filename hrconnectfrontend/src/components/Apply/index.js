import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './index.css';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

const Apply = () => {

   const { jobId } = useParams();


  const navigate = useNavigate();

  const [coverLetter, setCoverLetter] = useState('');
  const [resumeId, setResumeId] = useState('');
  const [resumes, setResumes] = useState([]);

  const token = Cookies.get('jwt_token');
  const decodedToken = jwtDecode(token);
  const Id = decodedToken.loggedid;

  useEffect(() => {
    const fetchResumes = async () => {
      try {                      
        const response = await fetch(`${process.env.REACT_APP_Backend_url}/users/resumes/${Id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          console.log('Fetched resumes:', data);
          setResumes(data.rows || []);
        } else {
          console.error('Failed to fetch resumes');
        }
      } catch (error) {
        console.error('Error fetching resumes:', error);
      }
    };

    fetchResumes();
  }, [token, Id]);

  const handleCoverLetterChange = (e) => setCoverLetter(e.target.value);
  const handleResumeIdChange = (e) => setResumeId(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = Cookies.get('jwt_token');
      const response = await fetch(`${process.env.REACT_APP_Backend_url}/applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: Id,
          job_listing_id:jobId,
          resume_id: resumeId,
          cover_letter: coverLetter,
        }),
      });

      if (response.ok) {
        alert('Application submitted successfully!');
        navigate('/');
      } else {
        alert('Failed to submit application.');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Error submitting application.');
    }
  };

  return (
    <div className="apply-container">
      <h1 className="apply-heading">Apply for Job</h1>
      <p className="apply-info">Job ID: {jobId}</p>
      <form onSubmit={handleSubmit} className="apply-form">
        <div>
          <label htmlFor="resumeId" className="apply-label">Resume ID:</label>
          <select
            id="resumeId"
            value={resumeId}
            onChange={handleResumeIdChange}
            required
            className="apply-select"
          >
            <option value="">Select a resume</option>
            {resumes.length > 0 ? (
              resumes.map((each) => (
                <option key={each.id} value={each.id}>
                  {each.id}
                </option>
              ))
            ) : (
              <option value="">No resumes available</option>
            )}
          </select>
        </div>
        <div>
          <label htmlFor="coverLetter" className="apply-label">Cover Letter:</label>
          <textarea
            id="coverLetter"
            value={coverLetter}
            onChange={handleCoverLetterChange}
            required
            className="apply-textarea"
          />
        </div>
        <button type="submit" className="apply-button">Submit Application</button>
      </form>
    </div>
  );
};

export default Apply;
