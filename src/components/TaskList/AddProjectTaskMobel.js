
import React, { Component } from "react";
import { Modal, Button, NavDropdown } from "react-bootstrap";
import DatePicker from "react-datepicker";
// import "rc-time-picker/assets/index.css";
import "../../assets/css/TaskProjectList.scss";
import "../../assets/css/AddProjectTaskModel.scss"
import {
  PRIORITIES,
  DATE_FORMAT3,
  DATE_FORMAT1,
} from "./../../utils/Constants";
//import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import ErrorBoundary from '../../ErrorBoundary';


class AddProjectTaskMobel extends React.Component {
  constructor(props) {
    super(props);
    this.calendarFromRef = React.createRef();
    this.calendarToRef = React.createRef();
    this.onImageDropRef = React.createRef();
    this.state = {
      members: [],
      project: "",
      showProjectSuggestion: false,
      projectSuggestions: [],
      membersSuggestions: [],
      selectedMembers: [],
      projectSearchText: "",
      memberSearchText: "",
      isBorder: false,
      border: "solid 1px #d1d1d1",
      notFound: "hide",
      memberNotFound: "hide",
      taskName: "",
      comments: "",
      pictures: [],
    };
  }

  handleDateChangeRaw = (e) => {
    e.preventDefault();
  };

  openFromCalender = () => {
    this.calendarFromRef.current.setOpen(true);
  };
  openToCalender = () => {
    this.calendarToRef.current.setOpen(true);
  };

  handleInputChange = async (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
    this.props.handleInputChange(e)
  };

  onBlurInput = () => {
    this.props.handleTaskNameChange("taskName", this.state.taskName);
  };



  render() {
    const { props } = this;
    return (
      <div class="addProjectDiv">
        <ErrorBoundary>
          <Modal show={this.props.show} onHide={this.props.closeTaskModal} animation={false}>


            <Modal.Header closeButton>
              <Modal.Title>Add Task</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form>
                <div class="form-group">
                  <label for="">
                    <span>Task</span>
                  </label>
                  <input
                    type="text"
                    name="taskName"
                    value={this.props.state.taskName}
                    onChange={props.handleInputChange}
                    //  value={this.state.taskName}
                    onChange={e => this.handleInputChange(e)}
                    onBlur={this.onBlurInput}
                    placeholder="Task Name"
                    className="form-control"
                    ref={input => {
                      this.nameInput = input;
                    }}
                    defaultValue=""
                    ref={input => input && input.focus()}
                  />
                </div>

                <div class="form-group">
                  <label for="">
                    Date From
                              </label>
                  <br />
                  <ErrorBoundary>
                    <DatePicker
                      className="form-control addProjectDiv"
                      ref={this.calendarFromRef}
                      selected={props.state.dateFrom}
                      onChange={this.props.handleDateFrom}
                      maxDate={props.state.dateTo}
                      placeholderText="Select Date"
                      onChangeRaw={this.handleDateChangeRaw}
                    />
                  </ErrorBoundary>
                  <span className="task-date-picker-icon">
                    <i
                      onClick={this.openFromCalender}
                      //className="fa fa-calendar"
                      aria-hidden="true"
                    ></i>
                  </span>

                </div>

                <div class="form-group">
                  <label for="">
                    <span> Date To</span>
                  </label>
                  <br />
                  <ErrorBoundary>
                    <DatePicker
                      className="form-control addProjectDiv"
                      ref={this.calendarToRef}
                      minDate={props.state.dateFrom}
                      selected={props.state.dateTo}
                      onChange={props.handleDateTo}
                      placeholderText="Select Date"
                      //disabled={props.state.disabledDateTo}
                      onChangeRaw={this.handleDateChangeRaw}
                    />
                  </ErrorBoundary>
                  <span
                    className="task-date-picker-icon"
                  >
                    <i
                      onClick={this.openToCalender}
                      //className="fa fa-calendar"
                      aria-hidden="true"
                    ></i>
                  </span>

                </div>

              </form>
            </Modal.Body>
            <Modal.Footer>

              <Button variant="primary" onClick={this.props.handleSaveTaskData}>Save</Button>
              {/* <Button variant="secondary" onClick={this.props.closeTaskModal}>Close</Button> */}
            </Modal.Footer>

          </Modal>
        </ErrorBoundary>

      </div>
    );
  }
}

export default AddProjectTaskMobel;
