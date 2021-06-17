import React from "react";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import LogType from '../LogType';
import PropTypes from 'prop-types';


const Company = props => {
  const {
    name,
    companyName,
    email,
    password,
    confirmPassword,
    timetrack_enabled,
    isDisabled
  } = props.state;
  return (
    <>
      <form onSubmit={props.signup}>
        <div className="col-md-10 offset-1 no-padding signup-form text-left">
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
                value={email}
                disabled={isDisabled}
                onChange={props.changeHandler}
                className="form-control login-form-field error"
                placeholder="john@daiilyploy.com"
              />
            ) : (
                <input
                  type="email"
                  name="email"
                  value={email}
                  disabled={isDisabled}
                  onChange={props.changeHandler}
                  className="form-control login-form-field"
                  placeholder="john@daiilyploy.com"
                />
              )}
          </div>
          <div className="form-group">
            <label>Organization Name</label>
            {props.state.errors.companyNameError ? (
              <span className="error-warning">
                {props.state.errors.companyNameError}
              </span>
            ) : null}
            <input
              type="text"
              name="companyName"
              value={companyName}
              onChange={props.changeHandler}
              className="form-control login-form-field"
              placeholder="DailyPloy"
            />
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
              <span className="error-warning info-icon text-wraping ">
                Must be Valid
              </span>
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
          <div className="form-group">
            <LogType timetrack_enabled={timetrack_enabled} changeLogType={props.changeLogType} />
          </div>
          <div className="col-md-12 no-padding text-center">
            <button
              disabled={!props.enable}
              onClick={props.signup}
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
      </form>
    </>
  );
};
Company.propTypes = {
  state: PropTypes.object.isRequired,
  enable: PropTypes.string.isRequired,
  changeHandler: PropTypes.func.isRequired,
  signup: PropTypes.func.isRequired,
  handlePasswordShow: PropTypes.func.isRequired,
  changeLogType: PropTypes.func.isRequired,
}

export default Company;
