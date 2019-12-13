import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Timer from "./../dashboard/Timer";

class TaskBottomPopup extends Component {
  constructor(props) {
    super(props);
    this.times = ["18:19 - 20:19", "18:19 - 20:19", "18:19 - 20:19"];
    this.state = {
      runningTime: 0,
      showTimerMenu: false
    };
  }

  ToggleTimerDropDown = id => {
    this.setState({ showTimerMenu: !this.state.showTimerMenu });
  };

  render() {
    return (
      <>
        <div className="d-inline-block task-b-popup">
          <span
            className="d-inline-block task-pause-btn pointer"
            onClick={() => this.props.stopOnGoingTask()}
          >
            <i className="fa fa-pause "></i>
          </span>
          <div className="d-inline-block task-title">
            <Timer startOn={this.props.startOn} isStart={this.props.isStart} />
          </div>
          <div className="d-inline-block task-title title text-wraper">
            {this.props.taskTitle}
          </div>
          <div
            className="d-inline-block color-code"
            style={{
              backgroundColor: `${
                this.props.bgColor ? this.props.bgColor : "#ffffff"
              }`
            }}
          ></div>
          <div className="d-inline-block timer-dropdown">
            <input
              className="d-inline-block"
              className={this.state.showTimerMenu ? "border" : ""}
              defaultValue={this.times ? this.times[0] : ""}
              onClick={() => this.ToggleTimerDropDown()}
              readOnly
            />
          </div>
          {this.state.showTimerMenu && this.times.length > 1 ? (
            <div className="dropdown">
              {this.times.map((time, idx) => {
                if (idx !== 0) {
                  return <div className="border"> {time} </div>;
                }
              })}
            </div>
          ) : null}
        </div>
      </>
    );
  }
}

export default withRouter(TaskBottomPopup);
