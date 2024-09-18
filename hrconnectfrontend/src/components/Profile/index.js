
import React, { Component } from 'react';
import { FaUserCircle } from "react-icons/fa";
import './index.css'; 
import Cookie from 'js-cookie'; 
import { jwtDecode } from 'jwt-decode'; 
import Loaderr from '../Loaderr'; 

class Profile extends Component {
  state = {
    user: {},
    loading: true,
    error: null,
  };

  async componentDidMount() {
    const token = Cookie.get('jwt_token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.loggedid;

        const url = `${process.env.REACT_APP_Backend_url}/users/${userId}`;
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          this.setState({ user: data.details[0], loading: false });
        } else {
          this.setState({ error: 'Failed to fetch user data', loading: false });
        }
      } catch (error) {
        this.setState({ error: 'Error decoding token or fetching user data', loading: false });
        console.error("Error decoding token or fetching user data", error);
      }
    } else {
      this.setState({ error: 'No token found', loading: false });
    }
  }

  render() {
    const { user, loading, error } = this.state;

    if (loading) return <Loaderr />; 
    if (error) return <p>{error}</p>;

    return (
      <div className='pro-container'>
        <div className="profile-card">
          <div className='profile-picture-container'>
            <FaUserCircle size={100} color='black' />
          </div>
          <h1 className="profile-header">User Profile</h1>
          <div className="profile-info">
            <div className="profile-item">
              <span className="profile-label">Id:</span>
              <span className="profile-value">{user.id}</span>
            </div>
            <div className="profile-item">
              <span className="profile-label">Name:</span>
              <span className="profile-value">{user.name}</span>
            </div>
            <div className="profile-item">
              <span className="profile-label">Email:</span>
              <span className="profile-value">{user.email}</span>
            </div>
            <div className="profile-item">
              <span className="profile-label">Username:</span>
              <span className="profile-value">{user.username}</span>
            </div>
            <div className="profile-item">
              <span className="profile-label">Role:</span>
              <span className="profile-value">{user.role}</span>
            </div>
            <div className="profile-item">
              <span className="profile-label">Created:</span>
              <span className="profile-value">{user.created_at}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Profile;

