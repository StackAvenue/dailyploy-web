import React from "react";

const Individual = props => {
  const { name, email, password, confirmPassword } = props.state;
  return (
    <>
      <div className="col-md-10 offset-1 no-padding signup-form text-left">
        <div class="form-group">
          <label>Name</label>
          {props.state.errors.nameError ? (
            <p style={{ color: "red" }}>{props.state.errors.nameError}</p>
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

        <div class="form-group">
          <label>Email</label>
          {props.state.errors.emailError ? (
            <p style={{ color: "red" }}>{props.state.errors.emailError}</p>
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
        <div class="form-group">
          <label>Password</label>
          {props.state.errors.passwordError ? (
            <p style={{ color: "red" }}>{props.state.errors.passwordError}</p>
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

        <div class="form-group">
          <label>Confirm Password</label>
          {props.state.errors.confirmPasswordError ? (
            <p style={{ color: "red" }}>
              {props.state.errors.confirmPasswordError}
            </p>
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
