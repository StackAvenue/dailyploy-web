import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import MonthlyEvent from "./../dashboard/MonthlyEvent";
import moment from "moment";
import { post, mockGet, mockPost } from "../../utils/API";
import { DATE_FORMAT1, MONTH_FORMAT } from "./../../utils/Constants";



class DashboardEvent extends Component {
  constructor(props) {
    super(props)
    this.isToday = this.props.end.format(DATE_FORMAT1) == moment(new Date()).format(DATE_FORMAT1)
    this.state = {
      status: false,
      runningTime: 0,
      showTimerMenu: false,
      showAction: false,
      showPopup: false,
      clickEventId: "",
      startOn: "",
      endOn: "",
      icon: "play",
      timeArr: [
      ],
    };
  }

  async componentDidMount() {
    try {
      const { data } = await mockGet("task-track");
      if (data) {
        var timeArr = []
        data.map(date => {
          var sTime = moment(date.startdate).format("HH:mm")
          var eTime = moment(date.enddate).format("HH:mm")
          timeArr.push(`${sTime} - ${eTime}`)
        })
      }
    } catch (e) {
    }
  }

  handleClick = () => {
    this.setState(state => {
      if (state.status) {
        var endOn = Date.now()
        this.setState({ runningTime: 0, endOn: endOn });
        this.saveTaskTrackingTime(endOn)
        this.handleReset()
      } else {
        var startOn = Date.now()
        this.setState({ startOn: startOn })
        const startTime = startOn - this.state.runningTime;
        this.timer = setInterval(() => {
          this.setState({ runningTime: Date.now() - startTime });
        });
      }
      var icon = this.state.icon
      return {
        status: !state.status,
        showPopup: false,
        icon: icon == "pause" ? "play" : icon == "play" ? "pause" : "check",
      };
    });
  };

  async saveTaskTrackingTime(endOn) {
    var taskData = {
      startdate: new Date(this.state.startOn),
      enddate: new Date(endOn)
    }
    try {
      const { data } = await mockPost(taskData, "task-track");
      if (data) {
        var timeArr = [this.state.timeArr, ...[]]
        var sTime = moment(data.startdate).format("HH:mm")
        var eTime = moment(data.enddate).format("HH:mm")
        timeArr.push(`${sTime} - ${eTime}`)
        console.log(timeArr)
        this.setState({ timeArr: timeArr })
      }
    } catch (e) {
    }
  }

  handleReset = () => {
    clearInterval(this.timer);
    this.setState({ runningTime: 0, status: false, startOn: "" });
  };

  formattedSeconds = (ms) => {
    var totalSeconds = (ms / 1000)
    var h = Math.floor(totalSeconds / 3600);
    var m = Math.floor((totalSeconds % 3600) / 60);
    var s = Math.floor((totalSeconds % 3600) % 60);
    return ("0" + h).slice(-2) + ":" + ("0" + m).slice(-2) + ":" + ("0" + s).slice(-2);
  }

  showEventPopUp = () => {
    this.setState({ showPopup: !this.state.showPopup })
  }

  hideEventPopUp = () => {
    this.setState({ showPopup: false })
  }

  ToggleTimerDropDown = (id) => {
    this.setState({ clickEventId: id, showTimerMenu: !this.state.showTimerMenu, showPopup: false })
  }

  ToggleActionDropDown = (id) => {
    this.setState({ clickEventId: id, showAction: !this.state.showAction, showPopup: false })
  }

  handlePlayEvent = (id) => {
    var icon = this.state.icon
    this.setState({
      showPopup: false,
      icon: icon == "pause" ? "play" : icon == "play" ? "pause" : "check",
    })
  }

  async markCompleteTask(id) {
    if (id) {
      try {
        const { data } = await mockGet("mark-complete");
        var isComplete = data[0].complete
      } catch (e) {
      }
      if (isComplete) {
        this.setState({ icon: "check", showAction: false })
      }
    }
  }

  async deleteTask(id) {
    if (id) {
      try {
        const { data } = await mockGet("mark-complete");
        var isComplete = data[0].complete
      } catch (e) {
      }
      if (isComplete) {
      }
    }
  }

