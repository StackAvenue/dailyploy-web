import React from "react";
import { Modal } from "react-bootstrap";
import Close from "../../../assets/images/close.svg";

const EmailConfigurationModal = props => {
  return (
    <Modal
      show={props.state.resumeShow}
      className="modal-box"
      onHide={props.handleClose}
    >
      <div className="row no-margin modal-box">
        <div className="col-md-12 heading">
          <span className="heading text-titlize">{`${props.state.activeStatus} Daily Status Mail`}</span>
          <button
            className="btn btn-link float-right"
            onClick={props.handleClose}
          >
            <img src={Close} alt="close" />
          </button>
        </div>
        <div className="col-md-12 body">
          {`Are you sure? This will start ${props.state.activeStatus === "suspend" ? "stop sending" : "sending"
            } email of daily tasks you are
          working on.`}
        </div>
        <div className="col-md-12 btn-box">
          <div className="col-md-7 no-padding ml-auto footer-btns">
            {props.state.activeStatus === "suspend" ? (
              <button
                className="btn btn-primary ok"
                onClick={() => props.toggleActiveFlag(false)}
              >
                Ok
              </button>
            ) : (
                <button
                  className="btn btn-primary ok"
                  onClick={() => props.toggleActiveFlag(true)}
                >
                  Ok
                </button>
              )}
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

export default EmailConfigurationModal;
