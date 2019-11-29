import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import MonthlyEvent from "./../dashboard/MonthlyEvent";
import moment from "moment";


class DashboardEvent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showTimerMenu: false,
      showAction: false,
      showPopup: false,
      clickEventId: "",
    };
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
                <div className="task-ongoing d-inline-block"></div>
                <div className="d-inline-block task-timer">00:00:00</div>
                <div className="d-inline-block task-play-btn pointer"><i className="fa fa-pause"></i></div>
                {/* <div className="d-inline-block task-play-btn"><i class="fa fa-play"></i></div> */}
                {/* <div className="d-inline-block task-play-btn"><i class="fa fa-check"></i></div> */}
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
                <div className="col-md-6 no-padding d-inline-block item-time text-right">
                  <span className="task-event-action pointer" onClick={() => this.ToggleActionDropDown(event.id)}>...</span>
                </div>
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
            <div className="hover-border"> {`${startTime} - ${endTime}`} </div>
            <div className="hover-border"> {`${startTime} - ${endTime}`} </div>
            <div className="hover-border"> {`${startTime} - ${endTime}`} </div>
          </div> : null}

        {this.state.showAction && this.state.clickEventId === event.id ?
          <div className="d-inline-block event-action-dropdown">
            <div className="border-bottom pointer" style={{ padding: "5px 0px 0px 0px" }} onClick={{}} >Mark Complete</div>
            <div className="pointer" style={{ padding: "5px 0px 5px 0px" }} onClick={{}}>Delete Task</div>
          </div>
          : null}

        <div className="custom-event-popup">
          {this.state.showPopup ? this.props.eventItemPopoverTemplateResolver(schedulerData, event, titleText, start, end, this.props.bgColor)
            : null}
        </div>
      </>
    );
  }
}

export default withRouter(DashboardEvent);