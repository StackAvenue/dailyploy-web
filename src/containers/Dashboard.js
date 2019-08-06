import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { get, post, logout } from "../utils/API";
import { Modal } from "react-bootstrap";
import moment from "moment";
import Header from "../components/dashboard/Header";
import Close from "../assets/images/close.svg";
import Footer from "../components/Footer";
import "../assets/css/dashboard.scss";
import MenuBar from "../components/dashboard/MenuBar";
import Calendar from "../components/dashboard/Calendar";
import cookie from "react-cookies";
import { ToastContainer, toast } from "react-toastify";
import DatePicker from "react-datepicker";
import TimePicker from "rc-time-picker";
import "rc-time-picker/assets/index.css";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.format = "h:mm a";
    this.now = moment()
      .hour(0)
      .minute(0);
    this.project = ["DailyPloy", "Screen Magic", "Deal Signal", "Sms Magic"];
    this.user = [
      "Arpit Jain",
      "Alam",
      "Kiran",
      "Vikram",
      "siddhanth",
      "Akshay"
    ];
    this.state = {
      taskName: "",
      projectName: "",
      taskUser: "",
      sort: "week",
      show: false,
      setShow: false,
      dateFrom: new Date(),
      dateTo: new Date(),
      timeFrom: "",
      timeTo: "",
      comments: "",
      userId: ""
    };
  }
  async componentDidMount() {
    this.auth();
    try {
      const { data } = await get("user");
      this.setState({ userId: data.id });
    } catch (e) {
      console.log("err", e);
    }
  }

  auth = () => {
    const token = cookie.load("authToken");
    if (token !== "undefined") {
      return this.props.history.push("/dashboard");
    } else {
      return this.props.history.push("/login");
    }
  };

  addTask = async () => {
    const taskData = {
      task_name: this.state.taskName,
      task_project_name: this.state.projectName,
      task_user: this.state.taskUser,
      task_date_from: this.state.dateFrom,
      task_date_to: this.state.dateTo,
      task_time_from: this.state.timeFrom,
      task_time_to: this.state.timeTo,
      task_comments: this.state.comments
    };
    try {
      const { data } = await post(taskData, "task");
      toast.success("Task Assigned");
      console.log("Task Data", data);
    } catch (e) {
      console.log("error", e.response);
    }
  };

  onSelectSort = value => {
    console.log("selected value ", value);
    this.setState({ sort: value });
  };

  logout = async () => {
    await logout();
    this.props.history.push("/login");
  };

  showTaskModal = () => {
    this.setState({
      setShow: true,
      show: true
    });
  };

  closeTaskModal = () => {
    this.setState({
      show: false
    });
  };

  handleDateFrom = date => {
    this.setState({ dateFrom: date });
  };
  handleDateTo = date => {
    this.setState({ dateTo: date });
  };

  handleTimeFrom = value => {
    this.setState({
      timeFrom: value
    });
  };

  handleTimeTo = value => {
    this.setState({
      timeTo: value
    });
  };

  handleInputChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  render() {
    console.log(this.state.userId);
    return (
      <>
        <ToastContainer position={toast.POSITION.TOP_RIGHT} />
        <Header logout={this.logout} />
        <MenuBar onSelectSort={this.onSelectSort} />
        <Calendar sortUnit={this.state.sort} />
        <div>
          <button className="btn menubar-task-btn" onClick={this.showTaskModal}>
            <i class="fas fa-plus" />
          </button>
          <Modal
            className="project-modal"
            show={this.state.show}
            onHide={this.closeTaskModal}
          >
            <div className="row no-margin">
              <div className="col-md-12 header">
                <span>Add New Task</span>
                <button
                  className="btn btn-link float-right"
                  onClick={this.closeTaskModal}
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
                      value={this.state.taskName}
                      onChange={this.handleInputChange}
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
                    <select
                      name="projectName"
                      value={this.state.projectName}
                      onChange={this.handleInputChange}
                      className="form-control"
                    >
                      <option>Select Project...</option>
                      {this.project.map(project => {
                        return <option value={project}>{project}</option>;
                      })}
                    </select>
                  </div>
                </div>
                <div className="col-md-12 no-padding input-row">
                  <div className="col-md-2 d-inline-block no-padding label">
                    Users
                  </div>
                  <div className="col-md-10 d-inline-block">
                    <select
                      name="taskUser"
                      value={this.state.taskUser}
                      onChange={this.handleInputChange}
                      className="form-control"
                    >
                      <option>Select Users...</option>
                      {this.user.map(user => {
                        return <option value={user}>{user}</option>;
                      })}
                    </select>
                  </div>
                </div>
                <div className="col-md-12 no-padding input-row">
                  <div className="col-md-2 d-inline-block no-padding label">
                    Date
                  </div>
                  <div className="col-md-10 d-inline-block">
                    <div
                      className="col-md-6 d-inline-block"
                      style={{ "padding-left": "0" }}
                    >
                      <DatePicker
                        selected={this.state.dateFrom}
                        onChange={this.handleDateFrom}
                      />
                    </div>
                    <div
                      className="col-md-6 d-inline-block"
                      style={{ "padding-right": "0" }}
                    >
                      <DatePicker
                        selected={this.state.dateTo}
                        onChange={this.handleDateTo}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-12 no-padding input-row">
                  <div className="col-md-2 d-inline-block no-padding label">
                    Time
                  </div>
                  <div className="col-md-10 d-inline-block">
                    <div
                      className="col-md-4 d-inline-block"
                      style={{ "padding-left": "0" }}
                    >
                      <TimePicker
                        placeholder="Time From"
                        showSecond={false}
                        className="xxx"
                        onChange={this.handleTimeFrom}
                        format={this.format}
                        use12Hours
                        inputReadOnly
                      />
                    </div>
                    <div
                      className="col-md-4 d-inline-block"
                      style={{ "padding-right": "0" }}
                    >
                      <TimePicker
                        placeholder="Time To"
                        showSecond={false}
                        className="xxx"
                        onChange={this.handleTimeTo}
                        format={this.format}
                        use12Hours
                        inputReadOnly
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-12 row no-margin no-padding input-row">
                  <div className="col-md-2 no-padding label">Comments</div>
                  <div className="col-md-10">
                    <textarea
                      name="comments"
                      value={this.state.comments}
                      onChange={this.handleInputChange}
                      class="form-control"
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
                      onClick={this.addTask}
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      className="btn col-md-6 button2 btn-primary"
                      onClick={this.closeTaskModal}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Modal>
        </div>

        {/* <Footer />  */}
      </>
    );
  }
}

export default withRouter(Dashboard);
