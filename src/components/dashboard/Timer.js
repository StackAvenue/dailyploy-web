import React, { Component } from "react";
import { withRouter } from "react-router-dom";

class Timer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      runningTime: 0,
    };
  }

  componentDidMount = () => {
    this.handleClick()
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.startOn !== this.props.startOn) {
      this.handleReset()
      this.handleClick()
    }
  }

  handleClick = () => {
    this.setState(state => {
      if (this.props.isStart && this.props.startOn !== "") {
        var startOn = this.props.startOn
        const startTime = startOn - this.state.runningTime;
        this.timer = setInterval(() => {
          this.setState({ runningTime: Date.now() - startTime });
        });
      } else {
        this.handleReset()
      }
    });
  };

  handleReset = () => {
    clearInterval(this.timer);
    this.setState({ runningTime: 0 });
  };

  formattedSeconds = (ms) => {
    var totalSeconds = (ms / 1000)
    var h = Math.floor(totalSeconds / 3600);
    var m = Math.floor((totalSeconds % 3600) / 60);
    var s = Math.floor((totalSeconds % 3600) % 60);
    return ("0" + h).slice(-2) + ":" + ("0" + m).slice(-2) + ":" + ("0" + s).slice(-2);
  }

  render() {
    return this.formattedSeconds(this.state.runningTime)
  }
}

export default withRouter(Timer);