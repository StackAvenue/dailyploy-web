import React, { Component } from "react";
import "../../assets/css/dashboard.scss";
import { Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import Add from "../../assets/images/add.svg";
import { get, post, mockPost } from "../../utils/API";
import { toast } from "react-toastify";
import AddProjectModal from "./AddProjectModal";
import AddMemberModal from "./AddMemberModal";
import Tabs from "./MenuBar/Tabs";
import ConditionalElements from "./MenuBar/ConditionalElements";

export default class MenuBar extends Component {
  constructor(props) {
    super(props);
    this.sortValues = [
      {
        content: "Daily",
        value: "day",
      },
      {
        content: "Weekly",
        value: "week",
      },
      {
        content: "Monthly",
        value: "month",
      },
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
      "#9900EF",
    ];
    this.state = {
      projectName: "",
      projectMembers: [],
      sort: "week",
      show: false,
      setShow: false,
      memberShow: false,
      memberSetShow: false,
      dateFrom: new Date(),
      dateTo: new Date(),
      multiEmail: true,
      background: "#000",
      displayColorPicker: false,
      emailOptions: [],
      memberName: "",
      memberEmail: "",
      memberAccess: "",
      memberRole: "",
      memberWorkingHours: "",
      memberProject: "",
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
        color_code: this.state.background,
      },
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

  addMember = async () => {
    const memberData = {
      member: {
        member_name: this.state.memberName,
        member_email: this.state.memberEmail,
        member_access: this.state.memberAccess,
        member_role: this.state.memberRole,
        member_workingHours: this.state.memberWorkingHours,
        member_project: this.state.memberProject,
      },
    };
    try {
      const { data } = await mockPost(memberData, "members");
      toast.success("Member Invited");
      this.setState({ memberShow: false });
    } catch (e) {
      console.log("error", e.response);
      this.setState({ memberShow: false });
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

  handleChangeMemberInput = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleChangeMemberRadio = e => {
    console.log("radio", e.target.value);
    this.setState({ memberAccess: e.target.value });
  };

  handleDateFrom = date => {
    this.setState({ dateFrom: date });
  };
  handleDateTo = date => {
    this.setState({ dateTo: date });
  };

  handleClose = () => {
    this.setState({
      show: false,
    });
  };
  handleShow = () => {
    this.setState({
      setShow: true,
      show: true,
    });
  };

  handleMemberClose = () => {
    this.setState({
      memberShow: false,
    });
  };
  handleMemberShow = () => {
    this.setState({
      memberSetShow: true,
      memberShow: true,
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
              <Tabs
                classNameRoute={this.props.classNameRoute}
                workspaceId={this.props.workspaceId}
              />
              <div className="col-md-7 ml-auto text-right">
                <ConditionalElements
                  classNameRoute={this.props.classNameRoute}
                />
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
                        btnText={"Add"}
                      />
                      <Dropdown.Item onClick={this.handleMemberShow}>
                        People
                      </Dropdown.Item>
                      <AddMemberModal
                        state={this.state}
                        handleClose={this.handleMemberClose}
                        handleChangeMemberInput={this.handleChangeMemberInput}
                        addMember={this.addMember}
                      />
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
