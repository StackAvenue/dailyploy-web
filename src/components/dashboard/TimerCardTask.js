import React, { Component } from "react";
import { withRouter } from "react-router-dom";

class Timer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      runningTime: 0
    };
  }

  componentDidMount = () => {
    this.handleReset();
    this.handleClick();
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.startOn !== this.props.startOn) {
      this.handleReset();
      this.handleClick();
    }
  };

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  handleClick = () => {
    if (this.props.isStart && this.props.startOn !== "") {
      var startOn = this.props.startOn;
      const startTime = startOn - this.state.runningTime;
      this.timer = setInterval(() => {
        this.setState({ runningTime: Date.now() - startTime });
      });
    } else {
      this.handleReset();
    }
  };

  handleReset = () => {
    clearInterval(this.timer);
    this.setState({ runningTime: 0 });
  };

  formattedSeconds = (ms, totalDuration) => {
    var totalSeconds = ms / 1000;
    var totalSeconds = totalSeconds + totalDuration;
    var h = Math.floor(totalSeconds / 3600);
    var m = Math.floor((totalSeconds % 3600) / 60);
    var s = Math.floor((totalSeconds % 3600) % 60);
   if(h>0){
    if(h===0 && m===0){
    return ("");
    }else
    if(m>10){
    return (
  
      
      (h+"h").slice(`${h}`.length > 2 ? -3 : -3) + " " + (m+"min").slice(-7)
    );
    }
    else{
        return (
          (h+"h").slice(`${h}`.length > 2 ? -3 : -3) + " " + ("0"+m+"min").slice(-7)
        );
        }
      }
    else{
          return(" ");
      }
    
  };
  
 

  render() {
    return this.formattedSeconds(
      this.state.runningTime,
      this.props.totalDuration
    );
  }
}

export default withRouter(Timer);
