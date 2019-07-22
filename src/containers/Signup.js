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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Tabs, Tab } from "react-bootstrap";
import Company from "../components/Signup/Company";
import Individual from "../components/Signup/Individual";

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
        confirmPasswordError: null
      },
      isCompany: true
    };
  }

  companyFlag = word => {
    var company;
    if (word === "company") {
      company = true;
    } else {
      company = false;
    }
    return this.setState({ isCompany: company });
  };

  changeHandler = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

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
              email: this.state.email
            }
          }
        };
      } else {
        signupData = {
          user: {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
            password_confirmation: this.state.confirmPassword,
            is_company_present: this.state.isCompany
          }
        };
      }
      try {
        const { signUpData } = await signUp(signupData);
        toast.success("User Created");
      } catch (e) {
        toast.error("email " + e.response.data.errors.email);
      }
    } else {
      toast.error("Enter valid email address and password");
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
      companyNameError: null,
      emailError: null,
      passwordError: null,
      confirmPasswordError: null
    };
    errors.nameError = validateName(this.state.name);
    errors.companyNameError = validateName(this.state.companyName);
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
      this.state.companyName &&
      this.state.email &&
      this.state.password &&
      this.state.confirmPassword &&
      this.state.password === this.state.confirmPassword
    );
  };

  render() {
    const isEnabled =
      this.state.name &&
      this.state.companyName &&
      this.state.email &&
      this.state.password &&
      this.state.confirmPassword;

    return (
      <>
        <ToastContainer position={toast.POSITION.TOP_RIGHT} />
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
              <Tabs
                defaultActiveKey="company"
                className="col-md-10 offset-1"
                id="uncontrolled-tab-example"
                onSelect={key => this.companyFlag(key)}
                style={{ "margin-bottom": "15px", "margin-top": "15px" }}
              >
                <Tab eventKey="company" title="Company">
                  <Company
                    state={this.state}
                    enable={isEnabled}
                    changeHandler={this.changeHandler}
                    signup={this.signupForm}
                  />
                </Tab>
                <Tab eventKey="individual" title="Individual">
                  <Individual
                    state={this.state}
                    enable={isEnabled}
                    changeHandler={this.changeHandler}
                    signup={this.signupForm}
                  />
                </Tab>
              </Tabs>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default withRouter(Signup);
