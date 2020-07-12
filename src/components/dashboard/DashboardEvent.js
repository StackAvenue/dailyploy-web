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
import ReactTooltip from "react-tooltip";


import ClockIcon from "../../assets/images/hourglasss.gif";

import PauseIcon from "../../assets/images/hourglasss.gif";
import PlayIcon from "../../assets/images/hourglass1.png";



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
      middelText: "",
      event: [],
      lSide: false,
      rSide: false,
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
      } catch (e) { }
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
      } catch (e) { }
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
  displaytext = (event) => {
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
    let totalSeconds = '';
    if (this.props.event.allTimeTracked) {
      totalSeconds = this.props.event.allTimeTracked
        .map((log) => log.duration)
        .flat()
        .reduce((a, b) => a + b, 0);
    }

    var timeDiff = "No Estimate";
    var text1 = " of ";
    var text = " Est. ";

    if (moment(start).format("HH:mm") != "00:00" && moment(end).format("HH:mm") != "00:00" && moment(totalSeconds).format("mm") !== "00") {
      let totalSeconds = (end - start) / 1000;
      totalSeconds = Number(totalSeconds);
      var h = Math.floor(totalSeconds / 3600);
      var m = Math.floor((totalSeconds % 3600) / 60);

      if (m > 0 && h > 0) {

        if (m > 10) {
          return (
            (h + "h").slice(`${h}`.length > 2 ? -3 : -3) + " " + (m + "min").slice(-7) + " Estimate"
          );
        } else
          if (m < 10) {
            return (

              (h + "h").slice(`${h}`.length > 2 ? -3 : -3) + " " + ("0" + m + "min").slice(-7) + " Estimate"
            );
          }
      }
      else

        if (m === 0 && h > 0) {
          return (
            (h + "h").slice(`${h}`.length > 2 ? -3 : -3) + " Estimate"
          );
        } else
          if (m > 0 || h === 0) {
            if (m > 10) {
              return ((m + "min").slice(-7) + " Estimate");
            } else
              if (m < 10) {
                return (("0" + m + "min").slice(-7) + " Estimate");
              }


          } else {
            return (" ")
          }
    }
    else {
      return (" ")
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
    return ((h + "h").slice(`${h}`.length > 2 ? -3 : -3) + " " + (m + "min").slice(-7))
  }


  onClickOutside = () => {
    this.setState({
      show: !this.state.show,
      showAction: false,
    });
  };
  updateMiddelText = (text) => {
    this.setState({ middelText: text })
  }
  actionOnClickOutside = () => {
    this.setState({
      showAction: !this.state.showAction,
      show: false,
    });
  };
  datadisplay = (event) => {
    var lSide = false;
    var rSide = false;


    this.props.countData.map((data, id) => {

      if (data.taskId == event.taskId) {
        if (data.countTime > 1) {
          data.dateDiff.map((date, idd) => {

            if (date == event.date)
              if (idd == 0) {
                lSide = false;
                rSide = true;
              } else
                if (data.dateDiff.length - 1 == idd) {
                  lSide = true;
                  rSide = false;
                } else {
                  lSide = true;
                  rSide = true;
                }

          })

        }

      }
    })
    return ({ lSide, rSide })

  }

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

    var side = this.datadisplay(event);

    let totalTrackTime = '';
    if (this.props.event.allTimeTracked) {
      totalTrackTime = this.props.event.allTimeTracked
        .map((log) => log.duration)
        .flat()
        .reduce((a, b) => a + b, 0);
    }

    let todaysLog = this.props.event.timeTracked.filter(
      (log) => log.status.name != "running"
    );
    let logs = this.createLogTimes(todaysLog);
    let contColor = getContrastColor(this.props.bgColor);

    return (
      <>

        {schedulerData.viewType === 0 ? (
          <div key={event.id} className={mustAddCssClass}>
            <div className="row item dashboard-event-box height-22 ">
              <div className="col-md-7 no-padding">
                <div
                  className="project-name-text cursor pad-left-0"
                  style={divStyle}
                  onClick={() => {
                    if (!!eventItemClick) eventItemClick(schedulerData, event);
                  }}
                >
                  <span className="name-text-dot ">{event.projectName}</span>
                </div>
              </div>

              <div className="col-md-4 align-center no-padding">
                {event.trackingStatus === "pause" && event.status != null && event.status.name != "completed" ? (
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
                      {/* <i className="fa fa-pause"></i> */}
                      <img
                        src={PauseIcon}
                        alt=""
                        title=""
                        className="clock-img"
                        height="100%"
                        width="100%"
                        data-tip data-for="registerTip1"
                        data-background-color="#f0f2f5"
                        data-text-color="#010101"

                      />


                    </span>

                    <ReactTooltip id="registerTip1" place="top" effect="solid">
                      Stop the task
                      </ReactTooltip>
                  </div>
                ) : null}

                {event.trackingStatus === "play" && event.status && event.status.name != "completed" ? (
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
                      {/* <i className="fa fa-power-off"></i> */}
                      <img
                        src={PlayIcon}
                        alt=""
                        title=""
                        className="clock-img"
                        height="100%"
                        width="100%"
                        data-tip data-for="registerTip"
                        data-background-color="#f0f2f5"
                        data-text-color="#010101"
                        data-place="bottom"
                        data-effect="float"

                      />
                    </span>
                    <ReactTooltip id="registerTip" place="top" effect="solid">
                      Start the task
                      </ReactTooltip>
                  </div>
                ) : null}

                {event.status && event.status.name === "completed" ? (
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

            <div className="row item dashboard-event-box height-20">
              <OverlayTrigger
                placement="auto"
                trigger={['hover', 'focus']}
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
                    {/* <div className={`${this.props.event.priority}`}></div> */}
                    <div className="clock-img-div1">
                      <svg id="Capa_1" enableBackground="new 0 0 512 512" height="100%" viewBox="0 0 512 512" width="100%" xmlns="http://www.w3.org/2000/svg"><g><path d="m256 0-128 256 128 256c141.385 0 256-114.615 256-256s-114.615-256-256-256z" fill="#28abfa" /><path d="m0 256c0 141.385 114.615 256 256 256v-512c-141.385 0-256 114.615-256 256z" fill="#14cfff" /><path d="m256 60-98 196 98 196c108.248 0 196-87.752 196-196s-87.752-196-196-196z" fill="#c4f3ff" /><path d="m60 256c0 108.248 87.752 196 196 196v-392c-108.248 0-196 87.752-196 196z" fill="#fff" /><path d="m298.426 277.213-42.426-42.426h-20l20 42.426 21.213 21.213z" fill="#340d66" /><path d="m170.794 149.581-21.213 21.213 106.419 106.419v-42.426z" fill="#373e9f" /><path d="m341.561 149.227-85.561 85.56-20 42.426h20l106.773-106.774z" fill="#373e9f" /><path d="m213.574 277.213 21.213 21.213 21.213-21.213v-42.426z" fill="#3857bc" /><path d="m271 90h-15l-10 15 10 15h15z" fill="#340d66" /><path d="m241 90h15v30h-15z" fill="#373e9f" /><path d="m271 392h-15l-10 15 10 15h15z" fill="#340d66" /><path d="m241 392h15v30h-15z" fill="#373e9f" /><path d="m90 241h30v30h-30z" fill="#373e9f" transform="matrix(0 -1 1 0 -151 361)" /><path d="m392 241h30v30h-30z" fill="#340d66" transform="matrix(0 -1 1 0 151 663)" /></g></svg>
                    </div>
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
                      {/* {this.state.middelText} {this.calculateTime(event)} */}
                    </span>
                  </div>
                </div>
              </OverlayTrigger>
            </div>
            <div className="row item dashboard-event-box">
              <OverlayTrigger
                placement="auto"
                trigger={['hover', 'focus']}
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
                      className="col-md-12 no-padding pointer text-wraper "
                      style={{
                        paddingTop: "6px",
                        paddingLeft: "8px"
                        // color: getContrastColor(this.props.bgColor)
                      }}
                      onClick={() => {
                        if (!!eventItemClick) eventItemClick(schedulerData, event);
                      }}
                    >
                      <span className="project-task-name day-task-name-padd">{titleText}</span>
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
            <div className="row item dashboard-event-box height-24">
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
                {event.trackingStatus === "pause" && event.status && event.status.name != "completed" ? (
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
                      {/* <i className="fa fa-pause "></i> */}
                      <img
                        src={PauseIcon}
                        alt=""
                        title=""
                        className="clock-img"
                        height="100%"
                        width="100%"
                        data-tip data-for="registerTip1"
                        data-background-color="#f0f2f5"
                        data-text-color="#010101"

                      />


                    </span>

                    <ReactTooltip id="registerTip1" place="top" effect="solid">
                      Stop the task
                      </ReactTooltip>
                  </div>
                ) : null}

                {event.trackingStatus === "play" && event.status && event.status.name != "completed" ? (
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
                      {/* <i className="fa fa-power-off"></i> */}
                      <img
                        src={PlayIcon}
                        alt=""
                        title=""
                        className="clock-img"
                        height="100%"
                        width="100%"
                        data-tip data-for="registerTip"
                        data-background-color="#f0f2f5"
                        data-text-color="#010101"
                        data-place="bottom"
                        data-effect="float"
                      />
                    </span>
                    <ReactTooltip id="registerTip" place="top" effect="solid">
                      Start the task
                      </ReactTooltip>
                  </div>
                ) : null}


                {event.status && event.status.name === "completed" ? (
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
            <span className="margin-none">-</span> 
              <span>
                {moment(convertUTCToLocalDate(event.taskEndDateTime)).format(
                  COMMENT_DATETIME
                )}
              </span>
            </div> */}

            <div className="row item dashboard-event-box height-14">
              <OverlayTrigger
                placement="auto"
                trigger={['hover', 'focus']}
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
                  <div className="col-md-2 no-padding flex-center ">
                    {/* <div className={`${this.props.event.priority}`}></div> */}
                    <div className="clock-img-div">
                      {/* <img
                        src={ClockIcon}
                        alt=""
                        title=""
                        className="clock-img"
                        height="100%"
                        width="100%"
                      /> */}
                      <svg id="Capa_1" enableBackground="new 0 0 512 512" height="100%" viewBox="0 0 512 512" width="100%" xmlns="http://www.w3.org/2000/svg"><g><path d="m256 0-128 256 128 256c141.385 0 256-114.615 256-256s-114.615-256-256-256z" fill="#28abfa" /><path d="m0 256c0 141.385 114.615 256 256 256v-512c-141.385 0-256 114.615-256 256z" fill="#14cfff" /><path d="m256 60-98 196 98 196c108.248 0 196-87.752 196-196s-87.752-196-196-196z" fill="#c4f3ff" /><path d="m60 256c0 108.248 87.752 196 196 196v-392c-108.248 0-196 87.752-196 196z" fill="#fff" /><path d="m298.426 277.213-42.426-42.426h-20l20 42.426 21.213 21.213z" fill="#340d66" /><path d="m170.794 149.581-21.213 21.213 106.419 106.419v-42.426z" fill="#373e9f" /><path d="m341.561 149.227-85.561 85.56-20 42.426h20l106.773-106.774z" fill="#373e9f" /><path d="m213.574 277.213 21.213 21.213 21.213-21.213v-42.426z" fill="#3857bc" /><path d="m271 90h-15l-10 15 10 15h15z" fill="#340d66" /><path d="m241 90h15v30h-15z" fill="#373e9f" /><path d="m271 392h-15l-10 15 10 15h15z" fill="#340d66" /><path d="m241 392h15v30h-15z" fill="#373e9f" /><path d="m90 241h30v30h-30z" fill="#373e9f" transform="matrix(0 -1 1 0 -151 361)" /><path d="m392 241h30v30h-30z" fill="#340d66" transform="matrix(0 -1 1 0 151 663)" /></g></svg>
                    </div>
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
                      {/* {this.state.middelText} {this.calculateTime(event)} */}
                    </span>
                    {/* {this.datadisplay()} */}
                  </div>
                </div>
              </OverlayTrigger>
            </div>

            <div className="row item dashboard-event-box">
              <OverlayTrigger
                placement="auto"
                trigger={['hover', 'focus']}
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
                      className="col-md-12  pointer  text-wraper"
                      style={{
                        padding: "5px 5px 0px 5px",
                        // color: getContrastColor(this.props.bgColor)
                      }}
                      onClick={() => {
                        if (!!eventItemClick) eventItemClick(schedulerData, event);
                      }}>
                      {/* // <div className="lside" style={{color:event.bgColor}}>{side.lSide?<i class="fas fa-arrow-left"></i>:null}</div> */}
                      <div className="project-task-name">{titleText}</div>
                      {/* <div className="rside" style={{color:event.bgColor}}>{side.rSide?<i class="fas fa-arrow-right"></i>:null}</div> */}
                    </div>
                  </div>

                </div>
              </OverlayTrigger>
            </div>

          </div>
        ) : null}

        {/* Code for monthly below start logic not needed right now  */}
        {/* {schedulerData.viewType === 2 ? (
          <MonthlyEvent
            state={this.props}
            hideEventPopUp={this.hideEventPopUp}
            showEventPopUp={this.showEventPopUp}
          />
        ) : null} */}
        {/* Code for monthly below end logic not needed right now  */}

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
