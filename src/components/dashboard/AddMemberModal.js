import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import Close from "../../assets/images/close.svg";

const RadioOptions = ({ options, selected, onChange }) => {
  return (
    <div className="form-check form-check-inline">
      {options.map((choice, index) => (
        <div key={index}>
          <input
            className="form-check-input"
            type="radio"
            name="access"
            value={choice.value}
            key={index}
            checked={choice.value}
            onChange={onChange}
          />
          <label className="form-check-label">{choice.text}</label>
        </div>
      ))}
    </div>
  );
};

class AddMemberModal extends Component {
  constructor(props) {
    super(props);
    this.choices = [
      { text: "View", value: "view" },
      { text: "Edit", value: "edit" },
    ];
    this.state = {
      value: [],
    };
  }

  render() {
    return (
      <>
        <Modal
          dialogClassName="modal-90w project-modal member-modal"
          aria-labelledby="example-custom-modal-styling-title"
          show={this.props.state.memberShow}
          onHide={this.props.handleClose}
        >
          <div className="row no-margin">
            <div className="col-md-12 header">
              <span>Add New Member</span>
              <button
                className="btn btn-link float-right"
                onClick={this.props.handleClose}
              >
                <img src={Close} alt="close" />
              </button>
            </div>
            <table className="table heading">
              <thead>
                <tr>
                  <th scope="col">Name*</th>
                  <th scope="col">Email ID*</th>
                  <th scope="col">Access*</th>
                  <th scope="col">Role</th>
                  <th scope="col">Working Hours</th>
                  <th scope="col">Project</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <input
                      className="form-control name"
                      name="memberName"
                      type="text"
                      placeholder="Name"
                      value={this.props.state.memberName}
                      onChange={this.props.handleChangeMemberInput}
                    />
                  </td>
                  <td>
                    <input
                      className="form-control email"
                      name="memberEmail"
                      type="text"
                      placeholder="Email ID"
                      value={this.props.state.memberEmail}
                      onChange={this.props.handleChangeMemberInput}
                    />
                  </td>
                  <td style={{ paddingTop: "20px" }}>
                    <RadioOptions
                      options={this.choices}
                      onChange={this.props.handleChangeMemberRadio}
                      selected={this.props.state.memberAccess}
                    />
                  </td>
                  <td>
                    <select
                      className="form-control role"
                      name="memberRole"
                      value={this.props.state.memberRole}
                      onChange={this.props.handleChangeMemberInput}
                    >
                      <option value="">Select</option>
                      <option value="admin">Admin</option>
                      <option value="member">Member</option>
                    </select>
                  </td>
                  <td>
                    <select
                      className="form-control role"
                      name="memberWorkingHours"
                      value={this.props.state.memberWorkingHours}
                      onChange={this.props.handleChangeMemberInput}
                    >
                      <option value="">Select</option>
                      <option value="8">8hr</option>
                      <option value="9">9hr</option>
                    </select>
                  </td>
                  <td>
                    <select
                      className="form-control project"
                      name="memberProject"
                      value={this.props.state.memberProject}
                      onChange={this.props.handleChangeMemberInput}
                    >
                      <option value="">Select Project</option>
                      {this.props.projects.map(project => (
                        <option value={project.id}>{project.name}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="col-md-12 no-padding bottom-button">
              <div className="col-md-4 ml-auto">
                <button
                  type="button"
                  className="btn col-md-5 button1 btn-primary"
                  onClick={this.props.addMember}
                >
                  Add
                </button>
                <button
                  type="button"
                  className="btn col-md-6 button2 btn-primary"
                  onClick={this.props.handleClose}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </Modal>
      </>
    );
  }
}

export default AddMemberModal;
