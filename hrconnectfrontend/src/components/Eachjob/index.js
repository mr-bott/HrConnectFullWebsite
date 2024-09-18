import React, { useContext } from 'react';
import './index.css';
import { HiBuildingOffice2 } from "react-icons/hi2";
import { MdDelete } from "react-icons/md";
import Hrconnect from "../../context";
import { Link} from 'react-router-dom'; 

const Eachjob = (props) => {
  const { role } = useContext(Hrconnect);
  const { deleteJobData, details } = props;

  const deletejob = (id) => {
    deleteJobData(id);
  };

  let rendercomponent;
  if (role === "job_seeker") {
    rendercomponent = (
      <Link to={`/apply/${details.id}`} className="each-job-link">
        <li className="each-job-card">
          <div className="each-job-logo">
            <HiBuildingOffice2 size={60} color='black' />
          </div>
          <div className="each-job-details-container">
            <div className="each-job-details">
              <p className="each-job-company">Company: {details.companyName}</p>
              <p className="each-job-title">{details.title}</p>
            </div>
            <div className="each-job-details">
              <p className="each-job-description">{details.description}</p>
              <p className="each-job-location">Location: {details.location}</p>
              <p className="each-job-salary">Salary: ${details.salary}</p>
            </div>
          </div>
        </li>
      </Link>
    );
  } else {
    rendercomponent = (
      <>
      <Link to={`/applications/${details.jobId}`} className="each-job-link">
        <li className="each-job-card">
          <div className="each-job-logo">
            <HiBuildingOffice2 size={60} color='black' />
          </div>
          <div className="each-job-details-container">
            <div className="each-job-details">
              <p className="each-job-company">Company: {details.companyName}</p>
              <p className="each-job-title">{details.title}</p>
            </div>
            <div className="each-job-details">
              <p className="each-job-description">{details.description}</p>
              <p className="each-job-location">Location: {details.location}</p>
              <p className="each-job-salary">Salary: ${details.salary}</p>
            </div>
           
          </div>
          <div className="each-job-logo" onClick={() => deletejob(details.jobId)}>
       <MdDelete size={40} color='black' />
     </div>
        </li>
      </Link>
      
     </>
    );
  }

  return rendercomponent;
};

export default Eachjob;
