import React, { Component } from "react";
import DatePicker from "react-datepicker";
import TimePicker from "rc-time-picker";
import "rc-time-picker/assets/index.css";
import { PRIORITIES, DATE_FORMAT1 } from "./../../utils/Constants";
import { post, put } from "./../../utils/API";
import "react-datepicker/dist/react-datepicker.css";
import Loader from "react-loader-spinner";
import DailyPloySelect from "./../DailyPloySelect";
import DailyPloyProjectSelect from "./../DailyPloyProjectSelect";
import CommentUpload from "./../../components/dashboard/CommentUpload";
import moment from "moment";
import DailyPloyToast from "./../../components/DailyPloyToast";
import ConfirmModal from "./../ConfirmModal";
import { toast } from "react-toastify";
import ErrorBoundary from '../../ErrorBoundary';

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
        value: "daily"
      },
      {
        id: 2,
        name: "weekly",
        value: "weekly"
      },
      {
        id: 3,
        name: "monthly",
        value: "monthly"
      }
    ];
    this.monthlyDays = [
      {
        name: "Monthly on day 1",
        value: 1
      },
      {
        name: "Monthly on day 2",
        value: 2
      },
      {
        name: "Monthly on day 3",
        value: 3
      },
      {
        name: "Monthly on day 4",
        value: 4
      },
      {
        name: "Monthly on day 5",
        value: 5
      },
      {
        name: "Monthly on day 6",
        value: 6
      },
      {
        name: "Monthly on day 7",
        value: 7
      },
      {
        name: "Monthly on day 8",
        value: 8
      },
      {
        name: "Monthly on day 9",
        value: 9
      },
      {
        name: "Monthly on day 10",
        value: 10
      },
      {
        name: "Monthly on day 11",
        value: 11
      },
      {
        name: "Monthly on day 12",
        value: 12
      },
      {
        name: "Monthly on day 13",
        value: 13
      },
      {
        name: "Monthly on day 14",
        value: 14
      },
      {
        name: "Monthly on day 15",
        value: 15
      },
      {
        name: "Monthly on day 16",
        value: 16
      },
      {
        name: "Monthly on day 17",
        value: 17
      },
      {
        name: "Monthly on day 18",
        value: 18
      },
      {
        name: "Monthly on day 19",
        value: 19
      },
      {
        name: "Monthly on day 20",
        value: 20
      },
      {
        name: "Monthly on day 21",
        value: 21
      },
      {
        name: "Monthly on day 22",
        value: 22
      },
      {
        name: "Monthly on day 23",
        value: 23
      },
      {
        name: "Monthly on day 24",
        value: 24
      },
      {
        name: "Monthly on day 25",
        value: 25
      },
      {
        name: "Monthly on day 26",
        value: 26
      },
      {
        name: "Monthly on day 27",
        value: 27
      },
      {
        name: "Monthly on day 28",
        value: 28
      },
      {
        name: "Monthly on day 29",
        value: 29
      },
      {
        name: "Monthly on day 30",
        value: 30
      }
    ];
    this.state = {
      defaultRepeatOn: null,
      selectedMembers: [],
      taskName: "",
      comments: "",
      dateFrom: new Date(),
      dateTo: null,
      showConfirm: false,
      pictures: [],
      selectedProjects: [],
      days: [
        { id: 1, name: "monday", initial: "M", status: false },
        { id: 2, name: "tuesday", initial: "T", status: false },
        { id: 3, name: "wednesday", initial: "W", status: false },
        { id: 4, name: "thursday", initial: "T", status: false },
        { id: 5, name: "friday", initial: "F", status: false },
        { id: 6, name: "Saturday", initial: "S", status: false },
        { id: 7, name: "sunday", initial: "S", status: false }
      ],
      repeatOn: null,
      repeatOnNumber: 1,
      frequency: "daily",
      weekDays: [],
      monthDays: [],
      members: [],
      selectedMonth: null,
      errors: {
        taskNameError: "",
        projectError: "",
        memberError: "",
        dateFromError: "",
        dateToError: "",
        categoryError: "",
        numberError: "",
        repeatOnError: "",
        weekDayError: "",
        monthDayError: ""
      }
    };
  }

  focusInput = component => {
    if (component) {
      component.focus();
    }
  };

  componentDidUpdate = (prevProps, prevState) => {
    // if (this.props.state.taskName !== prevProps.state.taskName) {
    //   this.setState({ taskName: this.props.state.taskName });
    // }
    if (this.props.state.comments !== prevProps.state.comments) {
      this.setState({
        comments: this.props.state.comments
      });
    }

    if (this.props.state.editableTask !== prevProps.state.editableTask) {
    }
  };

  componentDidMount = () => {
    if (this.props.modalMemberSearchOptions.length > 0) {
      this.setState({
        members: this.props.modalMemberSearchOptions
      });
    }
    if (this.props.state.selectedProjects) {
      this.setState({ selectedProjects: this.props.state.selectedProjects });
    }
    if (this.props.editableTask) {
      var frequency = this.props.editableTask.frequency;
      var repeatOn = this.repeatOptions.find(ro => ro.value == frequency);
      if (frequency == "daily") {
        this.setState({
          frequency: frequency,
          repeatOnNumber: this.props.state.editableTask.number,
          repeatOn: repeatOn,
          dateFrom: new Date(this.props.editableTask.start_datetime),
          dateTo: new Date(this.props.editableTask.end_datetime)
        });
      } else if (frequency == "weekly") {
        var weekDays = this.state.days.filter(d =>
          this.props.state.editableTask.week_numbers.includes(d.id)
        );
        weekDays.forEach(d => (d["status"] = true));
        this.setState({
          frequency: frequency,
          repeatOnNumber: this.props.state.editableTask.number,
          weekDays: weekDays.map(d => d.id),
          repeatOn: repeatOn,
          dateFrom: new Date(this.props.editableTask.start_datetime),
          dateTo: new Date(this.props.editableTask.end_datetime)
        });
      } else if (frequency == "monthly") {
        var monthDays = this.monthlyDays.find(d =>
          this.props.editableTask.month_numbers.includes(d.value)
        );
        this.setState({
          frequency: frequency,
          repeatOnNumber: this.props.state.editableTask.number,
          monthDays: [monthDays.value],
          selectedMonth: monthDays,
          repeatOn: repeatOn,
          dateFrom: new Date(this.props.editableTask.start_datetime),
          dateTo: new Date(this.props.editableTask.end_datetime)
        });
      }
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
      frequency: repeat ? repeat.value : null,
      repeatOnNumber:
        repeat && repeat.value == "daily" ? 1 : this.state.repeatOnNumber
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

    errors["dateToError"] = this.state.dateTo ? "" : "please select date to";

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

    if (this.state.frequency == "weekly" && this.state.weekDays.length == 0) {
      errors["weekDayError"] = "please select day";
      flag = false;
    } else {
      errors["weekDayError"] = "";
    }

    if (this.state.frequency == "monthly" && this.state.monthDays.length == 0) {
      errors["monthDayError"] = "please select day";
      flag = false;
    } else {
      errors["monthDayError"] = "";
    }

    this.setState({ errors: errors });
    return (
      this.props.state.taskName &&
      this.state.selectedProjects.length > 0 &&
      this.props.state.taskUser.length > 0 &&
      this.state.days.length > 0 &&
      this.state.dateFrom &&
      this.state.dateTo &&
      this.props.state.taskCategorie &&
      this.state.repeatOnNumber &&
      flag
    );
  };

  handleProjectSelect = projects => {
    if (projects && projects.length > 0) {
      var members = projects.map(p => p.members).flat();
      var newMembers = [];
      members.forEach(m => {
        if (!newMembers.map(mm => mm.id).includes(m.id)) {
          newMembers.push(m);
        }
      });
      let memberIdArray = projects.map(p => p.members.map(m => m.id));
      let commonIds = this.getCommonElements(memberIdArray);
      let filterMembers = newMembers.filter(m => commonIds.includes(m.id));
      this.setState({ selectedProjects: projects, members: filterMembers });
    } else {
      this.setState({ selectedProjects: projects, members: [] });
    }
  };

  getCommonElements = arrays => {
    var min = 1000;
    var arg = 0;
    var index = 0;
    var common = [];
    for (var i = 0; i < arrays.length; i++) {
      if (arrays[i].length < min) {
        min = arrays[i].length;
        arg = i;
      }
    }
    for (var i = 0; i < arrays[arg].length; i++) {
      for (var j = 0; j < arrays.length; j++) {
        if (j != arg && arrays[j].indexOf(arrays[arg][i]) != -1) {
          index++;
        }
      }
      if (index == arrays.length - 1) {
        common.push(arrays[arg][i]);
      }
      index = 0;
    }
    return common;
  };

  taskDetails = () => {
    var startDateTime =
      moment(this.state.dateFrom).format(DATE_FORMAT1) + " 00:00:00";
    var endDateTime =
      moment(this.state.dateTo ? this.state.dateTo : new Date()).format(
        DATE_FORMAT1
      ) + " 00:00:00";
    let projectIds = this.state.selectedProjects.map(p => p.id).join(",");
    var taskData = {
      task: {
        name: this.props.state.taskName,
        member_ids: this.props.state.taskUser.join(","),
        start_datetime: startDateTime,
        end_datetime: endDateTime,
        comments: this.props.state.comments,
        project_ids: projectIds,
        status: "not_started",
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
    if (this.state.frequency == "weekly") {
      taskData.task["week_numbers"] = this.state.weekDays.join(",");
    }
    if (this.state.frequency == "monthly") {
      taskData.task["month_numbers"] = this.state.monthDays.join(",");
    }
    return taskData;
  };

  createRecurringTask = async () => {
    console.log(this.validateTaskModal());
    if (this.validateTaskModal()) {
      if (this.props.confirm) {
        this.setState({
          showConfirm: true
        });
      } else {
        this.addTask();
      }
    }
  };

  addTask = async () => {
    this.setState({ taskloader: true });
    const taskData = this.taskDetails();
    try {
      const { data } = await post(
        taskData,
        `workspaces/${this.props.state.workspaceId}/recurring_task`
      );
      var task = data.task;
      toast(<DailyPloyToast message="Recurring Task Created!" status="success" />,
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
  };

  updateTask = async () => {
    this.setState({ taskloader: true });
    const taskData = this.taskDetails();
    try {
      const { data } = await put(
        taskData.task,
        `workspaces/${this.props.state.workspaceId}/recurring_task/${this.props.state.editableTask.id}`
      );
      var task = data.task;
      toast(<DailyPloyToast message="Recurring Task updated!" status="success" />,
        { autoClose: 2000, position: toast.POSITION.TOP_CENTER }
      );
      this.setState({
        taskloader: false,
        showConfirm: false
      });
      this.props.backToTaskInfoModal();
      this.props.loadTask();
    } catch (e) {
      this.setState({
        taskloader: false,
        showConfirm: false
      });
    }
  };

  closeConfirmModal = () => {
    this.setState({
      showConfirm: false
    });
  };

  handleMonthlyDayChange = day => {
    this.setState({
      monthDays: day ? [day.value] : []
    });
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
                ""
                // props.state.taskButton !== "Add" ? "disable-project-select" : ""
                }`}
            >
              <ErrorBoundary>
                <DailyPloyProjectSelect
                  options={this.props.state.memberProjects}
                  placeholder="Select Project"
                  label="name"
                  className="suggestion-z-index-100"
                  default={this.props.state.selectedProjects}
                  iconType="block"
                  onChange={this.handleProjectSelect}
                />
              </ErrorBoundary>
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
              <ErrorBoundary>
                <DailyPloySelect
                  options={this.props.state.taskCategories}
                  placeholder="Select Category"
                  className="suggestion-z-index-50"
                  default={this.props.state.taskCategorie}
                  onChange={this.props.handleCategoryChange}
                  canAdd={true}
                  addNew={this.props.addCategory}
                />
              </ErrorBoundary>
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
              <ErrorBoundary>
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
              </ErrorBoundary>
            </div>
          </div>

          <div className="col-md-12 no-padding input-row">
            <div className="col-md-2 d-inline-block no-padding label">
              Member
            </div>
            <div className="col-md-10 d-inline-block">
              <ErrorBoundary>
                <DailyPloySelect
                  // options={this.props.modalMemberSearchOptions}
                  options={this.state.members}
                  placeholder="Select Member"
                  noOptionMessage="please select project first"
                  default={this.props.state.selectedMembers[0]}
                  icon="fa fa-user"
                  onChange={this.props.handleMemberSelect}
                />
              </ErrorBoundary>
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
            <div
              className={`col-md-3 d-inline-block ${
                this.state.frequency == "days" ? "disabled" : ""
                }`}
            >
              <input
                type="number"
                name="repeatOnNumber"
                value={this.state.repeatOnNumber}
                onChange={e => this.handleRepeatOnInputChange(e)}
                placeholder="Enter"
                className={`form-control`}
              />
            </div>
            <div className="col-md-7 d-inline-block">
              <ErrorBoundary>
                <DailyPloySelect
                  options={this.repeatOptions}
                  placeholder="select frequency"
                  default={this.state.repeatOn}
                  onChange={this.handleRepeatOnChange}
                />
              </ErrorBoundary>
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
                      key={day.id}
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
                <ErrorBoundary>
                  <DailyPloySelect
                    options={this.monthlyDays}
                    placeholder="select day"
                    // label="value"
                    // name="value"
                    // suggesionBy="value"
                    default={this.state.selectedMonth}
                    onChange={this.handleMonthlyDayChange}
                  />
                </ErrorBoundary>
                {/* <div
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
                </div> */}
              </div>
              {this.state.errors.monthDayError ? (
                <div className="col-md-12">
                  <div className="col-md-2 d-inline-block no-padding"></div>
                  <div className="col-md- d-inline-block no-padding">
                    <span className="error-warning">
                      {this.state.errors.monthDayError}
                    </span>
                  </div>
                </div>
              ) : null}
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
                    <ErrorBoundary>
                      <DatePicker
                        ref={this.calendarFromRef}
                        selected={this.state.dateFrom}
                        onChange={this.handleDateFrom}
                        maxDate={this.state.dateTo}
                        placeholderText="Select Date"
                        onChangeRaw={this.handleDateChangeRaw}
                      />
                    </ErrorBoundary>
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
                    <ErrorBoundary>
                      <DatePicker
                        className="width-to"
                        ref={this.calendarToRef}
                        minDate={this.state.dateFrom}
                        selected={this.state.dateTo}
                        onChange={this.handleDateTo}
                        placeholderText="Select Date"
                        readOnly={false}
                        // disabled={this.state.disabledDateTo}
                        onChangeRaw={this.handleDateChangeRaw}
                      />
                    </ErrorBoundary>
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

          <div className="col-md-12 row no-margin no-padding input-row">
            <div className="col-md-2 no-padding label">Comments</div>
            <div className="col-md-10">
              <ErrorBoundary>
                <CommentUpload
                  state={this.state}
                  showSave={props.state.taskButton === "Add" ? false : true}
                  showAttachIcon={props.state.taskButton === "Add" ? false : true}
                  comments={props.state.comments}
                  commentName="comments"
                  handleInputChange={this.props.handleInputChange}
                  showSave={false}
                  showAttachIcon={false}
                />
              </ErrorBoundary>
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
                  this.state.taskloader ? "disabled" : ""
                  }`}
                onClick={() => this.createRecurringTask()}
              >
                {props.state.taskButton}
                {this.state.taskloader ? (
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
        {this.state.showConfirm ? (
          <ErrorBoundary>
            <ConfirmModal
              title="Update Recurring Task"
              message={`These changes will be reflected from next Month`}
              onClick={() => this.updateTask()}
              closeModal={this.closeConfirmModal}
              buttonText="Edit"
              show={this.state.showConfirm}
              style={{
                padding: "6% 0 0 35px"
              }}
            />
          </ErrorBoundary>
        ) : null}
      </>
    );
  }
}

export default RecurringTaskModal;
