import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import "rc-time-picker/assets/index.css";
import "react-datepicker/dist/react-datepicker.css";
import Close from "../../assets/images/close.svg";
import moment from "moment";
import { post, mockGet, mockPost } from "../../utils/API";
import { DATE_FORMAT2, DATE_FORMAT1 } from "./../../utils/Constants";
import { UncontrolledAlert } from "reactstrap";

class TaskInfoModal extends Component {
  constructor(props) {
    super(props);
    this.priority = {
      name: "high",
      color_code: "#00A031"
    };
    this.state = {
      color: "#ffffff",
      showTimerMenu: false
    };
  }

  async markCompleteTask() {
    const eventTaskId = this.props.state.taskEvent.id;
    if (eventTaskId) {
      try {
        const { data } = await mockGet("mark-complete");
        var isComplete = data[0].complete;
      } catch (e) {}
      if (isComplete) {
        var taskId = localStorage.getItem(
          `taskId-${this.props.state.workspaceId}`
        );
        this.handleReset();
        this.props.handleTaskPlay("check");
        if (eventTaskId === taskId) {
          this.props.handleTaskBottomPopup("", null, "stop");
        }
      }
    }
  }

  async resumeCompletedTask() {
    const eventTaskId = this.props.state.taskEvent.id;
    if (eventTaskId) {
      try {
        const { data } = await mockGet("mark-complete");
        var isComplete = data[0].complete;
      } catch (e) {}
      if (isComplete) {
        // this.setState({ icon: "play" })
        this.props.handleTaskPlay("play");
      }
    }
  }

  isToday = () => {
    return this.props.state.dateTo
      ? moment(this.props.state.dateTo).format(DATE_FORMAT1) ==
          moment(new Date()).format(DATE_FORMAT1)
      : false;
  };
  async componentDidMount() {
    var startOn = localStorage.getItem(
      `startOn-${this.props.state.workspaceId}`
    );
    var taskId = localStorage.getItem(`taskId-${this.props.state.workspaceId}`);
    if (taskId === this.props.state.taskId && startOn !== "") {
      this.setState({
        status: true,
        startOn: startOn,
        icon: "pause"
      });
    } else {
      this.setState({
        status: false,
        startOn: "",
        icon: "play"
      });
    }
  }

  initalChar = str => {
    var matches = str.match(/\b(\w)/g);
    return matches.join("").toUpperCase();
  };

  ToggleTimerDropDown = id => {
    this.setState({ showTimerMenu: !this.state.showTimerMenu });
  };

  renderMemberInfo = option => {
    if (option && option.length > 0) {
      return (
        <div className="select-member">
          <div className="member-title d-inline-block">
            <i className="fa fa-user"></i>
          </div>
          <div className="right-left-space-5 d-inline-block">
            {option[0].name}
          </div>
        </div>
      );
    } else {
      return "";
    }
  };

  renderTaskInfo = (option, type) => {
    if (option) {
      const klass =
        type == "block" ? "color-block" : type == "circle" ? "color-dot" : "";
      return (
        <div className="">
          <div
            className={`d-inline-block ${klass}`}
            style={{
              backgroundColor: `${
                option.color_code ? option.color_code : this.state.color
              }`
            }}
          ></div>
          <div className="right-left-space-5 d-inline-block">{option.name}</div>
        </div>
      );
    }
    return "";
  };

  isValidUserDate = () => {
    const props = this.props.state;
    // return this.isToday() && props.taskEvent.resourceId === props.userId;
    return props.taskEvent.resourceId === props.userId;
  };

  async saveTaskTrackingTime(endOn) {
    var taskData = {
      startdate: new Date(this.state.startOn),
      enddate: new Date(endOn)
    };
    try {
      const { data } = await mockPost(taskData, "task-track");
      if (data) {
        var timeArr = [this.state.timeArr, ...[]];
        var sTime = moment(data.startdate).format("HH:mm");
        var eTime = moment(data.enddate).format("HH:mm");
        timeArr.push(`${sTime} - ${eTime}`);
        this.setState({ timeArr: timeArr });
      }
    } catch (e) {}
  }

