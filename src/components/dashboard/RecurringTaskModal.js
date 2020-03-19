import React, { Component } from "react";
import DatePicker from "react-datepicker";
import TimePicker from "rc-time-picker";
import "rc-time-picker/assets/index.css";
import { PRIORITIES, DATE_FORMAT1 } from "./../../utils/Constants";
import { post } from "./../../utils/API";
import "react-datepicker/dist/react-datepicker.css";
import Loader from "react-loader-spinner";
import DailyPloySelect from "./../DailyPloySelect";
import DailyPloyProjectSelect from "./../DailyPloyProjectSelect";
import CommentUpload from "./../../components/dashboard/CommentUpload";
import moment from "moment";
import DailyPloyToast from "./../../components/DailyPloyToast";
import { toast } from "react-toastify";

class RecurringTaskModal extends React.Component {
  constructor(props) {
    super(props);
    this.calendarFromRef = React.createRef();
    this.calendarToRef = React.createRef();
    this.onImageDropRef = React.createRef();
    this.repeatOptions = [
      {
        id: 1,
        name: "every day",
        value: "days"
      },
      {
        id: 2,
        name: "weekly",
        value: "week"
      },
      {
        id: 3,
        name: "monthly",
        value: "month"
      }
    ];
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
      dateFrom: new Date(),
      dateTo: null,
      pictures: [],
      selectedProjects: [],
      days: [
        { id: 1, name: "sunday", initial: "S", status: false },
        { id: 2, name: "monday", initial: "M", status: false },
        { id: 3, name: "tuesday", initial: "T", status: false },
        { id: 4, name: "wednesday", initial: "W", status: false },
        { id: 5, name: "thursday", initial: "T", status: false },
        { id: 6, name: "friday", initial: "F", status: false },
        { id: 7, name: "Saturday", initial: "S", status: false }
      ],
      repeatOn: this.repeatOptions[0],
      repeatOnNumber: 1,
      frequency: "days",
      weekDays: [],
      monthDays: [],
      errors: {
        taskNameError: "",
        projectError: "",
        memberError: "",
        dateFromError: "",
        dateToError: "",
        categoryError: "",
        numberError: "",
        repeatOnError: "",
        weekDayError: ""
      }
    };
  }

  focusInput = component => {
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

  handleDateChangeRaw = e => {
    e.preventDefault();
  };

  openFromCalender = () => {
    this.calendarFromRef.current.setOpen(true);
  };
  openToCalender = () => {
    this.calendarToRef.current.setOpen(true);
  };

  handleInputChange = async e => {
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

  onImageDrop = picture => {
    this.setState({
      pictures: this.state.pictures.concat(picture)
    });
  };

  changeDay = day => {
    var days = this.state.days;
    // var day = days.find(d => d == day);
    // day["status"] = !day["status"];
    // this.setState({ days: days });

    var day = days.find(d => d == day);
    if (!day["status"]) {
      var weekDays = [day.id];
    } else {
      var weekDays = [];
    }
    days
      .filter(d => d != day)
      .forEach(d => {
        d["status"] = false;
      });
    day["status"] = !day["status"];
    this.setState({ days: days, weekDays: weekDays });
  };

  handleRepeatOnChange = repeat => {
    this.setState({
      repeatOn: repeat,
      frequency: repeat ? repeat.value : null
    });
  };

  handleRepeatOnInputChange = e => {
    const { name, value } = e.target;
    this.setState({ repeatOnNumber: value });
  };

  handleDateFrom = date => {
    var errors = this.state.errors;
    errors["dateFromError"] = "";
    if (date > new Date()) {
      errors["dateToError"] = "";
      this.setState({
        dateFrom: date,
        dateTo: null,
        errors: errors
      });
    } else {
      this.setState({ dateFrom: date, errors: errors });
    }
  };

  handleDateTo = date => {
    var errors = this.state.errors;
    errors["dateToError"] = "";
    this.setState({ dateTo: date, errors: errors });
  };

  validateTaskModal = () => {
    var errors = {};
    var flag = true;
    errors["taskNameError"] = this.props.state.taskName
      ? ""
      : "please enter task name";

    errors["projectError"] =
      this.state.selectedProjects.length > 0 ? "" : "please select projects";

    errors["memberError"] =
      this.props.state.taskUser.length > 0 ? "" : "please select members";

    errors["categoryError"] = this.props.state.taskCategorie
      ? ""
      : "please select category";

    errors["repeatOnError"] =
      this.state.repeatOn && this.state.frequency
        ? ""
        : "please select frequency";

    errors["numberError"] = this.state.repeatOnNumber
      ? ""
      : "please enter number";

    if (this.state.frequency == "week" && this.state.weekDays.length == 0) {
      errors["weekDayError"] = "please select day";
      flag = false;
    } else {
      errors["weekDayError"] = "";
    }

    this.setState({ errors: errors });
    return (
      this.props.state.taskName &&
      this.state.selectedProjects.length > 0 &&
      this.props.state.taskUser.length > 0 &&
      this.state.days.length > 0 &&
      this.props.state.dateFrom &&
      this.props.state.taskCategorie &&
      this.state.repeatOnNumber &&
      flag
    );
  };

  handleProjectSelect = projects => {
    this.setState({ selectedProjects: projects });
  };

  taskDetails = () => {
    var startDateTime =
      moment(this.state.dateFrom).format(DATE_FORMAT1) + " 00:00:00";
    var endDateTime =
      moment(this.state.dateTo ? this.state.dateTo : new Date()).format(
        DATE_FORMAT1
      ) +
      (this.state.timeTo && this.state.timeFrom
        ? " " + this.state.timeTo
        : " 00:00:00");
    let projectIds = this.state.selectedProjects.map(p => p.id).join(", ");
    var taskData = {
      task: {
        name: this.props.state.taskName,
        member_ids: this.props.state.taskUser.join(", "),
        start_datetime: startDateTime,
        comments: this.props.state.comments,
        project_id: projectIds,
        category_id: this.props.state.taskCategorie.task_category_id,
        priority:
          this.props.state.taskPrioritie && this.props.state.taskPrioritie.name
            ? this.props.state.taskPrioritie.name
            : "no_priority",
        frequency: this.state.frequency,
        number: this.state.repeatOnNumber
      }
    };
    if (this.state.dateTo) {
      taskData.task["end_datetime"] =
        moment(this.state.dateTo).format(DATE_FORMAT1) + " 00:00:00";
    }
    if (this.state.frequency == "week") {
      taskData.task["week_numbers"] = this.state.weekDays.join(", ");
    }
    if (this.state.frequency == "month") {
      taskData.task["month_numbers"] = this.state.monthDays.join(", ");
    }
    return taskData;
  };

  createRecurringTask = async () => {
    if (this.validateTaskModal()) {
      this.setState({ taskloader: true });
      const taskData = this.taskDetails();
      try {
        const { data } = await post(
          taskData,
          `workspaces/${this.state.workspaceId}/recurring_tasks`
        );
        var task = data.task;
        toast(
          <DailyPloyToast
            message="Task Created successfully!"
            status="success"
          />,
          { autoClose: 2000, position: toast.POSITION.TOP_CENTER }
        );

        this.setState({
          taskloader: false
        });
        this.props.closeTaskModal();
      } catch (e) {
        this.setState({
          taskloader: false
        });
      }
    }
  };

  render() {
    const { props } = this;
    return (
      <>
        <div className="col-md-12 body">
          <div className="col-md-12 no-padding input-row">
            <div className="col-md-2 d-inline-block no-padding label">Task</div>
            <div className="col-md-10 d-inline-block">
              <input
                type="text"
                name="taskName"
                value={props.state.taskName}
                onChange={props.handleInputChange}
                placeholder="Task Name"
                className="form-control"
              />
            </div>

            {this.state.errors.taskNameError ? (
              <div className="col-md-12">
                <div className="col-md-2 d-inline-block no-padding"></div>
                <div className="col-md- d-inline-block no-padding">
                  <span className="error-warning">
                    {this.state.errors.taskNameError}
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
                props.state.taskButton !== "Add" ? "disable-project-select" : ""
              }`}
            >
              <DailyPloyProjectSelect
                options={this.props.state.memberProjects}
                placeholder="Select Project"
                label="name"
                className="suggestion-z-index-100"
                default={this.props.state.project}
                iconType="block"
                onChange={this.handleProjectSelect}
              />
            </div>
            {this.state.errors.projectError ? (
              <div className="col-md-12">
                <div className="col-md-2 d-inline-block no-padding"></div>
                <div className="col-md-10 d-inline-block no-padding">
                  <span className="error-warning">
                    {this.state.errors.projectError}
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
                placeholder="Select Category"
                className="suggestion-z-index-50"
                default={this.props.state.taskCategorie}
                onChange={this.props.handleCategoryChange}
                canAdd={true}
                addNew={this.props.addCategory}
              />
            </div>
            {this.state.errors.categoryError ? (
              <div className="col-md-12">
                <div className="col-md-2 d-inline-block no-padding"></div>
                <div className="col-md-10 d-inline-block no-padding">
                  <span className="error-warning">
                    {this.state.errors.categoryError}
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
            {this.state.errors.memberError ? (
              <div className="col-md-12">
                <div className="col-md-2 d-inline-block no-padding"></div>
                <div className="col-md- d-inline-block no-padding">
                  <span className="error-warning">
                    {this.state.errors.memberError}
                  </span>
                </div>
              </div>
            ) : null}
          </div>

          <div className="col-md-12 no-padding input-row">
            <div className="col-md-2 d-inline-block no-padding label">
              Repeat Every
            </div>
            <div className="col-md-3 d-inline-block">
              <input
                type="number"
                name="repeatOnNumber"
                value={this.state.repeatOnNumber}
                onChange={e => this.handleRepeatOnInputChange(e)}
                placeholder="Enter"
                className="form-control"
              />
            </div>
            <div className="col-md-7 d-inline-block">
              <DailyPloySelect
                options={this.repeatOptions}
                placeholder="select frequency"
                default={this.state.repeatOn ? this.state.repeatOn : null}
                onChange={this.handleRepeatOnChange}
              />
            </div>
            {this.state.errors.repeatOnError ||
            this.state.errors.numberError ? (
              <div className="col-md-12">
                <div className="col-md-2 d-inline-block no-padding"></div>
                <div className="col-md-4 d-inline-block no-padding">
                  <span className="error-warning">
                    {this.state.errors.numberError}
                  </span>
                </div>
                <div className="col-md-6 d-inline-block no-padding">
                  <span className="error-warning">
                    {this.state.errors.repeatOnError}
                  </span>
                </div>
              </div>
            ) : null}
          </div>

          {this.state.repeatOn && this.state.repeatOn.name == "weekly" ? (
            <div className="col-md-12 no-padding input-row">
              <div className="col-md-2 d-inline-block no-padding label">
                Repeat On
              </div>
              <div className="col-md-10 d-inline-block">
                {this.state.days.map(day => {
                  return (
                    <div
                      className={`d-inline-block day-icon ${
                        day.status ? "selected" : ""
                      }`}
                      onClick={() => this.changeDay(day)}
                    >
                      {day.initial}
                    </div>
                  );
                })}
              </div>
              {this.state.errors.weekDayError ? (
                <div className="col-md-12">
                  <div className="col-md-2 d-inline-block no-padding"></div>
                  <div className="col-md-10 d-inline-block no-padding">
                    <span className="error-warning">
                      {this.state.errors.weekDayError}
                    </span>
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}

          {this.state.repeatOn && this.state.repeatOn.name == "monthly" ? (
            <div className="col-md-12 no-padding input-row">
              <div className="col-md-2 d-inline-block no-padding label"></div>
              <div className="col-md-10 d-inline-block">
                <div
                  className="d-inline-block task-datepicker no-padding"
                  style={{ width: "125px" }}
                >
                  <span className="" style={{ marginLeft: "0px" }}>
                    Monthly on date:
                  </span>
                </div>
                <div className="col-md-7 d-inline-block task-datepicker no-padding">
                  <div className="d-inline-block picker">
                    <DatePicker
                      className="width-to"
                      ref={this.calendarToRef}
                      selected={props.state.dateTo}
                      onChange={props.handleDateTo}
                      placeholderText="Select Date"
                      onChangeRaw={this.handleDateChangeRaw}
                    />
                    <span
                      className="task-date-picker-icon"
                      style={{ right: "85px" }}
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
              {/* {this.state.errors.memberError ? (
              <div className="col-md-12">
                <div className="col-md-2 d-inline-block no-padding"></div>
                <div className="col-md- d-inline-block no-padding">
                  <span className="error-warning">
                    {this.state.errors.memberError}
                  </span>
                </div>
              </div>
            ) : null} */}
            </div>
          ) : null}

          <div className="col-md-12 no-padding input-row">
            <div className="col-md-2 d-inline-block no-padding label">Date</div>
            <div className="col-md-10 d-inline-block no-padding">
              <div className="col-md-12 d-inline-block no-padding">
                <div className="col-md-6 d-inline-block task-datepicker">
                  <div className="d-inline-block label date-text-light">
                    <span>From:</span>
                  </div>
                  <div className="d-inline-block picker">
                    <DatePicker
                      ref={this.calendarFromRef}
                      selected={this.state.dateFrom}
                      onChange={this.handleDateFrom}
                      maxDate={this.state.dateTo}
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
                      minDate={this.state.dateFrom}
                      selected={this.state.dateTo}
                      onChange={this.handleDateTo}
                      placeholderText="Select Date"
                      // disabled={this.state.disabledDateTo}
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
            {this.state.errors.dateFromError ||
            this.state.errors.dateToError ? (
              <div className="col-md-12">
                <div className="col-md-2 d-inline-block no-padding"></div>
                <div className="col-md-5 d-inline-block no-padding">
                  <span className="error-warning">
                    {this.state.errors.dateFromError}
                  </span>
                </div>
                <div className="col-md-5 d-inline-block no-padding">
                  <span className="error-warning">
                    {this.state.errors.dateToError}
                  </span>
                </div>
              </div>
            ) : null}
          </div>

          {/* <div className="col-md-12 no-padding input-row">
            <div className="col-md-2 d-inline-block no-padding label">Time</div>
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
                </div>
                <div className="col-md-6 d-inline-block no-padding ">
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

            {this.state.errors.timeFromError ||
            this.state.errors.timeToError ? (
              <div className="col-md-12 d-inline-block no-padding">
                <div className="col-md-2 d-inline-block no-padding"></div>
                <div className="col-md-4 d-inline-block no-padding">
                  <span className="error-warning">
                    {this.state.errors.timeFromError}
                  </span>
                </div>
                <div className="col-md-4 d-inline-block no-padding">
                  <span className="error-warning">
                    {this.state.errors.timeToError}
                  </span>
                </div>
              </div>
            ) : null}
          </div> */}

          <div className="col-md-12 row no-margin no-padding input-row">
            <div className="col-md-2 no-padding label">Comments</div>
            <div className="col-md-10">
              <CommentUpload
                state={this.state}
                showSave={props.state.taskButton === "Add" ? false : true}
                showAttachIcon={props.state.taskButton === "Add" ? false : true}
                defaultComments={props.state.comments}
                handleInputChange={this.props.handleInputChange}
                showSave={false}
                showAttachIcon={false}
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
                onClick={() => this.createRecurringTask()}
              >
                {props.state.taskButton}
                {this.props.state.taskloader ? (
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
      </>
    );
  }
}

export default RecurringTaskModal;
