import React from "react";
import { Modal } from "react-bootstrap";
import Loader from "react-loader-spinner";

const AddWorkspace = props => {
  return (
    <Modal
      show={props.state.show}
      onHide={props.onHideModal}
      className="workspace-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>Add New Workspace</Modal.Title>
      </Modal.Header>

      <div className="col-md-12 worksapce-tab">
        <div className="col-md-12 no-padding">
          <div className="col-md-12 name">
            Workspace Name
            {props.state.nameError ? (
              <span className="error-warning">{props.state.nameError}</span>
            ) : null}
          </div>
          <div className="col-md-12 input">
            <input
              type="text"
              placeholder="Write Here"
              className="form-control"
              name="workspaceName"
              onChange={props.handleInputChange}
            />
          </div>
        </div>
        <div className="col-md-12 text-right no-padding">
          <button
            className="btn btn-primary create-btn"
            onClick={props.createWorkspace}
            disabled={props.state.isLoading}
          >
            Create
            {props.state.isLoading ? (
              <Loader
                type="Oval"
                color="#FFFFFF"
                height={20}
                width={20}
                className="no-padding d-inline-block login-signup-loader"
              />
            ) : null}
          </button>
          <button
            className="btn btn-primary cancel-btn"
            onClick={props.onHideModal}
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AddWorkspace;