  handleReset = () => {
    clearInterval(this.timer);
    this.setState({ runningTime: 0, status: false, startOn: "" });
    localStorage.setItem(`startOn-${this.props.state.workspaceId}`, "");
    localStorage.setItem(`taskId-${this.props.state.workspaceId}`, "");
    localStorage.setItem(`colorCode-${this.props.state.workspaceId}`, "");
    localStorage.setItem(`taskTitle-${this.props.state.workspaceId}`, "");
  };

  returnTime = time => {
    return `${moment(time.start_time).format("HH.mm")} - ${moment(
      time.end_time
    ).format("HH.mm")}`;
  };

  displayTotalTime = () => {
    if (this.props.state.timeTracked.length > 0) {
      var totalSec = 0;
      this.props.state.timeTracked.map(time => {
        totalSec += time.duration;
      });
      var h = Math.floor(totalSec / 3600);
      var m = Math.floor((totalSec % 3600) / 60);
      var s = Math.floor((totalSec % 3600) % 60);

      return (
        ("0" + h).slice(-2) +
        ":" +
        ("0" + m).slice(-2) +
        ":" +
        ("0" + s).slice(-2) +
        " h"
      );
    } else {
      var start = this.props.state.dateFrom;
      var end = this.props.state.dateTo;
      let totalMilSeconds = new Date(end) - new Date(start);
      var totalSeconds = totalMilSeconds / 1000;
      totalSeconds = Number(totalSeconds);
      var h = Math.floor(totalSeconds / 3600);
      var m = Math.floor((totalSeconds % 3600) / 60);
      var s = Math.floor((totalSeconds % 3600) % 60);
      return (
        ("0" + h).slice(-2) +
        ":" +
        ("0" + m).slice(-2) +
        ":" +
        ("0" + s).slice(-2) +
        " h"
      );
    }
  };

