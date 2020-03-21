import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import MonthlyEvent from "./../dashboard/MonthlyEvent";
import Select from "./../Select";
import moment from "moment";
import { post, put, mockGet, mockPost } from "../../utils/API";
import { DATE_FORMAT1, FULL_DATE, MONTH_FORMAT } from "./../../utils/Constants";
import {
  convertUTCToLocalDate,
  getContrastColor
} from "./../../utils/function";
import Timer from "./../dashboard/Timer";
import TaskAction from "./../dashboard/TaskAction";
import { Alert, UncontrolledAlert } from "reactstrap";
import { OverlayTrigger } from "react-bootstrap";

class DashboardEvent extends Component {
  constructor(props) {
    super(props);
    this.isToday =
      this.props.end.format(DATE_FORMAT1) ==
      moment(new Date()).format(DATE_FORMAT1);
    this.state = {
      status: false,
      runningTime: 0,
      showTimerMenu: false,
      showAction: false,
      showPopup: false,
      clickEventId: "",
      startOn: "",
      endOn: "",
      canStart: false,
      icon: "play",
      taskTimerLog: [],
      showAlert: false,
      show: false
    };
  }

  // async componentDidMount() {
  //   var startOn = localStorage.getItem(`startOn-${this.props.workspaceId}`);
  //   var taskId = localStorage.getItem(`taskId-${this.props.workspaceId}`);
  //   if (taskId === this.props.event.id && startOn !== "") {
  //     this.setState({
  //       status: true,
  //       startOn: startOn
  //       // icon: "pause"
  //     });
  //   }
  // }

  // handleClick = async event => {
  //   console.log(this.props.state.status);
  //   var icon = this.state.icon;
  //   // var status = this.state.status;
  //   var status = this.props.state.status;
  //   var showAlert = false;
  //   var startOn = "";
  //   if (status) {
  //     var endOn = Date.now();
  //     this.props.handleTaskTracking("stop", event, endOn);
  //     this.handleReset();
  //     this.props.handleTaskBottomPopup("", event, "stop");
  //     status = !this.state.status;
  //   } else {
  //     if (this.props.onGoingTask) {
  //       showAlert = !this.state.showAlert;
  //     } else {
  //       startOn = Date.now();
  //       this.setLocalStorageValue(startOn);
  //       this.props.handleTaskBottomPopup(startOn, this.props.event, "start");
  //       status = !this.state.status;
  //       this.props.handleTaskTracking("start", event, startOn);
  //     }
  //   }
  //   this.setState({
  //     status: status,
  //     showPopup: false,
  //     clickEventId: event.id,
  //     showAlert: showAlert,
  //     startOn: startOn
  //   });
  // };

  // setLocalStorageValue = startOn => {
  //   localStorage.setItem(`startOn-${this.props.workspaceId}`, startOn);
  //   localStorage.setItem(
  //     `taskId-${this.props.workspaceId}`,
  //     this.props.event.id
  //   );
  //   localStorage.setItem(
  //     `colorCode-${this.props.workspaceId}`,
  //     this.props.bgColor
  //   );
  //   localStorage.setItem(
  //     `taskTitle-${this.props.workspaceId}`,
  //     this.props.titleText
  //   );
  // };

  // handleReset = () => {
  //   clearInterval(this.timer);
  //   this.setState({ runningTime: 0, status: false, startOn: "" });
  //   localStorage.setItem(`startOn-${this.props.workspaceId}`, "");
  //   localStorage.setItem(`taskId-${this.props.workspaceId}`, "");
  //   localStorage.setItem(`colorCode-${this.props.workspaceId}`, "");
  //   localStorage.setItem(`taskTitle-${this.props.workspaceId}`, "");
  // };

  showEventPopUp = () => {
    this.setState({ showPopup: !this.state.showPopup });
  };

  hideEventPopUp = () => {
    this.setState({ showPopup: false });
  };

