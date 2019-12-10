import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import Close from "../../assets/images/close.svg";
import Select from "react-dropdown-select";

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
    this.hours = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    this.state = {
      value: []
    };
  }

  autoSearchSuggestion = () => {
    return (
      <>
        {this.props.state.suggestions ? (
          <ul>
            {this.props.state.suggestions.map((option, idx) => {
              return (
                <li
                  key={idx}
                  onClick={() => this.props.selectAutoSuggestion(option)}
                >
                  {option}
                </li>
              );
            })}
          </ul>
        ) : null}
      </>
    );
    // console.log("suggestions 1", this.props.state.suggestions);
  };

  // selectAutoSuggestion = option => {
  //   console.log("option", option);
  // };

  render() {
    const props = this.props.state;
    return (
      <>
        <Modal
          dialogClassName="modal-90w member-modal"
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
                  <th scope="col">
                    Name<span className="error-warning">*</span>
                  </th>
                  <th scope="col">
                    Email ID<span className="error-warning">*</span>
                  </th>
                  <th scope="col">
                    Role<span className="error-warning">*</span>
                  </th>
                  <th scope="col">
                    Working Hours<span className="error-warning">*</span>
                  </th>
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
                    <div className="auto-search">
                      {this.autoSearchSuggestion()}
                    </div>
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
                  <td>
                    <select
                      className="form-control role"
                      name="memberRole"
                      value={this.props.state.memberRole}
                      onChange={this.props.handleChangeMemberInput}
                    >
                      <option value="">Select</option>
                      <option value="1">Admin</option>
                      <option value="2">User</option>
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
                      {this.hours.map((hour, index) => (
                        <option key={index} value={hour}>
                          {hour}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    {/* <select
                      className="form-control project text-titlize"
                      name="memberProject"
                      value={this.props.state.memberProject}
                      onChange={this.props.handleChangeMemberInput}>
                      <option value="">Select Project</option>
                      {this.props.projects.map((project, index) => (
                        <option key={index} value={project.id}>
                          {project.name}
                        </option>
                      ))}
                    </select> */}
                    <Select
                      placeholder="Select"
                      color="#0074D9"
                      searchBy="name"
                      dropdownHandle={true}
                      direction="ltr"
                      labelField="name"
                      valueField="id"
                      options={this.props.projects}
                      onChange={value =>
                        this.props.handleChangeProjectSelect(value)
                      }
                      noDataLabel="No matches found"
                      closeOnSelect={true}
                      name="memberProject"
                      dropdownHeight="100px"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="col-md-12 no-padding bottom-button">
              <div className="col-md-4 ml-auto">
                <button
                  type="button"
                  className="btn col-md-5 button1 btn-primary"
                  disabled={`${
                    this.props.state.memberWorkingHours &&
                    this.props.state.memberRole &&
                    this.props.state.memberEmail &&
                    this.props.state.memberName
                      ? ""
                      : "disabled"
                  }`}
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
