import React from "react";
import { Modal } from "react-bootstrap";
import Close from "../../../assets/images/close.svg";

const DeleteWorkspaceModal = props => {
  return (
    <Modal show={props.state.show} onHide={props.handleClose}>
      <div className="row no-margin modal-box">
        <div className="col-md-12 heading">
          <span className="heading">Delete Workspace</span>
          <button
            className="btn btn-link float-right"
            onClick={props.handleClose}
          >
            <img src={Close} alt="close" />
          </button>
        </div>
        <div className="col-md-12 body">
          Are you sure? This will delete all of the Aviabird workspace
          information and immediately close the account. Please contact
          <span>contact@stack-avenue.com</span>
        </div>
        <div className="col-md-12 btn-box">
          <div className="col-md-6 no-padding ml-auto">
            <button className="btn btn-primary ok">Ok</button>
            <button
              className="btn btn-primary cancel"
              onClick={props.handleClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteWorkspaceModal;
