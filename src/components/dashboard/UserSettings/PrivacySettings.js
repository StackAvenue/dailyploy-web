import React, { Component } from "react";

class PrivacySettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      setShow: false,
    };
  }
  handleClose = () => {
    this.setState({
      show: false,
    });
  };
  handleShow = () => {
    this.setState({
      setShow: true,
      show: true,
    });
  };
  render() {
    return (
      <>
        <div className="col-md-12 heading">Privacy Settings</div>
        <div className="col-md-12 box no-padding">
          <div className="col-md-12 inner-box">
            <div className="col-md-2 d-inline-block no-padding name">
              <p>Change Password?</p>
            </div>
          </div>
          <div className="col-md-12 inner-box">
            <div className="col-md-2 d-inline-block no-padding name">
              Old Password<span> *</span>
            </div>
            <div className="col-md-5 d-inline-block">
              <input
                type="password"
                placeholder="Old Password"
                className="form-control input"
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
              />
            </div>
          </div>
          <div className="col-md-12 box-btn">
            <button className="btn btn-default button">Save & Confirm</button>
          </div>
        </div>
      </>
    );
  }
}

export default PrivacySettings;
