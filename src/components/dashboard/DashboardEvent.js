import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import MonthlyEvent from "./../dashboard/MonthlyEvent";
import Select from "./../Select";
import moment from "moment";
import { post, put, mockGet, mockPost } from "../../utils/API";
import {
  DATE_FORMAT1,
  FULL_DATE,
  COMMENT_DATETIME,
} from "./../../utils/Constants";
import {
  convertUTCToLocalDate,
  getContrastColor,
} from "./../../utils/function";
import TimerCardTask from "./../dashboard/TimerCardTask";
import TaskAction from "./../dashboard/TaskAction";
import { Alert, UncontrolledAlert } from "reactstrap";
import { OverlayTrigger } from "react-bootstrap";

class DashboardEvent extends Component {
  constructor(props) {
    super(props);
    this.isToday =
      this.props.end.format(DATE_FORMAT1) ==
      moment(new Date()).format(DATE_FORMAT1);
    this.state = {
      status: false,
      runningTime: 0,
      showTimerMenu: false,
      showAction: false,
      showPopup: false,
      clickEventId: "",
      startOn: "",
      endOn: "",
      canStart: false,
      icon: "play",
      taskTimerLog: [],
      showAlert: false,
      show: false,
      middelText:"",
      event:[]
    };
  }

  showEventPopUp = () => {
    this.setState({ showPopup: !this.state.showPopup });
  };

  hideEventPopUp = () => {
    this.setState({ showPopup: false });
  };

  ToggleTimerDropDown = (id) => {
    this.setState({
      clickEventId: id,
      showTimerMenu: !this.state.showTimerMenu,
      showPopup: false,
      show: false,
    });
  };

  ToggleActionDropDown = (id) => {
    this.setState({
      clickEventId: id,
      showAction: !this.state.showAction,
      showPopup: false,
    });
  };

  async markCompleteTask(id) {
    if (id) {
      try {
        const { data } = await mockGet("mark-complete");
        var isComplete = data[0].complete;
      } catch (e) {}
      if (isComplete) {
        var taskId = localStorage.getItem(`taskId-${this.props.workspaceId}`);
        this.handleReset();
        this.setState({ icon: "check", showAction: false });
        if (taskId === id) {
          this.props.handleTaskBottomPopup("", this.props.event, "stop");
        }
      }
    }
  }

  async deleteTask(id) {
    if (id) {
      try {
        const { data } = await mockGet("mark-complete");
        var isComplete = data[0].complete;
      } catch (e) {}
      if (isComplete) {
      }
    }
  }

  isValidUserDate = (userId) => {
    return this.props.userId === userId;
    // return this.isToday && this.props.userId === userId;
  };

  returnTime = (time) => {
    return `${moment(time.start_time).format("HH.mm A")} - ${moment(
      time.end_time
    ).format("HH.mm A")}`;
  };

  createLogTimes = (times) => {
    return times.map((time) => {
      return {
        id: time.id,
        name: `${moment(time.start_time).format("HH.mm A")} - ${moment(
          time.end_time
        ).format("HH.mm A")}`,
      };
    });
  };

  onClickInput = () => {
    this.setState({
      clickEventId: this.props.event.id,
      show: true,
      showAction: false,
    });
  };
  displaytext=(event)=>{
return event;
  }
  calculateTime = (event) => {
    var start = new Date(
      moment(convertUTCToLocalDate(event.taskStartDateTime))
        .format(FULL_DATE)
        .replace(/-/g, "/")
    );
    var end = new Date(
      moment(convertUTCToLocalDate(event.taskEndDateTime))
        .format(FULL_DATE)
        .replace(/-/g, "/")
    );

    const totalSeconds = this.props.event.allTimeTracked
    .map((log) => log.duration)
    .flat()
    .reduce((a, b) => a + b, 0);

    var timeDiff = "No Estimate";
    var text1=" of ";
    var text=" Est. ";
   
    if (moment(start).format("HH:mm") != "00:00" && moment(end).format("HH:mm") != "00:00" && moment(totalSeconds).format("mm")!== "00") {
      let totalSeconds = (end - start) / 1000;
      totalSeconds = Number(totalSeconds);
      var h = Math.floor(totalSeconds / 3600);
      var m = Math.floor((totalSeconds % 3600) / 60);
     
    if(m>0 && h>0){

      if(m>10)
      {
  return (
      (h+"h").slice(`${h}`.length > 2 ? -3 : -3) + " " + (m+"min").slice(-7)+" Estimate"
      );
    }else
    if(m<10)
    {
      return (
          
        (h+"h").slice(`${h}`.length > 2 ? -3 : -3) + " " + ("0"+m+"min").slice(-7)+" Estimate"
      );
    }    
    }
    else

    if(m===0 && h>0){
        return (
          (h+"h").slice(`${h}`.length > 2 ? -3 : -3)+" Estimate"
        );
    } else
  if(m>0 || h===0)
  {  
    if(m>10)
    {
  return (  (m+"min").slice(-7)+" Estimate" );
  }else
  if(m<10)
  {
      return ( ("0"+m+"min").slice(-7)+" Estimate");
  }


    }else{
      return(" ")
    }
  }
    else{
  return(" ")
    }

  

  
   
  };

