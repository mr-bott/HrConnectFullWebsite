import { Component } from 'react'
import Cookies from 'js-cookie'
import { Link, Navigate } from 'react-router-dom'
import Hrconnect from '../../context'
import './index.css'

class Login extends Component {
  static contextType = Hrconnect
  state = {
    username: '',
    password: '',
    showSubmitError: false,
    errorMsg: '',

  }

  onChangeUsername = event => {
    this.setState({ username: event.target.value })
  }

  onChangePassword = event => {
    this.setState({ password: event.target.value })
  }

  onSubmitSuccess = (jwtToken) => {

    Cookies.set('jwt_token', jwtToken,{
      expires: 30,
    })

  }

  onSubmitFailure = errorMsg => {
    this.setState({ showSubmitError: true, errorMsg })
  }

  submitForm = async event => {
    event.preventDefault()
    const { username, password } = this.state
    const userDetails = { username, password }
   
    const url = `${process.env.REACT_APP_Backend_url}/login`
   
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      this.context.setrole(data.role)
      this.onSubmitSuccess(data.jwtToken)
    } else {
   
      this.onSubmitFailure(data.error)
    }
  }

  renderPasswordField = () => {
    const { password } = this.state

    return (
      <>
        <label className="input-label" htmlFor="password">
          PASSWORD
        </label>
        <input
          type="password"
          id="password"
          className="password-input-field"
          value={password}
          onChange={this.onChangePassword}
          placeholder="Password"
        />
      </>
    )
  }

  renderUsernameField = () => {
    const { username } = this.state

    return (
      <>
        <label className="input-label" htmlFor="username">
          USERNAME
        </label>
        <input
          type="text"
          id="username"
          className="username-input-field"
          value={username}
          onChange={this.onChangeUsername}
          placeholder="Username"
        />
      </>
    )
  }

  render() {
    const { showSubmitError, errorMsg } = this.state
    const jwtToken = Cookies.get('jwt_token')
  
    if (jwtToken !== undefined) {
       return <Navigate to="/" />
    }

    return (

      <Hrconnect.Consumer>

        {value => {
          return (
            <div className="login-form-container">

              <form className="form-container" onSubmit={this.submitForm}>

                <div className="input-container">{this.renderUsernameField()}</div>
                <div className="input-container">{this.renderPasswordField()}</div>
                <button type="submit" className="login-button">
                  Login
                </button>
                {showSubmitError && <p className="error-message">*{errorMsg}</p>}

                <p>Dont have acoount create now! 
                  <Link to="/signup">
                       Signup
                  </Link>

                </p>

              </form>
     
          

            </div>
          )
        }}
      </Hrconnect.Consumer>

    )
  }
}

export default Login