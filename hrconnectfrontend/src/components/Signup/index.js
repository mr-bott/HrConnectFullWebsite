
import { Component } from 'react';
import Cookies from 'js-cookie';
import { Navigate, Link } from 'react-router-dom';
import Hrconnect from '../../context';
import './index.css';

class Signup extends Component {
  static contextType = Hrconnect;

  state = {
    username: '',
    password: '',
    role: 'job_seeker',
    name: '',
    email: '',
    showSubmitError: false,
    errorMsg: '',
    isHr: false,
    success:false,
  };

  onChangeUsername = event => {
    this.setState({ username: event.target.value });
  };

  onChangePassword = event => {
    this.setState({ password: event.target.value });
  };

  onChangeRole = event => {
    this.setState({ role: event.target.value });
  };

  onChangeName = event => {
    this.setState({ name: event.target.value });
  };

  onChangeemail = event => {
    this.setState({ email: event.target.value });
  };

  onSubmitSuccess = (msg) => {
    this.setState({success:true})
  };

  onSubmitFailure = errorMsg => {
    this.setState({ showSubmitError: true, errorMsg });
  };

  submitForm = async event => {
    event.preventDefault();
    
    const { username, password, role, name, email, isHr } = this.state;
    const userDetails = isHr
      ? { username, password, role, name, email }
      : { username, password, name, email };

    const url = isHr
      ? `${process.env.REACT_APP_Backend_url}/signup/recruiter`
      : `${process.env.REACT_APP_Backend_url}/signup`;
    
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userDetails),
    };
    const response = await fetch(url, options);
    const data = await response.json();
    if (response.ok === true) {
      this.onSubmitSuccess(data.message);
    } else {
      this.onSubmitFailure(data.error);
    }
  };

  renderPasswordField = () => {
    const { password } = this.state;

    return (
      <>
        <label className="input-label" htmlFor="password">
          PASSWORD
        </label>
        <input
          type="password"
          id="password"
          className="input-field"
          value={password}
          onChange={this.onChangePassword}
          placeholder="Password"
        />
      </>
    );
  };

  renderUsernameField = () => {
    const { username } = this.state;

    return (
      <>
        <label className="input-label" htmlFor="username">
          USERNAME
        </label>
        <input
          type="text"
          id="username"
          className="input-field"
          value={username}
          onChange={this.onChangeUsername}
          placeholder="Username"
        />
      </>
    );
  };

  renderRoleField = () => {
    const { role } = this.state;

    return (
      <>
        <label className="input-label" htmlFor="role">
          ROLE
        </label>
       <select 
       className='role-input-field'
       id="role"
       value={role}
       onChange={this.onChangeRole}
       >
        <option value="recruiter">Recruiter</option>
       </select>
      </>
    );
  };

  renderNameField = () => {
    const { name } = this.state;

    return (
      <>
        <label className="input-label" htmlFor="name">
          NAME
        </label>
        <input
          type="text"
          id="name"
          className="input-field"
          value={name}
          onChange={this.onChangeName}
          placeholder="Name"
        />
      </>
    );
  };

  renderemailField = () => {
    const { email } = this.state;

    return (
      <>
        <label className="input-label" htmlFor="email">
          EMAIL
        </label>
        <input
          type="email"
          id="email"
          className="input-field"
          value={email}
          onChange={this.onChangeemail}
          placeholder="Email"
        />
      </>
    );
  };

  tosethr = () => {
    this.setState({ isHr: true });
  }

  tosetjobseeker = () => {
    this.setState({ isHr: false });
  }

  render() {
    const { showSubmitError, errorMsg, isHr, success } = this.state
    const jwt = Cookies.get("jwt_token")

    if (success|| jwt!==undefined) {
      return <Navigate to="/login" />
    }
  
    return (
      <div className="login-form-container">
        <form className="form-container" onSubmit={this.submitForm}>
          <hr className='hrline' />
          <div className='button-container'>
            <button type="button" className="select-button" onClick={this.tosetjobseeker}>Job Seeker</button>
            <button type="button" className="select-button" onClick={this.tosethr}>Recruiter</button>
          </div>
          {isHr ? (
            <>
              <div className="input-container">{this.renderNameField()}</div>
              <div className="input-container">{this.renderUsernameField()}</div>
              <div className="input-container">{this.renderPasswordField()}</div>
              <div className="input-container">{this.renderemailField()}</div>
              <div className="input-container">{this.renderRoleField()}</div>
            </>
          ) : (
            <>
              <div className="input-container">{this.renderNameField()}</div>
              <div className="input-container">{this.renderUsernameField()}</div>
              <div className="input-container">{this.renderPasswordField()}</div>
              <div className="input-container">{this.renderemailField()}</div>
            </>
          )}
          <button type="submit" className="login-button">
            Signup
          </button>
          {showSubmitError && <p className="error-message">*{errorMsg}</p>}
          <p>
            Already have an account!{' '}
            <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    );
  }
}

export default Signup;
