import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import cookie from 'react-cookies';
import "../assets/css/login.css";
import { login } from "../utils/API"
import { checkPassword, validateEmail } from "../utils/validation";

class Signin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      errors:{
        emailError:null,
        passwordError:null
      }
    }; 
  }

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  componentDidMount = async () => {
    // const token = await localStorage.getItem("authToken");
    const token = await cookie.load('authToken');
    if(token !== "undefined" && token !== null){
      return this.props.history.push("/login");
    }else {
      return null;
    }
  };

  login = async () => {
    console.log("enter")
    this.validateAllInputs();
    if (this.emailValidity() && this.state.password) {
      const loginData = {
        email: this.state.email,
        password: this.state.password
      };
      try {
        const { data } = await login(loginData)
        console.log(data);
        // localStorage.setItem("authToken",data.auth_token);
        // localStorage.setItem("refreshToken", data.refresh_token);
        cookie.save('authToken', data.auth_token, { path: '/' });
        cookie.save('refreshToken', data.refresh_token, { path: '/' });
        this.props.history.push("/user");
      } catch (e) {
        return "Email and password did not match";
      }
    } else {
      return "Enter valid email address and password";
    }
  };
  validateAllInputs = () => {
    const errors = {
        emailError: null,
        passwordError: null
    };
    errors.passwordError = checkPassword(this.state.password);
    errors.emailError = validateEmail(this.state.email);
    this.setState({errors});
  };

  emailValidity = () => {
    return (
      this.state.email &&
      this.state.email.includes("@") &&
      this.state.email.includes(".") 
    );
  };

  render() {
    const { email, password } = this.state;
    return (
      <div className="container-fluid">
        <div className="row login-container">
          <div className="col-md-6 login-vertical-border">
            <div className="col-md-12 login-product-heading">DailyPloy</div>
            <div className="col-md-12 login-product-text">It is a long established fact that reader will be distracted by the readable content of a page when looking at its layout</div>
            <div className="col-md-12 text-center">
              <button type="button" className="btn btn-outline-secondary login-product-btn">GET STARTED</button>
            </div>
          </div>
          <div className="col-md-6 login-vertical-border2">
            <div className="col-md-12 login-heading">SignIn</div>
            <div className="col-md-12 text-center login-auth-margin">
              <div className="col-md-4 d-inline">
                <button type="button" class="btn btn-secondary login-auth-btn"></button>
              </div>
              <div className="col-md-4 d-inline">
                <button type="button" class="btn btn-secondary login-auth-btn"></button>
              </div>
              <div className="col-md-4 d-inline">
                <button type="button" class="btn btn-secondary login-auth-btn"></button>
              </div>
            </div>
            <div className="col-md-12 text-center">OR</div><br />
            <div className="col-md-10 offset-1">
              <div class="form-group">
                <input type="email" name="email" value={email} onChange={this.handleChange} className="form-control login-form-field" placeholder="Enter email" />
              </div>
              {this.state.errors.emailError ? <p style={{color: 'red'}}>{this.state.errors.emailError}</p> : null}
              <div class="form-group">
                <input type="password" name="password" value={password} onChange={this.handleChange} className="form-control login-form-field" placeholder="Password" />
              </div>
            {this.state.errors.passwordError ? <p style={{color: 'red'}}>{this.state.errors.passwordError}</p> : null}
            </div>
            <div className="col-md-10 offset-1 text-right">Forgot Password?</div>
            <br />
            <div className="col-md-12 text-center">
              <button onClick={this.login} className="btn btn-outline-secondary login-btn">Login</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Signin);
