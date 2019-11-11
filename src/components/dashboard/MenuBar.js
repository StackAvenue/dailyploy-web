import React, { Component } from "react";
import "../../assets/css/dashboard.scss";
import { Dropdown } from "react-bootstrap";
import Add from "../../assets/images/add.svg";
import { get, post, mockPost } from "../../utils/API";
import { toast } from "react-toastify";
import AddProjectModal from "./AddProjectModal";
import AddMemberModal from "./AddMemberModal";
import Tabs from "./MenuBar/Tabs";
import ConditionalElements from "./MenuBar/ConditionalElements";
import DailyPloyToast from "./../DailyPloyToast";

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
      dateTo: "",
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
      isLoading: false,
      logedInUserEmail: "",
      disabledDateTo: false,
      disableColor: "#fff",
    };
  }

  async componentDidMount() {
    try {
      const { data } = await get("logged_in_user");
      this.setState({ logedInUserEmail: data.email });
    } catch (e) {
      console.log("err", e);
    }
  }

  addProject = async () => {
    console.log("loading", this.state.isLoading);
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
        `workspaces/${this.props.workspaceId}/projects`,
      );
      this.setState({ show: false, isLoading: true });
      toast(<DailyPloyToast message="Project added successfully!" status="success" />, { autoClose: 2000 })
    } catch (e) {
      console.log("project error", e.response);
      this.setState({ show: false });
    }
  };

  addMember = async () => {
    const memberData = {
      invitation: {
        name: `${this.state.memberName}`,
        email: `${this.state.memberEmail}`,
        status: "Pending",
        project_id: `${this.state.memberProject}`,
        workspace_id: `${this.props.workspaceId}`,
        role_id: `${this.state.memberRole}`,
        working_hours: `${this.state.memberWorkingHours}`,
      },
    };
    try {
      const { data } = await post(memberData, "invitations");
      toast(<DailyPloyToast message="Member added successfully!" status="success" />, { autoClose: 2000 })
      this.setState({ memberShow: false });
      console.log("member Data", data);
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
    this.setState({
      background: color.hex,
      displayColorPicker: !this.state.displayColorPicker,
    });
  };

  handleChangeColor = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker });
  };

  handleColorPickerClose = () => {
    this.setState({ displayColorPicker: false });
  };

  handleUndefinedToDate = () => {
    if (this.state.disabledDateTo) {
      var disableColor = "#fff";
    } else {
      var disableColor = "#eaeaed";
    }
    this.setState({ disabledDateTo: !this.state.disabledDateTo, disableColor: disableColor, dateTo: null })
  }

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
              <div className="col-md-6 ml-auto text-right">
                <ConditionalElements
                  classNameRoute={this.props.classNameRoute}
                  handleTaskView={this.props.handleTaskView}
                />
                <div className="col-md-2 d-inline-block">
                  <Dropdown>
                    <Dropdown.Toggle
                      className="menubar-button"
                      id="dropdown-basic">
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
                        emailOptions={this.props.state.isLogedInUserEmailArr}
                        handleUndefinedToDate={this.handleUndefinedToDate}
                        workspaceId={this.props.workspaceId}
                      />
                      <Dropdown.Item onClick={this.handleMemberShow}>
                        People
                      </Dropdown.Item>
                      {this.state.memberShow ? (
                        <AddMemberModal
                          state={this.state}
                          handleClose={this.handleMemberClose}
                          handleChangeMemberInput={this.handleChangeMemberInput}
                          handleChangeMemberRadio={this.handleChangeMemberRadio}
                          addMember={this.addMember}
                          projects={this.props.state.projects}
                        />
                      ) : null}
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
