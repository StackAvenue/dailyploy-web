import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import "../assets/css/styles.css";
import axios from "axios"

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
    this.setState({ [name]: value },console.log(this.state));
  };

  signup = async () => {
    if (this.validityCheck()) {
      const headers = {
        "Content-Type": "application/json"
      };
      const signupData = {
        name: this.state.name,
        email: this.state.email,
        password: this.state.password
      };
      try {
        const { data } = await axios.post(
          "https://5d1b281edd81710014e88430.mockapi.io/post",
          signupData,
          { headers }
        );
        localStorage.setItem("token", "12345789");
        localStorage.setItem("name", data.name);
        alert("user created");
        this.props.history.push("/");
      } catch (e) {
        console.log(e.message);
        alert("User could not be created");
      }
    } else {
      alert("Enter valid email address and password");
    }
    // console.log("run")
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
      this.checkPassword(this.state.password)
    );
  };

  checkPassword = str => {
    var re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return re.test(str);
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
