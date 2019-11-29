import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import moment from "moment";


class MonthlyEvent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showTimerMenu: false,
      showAction: false,
      showPopup: false,
      clickEventId: "",
    };
  }

  showEventPopUp = (id) => {
    this.setState({ showPopup: !this.state.showPopup })
  }

  hideEventPopUp = (id) => {
    this.setState({ showPopup: false })
  }

  ToggleTimerDropDown = (id) => {
    this.setState({ clickEventId: id, showTimerMenu: !this.state.showTimerMenu, showPopup: false })
  }

  ToggleActionDropDown = (id) => {
    this.setState({ clickEventId: id, showAction: !this.state.showAction, showPopup: false })
  }

  render() {
    const { eventItemClick, event, mustAddCssClass, divStyle, schedulerData, titleText } = this.props.state;
    return (
      <div key={event.id} className={mustAddCssClass}
        style={divStyle}
        onMouseOver={() => this.props.showEventPopUp()}
        onMouseOut={() => this.props.hideEventPopUp()}
      >
        <div className="row item">
          <div
            className="col-md-12 pointer item-heading text-wraper"
            style={{ padding: "5px 5px 0px 5px" }}
            onClick={() => { if (!!eventItemClick) eventItemClick(schedulerData, event) }}
          >
            {/* <i class="fa fa-pencil pull-right" aria-hidden="true"></i> */}
            {titleText}
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(MonthlyEvent);