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
      <div className="row no-margin " style={{padding: "3%"}}>
        <div className="col-md-12 heading" style={{padding: "1%"}}>
          <span className="heading"><h3>Remove Admin</h3></span>
          <button
            className="btn btn-link float-right"
            onClick={props.handleClose}
            style={{marginTop: "-12%",
              position: "absolute",
              right: "-9px"}}
          >
            <img src={Close} alt="close" />
          </button>
        </div>
        <div className="col-md-12 body" style={{paddingTop: "2%",
          paddingBottom: "2%"}}>
          {`Are you sure you want to remove ${textTitlize(
            props.state.adminUserName
          )} from workspace Admin users?`}
        </div>

        <div className="col-md-12 btn-box" style={{ marginTop: "4%" }}>
          <div className="col-md-7 no-padding ml-auto">
            <button className="btn btn-primary ok" onClick={props.removeAdmin} disabled={props.state.isRemovingAdmin} style={{ marginLeft: "-36%" }}>
              Confirm
            </button>
            <button
              className="btn btn-primary cancel"
              onClick={props.handleClose}
              style={{ marginLeft: "18%" }}
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
