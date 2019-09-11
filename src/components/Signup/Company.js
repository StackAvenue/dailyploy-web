import React from "react";

const Company = props => {
  const { name, companyName, email, password, confirmPassword } = props.state;
  return (
    <>
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
              onChange={props.changeHandler}
              className="form-control login-form-field error"
              placeholder="johndoe1234@amazon.com"
            />
          ) : (
            <input
              type="email"
              name="email"
              value={email}
              onChange={props.changeHandler}
              className="form-control login-form-field"
              placeholder="johndoe1234@amazon.com"
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
            placeholder="Amazon"
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          {props.state.errors.passwordError ? (
            <span className="error-warning">
              {props.state.errors.passwordError}
            </span>
          ) : null}
          {props.state.errors.passwordError ? (
            <input
              type="password"
              name="password"
              value={password}
              onChange={props.changeHandler}
              className="form-control login-form-field error"
              placeholder="Password"
            />
          ) : (
            <input
              type="password"
              name="password"
              value={password}
              onChange={props.changeHandler}
              className="form-control login-form-field"
              placeholder="Password"
            />
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
            <input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={props.changeHandler}
              className="form-control login-form-field error"
              placeholder="Confirm Password"
            />
          ) : (
            <input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={props.changeHandler}
              className="form-control login-form-field"
              placeholder="Confirm Password"
            />
          )}
        </div>
        <div className="col-md-12 no-padding text-center">
          <button
            disabled={!props.enable}
            onClick={props.signup}
            className="btn form-btn"
          >
            Signup
          </button>
        </div>
      </div>
    </>
  );
};

export default Company;
