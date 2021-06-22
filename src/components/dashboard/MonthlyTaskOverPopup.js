import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Timer from "./../dashboard/Timer";
import { post, mockGet, mockPost } from "../../utils/API";
import { DATE_FORMAT1, MONTH_FORMAT } from "./../../utils/Constants";
import moment from "moment";
import { Alert, UncontrolledAlert } from 'reactstrap';
import ErrorBoundary from '../../ErrorBoundary';

class MonthlyTaskOverPopup extends Component {
  constructor(props) {
    super(props)
    this.isToday = this.props.end.format(DATE_FORMAT1) == moment(new Date()).format(DATE_FORMAT1)
    this.state = {
      showAction: false,
      showTimerMenu: false,
      icon: "play",
      startOn: "",
      status: false,
      canStart: false,
      showAlert: false,
    }
  }

  async componentDidMount() {
    // try {
    //   const { data } = await mockGet("task-track");
    //   if (data) {
    //     var timeArr = []
    //     data.map(date => {
    //       var sTime = moment(date.startdate).format("HH:mm")
    //       var eTime = moment(date.enddate).format("HH:mm")
    //       timeArr.push(`${sTime} - ${eTime}`)
    //     })
    //   }
    // } catch (e) {
    // }

    var startOn = localStorage.getItem(`startOn-${this.props.workspaceId}`)
    var taskId = localStorage.getItem(`taskId-${this.props.workspaceId}`)
    if (taskId === this.props.event.id && startOn !== "") {
      this.setState({
        status: true,
        startOn: startOn,
        icon: 'pause'
      })
    }
  }

  handleClick = () => {
    this.setState(state => {
      var icon = this.state.icon
      var updateIcon = icon
      var status = state.status
      if (state.status) {
        var endOn = Date.now()
        this.setState({ runningTime: 0, endOn: endOn });
        this.saveTaskTrackingTime(endOn)
        this.handleReset()
        this.props.handleTaskBottomPopup("")
        updateIcon = icon == "pause" ? "play" : icon == "play" ? "pause" : "check";
        status = !state.status
      } else {
        if (this.props.onGoingTask) {
          updateIcon = icon;
          this.setState({ showAlert: !this.state.showAlert })
        } else {
          var startOn = Date.now()
          this.setState({ startOn: startOn })
          localStorage.setItem(`startOn-${this.props.workspaceId}`, startOn)
          localStorage.setItem(`taskId-${this.props.workspaceId}`, this.props.event.id)
          localStorage.setItem(`colorCode-${this.props.workspaceId}`, this.props.bgColor)
          localStorage.setItem(`taskTitle-${this.props.workspaceId}`, this.props.titleText)
          this.props.handleTaskBottomPopup(this.state.startOn)
          var updateIcon = icon == "pause" ? "play" : icon == "play" ? "pause" : "check";
          status = !state.status
        }
      }
      return {
        status: status,
        showPopup: false,
        icon: updateIcon,
      };
    });
  };

  async saveTaskTrackingTime(endOn) {
    var taskData = {
      startdate: new Date(this.state.startOn),
      enddate: new Date(endOn)
    }
    try {
      const { data } = await mockPost(taskData, "task-track");
      if (data) {
        var timeArr = [this.state.timeArr, ...[]]
        var sTime = moment(data.startdate).format("HH:mm")
        var eTime = moment(data.enddate).format("HH:mm")
        timeArr.push(`${sTime} - ${eTime}`)
        this.setState({ timeArr: timeArr })
      }
    } catch (e) {
    }
  }

  handleReset = () => {
    clearInterval(this.timer);
    this.setState({ runningTime: 0, status: false, startOn: "" });
    localStorage.setItem(`startOn-${this.props.workspaceId}`, "")
    localStorage.setItem(`taskId-${this.props.workspaceId}`, "")
    localStorage.setItem(`colorCode-${this.props.workspaceId}`, "")
    localStorage.setItem(`taskTitle-${this.props.workspaceId}`, "")
  };

  async markCompleteTask(id) {
    if (id) {
      try {
        const { data } = await mockGet("mark-complete");
        var isComplete = data[0].complete
      } catch (e) {
      }
      if (isComplete) {
        var taskId = localStorage.getItem(`taskId-${this.props.workspaceId}`)
        this.handleReset()
        this.setState({ icon: "check", showAction: false })
        if (taskId === id) {
          this.props.handleTaskBottomPopup("")
        }
      }
    }
  }

