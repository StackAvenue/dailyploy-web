import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import "../assets/css/styles.css";
import { signUp } from "../utils/API";
import { checkPassword } from "../utils/validation";

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name:"",  
      email: "",
      password: "",
      confirmPassword: ""
    };
  }

  changeHandler = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  signup = async () => {
    if (this.validityCheck()) {
      const signupData = {
        name: this.state.name,
        email: this.state.email,
        password: this.state.password
      };
      try {
        const { data } = await signUp(signupData);
        alert("user created");
        this.props.history.push("/");
      } catch (e) {
        alert("User could not be created");
      }
    } else {
      alert("Enter valid email address and password");
    }
  };

  validityCheck = () => {
    return (
      this.state.name &&
      this.state.email &&
      this.state.email.includes("@") &&
      this.state.email.includes(".") &&
      this.state.password &&
      this.state.confirmPassword &&
      this.state.password === this.state.confirmPassword &&
      checkPassword(this.state.password)
    );
  };

  render() {
    const { name, email, password, confirmPassword } = this.state;

    return (
      <div className="card bg-light">
        <article className="card-body mx-auto" style={{ "max-width": "400px" }}>
          <h4 className="card-title mt-3 text-center">Create Account</h4>
          <div className="form-group input-group">
            <div className="input-group-prepend">
              <span className="input-group-text">
                {" "}
                <i className="fa fa-envelope" />{" "}
              </span>
            </div>
            <input
              name="name"
              className="form-control"
              placeholder="Full Name"
              type="text"
              value={name}
              onChange={this.changeHandler}
            />
          </div>
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
              onChange={this.changeHandler}
            />
          </div>
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
              onChange={this.changeHandler}
            />
          </div>
          <div className="form-group input-group">
            <div className="input-group-prepend">
              <span className="input-group-text">
                {" "}
                <i className="fa fa-lock" />{" "}
              </span>
            </div>
            <input
              name="confirmPassword"
              className="form-control"
              placeholder="Confirm password"
              type="password"
              value={confirmPassword}
              onChange={this.changeHandler}
            />
          </div>
          <div className="form-group">
            <button onClick={this.signup} className="btn btn-primary btn-block">
              {" "}
              Create Account{" "}
            </button>
          </div>
          <p className="text-center">
            Have an account? <Link to={`/`}>Log In</Link>{" "}
          </p>
        </article>
      </div>
    );
  }
}

export default withRouter(Signup);
