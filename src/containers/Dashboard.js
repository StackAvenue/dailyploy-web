import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { logout } from "../utils/API";
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

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.format = "h:mm a";
    this.now = moment()
      .hour(0)
      .minute(0);
    this.state = {
      sort: "week",
      show: false,
      setShow: false,
      dateFrom: new Date(),
      dateTo: new Date(),
      timeFrom: "",
      timeTo: ""
    };
  }
  componentDidMount() {
    const token = cookie.load("authToken");
    if (token !== "undefined") {
      return this.props.history.push("/dashboard");
    } else {
      return null;
    }
  }

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

  render() {
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
                      name="projectName"
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
                    <select className="form-control">
                      <option>Select Project...</option>
                      <option>Dailyploy</option>
                      <option>Dailyploy</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-12 no-padding input-row">
                  <div className="col-md-2 d-inline-block no-padding label">
                    Users
                  </div>
                  <div className="col-md-10 d-inline-block">
                    <select className="form-control">
                      <option>Select Users...</option>
                      <option>Arpit jain </option>
                      <option>Naman</option>
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
