import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import "rc-time-picker/assets/index.css";
import "react-datepicker/dist/react-datepicker.css";
import Close from "../../assets/images/close.svg";
import moment from "moment";
import { put } from "../../utils/API";
import DailyPloyToast from "./../../../src/components/DailyPloyToast";
import { ToastContainer, toast } from "react-toastify";
import Loader from "react-loader-spinner";
import {
  DATE_FORMAT2,
  HRMIN,
  PRIORITIES_MAP,
  DATE_FORMAT1,
  DATE_FORMAT6
} from "./../../utils/Constants";
import TimePicker from "rc-time-picker";
import EditableSelect from "./../EditableSelect";

class TaskConfirm extends Component {
  constructor(props) {
    super(props);
    this.times = ["18:19 - 20:19", "18:19 - 20:19", "18:19 - 20:19"];
    this.priority = {
      name: "high",
      color_code: "#00A031"
    };
    this.state = {
      color: "#ffffff",
      showTimerMenu: false,
      icon: "play",
      startOn: "",
      status: false,
      color: "#ffffff",
      selected: "",
      trackSaved: false,
      showContacts: false,
      selectContactArr: []
    };
  }

  renderTaskInfo = (option, type) => {
    if (option) {
      const klass =
        type == "block" ? "color-block" : type == "circle" ? "color-dot" : "";
      return (
        <div className="d-inline-block">
          <div
            className={`d-inline-block ${klass}`}
            style={{
              backgroundColor: `${
                option.color_code ? option.color_code : this.state.color
              }`
            }}
          ></div>
          <div className="right-left-space-5 d-inline-block task-name">
            {option.name}
          </div>
        </div>
      );
    }
    return "";
  };

  renderInfoPriority = (priority, type) => {
    var option = PRIORITIES_MAP.get(priority);
    if (option) {
      const klass =
        type == "block" ? "color-block" : type == "circle" ? "color-dot" : "";
      return (
        <div
          className="d-inline-block pull-right pri-info"
          style={{ paddingRight: "10px" }}
        >
          <div
            className={`d-inline-block ${klass}`}
            style={{
              backgroundColor: `${
                option.color_code ? option.color_code : this.state.color
              }`
            }}
          ></div>
          <div className=" d-inline-block priority-dot">{option.label}</div>
        </div>
      );
    }
    return "";
  };

  disabledHours = () => {
    if (
      this.props.state.taskEvent &&
      moment(this.props.state.taskEvent.taskStartDate).format(DATE_FORMAT1) ==
        moment(this.props.state.taskEvent.taskEndDate).format(DATE_FORMAT1)
    ) {
      var timeMoment = this.props.state.logTimeFrom;
      if (timeMoment) {
        let time = timeMoment.format(HRMIN);
        var hr = time.split(":")[0];
        hr = Number(hr);
        var hoursArr = Array.from({ length: `${hr}` }, (v, k) => k);
        return hoursArr;
      }
    }
    return [];
  };

  // disabledMinutes = () => {
  //   var timeMoment = this.props.state.logTimeFrom;
  //   if (timeMoment) {
  //     let time = timeMoment.format(HRMIN);
  //     var min = time.split(":")[1];
  //     min = Number(min) + 1;
  //     var minArr = Array.from({ length: `${min}` }, (v, k) => k);
  //     return minArr;
  //   }
  //   return [];
  // };

  disabledMinutes = () => {
    if (
      this.props.state.taskEvent &&
      moment(this.props.state.taskEvent.taskStartDate).format(DATE_FORMAT1) ==
        moment(this.props.state.taskEvent.taskEndDate).format(DATE_FORMAT1)
    ) {
      var fTime = this.props.state.logTimeFrom;
      var tTime = this.props.state.logTimeTo;
      if (tTime) {
        tTime = tTime.format(HRMIN);
      }
      if (fTime) {
        fTime = fTime.format(HRMIN);
      }
      if (fTime && !tTime) {
        var min = fTime.split(":")[1];
        min = Number(min) + 1;
        var minArr = Array.from({ length: `${min}` }, (v, k) => k);
        return minArr;
      } else if (
        fTime &&
        tTime &&
        fTime.split(":")[0] === tTime.split(":")[0]
      ) {
        var min = fTime.split(":")[1];
        min = Number(min) + 1;
        var minArr = Array.from({ length: `${min}` }, (v, k) => k);
        return minArr;
      }
    }
    return [];
  };

