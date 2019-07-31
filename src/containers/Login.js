import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import cookie from "react-cookies";
import { login } from "../utils/API";
import { validateEmail } from "../utils/validation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../components/Landing/Header";
import signup from "../assets/images/signup.jpg";
import googleIcon from "../assets/images/google.png";

class Signin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      errors: {
        emailError: null,
        passwordError: null
      }
    };
  }

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  componentDidMount() {
    const token = cookie.load("accessToken");
    if (token !== "undefined" && token !== null) {
      return this.props.history.push("/login");
    } else {
      return null;
    }
  }

  login = async () => {
    this.validateAllInputs();
    if (this.emailValidity() && this.state.password) {
      const loginData = {
        email: this.state.email,
        password: this.state.password
      };
      try {
        const { data } = await login(loginData);
        toast.success("Sucessfully Logged In");
        cookie.save("accessToken", data.access_token, { path: "/" });
        cookie.save("refreshToken", "adehbfjjnmmhdnmf", { path: "/" });
        this.props.history.push("/dashboard");
      } catch (e) {
        console.log("error", e.response.data.error);
        toast.error(e.response.data.error);
      }
    } else {
      return "Enter valid email address and password";
    }
  };
  validateAllInputs = () => {
    const errors = {
      passwordError: null
    };
    errors.emailError = validateEmail(this.state.email);
    this.setState({ errors });
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
    const isEnabled = this.emailValidity() && this.state.password;
    return (
      <>
        <ToastContainer position={toast.POSITION.TOP_RIGHT} />
        <div className="container-fluid">
          <div className="main-container">
            <Header />
            <div className="row no-margin signup signup-container">
              <div className="col-md-6 no-padding width">
                <img
                  src={signup}
                  alt="signup"
                  className="img-responsive image"
                />
              </div>
              <div className="col-md-5 sub-container">
                <div className="col-md-12 heading">Sign In</div>
                <div className="col-md-10 offset-1 no-padding signup-form text-left">
                  <div class="form-group">
                    <label>Email</label>
                    {this.state.errors.emailError ? (
                      <span className="error-warning">
                        {this.state.errors.emailError}
                      </span>
                    ) : null}
                    <input
                      type="email"
                      name="email"
                      value={email}
                      onChange={this.handleChange}
                      className="form-control login-form-field"
                      placeholder="johndoe1234@amazon.com"
                    />
                  </div>
                  <div class="form-group">
                    <label>Password</label>
                    {this.state.errors.passwordError ? (
                      <span className="error-warning">
                        {this.state.errors.passwordError}
                      </span>
                    ) : null}
                    <input
                      type="password"
                      name="password"
                      value={password}
                      onChange={this.handleChange}
                      className="form-control login-form-field"
                      placeholder="Password"
                    />
                  </div>
                  <br />
                  <div className="col-md-12 no-padding text-center">
                    <button
                      disabled={!isEnabled}
                      onClick={this.login}
                      className="btn form-btn"
                    >
                      Sign In
                    </button>
                  </div>
                </div>
                <br />
                <div className="col-md-8 offset-2 googleIcon">
                  <img
                    alt="Google Icon"
                    src={googleIcon}
                    className="img-responsive"
                  />
                  <Link className="link">Sign In with Google</Link>
                </div>
                <br />
                <br />
                <br />
                <div className="col-md-8 offset-2 googleIcon">
                  <span>New to DailyPloy?</span>
                  <Link to={`/signup`} className="link">
                    Sign Up
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default withRouter(Signin);
