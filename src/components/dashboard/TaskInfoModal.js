import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import "rc-time-picker/assets/index.css";
import "react-datepicker/dist/react-datepicker.css";
import Close from "../../assets/images/close.svg";
import moment from "moment";
import { post, mockGet, mockPost } from "../../utils/API";
import ImgsViewer from "react-images-viewer";
import {
  DATE_FORMAT2,
  DATE_FORMAT1,
  DATE_FORMAT3,
  DATE_FORMAT6,
  HRMIN,
  FULL_DATE_FORMAT3,
  FULL_DATE_FORMAT1,
  FULL_DATE
} from "./../../utils/Constants";
import { UncontrolledAlert } from "reactstrap";
import { convertUTCToLocalDate } from "../../utils/function";
import CommentUpload from "./../../components/dashboard/CommentUpload";

class TaskInfoModal extends Component {
  constructor(props) {
    super(props);
    this.priority = {
      name: "high",
      color_code: "#00A031"
    };
    this.comments = [
      {
        attachments: [
          {
            attachment_id: 2,
            imge_url:
              "https://dailyploy-csv.s3.ap-south-1.amazonaws.com/uploads/attachments/logo1.png"
          },
          {
            attachment_id: 3,
            imge_url:
              "https://dailyploy-csv.s3.ap-south-1.amazonaws.com/uploads/attachments/tiger.jpeg"
          }
        ],
        comments: "This is for the testing of task",
        id: 1,
        task_id: 222,
        user_id: 1,
        user: {
          id: 1,
          name: "ravindra karale",
          email: "ravindra@stack-avenue.com"
        }
      },
      {
        attachments: [
          {
            attachment_id: 2,
            imge_url:
              "https://dailyploy-csv.s3.ap-south-1.amazonaws.com/uploads/attachments/logo1.png"
          },
          {
            attachment_id: 3,
            imge_url:
              "https://dailyploy-csv.s3.ap-south-1.amazonaws.com/uploads/attachments/tiger.jpeg"
          }
        ],
        comments: '"This is for the testing of task"',
        id: 2,
        task_id: 222,
        user_id: 1,
        user: {
          id: 1,
          name: "ravindra karale",
          email: "ravindra@stack-avenue.com"
        }
      },
      {
        attachments: [
          {
            attachment_id: 2,
            imge_url:
              "https://dailyploy-csv.s3.ap-south-1.amazonaws.com/uploads/attachments/logo1.png"
          },
          {
            attachment_id: 3,
            imge_url:
              "https://dailyploy-csv.s3.ap-south-1.amazonaws.com/uploads/attachments/tiger.jpeg"
          }
        ],
        comments: '"This is for the testing of task"',
        id: 4,
        task_id: 222,
        user_id: 1,
        user: {
          id: 1,
          name: "ravindra karale",
          email: "ravindra@stack-avenue.com"
        }
      }
    ];

    this.state = {
      color: "#ffffff",
      showTimerMenu: false,
      editableComment: null,
      commentId: null,
      viewerIsOpen: false,
      imge_url: null
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

  renderTaskInfo = (option, type, name) => {
    if (option) {
      const klass =
        type == "block" ? "color-block" : type == "circle" ? "color-dot" : "";
      return (
        <div className="left-padding-20px">
          <div
            className={`d-inline-block ${klass}`}
            style={{
              backgroundColor: `${
                option.color_code ? option.color_code : this.state.color
              }`
            }}
          ></div>
          <div className="right-left-space-5 d-inline-block">{`${option[name]}`}</div>
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
    return `${moment(time.start_time).format("HH.mm A")} - ${moment(
      time.end_time ? time.end_time : new Date()
    ).format("HH.mm A")}`;
  };

  displayTotalTime = () => {
    if (this.props.state.timeTracked.length > 0) {
      let totalSec = this.props.state.timeTracked
        .map(time => time.duration)
        .flat()
        .reduce((a, b) => a + b, 0);
      var h = Math.floor(totalSec / 3600);
      var m = Math.floor((totalSec % 3600) / 60);
      var s = Math.floor((totalSec % 3600) % 60);

      return (
        ("0" + h).slice(-2) +
        // " hh" +
        ":" +
        ("0" + m).slice(-2) +
        // " mm" +
        ":" +
        ("0" + s).slice(-2)
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

  editComments = comment => {
    this.setState({
      commentId: comment.id,
      editableComment: comment
    });
  };

  saveComments = (comments, attachments) => {
    this.props.saveComments(comments, attachments);
  };

  handleUpdateComments = (comments, attachments) => {
    let commentId = this.state.commentId;
    this.props.updateComments(commentId, comments, attachments);
    this.setState({
      commentId: null,
      editableComment: null
    });
  };

  onClickOutside = () => {
    this.setState({
      commentId: null,
      editableComment: null
    });
  };

  formattedSeconds = ms => {
    var totalSeconds = ms / 1000;
    var h = Math.floor(totalSeconds / 3600);
    var m = Math.floor((totalSeconds % 3600) / 60);
    var s = Math.floor((totalSeconds % 3600) % 60);
    return h > 0
      ? `${h} hours ago`
      : m > 0
      ? `${m} minutes ago`
      : "few seconds ago";
  };

  commentsTime = comment => {
    let commentDate = moment(comment.inserted_at);
    let isToday =
      commentDate.format(DATE_FORMAT1) == moment().format(DATE_FORMAT1);
    if (isToday) {
      let newDate = moment(comment.inserted_at).format(FULL_DATE_FORMAT3);
      var convertedTime = new Date(convertUTCToLocalDate(newDate));
      let time = Date.now() - convertedTime.getTime();
      return this.formattedSeconds(time);
    } else {
      return `${commentDate.format(DATE_FORMAT6)} at ${commentDate.format(
        HRMIN
      )}`;
    }
  };

  titleDateTime = comment => {
    return moment(comment.inserted_at).format(FULL_DATE_FORMAT1);
  };

  openViewImage = imge_url => {
    if (imge_url) {
      this.setState({
        viewerIsOpen: true,
        imge_url: imge_url
      });
    }
  };
  closeViewer = () => {
    this.setState({
      viewerIsOpen: false
    });
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
                {this.props.state.taskEvent.status !== "completed" ? (
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
                  {this.props.state.taskEvent.trackingStatus == "pause" ? (
                    <div
                      style={{
                        pointerEvents: this.isValidUserDate() ? "" : "none"
                      }}
                      className="d-inline-block task-play-btn pointer"
                      onClick={() =>
                        this.props.handleTaskStop(
                          this.props.state.taskEvent,
                          Date.now()
                        )
                      }
                    >
                      <i className="fa fa-pause"></i>
                    </div>
                  ) : null}

                  {this.props.state.taskEvent.trackingStatus == "play" ? (
                    <div
                      style={{
                        pointerEvents: this.isValidUserDate() ? "" : "none"
                      }}
                      className="d-inline-block task-play-btn pointer"
                      onClick={() =>
                        this.props.handleTaskStart(
                          this.props.state.taskEvent,
                          Date.now()
                        )
                      }
                    >
                      <i className="fa fa-play"></i>
                    </div>
                  ) : null}
                  {this.props.state.taskEvent.status === "completed" ? (
                    <div className="d-inline-block task-play-btn">
                      <i className="fa fa-check"></i>
                    </div>
                  ) : null}

                  {this.props.state.showAlert &&
                  this.props.state.showEventAlertId ==
                    this.props.state.taskEvent.id ? (
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
                {this.props.state.taskEvent.status === "completed" ? (
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
                  {this.renderTaskInfo(props.state.project, "block", "name")}
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
                  {this.renderTaskInfo(
                    this.props.state.taskPrioritie,
                    "circle",
                    "label"
                  )}
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
                  {this.props.state.taskEvent &&
                  this.props.state.taskEvent.dateFormattedTimeTrack &&
                  this.props.state.taskEvent.dateFormattedTimeTrack.length >
                    0 ? (
                    <div className="col-md-4 d-inline-block">
                      <select
                        style={{ color: "#000 !important", background: "#fff" }}
                      >
                        {this.props.state.taskEvent.dateFormattedTimeTrack.map(
                          (date, index) => {
                            return (
                              <optgroup
                                key={index}
                                label={moment(date.date).format("MMM Do YYYY")}
                              >
                                {date.time_tracks.map((tt, idx) => (
                                  <option key={tt.id}>
                                    {this.returnTime(tt)}
                                  </option>
                                ))}
                              </optgroup>
                            );
                          }
                        )}
                      </select>
                    </div>
                  ) : (
                    <div className="left-padding-17px">No tracked time</div>
                  )}
                </div>
              </div>

              <div className="col-md-12 no-padding input-row text-titlize">
                <div className="col-md-2 d-inline-block no-padding label">
                  Comments
                </div>
                <div className="col-md-10 d-inline-block">
                  <CommentUpload
                    save={this.saveComments}
                    defaultComment={props.state.taskEvent.comments}
                    state={this.state}
                    showSave={true}
                    showAttachIcon={true}
                  />
                </div>
              </div>
              {props.state.taskComments ? (
                <>
                  <div className="col-md-12 no-padding input-row text-titlize">
                    <div className="col-md-2 d-inline-block no-padding label"></div>
                    <div className="col-md-10 d-inline-block">
                      <div className="task-comments">
                        {props.state.taskComments.reverse().map(comment => {
                          return this.state.editableComment &&
                            comment.id === this.state.commentId ? (
                            <CommentUpload
                              save={this.handleUpdateComments}
                              defaultComments={
                                this.state.editableComment.comments
                              }
                              defaultUploaded={
                                this.state.editableComment.attachments
                              }
                              state={this.state}
                              showSave={true}
                              showAttachIcon={true}
                              showBox={true}
                              onClickOutside={this.onClickOutside}
                            />
                          ) : (
                            <div className="commnet-card">
                              <div
                                className="col-md-12 no-padding"
                                style={{
                                  display: "flex",
                                  justifyContent: "start"
                                }}
                              >
                                <div className="owner-name">
                                  {comment.user.name}
                                </div>
                                <div
                                  className="hide"
                                  style={{
                                    fontSize: "11px",
                                    padding: "3px 0px 0px 25px"
                                  }}
                                  title={this.titleDateTime(comment)}
                                >
                                  {this.commentsTime(comment)}
                                </div>
                              </div>
                              <div className="col-md-12 no-padding comments">
                                {comment.comments}
                              </div>
                              <div className="col-md-12 no-padding">
                                {comment.attachments.map(attachment => {
                                  return (
                                    <>
                                      <img
                                        src={`${attachment.imge_url}`}
                                        onClick={() =>
                                          this.openViewImage(
                                            attachment.imge_url
                                          )
                                        }
                                        height="42"
                                        width="42"
                                        style={{ cursor: "pointer" }}
                                      ></img>
                                      {/* <ImgsViewer
                                        imgs={[
                                          { src: `${this.state.imge_url}` }
                                        ]}
                                        isOpen={this.state.viewerIsOpen}
                                        onClose={this.closeViewer}
                                      /> */}
                                    </>
                                  );
                                })}
                              </div>
                              {this.state.viewerIsOpen ? (
                                <ImgsViewer
                                  imgs={[{ src: `${this.state.imge_url}` }]}
                                  isOpen={this.state.viewerIsOpen}
                                  onClose={this.closeViewer}
                                />
                              ) : null}
                              <div className="col-md-12 no-padding">
                                <span
                                  onClick={() => this.editComments(comment)}
                                >
                                  Edit
                                </span>
                                <span
                                  onClick={() =>
                                    this.props.deleteComments(comment)
                                  }
                                >
                                  Delete
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </Modal>
      </>
    );
  }
}

export default TaskInfoModal;
