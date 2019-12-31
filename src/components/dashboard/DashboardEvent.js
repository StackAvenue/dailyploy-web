import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import MonthlyEvent from "./../dashboard/MonthlyEvent";
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
      showAlert: false
    };
  }

  async componentDidMount() {
    var startOn = localStorage.getItem(`startOn-${this.props.workspaceId}`);
    var taskId = localStorage.getItem(`taskId-${this.props.workspaceId}`);
    if (taskId === this.props.event.id && startOn !== "") {
      this.setState({
        status: true,
        startOn: startOn,
        icon: "pause"
      });
    }
  }

  handleClick = () => {
    this.setState(state => {
      var icon = this.state.icon;
      var updateIcon = icon;
      var status = state.status;
      var taskTimerLog = [];
      if (state.status) {
        var endOn = Date.now();
        this.setState({ runningTime: 0, endOn: endOn });
        var taskTimerLog = this.handleTaskTrackingStop(
          this.props.event.id,
          endOn
        );
        this.handleReset();
        this.props.handleTaskBottomPopup("");
        updateIcon =
          icon == "pause" ? "play" : icon == "play" ? "pause" : "check";
        status = !state.status;
      } else {
        if (this.props.onGoingTask) {
          updateIcon = icon;
          this.setState({ showAlert: !this.state.showAlert });
        } else {
          var startOn = Date.now();
          this.setState({ startOn: startOn });
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
          this.props.handleTaskBottomPopup(
            this.state.startOn,
            this.props.event.timeTracked
          );
          var updateIcon =
            icon == "pause" ? "play" : icon == "play" ? "pause" : "check";
          status = !state.status;
          this.props.handleTaskTracking("start", this.props.event.id, startOn);
        }
      }
      return {
        status: status,
        showPopup: false,
        icon: updateIcon,
        taskTimerLog: taskTimerLog
      };
    });
  };

  handleTaskTrackingStop = async (taskId, dateTime) => {
    var taskTimerLog = [];
    if (taskId && dateTime) {
      var newTaskId = taskId.split("-")[0];
      var taskDate = {
        end_time: new Date(dateTime),
        status: "stopped"
      };
      try {
        const { data } = await put(
          taskDate,
          `tasks/${newTaskId}/stop-tracking`
        );
        if (data) {
          var taskTimerLog = [...this.state.taskTimerLog, ...[data]];
          // this.setState({
          //   taskTimerLog: taskTimerLog
          // });
        }
      } catch (e) {}
    }
    return taskTimerLog;
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
      showPopup: false
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
          this.props.handleTaskBottomPopup("");
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
    return `${moment(time.start_time).format("HH.mm")} - ${moment(
      time.end_time
    ).format("HH.mm")}`;
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
      titleText
    } = this.props;
    const startTime = moment(start).format("HH:mm");
    const endTime = moment(end).format("HH:mm");
    return (
      <>
        {schedulerData.viewType === 0 || schedulerData.viewType === 1 ? (
          <div
            key={event.id}
            className={mustAddCssClass}
            style={divStyle}
            // onMouseOver={() => this.showEventPopUp()}
            // onMouseOut={() => this.hideEventPopUp()}
          >
            <div className="row item">
              <div
                className="col-md-12 pointer item-heading text-wraper"
                style={{ padding: "5px 5px 0px 5px" }}
                onClick={() => {
                  if (!!eventItemClick) eventItemClick(schedulerData, event);
                }}
              >
                {/* <i className="fa fa-pencil pull-right" aria-hidden="true"></i> */}
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
                    // onMouseOver={() => this.showEventPopUp()}
                    // onMouseOut={() => this.hideEventPopUp()}
                  >
                    <div className={`d-inline-block task-ongoing`}></div>
                    <div className="d-inline-block task-timer">
                      <Timer
                        startOn={this.state.startOn}
                        isStart={this.state.status}
                      />
                    </div>
                  </div>
                </OverlayTrigger>

                {this.state.icon === "pause" ? (
                  <div
                    style={{
                      pointerEvents: this.isValidUserDate(event.resourceId)
                        ? ""
                        : "none"
                    }}
                    className="d-inline-block task-play-btn pointer"
                    onClick={() => this.handleClick()}
                  >
                    <i className="fa fa-pause"></i>
                  </div>
                ) : null}

                {this.state.icon === "play" ? (
                  <div
                    style={{
                      pointerEvents: this.isValidUserDate(event.resourceId)
                        ? ""
                        : "none"
                    }}
                    className="d-inline-block task-play-btn pointer"
                    onClick={() => this.handleClick(event.id)}
                  >
                    <i className="fa fa-play"></i>
                  </div>
                ) : null}

                {this.state.icon === "check" ? (
                  <div className="d-inline-block task-play-btn">
                    <i className="fa fa-check"></i>
                  </div>
                ) : null}
              </div>
              <div className="col-md-12 no-padding">
                <div className="col-md-6 no-padding d-inline-block item-time">
                  <input
                    className="form-control  timer-dropdown d-inline-block"
                    style={{
                      backgroundColor: this.state.showTimerMenu
                        ? "#ffffff"
                        : this.props.bgColor,
                      borderColor: this.props.bgColor
                    }}
                    defaultValue={
                      this.props.event.timeTracked.length > 0
                        ? this.returnTime(this.props.event.timeTracked[0])
                        : ""
                    }
                    onClick={() => this.ToggleTimerDropDown(event.id)}
                    onMouseOver={() => this.hideEventPopUp(event.id)}
                  />
                </div>
                <div className="col-md-6 no-padding d-inline-block item-time text-right">
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

        {this.state.showTimerMenu && this.state.clickEventId === event.id ? (
          <div className={`dropdown-div `}>
            {this.props.event.timeTracked.map((time, idx) => {
              if (idx !== 0) {
                return (
                  <div className="hover-border" key={time.id}>
                    {this.returnTime(time)}
                  </div>
                );
              }
            })}
            {this.state.taskTimerLog.length > 0
              ? this.state.taskTimerLog.map(time => {
                  return (
                    <div className="hover-border" key={time.id}>
                      {this.returnTime(time)}
                    </div>
                  );
                })
              : null}
          </div>
        ) : null}

        {this.state.showAction && this.state.clickEventId === event.id ? (
          <div className="d-inline-block event-action-dropdown">
            {this.state.icon !== "check" ? (
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

        {this.state.showAlert ? (
          <UncontrolledAlert className="task-war-alert" color="warning">
            one task already ongoing !
          </UncontrolledAlert>
        ) : null}
      </>
    );
  }
}

export default withRouter(DashboardEvent);
