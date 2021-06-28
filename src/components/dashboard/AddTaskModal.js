import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import DatePicker from "react-datepicker";
import TimePicker from "rc-time-picker";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "rc-time-picker/assets/index.css";
import {
  PRIORITIES,
  DATE_FORMAT3,
  DATE_FORMAT1,
} from "./../../utils/Constants";
import "react-datepicker/dist/react-datepicker.css";
import Close from "../../assets/images/close.svg";
import Loader from "react-loader-spinner";
import DailyPloySelect from "./../DailyPloySelect";
import ImageUploader from "react-images-upload";
import CommentUpload from "./../../components/dashboard/CommentUpload";
import moment from "moment";
import RecurringTaskModal from "./RecurringTaskModal";
import SelectStatus from "./SelectStatus";
class AddTaskModal extends React.Component {
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
      description: "",
      pictures: [],
    };
  }

  focusInput = (component) => {
    if (component) {
      component.focus();
    }
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (this.props.state.taskName !== prevProps.state.taskName) {
      this.setState({ taskName: this.props.state.taskName });
    }
    if (this.props.state.comments !== prevProps.state.comments) {
      this.setState({ comments: this.props.state.comments });
    }
  };

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
  };
  handleDescription = async e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleDescription = async e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  onBlurInput = () => {
    this.props.handleTaskNameChange("taskName", this.state.taskName);
  };

  onBlurComment = () => {
    this.props.handleTaskNameChange("comments", this.state.comments);
  };

  handleImageRef = () => {
    this.onImageDropRef.current.inputElement.click();
  };

  isTody = () => {
    return (
      moment().format(DATE_FORMAT1) ===
      moment(this.props.state.dateFrom).format(DATE_FORMAT1)
    );
  };

  onImageDrop = (picture) => {
    this.setState({
      pictures: this.state.pictures.concat(picture),
    });
  };

  handleBlur(e) {
    if (e.currentTarget.value === '0') e.currentTarget.value = '1'
  }

  handleKeypress(e) {
    const characterCode = e.key
    if (characterCode === 'Backspace') return

    const characterNumber = Number(characterCode)
    if (characterNumber >= 0 && characterNumber <= 9) {
      if (e.currentTarget.value && e.currentTarget.value.length) {
        return
      } else if (characterNumber === 0) {
        e.preventDefault()
      }
    } else {
      e.preventDefault()
    }
  }

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
            <Tabs style={{ width: "100%" }}>
              <TabList>
                <Tab>
                  {props.state.taskButton === "Add"
                    ? "ADD NEW TASK"
                    : "EDIT TASK"}
                </Tab>
                {/* {props.state.taskButton === "Add" ? (
                  <Tab>RECURRING TASK</Tab>
                ) : null} */}
                <Tab>
                  <button
                    className="btn btn-link"
                    onClick={props.closeTaskModal}
                  >
                    <img src={Close} alt="close" />
                  </button>
                </Tab>
              </TabList>

              <TabPanel>
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
                        // value={this.state.taskName}
                        // onChange={e => this.handleInputChange(e)}
                        // onBlur={this.onBlurInput}
                        placeholder="Task Name"
                        className="form-control"
                      // ref={input => {
                      //   this.nameInput = input;
                      // }}
                      // defaultValue=""
                      // ref={input => input && input.focus()}
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
                      Estimate
                    </div>
                    <div className="col-md-10 d-inline-block">
                      <input
                        type="number"
                        min="0"
                        name="estimate"
                        onKeyDown={this.handleKeypress}
                        onBlur={this.handleBlur}
                        min='1'
                        step='1'
                        value={props.state.estimate}
                        onChange={props.handleInputChange}
                        placeholder="Estimated time(hour)"
                        className="form-control"
                      />
                    </div>
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
                        placeholder="Select Project"
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
                      
                  <div className="col-md-12 row no-margin no-padding input-row">
                    <div className="col-md-2 no-padding label" style={{ verticalAlign: "top" }}>Description</div>
                    <div className="col-md-10">
                      <textarea
                        name={`description`}
                        value={props.state.description ? props.state.description : ""}
                        onChange={(e) => this.props.handleInputChange(e)}
                        className="form-control"
                        rows="2"
                        placeholder="Write Here..."
                      />
                      </div>
                      </div>

                  <div className="col-md-12 no-padding input-row">
                    <div className="col-md-2 d-inline-block no-padding label">
                      Category
                    </div>
                    <div className="col-md-10 d-inline-block">
                      <DailyPloySelect
                        options={this.props.state.taskCategories}
                        placeholder="Select Category"
                        className="suggestion-z-index-50"
                        default={this.props.state.taskCategorie ? this.props.state.taskCategorie : this.props.state.taskCategories[0]}
                        selected={this.props.state.taskCategories[0]}
                        onChange={this.props.handleCategoryChange}
                        canAdd={true}
                        addNew={this.props.addCategory}
                      />
                    </div>
                    {/* {this.props.state.errors.categoryError ? (
                      <div className="col-md-12">
                        <div className="col-md-2 d-inline-block no-padding"></div>
                        <div className="col-md-10 d-inline-block no-padding">
                          <span className="error-warning">
                            {this.props.state.errors.categoryError}
                          </span>
                        </div>
                      </div>
                    ) : null} */}
                  </div> 
                  {this.props.state.showStatus ?
                    <div className="col-md-12 no-padding input-row">
                      <div className="col-md-2 d-inline-block no-padding label">
                        Status
                    </div>
                      <div className="col-md-10 d-inline-block">
                        <SelectStatus
                          options={this.props.state.taskStatuss}
                          placeholder="Select Status"
                          className="suggestion-z-index-50"
                          default={this.props.state.taskStatus ? this.props.state.taskStatus : this.props.state.taskStatuss[0]}
                          selected={this.props.state.taskStatus}
                          onChange={this.props.handleaddStatusChange}
                          canAdd={true}
                          addNew={this.props.addStatus}
                        />
                      </div>
                    </div> : null}

                  <div className="col-md-12 no-padding input-row">
                    <div className="col-md-2 d-inline-block no-padding label">
                      Priority
                    </div>
                    <div className="col-md-10 d-inline-block">
                      <DailyPloySelect
                        options={PRIORITIES.slice(0, 3)}
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
                              ref={this.calendarFromRef}
                              selected={props.state.dateFrom}
                              onChange={props.handleDateFrom}
                              maxDate={props.state.dateTo}
                              placeholderText="Select Date"
                              onChangeRaw={this.handleDateChangeRaw}
                            />
                            <span className="task-date-picker-icon">
                              <i
                                onClick={this.openFromCalender}
                                className="fa fa-calendar"
                                aria-hidden="true"
                              ></i>
                            </span>
                          </div>
                        </div>
                        <div className="col-md-6 d-inline-block task-datepicker no-padding">
                          <div className="d-inline-block  date-text-light ">
                            <span className="width-to">To:</span>
                          </div>
                          <div className="d-inline-block picker">
                            <DatePicker
                              className="width-to"
                              ref={this.calendarToRef}
                              minDate={props.state.dateFrom}
                              selected={props.state.dateTo}
                              onChange={props.handleDateTo}
                              placeholderText="Select Date"
                              disabled={props.state.disabledDateTo}
                              onChangeRaw={this.handleDateChangeRaw}
                            />
                            <span
                              className="task-date-picker-icon"
                              style={{ right: "51px" }}
                            >
                              <i
                                onClick={this.openToCalender}
                                className="fa fa-calendar"
                                aria-hidden="true"
                              ></i>
                            </span>
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
                    <div
                      className="col-md-10 d-inline-block"
                      style={{ paddingRight: "0px" }}
                    >
                      <div className="col-md-12 d-inline-block no-padding">
                        <div
                          className="col-md-6 d-inline-block no-padding "
                        // style={{ maxWidth: "219px" }}
                        >
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
                          {/* <span style={{ paddingLeft: "18px" }}> - </span> */}
                        </div>
                        {/* <div className="col-md-1 d-inline-block no-padding">-</div> */}
                        <div
                          className="col-md-6 d-inline-block no-padding "
                        // style={{ marginLeft: "22px" }}
                        >
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
                    <div className="col-md-2 no-padding label" style={{ verticalAlign: "top" }}>Comments</div>
                    <div className="col-md-10">
                      <textarea
                        name={`comments`}
                        value={props.state.comments ? props.state.comments : ""}
                        onChange={(e) => this.props.handleInputChange(e)}
                        className="form-control"
                        rows="1"
                        placeholder="Write Here..."
                      />
                      {/* <CommentUpload
                        state={this.state}
                        showSave={
                          props.state.taskButton === "Add" ? false : true
                        }
                        showAttachIcon={
                          props.state.taskButton === "Add" ? false : true
                        }
                        commentName="comments"
                        defaultComments={props.state.comments}
                        handleInputChange={this.props.handleInputChange}
                        showSave={false}
                        showAttachIcon={false}
                      /> */}
                    </div>
                  </div>

                  <div className="no-padding input-row">
                    <div className="action-btn">
                      {this.isTody() && props.state.taskButton == "Add" ? (
                        <label>
                          <span className="tt-conf-btn">
                            You want to start Time Track ?
                          </span>
                          <input
                            type="checkbox"
                            name="isContactChecked"
                            onChange={(e) => this.props.toggleTaskStartState(e)}
                            style={{
                              margin: "0px 20px",
                            }}
                          />
                        </label>
                      ) : null}
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
                        disabled={this.props.loadStatus}
                        className={`button1 btn-primary pull-right ${
                          props.state.taskloader && this.props.loadStatus ? "disabled" : ""
                          }`}
                        onClick={() =>
                          props.state.taskButton === "Add"
                            ? props.addTask()
                            : props.editTask()
                        }
                        disabled={this.props.state.isDisable}
                      >
                        {props.state.taskButton}
                        {this.props.state.taskloader? (
                          <Loader
                            type="Oval"
                            color="#FFFFFF"
                            height={20}
                            width={20}
                            style={{ paddingLeft: "5px" }}
                            className="d-inline-block login-signup-loader"
                          />
                        ) : null}
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
              </TabPanel>
              <TabPanel>
                <RecurringTaskModal
                  show={this.props.state.show}
                  state={this.props.state}
                  closeTaskModal={this.props.closeTaskModal}
                  handleInputChange={this.props.handleInputChange}
                  handleDescription={this.props.handleDescription}
                  projects={this.props.state.memberProjects}
                  handleDateFrom={this.props.handleDateFrom}
                  handleDateTo={this.props.handleDateTo}
                  handleTimeFrom={this.props.handleTimeFrom}
                  handleTimeTo={this.props.handleTimeTo}
                  users={this.props.state.users}
                  addTask={this.props.addTask}
                  editTask={this.props.editTask}
                  handleMemberSelect={this.props.handleMemberSelect}
                  handleProjectSelect={this.props.handleProjectSelect}
                  modalMemberSearchOptions={
                    this.props.state.modalMemberSearchOptions
                  }
                  backToTaskInfoModal={this.props.backToTaskInfoModal}
                  confirmModal={this.props.confirmModal}
                  handleCategoryChange={this.props.handleCategoryChange}
                  handlePrioritiesChange={this.props.handlePrioritiesChange}
                  addCategory={this.props.addCategory}
                  handleTaskNameChange={this.props.handleTaskNameChange}
                  saveComments={this.props.saveComments}
                  toggleTaskStartState={this.props.toggleTaskStartState}
                />
              </TabPanel>
            </Tabs>
          </div>
        </Modal>
      </>
    );
  }
}

export default AddTaskModal;
