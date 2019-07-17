import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import "../assets/css/styles.css";
import "../assets/css/login.css";
import { signUp } from "../utils/API";
import {
  checkPassword,
  validateName,
  validateEmail
} from "../utils/validation";

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      errors: {
        nameError: null,
        emailError: null,
        passwordError: null,
        confirmPasswordError: null
      }
    };
  }

  changeHandler = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  signupForm = async () => {
    this.validateAllInputs();
    if (this.validityCheck()) {
      const signupData = {
        user: {
          name: this.state.name,
          email: this.state.email,
          password: this.state.password,
          password_confirmation: this.state.confirmPassword
        }
      };
      try {
        const { data } = await signUp(signupData);
        alert("user created");
        this.props.history.push("/login");
      } catch (e) {
        return "User could not be created";
      }
    } else {
      return "Enter valid email address and password";
    }
  };

  validatePassword = (password, confirmPassword) => {
    if (password === confirmPassword) {
      return;
    }
    return "Those password didn't match, Try Again.";
  };

  validateAllInputs = () => {
    const errors = {
      nameError: null,
      emailError: null,
      passwordError: null,
      confirmPasswordError: null
    };
    errors.nameError = validateName(this.state.name);
    errors.passwordError = checkPassword(this.state.password);
    errors.emailError = validateEmail(this.state.email);
    errors.confirmPasswordError = this.validatePassword(
      this.state.password,
      this.state.confirmPassword
    );
    this.setState({ errors });
  };

  validityCheck = () => {
    return (
      this.state.name &&
      this.state.email &&
      this.state.password &&
      this.state.confirmPassword &&
      this.state.password === this.state.confirmPassword
    );
  };

  render() {
    const { name, email, password, confirmPassword } = this.state;
    const isEnabled = this.validityCheck();

    return (
      <div className="container-fluid">
        <div className="row login-container">
          <div className="col-md-6 login-vertical-border">
            <div className="col-md-12 login-product-heading">DailyPloy</div>
            <div className="col-md-12 login-product-text">
              It is a long established fact that reader will be distracted by
              the readable content of a page when looking at its layout
            </div>
            <div className="col-md-12 text-center">
              Already User? <Link to={`/login`}>Sign In</Link>
            </div>
          </div>
          <div className="col-md-6 login-vertical-border2">
            <div className="col-md-12 login-heading">Welcome!</div>
            <br />
            <div className="col-md-10 offset-1">
              <div class="form-group">
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={this.changeHandler}
                  className="form-control login-form-field"
                  placeholder="Username"
                />
              </div>
              {this.state.errors.nameError ? (
                <p style={{ color: "red" }}>{this.state.errors.nameError}</p>
              ) : null}
              <div class="form-group">
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={this.changeHandler}
                  className="form-control login-form-field"
                  placeholder="Email Id"
                />
              </div>
              {this.state.errors.emailError ? (
                <p style={{ color: "red" }}>{this.state.errors.emailError}</p>
              ) : null}
              <div class="form-group">
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={this.changeHandler}
                  className="form-control login-form-field"
                  placeholder="Password"
                />
              </div>
              {this.state.errors.passwordError ? (
                <p style={{ color: "red" }}>
                  {this.state.errors.passwordError}
                </p>
              ) : null}
              <div class="form-group">
                <input
                  type="password"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={this.changeHandler}
                  className="form-control login-form-field"
                  placeholder="Confirm Password"
                />
              </div>
              {this.state.errors.confirmPasswordError ? (
                <p style={{ color: "red" }}>
                  {this.state.errors.confirmPasswordError}
                </p>
              ) : null}
            </div>
            <br />
            <div className="col-md-12 text-center">
              <button
                disabled={!isEnabled}
                onClick={this.signupForm}
                className="btn btn-outline-secondary login-btn"
              >
                Signup
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Signup);
