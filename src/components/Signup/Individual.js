import React from "react";

const Individual = props => {
  const { name, email, password, confirmPassword } = props.state;
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
          <input
            type="email"
            name="email"
            value={email}
            onChange={props.changeHandler}
            className="form-control login-form-field"
            placeholder="johndoe123@example.com"
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          {props.state.errors.passwordError ? (
            <span className="error-warning">
              {props.state.errors.passwordError}
            </span>
          ) : null}
          <input
            type="password"
            name="password"
            value={password}
            onChange={props.changeHandler}
            className="form-control login-form-field"
            placeholder="Password"
          />
        </div>

        <div className="form-group">
          <label>Confirm Password</label>
          {props.state.errors.confirmPasswordError ? (
            <span className="error-warning">
              {props.state.errors.confirmPasswordError}
            </span>
          ) : null}
          <input
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={props.changeHandler}
            className="form-control login-form-field"
            placeholder="Confirm Password"
          />
        </div>
        {/* <br /> */}
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

export default Individual;
