import React, { Component } from "react";
import DeleteWorkspaceModal from "./DeleteWorkspaceModal";

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
          <div className="col-md-12 inner-box">
            <div className="col-md-2 d-inline-block no-padding name">
              Workspace Name
            </div>
            <div className="col-md-5 d-inline-block">
              <input
                type="text"
                placeholder="Workspace Name"
                className="form-control input"
              />
            </div>
          </div>
          <div className="col-md-12 inner-box">
            <div className="col-md-2 d-inline-block no-padding name">
              Workspace URL
            </div>
            <div className="col-md-5 d-inline-block">
              <input
                type="text"
                placeholder="Workspace URL"
                className="form-control input"
              />
            </div>
            <div className="col-md-2 d-inline-block name no-padding">
              .dailyploy.com
            </div>
          </div>
          <div className="col-md-12 inner-box">
            <div className="col-md-2 d-inline-block no-padding name">
              Workspace Owner
            </div>
            <div className="col-md-5 d-inline-block">
              <select className="form-control input">
                <option>Gaurav Gandhi</option>
                <option>Arpit Jain</option>
              </select>
            </div>
          </div>
          <div className="col-md-12 box-btn">
            <button className="btn btn-default button">Save</button>
          </div>
        </div>
        <div className="col-md-12 hr"></div>
        <div className="col-md-12 heading">Delete Workspace</div>
        <div className="col-md-12 delete-text">
          Deleting a Dailyploy workspace cannot be undone. All data will be
          deleted and irretrievable.
          <button className="btn btn-link" onClick={this.handleShow}>
            Delete Team
          </button>
          <DeleteWorkspaceModal
            state={this.state}
            handleClose={this.handleClose}
          />
        </div>
      </>
    );
  }
}

export default GeneralSettings;
