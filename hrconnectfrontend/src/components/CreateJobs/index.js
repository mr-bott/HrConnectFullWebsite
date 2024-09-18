import React, { Component } from 'react';
import './index.css';
import Cookies from "js-cookie";
import { jwtDecode } from 'jwt-decode';
import Eachjob from "../Eachjob";
import { Navigate } from "react-router-dom"
import Loaderr from "../Loaderr"

class CreateJobs extends Component {
  state = {
    id: 0,
    title: '',
    description: '',
    location: '',
    salary: '',
    companyName: '',
    loading: false,
    error: null,
    success: null,
    jobs: [],
    apiStatus: true,
  };

  deleteJobData = async (id) => {
    try {
      const { jobs } = this.state;
      const token = Cookies.get('jwt_token');
      const url = `${process.env.REACT_APP_Backend_url}/myjobs/${id}`;
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const filteredJobs = jobs.filter(each => each.jobId !== id);
        this.setState({ jobs: filteredJobs });
        return <Navigate to="/create_jobs" />
      } else {
        console.error("Failed to delete job data");
      }
    } catch (error) {
      console.error("Error deleting job data", error);
    }
  };

  async componentDidMount() {
    const token = Cookies.get('jwt_token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.loggedid;

        this.setState({ id: userId });
        const url = `${process.env.REACT_APP_Backend_url}/myjobs/${userId}`;
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          const jobData = data.map(each => ({
            title: each.title,
            description: each.description,
            companyName: each.company_name,
            location: each.location,
            salary: each.salary,
            createdAt: each.created_at,
            jobId: each.id,
          }));
          this.setState({ jobs: jobData, apiStatus: false });
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error decoding token or fetching user data", error);
      }
    }
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const { title, description, location, salary, companyName, id } = this.state;
    const recruiter_id = id;
    this.setState({ loading: true, error: null, success: null });

    try {
      const token = Cookies.get('jwt_token');
      const response = await fetch(`${process.env.REACT_APP_Backend_url}/myjobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, description, location, salary, companyName, recruiter_id }),
      });

      if (response.ok) {
        this.setState({ success: 'Job created successfully!', loading: false });
        this.setState({
          title: '',
          description: '',
          location: '',
          salary: '',
          companyName: '',
        });
        this.componentDidMount();
      } else {
        const errorData = await response.json();
        this.setState({ error: errorData.error || 'Failed to create job', loading: false });
      }
    } catch (error) {
      this.setState({ error: 'Error creating job', loading: false });
    }
  };

  render() {
    const { title, description, location, salary, companyName, loading, error, success, jobs,apiStatus } = this.state;

    return (
      <div className='create-jobs-container'>
        <div className="job-form-container">
          <h1 className="form-title">Create Job</h1>
          <form onSubmit={this.handleSubmit} className="job-form">
            <div className="form-group">
              <label htmlFor="title">Job Title:</label>
              <input
                type="text"
                id="title"
                name="title"
                value={title}
                onChange={this.handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description:</label>
              <textarea
                id="description"
                name="description"
                value={description}
                onChange={this.handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="location">Location:</label>
              <input
                type="text"
                id="location"
                name="location"
                value={location}
                onChange={this.handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="salary">Salary:</label>
              <input
                type="number"
                id="salary"
                name="salary"
                value={salary}
                onChange={this.handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="companyName">Company:</label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={companyName}
                onChange={this.handleChange}
                required
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Job'}
            </button>
          </form>
          {error && <p className="form-error">{error}</p>}
          {success && <p className="form-success">{success}</p>}
        </div>

        <div className='jobs-list-container'>

          {apiStatus?(<Loaderr/>):(<>
          
            {jobs.length === 0 ? (
            <h1>No Jobs Created</h1>
          ) : (
            <>
              <h1>Created Jobs</h1>

              {apiStatus ? (<Loaderr />) : 
              
              (<ul className='jobs-list'>
                {jobs.map(each => (
                  <Eachjob key={each.jobId} details={each} deleteJobData={this.deleteJobData} />
                ))}
              </ul>)}

            </>
          )}
          
          </>)}
          
        </div>
      </div>
    );
  }
}

export default CreateJobs;
