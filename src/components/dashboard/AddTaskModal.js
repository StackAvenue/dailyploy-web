import React from "react";
import { Modal } from "react-bootstrap";
import DatePicker from "react-datepicker";
import TimePicker from "rc-time-picker";
import "rc-time-picker/assets/index.css";
import "react-datepicker/dist/react-datepicker.css";
import Close from "../../assets/images/close.svg";

const AddTaskModal = props => {
  return (
    <>
      <Modal
        className="project-modal"
        show={props.state.show}
        onHide={props.closeTaskModal}
      >
        <div className="row no-margin">
          <div className="col-md-12 header">
            <span>Add New Task</span>
            <button
              className="btn btn-link float-right"
              onClick={props.closeTaskModal}
            >
              <img src={Close} alt="close" />
            </button>
          </div>
          <div className="col-md-12 body">
            <div className="col-md-12 no-padding input-row">
              <div className="col-md-2 d-inline-block no-padding label">
                Task
              </div>
              <div className="col-md-10 d-inline-block">
                <input
                  type="text"
                  name="taskName"
                  // value={props.state.taskName}
                  onChange={props.handleInputChange}
                  placeholder="Task name..."
                  className="form-control"
                />
              </div>
            </div>
            <div className="col-md-12 no-padding input-row">
              <div className="col-md-2 d-inline-block no-padding label">
                Project
              </div>
              <div className="col-md-10 d-inline-block">
                <select
                  name="projectName"
                  // value={props.state.projectName}
                  onChange={props.handleInputChange}
                  className="form-control"
                >
                  <option>Select Project...</option>
                  {props.project.map(project => {
                    return (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
            <div className="col-md-12 no-padding input-row">
              <div className="col-md-2 d-inline-block no-padding label">
                Users
              </div>
              <div className="col-md-10 d-inline-block">
                <select
                  name="taskUser"
                  // value={props.state.taskUser}
                  onChange={props.handleUserSelect}
                  className="form-control"
                >
                  <option>Select Users...</option>
                  {props.user.map(user => {
                    return (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
            <div className="col-md-12 no-padding input-row">
              <div className="col-md-2 d-inline-block no-padding label">
                Date
              </div>
              <div className="col-md-10 d-inline-block">
                <div
                  className="col-md-6 d-inline-block"
                  style={{ paddingLeft: "0" }}
                >
                  <DatePicker
                    selected={props.state.dateFrom}
                    onChange={props.handleDateFrom}
                    placeholderText="Select From Date"
                  />
                </div>
                <div
                  className="col-md-6 d-inline-block"
                  style={{ paddingRight: "0" }}
                >
                  <DatePicker
                    selected={props.state.dateTo}
                    onChange={props.handleDateTo}
                    placeholderText="Select To Date"
                  />
                </div>
              </div>
            </div>
            <div className="col-md-12 no-padding input-row">
              <div className="col-md-2 d-inline-block no-padding label">
                Time
              </div>
              <div className="col-md-10 d-inline-block">
                <div
                  className="col-md-4 d-inline-block"
                  style={{ paddingLeft: "0" }}
                >
                  <TimePicker
                    placeholder="Time From"
                    showSecond={false}
                    className="xxx"
                    onChange={props.handleTimeFrom}
                    format={props.format}
                    use12Hours
                    inputReadOnly
                  />
                </div>
                <div
                  className="col-md-4 d-inline-block"
                  style={{ paddingRight: "0" }}
                >
                  <TimePicker
                    placeholder="Time To"
                    showSecond={false}
                    className="xxx"
                    onChange={props.handleTimeTo}
                    format={props.format}
                    use12Hours
                    inputReadOnly
                  />
                </div>
              </div>
            </div>
            <div className="col-md-12 row no-margin no-padding input-row">
              <div className="col-md-2 no-padding label">Comments</div>
              <div className="col-md-10">
                <textarea
                  name="comments"
                  // value={props.state.comments}
                  onChange={props.handleInputChange}
                  className="form-control"
                  rows="3"
                  placeholder="Write Here"
                />
              </div>
            </div>

            <div className="col-md-12 no-padding input-row">
              <div className="col-md-4 ml-auto">
                <button
                  type="button"
                  className="btn col-md-5 button1 btn-primary"
                  onClick={props.addTask}
                >
                  Add
                </button>
                <button
                  type="button"
                  className="btn col-md-6 button2 btn-primary"
                  onClick={props.closeTaskModal}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AddTaskModal;
