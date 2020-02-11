import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import MonthlyEvent from "./../dashboard/MonthlyEvent";
import Select from "./../Select";
import moment from "moment";
import { post, put, mockGet, mockPost } from "../../utils/API";
import { DATE_FORMAT1, MONTH_FORMAT } from "./../../utils/Constants";
import Timer from "./../dashboard/Timer";
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

  async componentDidMount() {
    var startOn = localStorage.getItem(`startOn-${this.props.workspaceId}`);
    var taskId = localStorage.getItem(`taskId-${this.props.workspaceId}`);
    if (taskId === this.props.event.id && startOn !== "") {
      this.setState({
        status: true,
        startOn: startOn
        // icon: "pause"
      });
    }
  }

  handleClick = async event => {
    console.log(this.props.state.status);
    var icon = this.state.icon;
    // var status = this.state.status;
    var status = this.props.state.status;
    var showAlert = false;
    var startOn = "";
    if (status) {
      var endOn = Date.now();
      this.props.handleTaskTracking("stop", event, endOn);
      this.handleReset();
      this.props.handleTaskBottomPopup("", event, "stop");
      status = !this.state.status;
    } else {
      if (this.props.onGoingTask) {
        showAlert = !this.state.showAlert;
      } else {
        startOn = Date.now();
        this.setLocalStorageValue(startOn);
        this.props.handleTaskBottomPopup(startOn, this.props.event, "start");
        status = !this.state.status;
        this.props.handleTaskTracking("start", event, startOn);
      }
    }
    this.setState({
      status: status,
      showPopup: false,
      clickEventId: event.id,
      showAlert: showAlert,
      startOn: startOn
    });
  };

  setLocalStorageValue = startOn => {
    localStorage.setItem(`startOn-${this.props.workspaceId}`, startOn);
    localStorage.setItem(
      `taskId-${this.props.workspaceId}`,
      this.props.event.id
    );
    localStorage.setItem(
      `colorCode-${this.props.workspaceId}`,
      this.props.bgColor
    );
    localStorage.setItem(
      `taskTitle-${this.props.workspaceId}`,
      this.props.titleText
    );
  };

  handleReset = () => {
    clearInterval(this.timer);
    this.setState({ runningTime: 0, status: false, startOn: "" });
    localStorage.setItem(`startOn-${this.props.workspaceId}`, "");
    localStorage.setItem(`taskId-${this.props.workspaceId}`, "");
    localStorage.setItem(`colorCode-${this.props.workspaceId}`, "");
    localStorage.setItem(`taskTitle-${this.props.workspaceId}`, "");
  };

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

  onClickOutside = () => {
    this.setState({
      show: !this.state.show,
      showAction: false
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
      schedulerData,
      titleText,
      state
    } = this.props;
    const totalTrackTime = this.props.event.allTimeTracked
      .map(log => log.duration)
      .flat()
      .reduce((a, b) => a + b, 0);
    let todaysLog = this.props.event.timeTracked.filter(
      log => log.status != "running"
    );
    let logs = this.createLogTimes(todaysLog);
    return (
      <>
        {schedulerData.viewType === 0 || schedulerData.viewType === 1 ? (
          <div key={event.id} className={mustAddCssClass} style={divStyle}>
            <div className="row item dashboard-event-box">
              <div
                className="col-md-12 pointer item-heading text-wraper"
                style={{ padding: "5px 5px 0px 5px" }}
                onClick={() => {
                  if (!!eventItemClick) eventItemClick(schedulerData, event);
                }}
              >
                {titleText}
              </div>

              <div className="d-inline-block">
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
                  <div
                    className="d-inline-block"
                    style={{ position: "relative" }}
                  >
                    <div
                      className={`d-inline-block ${this.props.event.priority}`}
                    ></div>
                    <div className="d-inline-block task-timer">
                      <Timer
                        totalDuration={totalTrackTime}
                        startOn={this.props.event.startOn}
                        isStart={this.props.event.startOn ? true : false}
                      />
                    </div>
                  </div>
                </OverlayTrigger>

                {event.trackingStatus === "pause" ? (
                  <div
                    style={{
                      pointerEvents: this.isValidUserDate(event.resourceId)
                        ? ""
                        : "none"
                    }}
                    className="d-inline-block task-play-btn pointer"
                    // onClick={() => this.handleClick(event)}
                    onClick={() => this.props.handleTaskStartTop(event)}
                  >
                    <i className="fa fa-pause"></i>
                  </div>
                ) : null}

                {event.trackingStatus === "play" ? (
                  <div
                    style={{
                      pointerEvents: this.isValidUserDate(event.resourceId)
                        ? ""
                        : "none"
                    }}
                    className="d-inline-block task-play-btn pointer"
                    onClick={() => this.props.handleTaskStartTop(event)}
                  >
                    <i className="fa fa-play"></i>
                  </div>
                ) : null}

                {event.status === "completed" ? (
                  <div className="d-inline-block task-play-btn">
                    <i className="fa fa-check"></i>
                  </div>
                ) : null}
              </div>
              <div className="col-md-12 no-padding">
                {logs.length > 0 ? (
                  <>
                    <div
                      className="no-padding d-inline-block event-active-log"
                      onClick={() => this.onClickInput()}
                      style={this.state.show ? { backgroundColor: "#fff" } : {}}
                    >
                      <li>{logs[0].name}</li>
                    </div>
                    <i className="fa fa-angle-down log-angle-down"></i>
                  </>
                ) : (
                  <div
                    className="no-padding d-inline-block no-track-time text-right"
                    style={{ fontSize: "12px" }}
                  >
                    <span> No Tracked time</span>
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
        ) : (
          <MonthlyEvent
            state={this.props}
            hideEventPopUp={this.hideEventPopUp}
            showEventPopUp={this.showEventPopUp}
          />
        )}

        {this.state.clickEventId === event.id && this.state.show ? (
          <Select
            state={this.state}
            options={logs}
            onClickInput={this.onClickOutside}
          />
        ) : null}

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
          <div className="d-inline-block event-action-dropdown">
            {this.props.event.status !== "completed" ? (
              <>
                <div
                  className="border-bottom pointer"
                  style={{ padding: "5px 0px 0px 0px" }}
                  onClick={() => this.markCompleteTask(event.id)}
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
        ) : null}

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
