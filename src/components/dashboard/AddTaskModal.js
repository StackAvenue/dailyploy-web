import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import DatePicker from "react-datepicker";
import TimePicker from "rc-time-picker";
import "rc-time-picker/assets/index.css";
import { PRIORITIES } from "./../../utils/Constants";
import "react-datepicker/dist/react-datepicker.css";
import Close from "../../assets/images/close.svg";
import moment from "moment";
import DailyPloySelect from "./../DailyPloySelect";

class AddTaskModal extends Component {
  constructor(props) {
    super(props);
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
      memberNotFound: "hide"
    };
  }

  disabledHours = () => {
    var time = this.props.state.timeFrom;
    if (time) {
      var hr = time.split(":")[0];
      hr = Number(hr);
      var hoursArr = Array.from({ length: `${hr}` }, (v, k) => k);
      return hoursArr;
    }
    return [];
  };

  disabledMinutes = () => {
    var fTime = this.props.state.timeFrom;
    var tTime = this.props.state.timeTo;
    if (fTime && !tTime) {
      var min = fTime.split(":")[1];
      min = Number(min) + 1;
      var minArr = Array.from({ length: `${min}` }, (v, k) => k);
      return minArr;
    } else if (fTime && tTime && fTime.split(":")[0] === tTime.split(":")[0]) {
      var min = fTime.split(":")[1];
      min = Number(min) + 1;
      var minArr = Array.from({ length: `${min}` }, (v, k) => k);
      return minArr;
    }
    return [];
  };

  handleDateChangeRaw = e => {
    e.preventDefault();
  };

  render() {
    const { props } = this;
    return (
      <>
        <Modal
          className="task-modal"
          show={props.show}
          onHide={props.closeTaskModal}
        >
          <div className="row no-margin">
            <div className="col-md-12 header text-titlize">
              <div className={`d-inline-block`}>
                <span>
                  {" "}
                  {props.state.taskButton === "Add"
                    ? "Add New Task"
                    : "Edit Task"}
                </span>
              </div>
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
                    value={props.state.taskName}
                    onChange={props.handleInputChange}
                    placeholder="Task name..."
                    className="form-control"
                  />
                </div>

                {this.props.state.errors.taskNameError ? (
                  <div className="col-md-12">
                    <div className="col-md-2 d-inline-block no-padding"></div>
                    <div className="col-md- d-inline-block no-padding">
                      <span className="error-warning">
                        {this.props.state.errors.taskNameError}
                      </span>
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="col-md-12 no-padding input-row">
                <div className="col-md-2 d-inline-block no-padding label">
                  Project
                </div>
                <div
                  className={`col-md-10 d-inline-block ${
                    props.state.taskButton !== "Add"
                      ? "disable-project-select"
                      : ""
                  }`}
                >
                  <DailyPloySelect
                    options={this.props.state.memberProjects}
                    placeholder="Select project"
                    label="name"
                    className="suggestion-z-index-100"
                    default={this.props.state.project}
                    iconType="block"
                    onChange={this.props.handleProjectSelect}
                  />
                </div>
                {this.props.state.errors.projectError ? (
                  <div className="col-md-12">
                    <div className="col-md-2 d-inline-block no-padding"></div>
                    <div className="col-md-10 d-inline-block no-padding">
                      <span className="error-warning">
                        {this.props.state.errors.projectError}
                      </span>
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="col-md-12 no-padding input-row">
                <div className="col-md-2 d-inline-block no-padding label">
                  Category
                </div>
                <div className="col-md-10 d-inline-block">
                  <DailyPloySelect
                    options={this.props.state.taskCategories}
                    placeholder="Select category"
                    className="suggestion-z-index-50"
                    default={this.props.state.taskCategorie}
                    onChange={this.props.handleCategoryChange}
                    canAdd={true}
                    addNew={this.props.addCategory}
                  />
                </div>
                {this.props.state.errors.categoryError ? (
                  <div className="col-md-12">
                    <div className="col-md-2 d-inline-block no-padding"></div>
                    <div className="col-md-10 d-inline-block no-padding">
                      <span className="error-warning">
                        {this.props.state.errors.categoryError}
                      </span>
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="col-md-12 no-padding input-row">
                <div className="col-md-2 d-inline-block no-padding label">
                  Priority
                </div>
                <div className="col-md-10 d-inline-block">
                  <DailyPloySelect
                    options={PRIORITIES}
                    placeholder="Select priority"
                    iconType="circle"
                    default={this.props.state.taskPrioritie}
                    name="priorityName"
                    label="label"
                    suggesionBy="label"
                    onChange={this.props.handlePrioritiesChange}
                  />
                </div>
              </div>

              <div className="col-md-12 no-padding input-row">
                <div className="col-md-2 d-inline-block no-padding label">
                  Member
                </div>
                <div className="col-md-10 d-inline-block">
                  <DailyPloySelect
                    options={this.props.modalMemberSearchOptions}
                    placeholder="Select Member"
                    default={this.props.state.selectedMembers[0]}
                    icon="fa fa-user"
                    onChange={this.props.handleMemberSelect}
                  />
                </div>
                {this.props.state.errors.memberError ? (
                  <div className="col-md-12">
                    <div className="col-md-2 d-inline-block no-padding"></div>
                    <div className="col-md- d-inline-block no-padding">
                      <span className="error-warning">
                        {this.props.state.errors.memberError}
                      </span>
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="col-md-12 no-padding input-row">
                <div className="col-md-2 d-inline-block no-padding label">
                  Date
                </div>
                <div className="col-md-10 d-inline-block no-padding">
                  <div className="col-md-12 d-inline-block no-padding">
                    <div className="col-md-6 d-inline-block task-datepicker">
                      <div className="d-inline-block label date-text-light">
                        <span>From:</span>
                      </div>
                      <div className="d-inline-block picker">
                        <DatePicker
                          selected={props.state.dateFrom}
                          onChange={props.handleDateFrom}
                          maxDate={props.state.dateTo}
                          placeholderText="Select Date"
                          onChangeRaw={this.handleDateChangeRaw}
                        />
                      </div>
                    </div>
                    <div className="col-md-6 d-inline-block task-datepicker">
                      <div className="d-inline-block label date-text-light ">
                        <span>To:</span>
                      </div>
                      <div className="d-inline-block picker">
                        <DatePicker
                          minDate={props.state.dateFrom}
                          selected={props.state.dateTo}
                          onChange={props.handleDateTo}
                          placeholderText="Select Date"
                          disabled={props.state.disabledDateTo}
                          onChangeRaw={this.handleDateChangeRaw}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {this.props.state.errors.dateFromError ||
                this.props.state.errors.dateToError ? (
                  <div className="col-md-12">
                    <div className="col-md-2 d-inline-block no-padding"></div>
                    <div className="col-md-5 d-inline-block no-padding">
                      <span className="error-warning">
                        {this.props.state.errors.dateFromError}
                      </span>
                    </div>
                    <div className="col-md-5 d-inline-block no-padding">
                      <span className="error-warning">
                        {this.props.state.errors.dateToError}
                      </span>
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="col-md-12 no-padding input-row">
                <div className="col-md-2 d-inline-block no-padding label">
                  Time
                </div>
                <div className="col-md-10 d-inline-block">
                  <div className="col-md-12 d-inline-block no-padding">
                    <div className="col-md-5 d-inline-block no-padding">
                      <div className="col-md-3 no-padding d-inline-block date-text-light">
                        <span>From:</span>
                      </div>
                      <div
                        className="col-md-7 d-inline-block time-picker-container"
                        style={{ paddingRight: "0" }}
                      >
                        <TimePicker
                          placeholder="Select"
                          value={this.props.state.timeDateFrom}
                          showSecond={false}
                          onChange={props.handleTimeFrom}
                          format={props.format}
                        />
                      </div>
                    </div>
                    <div className="col-md-1 d-inline-block no-padding">-</div>
                    <div className="col-md-5 d-inline-block no-padding">
                      <div className="col-md-2 no-padding d-inline-block date-text-light">
                        <span>To:</span>
                      </div>
                      <div
                        className="col-md-7 d-inline-block time-picker-container"
                        style={{ paddingRight: "0" }}
                      >
                        <TimePicker
                          value={this.props.state.timeDateTo}
                          placeholder="Select"
                          showSecond={false}
                          onChange={props.handleTimeTo}
                          disabledMinutes={this.disabledMinutes}
                          disabledHours={this.disabledHours}
                          format={props.format}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {this.props.state.errors.timeFromError ||
                this.props.state.errors.timeToError ? (
                  <div className="col-md-12 d-inline-block no-padding">
                    <div className="col-md-2 d-inline-block no-padding"></div>
                    <div className="col-md-4 d-inline-block no-padding">
                      <span className="error-warning">
                        {this.props.state.errors.timeFromError}
                      </span>
                    </div>
                    <div className="col-md-4 d-inline-block no-padding">
                      <span className="error-warning">
                        {this.props.state.errors.timeToError}
                      </span>
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="col-md-12 row no-margin no-padding input-row">
                <div className="col-md-2 no-padding label">Comments</div>
                <div className="col-md-10">
                  <textarea
                    name="comments"
                    value={props.state.comments}
                    onChange={props.handleInputChange}
                    className="form-control"
                    rows="2"
                    placeholder="Write Here"
                  />
                </div>
              </div>

              <div className="no-padding input-row">
                <div className="action-btn">
                  <button
                    type="button"
                    className="button3 btn-primary pull-right"
                    onClick={
                      props.state.taskButton !== "Add"
                        ? this.props.backToTaskInfoModal
                        : this.props.closeTaskModal
                    }
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className={`button1 btn-primary pull-right ${
                      props.state.taskloader ? "disabled" : ""
                    }`}
                    onClick={
                      props.state.taskButton === "Add"
                        ? props.addTask
                        : props.editTask
                    }
                  >
                    {props.state.taskButton}
                  </button>
                  {this.props.state.fromInfoEdit ? (
                    <button
                      type="button"
                      className="pull-right button3 btn-primary"
                      onClick={() => props.confirmModal("delete")}
                    >
                      Delete
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </>
    );
  }
}

export default AddTaskModal;
