import React from "react";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { GOOGLE_CLIENT_ID } from "./../../utils/Constants";
import GoogleLogin from "react-google-login";
import LogType from "../LogType";

const Individual = (props) => {
  const {
    name,
    email,
    password,
    confirmPassword,
    tokenId,
    isDisabled,
    timetrack_enabled,
  } = props.state;
  return (
    <>
      <form onSubmit={props.signup} className="signup-form">
        <div className="col-md-10 offset-1 no-padding text-left">
          <div className="form-group">
            <label>Name</label>
            {props.state.errors.nameError ? (
              <span className="error-warning">
                {props.state.errors.nameError}
              </span>
            ) : null}
            <input
              type="text"
              name="name"
              value={name}
              onChange={props.changeHandler}
              className="form-control login-form-field"
              placeholder="John Doe"
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            {props.state.errors.emailError ? (
              <span className="error-warning">
                {props.state.errors.emailError}
              </span>
            ) : null}
            {props.state.errors.emailError ? (
              <input
                type="email"
                name="email"
                disabled={isDisabled}
                value={email}
                onChange={props.changeHandler}
                className="form-control login-form-field error"
                placeholder="john@daiilyploy.com"
              />
            ) : (
              <input
                type="email"
                name="email"
                disabled={isDisabled}
                value={email}
                onChange={props.changeHandler}
                className="form-control login-form-field"
                placeholder="john@daiilyploy.com"
              />
            )}
          </div>
          <div className="form-group">
            <label>
              Password
              <i className="fa fa-info-circle tooltip-pwd d-inline-block">
                <span className="tooltiptext-pwd">
                  Min 8 characters at least 1 number and 1 special character
                </span>
              </i>
            </label>
            {props.state.errors.passwordError ? (
              <div className="d-inline-block info-icon error-warning text-wraping">
                Must be Valid
              </div>
            ) : null}
            {props.state.errors.passwordError ? (
              <>
                <input
                  type={props.state.showPassword ? "text" : "password"}
                  name="password"
                  value={password}
                  onChange={props.changeHandler}
                  className="form-control login-form-field error"
                  placeholder="Password"
                />
                <span
                  className="signup-password-eye-1"
                  onClick={props.handlePasswordShow}
                >
                  <i
                    className={
                      props.state.showPassword ? "fa fa-eye" : "fa fa-eye-slash"
                    }
                  ></i>
                </span>
              </>
            ) : (
              <>
                <input
                  type={props.state.showPassword ? "text" : "password"}
                  name="password"
                  value={password}
                  onChange={props.changeHandler}
                  className="form-control login-form-field"
                  placeholder="Password"
                />
                <span
                  className="signup-password-eye-1"
                  onClick={props.handlePasswordShow}
                >
                  <i
                    className={
                      props.state.showPassword ? "fa fa-eye" : "fa fa-eye-slash"
                    }
                  ></i>
                </span>
              </>
            )}
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            {props.state.errors.confirmPasswordError ? (
              <span className="error-warning">
                {props.state.errors.confirmPasswordError}
              </span>
            ) : null}
            {props.state.errors.confirmPasswordError ? (
              <>
                <input
                  type={props.state.showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={props.changeHandler}
                  className="form-control login-form-field error"
                  placeholder="Confirm Password"
                />
                <span
                  className="signup-password-eye-2"
                  onClick={props.handlePasswordShow}
                >
                  <i
                    className={
                      props.state.showPassword ? "fa fa-eye" : "fa fa-eye-slash"
                    }
                  ></i>
                </span>
              </>
            ) : (
              <>
                <input
                  type={props.state.showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={props.changeHandler}
                  className="form-control login-form-field"
                  placeholder="Confirm Password"
                />
                <span
                  className="signup-password-eye-2"
                  onClick={props.handlePasswordShow}
                >
                  <i
                    className={
                      props.state.showPassword ? "fa fa-eye" : "fa fa-eye-slash"
                    }
                  ></i>
                </span>
              </>
            )}
          </div>

          {/* <br /> */}
          <div className="form-group">
            <LogType
              timetrack_enabled={timetrack_enabled}
              changeLogType={props.changeLogType}
            />
          </div>
          <div
            className="col-md-12 no-padding text-center"
            data-toggle="tooltip"
            title="Fill All Fields"
          >
            <button
              disabled={!props.enable}
              // onClick={props.signup}
              className="btn form-btn"
            >
              <span>Signup</span>
              {props.state.isLoading ? (
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
        <br />
        <div className="col-md-10 offset-1 no-padding text-center googleIcon">
          <GoogleLogin
            clientId={GOOGLE_CLIENT_ID}
            buttonText="Sign up with your Google account"
            className="google-auth signup"
            onSuccess={props.responseGoogle}
            onFailure={props.errorGoogle}
          />
        </div>
      </form>
    </>
  );
};

export default Individual;
