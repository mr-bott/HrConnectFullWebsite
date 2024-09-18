import React from 'react';
import { MdConnectWithoutContact } from "react-icons/md";
import { FaRegUserCircle } from "react-icons/fa";
import { Link } from 'react-router-dom';
import './index.css';
import Cookies from "js-cookie";
import Hrconnect from '../../context';

const Header = () => {

  const removeToken = () => {
    
    Cookies.remove('jwt_token');
    Cookies.remove("rolee");
  };

  return (
    <Hrconnect.Consumer>
      {value => {
        const { role } = value;
        return (
          <header className="header-container">
            <div className="header-logo">
              <MdConnectWithoutContact size={40} color="white" />
            </div>
            <nav className="nav-links-container">
              <Link to="/">Home</Link>
              {role === "job_seeker" ? (
                <>
                  <Link to="/resumes">Resumes</Link>
                </>
              ) : (
                <>
                  <Link to="/create_jobs">Create Job</Link>
                </>
              )}
              <Link to="/login" onClick={removeToken}>Logout</Link>
              <Link to="/profile">
                <FaRegUserCircle size={30} color="white" />
              </Link>
            </nav>
          </header>
        );
      }}
    </Hrconnect.Consumer>
  );
};

export default Header;
