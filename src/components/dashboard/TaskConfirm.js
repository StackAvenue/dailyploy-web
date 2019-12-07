import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import "rc-time-picker/assets/index.css";
import "react-datepicker/dist/react-datepicker.css";
import Close from "../../assets/images/close.svg";
import moment from "moment";
import { post, mockGet, mockPost } from "../../utils/API";
import { DATE_FORMAT2, HRMIN } from "./../../utils/Constants";

class TaskConfirm extends Component {
  constructor(props) {
    super(props);
    this.times = ['18:19 - 20:19', '18:19 - 20:19', '18:19 - 20:19'];
    this.state = {
      color: "#ffffff",
      showTimerMenu: false,
      icon: "play",
      startOn: "",
      status: false,
      color: "#ffffff",
    };
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
                <span>{`${props.state.confirmModalText}  Task`}</span>
              </div>
              <button
                className="d-inline-block btn btn-link float-right"
                onClick={props.closeTaskModal}
              >
                <img src={Close} alt="close" />
              </button>
            </div>
            <div className="col-md-12 confirm-msg no-padding">
              {this.props.state.confirmModalText === "resume" ?
                <span>{`Are you sure you want to Resume this task?`}</span> : null}
              {this.props.state.confirmModalText === "delete" ?
                <span>{`Are you sure you want to Delete this task?`}</span> : null}
            </div>
            <div className="col-md-12 task-details no-padding">
              <span>Task Details</span>
            </div>
            <div className="body text-titlize">

              <div className="col-md-12 no-padding input-row">
                <div className="col-md-2 d-inline-block no-padding label">
                  Name
                </div>
                <div className="col-md-10 d-inline-block">
                  <span className="left-padding-20px">
                    {this.props.state.taskName}
                  </span>
                </div>
              </div>

              <div className="col-md-12 no-padding input-row">
                <div className="col-md-2 d-inline-block no-padding label">
                  Project
                </div>
                <div className="col-md-10 d-inline-block">
                  {this.renderTaskInfo(this.props.state.project, 'block')}
                </div>
              </div>

              <div className="col-md-12 no-padding input-row">
                <div className="col-md-2 d-inline-block no-padding label">
                  Category
                </div>
                <div className="col-md-10 d-inline-block">
                  <span className="left-padding-20px">
                    {`Category 1`}
                  </span>
                </div>
              </div>

              <div className="col-md-12 no-padding input-row">
                <div className="col-md-2 d-inline-block no-padding label">
                  Date - Time
                </div>
                <div className="col-md-10 d-inline-block">
                  <span className="left-padding-20px date-time">
                    {`${moment(this.props.state.dateFrom).format(DATE_FORMAT2)} - 
                    ${moment(this.props.state.dateTo).format(DATE_FORMAT2)}` + "   "}
                    {`${moment(this.props.state.dateFrom).format(HRMIN)} - 
                    ${moment(this.props.state.dateTo).format(HRMIN)}`}
                  </span>
                </div>
              </div>

              <div className="col-md-12 row no-margin no-padding input-row">
                <div className="col-md-2 no-padding label">Comments</div>
                <div className="col-md-10">
                  <p className="left-padding-20px comments">{props.state.taskEvent.comments ? props.state.taskEvent.comments : "---"}</p>
                </div>
              </div>

            </div>

            <div className="col-md-12 action-btn">
              <button
                type="button"
                className="btn col-md-3 pull-right button3 btn-primary"
                onClick={props.backToTaskInfoModal}
              >
                Cancel
                  </button>
              <button
                type="button"
                className="btn col-md-3 button pull-right btn-primary text-titlize"
                onClick={() => props.resumeOrDeleteTask}
              >
                {props.state.confirmModalText}
              </button>

            </div>
          </div>
        </Modal>
      </>
    );
  }
};

export default TaskConfirm;
