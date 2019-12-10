import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import DatePicker from "react-datepicker";
import TimePicker from "rc-time-picker";
import "rc-time-picker/assets/index.css";
import "react-datepicker/dist/react-datepicker.css";
import Close from "../../assets/images/close.svg";
import moment from "moment";

class AddTaskModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      members: [],
      project: "",
      showProjectSuggestion: false,
      projectSuggestions: [],
      membersSuggestions: [],
      selectedMembers: [],
      projectSearchText: "",
      memberSearchText: "",
      isBorder: false,
      border: "solid 1px #d1d1d1",
      notFound: "hide",
      memberNotFound: "hide",
      fromDateOpen: false,
      toDateOpen: false,
    };
  }

  onClickProjectInput = (e) => {
    if (e.target.value == "") {
      if (this.state.canBack === false) {
        this.setState({ projectSuggestions: this.props.projects, canBack: true });
      } else {
        this.setState({ projectSuggestions: this.props.projects });
      }
      this.props.managesuggestionBorder()
    }
  }

  selectProject = (option) => {
    this.setState({ project: option, projectSuggestions: [], projectSearchText: '', canBack: false })
    this.props.handleProjectSelect(option)
  }

  onSearchProjectTextChange = (e) => {
    const value = e.target.value
    let projectSuggestions = []
    if (value.length > 0) {
      const regex = new RegExp(`^${value}`, 'i');
      projectSuggestions = this.props.projects.sort().filter(p => regex.test(p.name) && (this.state.project !== p))
      this.setState({
        projectSuggestions: projectSuggestions,
        projectSearchText: value,
        notFound: projectSuggestions.length > 0 ? "hide" : "show",
        canBack: false
      });
    } else {
      this.setState({
        projectSuggestions: this.props.projects,
        projectSearchText: value,
        notFound: "hide",
        canBack: false
      });
    }
  }

  handleBackSpace = (event) => {
    if (event.keyCode === 8 && this.state.projectSearchText.length === 0) {
      this.setState({
        canBack: true
      })
    }

  }

  componentDidUpdate = (prevProps, prevState) => {
    if (prevState.canBack && this.state.canBack && this.state.project) {
      this.setState({ project: "", projectSuggestions: this.props.projects, projectSearchText: '' })
      this.props.handleProjectBackspace()
    }
  }

  removeSelectedTag = (index) => {
    var selectedMembers = this.props.state.selectedMembers
    selectedMembers = selectedMembers.filter((_, idx) => idx !== index)
    // var memberIds = selectedMembers.map(user => user.id)
    // this.setState({ selectedMembers: selectedMembers })
    this.props.handleMemberSelect(selectedMembers)
  }

  renderProjectSearchSuggestion = () => {
    return (
      <>
        {this.state.projectSuggestions.length > 0 ?
          <ul>
            {this.state.projectSuggestions.map((option, idx) => {
              return (
                <li key={idx} onClick={() => this.selectProject(option)}>
                  <div className="d-inline-block task-project-color-code" style={{ backgroundColor: `${option.color_code}` }}></div>
                  <span className="d-inline-block right-left-space-5 text-titlize">{option.name}</span>
                </li>
              )
            })}
          </ul>
          : null
        }
        < span className={`text-titlize left-padding-20px  ${this.state.notFound}`} >No Match Found</span>
      </>
    )
  }

  renderMembersSearchSuggestion = () => {
    return (
      <>
        {this.state.membersSuggestions ?
          <ul>
            {this.state.membersSuggestions.map((option, idx) => {
              return (
                <li key={idx} onClick={() => this.selectMemebrSuggestion(option)}>
                  <span className="right-left-space-5">
                    <span className="text-titlize">
                      {option.name}
                    </span>
                    ({option.email})
                  </span>
                </li>
              )
            })}
          </ul>
          : null}
        < span className={`text-titlize left-padding-20px  ${this.state.memberNotFound}`} >No Match Found</span>
      </>
    )
  }

  renderSelectedMembers = () => {
    const state = this.props.state
    return (
      <>
        {
          this.props.state.selectedMembers.map((option, index) => {
            return (
              <div className="select-member" key={index}>
                <div className="member-title d-inline-block">{this.initalChar(option.name)}</div>
                <div className="right-left-space-5 d-inline-block">{option.name}</div>
                <a
                  className="right-left-space-5 d-inline-block"
                  onClick={() => this.removeSelectedTag(index)}
                >
                  {state.taskButton === 'Save' && state.user.role !== 'admin' ? this.placeCloseIcon(option, state) : (state.taskButton === 'Add' && state.user.role === 'member' ? "" : <i className="fa fa-close "></i>)}
                </a>
              </div>
            )
          })
        }
      </>
    )
  }

  placeCloseIcon = (option, state) => {
    if (state.userId === option.id) {
      return <i className="fa fa-close"></i>
    }
  }

  onSearchMemberTextChange = (e) => {
    const value = e.target.value
    let membersSuggestions = []
    var memberNotFound = "hide"
    if (value.length > 0) {
      const regex = new RegExp(`^${value}`, 'i');
      var selectedMemberIds = this.props.state.selectedMembers.map(member => member.id)
      var options = this.props.modalMemberSearchOptions.filter(member => !selectedMemberIds.includes(member.id))
      membersSuggestions = options.sort().filter(m => regex.test(m.name))
      memberNotFound = membersSuggestions.length > 0 ? "hide" : "show";
    } else {
    }
    this.setState({ membersSuggestions: membersSuggestions, memberSearchText: value, memberNotFound: memberNotFound });
  }

  selectMemebrSuggestion = (option) => {
    var newSelectedMembers = new Array(...this.props.state.selectedMembers)
    newSelectedMembers.push(option)
    this.setState({ membersSuggestions: [], memberSearchText: '' })
    this.props.handleMemberSelect(newSelectedMembers)
  }

  initalChar = (str) => {
    var matches = str.match(/\b(\w)/g);
    return matches.join('').toUpperCase();
  }

  disabledHours = () => {
    var time = this.props.state.timeFrom
    if (time) {
      var hr = time.split(':')[0]
      hr = Number(hr)
      var hoursArr = Array.from({ length: `${hr}` }, (v, k) => k)
      return hoursArr
    }
    return []
  }

  disabledMinutes = () => {
    var time = this.props.state.timeFrom
    if (time) {
      var min = time.split(':')[1]
      min = Number(min) + 1
      var minArr = Array.from({ length: `${min}` }, (v, k) => k)
      return minArr
    }
    return []
  }

  toggleDateFromPicker = () => {
    this.setState({ fromDateOpen: !this.state.fromDateOpen, toDateOpen: false })
  }

  toggleDateToPicker = () => {
    this.setState({ toDateOpen: !this.state.toDateOpen, fromDateOpen: false })
  }

  render() {
    const { props } = this
    return (
      <>
        <Modal
          className="task-modal"
          show={props.show}
          onHide={props.closeTaskModal}
          style={{ paddingTop: "2.5%" }}
        >
          <div className="row no-margin">
            <div className="col-md-12 header text-titlize">
              <div className={`d-inline-block ${props.state.taskButton === "Add" ? "" : "taskedit-u-line"}`}>
                <span> {props.state.taskButton === "Add" ? "Add New Task" : props.state.taskName}</span>
              </div>
              <button
                className="btn btn-link float-right"
                onClick={props.closeTaskModal}
              >
                <img src={Close} alt="close" />
              </button>
            </div>
            <div className="col-md-12 body">
              <div className="col-md-12 no-padding input-row">
                <div className="col-md-2 d-inline-block no-padding label">
                  Task
                </div>
                <div className="col-md-10 d-inline-block">
                  <input
                    type="text"
                    name="taskName"
                    value={props.state.taskName}
                    onChange={props.handleInputChange}
                    placeholder="Task name..."
                    className="form-control"
                  />
                </div>

                {this.props.state.errors.taskNameError ? (
                  <div className="col-md-12">
                    <div className="col-md-2 d-inline-block no-padding">
                    </div>
                    <div className="col-md- d-inline-block no-padding">
                      <span className="error-warning">
                        {this.props.state.errors.taskNameError}
                      </span>
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="col-md-12 no-padding input-row">
                <div className="col-md-2 d-inline-block no-padding label">
                  Project
                </div>
                <div className="col-md-10 d-inline-block">
                  <div className="task-project-search" style={{ backgroundColor: props.state.taskButton == "Save" ? "#e9e9e9" : "" }}>
                    <div>
                      <div className="d-inline-block selected-tags text-titlize">
                        {this.props.renderSelectedProject()}
                      </div>
                      <input className="d-inline-block"
                        type="text" value={this.state.projectSearchText}
                        placeholder={`${this.props.state.project ? "" : "Select Project"}`}
                        onClick={this.onClickProjectInput}
                        onChange={this.onSearchProjectTextChange}
                        disabled={props.state.taskButton == "Save" ? true : false}
                        onKeyUp={this.handleBackSpace}
                      />
                      <span className="down-icon"><i className="fa fa-angle-down"></i></span>
                    </div>
                    <div className="suggestion-holder" style={{ border: `${this.props.state.isBorder ? this.state.border : ""}` }}>
                      {this.renderProjectSearchSuggestion()}
                    </div>
                  </div>
                </div>
                {this.props.state.errors.projectError ? (
                  <div className="col-md-12">
                    <div className="col-md-2 d-inline-block no-padding">
                    </div>
                    <div className="col-md-10 d-inline-block no-padding">
                      <span className="error-warning">
                        {this.props.state.errors.projectError}
                      </span>
                    </div>
                  </div>
                ) : null}
              </div>

              {/* <div className="col-md-12 no-padding input-row">
                <div className="col-md-2 d-inline-block no-padding label">
                  Category
                </div>
                <div className="col-md-10 d-inline-block">
                  <select className="">
                    <option></option>
                    <option></option>
                    <option></option>
                    <option></option>
                    <option></option>
                  </select>
                </div>
              </div> */}

              <div className="col-md-12 no-padding input-row">
                <div className="col-md-2 d-inline-block no-padding label" style={{ verticalAlign: "top" }}>
                  Members
                </div>
                <div className="col-md-10 d-inline-block">
                  <div className="project-member-search" style={{ backgroundColor: props.state.taskButton == "Add" && props.state.user.role == 'member' ? "rgb(235, 235, 235)" : "" }}>
                    <div>
                      <div className="d-inline-block selected-tags text-titlize">
                        {this.renderSelectedMembers()}
                      </div>
                      <input className="d-inline-block"
                        type="text" value={this.state.memberSearchText}
                        placeholder="Select Memebrs"
                        disabled={props.state.taskButton == "Add" && props.state.user.role == 'member' ? true : false}
                        onChange={this.onSearchMemberTextChange}
                      />
                    </div>
                    <div className="suggestion-holder">
                      {this.renderMembersSearchSuggestion()}
                    </div>
                  </div>
                </div>
                {this.props.state.errors.memberError ? (
                  <div className="col-md-12">
                    <div className="col-md-2 d-inline-block no-padding">
                    </div>
                    <div className="col-md- d-inline-block no-padding">
                      <span className="error-warning">
                        {this.props.state.errors.memberError}
                      </span>
                    </div>
                  </div>
                ) : null}
              </div>


              <div className="col-md-12 no-padding input-row">
                <div className="col-md-2 d-inline-block no-padding label">
                  Duration
                </div>
                <div className="col-md-10 d-inline-block no-padding">
                  <div className="col-md-12 d-inline-block no-padding">
                    <div className="col-md-6 d-inline-block date-picker-container no-padding"
                      onClick={this.toggleDateFromPicker}
                    >
                      <div className="col-md-3 d-inline-block date-text-light"><span>From:</span></div>
                      <div className="col-md-9 d-inline-block">
                        <DatePicker
                          selected={props.state.dateFrom}
                          onChange={props.handleDateFrom}
                          maxDate={props.state.dateTo}
                          placeholderText="Select Date"
                          open={this.state.fromDateOpen}
                        />
                      </div>
                    </div>
                    <div className="col-md-6 d-inline-block date-picker-container no-padding"
                      onClick={this.toggleDateToPicker}
                    >
                      <div className="col-md-3 d-inline-block date-text-light "><span>To:</span></div>
                      <div className="col-md-9 d-inline-block">
                        <DatePicker
                          minDate={props.state.dateFrom}
                          selected={props.state.dateTo}
                          onChange={props.handleDateTo}
                          placeholderText="Select Date"
                          disabled={props.state.disabledDateTo}
                          open={this.state.toDateOpen}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {this.props.state.errors.dateFromError || this.props.state.errors.dateToError ? (
                  <div className="col-md-12">
                    <div className="col-md-2 d-inline-block no-padding">
                    </div>
                    <div className="col-md-5 d-inline-block no-padding">
                      <span className="error-warning">
                        {this.props.state.errors.dateFromError}
                      </span>
                    </div>
                    <div className="col-md-5 d-inline-block no-padding">
                      <span className="error-warning">
                        {this.props.state.errors.dateToError}
                      </span>
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="col-md-12 no-padding input-row">
                <div className="col-md-2 d-inline-block no-padding label">
                  Time
                </div>
                <div className="col-md-10 d-inline-block no-padding">
                  <div className="col-md-12 d-inline-block no-padding">

                    <div className="col-md-4 d-inline-block time-picker-container no-padding">
                      <div className="col-md-3 d-inline-block date-text-light"><span>From:</span></div>
                      <div className="col-md-9 d-inline-block" style={{ paddingRight: "0" }}>
                        <TimePicker
                          placeholder="Select"
                          value={this.props.state.timeDateFrom}
                          showSecond={false}
                          onChange={props.handleTimeFrom}
                          format={props.format}
                        />
                      </div>
                    </div>
                    <div className="col-md-4 d-inline-block time-picker-container no-padding">
                      <div className="col-md-3 d-inline-block date-text-light "><span>To:</span></div>
                      <div className="col-md-9 d-inline-block" style={{ paddingRight: "0" }}>
                        <TimePicker
                          value={this.props.state.timeDateTo}
                          placeholder="Select"
                          showSecond={false}
                          onChange={props.handleTimeTo}
                          disabledMinutes={this.disabledMinutes}
                          disabledHours={this.disabledHours}
                          format={props.format}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {this.props.state.errors.timeFromError || this.props.state.errors.timeToError ? (
                  <div className="col-md-12 d-inline-block no-padding">
                    <div className="col-md-2 d-inline-block no-padding"></div>
                    <div className="col-md-4 d-inline-block no-padding">
                      <span className="error-warning">
                        {this.props.state.errors.timeFromError}
                      </span>
                    </div>
                    <div className="col-md-4 d-inline-block no-padding">
                      <span className="error-warning">
                        {this.props.state.errors.timeToError}
                      </span>
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="col-md-12 row no-margin no-padding input-row">
                <div className="col-md-2 no-padding label">Comments</div>
                <div className="col-md-10">
                  <textarea
                    name="comments"
                    value={props.state.comments}
                    onChange={props.handleInputChange}
                    className="form-control"
                    rows="3"
                    placeholder="Write Here"
                  />
                </div>
              </div>

              <div className="col-md-12 no-padding input-row">
                <div className="col-md-4 ml-auto">
                  <button
                    type="button"
                    className="btn col-md-5 button1 btn-primary"
                    onClick={props.state.taskButton === "Add" ? props.addTask : props.editTask}
                  >
                    {props.state.taskButton}
                  </button>
                  <button
                    type="button"
                    className="btn col-md-6 button2 btn-primary"
                    onClick={props.closeTaskModal}
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
};

export default AddTaskModal;
