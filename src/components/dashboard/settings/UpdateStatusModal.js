import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import moment from "moment";
import ErrorBoundary from '../../../ErrorBoundary';

class UpdateStatusModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projectError: false,
      projectName: "",
      statusError: false,
      status: "",
      project: [],
      projectSuggestions: [],
      showList: false,
      taskStatus: [],
    };
  }

  render() {

    return (
      <>
      <ErrorBoundary>
        <Modal show={this.props.isEdit}
          dialogClassName="modal-90w status-modal"
          aria-labelledby="example-custom-modal-styling-title"

          onHide={this.props.handleCloseEditStatus}>
          <ErrorBoundary>
            <Modal.Header closeButton>
              <ErrorBoundary><Modal.Title> Edit Task Status</Modal.Title></ErrorBoundary>
          </Modal.Header>
          </ErrorBoundary>
          <ErrorBoundary>
          <Modal.Body>
            <div className="status-setting">
              <div className="row no-margin category">
                <div className="d-inline-block col-md-4 heading-text">
                </div>
              </div>
              <div className="category-box">
                <div className="col-md-12 no-padding">
                  <table className="table">

                    <thead>

                      <tr>
                        <th scope="col" style={{ width: "32%" }}>
                          Project Name{" "}

                        </th>
                        <th scope="col" style={{ width: "32%" }}>
                          Status{" "}

                        </th>
                        <th scope="col" style={{ width: "32%" }}>
                          Create  Date{" "}

                        </th>
                        <th>{" "}</th>
                      </tr>
                    </thead>

                    <tbody>

                      <tr>
                        <td scope="row">
                          {/* <input
                        className={`form-control ${
                          this.props.state.projectError ? " input-error-border" : ""
                        }`}
                        type="text"
                        value={this.props.state.projectName}
                        name="projectName"
                         onChange={e => this.props.handleEnterProjectName(e)}
                        placeholder="Project Name"
                      />{this.props.state.showList?
                          <div className="suggestion-holder">
                    {this.props.renderToSuggestions()}
                  </div>:null} */}
                          {this.props.projectName}
                        </td>
                        <td scope="row">
                          <input
                            className={`form-control ${
                              this.props.state.statusError ? " input-error-border" : ""
                              }`}
                            type="text"
                            value={this.props.state.status}
                            name="statusError"
                            onChange={e => this.props.handleEnterStatus(e)}
                            placeholder="Type status"
                          />

                        </td>
                        <td scope="row">{moment().format("DD MMM YYYY")}</td>
                        {/* <td scope="row">
                 
                      <button
                        className="btn btn-link"
                        onClick={this.toggleAddCategoryRow}
                      >
                        <i class="fa fa-trash" aria-hidden="true"></i>
                      </button>
                      </td>  */}
                        <td>
                          <button
                            className="btn btn-link"
                            onClick={this.props.editStatus}
                          >
                            <span>
                              <i class="fa fa-check" aria-hidden="true"></i>
                            </span>
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </Modal.Body>
          </ErrorBoundary>
        </Modal>
      </ErrorBoundary>
      </>
    );
  }
}

export default UpdateStatusModal;