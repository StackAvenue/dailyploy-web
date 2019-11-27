import React, { Component } from "react";

class PrivacySettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      setShow: false
    };
  }
  handleClose = () => {
    this.setState({
      show: false
    });
  };
  handleShow = () => {
    this.setState({
      setShow: true,
      show: true
    });
  };
  render() {
    return <></>;
  }
}

export default PrivacySettings;
