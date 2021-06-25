import React from "react";
import { Modal } from "react-bootstrap";
import Close from "../../../assets/images/close.svg";
import cookie from "react-cookies";


const hours = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const EditMemberModal = props => {
  const {
    memberName,
    memberEmail,
    memberRole,
    memberHours,
    memberProjects,
    memberExpense
  } = props.state;
  return (
    <Modal
      className="edit-member-modal"
      show={props.show}
      onHide={props.handleClose}
    >
      <div className="row no-margin">
        <div className="col-md-12 header">
          <span>Edit Member</span>
          <button
            className="btn btn-link float-right"
            onClick={props.handleClose}
          >
            <img src={Close} alt="close" />
          </button>
        </div>
        <div className="col-md-12 body">
          <div className="col-md-12 no-padding input-row">
            <div className="col-md-3 d-inline-block no-padding label">
              Member Name
            </div>
            <div className="col-md-7 d-inline-block">
              <span className="text-titlize">{memberName}</span>
            </div>
          </div>
          <div className="col-md-12 no-padding input-row">
            <div className="col-md-3 d-inline-block no-padding label">
              Email ID
            </div>
            <div className="col-md-7 d-inline-block">
              <span>{memberEmail}</span>
            </div>
          </div>
          <div className="col-md-12 no-padding input-row">
            <div className="col-md-3 d-inline-block no-padding label">Role</div>
            <div className="col-md-3 d-inline-block">
              <select
                value={memberRole}
                name="memberRole"
                onChange={props.editMemberHandleChange}
              >
                <option value="admin">Admin</option>
                <option value="member">Member</option>
              </select>
            </div>
          </div>
          <div className="col-md-12 no-padding input-row">
            <div className="col-md-3 d-inline-block no-padding label">
              Working hours
            </div>
            <div className="col-md-3 d-inline-block">
              <select
                value={memberHours}
                name="memberHours"
                onChange={props.editMemberHandleChange}
              >
                {hours.map((value, index) => (
                  <option key={index} value={value}>{`${value}hr`}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-md-12 no-padding input-row">
            <div className="col-md-3 d-inline-block no-padding label">
              Hourly Expense ({cookie.load("currency")})
            </div>
            <div className="col-md-3 d-inline-block">
              <input
                className={"form-control expense"}
                name="memberExpense"
                value={memberExpense}
                onChange={props.editMemberHandleChange}
              />
            </div>
          </div>
          <div className="col-md-12 no-padding input-row">
            <div
              className="col-md-3 d-inline-block no-padding label"
              style={{ verticalAlign: "top" }}
            >
              Projects
            </div>
            <div className="col-md-7 d-inline-block text-titlize">
              <MemberProject projects={memberProjects} />
            </div>
          </div>
          <div className="col-md-12 no-padding input-row">
            <div className="col-md-5 ml-auto">
              <button
                type="button"
                className="btn col-md-5 button1 btn-primary"
                onClick={props.editMember}
              >
                Save
              </button>
              <button
                type="button"
                className="btn col-md-6 button2 btn-primary"
                onClick={props.handleClose}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

const MemberProject = props => {
  return props.projects.map(project => project.name).join(", ");
};



export default EditMemberModal;
