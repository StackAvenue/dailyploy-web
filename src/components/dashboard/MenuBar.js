import React, { Component } from "react";
import "../../assets/css/dashboard.scss";
import { Dropdown, Modal } from "react-bootstrap";
import Add from "../../assets/images/add.svg";
import Close from "../../assets/images/close.svg";
import DatePicker from "react-datepicker";
import { Typeahead } from "react-bootstrap-typeahead";
import { TwitterPicker, Twitter } from "react-color";
import "react-datepicker/dist/react-datepicker.css";
import "react-bootstrap-typeahead/css/Typeahead.css";

export default class MenuBar extends Component {
  constructor(props) {
    super(props);
    this.sortValues = [
      {
        content: "Daily",
        value: "day"
      },
      {
        content: "Weekly",
        value: "week"
      },
      {
        content: "Monthly",
        value: "month"
      }
    ];
    this.emailOptions = [
      "arpit@stack-avenue.com",
      "alam@stack-avenue.com",
      "vikram@stack-avenue.com",
      "kiran@stack-avenue.com",
      "siddhanth@stack-avenue.com",
      "akshay@stack-avenue.com"
    ];
    this.colors = [
      "#FF6900",
      "#FCB900",
      "#7BDCB5",
      "#00D084",
      "#8ED1FC",
      "#0693E3",
      "#ABB8C3",
      "#EB144C",
      "#F78DA7",
      "#9900EF"
    ];
    this.state = {
      sort: "week",
      show: false,
      setShow: false,
      dateFrom: new Date(),
      dateTo: new Date(),
      multiEmail: true,
      background: "#fff"
    };
  }

  sortHandler = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value }, console.log(this.state.sort));
    this.props.onSelectSort(value);
  };

  handleDateFrom = date => {
    this.setState({ dateFrom: date });
  };
  handleDateTo = date => {
    this.setState({ dateTo: date });
  };

  handleClose = () => {
    this.setState({
      show: false
    });
  };
  handleShow = () => {
    this.setState({
      setShow: true,
      show: true
    });
  };

  handleChangeComplete = (color, event) => {
    this.setState({ background: color.hex });
  };

  render() {
    const { sort, show } = this.state;
    console.log("Child render", this.state.sort);
    return (
      <>
        <div className="container-fluid">
          <div className="dashboard-container">
            <div className="row no-margin dashboard-menubar-container">
              <div className="col-md-1 home">Home</div>
              <div className="col-md-1 analysis">Analysis</div>
              <div className="col-md-8 no-padding ml-auto">
                <div className="col-md-2 d-inline-block">
                  <Dropdown>
                    <Dropdown.Toggle
                      className="menubar-button"
                      id="dropdown-basic"
                    >
                      <img src={Add} alt="add" />
                      &nbsp;Add
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="dropdownMenu">
                      <Dropdown.Item onClick={this.handleShow}>
                        Project
                      </Dropdown.Item>
                      <Modal
                        className="project-modal"
                        show={show}
                        onHide={this.handleClose}
                      >
                        <div className="row no-margin">
                          <div className="col-md-12 header">
                            <span>Add New Project</span>
                            <button
                              className="btn btn-link float-right"
                              onClick={this.handleClose}
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
                                  placeholder="Write Project Name here"
                                  className="form-control"
                                />
                              </div>
                            </div>
                            <div className="col-md-12 no-padding input-row">
                              <div className="col-md-2 d-inline-block no-padding label">
                                Duration
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
                                Members
                              </div>
                              <div className="col-md-10 d-inline-block">
                                <Typeahead
                                  labelKey="name"
                                  multiple={this.state.multiEmail}
                                  options={this.emailOptions}
                                  placeholder="Write Here"
                                />
                              </div>
                            </div>
                            <div className="col-md-12 no-padding input-row">
                              <div className="col-md-2 d-inline-block no-padding label">
                                Select Color
                              </div>
                              <div className="col-md-10 d-inline-block">
                                <TwitterPicker
                                  color={this.state.background}
                                  onChangeComplete={this.handleChangeComplete}
                                >
                                  <Twitter colors={this.colors} />
                                </TwitterPicker>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Modal>
                      <Dropdown.Item>People</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
                <div className="col-md-8 d-inline-block sort-bar no-padding">
                  <div className="col-md-2 no-padding d-inline-block">
                    <select class="form-control select-bar">
                      <option value="project">Project</option>
                      <option value="user">User</option>
                    </select>
                  </div>
                  <div className="col-md-9 no-padding d-inline-block">
                    <input
                      type="text"
                      placeholder="Search Here"
                      className="form-control"
                    />
                  </div>
                </div>
                <div className="col-md-2 d-inline-block weekly-sort">
                  <select
                    name="sort"
                    class="form-control"
                    value={sort}
                    onChange={this.sortHandler}
                  >
                    {this.sortValues.map(item => {
                      return <option value={item.value}>{item.content}</option>;
                    })}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
