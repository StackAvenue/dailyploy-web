import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import Close from "../../assets/images/close.svg";

class AddMemberModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: []
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
            {/* <div className="row col-md-12 heading no-margin">
            <div className="col-md-3">Name*</div>
            <div className="col-md-4">Email ID*</div>
            <div className="col-md-1">Access*</div>
            <div className="col-md-1">Role</div>
            <div className="col-md-1">Working Hours</div>
            <div className="col-md-2">Project</div>
          </div> */}
            <table class="table heading">
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
                      name="name"
                      type="text"
                      placeholder="Name"
                    />
                  </td>
                  <td>
                    <input
                      className="form-control email"
                      name="email"
                      type="text"
                      placeholder="Email ID"
                    />
                  </td>
                  <td style={{ "padding-top": "20px" }}>
                    <div class="form-check form-check-inline">
                      <input
                        class="form-check-input"
                        type="radio"
                        name="inlineRadioOptions"
                        id="inlineRadio1"
                        value="option1"
                      />
                      <label class="form-check-label" for="inlineRadio1">
                        View
                      </label>
                    </div>
                    <div class="form-check form-check-inline">
                      <input
                        class="form-check-input"
                        type="radio"
                        name="inlineRadioOptions"
                        id="inlineRadio2"
                        value="option2"
                      />
                      <label class="form-check-label" for="inlineRadio2">
                        Edit
                      </label>
                    </div>
                  </td>
                  <td>
                    <select className="form-control role" name="role">
                      <option value="">Select</option>
                      <option value="admin">Admin</option>
                      <option value="member">Member</option>
                    </select>
                  </td>
                  <td>
                    <select className="form-control role" name="workingHours">
                      <option value="">Select</option>
                      <option value="8">8hr</option>
                      <option value="9">9hr</option>
                    </select>
                  </td>
                  <td>
                    <select className="form-control project" name="project">
                      <option value="">Select</option>
                      <option value="8">Dailyploy</option>
                      <option value="9">DealSignal</option>
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
                >
                  Add
                </button>
                <button
                  type="button"
                  className="btn col-md-6 button2 btn-primary"
                  onClick={this.props.closeTaskModal}
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
