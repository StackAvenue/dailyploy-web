import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import "rc-time-picker/assets/index.css";
import "react-datepicker/dist/react-datepicker.css";
import Close from "../../assets/images/close.svg";
import moment from "moment";
import { post, mockGet, mockPost } from "../../utils/API";
import { DATE_FORMAT2, DATE_FORMAT1 } from "./../../utils/Constants";

class TaskInfoModal extends Component {
  constructor(props) {
    super(props);
    this.isToday = this.isToday()
    this.times = ['18:19 - 20:19', '18:19 - 20:19', '18:19 - 20:19'];
    this.priority = {
      name: "high",
      color_code: "#00A031"
    };
    this.category = {
      name: "Meeting",
      color_code: "#9B9B9B"
    };
    this.state = {
      color: "#ffffff",
      showTimerMenu: false,
      icon: "play",
      startOn: "",
      status: false,
    };
  }

  async markCompleteTask() {
    const eventTaskId = this.props.state.taskEvent.id
    if (eventTaskId) {
      try {
        const { data } = await mockGet("mark-complete");
        var isComplete = data[0].complete
      } catch (e) {
      }
      if (isComplete) {
        var taskId = localStorage.getItem(`taskId-${this.props.state.workspaceId}`)
        this.handleReset()
        this.setState({ icon: "check" })
        if (eventTaskId === taskId) {
          this.props.handleTaskBottomPopup("")
        }
      }
    }
  }

  async resumeCompletedTask() {
    const eventTaskId = this.props.state.taskEvent.id
    if (eventTaskId) {
      try {
        const { data } = await mockGet("mark-complete");
        var isComplete = data[0].complete
      } catch (e) {
      }
      if (isComplete) {
        this.setState({ icon: "play" })
      }
    }
  }

  isToday = () => {
    return this.props.state.dateTo ? this.props.state.dateTo.format(DATE_FORMAT1) == moment(new Date()).format(DATE_FORMAT1) : false
  }
  async componentDidMount() {
    var startOn = localStorage.getItem(`startOn-${this.props.state.workspaceId}`)
    var taskId = localStorage.getItem(`taskId-${this.props.state.workspaceId}`)
    if (taskId === this.props.state.taskId && startOn !== "") {
      this.setState({
        status: true,
        startOn: startOn,
        icon: 'pause'
      })
    } else {
      this.setState({
        status: false,
        startOn: "",
        icon: 'play'
      })
    }
  }

  initalChar = (str) => {
    var matches = str.match(/\b(\w)/g);
    return matches.join('').toUpperCase();
  }

  ToggleTimerDropDown = (id) => {
    this.setState({ showTimerMenu: !this.state.showTimerMenu })
  }

  renderMemberInfo = (option) => {
    if (option && option.length > 0) {
      return (
        <div className="select-member">
          <div className="member-title d-inline-block">{this.initalChar(option[0].name)}</div>
          <div className="right-left-space-5 d-inline-block">{option[0].name}</div>
        </div>
      );
    } else {
      return "";
    }
  }

  renderTaskInfo = (option, type) => {
    if (option) {
      const klass = type == "block" ? "color-block" : type == "circle" ? "color-dot" : ""
      return (
        <div className="">
          <div className={`d-inline-block ${klass}`} style={{ backgroundColor: `${option.color_code ? option.color_code : this.state.color}` }}></div>
          <div className="right-left-space-5 d-inline-block">{option.name}</div>
        </div>
      )
    }
    return ""
  }

  isValidUserDate = () => {
    const props = this.props.state;
    return this.isToday && props.memberIds && props.memberIds[0] === props.userId
  }

