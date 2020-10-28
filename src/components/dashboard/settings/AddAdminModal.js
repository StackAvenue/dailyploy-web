import React from "react";
import { Modal } from "react-bootstrap";
import Close from "../../../assets/images/close.svg";

const AddAdminModal = props => {
  return (
    <Modal
      className="add-admin-modal"
      show={props.state.addAdminShow}
      onHide={props.handleClose}
    >
      <div className="row no-margin box">
        <div className="col-md-12 box-top">
          <span className="heading">Add New Admin</span>
          <button
            className="btn btn-link float-right"
            onClick={props.handleClose}
          >
            <img src={Close} alt="close" />
          </button>
        </div>
        <div className="col-md-11 no-padding">
          <input
            type="text"
            placeholder="Search for User"
            className="form-control input"
            name="addAdminEmail"
            onChange={props.onChange}
            value={props.state.addAdminEmail}
          />
          <div
            className={`auto-search ${props.state.suggestions.length > 0 ? "border-add" : null
              }`}
          >
            {props.autoSearchSuggestion()}
          </div>
        </div>
        <div className="col-md-12 btn-box">
          <div className="col-md-7 no-padding ml-auto">
            <button className="btn btn-primary add" onClick={props.addAdmin} disabled={props.state.isAddNewAdmin} >
              Add
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

export default AddAdminModal;
