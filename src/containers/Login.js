import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import cookie from 'react-cookies';
import "../assets/css/styles.css";
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

  // componentDidMount = async () => {
  //   // const token = await localStorage.getItem("authToken");
  //   const token = await cookie.load('authToken');
  //   if(token !== "undefined" && token !== null){
  //     return this.props.history.push("/user");
  //   }else {
  //     return null;
  //   }
  // };

  login = async () => {
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
      <div className="card bg-light">
        <article className="card-body mx-auto" style={{ "max-width": "400px" }}>
          <h4 className="card-title mt-3 text-center">Login</h4>
          <div className="form-group input-group">
            <div className="input-group-prepend">
              <span className="input-group-text">
                {" "}
                <i className="fa fa-envelope" />{" "}
              </span>
            </div>
            <input
              name="email"
              className="form-control"
              placeholder="Email address"
              type="email"
              value={email}
              onChange={this.handleChange}
            />
          </div>
          {this.state.errors.emailError ? <p style={{color: 'red'}}>{this.state.errors.emailError}</p> : null}
          <div className="form-group input-group">
            <div className="input-group-prepend">
              <span className="input-group-text">
                {" "}
                <i className="fa fa-lock" />{" "}
              </span>
            </div>
            <input
              name="password"
              className="form-control"
              placeholder="Create password"
              type="password"
              value={password}
              onChange={this.handleChange}
            />
          </div>
          {this.state.errors.passwordError ? <p style={{color: 'red'}}>{this.state.errors.passwordError}</p> : null}
          <div className="form-group">
            <button onClick={this.login} className="btn btn-primary btn-block">
              {" "}
              Login{" "}
            </button>
          </div>
          <p className="text-center">
            Not Registered? <Link to={`/signup`}>Create Account</Link>{" "}
          </p>
        </article>
      </div>
    );
  }
}

export default withRouter(Signin);
