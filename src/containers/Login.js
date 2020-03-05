import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import cookie from "react-cookies";
import {
  login,
  get,
  forgotPassword,
  googleSignin,
  googleSignup
} from "../utils/API";
import { validateEmail } from "../utils/validation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../components/Landing/Header";
import signup from "../assets/images/landing.jpg";
import googleIcon from "../assets/images/google.png";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import axios from "axios";
import "../assets/css/login.scss";
import { GOOGLE_CLIENT_ID } from "../utils/Constants";
import GoogleLogin from "react-google-login";
import DailyPloyToast from "./../../src/components/DailyPloyToast";

class Signin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      errors: {
        emailError: null,
        passwordError: null
      },
      error: "",
      resetSusses: "",
      isLoading: false,
      loadingReset: false,
      isLogin: true
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

  login = async e => {
    e.preventDefault();
    this.validateAllInputs();
    if (this.isPresentAllInputs()) {
      const loginData = {
        email: this.state.email,
        password: this.state.password
      };
      this.setState({ isLoading: true });
      try {
        const { data } = await login(loginData);
        cookie.save("accessToken", data.access_token, { path: "/" });
        cookie.save("refreshToken", "adehbfjjnmmhdnmf", { path: "/" });
        axios.defaults.headers.common["Authorization"] = data.access_token
          ? `Bearer ${data.access_token}`
          : "";
        try {
          const { data } = await get("workspaces");
          const workspace = data.workspaces[0];
          cookie.save("workspaceId", workspace.id, { path: "/" });
          if (workspace && workspace.type === "company") {
            cookie.save("workspaceName", workspace.company.name, { path: "/" });
          } else {
            cookie.save("workspaceName", workspace.name, {
              path: "/"
            });
          }
          try {
            const { data } = await get("logged_in_user");
            cookie.save("loggedInUser", data);
          } catch (e) {
            console.log("err", e);
          }
          this.setState({ isLoading: false });
          this.props.history.push(`/workspace/${workspace.id}/dashboard`);
        } catch (e) {
          console.log("error", e);
        }
      } catch (e) {
        this.setState({
          error: "Invalid Email or Password!",
          isLoading: false,
          resetSusses: ""
        });
      }
    }
  };

  toggleResetPassword = () => {
    this.setState({ isLogin: !this.state.isLogin });
  };

  resetPassword = async e => {
    e.preventDefault();
    this.validateAllInputs();
    if (this.state.email != "") {
      const forgotData = {
        email: this.state.email
      };
      this.setState({ loadingReset: true });
      try {
        const { data } = await forgotPassword(forgotData);
        if (data.mail_sent) {
          this.setState({
            resetSusses: "We have e-mailed your password to reset",
            error: "",
            loadingReset: false,
            isLogin: true
          });
        }
        this.setState({ loadingReset: false });
      } catch (e) {
        this.setState({
          error: "We Could Not Find Your Email Address",
          loadingReset: false
        });
      }
    }
  };

  validateAllInputs = () => {
    const errors = {
      passwordError: null
    };
    errors.emailError = validateEmail(this.state.email);
    this.setState({ errors });
  };

  isPresentAllInputs = () => {
    return this.state.email && this.state.password;
  };

  errorGoogle = error => {
    console.log(error);
  };

  responseGoogle = response => {
    this.signupOAuth(response, "google");
  };

  signupOAuth = async (resp, type) => {
    let signupOAuthData;
    let loginSignupData;
    if (type === "google" && resp && resp.profileObj) {
      signupOAuthData = {
        email: resp.profileObj.email,
        provider_id: resp.googleId
      };
      loginSignupData = {
        user: {
          name: resp.profileObj.name,
          email: resp.profileObj.email,
          provider: type,
          provider_id: resp.googleId,
          provider_img: resp.profileObj.imageUrl
        }
      };
    }
    this.setState({ isLoading: true });
    try {
      const { data } = await googleSignin(signupOAuthData);
      cookie.save("accessToken", data.access_token, { path: "/" });
      cookie.save("refreshToken", "adehbfjjnmmhdnmf", { path: "/" });
      axios.defaults.headers.common["Authorization"] = data.access_token
        ? `Bearer ${data.access_token}`
        : "";
      try {
        const { data } = await get("workspaces");
        const workspace = data.workspaces[0];
        cookie.save("workspaceId", workspace.id, { path: "/" });
        if (workspace && workspace.type === "company") {
          cookie.save("workspaceName", workspace.company.name, { path: "/" });
        } else {
          cookie.save("workspaceName", workspace.name, {
            path: "/"
          });
        }
        try {
          const { data } = await get("logged_in_user");
          cookie.save("loggedInUser", data);
        } catch (e) {
          console.log("err", e);
        }
        this.setState({ isLoading: false });
        this.props.history.push(`/workspace/${workspace.id}/dashboard`);
      } catch (e) {
        console.log("error", e);
      }
    } catch (e) {
      if (e.response.status === 400) {
        this.loginSignup(loginSignupData);
      } else {
        this.setState({
          error: "Invalid Email or Password!",
          isLoading: false,
          resetSusses: ""
        });
      }
    }
  };

  loginSignup = async loginSignupData => {
    try {
      const { data } = await googleSignup(loginSignupData);
      this.directLoginGoogle(data.user);
      this.setState({ isLoading: false });
    } catch (e) {
      this.setState({ isLoading: false });
      if (e.response.status === 500) {
        toast(
          <DailyPloyToast message={"Internal Server Error"} status="error" />,
          { autoClose: 2000 }
        );
      } else if (e.response.data.errors.email) {
        toast(
          <DailyPloyToast
            message={"email " + `${e.response.data.errors.email}`}
            status="error"
          />,
          { autoClose: 2000 }
        );
      } else if (e.response.data.errors.detail) {
        toast(
          <DailyPloyToast
            message={"email " + `${e.response.data.errors.detail}`}
            status="error"
          />,
          { autoClose: 2000 }
        );
      }
    }
  };

  directLoginGoogle = async data => {
    try {
      cookie.save("accessToken", data.access_token, { path: "/" });
      cookie.save("refreshToken", "adehbfjjnmmhdnmf", { path: "/" });
      axios.defaults.headers.common["Authorization"] = data.access_token
        ? `Bearer ${data.access_token}`
        : "";
      try {
        const { data } = await get("workspaces");
        const workspace = data.workspaces[0];
        cookie.save("workspaceId", workspace.id, { path: "/" });
        if (workspace && workspace.type === "company") {
          cookie.save("workspaceName", workspace.company.name, { path: "/" });
        } else {
          cookie.save("workspaceName", workspace.name, {
            path: "/"
          });
        }
        try {
          const { data } = await get("logged_in_user");
          cookie.save("loggedInUser", data);
        } catch (e) {
          console.log("err", e);
        }
        this.setState({ isLoading: false });
        this.props.history.push(`/workspace/${workspace.id}/dashboard`);
      } catch (e) {
        console.log("error", e);
      }
    } catch (e) {
      this.setState({ error: e.response.data.error, isLoading: false });
    }
  };

  render() {
    const { email, password } = this.state;
    const isEnabled = this.isPresentAllInputs();
    return (
      <>
        {/* {this.state.isLoading ? (
          <div className="lds-dual-ring loader-pos">Loading&#8230;</div>
        ) : null} */}

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
              {this.state.isLogin ? (
                <div className="form-wrap">
                  <div className="col-md-5 sub-container">
                    <div className="col-md-12 heading">Sign In</div>
                    {this.state.error ? (
                      <div className="invalid-error">{this.state.error}</div>
                    ) : null}
                    {this.state.resetSusses ? (
                      <div className="success">{this.state.resetSusses}</div>
                    ) : null}
                    <form onSubmit={this.login}>
                      <div className="col-md-10 offset-1 no-padding signup-form text-left">
                        <div className="form-group">
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
                        <div className="form-group">
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
                        <div className="text-right forgot-pass">
                          Forgot Password?{" "}
                          <div
                            className="btn btn-link no-padding click-here"
                            onClick={this.toggleResetPassword}
                          >
                            Click here
                          </div>
                          {this.state.loadingReset ? (
                            <Loader
                              type="Oval"
                              color="#000"
                              height={20}
                              width={20}
                              className="d-inline-block login-signup-loader"
                            />
                          ) : null}
                        </div>
                        <br />
                        <div className="col-md-12 no-padding text-center">
                          <button
                            disabled={!isEnabled}
                            className="d-inline-block btn form-btn"
                          >
                            <span>Sign In &nbsp;&nbsp;</span>
                            {this.state.isLoading ? (
                              <Loader
                                type="Oval"
                                color="#FFFFFF"
                                height={20}
                                width={20}
                                className="d-inline-block login-signup-loader"
                              />
                            ) : null}
                          </button>
                        </div>
                      </div>
                    </form>
                    <br />
                    <div
                      style={{ margin: "0" }}
                      className="col-md-10 offset-1 no-padding googleIcon"
                    >
                      <GoogleLogin
                        clientId={GOOGLE_CLIENT_ID}
                        buttonText="Sign In with Google"
                        className="google-auth login"
                        onSuccess={this.responseGoogle}
                        onFailure={this.errorGoogle}
                      />
                    </div>
                    <br />
                    <div
                      style={{ margin: "0" }}
                      className="col-md-8 offset-2 googleIcon"
                    >
                      <span>New to DailyPloy?</span>
                      <Link to={`/signup`} className="link">
                        Sign Up
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="form-wrap">
                  <div className="col-md-5 sub-container">
                    <div className="col-md-12 heading">Forgot Password</div>
                    {this.state.error ? (
                      <div className="invalid-error">{this.state.error}</div>
                    ) : null}
                    {this.state.resetSusses ? (
                      <div className="success">{this.state.resetSusses}</div>
                    ) : null}
                    <form onSubmit={this.resetPassword}>
                      <div className="col-md-10 offset-1 no-padding signup-form text-left">
                        <div className="form-group">
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
                        <br />
                        <div className="col-md-12 no-padding text-center">
                          <button
                            disabled={this.state.loadingReset}
                            className="d-inline-block btn form-btn"
                          >
                            <span>Send Password Reset Link &nbsp;&nbsp;</span>
                            {this.state.loadingReset ? (
                              <Loader
                                type="Oval"
                                color="#FFFFFF"
                                height={20}
                                width={20}
                                className="d-inline-block login-signup-loader"
                              />
                            ) : null}
                          </button>
                        </div>
                      </div>
                    </form>
                    <br />
                    <div className="col-md-12 googleIcon">
                      <span className="d-inline-block">
                        Already have DailyPloy Account?
                      </span>

                      <Link
                        to="/login"
                        onClick={this.toggleResetPassword}
                        className="link"
                      >
                        Sign in
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default withRouter(Signin);
