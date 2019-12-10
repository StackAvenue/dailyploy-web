import React, { Component } from "react";
import Profile from "../../../assets/images/profile.png";
import Admin from "../../../assets/images/admin.png";
import Member from "../../../assets/images/member.png";

const UserSettings = props => {
  return (
    <>
      <div className="col-md-12 heading">General Settings</div>
      <div className="col-md-12 box no-padding">
        <div className="col-md-12">
          <div
            className="col-md-2 d-inline-block no-padding"
            style={{ verticalAlign: "super" }}
          >
            <div className="user-icon">
              <img alt={"profile"} src={Profile} className="img-responsive" />
              <div className="overlay"></div>
              <button className="btn btn-link">
                <i className="fas fa-pencil-alt"></i>
              </button>
            </div>
          </div>
          <div className="col-md-8 d-inline-block no-padding inner-box">
            <div className="col-md-2 name">
              Name<span> *</span>
            </div>
            <div className="col-md-12">
              <div className="col-md-6 d-inline-block no-padding">
                <input
                  type="text"
                  placeholder="Name"
                  className="form-control input"
                  name="userName"
                  value={props.state.userName}
                  onChange={props.handleChange}
                  disabled={props.state.isDisableName}
                />
              </div>
              <div
                className="d-inline-block"
                style={{ verticalAlign: "top", paddingLeft: "15px" }}
              >
                <button
                  className="btn btn-primary save-button"
                  onClick={props.save}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-8 access-box">
          <div className="d-inline-block access-text">Access</div>
          <div className="d-inline-block admin-text">
            {props.role === "admin" ? (
              <>
                <img src={Admin} />
                Admin
              </>
            ) : (
              <>
                <img src={Member} />
                Member
              </>
            )}
          </div>
        </div>
      </div>
      <div className="col-md-12 hr"></div>
      {/* <div className="col-md-12 box no-padding">
          <div className="col-md-12 inner-box">
            <div className="col-md-2 d-inline-block no-padding name">
              Email<span> *</span>
            </div>
            <div className="col-md-5 d-inline-block">
              <input
                type="email"
                placeholder="Email"
                className="form-control input"
              />
            </div>
          </div>
          <div className="col-md-12 inner-box">
            <div className="col-md-2 d-inline-block no-padding name">
              Access
            </div>
            <div className="col-md-5 d-inline-block">Admin</div>
          </div>
          <div className="col-md-12 box-btn">
            <button className="btn btn-default button">Save</button>
          </div>
        </div> */}
      <div className="col-md-12 heading">Change Password</div>
      <div className="col-md-12 box no-padding">
        <div className="col-md-12 inner-box">
          <div className="col-md-2 d-inline-block no-padding name">
            Old Password<span> *</span>
          </div>
          <div className="col-md-5 d-inline-block">
            <input
              type="password"
              placeholder="Old Password"
              className="form-control input"
              name="oldPassword"
              value={props.state.oldPassword}
              onChange={props.handleChange}
            />
          </div>
        </div>
        <div className="col-md-12 inner-box">
          <div className="col-md-2 d-inline-block no-padding name">
            New Password<span> *</span>
          </div>
          <div className="col-md-5 d-inline-block">
            <input
              type="password"
              placeholder="New Password"
              className="form-control input"
              name="newPassword"
              value={props.state.newPassword}
              onChange={props.handleChange}
            />
          </div>
        </div>
        <div className="col-md-12 inner-box">
          <div className="col-md-2 d-inline-block no-padding name">
            Confirm Password<span> *</span>
          </div>
          <div className="col-md-5 d-inline-block">
            <input
              type="password"
              placeholder="Confirm Password"
              className="form-control input"
              name="confirmPassword"
              value={props.state.confirmPassword}
              onChange={props.handleChange}
            />
          </div>
        </div>
        <div className="col-md-12 box-btn">
          <button className="btn btn-default button">Save & Confirm</button>
        </div>
      </div>
    </>
  );
};

export default UserSettings;
