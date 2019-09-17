import React, { Component } from "react";
import Profile from "../../../assets/images/profile.png";

class GeneralSettings extends Component {
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
        <div className="col-md-12 heading">General Settings</div>
        <div className="col-md-12 box no-padding">
          <div className="col-md-12">
            <div className="col-md-2 d-inline-block no-padding">
              <div className="user-icon">
                <img alt={"profile"} src={Profile} className="img-responsive" />
                <div className="overlay"></div>
                <button className="btn btn-link">
                  <i className="fas fa-pencil-alt"></i>
                </button>
              </div>
            </div>
            <div className="col-md-5 d-inline-block no-padding inner-box">
              <div className="col-md-3 name">
                Name<span> *</span>
              </div>
              <br />
              <div className="col-md-12">
                <input
                  type="text"
                  placeholder="Name"
                  className="form-control input"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-12 hr"></div>
        <div className="col-md-12 box no-padding">
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
        </div>
      </>
    );
  }
}

export default GeneralSettings;
