import React from "react";

const Individual = props => {
  const { name, email, password, confirmPassword } = props.state;
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
            placeholder="Username"
          />
        </div>
        {props.state.errors.nameError ? (
          <p style={{ color: "red" }}>{props.state.errors.nameError}</p>
        ) : null}
        <div class="form-group">
          <input
            type="email"
            name="email"
            value={email}
            onChange={props.changeHandler}
            className="form-control login-form-field"
            placeholder="Email Id"
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

export default Individual;
