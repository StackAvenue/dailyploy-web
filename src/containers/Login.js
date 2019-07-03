import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import "../assets/css/styles.css";
import { login } from "../utils/API"

class Signin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: ""
    };
  }

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  componentDidMount = async () => {
    const token = await localStorage.getItem("token");
    if(token !== "undefined" && token !== null){
      return this.props.history.push("/user");
    }else {
      return null;
    }
  };

  login = async () => {
    if (this.emailValidity() && this.state.password) {
      const loginData = {
        email: this.state.email,
        password: this.state.password
      };
      try {
        const { data } = await login(loginData)
        localStorage.setItem("token",12345789);
        localStorage.setItem("name", data.name);
        this.props.history.push("/user");
      } catch (e) {
        console.log(e.message);
        alert("Email and password did not match");
      }
    } else {
      alert("Enter valid email address and password");
    }
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
