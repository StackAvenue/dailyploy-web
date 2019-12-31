import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import Close from "../../assets/images/close.svg";
import DatePicker from "react-datepicker";
import { get } from "../../utils/API";
import { TwitterPicker, ChromePicker } from "react-color";
import cookie from "react-cookies";
import DailyPloyMultiSelect from "./../DailyPloyMultiSelect";
import "react-datepicker/dist/react-datepicker.css";
import "react-bootstrap-typeahead/css/Typeahead.css";

class AddProjectModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      members: [],
      displayColorPicker: false,
      displayCustomColorPicker: false,
      background: "#b9e1ff"
    };
  }

  async componentDidMount() {
    var logedInUser = cookie.load("loggedInUser");
    if (!logedInUser) {
      try {
        const { data } = await get("logged_in_user");
        var logedInUser = data;
      } catch (e) {
        console.log("err", e);
      }
    }

    // workspace Member Listing
    try {
      const { data } = await get(
        `workspaces/${this.props.workspaceId}/members`
      );
      // var membersArr = data.members.filter(
      //   user => user.email !== logedInUser.email
      // );
      var membersArr = data.members;
    } catch (e) {
      console.log("users Error", e);
    }
    this.setState({ members: membersArr });
  }

  handleChangeColor = () => {
    if (this.state.displayCustomColorPicker) {
      this.setState({
        displayColorPicker: !this.state.displayColorPicker,
        displayCustomColorPicker: !this.state.displayCustomColorPicker
      });
    } else {
      this.setState({
        displayColorPicker: !this.state.displayColorPicker
      });
    }
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (
      prevState.displayColorPicker == false &&
      this.state.displayColorPicker == true
    ) {
      var twitterPicker = document.querySelector(".twitter-picker");
      var parentDiv = twitterPicker.getElementsByTagName("div")[2];
      parentDiv.className += "custom-cp-style";
      parentDiv.childNodes[8].className += "hide-div";
      parentDiv.childNodes[9].className += "hide-div";
      var btn = document.createElement("span");
      var icon = document.createElement("i");
      icon.setAttribute("class", "fa fa-plus");
      icon.addEventListener("click", this.setColorPicker);
      btn.appendChild(icon);
      parentDiv.append(btn);
    }
  };

  setColorPicker = () => {
    this.setState({
      displayCustomColorPicker: !this.state.displayCustomColorPicker
    });
  };

  handleChangeComplete = (color, event) => {
    this.setState({ background: color });
    this.handleChangeColor();
    this.props.handleChangeComplete(color, event);
  };

  render() {
    const { props } = this;

    return (
      <>
        <Modal
          className="project-modal"
          show={props.state.show}
          onHide={props.handleClose}
        >
          <div className="row no-margin">
            <div className="col-md-12 header text-titlize">
              <span>{props.headText}</span>
              <button
                className="btn btn-link float-right"
                onClick={props.handleClose}
              >
                <img src={Close} alt="close" />
              </button>
            </div>
            <div className="col-md-12 body">
              <div
                className={`col-md-12 no-padding input-row ${props.ownerClassName}`}
              >
                <div className="col-md-2 d-inline-block no-padding label">
                  Owner Name
                </div>
                <div className="col-md-10 d-inline-block text-titlize">
                  {props.state.projectOwner}
                </div>
              </div>

              <div className="col-md-12 no-padding input-row">
                <div className="col-md-2 d-inline-block no-padding label">
                  Name
                </div>
                <div className="col-md-10 d-inline-block">
                  <input
                    type="text"
                    name="projectName"
                    onChange={props.handleChangeInput}
                    placeholder="Project Name..."
                    className="form-control"
                    value={props.state.projectName}
                  />
                </div>
              </div>

              <div className="col-md-12 no-padding input-row">
                <div className="col-md-2 d-inline-block no-padding label">
                  Start Date
                </div>
                <div className="col-md-10 d-inline-block">
                  <div className="d-inline-block date-text-light">
                    <span>From:</span>
                  </div>
                  <div className="d-inline-block calender-icon">
                    <DatePicker
                      selected={props.state.dateFrom}
                      onChange={props.handleDateFrom}
                      placeholderText="Select Date"
                      value={props.state.dateFrom}
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-12 no-padding input-row">
                <div className="col-md-2 d-inline-block no-padding label">
                  End Date
                </div>
                <div className="col-md-10 d-inline-block no-padding">
                  <div
                    className="col-md-8 d-inline-block"
                    onClick={this.toggleDateTo}
                  >
                    <div className="d-inline-block date-text-light">
                      <span>To:</span>
                    </div>
                    <div className="d-inline-block calender-icon">
                      <DatePicker
                        style={{ backgroundColor: props.state.disableColor }}
                        minDate={props.state.dateFrom}
                        selected={props.state.dateTo}
                        onChange={props.handleDateTo}
                        placeholderText="Select Date"
                        disabled={props.state.disabledDateTo}
                        value={props.state.dateTo}
                      />
                    </div>
                  </div>

                  <div className="col-md-4 d-inline-block custom-control custom-checkbox no-padding">
                    <input
                      type="checkbox"
                      className="custom-control-input d-inline-block"
                      id="endDateUndefined"
                      checked={props.state.disabledDateTo ? true : false}
                      onChange={props.handleUndefinedToDate}
                    />
                    <label
                      className="custom-control-label d-inline-block"
                      htmlFor="endDateUndefined"
                    >
                      Undefined
                    </label>
                  </div>
                </div>
              </div>
              <div className="col-md-12 no-padding input-row">
                <div className="col-md-2 d-inline-block no-padding label">
                  Budget
                </div>
                <div
                  className="col-md-5 d-inline-block"
                  style={{ maxWidth: "240px" }}
                >
                  <input
                    type="text"
                    placeholder="Enter amount"
                    className="form-control"
                  />
                </div>
              </div>
              <div className="col-md-12 row no-margin no-padding input-row">
                <div className="col-md-2 no-padding label">Select Color</div>
                <div className="col-md-10">
                  <button
                    className="btn btn-default btn-color-picker"
                    style={{
                      backgroundColor: `${props.state.background}`
                    }}
                    onClick={this.handleChangeColor}
                  />
                  {this.state.displayColorPicker ? (
                    <div onClick={this.handleColorPickerClose}>
                      <TwitterPicker
                        color={props.state.background}
                        colors={props.colors}
                        onChangeComplete={this.handleChangeComplete}
                        value={props.state.background}
                      ></TwitterPicker>
                    </div>
                  ) : null}
                  {this.state.displayCustomColorPicker ? (
                    <div
                      className="custom-color-picker"
                      onClick={this.setColorPicker}
                    >
                      <ChromePicker
                        color={this.state.background}
                        onChangeComplete={this.handleChangeComplete}
                      ></ChromePicker>
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="col-md-12 row no-margin no-padding input-row">
                <div className="col-md-2 no-padding label">Members</div>
                <div className="col-md-10">
                  <DailyPloyMultiSelect
                    options={this.state.members}
                    searchBy="name"
                    defaultSelected={this.props.state.selectedTags}
                    selectedIcon="initial"
                    onChange={this.props.handleChangeMember}
                  />
                </div>
              </div>

              <div className="col-md-12 no-padding input-row">
                <div className="col-md-5 ml-auto">
                  <button
                    type="button"
                    className="btn col-md-5 button1 btn-primary"
                    onClick={props.addProject}
                  >
                    {props.btnText}
                  </button>
                  <button
                    type="button"
                    className="btn col-md-6 button2 btn-primary"
                    onClick={props.handleClose}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </>
    );
  }
}

export default AddProjectModal;
