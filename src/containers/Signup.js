import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import "../assets/css/signup.scss";
import { signUp, get } from "../utils/API";
import {
  checkPassword,
  validateName,
  validateEmail,
} from "../utils/validation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DailyPloyToast from "./../../src/components/DailyPloyToast";
import { Tabs, Tab } from "react-bootstrap";
import Company from "../components/Signup/Company";
import Individual from "../components/Signup/Individual";
import Header from "../components/Landing/Header";
import signup from "../assets/images/landing.jpg";
import googleIcon from "../assets/images/google.png";

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      companyName: "",
      email: "",
      password: "",
      confirmPassword: "",
      errors: {
        nameError: null,
        companyNameError: null,
        emailError: null,
        passwordError: null,
        confirmPasswordError: null,
      },
      isCompany: false,
      tokenId: "",
    };
  }

  companyFlag = word => {
    var company;
    if (word === "company") {
      company = true;
    } else {
      company = false;
    }
    console.log("company", word);
    return this.setState({ isCompany: company });
  };

  changeHandler = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  async componentDidMount() {
    const { tokenId } = this.props.match.params;

    try {
      const { data } = await get(`token_details/${tokenId}`);
      var userName = data.name
      var userEmail = data.email
    } catch (e) {
      console.log("error", e.response);
    }

    this.setState({
      tokenId: tokenId, name: userName, email: userEmail
    });
  }

  signupForm = async () => {
    this.validateAllInputs();
    if (this.validityCheck()) {
      var signupData;
      if (this.state.isCompany === true) {
        signupData = {
          user: {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
            password_confirmation: this.state.confirmPassword,
            is_company_present: this.state.isCompany,
            company: {
              name: this.state.companyName,
              email: this.state.email,
            },
          },
        };
      } else if (!this.state.tokenId) {
        signupData = {
          user: {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
            password_confirmation: this.state.confirmPassword,
            is_company_present: this.state.isCompany,
            invitation_status: false,
          },
        };
      } else {
        signupData = {
          user: {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
            password_confirmation: this.state.confirmPassword,
            is_company_present: this.state.isCompany,
            invitation_status: true,
            invitee_details: {
              token_id: this.state.tokenId,
            },
          },
        };
      }
      try {
        const { signUpData } = await signUp(signupData);
        toast(<DailyPloyToast message="User Created" status="success" />, { autoClose: 2000 })
        setTimeout(() => this.props.history.push("/login"), 3000);
      } catch (e) {
        toast(<DailyPloyToast message={"email " + `${e.response.data.errors.email}`} status="error" />, { autoClose: 2000 })
        console.log("error", e.response)
      }
    } else {
      console.log("Enter valid email address and password");
    }
  };

  validatePassword = (password, confirmPassword) => {
    if (password === confirmPassword) {
      return;
    }
    return "Didn't Match, Try Again.";
  };

  validateAllInputs = () => {
    const errors = {
      nameError: null,
      companyNameError: null,
      emailError: null,
      passwordError: null,
      confirmPasswordError: null,
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
    const isEnabled =
      this.state.name &&
      this.state.email &&
      this.state.password &&
      this.state.confirmPassword;

    console.log("tokenId", this.state.tokenId);

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
                <div className="col-md-12 heading">Sign up</div>
                <Tabs
                  defaultActiveKey="individual"
                  className="col-md-10 offset-1 main-tabs"
                  id="uncontrolled-tab-example"
                  onSelect={key => this.companyFlag(key)}
                >
                  <Tab eventKey="individual" title="Individual">
                    <Individual
                      state={this.state}
                      enable={isEnabled}
                      changeHandler={this.changeHandler}
                      signup={this.signupForm}
                    />
                  </Tab>
                  <Tab
                    eventKey="company"
                    title="Organization"
                    style={{ border: "0" }}
                  >
                    <Company
                      state={this.state}
                      enable={isEnabled}
                      changeHandler={this.changeHandler}
                      signup={this.signupForm}
                    />
                  </Tab>
                </Tabs>
                <br />
                <div className="col-md-8 offset-2 googleIcon">
                  <img
                    alt="Google Icon"
                    src={googleIcon}
                    className="img-responsive"
                  />
                  <Link to={"/signup"} className="link">
                    Sign up with your Google account
                  </Link>
                </div>
                <br />
                <div className="col-md-8 offset-2 googleIcon">
                  <span>Already have DailyPloy account?</span>
                  <Link to={`/login`} className="link">
                    Sign in
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

export default withRouter(Signup);
