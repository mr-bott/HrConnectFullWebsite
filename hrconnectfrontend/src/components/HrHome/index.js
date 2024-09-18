import React, { Component } from 'react';
import './index.css';
import { Link } from "react-router-dom";

class HrHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jobListings: []
    };
  }

  render() {
    return (
      <div>
        <div className="hero-section">
          <h1>Welcome to HRConnect</h1>
          <p>Your gateway to the best resources.</p>
        </div>

        <div className='hr-buttons-container'>
          <div className='half-width-section'>
            <Link to="/create_jobs">
              <button className='action-button'>Create Jobs</button>
            </Link>
          </div>

          <div className='half-width-section'>   
            <h1>Streamlined Hiring Process</h1> 
            <p>
              Our website streamlines the hiring process for HR by providing easy access to job listings and candidate applications in one place. It simplifies recruiting and enhances efficiency with features tailored to manage and track job postings and applicants.
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default HrHome;
