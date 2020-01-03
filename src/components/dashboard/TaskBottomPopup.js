import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Timer from "./../dashboard/Timer";
import moment from "moment";

class TaskBottomPopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      runningTime: 0,
      showTimerMenu: false
    };
  }

  ToggleTimerDropDown = id => {
    this.setState({ showTimerMenu: !this.state.showTimerMenu });
  };

  returnTime = time => {
    return `${moment(time.start_time).format("HH.mm")} - ${moment(
      time.end_time
    ).format("HH.mm")}`;
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
          {this.props.timeTracked.length > 0 ? (
            <>
              <div className="d-inline-block timer-dropdown">
                <input
                  className="d-inline-block"
                  className={this.state.showTimerMenu ? "border" : ""}
                  defaultValue={
                    this.props.timeTracked.length > 0
                      ? this.returnTime(this.props.timeTracked[0])
                      : ""
                  }
                  onClick={() => this.ToggleTimerDropDown()}
                  readOnly
                />
              </div>
              {this.state.showTimerMenu ? (
                <div className="dropdown">
                  {this.props.timeTracked.map((time, idx) => {
                    if (idx !== 0) {
                      return (
                        <div className="border" key={time.id}>
                          {this.returnTime(time)}
                        </div>
                      );
                    }
                  })}
                </div>
              ) : null}
            </>
          ) : null}
        </div>
      </>
    );
  }
}

export default withRouter(TaskBottomPopup);
