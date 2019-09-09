import React, { Component } from "react";
import EmailConfigurationModal from "./EmailConfigurationModal";

class EmailConfiguration extends Component {
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
        <div className="col-md-12 heading">
          <div className="col-md-6 no-padding d-inline-block">
            Daily Status Mail <span className="alert">Email suspended</span>
          </div>
          <div className="col-md-6 no-padding d-inline-block">
            <div className="float-right">
              <button className="btn btn-link">Edit</button>
              <button
                className="btn btn-primary resume-btn"
                onClick={this.handleShow}
              >
                Resume
              </button>
              <EmailConfigurationModal
                state={this.state}
                handleClose={this.handleClose}
              />
            </div>
          </div>
        </div>
        <div className="col-md-12 box no-padding">
          <div className="col-md-12 time-desc">
            Daily status email will be sent by default at 12:00 AM everyday.
          </div>
          <div className="col-md-12 inner-container">
            <div className="col-md-1 no-padding time-desc d-inline-block">
              To
            </div>
            <div className="col-md-9 no-padding d-inline-block">
              <div className="email-box">
                <div className="email-icon">AJ</div>
                <span>Arpit Jain</span>
              </div>
            </div>
          </div>
          <div className="col-md-12 inner-container">
            <div className="col-md-1 no-padding time-desc d-inline-block">
              Cc
            </div>
            <div className="col-md-9 no-padding d-inline-block">
              <div className="email-box">
                <div className="email-icon">AJ</div>
                <span>Arpit Jain</span>
              </div>
            </div>
          </div>
          <div className="col-md-12 inner-container">
            <div className="col-md-1 no-padding time-desc d-inline-block">
              Cc
            </div>
            <div className="col-md-9 no-padding d-inline-block">
              <div className="email-box">
                <div className="email-icon">AJ</div>
                <span>Arpit Jain</span>
              </div>
            </div>
          </div>
          <div className="col-md-12 inner-container">
            <div className="col-md-1 no-padding time-desc">Email Text</div>
            <div className="email-format">
              <br />
              Lorem ipsum is dummy text in typesetting industry. Lorem ipsum is
              dummy text in typesetting industry. Lorem ipsum is dummy text in
              typesetting industry. Lorem ipsum is dummy text in typesetting
              industry. <br />
              <br />
              Regards,
              <br /> Aishwarya Chandan
            </div>
          </div>
          <div className="col-md-12 hr"></div>
          <button className="btn btn-primary email-btn">
            +&nbsp;&nbsp;Add New
          </button>
        </div>
      </>
    );
  }
}

export default EmailConfiguration;