  ToggleTimerDropDown = id => {
    this.setState({
      clickEventId: id,
      showTimerMenu: !this.state.showTimerMenu,
      showPopup: false,
      show: false
    });
  };

  ToggleActionDropDown = id => {
    this.setState({
      clickEventId: id,
      showAction: !this.state.showAction,
      showPopup: false
    });
  };

  async markCompleteTask(id) {
    if (id) {
      try {
        const { data } = await mockGet("mark-complete");
        var isComplete = data[0].complete;
      } catch (e) {}
      if (isComplete) {
        var taskId = localStorage.getItem(`taskId-${this.props.workspaceId}`);
        this.handleReset();
        this.setState({ icon: "check", showAction: false });
        if (taskId === id) {
          this.props.handleTaskBottomPopup("", this.props.event, "stop");
        }
      }
    }
  }

  async deleteTask(id) {
    if (id) {
      try {
        const { data } = await mockGet("mark-complete");
        var isComplete = data[0].complete;
      } catch (e) {}
      if (isComplete) {
      }
    }
  }

  isValidUserDate = userId => {
    return this.props.userId === userId;
    // return this.isToday && this.props.userId === userId;
  };

  returnTime = time => {
    return `${moment(time.start_time).format("HH.mm A")} - ${moment(
      time.end_time
    ).format("HH.mm A")}`;
  };

  createLogTimes = times => {
    return times.map(time => {
      return {
        id: time.id,
        name: `${moment(time.start_time).format("HH.mm A")} - ${moment(
          time.end_time
        ).format("HH.mm A")}`
      };
    });
  };

  onClickInput = () => {
    this.setState({
      clickEventId: this.props.event.id,
      show: true,
      showAction: false
    });
  };

  calculateTime = event => {
    var start = new Date(
      moment(convertUTCToLocalDate(event.taskStartDateTime))
        .format(FULL_DATE)
        .replace(/-/g, "/")
    );
    var end = new Date(
      moment(convertUTCToLocalDate(event.taskEndDateTime))
        .format(FULL_DATE)
        .replace(/-/g, "/")
    );
    var timeDiff = "00:00";
    if (
      moment(start).format("HH:mm") != "00:00" &&
      moment(end).format("HH:mm") != "00:00"
    ) {
      let totalSeconds = (end - start) / 1000;
      totalSeconds = Number(totalSeconds);
      var h = Math.floor(totalSeconds / 3600);
      var m = Math.floor((totalSeconds % 3600) / 60);
      var s = Math.floor((totalSeconds % 3600) % 60);
      var timeDiff =
        ("0" + h).slice(`${h}`.length > 2 ? -3 : -2) +
        ":" +
        ("0" + m).slice(-2);
    }
    return timeDiff;
  };

  onClickOutside = () => {
    this.setState({
      show: !this.state.show,
      showAction: false
    });
  };

  actionOnClickOutside = () => {
    this.setState({
      showAction: !this.state.showAction,
      show: false
    });
  };