  formattedSeconds = () => {
    const totalSeconds = this.props.event.allTimeTracked
      .map((log) => log.duration)
      .flat()
      .reduce((a, b) => a + b, 0);
   
      var h = Math.floor(totalSeconds / 3600);
      var m = Math.floor((totalSeconds % 3600) / 60);
      var s = Math.floor((totalSeconds % 3600) % 60);
    return((h+"h").slice(`${h}`.length > 2 ? -3 : -3) + " " + (m+"min").slice(-7))
  }


  onClickOutside = () => {
    this.setState({
      show: !this.state.show,
      showAction: false,
    });
  };
  updateMiddelText=(text)=>{
    this.setState({middelText:text})
  }
  actionOnClickOutside = () => {
    this.setState({
      showAction: !this.state.showAction,
      show: false,
    });
  };

  render() {
    const {
      eventItemClick,
      start,
      end,
      event,
      mustAddCssClass,
      divStyle,
      borderLeft,
      schedulerData,
      titleText,
      state,
    } = this.props;
    
    const totalTrackTime = this.props.event.allTimeTracked
      .map((log) => log.duration)
      .flat()
      .reduce((a, b) => a + b, 0);
    let todaysLog = this.props.event.timeTracked.filter(
      (log) => log.status != "running"
    );
    let logs = this.createLogTimes(todaysLog);
    let contColor = getContrastColor(this.props.bgColor);
    return (
      <>
        {schedulerData.viewType === 0 ? (
          <div key={event.id} className={mustAddCssClass}>
            <div className="row item dashboard-event-box ABS">
              <div className="col-md-7 no-padding">
                <div
                  className="project-name-text cursor"
                  style={divStyle}
                  onClick={() => {
                    if (!!eventItemClick) eventItemClick(schedulerData, event);
                  }}
                >
                  <span className="name-text-dot">{event.projectName}</span>
                </div>
              </div>

              <div className="col-md-4 align-center no-padding">
                {event.trackingStatus === "pause" &&
                event.status === "running" ? (
                  <div className=" no-padding d-inline-block">
                    <span
                      style={{
                        pointerEvents: this.isValidUserDate(event.resourceId)
                          ? ""
                          : "none",
                      }}
                      className={`task-play-btn pointer ${
                        state.isPlayPause ? "disabled" : ""
                      }`}
                      onClick={() =>
                        this.props.handleTaskStop(event, Date.now())
                      }
                    >
                      <i className="fa fa-pause"></i>
                    </span>
                  </div>
                ) : null}

                {event.trackingStatus === "play" &&
                event.status === "not_started" ? (
                  <div className=" no-padding d-inline-block">
                    <span
                      style={{
                        pointerEvents: this.isValidUserDate(event.resourceId)
                          ? ""
                          : "none",
                      }}
                      className={`task-play-btn pointer ${
                        state.isPlayPause ? "disabled" : ""
                      }`}
                      onClick={() =>
                        this.props.handleTaskStart(event, Date.now())
                      }
                    >
                      <i className="fa fa-power-off"></i>
                    </span>
                  </div>
                ) : null}

                {event.trackingStatus === "play" &&
                event.status === "running" ? (
                  <div className=" no-padding d-inline-block">
                    <span
                      style={{
                        pointerEvents: this.isValidUserDate(event.resourceId)
                          ? ""
                          : "none",
                      }}
                      className={`task-play-btn pointer ${
                        state.isPlayPause ? "disabled" : ""
                      }`}
                      onClick={() =>
                        this.props.handleTaskStart(event, Date.now())
                      }
                    >
                      <i className="fa fa-play"></i>
                    </span>
                  </div>
                ) : null}

                {event.status === "completed" ? (
                  <div className=" no-padding d-inline-block">
                    <span className="task-play-btn">
                      <i className="fa fa-check"></i>
                    </span>
                  </div>
                ) : null}
              </div>
              <div className="col-md-1 align-center no-padding">
                <div className="no-padding d-inline-block three-dot">
                  <span
                    className="task-event-action pointer"
                    onClick={() => this.ToggleActionDropDown(event.id)}
                  >
                    ...
                  </span>
                </div>
              </div>
            </div>

            {/* <div className="row date-div-card">
              <span>
                {moment(convertUTCToLocalDate(event.taskStartDateTime)).format(
                  COMMENT_DATETIME
                )}
                {" - "}
              </span>
              {/* <span className="margin-none">-</span> 
              <span>
                {moment(convertUTCToLocalDate(event.taskEndDateTime)).format(
                  COMMENT_DATETIME
                )}
              </span>
            </div> */}

            <div className="row item dashboard-event-box">
              <OverlayTrigger
                placement="auto"
                trigger="hover"
                overlay={this.props.eventItemPopoverTemplateResolver(
                  schedulerData,
                  event,
                  titleText,
                  start,
                  end,
                  this.props.bgColor
                )}
              >
                <div className="col-md-9 no-padding flex-center">
                  <div className="col-md-2 no-padding flex-center">
                    <div className={`${this.props.event.priority}`}></div>
                  </div>
                  <div className="col-md-3 no-padding d-inline-block ">
                    <span className="task-timer">
                      <TimerCardTask
                        totalDuration={totalTrackTime}
                        startOn={this.props.event.startOn}
                        isStart={this.props.event.startOn ? true : false}
                        calculateTime={this.calculateTime}
                        event={event}
                      />
                      {this.state.middelText} {this.calculateTime(event)}
                    </span>
                  </div>
                </div>
              </OverlayTrigger>
            </div>
            <div className="row item dashboard-event-box">
              <OverlayTrigger
                placement="auto"
                trigger="hover"
                overlay={this.props.eventItemPopoverTemplateResolver(
                  schedulerData,
                  event,
                  titleText,
                  start,
                  end,
                  this.props.bgColor
                )}
              >
            <div className="row item dashboard-event-box">
              <div
                className="col-md-12 no-padding"
                // style={{ color: contColor }}
              >
                <div
                  className="col-md-12 no-padding pointer item-heading text-wraper"
                  style={{
                    padding: "5px 5px 0px 5px",
                    // color: getContrastColor(this.props.bgColor)
                  }}
                  onClick={() => {
                    if (!!eventItemClick) eventItemClick(schedulerData, event);
                  }}
                >
                  <span className="project-task-name">{titleText}</span>
                </div>
              </div>
            </div>
            </OverlayTrigger>
            </div>
          </div>
        ) : null}

        {schedulerData.viewType === 1 ? (
          <div
            key={event.id}
            className={`${mustAddCssClass}
             `}
            // style={divStyle}
            style={borderLeft}
          >
            <div className="row item dashboard-event-box">
              <div className="col-md-7 no-padding">
                <div
                  className="project-name-text cursor"
                  style={divStyle}
                  onClick={() => {
                    if (!!eventItemClick) eventItemClick(schedulerData, event);
                  }}
                >
                  <span className="name-text-dot">{event.projectName}</span>
                </div>
              </div>

              <div className="col-md-4 align-center no-padding">
                {event.trackingStatus === "pause" &&
                event.status === "running" ? (
                  <div className=" no-padding d-inline-block">
                    <span
                      style={{
                        pointerEvents: this.isValidUserDate(event.resourceId)
                          ? ""
                          : "none",
                      }}
                      className={`task-play-btn pointer ${
                        state.isPlayPause ? "disabled" : ""
                      }`}
                      onClick={() =>
                        this.props.handleTaskStop(event, Date.now())
                      }
                    >
                      <i className="fa fa-pause"></i>
                    </span>
                  </div>
                ) : null}

                {event.trackingStatus === "play" &&
                event.status === "not_started" ? (
                  <div className=" no-padding d-inline-block">
                    <span
                      style={{
                        pointerEvents: this.isValidUserDate(event.resourceId)
                          ? ""
                          : "none",
                      }}
                      className={`task-play-btn pointer ${
                        state.isPlayPause ? "disabled" : ""
                      }`}
                      onClick={() =>
                        this.props.handleTaskStart(event, Date.now())
                      }
                    >
                      <i className="fa fa-power-off"></i>
                    </span>
                  </div>
                ) : null}

                {event.trackingStatus === "play" &&
                event.status === "running" ? (
                  <div className=" no-padding d-inline-block">
                    <span
                      style={{
                        pointerEvents: this.isValidUserDate(event.resourceId)
                          ? ""
                          : "none",
                      }}
                      className={`task-play-btn pointer ${
                        state.isPlayPause ? "disabled" : ""
                      }`}
                      onClick={() =>
                        this.props.handleTaskStart(event, Date.now())
                      }
                    >
                      <i className="fa fa-play"></i>
                    </span>
                  </div>
                ) : null}

                {event.status === "completed" ? (
                  <div className=" no-padding d-inline-block">
                    <span className="task-play-btn">
                      <i className="fa fa-check"></i>
                    </span>
                  </div>
                ) : null}
              </div>
              <div className="col-md-1 align-center no-padding">
                <div className="no-padding d-inline-block three-dot">
                  <span
                    className="task-event-action pointer"
                    onClick={() => this.ToggleActionDropDown(event.id)}
                  >
                    ...
                  </span>
                </div>
              </div>
            </div>

            {/* <div className="row date-div-card">
              <span>
                {moment(convertUTCToLocalDate(event.taskStartDateTime)).format(
                  COMMENT_DATETIME
                )}
                {" - "}
              </span>
              {/* <span className="margin-none">-</span> 
              <span>
                {moment(convertUTCToLocalDate(event.taskEndDateTime)).format(
                  COMMENT_DATETIME
                )}
              </span>
            </div> */}

            <div className="row item dashboard-event-box">
              <OverlayTrigger
                placement="auto"
                trigger="hover"
                overlay={this.props.eventItemPopoverTemplateResolver(
                  schedulerData,
                  event,
                  titleText,
                  start,
                  end,
                  this.props.bgColor
                )}
              >
                <div className="col-md-9 no-padding flex-center">
                  <div className="col-md-2 no-padding flex-center">
                    <div className={`${this.props.event.priority}`}></div>
                  </div>
                  <div className="col-md-3 no-padding d-inline-block ">
                    <span className="task-timer">
                      <TimerCardTask
                        totalDuration={totalTrackTime}
                        startOn={this.props.event.startOn}
                        isStart={this.props.event.startOn ? true : false}
                        calculateTime={this.calculateTime}
                        event={event}
                      />
                      {this.state.middelText} {this.calculateTime(event)}
                    </span>
                  </div>
                </div>
              </OverlayTrigger>
            </div>

            <div className="row item dashboard-event-box">
              <OverlayTrigger
                placement="auto"
                trigger="hover"
                overlay={this.props.eventItemPopoverTemplateResolver(
                  schedulerData,
                  event,
                  titleText,
                  start,
                  end,
                  this.props.bgColor
                )}
              >
            <div className="row item dashboard-event-box">
              <div
                className="col-md-12 no-padding"
                // style={{ color: contColor }}
              >
                <div
                  className="col-md-12  pointer item-heading text-wraper"
                  style={{
                    padding: "5px 5px 0px 5px",
                    // color: getContrastColor(this.props.bgColor)
                  }}
                  onClick={() => {
                    if (!!eventItemClick) eventItemClick(schedulerData, event);
                  }}
                >
                  <span className="project-task-name">{titleText}</span>
                </div>
              </div>
            </div>
            </OverlayTrigger>
            </div>
          </div>
        ) : null}

        {schedulerData.viewType === 2 ? (
          <MonthlyEvent
            state={this.props}
            hideEventPopUp={this.hideEventPopUp}
            showEventPopUp={this.showEventPopUp}
          />
        ) : null}

        {/* {this.state.clickEventId === event.id && this.state.show ? (
          <Select
            state={this.state}
            options={logs}
            onClickInput={this.onClickOutside}
          />
        ) : null} */}

        {this.state.showTimerMenu && this.state.clickEventId === event.id ? (
          <div className={`dropdown-div `}>
            {todaysLog.time_tracks.map((time, idx) => {
              if (idx !== 0) {
                return (
                  <div className="hover-border" key={time.id}>
                    {this.returnTime(time)}
                  </div>
                );
              }
            })}
          </div>
        ) : null}

        {this.state.showAction && this.state.clickEventId === event.id ? (
          <TaskAction
            event={event}
            actionOnClickOutside={this.actionOnClickOutside}
            taskEventResumeConfirm={this.props.taskEventResumeConfirm}
          />
        ) : null}

        <div className="custom-event-popup">
          {this.state.showPopup
            ? this.props.eventItemPopoverTemplateResolver(
                schedulerData,
                event,
                titleText,
                start,
                end,
                this.props.bgColor
              )
            : null}
        </div>

        {state.showAlert && state.showEventAlertId == event.id ? (
          <UncontrolledAlert className="task-war-alert" color="warning">
            one task already ongoing !
          </UncontrolledAlert>
        ) : null}
      </>
    );
  }
}

export default withRouter(DashboardEvent);
