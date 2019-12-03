import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Timer from "./../dashboard/Timer";

class TaskBottomPopup extends Component {
  constructor(props) {
    super(props)
    this.state = {
      runningTime: 0,
    };
  }

  // componentDidMount = () => {
  //   this.handleClick()
  // }


  // componentDidUpdate = (prevProps, prevState) => {
  //   if (prevState.startOn !== this.state.startOn) {
  //     this.handleReset()
  //     this.handleClick()
  //   }
  // }

  // handleClick = () => {
  //   this.setState(state => {
  //     if (this.props.startOn !== "") {
  //       var startOn = this.props.startOn
  //       const startTime = startOn - this.state.runningTime;
  //       this.timer = setInterval(() => {
  //         this.setState({ runningTime: Date.now() - startTime });
  //       });
  //     }
  //   });
  // };

  // handleReset = () => {
  //   clearInterval(this.timer);
  //   this.setState({ runningTime: 0 });
  // };

  // formattedSeconds = (ms) => {
  //   var totalSeconds = (ms / 1000)
  //   var h = Math.floor(totalSeconds / 3600);
  //   var m = Math.floor((totalSeconds % 3600) / 60);
  //   var s = Math.floor((totalSeconds % 3600) % 60);
  //   return ("0" + h).slice(-2) + ":" + ("0" + m).slice(-2) + ":" + ("0" + s).slice(-2);
  // }

  render() {
    return (
      <>
        <div className="d-inline-block task-b-popup">
          <span className="d-inline-block task-pause-btn pointer">
            <i className="fa fa-pause "></i>
          </span>
          {/* <div className="d-inline-block task-title">{this.formattedSeconds(this.state.runningTime)}</div> */}
          <div className="d-inline-block task-title">
            <Timer
              startOn={this.props.startOn}
              isStart={this.props.isStart}
            />
          </div>
          {/* <div className="d-inline-block task-title">{this.props.runningFormattedTimer(this.props.startOn)}</div> */}
          <div className="d-inline-block task-title">{this.props.taskTitle}</div>
          <div className="d-inline-block color-code" style={{ backgroundColor: `${this.props.bgColor ? this.props.bgColor : "#ffffff"}` }}></div>
          <div className="d-inline-block"></div>
        </div>
      </>
    );
  }
}

export default withRouter(TaskBottomPopup);