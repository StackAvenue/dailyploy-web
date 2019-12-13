import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import Close from "../../assets/images/close.svg";
import Select from "react-dropdown-select";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import DailyPloySelect from "./../DailyPloySelect";

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
  };

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
                    <DailyPloySelect
                      className="select-memeber-project project"
                      options={this.props.projects}
                      placeholder="Select project"
                      onChange={value =>
                        this.props.handleChangeProjectSelect(value)
                      }
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
                  <span>Add</span>
                  {this.props.state.isLoading ? (
                    <Loader
                      type="Oval"
                      color="#FFFFFF"
                      height={20}
                      width={20}
                      className="d-inline-block login-signup-loader"
                    />
                  ) : null}
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