  render() {
    const { eventItemClick, start, end, event, mustAddCssClass, divStyle, schedulerData, titleText } = this.props;
    const startTime = moment(start).format("HH:mm");
    const endTime = moment(end).format("HH:mm");
    return (
      <>
        {schedulerData.viewType === 0 || schedulerData.viewType === 1 ?
          <div key={event.id} className={mustAddCssClass}
            style={divStyle}
            onMouseOver={() => this.showEventPopUp()}
            onMouseOut={() => this.hideEventPopUp()}
          >
            <div className="row item">
              <div
                className="col-md-12 pointer item-heading text-wraper"
                style={{ padding: "5px 5px 0px 5px" }}
                onClick={() => { if (!!eventItemClick) eventItemClick(schedulerData, event) }}
              >
                <i className="fa fa-pencil pull-right" aria-hidden="true"></i>
                {titleText}
              </div>
              <div className="d-inline-block">
                <div className={`d-inline-block ${this.state.icon !== "check" ? "task-ongoing" : "task-compete"}`} ></div>
                <div className="d-inline-block task-timer">{this.formattedSeconds(this.state.runningTime)}</div>
                {this.state.icon === 'pause' ?
                  <div
                    style={{ pointerEvents: this.isToday ? "" : "none" }}
                    className="d-inline-block task-play-btn pointer"
                    onClick={() => this.handleClick()}
                  ><i className="fa fa-pause"></i></div> : null}

                {this.state.icon === 'play' ?
                  <div
                    style={{ pointerEvents: this.isToday ? "" : "none" }}
                    className="d-inline-block task-play-btn pointer"
                    onClick={() => this.handleClick(event.id)}
                  ><i class="fa fa-play"></i></div> : null}

                {this.state.icon === 'check' ?
                  <div className="d-inline-block task-play-btn"><i className="fa fa-check"></i></div> : null}
              </div>
              <div className="col-md-12 no-padding">
                <div className="col-md-6 no-padding d-inline-block item-time">
                  {/* {`${start} - ${end}`} */}
                  <input className="form-control  timer-dropdown d-inline-block"
                    style={{ backgroundColor: this.state.showTimerMenu ? "#ffffff" : this.props.bgColor, borderColor: this.props.bgColor }}
                    defaultValue={`${startTime} - ${endTime}`}
                    onClick={() => this.ToggleTimerDropDown(event.id)}
                    onMouseOver={() => this.hideEventPopUp(event.id)}
                  />
                </div>
                {this.state.icon !== "check" ?
                  <div className="col-md-6 no-padding d-inline-block item-time text-right">
                    <span className="task-event-action pointer" onClick={() => this.ToggleActionDropDown(event.id)}>...</span>
                  </div> : null}
              </div>
            </div>
          </div>
          : <MonthlyEvent
            state={this.props}
            hideEventPopUp={this.hideEventPopUp}
            showEventPopUp={this.showEventPopUp}
          />}


        {this.state.showTimerMenu && this.state.clickEventId === event.id ?
          <div className={`dropdown-div `}>
            {this.props.times.map(time => {
              return <div className="hover-border"> {time} </div>
            })}
            {this.state.timeArr ?
              this.state.timeArr.map(time => {
                return <div className="hover-border"> {time} </div>
              }) : null}
          </div>
          : null}

        {this.state.showAction && this.state.clickEventId === event.id ?
          <div className="d-inline-block event-action-dropdown">
            {this.state.icon !== "check" ?
              <div
                className="border-bottom pointer"
                style={{ padding: "5px 0px 0px 0px" }}
                onClick={() => this.markCompleteTask(event.id)}
              >
                Mark Complete
            </div> : null}
            <div
              className="pointer"
              style={{ padding: "5px 0px 5px 0px" }}
              onClick={() => this.deleteTask(event.id)}
            >
              Delete Task
            </div>
          </div>
          : null
        }

        <div className="custom-event-popup">
          {this.state.showPopup ? this.props.eventItemPopoverTemplateResolver(schedulerData, event, titleText, start, end, this.props.bgColor)
            : null}
        </div>
      </>
    );
  }
}

export default withRouter(DashboardEvent);