  selectedOption = option => {
    this.setState({ selected: option });
  };

  returnTime = time => {
    return {
      id: time.id,
      name: `${moment(time.start_time).format("HH:mm")} - ${moment(
        time.end_time
      ).format("HH:mm")}`,
      start: time.start_time,
      end: time.end_time
    };
  };

  validateTime = time => {
    let timeSplit = time.trim().split("-");
    var flag = false;
    if (timeSplit.length == 2) {
      let startTime = timeSplit[0].trim().split(":");
      let endTime = timeSplit[1].trim().split(":");
      if (startTime.length == 2 && endTime.length == 2) {
        flag =
          startTime[0] < 24 &&
          startTime[1] <= 59 &&
          endTime[0] < 24 &&
          endTime[0] > startTime[0] &&
          endTime[1] <= 59 &&
          endTime[1] > startTime[1];
      }
    }
    return flag;
  };

  saveInputEditable = async time => {
    if (this.state.selected && this.state.selected.id != "" && time != "") {
      if (this.validateTime(time)) {
        let startOn = time.split("-")[0].trim();
        let endOn = time.split("-")[1].trim();
        let newTrack = {
          start_time: new Date(
            moment(this.state.selected.start).format(DATE_FORMAT1) +
              " " +
              startOn
          ),
          end_time: new Date(
            moment(this.state.selected.end).format(DATE_FORMAT1) + " " + endOn
          )
        };
        try {
          const { data } = await put(
            newTrack,
            `tasks/${this.props.state.taskEvent.taskId}/edit_tracked_time/${this.state.selected.id}`
          );
          if (data) {
            this.setState({ trackSaved: true });
            this.props.updateTaskEventLogTime(data);
          }
          toast(
            <DailyPloyToast message={"log time updated"} status="success" />,
            {
              autoClose: 2000,
              position: toast.POSITION.TOP_CENTER
            }
          );
        } catch (e) {}
      } else {
        toast(
          <DailyPloyToast message={"please enter valid time"} status="error" />,
          {
            autoClose: 2000,
            position: toast.POSITION.TOP_CENTER
          }
        );
      }
    }
  };

  toggleCheckBox = () => {
    this.setState({ showContacts: !this.state.showContacts });
  };

  handleCheck = (e, contact) => {
    let checked = e.target.checked;
    let arrContact = [];
    if (checked) {
      arrContact = [...this.state.selectContactArr, ...[contact]];
    } else {
      let filterContactArr = this.state.selectContactArr.filter(
        item => item.id !== contact.id
      );
      arrContact = filterContactArr;
    }
    this.setState({
      selectContactArr: arrContact
    });
  };

  handleCheckAll = (e, contacts) => {
    const allCheckboxChecked = e.target.checked;
    var arrContacts;
    if (allCheckboxChecked === true) {
      arrContacts = contacts;
    } else {
      arrContacts = [];
    }
    var checkboxes = document.getElementsByName("isContactChecked");
    if (allCheckboxChecked) {
      for (let i in checkboxes) {
        if (checkboxes[i].checked === false) {
          checkboxes[i].checked = true;
        }
      }
    } else {
      for (let i in checkboxes) {
        if (checkboxes[i].checked === true) {
          checkboxes[i].checked = false;
        }
      }
    }
    this.setState({
      selectContactArr: arrContacts,
      showContacts: allCheckboxChecked
    });
  };