  async deleteTask(id) {
    if (id) {
      try {
        const { data } = await mockGet("mark-complete");
        var isComplete = data[0].complete
      } catch (e) {
      }
      if (isComplete) {
      }
    }
  }

  ToggleTimerDropDown = () => {
    this.setState({ showTimerMenu: !this.state.showTimerMenu })
  }

  ToggleActionDropDown = () => {
    this.setState({ showAction: !this.state.showAction })
  }

  isValidUserDate = (userId) => {
    return this.isToday && this.props.userId === userId
  }

  render() {
    const { event, scheduler, schedulerData, titleText } = this.props;
    return (
      <>
        <div className="month-task-popup">
          <div className="title">
            <span className="" title={titleText}>
              {titleText}
            </span>
          </div>

          <div className="project d-inline-block">
            <div
              className="status-dot d-inline-block"
              style={{ backgroundColor: `${event.bgColor}` }}
            ></div>
            <div className="d-inline-block">{event.projectName}</div>
          </div>

          <div className="comments">
            <p className="">
              {event.comments}
            </p>
          </div>

          <div className="dot-timer-btn">
            <div
              // className={`d-inline-block ${this.state.icon !== "check" ? "task-ongoing" : "task-compete"}`}
              className={`d-inline-block task-ongoing`}
            ></div>
            <div className="d-inline-block task-timer">
              <ErrorBoundary>
                <Timer
                  startOn={this.state.startOn}
                  isStart={this.state.status}
                />
              </ErrorBoundary>
            </div>

            {this.state.icon === 'pause' ?
              <div
                style={{ pointerEvents: this.isValidUserDate(event.resourceId) ? "" : "none", borderColor: "green" }}
                className="d-inline-block task-play-btn pointer"
                onClick={() => this.handleClick()}
              ><i className="fa fa-pause"></i></div> : null}

            {this.state.icon === 'play' ?
              <div
                style={{ pointerEvents: this.isValidUserDate(event.resourceId) ? "" : "none", borderColor: "#1e90ff" }}
                className="d-inline-block task-play-btn pointer"
                onClick={() => this.handleClick(event.id)}
              ><i className="fa fa-play"></i></div> : null}

            {this.state.icon === 'check' ?
              <div className="d-inline-block task-play-btn"
                style={{ borderColor: "green" }}
              ><i className="fa fa-check"></i></div> : null}
          </div>

          <div className="col-md-12 timer-dropdown-action">
            <div className="col-md-9 d-inline-block no-padding down-icon">
              <input
                className={` col-md-12 no-padding d-inline-block ${this.state.showTimerMenu ? "border" : ""}`}
                defaultValue={this.props.times ? this.props.times[0] : ""}
                onClick={() => this.ToggleTimerDropDown()}
                readOnly
              />
              {this.state.showTimerMenu ?
                <div className="monthly-timer-dropdown">
                  {this.props.times.map((time, idx) => {
                    if (idx !== 0) {
                      return <div className="border"> {time} </div>
                    }
                  })}
                </div>
                : null}
            </div>
            <div className="col-md-3 no-padding d-inline-block text-right">
              <span className="task-event-action pointer" onClick={() => this.ToggleActionDropDown()}>...</span>
            </div>
            {this.state.showAction ?
              <div className="d-inline-block monthly-action-dropdown">
                {this.state.icon !== "check" ?
                  <div
                    className="border-bottom pointer"
                    style={{ padding: "5px 0px 0px 0px" }}
                    onClick={() => this.markCompleteTask(event.id)}
                  >
                    Mark Complete
            </div> : null}
                <div
                  className="pointer"
                  style={{ padding: "5px 0px 5px 0px" }}
                  onClick={() => this.deleteTask(event.id)}
                >
                  Delete Task
            </div>
              </div>
              : null
            }
          </div>

        </div>

        {this.state.showAlert ?
          <UncontrolledAlert className="task-war-alert" color="warning">
            one task already ongoing !
          </UncontrolledAlert>
          : null}

      </>
    )
  }
}

export default withRouter(MonthlyTaskOverPopup);