  render() {
    const { props } = this;
    return (
      <>
        <Modal
          className="task-info-modal"
          show={this.props.state.showInfo}
          onHide={props.closeTaskModal}
          style={{ paddingTop: "1.5%", paddingBottom: "30px" }}
        >
          <div className="row no-margin">
            <div className="col-md-12 d-inline-block header text-titlize">
              <div className="d-inline-block" style={{ width: "60%" }}>
                <span>{"Task Details"}</span>
              </div>
              <div className="action-btn d-inline-block">
                {this.props.icon !== "check" ? (
                  <>
                    <button
                      className="d-inline-block btn btn-link"
                      onClick={() => props.confirmModal("delete")}
                    >
                      {" "}
                      Delete
                    </button>
                    <button
                      className="d-inline-block btn btn-link"
                      onClick={props.taskInfoEdit}
                    >
                      Edit
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => props.confirmModal("resume")}
                    className="d-inline-block btn btn-link"
                  >
                    Resume
                  </button>
                )}
              </div>
              <button
                className="d-inline-block btn btn-link float-right"
                onClick={props.closeTaskModal}
              >
                <img src={Close} alt="close" />
              </button>
            </div>

            <div className="col-md-12 body d-inline-block text-titlize">
              <div className="input-row">
                <div className="d-inline-block">
                  {this.props.icon == "pause" ? (
                    <div
                      style={{
                        pointerEvents: this.isValidUserDate() ? "" : "none"
                      }}
                      className="d-inline-block task-play-btn pointer"
                      onClick={() => this.props.handleTaskStartTop()}
                    >
                      <i className="fa fa-pause"></i>
                    </div>
                  ) : null}

                  {this.props.icon == "play" ? (
                    <div
                      style={{
                        pointerEvents: this.isValidUserDate() ? "" : "none"
                      }}
                      className="d-inline-block task-play-btn pointer"
                      onClick={() => this.props.handleTaskStartTop()}
                    >
                      <i className="fa fa-play"></i>
                    </div>
                  ) : null}

                  {this.props.icon == "check" ? (
                    <div className="d-inline-block task-play-btn">
                      <i className="fa fa-check"></i>
                    </div>
                  ) : null}

                  {this.props.state.showAlert ? (
                    <UncontrolledAlert
                      className="task-war-alert"
                      color="warning"
                    >
                      one task already ongoing !
                    </UncontrolledAlert>
                  ) : null}
                </div>
                <div className="d-inline-block header-2">
                  <span>{"2hr 30mins"}</span>
                </div>
                {this.props.icon === "check" ? (
                  <div className="d-inline-block button3">
                    <span>Completed</span>
                  </div>
                ) : (
                  <div
                    onClick={() => props.confirmModal("mark as completed")}
                    className="d-inline-block button2 pointer"
                  >
                    <span>Mark Complete</span>
                  </div>
                )}
              </div>
            </div>

            <div className="col-md-12 body">
              <div className="col-md-12 no-padding input-row text-titlize">
                <div className="col-md-2 d-inline-block no-padding label">
                  Name
                </div>
                <div className="col-md-10 d-inline-block">
                  <span className="left-padding-20px">
                    {props.state.taskName}
                  </span>
                </div>
              </div>

              <div className="col-md-12 no-padding input-row text-titlize">
                <div className="col-md-2 d-inline-block no-padding label">
                  Project
                </div>
                <div className="col-md-10 d-inline-block">
                  {this.renderTaskInfo(props.state.project, "block")}
                </div>
              </div>

              <div className="col-md-12 no-padding input-row text-titlize">
                <div className="col-md-2 d-inline-block no-padding label">
                  Category
                </div>
                <div className="col-md-10 d-inline-block">
                  <span className="left-padding-20px">
                    {props.state.taskCategorie
                      ? props.state.taskCategorie.name
                      : "---"}
                  </span>
                </div>
              </div>

              <div className="col-md-12 no-padding input-row text-titlize">
                <div className="col-md-2 d-inline-block no-padding label">
                  Priority
                </div>
                <div className="col-md-10 d-inline-block">
                  {this.renderTaskInfo(this.priority, "circle")}
                </div>
              </div>

              <div className="col-md-12 no-padding input-row text-titlize">
                <div className="col-md-2 d-inline-block no-padding label">
                  Member
                </div>
                <div className="col-md-10 d-inline-block">
                  {this.renderMemberInfo(this.props.state.selectedMembers)}
                </div>
              </div>

              <div className="col-md-12 no-padding input-row text-titlize">
                <div className="col-md-2 d-inline-block no-padding label">
                  Date
                </div>
                <div className="col-md-10 d-inline-block">
                  <div className="col-md-12 d-inline-block">
                    <div className="col-md-4 d-inline-block no-padding">
                      {moment(props.state.dateFrom).format(DATE_FORMAT2)}
                    </div>
                    <div className="col-md-4 d-inline-block no-padding">
                      {moment(props.state.dateTo).format(DATE_FORMAT2)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-12 no-padding input-row ">
                <div className="col-md-2 d-inline-block no-padding label">
                  Time
                </div>
                <div className="col-md-10 d-inline-block">
                  <div className="col-md-4 d-inline-block">
                    <div className="timer-dropdown">
                      <input
                        className="d-inline-block"
                        className={this.state.showTimerMenu ? "border" : ""}
                        defaultValue={
                          this.props.state.timeTracked.length > 0
                            ? this.returnTime(this.props.state.timeTracked[0])
                            : "00:00 - 00:00"
                        }
                        onClick={() => this.ToggleTimerDropDown()}
                        readOnly
                      />
                      {this.state.showTimerMenu ? (
                        <div className="dropdown">
                          {this.props.state.timeTracked.map((time, idx) => {
                            if (idx != 0) {
                              return (
                                <div className="border" key={time.id}>
                                  {" "}
                                  {this.returnTime(time)}{" "}
                                </div>
                              );
                            }
                          })}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="col-md-4 d-inline-block">
                    <span className="d-inline-block">
                      {this.displayTotalTime()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="col-md-12 row no-margin no-padding input-row text-titlize">
                <div className="col-md-2 no-padding label">Comments</div>
                <div className="col-md-10">
                  <p className="left-padding-20px comments">
                    {props.state.taskEvent.comments
                      ? props.state.taskEvent.comments
                      : "---"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </>
    );
  }
}

export default TaskInfoModal;
