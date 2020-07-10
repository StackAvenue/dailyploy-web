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
      <div
        className="d-inline-block timeline-event-drop event-action-dropdown"
        style={{
          width: "98px",
          position: "absolute",
          zIndex: "1",
          textAlign: "center",
          right: "3px",
          // left: "100%",
          top: "54px",
          // top: "86px",
          backgroundColor: "#ffffff",
          border: "1px solid #e5e5e5",
          borderRadius: "5px",
          fontFamily: "Roboto",
          fontWeight: "400",
          fontStyle: "normal",
          fontSize: "12px",
          color: "#0075d9",
        }}
      >
        {props.event.status !== "completed" ? (
          <>
            <div
              className="border-bottom pointer"
              style={{ padding: "5px 0px 0px 0px" }}
              onClick={() => props.taskEventResumeConfirm(props.event, "edit")}
            >
              Edit
            </div>
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