  render() {
    const { props } = this;
    let ligTimes = this.props.state.taskEvent.timeTracked.map((opt, idx) => {
      return this.returnTime(opt);
    });
    return (
      <>
        <Modal
          className="task-delete-confirm-modal"
          show={this.props.state.taskConfirmModal}
          onHide={props.closeTaskModal}
          style={{ paddingTop: "1.5%", paddingBottom: "30px" }}
        >
          <div className="row no-margin">
            <div className="col-md-12 d-inline-block header text-titlize">
              <div className="d-inline-block" style={{ width: "60%" }}>
                {this.props.state.confirmModalText === "mark as completed" ? (
                  <span>{`Mark Task as Completed`}</span>
                ) : (
                  <span>{`${props.state.confirmModalText}  Task`}</span>
                )}
              </div>
              <button
                className="d-inline-block btn btn-link float-right"
                onClick={props.closeTaskModal}
              >
                <img src={Close} alt="close" />
              </button>
            </div>
            <div className="col-md-12 confirm-msg no-padding">
              {this.props.state.confirmModalText === "resume" ? (
                <span>{`Are you sure you want to Resume this task?`}</span>
              ) : null}
              {this.props.state.confirmModalText === "delete" ? (
                <span>{`Are you sure you want to Delete this task?`}</span>
              ) : null}
              {this.props.state.confirmModalText === "mark as completed" ? (
                <span>{`Are you sure you want to mark this task as completed?`}</span>
              ) : null}
            </div>

            {this.props.state.confirmModalText === "mark as completed" &&
            this.props.state.taskEvent.timeTracked.length == 0 ? (
              <div className="col-md-12 task-details log-timer no-padding">
                <span className="col-md-2 d-inline-block no-padding">
                  Log Time
                </span>

                <div className="col-md-5 d-inline-block">
                  <span className="d-inline-block">From</span>
                  <div className="d-inline-block time-picker-container no-padding">
                    <TimePicker
                      value={props.state.logTimeFrom}
                      placeholder="Time"
                      name="logTimeFrom"
                      showSecond={false}
                      onChange={props.handleLogTimeFrom}
                      closeIcon={false}
                      inputReadOnly={false}
                    />
                  </div>
                </div>
                <div className="col-md-4 d-inline-block no-padding">
                  <span className="d-inline-block">To</span>
                  <div className="d-inline-block time-picker-container no-padding">
                    <TimePicker
                      value={props.state.logTimeTo}
                      placeholder="Time"
                      name="logTimeTo"
                      showSecond={false}
                      onChange={props.handleLogTimeTo}
                      closeIcon={false}
                      inputReadOnly={false}
                      disabledMinutes={this.disabledMinutes}
                      disabledHours={this.disabledHours}
                    />
                  </div>
                </div>

                {this.props.state.logTimeFromError ||
                this.props.state.logTimeToError ? (
                  <div className="col-md-12">
                    <div className="col-md-2 d-inline-block no-padding"></div>
                    <div className="col-md-5 d-inline-block no-padding">
                      <span className="error-warning">
                        {this.props.state.logTimeFromError}
                      </span>
                    </div>
                    <div className="col-md-4 d-inline-block no-padding">
                      <span className="error-warning">
                        {this.props.state.logTimeToError}
                      </span>
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}

            {this.props.state.confirmModalText === "mark as completed" &&
            this.props.state.taskEvent.timeTracked.length > 0 ? (
              <div className="col-md-12 task-details log-timer no-padding">
                <span className="col-md-2 d-inline-block no-padding">
                  Log Time
                </span>
                <div
                  className="col-md-8 d-inline-block"
                  style={{ paddingRight: "0px" }}
                >
                  <EditableSelect
                    options={ligTimes}
                    value={this.state.selected}
                    getOptionValue={option => option.id}
                    getOptionLabel={option => option.name}
                    action={true}
                    createOption={text => {
                      return { id: 1, name: text };
                    }}
                    onChange={this.selectedOption}
                    saveInputEditable={this.saveInputEditable}
                    state={this.state.trackSaved}
                  />
                </div>
              </div>
            ) : null}
            {this.props.state.confirmModalText === "mark as completed" ? (
              <div className="col-md-12 contact no-padding">
                <div className="contact-labal-checkbox no-padding">
                  <label>
                    <span>Contacts</span>
                    <input
                      type="checkbox"
                      name="isContactChecked"
                      onChange={e =>
                        this.handleCheckAll(e, this.props.state.taskContacts)
                      }
                      style={{
                        margin: "0px 20px"
                      }}
                    />
                  </label>
                </div>
                <div
                  className={`contact-checkbox no-padding ${
                    this.state.showContacts ? "show" : "hide"
                  }`}
                >
                  {this.props.state.taskContacts.map(contact => {
                    return (
                      <div className="no-padding contact-check text-titlize">
                        <label>
                          <input
                            type="checkbox"
                            id={`contact-checkbox-${contact.id}`}
                            name="isContactChecked"
                            onChange={e => this.handleCheck(e, contact)}
                            style={{
                              margin: "0px 20px"
                            }}
                          />
                          <span>{contact.name}</span>
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}

            <div className="col-md-12 task-details no-padding">
              <span>Task Details</span>
            </div>
            <div className="body text-titlize">
              <div className="col-md-12 no-padding input-row">
                <div className="col-md-2 d-inline-block no-padding label">
                  Name
                </div>
                <div className="col-md-10 d-inline-block">
                  <span className="d-inline-block task-name">
                    {this.props.state.taskName}
                  </span>
                  {this.props.state.taskEvent.status === "not_started" ? (
                    <div className="d-inline-block pull-right not-start-btn">
                      Not started
                    </div>
                  ) : null}
                  {this.props.state.taskEvent.status === "running" ? (
                    <div className="d-inline-block pull-right progress-btn">
                      In progress
                    </div>
                  ) : null}
                  {this.props.state.taskEvent.status === "completed" ? (
                    <div className="d-inline-block pull-right complete-btn">
                      Completed
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="col-md-12 no-padding input-row">
                <div className="col-md-2 d-inline-block no-padding label">
                  Project
                </div>
                <div className="col-md-10 d-inline-block no-padding">
                  {this.renderTaskInfo(this.props.state.project, "block")}
                  {this.renderInfoPriority(
                    this.props.state.taskEvent.priority,
                    "circle"
                  )}
                </div>
              </div>

              <div className="col-md-12 no-padding input-row">
                <div className="col-md-2 d-inline-block no-padding label">
                  Category
                </div>
                <div className="col-md-10 d-inline-block">
                  <span className="">
                    {this.props.state.taskCategorie
                      ? this.props.state.taskCategorie.name
                      : ""}
                  </span>
                </div>
              </div>

              <div className="col-md-12 no-padding input-row">
                <div className="col-md-2 d-inline-block no-padding label">
                  Date - Time
                </div>
                <div className="col-md-10 d-inline-block">
                  <span className=" date-time">
                    {`${moment(this.props.state.dateFrom).format(
                      DATE_FORMAT2
                    )} - 
                    ${moment(this.props.state.dateTo).format(DATE_FORMAT2)}` +
                      "   "}
                    {`${moment(this.props.state.dateFrom).format(HRMIN)} - 
                    ${moment(this.props.state.dateTo).format(HRMIN)}`}
                  </span>
                </div>
              </div>

              <div className="col-md-12 row no-margin no-padding input-row">
                <div className="col-md-2 no-padding label">Comments</div>
                <div className="col-md-10">
                  <p className=" comments">
                    {props.state.taskEvent.comments
                      ? props.state.taskEvent.comments
                      : "---"}
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-12 action-btn">
              <button
                type="button"
                className="btn pull-right button3 btn-primary"
                onClick={() =>
                  !props.state.backFromTaskEvent
                    ? this.props.closeTaskModal()
                    : props.backToTaskInfoModal()
                }
              >
                Cancel
              </button>
              {props.state.confirmModalText === "resume" ? (
                <button
                  type="button"
                  disabled={`${this.props.state.taskloader ? "disabled" : ""}`}
                  className=" button2 pull-right btn-primary text-titlize"
                  onClick={() => props.taskResume(props.state.taskEvent)}
                >
                  {props.state.confirmModalText}
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
              ) : null}

              {props.state.confirmModalText === "delete" ? (
                <button
                  type="button"
                  className=" button2 pull-right btn-primary text-titlize"
                  onClick={() => props.taskDelete(props.state.taskEvent)}
                  disabled={`${this.props.state.taskloader ? "disabled" : ""}`}
                >
                  {props.state.confirmModalText}
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
              ) : null}
              {props.state.confirmModalText === "mark as completed" ? (
                <button
                  type="button"
                  disabled={`${this.props.state.taskloader ? "disabled" : ""}`}
                  className=" mark-btn pull-right btn-primary text-titlize"
                  onClick={() =>
                    props.taskMarkComplete(
                      props.state.taskEvent,
                      this.state.selectContactArr
                    )
                  }
                >
                  {props.state.confirmModalText}
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
              ) : null}
            </div>
          </div>
        </Modal>
      </>
    );
  }
}

export default TaskConfirm;
