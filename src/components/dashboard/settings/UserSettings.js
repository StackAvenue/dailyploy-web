import React, { Component } from 'react'
import Profile from '../../../assets/images/profile.png'
import Admin from '../../../assets/images/admin.png'
import Member from '../../../assets/images/member.png'

const UserSettings = props => {
  return (
    <>
      <div className="col-md-12 heading" style={{ paddingTop: '40px' }}>
        General Settings
      </div>
      <div className="col-md-12 box no-padding">
        <div className="col-md-12">
          <div
            className="col-md-2 d-inline-block no-padding"
            style={{ verticalAlign: 'super' }}
          >
            <div className="user-icon">
              <img alt={'profile'} src={Profile} className="img-responsive" />
              <div className="overlay"></div>
              <button className="btn btn-link">
                <i className="fas fa-pencil-alt"></i>
              </button>
            </div>
          </div>
          <div className="col-md-8 d-inline-block no-padding inner-box">
            <div className="col-md-6 name d-inline-block">
              Name<span> *</span>
              {props.state.nameError ? (
                <span className="error-warning d-inline-block">
                  {props.state.nameError}
                </span>
              ) : null}
            </div>
            <div className="col-md-12">
              <div className="col-md-6 d-inline-block no-padding">
                <input
                  type="text"
                  placeholder="Name"
                  className={`form-control input ${
                    props.state.nameError ? ' input-error-border' : ''
                  }`}
                  name="userName"
                  value={props.state.userName}
                  onChange={props.handleChange}
                />
              </div>
              <div className="d-inline-block box-btn">
                <button
                  className={`btn btn-primary save-button ${
                    props.state.isSaveEnable ? 'btn-blue' : 'btn-disable'
                  }`}
                  onClick={props.updateUserName}
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
            {props.role === 'admin' ? (
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
              className={`form-control input ${
                props.state.oldPasswordError ? ' input-error-border' : ''
              }`}
              name="oldPassword"
              value={props.state.oldPassword}
              onChange={props.handleChange}
            />
          </div>
        </div>
        {props.state.oldPasswordError ? (
          <div className="col-md-12">
            <div className="col-md-2 d-inline-block no-padding"></div>
            <div className="col-md-5 d-inline-block ">
              <span className="error-warning d-inline-block">
                {props.state.oldPasswordError}
              </span>
            </div>
          </div>
        ) : null}
        <div className="col-md-12 inner-box">
          <div className="col-md-2 d-inline-block no-padding name">
            New Password<span> *</span>
            <i className="fa fa-info-circle tooltip d-inline-block">
              <div class="tooltiptext">
                Min 8 characters at least 1 number and 1 special character
              </div>
            </i>
          </div>
          <div className="col-md-5 d-inline-block">
            <input
              type="password"
              placeholder="New Password"
              className={`form-control input ${
                props.state.passwordError ? ' input-error-border' : ''
              }`}
              name="newPassword"
              value={props.state.newPassword}
              onChange={props.handlePasswordChange}
            />
          </div>
        </div>
        {props.state.passwordError ? (
          <div className="col-md-12">
            <div className="col-md-2 d-inline-block no-padding"></div>
            <div className="col-md-5 d-inline-block ">
              <span className="error-warning d-inline-block">
                {props.state.passwordError}
              </span>
            </div>
          </div>
        ) : null}
        <div className="col-md-12 inner-box">
          <div className="col-md-2 d-inline-block no-padding name">
            Confirm Password<span> *</span>
          </div>
          <div className="col-md-5 d-inline-block">
            <input
              type="password"
              placeholder="Confirm Password"
              className={`form-control input ${
                props.state.confirmPasswordError ? ' input-error-border' : ''
              }`}
              name="confirmPassword"
              value={props.state.confirmPassword}
              onChange={props.handleConfirmPassChange}
            />
          </div>
        </div>
        {props.state.confirmPasswordError ? (
          <div className="col-md-12">
            <div className="col-md-2 d-inline-block no-padding"></div>
            <div className="col-md-5 d-inline-block ">
              <span className="error-warning d-inline-block">
                {props.state.confirmPasswordError}
              </span>
            </div>
          </div>
        ) : null}
        <div className="col-md-12 inner-box box-btn">
          <div className="col-md-2 d-inline-block no-padding name"></div>
          <div className="col-md-5 d-inline-block save-conf-btn">
            <button
              className={`btn btn-default button ${
                props.state.isSaveConfirmEnable ? 'btn-blue' : 'btn-disable'
              }`}
              onClick={props.updatePassword}
            >
              Save & Confirm
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default UserSettings
