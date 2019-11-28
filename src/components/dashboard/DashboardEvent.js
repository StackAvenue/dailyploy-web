import React, { Component } from "react";
import { withRouter } from "react-router-dom";

class DashboardEvent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showMenu: false,
      clickEventId: "",
    };
  }

  ToggleTimerDropDown = (id) => {
    console.log(this.props)
    this.setState({ clickEventId: id, showMenu: !this.state.showMenu })
  }

  render() {
    const { eventItemClick, start, end, event, mustAddCssClass, divStyle, schedulerData, titleText } = this.props;
    return (
      <>
        <div key={event.id} className={mustAddCssClass} style={divStyle}>
          <div className="row item">
            <div
              className="col-md-12 pointer item-heading text-wraper"
              style={{ padding: "5px 5px 0px 5px" }}
              onClick={() => { if (!!eventItemClick) eventItemClick(schedulerData, event) }}
            >
              <i class="fa fa-pencil pull-right" aria-hidden="true"></i>
              {titleText}
            </div>
            <div className="d-inline-block">
              <div className="task-ongoing d-inline-block"></div>
              <div className="d-inline-block task-timer">00:00:00</div>
              <div className="d-inline-block task-play-btn pointer"><i class="fa fa-pause"></i></div>
              {/* <div className="d-inline-block task-play-btn"><i class="fa fa-play"></i></div> */}
              {/* <div className="d-inline-block task-play-btn"><i class="fa fa-check"></i></div> */}
            </div>
            <div className="col-md-12 no-padding">
              <div className="col-md-6 no-padding d-inline-block item-time">
                {/* {`${start} - ${end}`} */}
                <input className="form-control timer-dropdown d-inline-block"
                  style={{ backgroundColor: this.state.showMenu ? "#ffffff" : this.props.bgColor, borderColor: this.props.bgColor }}
                  value={`${start} - ${end}`}
                  onClick={() => this.ToggleTimerDropDown(event.id)}
                />
              </div>
              <div className="col-md-6 no-padding d-inline-block item-time text-right">
                <span className="task-event-action pointer" onClick={(e) => ""}>...</span>
              </div>
            </div>
          </div>
        </div>
        {this.state.showMenu && this.state.clickEventId === event.id ?
          <div className={`menu dropdown-div `}>
            <div className="hover-border"> {`${start} - ${end}`} </div>
            <div className="hover-border"> {`${start} - ${end}`} </div>
            <div className="hover-border"> {`${start} - ${end}`} </div>
          </div> : null}

      </>
    );
  }
}

export default withRouter(DashboardEvent);