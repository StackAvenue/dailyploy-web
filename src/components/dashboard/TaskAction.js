import React, { Component } from "react";
import onClickOutside from "react-onclickoutside";

class TaskAction extends Component {
  constructor(props) {
    super(props);
  }

  handleClickOutside = () => {
    this.props.actionOnClickOutside();
  };

  render() {
    const { props } = this;
    return (
      <div className="d-inline-block event-action-dropdown">
        {props.event.status !== "completed" ? (
          <>
            <div
              className="border-bottom pointer"
              style={{ padding: "5px 0px 0px 0px" }}
              onClick={() =>
                props.taskEventResumeConfirm(props.event, "mark as completed")
              }
            >
              Mark Complete
            </div>
            <div
              className="pointer"
              style={{ padding: "5px 0px 5px 0px" }}
              onClick={() =>
                props.taskEventResumeConfirm(props.event, "delete")
              }
            >
              Delete Task
            </div>
          </>
        ) : (
          <div
            className="pointer"
            style={{ padding: "5px 0px 5px 0px" }}
            onClick={() => props.taskEventResumeConfirm(props.event, "resume")}
          >
            Resume
          </div>
        )}
      </div>
    );
  }
}

export default onClickOutside(TaskAction);
