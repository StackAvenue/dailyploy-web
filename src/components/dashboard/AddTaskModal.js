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
    };
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.state.taskUser.length == 0 && this.props.state.taskUser.length == 1) {
      var options = this.props.users.filter(u => u.id === this.props.state.taskUser[0])
      this.setState({ selectedMembers: options })
    }
  }

  onClickProjectInput = (e) => {
    if (e.target.value == "") {
      this.setState({ projectSuggestions: this.props.projects });
    }
  }

  selectProject = (option) => {
    this.setState({ project: option, projectSuggestions: [], projectSearchText: '' })
    this.props.handleProjectSelect(option)
  }

  onSearchProjectTextChange = (e) => {
    const value = e.target.value
    let projectSuggestions = []
    if (value.length > 0) {
      const regex = new RegExp(`^${value}`, 'i');
      projectSuggestions = this.props.projects.sort().filter(p => regex.test(p.name) && (this.state.project !== p))
      this.setState({ projectSuggestions: projectSuggestions, projectSearchText: value });
    } else {
      this.setState({ projectSuggestions: this.props.projects, projectSearchText: value });
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
        {this.state.projectSuggestions ?
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
          : null}
      </>
    )
  }

  renderSelectedProject = () => {
    var project = this.props.state.project;
    if (project != "") {
      return (
        <span>
          <span className="d-inline-block task-project-color-code" style={{ backgroundColor: `${project.color_code}` }}></span>
          <span className="d-inline-block right-left-space-5 text-titlize">{project.name}</span>
        </span>
      )
    }
    return null
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
      </>
    )
  }

  renderSelectedMembers = () => {
    return (
      <>
        {
          this.props.state.selectedMembers.map((option, index) => {
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

  onSearchMemberTextChange = (e) => {
    const value = e.target.value
    let membersSuggestions = []
    if (value.length > 0) {
      const regex = new RegExp(`^${value}`, 'i');
      membersSuggestions = this.props.modalMemberSearchOptions.sort().filter(m => regex.test(m.name) && !(this.props.state.selectedMembers.includes(m)))
    } else {
    }
    this.setState({ membersSuggestions: membersSuggestions, memberSearchText: value });
  }

  selectMemebrSuggestion = (option) => {
    var newSelectedMembers = new Array(...this.props.state.selectedMembers)
    newSelectedMembers.push(option)
    // var memberIds = newSelectedMembers.map(user => user.id)
    this.setState({ membersSuggestions: [], memberSearchText: '' })
    this.props.handleMemberSelect(newSelectedMembers)
  }

  initalChar = (str) => {
    var matches = str.match(/\b(\w)/g);
    return matches.join('').toUpperCase();
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
              <span> {props.state.taskButton === "Add" ? "Add New Task" : props.state.taskName}</span>
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
              </div>

              <div className="col-md-12 no-padding input-row">
                <div className="col-md-2 d-inline-block no-padding label">
                  Project
                </div>
                <div className="col-md-10 d-inline-block">
                  <div className="task-project-search">
                    <div>
                      <div className="d-inline-block selected-tags text-titlize">
                        {this.renderSelectedProject()}
                      </div>
                      <input className="d-inline-block"
                        type="text" value={this.state.projectSearchText}
                        placeholder={this.props.state.project ? "" : "Select Project"}
                        onClick={this.onClickProjectInput}
                        onChange={this.onSearchProjectTextChange}
                      />
                      <span className="down-icon"><i className="fa fa-angle-down"></i></span>
                    </div>
                    <div className="suggestion-holder">
                      {this.renderProjectSearchSuggestion()}
                    </div>
                  </div>
                </div>
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
                <div className="col-md-2 d-inline-block no-padding label">
                  Members
                </div>
                <div className="col-md-10 d-inline-block">
                  <div className="project-member-search">
                    <div>
                      <div className="d-inline-block selected-tags text-titlize">
                        {this.renderSelectedMembers()}
                      </div>
                      <input className="d-inline-block"
                        type="text" value={this.state.memberSearchText}
                        placeholder="Select Memebrs"
                        onChange={this.onSearchMemberTextChange}
                      />
                    </div>
                    <div className="suggestion-holder">
                      {this.renderMembersSearchSuggestion()}
                    </div>
                  </div>
                </div>
              </div>


              <div className="col-md-12 no-padding input-row">
                <div className="col-md-2 d-inline-block no-padding label">
                  Duration
                </div>
                <div className="col-md-10 d-inline-block no-padding">
                  <div className="col-md-12 d-inline-block no-padding">
                    <div className="col-md-6 d-inline-block date-picker-container no-padding">
                      <div className="col-md-3 d-inline-block date-text-light"><span>From:</span></div>
                      <div className="col-md-9 d-inline-block">
                        <DatePicker
                          selected={props.state.dateFrom}
                          onChange={props.handleDateFrom}
                          placeholderText="Select Date"
                        />
                      </div>
                    </div>
                    <div className="col-md-6 d-inline-block date-picker-container no-padding">
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
                  </div>
                </div>
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
                          // value={moment(props.state.dateFrom)}
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
                          // value={moment(props.state.dateTo).format("HH:mm")}
                          placeholder="Select"
                          showSecond={false}
                          onChange={props.handleTimeTo}
                          format={props.format}
                        />
                      </div>
                    </div>
                  </div>
                </div>
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