  render() {
    const {
      eventItemClick,
      start,
      end,
      event,
      mustAddCssClass,
      divStyle,
      borderLeft,
      schedulerData,
      titleText,
      state
    } = this.props;
    console.log(event);

    const totalTrackTime = this.props.event.allTimeTracked
      .map(log => log.duration)
      .flat()
      .reduce((a, b) => a + b, 0);
    let todaysLog = this.props.event.timeTracked.filter(
      log => log.status != "running"
    );
    let logs = this.createLogTimes(todaysLog);
    let contColor = getContrastColor(this.props.bgColor);
    return (
      <>
        {schedulerData.viewType === 0 ? (
          <div key={event.id} className={mustAddCssClass} style={divStyle}>
            <div className="row item dashboard-event-box">
              <div
                className="col-md-12 pointer item-heading text-wraper"
                style={{ padding: "5px 5px 0px 5px", color: contColor }}
                onClick={() => {
                  if (!!eventItemClick) eventItemClick(schedulerData, event);
                }}
              >
                {titleText}
              </div>

              <div className="col-md-12 no-padding">
                <OverlayTrigger
                  placement="auto"
                  trigger="hover"
                  overlay={this.props.eventItemPopoverTemplateResolver(
                    schedulerData,
                    event,
                    titleText,
                    start,
                    end,
                    this.props.bgColor
                  )}
                >
                  <div className="col-md-10 no-padding d-inline-block">
                    <div className="col-md-2 no-padding d-inline-block">
                      <div className={`${this.props.event.priority}`}></div>
                    </div>
                    <div className="col-md-8 no-padding d-inline-block ">
                      <span className="task-timer" style={{ color: contColor }}>
                        <Timer
                          totalDuration={totalTrackTime}
                          startOn={this.props.event.startOn}
                          isStart={this.props.event.startOn ? true : false}
                        />
                        {" of"} {this.calculateTime(event)}
                      </span>
                    </div>
                  </div>
                </OverlayTrigger>

                {event.trackingStatus === "pause" &&
                event.status === "running" ? (
                  <div className="col-md-2 no-padding d-inline-block">
                    <span
                      style={{
                        pointerEvents: this.isValidUserDate(event.resourceId)
                          ? ""
                          : "none"
                      }}
                      className={`day-task-play-btn pointer ${
                        state.isPlayPause ? "disabled" : ""
                      }`}
                      onClick={() =>
                        this.props.handleTaskStop(event, Date.now())
                      }
                    >
                      <i className="fa fa-pause"></i>
                    </span>
                  </div>
                ) : null}

                {event.trackingStatus === "play" &&
                event.status === "not_started" ? (
                  <div className="col-md-2 no-padding d-inline-block">
                    <span
                      style={{
                        pointerEvents: this.isValidUserDate(event.resourceId)
                          ? ""
                          : "none"
                      }}
                      onClick={() =>
                        this.props.handleTaskStart(event, Date.now())
                      }
                      className={`day-task-play-btn pointer ${
                        state.isPlayPause ? "disabled" : ""
                      }`}
                    >
                      <i className="fa fa-power-off"></i>
                    </span>
                  </div>
                ) : null}

                {event.trackingStatus === "play" &&
                event.status === "running" ? (
                  <div className="col-md-2 no-padding d-inline-block">
                    <span
                      style={{
                        pointerEvents: this.isValidUserDate(event.resourceId)
                          ? ""
                          : "none"
                      }}
                      className={`day-task-play-btn pointer ${
                        state.isPlayPause ? "disabled" : ""
                      }`}
                      onClick={() =>
                        this.props.handleTaskStart(event, Date.now())
                      }
                    >
                      <i className="fa fa-play"></i>
                    </span>
                  </div>
                ) : null}

                {event.status === "completed" ? (
                  <div className="col-md-2 no-padding d-inline-block">
                    <span className="day-task-play-btn">
                      <i className="fa fa-check"></i>
                    </span>
                  </div>
                ) : null}
              </div>
              <div
                className="col-md-12 no-padding"
                style={{ color: contColor }}
              >
                {logs.length > 0 ? (
                  <>
                    <div
                      className="no-padding d-inline-block event-active-log"
                      onClick={() => this.onClickInput()}
                      style={this.state.show ? { backgroundColor: "#fff" } : {}}
                    >
                      <li
                        style={
                          this.state.show
                            ? { color: "#000" }
                            : { color: contColor }
                        }
                      >
                        {logs[0].name}
                      </li>
                    </div>
                    <i
                      style={
                        this.state.show
                          ? { color: "#000" }
                          : { color: contColor }
                      }
                      className="fa fa-angle-down log-angle-down"
                    ></i>
                  </>
                ) : (
                  <div
                    className="no-padding d-inline-block no-track-time text-right"
                    style={{ fontSize: "12px" }}
                  >
                    <span>No tracked time</span>
                  </div>
                )}
                <div
                  className="no-padding d-inline-block three-dot"
                  // style={{ float: "right" }}
                >
                  <span
                    className="task-event-action pointer"
                    onClick={() => this.ToggleActionDropDown(event.id)}
                  >
                    ...
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {schedulerData.viewType === 1 ? (
          <div
            key={event.id}
            className={`${mustAddCssClass}
             `}
            // style={divStyle}
            style={borderLeft}
          >
            <div className="row item dashboard-event-box ">
              {/* <div
                className="col-md-12 no-padding pointer item-heading text-wraper"
                style={{
                  padding: "5px 5px 0px 5px",
                  color: getContrastColor(this.props.bgColor)
                }}
                onClick={() => {
                  if (!!eventItemClick) eventItemClick(schedulerData, event);
                }}
              >
                {titleText}
              </div> */}
              <div className="col-md-7 no-padding">
                <div className="project-name-text" style={divStyle}>
                  <span className="name-text-dot">{event.projectName}</span>
                </div>
              </div>

              {/* <div className="col-md-6 no-padding"> */}
              <div className="col-md-4 align-center no-padding">
                {event.trackingStatus === "pause" &&
                event.status === "running" ? (
                  <div className=" no-padding d-inline-block">
                    <span
                      style={{
                        pointerEvents: this.isValidUserDate(event.resourceId)
                          ? ""
                          : "none"
                      }}
                      className={`task-play-btn pointer ${
                        state.isPlayPause ? "disabled" : ""
                      }`}
                      onClick={() =>
                        this.props.handleTaskStop(event, Date.now())
                      }
                    >
                      <i className="fa fa-pause"></i>
                    </span>
                  </div>
                ) : null}

                {event.trackingStatus === "play" &&
                event.status === "not_started" ? (
                  <div className=" no-padding d-inline-block">
                    <span
                      style={{
                        pointerEvents: this.isValidUserDate(event.resourceId)
                          ? ""
                          : "none"
                      }}
                      className={`task-play-btn pointer ${
                        state.isPlayPause ? "disabled" : ""
                      }`}
                      onClick={() =>
                        this.props.handleTaskStart(event, Date.now())
                      }
                    >
                      <i className="fa fa-power-off"></i>
                    </span>
                  </div>
                ) : null}

                {event.trackingStatus === "play" &&
                event.status === "running" ? (
                  <div className=" no-padding d-inline-block">
                    <span
                      style={{
                        pointerEvents: this.isValidUserDate(event.resourceId)
                          ? ""
                          : "none"
                      }}
                      className={`task-play-btn pointer ${
                        state.isPlayPause ? "disabled" : ""
                      }`}
                      onClick={() =>
                        this.props.handleTaskStart(event, Date.now())
                      }
                    >
                      <i className="fa fa-play"></i>
                    </span>
                  </div>
                ) : null}

                {event.status === "completed" ? (
                  <div className=" no-padding d-inline-block">
                    <span className="task-play-btn">
                      <i className="fa fa-check"></i>
                    </span>
                  </div>
                ) : null}
              </div>
              <div className="col-md-1 align-center no-padding">
                <div className="no-padding d-inline-block three-dot">
                  <span
                    className="task-event-action pointer"
                    onClick={() => this.ToggleActionDropDown(event.id)}
                  >
                    ...
                  </span>
                </div>
              </div>
              {/* </div> */}

              {/* </div> */}
            </div>

            {/* <div className="col-md-6 no-padding"></div> */}
            <div className="row date-div-card">
              {/* <div className="col-md-12 no-padding date-div-card"> */}
              <span>
                {moment(event.taskStartDateTime).format("DD MMM, HH:MM")}
              </span>

              <span style={{ margin: "0px 12px" }}> - </span>

              <span>
                {moment(event.taskEndDateTime).format("DD MMM, HH:MM")}
              </span>
              {/* </div> */}
            </div>

            {/* <div className="col-md-6 no-padding">
                <div className="date-div-card">
                  <span>
                    {moment(event.taskStartDateTime).format("DD MMM-")}
                  </span>

                  <span>{moment(event.taskEndDateTime).format("DD MMM")}</span>
                </div>
                <div className="date-div-card">
                  <span>{moment(event.taskStartDateTime).format("HH:MM")}</span>
                  <span style={{ margin: "0px 2px" }}>To</span>
                  <span>{moment(event.taskEndDateTime).format("HH:MM")}</span>
                </div>
              </div> */}
            <div className="row item dashboard-event-box AB">
              <OverlayTrigger
                placement="auto"
                trigger="hover"
                overlay={this.props.eventItemPopoverTemplateResolver(
                  schedulerData,
                  event,
                  titleText,
                  start,
                  end,
                  this.props.bgColor
                )}
              >
                <div className="col-md-9 no-padding flex-center">
                  <div className="col-md-2 no-padding flex-center">
                    <div className={`${this.props.event.priority}`}></div>
                  </div>
                  <div className="col-md-3 no-padding d-inline-block ">
                    <span className="task-timer" style={{ color: contColor }}>
                      <Timer
                        totalDuration={totalTrackTime}
                        startOn={this.props.event.startOn}
                        isStart={this.props.event.startOn ? true : false}
                      />
                      {" of"} {this.calculateTime(event)}
                    </span>
                  </div>
                </div>
              </OverlayTrigger>
              {/* 
              {event.trackingStatus === "pause" &&
              event.status === "running" ? (
                <div className="col-md-3 no-padding d-inline-block">
                  <span
                    style={{
                      pointerEvents: this.isValidUserDate(event.resourceId)
                        ? ""
                        : "none"
                    }}
                    className={`task-play-btn pointer ${
                      state.isPlayPause ? "disabled" : ""
                    }`}
                    onClick={() => this.props.handleTaskStop(event, Date.now())}
                  >
                    <i className="fa fa-pause"></i>
                  </span>
                </div>
              ) : null}

              {event.trackingStatus === "play" &&
              event.status === "not_started" ? (
                <div className="col-md-2 no-padding d-inline-block">
                  <span
                    style={{
                      pointerEvents: this.isValidUserDate(event.resourceId)
                        ? ""
                        : "none"
                    }}
                    className={`task-play-btn pointer ${
                      state.isPlayPause ? "disabled" : ""
                    }`}
                    onClick={() =>
                      this.props.handleTaskStart(event, Date.now())
                    }
                  >
                    <i className="fa fa-power-off"></i>
                  </span>
                </div>
              ) : null}

              {event.trackingStatus === "play" && event.status === "running" ? (
                <div className="col-md-2 no-padding d-inline-block">
                  <span
                    style={{
                      pointerEvents: this.isValidUserDate(event.resourceId)
                        ? ""
                        : "none"
                    }}
                    className={`task-play-btn pointer ${
                      state.isPlayPause ? "disabled" : ""
                    }`}
                    onClick={() =>
                      this.props.handleTaskStart(event, Date.now())
                    }
                  >
                    <i className="fa fa-play"></i>
                  </span>
                </div>
              ) : null}

              {event.status === "completed" ? (
                <div className="col-md-2 no-padding d-inline-block">
                  <span className="task-play-btn">
                    <i className="fa fa-check"></i>
                  </span>
                </div>
              ) : null} */}
            </div>
            <div className="row item dashboard-event-box">
              <div
                className="col-md-12 no-padding"
                style={{ color: contColor }}
              >
                {/* {logs.length > 0 ? (
                  <>
                    <div
                      className="no-padding d-inline-block event-active-log"
                      onClick={() => this.onClickInput()}
                      style={
                        this.state.show
                          ? { color: contColor, backgroundColor: "#fff" }
                          : {}
                      }
                    >
                      <li
                        style={
                          this.state.show
                            ? { color: "#000" }
                            : { color: contColor }
                        }
                      >
                        {logs[0].name}
                      </li>
                    </div>
                    <i
                      style={
                        this.state.show
                          ? { color: "#000" }
                          : { color: contColor }
                      }
                      className="fa fa-angle-down log-angle-down"
                    ></i>
                  </>
                ) : (
                  // <div
                  //   className="no-padding d-inline-block no-track-time text-right"
                  //   style={{ fontSize: "12px" }}
                  // >
                  //   <span>No tracked time</span>
                  // </div>
                  // <div className="">{`${option[name]}`}</div>
                  // <div className="">{event.projectName}</div>
                 
                // )} */}
                <div
                  className="col-md-12 no-padding pointer item-heading text-wraper"
                  style={{
                    padding: "5px 5px 0px 5px",
                    color: getContrastColor(this.props.bgColor)
                  }}
                  onClick={() => {
                    if (!!eventItemClick) eventItemClick(schedulerData, event);
                  }}
                >
                  <span className="project-task-name">{titleText}</span>
                </div>
                {/* <div
                  className="no-padding d-inline-block three-dot"
                  // style={{ float: "right" }}
                >
                  <span
                    className="task-event-action pointer"
                    onClick={() => this.ToggleActionDropDown(event.id)}
                  >
                    ...
                  </span>
                </div> */}
              </div>
            </div>
          </div>
        ) : null}

        {schedulerData.viewType === 2 ? (
          <MonthlyEvent
            state={this.props}
            hideEventPopUp={this.hideEventPopUp}
            showEventPopUp={this.showEventPopUp}
          />
        ) : null}

        {/* {this.state.clickEventId === event.id && this.state.show ? (
          <Select
            state={this.state}
            options={logs}
            onClickInput={this.onClickOutside}
          />
        ) : null} */}

        {this.state.showTimerMenu && this.state.clickEventId === event.id ? (
          <div className={`dropdown-div `}>
            {todaysLog.time_tracks.map((time, idx) => {
              if (idx !== 0) {
                return (
                  <div className="hover-border" key={time.id}>
                    {this.returnTime(time)}
                  </div>
                );
              }
            })}
          </div>
        ) : null}

        {this.state.showAction && this.state.clickEventId === event.id ? (
          <TaskAction
            event={event}
            actionOnClickOutside={this.actionOnClickOutside}
            taskEventResumeConfirm={this.props.taskEventResumeConfirm}
          />
        ) : null}

        {/* {this.state.showAction && this.state.clickEventId === event.id ? (
          <div className="d-inline-block event-action-dropdown">
            {this.props.event.status !== "completed" ? (
              <>
                <div
                  className="border-bottom pointer"
                  style={{ padding: "5px 0px 0px 0px" }}
                  // onClick={() => this.markCompleteTask(event.id)}
                  onClick={() =>
                    this.props.taskEventResumeConfirm(
                      event,
                      "mark as completed"
                    )
                  }
                >
                  Mark Complete
                </div>
                <div
                  className="pointer"
                  style={{ padding: "5px 0px 5px 0px" }}
                  onClick={() =>
                    this.props.taskEventResumeConfirm(event, "delete")
                  }
                >
                  Delete Task
                </div>
              </>
            ) : (
              <div
                className="pointer"
                style={{ padding: "5px 0px 5px 0px" }}
                onClick={() =>
                  this.props.taskEventResumeConfirm(event, "resume")
                }
              >
                Resume
              </div>
            )}
          </div>
        ) : null} */}

        <div className="custom-event-popup">
          {this.state.showPopup
            ? this.props.eventItemPopoverTemplateResolver(
                schedulerData,
                event,
                titleText,
                start,
                end,
                this.props.bgColor
              )
            : null}
        </div>

        {state.showAlert && state.showEventAlertId == event.id ? (
          <UncontrolledAlert className="task-war-alert" color="warning">
            one task already ongoing !
          </UncontrolledAlert>
        ) : null}
      </>
    );
  }
}

export default withRouter(DashboardEvent);
