import React, { Component } from 'react';
import './index.css';
import Eachjob from "../Eachjob";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import Loaderr from "../Loaderr";

class JobHome extends Component {
  state = {
    jobs: [],
    isLoading: true, 
  };

  async componentDidMount() {
    const url = `${process.env.REACT_APP_Backend_url}/myjobs`;
    try {
      const token = Cookies.get('jwt_token');
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });

      if (response.ok) {
        const data = await response.json();
        const newData = data.map(each => ({
          title: each.title,
          description: each.description,
          companyName: each.company_name,
          location: each.location,
          salary: each.salary,
          createdAt: each.created_at,
          id: each.id,
        }));
        this.setState({ jobs: newData, isLoading: false });
      } else {
        console.error('Failed to fetch jobs');
        this.setState({ isLoading: false }); 
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      this.setState({ isLoading: false }); 
    }
  }

  render() {
    const { jobs, isLoading } = this.state;

    return (
      <div className='page-container'>
        <div className='details-wrapper'>
          <div className="hero-section1">
            <h1>Welcome to HRConnect</h1>
            <p>Your gateway to the best Jobs.</p>
          </div>

          <div className='hr-buttons-container'>
            <div className='half-width-section'>
              <Link to="/resumes">
                <button className='action-button'>Upload Resume</button>
              </Link>
            </div>

            <div className='half-width-section'>
              <h2>Simplified Job Search Process</h2>
              <p className='paragraph-text'>
                Our website makes job searching easier by centralizing job listings and applications. It simplifies the process with features to browse jobs, manage applications, and connect with employers all in one place.
              </p>
            </div>
          </div>
        </div>

        <div className='job-listing-container'>
          {isLoading ? (
            <Loaderr /> 
          ) : jobs.length === 0 ? (
            <h1>No Jobs Found</h1>
          ) : (
            <>
              <h1>Jobs</h1>
              <ul className='job-list'>
                {jobs.map(each => (
                  <Eachjob key={each.id} details={each} />
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    );
  }
}

export default JobHome;
