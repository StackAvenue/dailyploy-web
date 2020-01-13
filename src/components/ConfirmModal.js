import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import Close from "./../assets/images/close.svg";

class ConfirmModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: false
    };
  }

  render() {
    const { props } = this;
    return (
      <>
        <Modal
          className="confirm-modal"
          show={props.show}
          style={{ paddingTop: "1.5%", paddingBottom: "30px" }}
        >
          <div className="row no-margin">
            <div className="col-md-12 d-inline-block header text-titlize">
              <div className="d-inline-block" style={{ width: "60%" }}>
                <span>{props.title ? props.title : null}</span>
              </div>
              <button
                className="d-inline-block btn btn-link float-right"
                onClick={props.closeModal}
              >
                <img src={Close} alt="close" />
              </button>
            </div>
            <div className="col-md-12 confirm-msg no-padding">
              {props.message ? <span>{props.message}</span> : null}

              <div className="col-md-12 action-btn">
                <button
                  type="button"
                  className="btn pull-right button3 btn-primary"
                  onClick={props.closeModal ? props.closeModal : null}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="button2 pull-right btn-primary text-titlize"
                  onClick={props.onClick}
                >
                  {props.buttonText}
                </button>
              </div>
            </div>
          </div>
        </Modal>
      </>
    );
  }
}

export default ConfirmModal;