  handleClick = () => {
    this.setState(state => {
      var icon = this.state.icon
      var updateIcon = icon
      var status = state.status
      if (state.status) {
        var endOn = Date.now()
        // this.setState({ runningTime: 0, endOn: endOn });
        // this.saveTaskTrackingTime(endOn)
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
          localStorage.setItem(`startOn-${this.props.state.workspaceId}`, startOn)
          localStorage.setItem(`taskId-${this.props.state.workspaceId}`, this.props.state.taskEvent.id)
          localStorage.setItem(`colorCode-${this.props.state.workspaceId}`, this.props.state.taskEvent.bgColor)
          localStorage.setItem(`taskTitle-${this.props.state.workspaceId}`, this.props.state.taskEvent.title)
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
    localStorage.setItem(`startOn-${this.props.state.workspaceId}`, "")
    localStorage.setItem(`taskId-${this.props.state.workspaceId}`, "")
    localStorage.setItem(`colorCode-${this.props.state.workspaceId}`, "")
    localStorage.setItem(`taskTitle-${this.props.state.workspaceId}`, "")
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
                <span>{props.state.taskName}</span>
              </div>
              {this.state.icon !== "check" ?
                <>
                  <button
                    className="d-inline-block btn btn-link"
                    onClick={props.closeTaskModal}
                  > Delete</button>
                  <button
                    className="d-inline-block btn btn-link"
                    onClick={props.taskInfoEdit}
                  >Edit</button>
                </>
                : null}
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
                  {this.state.icon === 'pause' ?
                    <div
                      style={{ pointerEvents: this.isValidUserDate() ? "" : "none" }}
                      className="d-inline-block task-play-btn pointer"
                      onClick={() => this.handleClick()}
                    ><i className="fa fa-pause"></i></div> : null}

                  {this.state.icon === 'play' ?
                    <div
                      style={{ pointerEvents: this.isValidUserDate() ? "" : "none" }}
                      className="d-inline-block task-play-btn pointer"
                      onClick={() => this.handleClick()}
                    ><i className="fa fa-play"></i></div> : null}

                  {this.state.icon === 'check' ?
                    <div className="d-inline-block task-play-btn"><i className="fa fa-check"></i></div> : null}
                </div>
                <div className="d-inline-block header-2" >
                  <span>{"2hr 30mins"}</span>
                </div>
                {this.state.icon === "check" ?
                  <div className="bg-green d-inline-block">Complete</div>
                  :
                  <button
                    type="button"
                    onClick={() => this.markCompleteTask()}
                    className="btn btn-xs button3 btn-primary"
                  >Mark Complete</button>}
                {this.state.icon === "check" ?
                  <button
                    onClick={() => this.resumeCompletedTask()}
                    className="d-inline-block btn btn-link"
                  >Resume</button> : null}
              </div>
            </div>



            <div className="col-md-12 body">
              <div className="col-md-12 no-padding input-row">
                <div className="col-md-2 d-inline-block no-padding label">
                  Project
                </div>
                <div className="col-md-10 d-inline-block">
                  {this.renderTaskInfo(props.state.project, 'block')}
                </div>
              </div>

              <div className="col-md-12 no-padding input-row">
                <div className="col-md-2 d-inline-block no-padding label">
                  Category
                </div>
                <div className="col-md-10 d-inline-block">
                  {this.renderTaskInfo(this.category, 'block')}
                </div>
              </div>

              <div className="col-md-12 no-padding input-row">
                <div className="col-md-2 d-inline-block no-padding label">
                  Priority
                </div>
                <div className="col-md-10 d-inline-block">
                  {this.renderTaskInfo(this.priority, 'circle')}
                </div>
              </div>

              <div className="col-md-12 no-padding input-row">
                <div className="col-md-2 d-inline-block no-padding label">
                  Member
                </div>
                <div className="col-md-10 d-inline-block">
                  {this.renderMemberInfo(this.props.state.selectedMembers)}
                </div>
              </div>

              <div className="col-md-12 no-padding input-row">
                <div className="col-md-2 d-inline-block no-padding label">
                  Duration
                </div>
                <div className="col-md-10 d-inline-block">
                  <div className="col-md-12 d-inline-block">
                    <div className="col-md-4 d-inline-block">
                      {moment(props.state.dateFrom).format(DATE_FORMAT2)}
                    </div>
                    <div className="col-md-4 d-inline-block">
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
                    <div className="timer-dropdown" >
                      <input className="d-inline-block"
                        className={this.state.showTimerMenu ? "border" : ""}
                        defaultValue={this.times ? this.times[0] : ""}
                        onClick={() => this.ToggleTimerDropDown()}
                        readOnly
                      />
                      {this.state.showTimerMenu ?
                        <div className="dropdown">
                          {this.times.map((time, idx) => {
                            return <div className="border"> {time} </div>
                          })}
                        </div>
                        : null}
                    </div>

                  </div>
                </div>
              </div>

              <div className="col-md-12 row no-margin no-padding input-row">
                <div className="col-md-2 no-padding label">Comments</div>
                <div className="col-md-10">
                  <span>{props.state.taskEvent.comments ? props.state.taskEvent.comments : "---"}</span>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </>
    );
  }
};

export default TaskInfoModal;
