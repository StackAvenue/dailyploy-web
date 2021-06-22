import React from "react";
import { Modal } from "react-bootstrap";
import Close from "../../../assets/images/close.svg";
import PropTypes from 'prop-types';
import ErrorBoundary from '../../../ErrorBoundary';

const EmailConfigurationModal = props => {
  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
};

EmailConfigurationModal.propTypes = {
  state: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
  toggleActiveFlag: PropTypes.func.isRequired
}

export default EmailConfigurationModal;
