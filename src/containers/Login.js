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

import FlowerPot1 from "../assets/images/signUp1.svg";
import Girls from "../assets/images/Girls.svg";

import FlowerPot2 from "../assets/images/signUp2.svg";
import Boys from "../assets/images/Boys.svg";

import SignUp1 from "../assets/images/signUp5.svg";
import SignUp2 from "../assets/images/signUp6.svg";
import SignUp3 from "../assets/images/signUp4.svg";
import SignUp4 from "../assets/images/signUp7.svg";
import GoogleAuth from "../assets/images/GoogleAuth.svg";

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
      isLogin: true,
      showPassword: false
    };
  }

  handlePasswordShow = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };

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
          { autoClose: 2000, position: toast.POSITION.TOP_CENTER }
        );
      } else if (e.response.data.errors.email) {
        toast(
          <DailyPloyToast
            message={"email " + `${e.response.data.errors.email}`}
            status="error"
          />,
          { autoClose: 2000, position: toast.POSITION.TOP_CENTER }
        );
      } else if (e.response.data.errors.detail) {
        toast(
          <DailyPloyToast
            message={"email " + `${e.response.data.errors.detail}`}
            status="error"
          />,
          { autoClose: 2000, position: toast.POSITION.TOP_CENTER }
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
        <div className="container-fluid padding-0">
          <div className="main-container1">
            <Header />
            <div className="row no-margin signup signup-container">
              <div className="no-padding width">
                <div className="flower-pot-div">
                  <img
                    src={FlowerPot1}
                    alt=""
                    title=""
                    className="flowerpot1-img"
                    height="100%"
                    width="100%"
                  />
                </div>
                <div className="left-girls-content">
                  <img
                    src={Girls}
                    alt=""
                    title=""
                    className="girls-img"
                    height="100%"
                    width="100%"
                  />
                </div>
                {/* <img
                  src={signup}
                  alt="signup"
                  className="img-responsive image"
                /> */}
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
                      <div className="col-md-12  no-padding signup-form text-left">
                        <div className=" input-data padding-top-28">
                          <span class="span-icon">
                            <i class="fa fa-envelope icon-5" aria-hidden="true"></i>
                          </span>
                          <span class="lines"></span>
                          {/* <label>Email</label> */}
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
                            className="form-control form-input login-form-field"
                            placeholder="Email"
                          />
                        </div>
                        <div className="input-data padding-top-28">
                          {/* <label>Password</label> */}
                          <span class="span-icon">
                            <i class="fas fa-lock icon-5" aria-hidden="true" ></i>
                          </span>
                          <span class="lines"></span>
                          {this.state.errors.passwordError ? (
                            <span className="error-warning">
                              {this.state.errors.passwordError}
                            </span>
                          ) : null}
                          <input
                            type={this.state.showPassword ? "text" : "password"}
                            name="password"
                            value={password}
                            onChange={this.handleChange}
                            className="form-control login-form-field"
                            placeholder="Password"
                          />
                          <span
                            className="login-password-eye"
                            onClick={this.handlePasswordShow}
                          >
                            <i
                              className={
                                this.state.showPassword
                                  ? "fa fa-eye"
                                  : "fa fa-eye-slash"
                              }
                            ></i>
                          </span>
                        </div>
                        <div className="text-right forgot-pass">
                          {" "}
                          <div
                            className="click-here  no-padding "
                            onClick={this.toggleResetPassword}
                          >
                            Forgot Password?
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
                        {/* <br /> */}
                        <div className=" padding-top-28">
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
                    {/* <br /> */}
                    <div
                      style={{ margin: "0", textAlign: "center" }}
                      className="padding-top-28 googleIcon"
                    >
                      <GoogleLogin
                        clientId={GOOGLE_CLIENT_ID}
                        buttonText="Sign In with Google"
                        className="google-auth login"
                        onSuccess={this.responseGoogle}
                        onFailure={this.errorGoogle}
                      />
                    </div>
                    {/* <br /> */}
                    <div
                      style={{ margin: "0" }}
                      className="padding-top-28  googleIcon"
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
                        <div className="col-md-12  no-padding signup-form text-left">
                          <div className="input-data padding-top-28">
                            {/* <label>Email</label> */}
                            <span class="span-icon">
                              <i class="fa fa-envelope icon-5" aria-hidden="true"></i>
                            </span>
                            <span class="lines"></span>
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
                              placeholder="Email"
                            />
                          </div>
                          {/* <br /> */}
                          <div className=" text-center padding-top-28">
                            <button
                              disabled={this.state.loadingReset}
                              className="d-inline-block btn form-btn "
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
                      {/* <br /> */}
                      <div className="padding-top-28 googleIcon">
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
              <div className="no-padding width1">
                <div className="right-boys-content">
                  <img
                    src={Boys}
                    alt=""
                    title=""
                    className="boys-img"
                    height="100%"
                    width="100%"
                  />
                </div>

                <div className="flower2-pot-div">
                  <img
                    src={FlowerPot2}
                    alt=""
                    title=""
                    className="flowerpot2-img"
                    height="100%"
                    width="100%"
                  />
                </div>
              </div>

            </div>
            <div className="row no-margin images-div">
              <div className="sign-up3-div">
                <img
                  src={SignUp3}
                  alt=""
                  title=""
                  className="sign-up3-img"
                  height="100%"
                  width="100%"
                />
              </div>
              <div className="sign-up1-div">
                <img
                  src={SignUp1}
                  alt=""
                  title=""
                  className="sign-up1-img"
                  height="100%"
                  width="100%"
                />
              </div>

              <div className="sign-up2-div">
                <img
                  src={SignUp2}
                  alt=""
                  title=""
                  className="sign2-up-img"
                  height="100%"
                  width="100%"
                />
              </div>
              <div className="sign-up4-div">
                <img
                  src={SignUp4}
                  alt=""
                  title=""
                  className="sign-up4-img"
                  height="100%"
                  width="100%"
                />
              </div>
              {/* </div> */}
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default withRouter(Signin);
