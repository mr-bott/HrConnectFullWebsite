
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './index.css';
import { FaUserCircle } from "react-icons/fa";
import Cookies from 'js-cookie';
import Loaderr from '../Loaderr'; 

const Applications = () => {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = Cookies.get('jwt_token');
        const response = await fetch(`${process.env.REACT_APP_Backend_url}/applications/${jobId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setApplications(data);
        } else {
          console.error('Failed to fetch applications');
        }
      } catch (error) {
        console.error('Error fetching applications:', error);
      } finally {
        setIsLoading(false); 
      }
    };

    fetchApplications();
  }, [jobId]);

  const downloadResume = (fileData, filename = 'resume.pdf') => {
    const blob = new Blob([new Uint8Array(fileData.data)], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  return (
    <div className="applications-container">
      <h1 className="applications-heading">Applications for Job ID: {jobId}</h1>

      {isLoading ? ( // Use Loaderr component while loading
        <Loaderr />
      ) : applications.length >= 1 ? (
        <ul className="applications-list">
          {applications.map(each => (
            <li key={each.application_id} className="application-item">
              <div className="application-details">
                <div className='profile-section'>
                  <FaUserCircle size={100} color='black' />
                  <div className='user-info'>
                    <p className='paragraph'><strong>Application ID:</strong> {each.application_id}</p>
                    <p className='paragraph'><strong>User Name:</strong> {each.user_name}</p>
                    <p className='paragraph'><strong>User Email:</strong> {each.user_email}</p>
                  </div>
                </div>
                <p className='paragraph'><strong>Cover Letter:</strong> {each.cover_letter}</p>
                <p className='paragraph'><strong>Applied At:</strong> {new Date(each.applied_at).toLocaleString()}</p>
                <div className='download-button-container'>
                  <button
                    onClick={() => downloadResume(each.file_data, `resume_${each.user_name}.pdf`)}
                    className="download-button"
                  >
                    Download Resume
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className='paragraph'>No Applications</p>
      )}
    </div>
  );
};

export default Applications;
