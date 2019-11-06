import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import Close from "../../assets/images/close.svg";
import DatePicker from "react-datepicker";
import { get } from "../../utils/API";
import { TwitterPicker, Twitter } from "react-color";
import "react-datepicker/dist/react-datepicker.css";
import "react-bootstrap-typeahead/css/Typeahead.css";

class AddProjectModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      members: [],
      suggestions: [],
      selectedTags: [],
      value: ""
    };
  }

  async componentDidMount() {
    try {
      const { data } = await get("logged_in_user");
      var logedInUser = data
    } catch (e) {
      console.log("err", e);
    }

    // workspace Member Listing
    try {
      const { data } = await get(
        `workspaces/${this.props.workspaceId}/members`,
      );
      var membersArr = data.members.filter(user => user.email !== logedInUser.email)
    } catch (e) {
      console.log("users Error", e);
    }
    this.setState({ members: membersArr })
  }

  onSearchTextChange = (e) => {
    const value = e.target.value
    let suggestions = []
    if (value.length > 0) {
      const regex = new RegExp(`^${value}`, 'i');
      suggestions = this.state.members.sort().filter(m => regex.test(m.name) && !(this.state.selectedTags.includes(m)))
    }
    this.setState({ suggestions: suggestions, value: value });
  }

  selectSuggestion = (option) => {
    var newSelectedTags = new Array(...this.state.selectedTags)
    newSelectedTags.push(option)
    var memberIds = newSelectedTags.map(user => user.id)
    this.setState({ selectedTags: newSelectedTags, suggestions: [], value: '' })
    this.props.handleChangeMember(memberIds)
  }

  removeSelectedTag = (index) => {
    var selectedTags = this.state.selectedTags
    selectedTags = selectedTags.filter((_, idx) => idx !== index)
    var memberIds = selectedTags.map(user => user.id)
    this.setState({ selectedTags: selectedTags })
    this.props.handleChangeMember(memberIds)
  }

  renderSearchSuggestion = () => {
    return (
      <>
        {this.state.suggestions ?
          <ul>
            {this.state.suggestions.map((option, idx) => {
              return (
                <li key={idx} onClick={() => this.selectSuggestion(option)}>
                  <span className="right-left-space-5"><span className="text-titlize">{option.name}</span> ({option.email})</span>
                </li>
              )
            })}
          </ul>
          : null}
      </>
    )
  }

  initalChar = (str) => {
    var matches = str.match(/\b(\w)/g);
    return matches.join('').toUpperCase();
  }

  renderSelectedTags = () => {
    return (
      <>
        {
          this.state.selectedTags.map((option, index) => {
            return (
              <div className="select-member" key={index}>
                <div className="member-title d-inline-block">{this.initalChar(option.name)}</div>
                <div className="right-left-space-5 d-inline-block">{option.name}</div>
                <a className="remove-tag right-left-space-5 d-inline-block" onClick={() => this.removeSelectedTag(index)}><i className="fa fa-close"></i></a>
              </div>
            )
          })
        }
      </>
    )
  }

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
            <div className="col-md-12 header">
              <span>Add New Project</span>
              <button
                className="btn btn-link float-right"
                onClick={props.handleClose}
              >
                <img src={Close} alt="close" />
              </button>
            </div>
            <div className="col-md-12 body">
              <div className="col-md-12 no-padding input-row">
                <div className="col-md-2 d-inline-block no-padding label">
                  Name
                  </div>
                <div className="col-md-10 d-inline-block">
                  <input
                    type="text"
                    name="projectName"
                    onChange={props.handleChangeInput}
                    placeholder="Write Project Name here"
                    className="form-control"
                  />
                </div>
              </div>

              <div className="col-md-12 no-padding input-row">
                <div className="col-md-2 d-inline-block no-padding label">
                  Start Date
                  </div>
                <div
                  className="col-md-6 d-inline-block date-picker-container no-padding"
                >
                  <div className="col-md-3 d-inline-block date-text-light"><span>From:</span></div>
                  <div className="col-md-9 d-inline-block">
                    <DatePicker
                      selected={props.state.dateFrom}
                      onChange={props.handleDateFrom}
                      placeholderText="Select Date"
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-12 no-padding input-row">
                <div className="col-md-2 d-inline-block no-padding label">
                  End Date
                  </div>
                <div className="col-md-10 d-inline-block no-padding">
                  <div className="col-md-6 d-inline-block date-picker-container no-padding" style={{ backgroundColor: props.state.disableColor }}>
                    <div className="col-md-3 d-inline-block date-text-light "><span>To:</span></div>
                    <div className="col-md-9 d-inline-block">
                      <DatePicker
                        selected={props.state.dateTo}
                        onChange={props.handleDateTo}
                        placeholderText="Select Date"
                        disabled={props.state.disabledDateTo}
                      />
                    </div>
                  </div>

                  <div className="col-md-6 d-inline-block left-padding-50px custom-control custom-checkbox">
                    <input
                      type="checkbox"
                      className="custom-control-input d-inline-block"
                      id="endDateUndefined"
                      onChange={props.handleUndefinedToDate}
                    />
                    <label
                      className="custom-control-label d-inline-block"
                      htmlFor="endDateUndefined"
                    >Undefined</label>
                  </div>
                </div>
              </div>
              <div className="col-md-12 row no-margin no-padding input-row">
                <div className="col-md-2 no-padding label">Members</div>
                <div className="col-md-10">
                  <div className="project-member-search">
                    <div className="selected-tags text-titlize">
                      {this.renderSelectedTags()}
                    </div>
                    <input type="text" value={this.state.value} placeholder="Write Here" onChange={this.onSearchTextChange} />

                    <div className="suggestion-holder">
                      {this.renderSearchSuggestion()}
                    </div>
                  </div>

                </div>
              </div>
              <div className="col-md-12 row no-margin no-padding input-row">
                <div className="col-md-2 no-padding label">Select Color</div>
                <div className="col-md-10">
                  <button
                    className="btn btn-default btn-color-picker"
                    style={{
                      backgroundColor: `${props.state.background}`,
                    }}
                    onClick={props.handleChangeColor}
                  />
                  {props.state.displayColorPicker ? (
                    <div onClick={props.handleColorPickerClose}>
                      <TwitterPicker
                        color={props.state.background}
                        onChangeComplete={props.handleChangeComplete}
                      >
                        <Twitter colors={props.colors} />
                      </TwitterPicker>
                    </div>
                  ) : null}
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
