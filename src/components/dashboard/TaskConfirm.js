import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import "rc-time-picker/assets/index.css";
import "react-datepicker/dist/react-datepicker.css";
import Close from "../../assets/images/close.svg";
import moment from "moment";
import { post, mockGet, mockPost } from "../../utils/API";
import { DATE_FORMAT2, HRMIN } from "./../../utils/Constants";
import TimePicker from "rc-time-picker";

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
      color: "#ffffff"
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
          <div className="right-left-space-5 d-inline-block">{option.name}</div>
        </div>
      );
    }
    return "";
  };

  renderInfoPriority = (option, type) => {
    if (option) {
      const klass =
        type == "block" ? "color-block" : type == "circle" ? "color-dot" : "";
      return (
        <div className="d-inline-block pull-right pri-info">
          <div
            className={`d-inline-block ${klass}`}
            style={{
              backgroundColor: `${
                option.color_code ? option.color_code : this.state.color
              }`
            }}
          ></div>
          <div className=" d-inline-block priority">{option.name}</div>
        </div>
      );
    }
    return "";
  };

  render() {
    const { props } = this;
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

            {this.props.state.confirmModalText === "mark as completed" ? (
              <div className="col-md-12 task-details log-timer no-padding">
                <span className="d-inline-block">Log Time</span>
                <div className="d-inline-block time-picker-container no-padding">
                  <TimePicker
                    value={this.props.state.timeDateTo}
                    placeholder="Select"
                    inputClassName=""
                    showSecond={false}
                    closeIcon={false}
                    inputReadOnly={false}
                  />
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
                  <span className="left-padding-20px d-inline-block">
                    {this.props.state.taskName}
                  </span>
                  {this.props.state.icon === "play" ? (
                    <div className="d-inline-block pull-right not-start-btn">
                      Not started
                    </div>
                  ) : null}
                  {this.props.state.icon === "pause" ? (
                    <div className="d-inline-block pull-right progress-btn">
                      In progress
                    </div>
                  ) : null}
                  {this.props.state.icon === "check" ? (
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
                <div className="col-md-10 d-inline-block">
                  {this.renderTaskInfo(this.props.state.project, "block")}
                  {this.renderInfoPriority(this.priority, "circle")}
                </div>
              </div>

              <div className="col-md-12 no-padding input-row">
                <div className="col-md-2 d-inline-block no-padding label">
                  Category
                </div>
                <div className="col-md-10 d-inline-block">
                  <span className="left-padding-20px">{`Category 1`}</span>
                </div>
              </div>

              <div className="col-md-12 no-padding input-row">
                <div className="col-md-2 d-inline-block no-padding label">
                  Date - Time
                </div>
                <div className="col-md-10 d-inline-block">
                  <span className="left-padding-20px date-time">
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
                  <p className="left-padding-20px comments">
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
                  className=" button2 pull-right btn-primary text-titlize"
                  onClick={() => props.taskResume(props.state.taskEvent)}
                >
                  {props.state.confirmModalText}
                </button>
              ) : null}

              {props.state.confirmModalText === "delete" ? (
                <button
                  type="button"
                  className=" button2 pull-right btn-primary text-titlize"
                  onClick={() => props.taskDelete(props.state.taskEvent)}
                >
                  {props.state.confirmModalText}
                </button>
              ) : null}
              {props.state.confirmModalText === "mark as completed" ? (
                <button
                  type="button"
                  className=" mark-btn pull-right btn-primary text-titlize"
                  onClick={() => props.taskMarkComplete(props.state.taskEvent)}
                >
                  {props.state.confirmModalText}
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
