import {Component} from 'react'
import Cookies from 'js-cookie'
import {Navigate} from 'react-router-dom'

import './index.css'
import withRouter from '../WithRouter'

class Login extends Component {
  state = {
    username: '',
    password: '',
    showSubmitError: false,
    errorMsg: '',
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onSubmitSuccess = jwtToken => {
    Cookies.set('jwt_token', jwtToken, {
      expires: 30,
      path: '/',
    })
    return <Navigate to="/" replace />
  }

  onSubmitFailure = errorMsg => {
    this.setState({showSubmitError: true, errorMsg})
    
  }

  submitForm = async event => {
    event.preventDefault()
    this.setState({showSubmitError:false})
    const {username, password} = this.state
    if (username==="" || password===""){
        return this.setState({showSubmitError:true,errorMsg:"username and password are not empty"})
    }
    const userDetails = {username, password}
    const url = '/api/login'
    const options = {
      method: 'POST',
      headers : {
        "Content-Type" : "application/json"
      },
      body: JSON.stringify(userDetails)
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  renderPasswordField = () => {
    const {password} = this.state
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
    const {username} = this.state
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
    const {showSubmitError, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Navigate to="/" />
    }
    if (errorMsg==="user is not register"){
        return <Navigate to="/register" replace/>
    }
    return (
      <div className="login-form-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-logo-img.png"
          className="login-website-logo-mobile-image"
          alt="website logo"
        />
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-login-img.png"
          className="login-image"
          alt="website login"
        />
        <div>
          <form className="form-container" onSubmit={this.submitForm}>
            <img
              src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-logo-img.png"
              className="login-website-logo-desktop-image"
              alt="website logo"
            />
            <div className="input-container">{this.renderUsernameField()}</div>
            <div className="input-container">{this.renderPasswordField()}</div>
            <button type="submit" className="login-button">
              Login
            </button>
            {showSubmitError && <p className="error-message">*{errorMsg}</p>}
          </form>
          <button type="button" className="user-credentials">
            Demo Credentials
          </button>
          <p className="user-name">username : chintu</p>
          <p className="password">password : chintu@123</p>
        </div>
      </div>
    )
  }
}

const loginWithRouter = withRouter(Login)

export default loginWithRouter
