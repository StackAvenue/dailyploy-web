import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import "rc-time-picker/assets/index.css";
import "react-datepicker/dist/react-datepicker.css";
import Close from "../../assets/images/close.svg";
import moment from "moment";
import { post, del, put } from "../../utils/API";
import ImgsViewer from "react-images-viewer";
import TimePicker from "rc-time-picker";
import DatePicker from "react-datepicker";
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
import {
  convertUTCToLocalDate,
  convertUTCDateToLocalDate,
  firstTwoLetter
} from "../../utils/function";
import CommentUpload from "./../../components/dashboard/CommentUpload";
import ConfirmModal from "./../ConfirmModal";
import Loader from "react-loader-spinner";

class TaskInfoModal extends Component {
  constructor(props) {
    super(props);
    this.priority = {
      name: "high",
      color_code: "#00A031"
    };
    this.state = {
      color: "#ffffff",
      showTimerMenu: false,
      editableComment: null,
      commentId: null,
      viewerIsOpen: false,
      imge_url: null,
      comments: "",
      editedComments: "",
      showBox: false,
      pictures: [],
      showAddBox: false,
      taskloader: false,
      timeTrackEditLoader: false,
      editableLog: null,
      editLog: false,
      timeFrom: null,
      timeTo: null,
      fromDateTime: null,
      toDateTime: null,
      trackTimeError: null,
      showConfirm: false
    };
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
      editableComment: comment,
      editedComments: comment.comments
    });
  };

  saveComments = async () => {
    if (this.state.comments) {
      this.setState({ taskloader: true });
      try {
        let fd = new FormData();
        this.state.pictures.forEach(image => {
          fd.append("attachments[]", image, image.name);
        });
        fd.append("user_id", this.props.state.userId);
        fd.append("task_id", this.props.state.taskEvent.taskId);
        fd.append("comments", this.state.comments);
        const { data } = await post(fd, `comment`);
        var comment = data;
        var taskComments = [comment, ...this.props.state.taskComments];
        this.props.updateTaskComments(taskComments);
        this.setState({
          pictures: [],
          comments: "",
          showBox: false,
          taskloader: false
        });
      } catch (e) {
        this.setState({ taskloader: false });
      }
    }
  };

  handleUpdateComments = async () => {
    if (this.state.editedComments && this.state.editableComment) {
      try {
        this.setState({ taskloader: true });
        let fd = new FormData();
        let commnetId = this.state.editableComment.id;
        this.state.pictures.forEach(image => {
          fd.append("attachments[]", image, image.name);
        });
        fd.append("user_id", this.props.state.userId);
        fd.append("task_id", this.props.state.taskEvent.taskId);
        fd.append("comments", this.state.editedComments);
        const { data } = await put(fd, `comment/${commnetId}`);
        var taskComments = this.props.state.taskComments;
        var comment = taskComments.find(c => c.id == commnetId);
        comment["comments"] = data.comments;
        comment["user"] = data.user;
        comment["attachments"] = data.attachments;
        this.props.updateTaskComments(taskComments);
        this.setState({
          taskloader: false,
          commentId: null,
          editedComments: "",
          editableComment: null
        });
      } catch (e) {
        this.setState({ taskloader: false });
      }
    }
  };

  editTimeTrack = async () => {
    if (this.state.fromDateTime && this.state.toDateTime) {
      var start_time = new Date(this.state.fromDateTime.format(FULL_DATE));
      var end_time = new Date(this.state.toDateTime.format(FULL_DATE));
      if (start_time < end_time) {
        try {
          this.setState({ timeTrackEditLoader: true, trackTimeError: null });
          let trackedTime = {
            start_time: start_time,
            end_time: end_time
          };
          const { data } = await put(
            trackedTime,
            `tasks/${this.state.editableLog.task_id}/edit_tracked_time/${this.state.editableLog.id}`
          );
          this.props.timeTrackUpdate(data, "edit");
          this.setState({
            timeTrackEditLoader: false,
            timeFrom: null,
            timeTo: null,
            fromDateTime: null,
            toDateTime: null,
            editableLog: null,
            editLog: false
          });
        } catch (e) {
          if (e.response.status == 400) {
            this.setState({
              trackTimeError: "End datetime is wrong",
              timeTrackEditLoader: false
            });
          }
        }
      } else {
        this.setState({
          trackTimeError: "End datetime is wrong",
          timeTrackEditLoader: false
        });
      }
    }
  };

  deleteTimeTrack = async () => {
    if (this.state.editableLog) {
      try {
        const { data } = await del(
          `tasks/${this.state.editableLog.task_id}/delete/${this.state.editableLog.id}`
        );
        this.props.timeTrackUpdate(data, "delete");
        this.setState({ showConfirm: false });
      } catch (e) {
        this.setState({ showConfirm: false });
      }
    }
  };

  onClickOutside = () => {
    this.setState({
      commentId: null,
      editableComment: null
    });
  };

  onClickOutsideAddCommnetBox = () => {
    this.setState({ showAddBox: false });
  };

  onClickAddCommnetBox = () => {
    this.setState({ showAddBox: true });
  };

  formattedSeconds = ms => {
    var totalSeconds = ms / 1000;
    var h = Math.floor(totalSeconds / 3600);
    var m = Math.floor((totalSeconds % 3600) / 60);
    var s = Math.floor((totalSeconds % 3600) % 60);
    return h > 0
      ? `${h} hours ago`
      : m > 0 && h == 0
      ? `${m} minutes ago`
      : s > 30 && h == 0 && m == 0
      ? "few seconds ago"
      : "just now";
  };

  commentsTime = comment => {
    let date = convertUTCDateToLocalDate(
      comment.inserted_at ? new Date(comment.inserted_at) : new Date()
    );
    let commentDate = moment(date);
    let isToday =
      commentDate.format(DATE_FORMAT1) == moment().format(DATE_FORMAT1);
    if (isToday) {
      let time = Date.now() - date.getTime();
      return this.formattedSeconds(time);
    } else {
      return `${commentDate.format(DATE_FORMAT6)} at ${commentDate.format(
        HRMIN
      )}`;
    }
  };

  titleDateTime = comment => {
    return moment(
      convertUTCDateToLocalDate(
        comment.inserted_at ? new Date(comment.inserted_at) : new Date()
      )
    ).format(FULL_DATE_FORMAT1);
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

  showCommentBox = () => {
    this.setState({ showBox: true });
  };

  updateUploadedState = pictures => {
    this.setState({ pictures: [...this.state.pictures, ...pictures] });
  };

  removeUploadedImage = index => {
    let pictures = this.state.pictures.filter((f, idx) => idx !== index);
    this.setState({ pictures: pictures });
  };

  handleInputChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  disabledHours = () => {
    var time = this.state.timeFrom;
    if (time) {
      var hr = time.split(":")[0];
      hr = Number(hr);
      var hoursArr = Array.from({ length: `${hr}` }, (v, k) => k);
      return hoursArr;
    }
    return [];
  };

  disabledMinutes = () => {
    var fTime = this.state.timeFrom;
    var tTime = this.state.timeTo;
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

  makeLogEditable = e => {
    if (e.target.value) {
      let log = this.props.state.taskEvent.allTimeTracked.find(
        tt => tt.id == e.target.value
      );
      let fromMoment = moment(log.start_time);
      let toMoment = moment(log.end_time);
      let timeFrom = fromMoment.format(HRMIN);
      let timeTo = toMoment.format(HRMIN);
      var fromDateTime = fromMoment.format("YYYY-MM-DD") + " " + timeFrom;
      fromDateTime = moment(fromDateTime);
      var toDateTime = toMoment.format("YYYY-MM-DD") + " " + timeTo;
      toDateTime = moment(toDateTime);

      this.setState({
        editableLog: log,
        timeFrom: timeFrom,
        timeTo: timeTo,
        fromDateTime: fromDateTime,
        toDateTime: toDateTime
      });
    } else {
      this.setState({
        editableLog: null,
        timeFrom: null,
        timeTo: null,
        fromDateTime: null,
        toDateTime: null
      });
    }
  };

  toggleEditableBox = () => {
    this.setState({
      editLog: !this.state.editLog
    });
  };

  handleTimeFrom = value => {
    var value = moment(value);
    this.setState({
      timeFrom: value != null ? value.format("HH:mm") : null,
      fromDateTime: value,
      timeTo:
        value != null && value.format("HH:mm") > this.state.timeTo
          ? null
          : this.state.timeTo
    });
  };

  handleTimeTo = value => {
    var value = moment(value);
    this.setState({
      timeTo: value != null ? value.format("HH:mm:ss") : null,
      toDateTime: value
    });
  };

  handleDeleteLog = () => {
    this.setState({
      showConfirm: !this.state.showConfirm
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
                    !this.state.editLog ? (
                      <>
                        <div className="col-md-8 d-inline-block">
                          <select
                            style={{
                              color: "#000 !important",
                              background: "#fff"
                            }}
                            onChange={e => this.makeLogEditable(e)}
                          >
                            <option value="" key={0}>
                              Select tracked time to edit/delete
                            </option>
                            {this.props.state.taskEvent.dateFormattedTimeTrack.map(
                              (date, index) => {
                                return (
                                  <optgroup
                                    key={index}
                                    label={moment(date.date).format(
                                      "MMM Do YYYY"
                                    )}
                                  >
                                    {date.time_tracks.map((tt, idx) => (
                                      <option value={tt.id} key={tt.id}>
                                        {this.returnTime(tt)}
                                      </option>
                                    ))}
                                  </optgroup>
                                );
                              }
                            )}
                          </select>
                        </div>
                        {this.state.editableLog != null ? (
                          <>
                            <div
                              className="col-md-1 d-inline-block"
                              onClick={this.toggleEditableBox}
                              style={{
                                cursor: "pointer"
                              }}
                            >
                              <i
                                className="fa fa-pencil"
                                aria-hidden="true"
                              ></i>
                            </div>
                            <div
                              className="col-md-1 d-inline-block"
                              style={{
                                padding: "0px 10px",
                                cursor: "pointer"
                              }}
                              onClick={() => this.handleDeleteLog()}
                            >
                              <i class="fas fa-trash-alt"></i>
                            </div>
                          </>
                        ) : null}
                      </>
                    ) : (
                      <>
                        <div className="col-md-10 d-inline-block">
                          <span className="col-md-1 no-padding d-inline-block">
                            From
                          </span>
                          <div
                            className="col-md-4 no-padding d-inline-block track-time-edit"
                            style={{
                              marginLeft: "20px"
                            }}
                          >
                            {/* <TimePicker
                              placeholder="Time"
                              value={this.state.fromDateTime}
                              showSecond={false}
                              onChange={this.handleTimeFrom}
                            /> */}
                            <DatePicker
                              selected={new Date(this.state.fromDateTime)}
                              onChange={date => this.handleTimeFrom(date)}
                              showTimeSelect
                              timeFormat="HH:mm"
                              timeIntervals={1}
                              excludeTimes={
                                [
                                  // setHours(setMinutes(new Date(), 0), 17),
                                  // setHours(setMinutes(new Date(), 30), 18),
                                  // setHours(setMinutes(new Date(), 30), 19),
                                  // setHours(setMinutes(new Date(), 30), 17)
                                ]
                              }
                              dateFormat="d MMM, HH:mm"
                            />
                          </div>
                          <span className="col-md-1 no-padding d-inline-block">
                            To
                          </span>
                          <div className="col-md-4 no-padding d-inline-block track-time-edit">
                            {/* <TimePicker
                              placeholder="Time"
                              value={this.state.toDateTime}
                              showSecond={false}
                              disabledMinutes={this.disabledMinutes}
                              disabledHours={this.disabledHours}
                              onChange={this.handleTimeTo}
                            /> */}
                            <DatePicker
                              selected={new Date(this.state.toDateTime)}
                              onChange={date => this.handleTimeTo(date)}
                              showTimeSelect
                              timeFormat="HH:mm"
                              timeIntervals={1}
                              // minTime={new Date(this.state.fromDateTime)}
                              dateFormat="d MMM, HH:mm"
                            />
                          </div>
                        </div>
                        <div
                          className="col-md-1 d-inline-block"
                          onClick={this.toggleEditableBox}
                          title={"Back"}
                          style={{
                            cursor: "pointer"
                          }}
                        >
                          <i className="far fa-arrow-alt-circle-left"></i>
                        </div>
                        <div
                          className={`col-md-1 d-inline-block ${
                            this.state.timeTrackEditLoader ? "disabled" : ""
                          }`}
                          onClick={this.editTimeTrack}
                          title={"Edit"}
                          style={{
                            cursor: "pointer"
                          }}
                        >
                          <i className="fa fa-check" aria-hidden="true"></i>
                          {this.state.timeTrackEditLoader ? (
                            <Loader
                              type="Oval"
                              color="#33a1ff"
                              height={20}
                              width={20}
                              style={{ paddingLeft: "25px", top: "0px" }}
                              className="d-inline-block login-signup-loader"
                            />
                          ) : null}
                        </div>
                      </>
                    )
                  ) : (
                    <div className="left-padding-17px">No tracked time</div>
                  )}
                </div>
              </div>

              {this.state.trackTimeError && this.state.editLog ? (
                <div className="col-md-12 no-padding">
                  <div
                    className="col-md-10 d-inline-block error"
                    style={{ textAlign: "center" }}
                  >
                    {this.state.trackTimeError}
                  </div>
                </div>
              ) : null}

              <div className="col-md-12 no-padding input-row text-titlize">
                <div className="col-md-2 d-inline-block no-padding label">
                  Comments
                </div>
                <div className="col-md-10 d-inline-block">
                  <CommentUpload
                    save={this.saveComments}
                    comments={this.state.comments}
                    state={this.state}
                    showSave={true}
                    showBox={this.state.showAddBox}
                    showAttachIcon={true}
                    commentName="comments"
                    onClickOutside={this.onClickOutsideAddCommnetBox}
                    updateUploadedState={this.updateUploadedState}
                    removeUploadedImage={this.removeUploadedImage}
                    handleInputChange={this.handleInputChange}
                    showCommentBox={this.onClickAddCommnetBox}
                  />
                </div>
              </div>
              {props.state.taskComments ? (
                <>
                  <div className="col-md-12 no-padding input-row task-comments">
                    {props.state.taskComments.map(comment => {
                      return this.state.editableComment &&
                        comment.id === this.state.commentId ? (
                        <div
                          className="col-md-12 no-padding"
                          style={{
                            display: "inline-flex",
                            alignItems: "flex-start"
                          }}
                        >
                          <div
                            className="col-md-2 d-inline-block no-padding label"
                            // style={{
                            // verticalAlign: "text-top",
                            // marginTop: "20px"
                            // }}
                          >
                            <div className="comment-owner-dot">
                              {firstTwoLetter(comment.user.name)}
                            </div>
                          </div>
                          <div className="col-md-10 d-inline-block">
                            <CommentUpload
                              save={this.handleUpdateComments}
                              comments={this.state.editedComments}
                              state={this.state}
                              showSave={true}
                              showAttachIcon={true}
                              showBox={true}
                              commentName="editedComments"
                              onClickOutside={this.onClickOutside}
                              updateUploadedState={this.updateUploadedState}
                              removeUploadedImage={this.removeUploadedImage}
                              handleInputChange={this.handleInputChange}
                              showCommentBox={this.showCommentBox}
                            />
                          </div>
                        </div>
                      ) : (
                        <div
                          className="col-md-12 no-padding"
                          style={{
                            display: "inline-flex",
                            alignItems: "flex-start"
                          }}
                        >
                          <div
                            className="col-md-2 d-inline-block no-padding label"
                            style={{
                              marginTop: "20px"
                            }}
                          >
                            <div className="comment-owner-dot">
                              {firstTwoLetter(comment.user.name)}
                            </div>
                          </div>
                          <div className="col-md-10 d-inline-block">
                            <div className="commnet-card">
                              <div
                                className="col-md-12 no-padding"
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between"
                                }}
                              >
                                <div className="owner-name text-titlize">
                                  {comment.user.name}
                                </div>
                                <div
                                  className=""
                                  style={{
                                    fontSize: "11px",
                                    padding: "3px 0px 0px 25px"
                                  }}
                                  title={this.titleDateTime(comment)}
                                >
                                  {this.commentsTime(comment)}
                                </div>
                              </div>
                              <div className="col-md-12 comments">
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
                                        style={{
                                          cursor: "pointer",
                                          marginRight: "10px"
                                        }}
                                      ></img>
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
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </Modal>
        {this.state.showConfirm ? (
          <ConfirmModal
            show={this.state.showConfirm}
            message="Do you want to delete the Tracked Time?"
            buttonText="delete"
            onClick={this.deleteTimeTrack}
            closeModal={this.handleDeleteLog}
            style={{
              padding: "9% 0 30px 4%"
            }}
          />
        ) : null}
      </>
    );
  }
}

export default TaskInfoModal;
