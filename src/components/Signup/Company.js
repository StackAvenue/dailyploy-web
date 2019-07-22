import React from "react";

const Company = props => {
  const { name, companyName, email, password, confirmPassword } = props.state;
  return (
    <>
      <div className="col-md-10 offset-1 no-padding">
        <div class="form-group">
          <input
            type="text"
            name="name"
            value={name}
            onChange={props.changeHandler}
            className="form-control login-form-field"
            placeholder="Fullname"
          />
        </div>
        {props.state.errors.nameError ? (
          <p style={{ color: "red" }}>{props.state.errors.nameError}</p>
        ) : null}
        <div class="form-group">
          <input
            type="text"
            name="companyName"
            value={companyName}
            onChange={props.changeHandler}
            className="form-control login-form-field"
            placeholder="Company Name"
          />
        </div>
        {props.state.errors.companyNameError ? (
          <p style={{ color: "red" }}>{props.state.errors.companyNameError}</p>
        ) : null}
        <div class="form-group">
          <input
            type="email"
            name="email"
            value={email}
            onChange={props.changeHandler}
            className="form-control login-form-field"
            placeholder="Company Email-Id"
          />
        </div>
        {props.state.errors.emailError ? (
          <p style={{ color: "red" }}>{props.state.errors.emailError}</p>
        ) : null}
        <div class="form-group">
          <input
            type="password"
            name="password"
            value={password}
            onChange={props.changeHandler}
            className="form-control login-form-field"
            placeholder="Password"
          />
        </div>
        {props.state.errors.passwordError ? (
          <p style={{ color: "red" }}>{props.state.errors.passwordError}</p>
        ) : null}
        <div class="form-group">
          <input
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={props.changeHandler}
            className="form-control login-form-field"
            placeholder="Confirm Password"
          />
        </div>
        {props.state.errors.confirmPasswordError ? (
          <p style={{ color: "red" }}>
            {props.state.errors.confirmPasswordError}
          </p>
        ) : null}
      </div>
      <br />
      <div className="col-md-12 text-center">
        <button
          disabled={!props.enable}
          onClick={props.signup}
          className="btn btn-outline-secondary login-btn"
        >
          Signup
        </button>
      </div>
    </>
  );
};

export default Company;
