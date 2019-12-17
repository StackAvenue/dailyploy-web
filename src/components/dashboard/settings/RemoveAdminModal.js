import React from "react";
import { Modal } from "react-bootstrap";
import Close from "../../../assets/images/close.svg";
import { textTitlize } from "./../../../utils/function";

const RemoveAdminModal = props => {
  return (
    <Modal
      className="modal-box"
      show={props.state.removeShow}
      onHide={props.handleClose}
    >
      <div className="row no-margin ">
        <div className="col-md-12 heading">
          <span className="heading">Remove Admin</span>
          <button
            className="btn btn-link float-right"
            onClick={props.handleClose}
          >
            <img src={Close} alt="close" />
          </button>
        </div>
        <div className="col-md-12 body">
          {`Are you sure you want to remove ${textTitlize(
            props.state.adminUserName
          )} from workspace Admin users?`}
        </div>

        <div className="col-md-12 btn-box">
          <div className="col-md-7 no-padding ml-auto">
            <button className="btn btn-primary ok" onClick={props.removeAdmin}>
              Confirm
            </button>
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

export default RemoveAdminModal;
