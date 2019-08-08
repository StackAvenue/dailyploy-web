import React, { Component } from "react";
import "../../assets/css/dashboard.scss";
import { Dropdown, Modal } from "react-bootstrap";
import Add from "../../assets/images/add.svg";
import { get, post } from "../../utils/API";
import { toast } from "react-toastify";
import AddProjectModal from "./AddProjectModal";

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
      projectName: "",
      projectMembers: [],
      sort: "week",
      show: false,
      setShow: false,
      dateFrom: new Date(),
      dateTo: new Date(),
      multiEmail: true,
      background: "#000",
      displayColorPicker: false,
      emailOptions: [
        "alam@gmail.com",
        "arpit@gmail.com",
        "kiran@gmail.com",
        "vikram@gmail.com"
      ]
    };
  }

  async componentDidMount() {
    try {
      const { data } = await get("users");
      const emailArr = data.user.map(user => user.email);
      this.setState({ emailOptions: emailArr });
    } catch (e) {
      console.log("users Error", e);
    }
  }

  addProject = async () => {
    const projectData = {
      project: {
        name: this.state.projectName,
        start_date: this.state.dateFrom,
        end_date: this.state.dateTo,
        members: this.state.projectMembers,
        color: this.state.background
      }
    };
    try {
      const { data } = await post(
        projectData,
        `workspaces/${this.props.workspaceId}/projects`
      );
      toast.success("Project Created");
      this.setState({ show: false });
      console.log("projectData", data);
    } catch (e) {
      console.log("project error", e.response);
      this.setState({ show: false });
    }
  };

  handleChangeMember = selected => {
    this.setState({ projectMembers: selected });
  };

  sortHandler = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
    this.props.onSelectSort(value);
  };

  handleChangeInput = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
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

  handleChangeColor = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker });
  };

  handleColorPickerClose = () => {
    this.setState({ displayColorPicker: false });
  };

  render() {
    const { sort, show } = this.state;
    return (
      <>
        <div className="container-fluid">
          <div className="dashboard-container">
            <div className="row no-margin dashboard-menubar-container">
              <div className="col-md-1 home">Home</div>
              <div className="col-md-1 analysis">Analysis</div>
              <div className="col-md-7 no-padding ml-auto">
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
                      <AddProjectModal
                        state={this.state}
                        handleClose={this.handleClose}
                        handleChangeInput={this.handleChangeInput}
                        handleDateFrom={this.handleDateFrom}
                        handleDateTo={this.handleDateTo}
                        handleChangeMember={this.handleChangeMember}
                        handleChangeColor={this.handleChangeColor}
                        handleChangeComplete={this.handleChangeComplete}
                        colors={this.colors}
                        addProject={this.addProject}
                      />
                      <Dropdown.Item>People</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
                <div className="col-md-10 d-inline-block sort-bar no-padding">
                  {/* <div className="col-md-2 no-padding d-inline-block">
                    <select class="form-control select-bar">
                      <option value="project">Project</option>
                      <option value="user">User</option>
                    </select>
                  </div> */}

                  <input
                    type="text"
                    placeholder="Search Here"
                    className="form-control"
                  />
                </div>
                {/* <div className="col-md-2 d-inline-block weekly-sort">
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
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
