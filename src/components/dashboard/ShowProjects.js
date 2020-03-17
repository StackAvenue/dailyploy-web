import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { get, post, logout, put, del } from "../../utils/API";
import MenuBar from "./MenuBar";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import GridBlock from "./ProjectViews/GridBlock";
import AddProjectModal from "./AddProjectModal";
import { firstTwoLetter, textTitlize } from "../../utils/function";
import {
  validateName,
  validateEmail,
  validatePhone
} from "../../utils/validation";
import DailyPloyToast from "../DailyPloyToast";
import ConfirmModal from "./../ConfirmModal";
import moment from "moment";
import { toast } from "react-toastify";
import cookie from "react-cookies";
import "react-tabs/style/react-tabs.css";
import { connect } from "react-redux";

class ShowProjects extends Component {
  constructor(props) {
    super(props);
    this.colors = [
      "#b9e1ff",
      "#ffc1de",
      "#4fefde",
      "#c7d0ff",
      "#ffc6ac",
      "#ffa2a2",
      "#e9ff71",
      "#d7a0ff"
    ];
    this.state = {
      workspaces: [],
      workspaceId: "",
      projectNames: [],
      sort: "week",
      projects: [],
      isChecked: true,
      isLogedInUserEmailArr: [],
      userId: "",
      users: [],
      setShow: false,
      show: false,
      projectOwner: null,
      dateFrom: null,
      dateTo: null,
      projectMembers: [],
      projectId: null,
      background: null,
      userName: "",
      displayColorPicker: false,
      selectedTags: [],
      worksapceUsers: [],
      selectProjectArr: [],
      isAllChecked: false,
      showConfirm: false,
      contacts: [
        {
          name: "",
          email: "",
          phone_number: ""
        }
      ],
      editNewCommnets: [],
      editCommnets: []
    };
  }

  countIncrese = projectUser => {
    let arr = projectUser;
    let count;
    if (arr.length >= 4) {
      count = arr.length - 4;
    }
    let showCount = count ? (
      <div className="user-block" style={{ backgroundColor: "#33a1ff" }}>
        <span>+{count}</span>
      </div>
    ) : null;
    return showCount;
  };

  logout = async () => {
    await logout();
    this.props.history.push("/login");
  };

  async componentDidMount() {
    this.props.handleLoading(true);
    var loggedInData = cookie.load("loggedInUser");
    if (!loggedInData) {
      try {
        const { data } = await get("logged_in_user");
        var loggedInData = data;
      } catch (e) {
        console.log("err", e);
      }
    }

    // workspace Listing
    try {
      const { data } = await get("workspaces");
      var workspacesData = data.workspaces;
    } catch (e) {
      console.log("err", e);
    }

    //get workspace Id
    this.getWorkspaceParams();

    // worksapce project Listing
    try {
      var userIds =
        this.props.searchUserDetails.length > 0
          ? this.props.searchUserDetails.map(member => member.member_id)
          : [];
      var searchData = {};
      if (userIds.length > 0) {
        searchData["user_ids"] = userIds.join(",");
      }
      if (this.props.searchProjectIds.length > 0) {
        searchData["project_ids"] = this.props.searchProjectIds.join(",");
      }
      const { data } = await get(
        `workspaces/${this.state.workspaceId}/projects`,
        searchData
      );
      var projectsData = data.projects;
      this.props.handleLoading(false);
    } catch (e) {
      console.log("err", e);
    }

    // workspace Member Listing
    try {
      const { data } = await get(
        `workspaces/${this.state.workspaceId}/members`
      );
      var worksapceUsers = data.members;
      var userArr = data.members.map(user => user.email);
      var emailArr = data.members;
    } catch (e) {
      console.log("users Error", e);
    }

    this.setState({
      userId: loggedInData.id,
      userName: loggedInData.name,
      userEmail: loggedInData.email,
      workspaces: workspacesData,
      projects: projectsData,
      users: userArr,
      isLogedInUserEmailArr: emailArr,
      worksapceUsers: worksapceUsers
    });
    this.createUserProjectList();
  }

  async componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.searchProjectIds !== this.props.searchProjectIds ||
      prevProps.searchUserDetails !== this.props.searchUserDetails
    ) {
      try {
        var userIds =
          this.props.searchUserDetails.length > 0
            ? this.props.searchUserDetails.map(member => member.member_id)
            : [];
        var searchData = {};
        if (userIds.length > 0) {
          searchData["user_ids"] = userIds.join(",");
        }
        if (this.props.searchProjectIds.length > 0) {
          searchData["project_ids"] = this.props.searchProjectIds.join(",");
        }
        const { data } = await get(
          `workspaces/${this.state.workspaceId}/projects`,
          searchData
        );
        var projectsData = data.projects;
        this.props.handleLoading(false);
      } catch (e) {}

      this.setState({
        projects: projectsData
      });
    }
  }

  createUserProjectList = () => {
    let memberList = [];
    let projectList = [];
    if (this.state.projects) {
      this.state.projects.map((project, index) => {
        projectList.push({
          value: project.name,
          project_id: project.id,
          type: "project",
          id: (index += 1)
        });
      });
    }
    if (this.state.worksapceUsers) {
      this.state.worksapceUsers.map((member, idx) => {
        memberList.push({
          value: member.name,
          member_id: member.id,
          email: member.email,
          type: "member",
          role: member.role
        });
      });
    }
    let searchOptions = {
      members: memberList,
      projects: projectList
    };
    this.props.setSearchOptions(searchOptions);
  };

  getWorkspaceParams = () => {
    const { workspaceId } = this.props.match.params;
    this.setState({ workspaceId: workspaceId });
  };

  onSelectSort = value => {
    this.setState({ sort: value });
  };

  getDate = date => {
    if (!date) {
      return undefined;
    } else {
      var d = moment(date).format("YYYY-MM-DD");
      return d;
    }
  };

  monthDiff = (d1, d2) => {
    var dayDuration = moment(d2).diff(d1, "days");
    var monthDuration = moment(d2).diff(d1, "months");
    var yearDuration = moment(d2).diff(d1, "year");
    let duration;
    if (dayDuration < 0 || monthDuration < 0 || yearDuration < 0) {
      duration = "0 days";
    } else if (dayDuration > 30 && monthDuration < 12) {
      duration = monthDuration + " months";
    } else if (dayDuration === 0) {
      duration = "1 days";
    } else if (monthDuration > 12) {
      duration = yearDuration + " year";
    } else {
      duration = dayDuration + 1 + " days";
    }
    return duration;
  };

  classNameRoute = () => {
    let route = this.props.history.location.pathname;
    let routeName = route.split("/")[3];
    if (routeName === "projects") {
      return "projectsTrue";
    } else {
      return false;
    }
  };

  handleEditShow = async project => {
    // var contacts = this.returnContacts(project);
    this.setState({
      show: true,
      setShow: true,
      projectId: project.id,
      projectOwner: project.owner.name,
      projectName: project.name,
      dateFrom: new Date(project.start_date),
      dateTo: this.handleDateToDisable(project),
      background: project.color_code,
      selectedTags: project.members,
      projectMembers: project.members.map(project => project.id)
      // contacts: contacts
    });
    try {
      const { data } = await get(
        `workspaces/${this.state.workspaceId}/projects/${project.id}/contact`
      );
      var contacts = this.returnContacts(data.contacts);
      this.setState({ contacts: contacts });
    } catch (e) {}
  };

  returnContacts = contacts => {
    debugger;
    if (contacts.length > 0) {
      return contacts.map(contact => {
        return {
          name: contact.name,
          email: contact.email ? contact.email : "",
          phone_number: contact.phone_number ? contact.phone_number : "",
          id: contact.id
        };
      });
    } else {
      this.addContactsRow();
      return [];
    }
  };

  makeEditContact = contact => {
    var contacts = this.state.contacts;
    var contact = contacts.find(c => c.id == contact.id);
    contact["title"] = "edit";
    this.setState({ contacts: contacts });
  };

  backToList = contact => {
    var contacts = this.state.contacts;
    var contact = contacts.find(c => c.id == contact.id);
    contact["title"] = "";
    this.setState({ contacts: contacts });
  };

  handleDateToDisable = project => {
    if (project.end_date) {
      return new Date(project.end_date);
    } else {
      this.setState({
        disabledDateTo: true,
        disableColor: "#eaeaed"
      });
      return null;
    }
  };

  handleEditClose = () => {
    this.setState({
      show: false
    });
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

  handleUndefinedToDate = () => {
    if (this.state.disabledDateTo) {
      var disableColor = "#fff";
    } else {
      var disableColor = "#eaeaed";
    }
    this.setState({
      disabledDateTo: !this.state.disabledDateTo,
      disableColor: disableColor,
      dateTo: null
    });
  };

  handleChangeComplete = (color, event) => {
    this.setState({
      background: color.hex,
      displayColorPicker: !this.state.displayColorPicker
    });
  };

  handleChangeColor = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker });
  };

  manageProjectListing = project => {
    project["owner"] = { name: `${this.state.userName}` };
    var filterdProjects = [...this.state.projects, ...[project]];
    this.setState({ projects: filterdProjects });
  };

  manageUpdateProjectListing = project => {
    project["owner"] = { name: `${this.state.userName}` };
    var projects = this.state.projects.filter(proj => proj.id !== project.id);
    var filterdProjects = [...projects, ...[project]];
    this.setState({ projects: filterdProjects });
  };

  handleChangeMember = selectedTags => {
    var ids = selectedTags.map(option => option.id);
    this.setState({ projectMembers: ids, selectedTags: selectedTags });
  };

  editProject = async () => {
    const projectData = {
      project: {
        name: this.state.projectName,
        start_date: this.state.dateFrom,
        end_date: this.state.dateTo,
        members: this.state.projectMembers,
        color_code: this.state.background
      }
    };
    try {
      const { data } = await put(
        projectData,
        `workspaces/${this.state.workspaceId}/projects/${this.state.projectId}`
      );
      this.setState({
        show: false,
        projectName: "",
        projectId: "",
        dateTo: null,
        projectMembers: []
      });
      this.manageUpdateProjectListing(data.project);
      // this.handleLoad(true);
      toast(
        <DailyPloyToast
          message="Project update successfully!"
          status="success"
        />,
        { autoClose: 2000, position: toast.POSITION.TOP_CENTER }
      );
    } catch (e) {
      console.log("Error", e.response);
      var errors = e.response.data.errors;
      if (errors && errors.project_name_workspace_uniqueness) {
        toast(
          <DailyPloyToast
            message={`Project Name ${errors.project_name_workspace_uniqueness}`}
            status="error"
          />,
          { autoClose: 2000, position: toast.POSITION.TOP_CENTER }
        );
      } else if (errors && errors.name) {
        toast(
          <DailyPloyToast
            message={`Project name ${errors.name}`}
            status="error"
          />,
          { autoClose: 2000, position: toast.POSITION.TOP_CENTER }
        );
      } else {
        this.setState({ show: false });
      }
    }
  };

  handleCheckAll = (e, projects) => {
    const allCheckboxChecked = e.target.checked;
    let projectsLength = projects.length;
    var arrProject;
    if (allCheckboxChecked === true) {
      arrProject = projects;
    } else {
      arrProject = [];
    }
    var checkboxes = document.getElementsByName("isChecked");
    if (allCheckboxChecked) {
      for (let i in checkboxes) {
        if (checkboxes[i].checked === false) {
          checkboxes[i].checked = true;
          var parent = checkboxes[i].closest(".grid-div");
          if (parent) {
            parent.className += " active";
          }
        }
      }
    } else {
      for (let i in checkboxes) {
        if (checkboxes[i].checked === true) {
          checkboxes[i].checked = false;
          var parent = checkboxes[i].closest(".grid-div");
          if (parent) {
            parent.classList.remove("active");
          }
        }
      }
    }
    this.setState({
      selectProjectArr: arrProject,
      isAllChecked: allCheckboxChecked
    });
  };

  handleCheck = (e, project) => {
    let checked = e.target.checked;
    var parent = e.target.closest(".grid-div");
    let arrProject = [];
    if (checked) {
      arrProject = [...this.state.selectProjectArr, ...[project]];
      if (parent) {
        parent.className += " active";
      }
    } else {
      let filterProjectArr = this.state.selectProjectArr.filter(
        item => item.id !== project.id
      );
      arrProject = filterProjectArr;
      if (parent) {
        parent.classList.remove("active");
      }
    }
    this.setState({ selectProjectArr: arrProject });
  };

  confirmDeleteProject = () => {
    if (this.state.selectProjectArr.length > 0) {
      this.setState({ showConfirm: true });
    }
  };

  closeModal = () => {
    this.setState({ showConfirm: false });
  };

  deleteProjects = async e => {
    let projectIds = this.state.selectProjectArr.map(p => p.id).join(",");
    if (projectIds != "") {
      try {
        const { data } = await del(
          `workspaces/${this.state.workspaceId}/projects?ids=${projectIds}`
        );

        let projects = this.state.projects.filter(
          p => !this.state.selectProjectArr.includes(p)
        );
        toast(
          <DailyPloyToast
            message="Project Deleted Succesfully"
            status="success"
          />,
          { autoClose: 2000, position: toast.POSITION.TOP_CENTER }
        );
        this.setState({
          showConfirm: false,
          projects: projects,
          selectProjectArr: []
        });
      } catch (e) {
        toast(
          <DailyPloyToast message="Something went wrong" status="error" />,
          { autoClose: 2000, position: toast.POSITION.TOP_CENTER }
        );
      }
    }
  };

  countProjectView = (e, id) => {
    this.setState({ showMemberList: true, showMemberProjectId: id });
  };
  countMemberViewClose = () => {
    this.setState({ showMemberList: false });
  };

  renderMessage = () => {
    if (
      this.props.searchProjectIds.length > 0 ||
      this.props.searchUserDetails.length > 0
    ) {
      return (
        <div className="list-not-found padding-top-60px">
          <span>Results Not Found</span>
        </div>
      );
    } else {
      return (
        <div className="list-not-found padding-top-60px">
          <span>Please Add Projects</span>
        </div>
      );
    }
  };

  updateContact = async idx => {
    var contact = this.state.contacts.find((contact, id) => id == idx);
    if (this.validateContackts(contact, idx, "contacts")) {
      try {
        const { data } = await put(
          contact,
          `workspaces/${this.state.workspaceId}/projects/${this.state.projectId}/contact/${contact.id}`
        );
        var contacts = this.state.contacts;
        var contact = contacts.find((contact, id) => id == idx);
        contact["name"] = data.name;
        contact["phone_number"] = data.phone_number ? data.phone_number : "";
        contact["email"] = data.email ? data.email : "";
        contact["title"] = "";
        this.setState({ contacts: contacts });
      } catch (e) {}
    }
  };

  deleteContact = async contact => {
    try {
      const { data } = await del(
        `workspaces/${this.state.workspaceId}/projects/${this.state.projectId}/contact/${contact.id}`
      );
      let contacts = this.state.contacts.filter(c => c.id != contact.id);
      this.setState({ contacts: contacts });
    } catch (e) {}
  };

  addNewContact = async idx => {
    var contact = this.state.editNewCommnets.find(
      (contact, index) => index == idx
    );
    if (this.validateContackts(contact, idx, "editNewCommnets")) {
      try {
        const { data } = await post(
          contact,
          `workspaces/${this.state.workspaceId}/projects/${this.state.projectId}/contact`
        );
        let editNewCommnets = this.state.editNewCommnets.filter(
          (contact, index) => index != idx
        );
        var contacts = [...this.state.contacts, ...this.returnContacts([data])];
        this.setState({ contacts: contacts, editNewCommnets: editNewCommnets });
      } catch (e) {}
    }
  };

  validateContackts = (contact, idx, state) => {
    var flag = true;
    var contacts = this.state[state];
    contacts
      .filter((c, index) => index == idx)
      .map(contact => {
        let nm = validateName(contact.name);
        if (nm) {
          contact["nameError"] = nm;
          flag = false;
        } else {
          contact["nameError"] = null;
        }
        let em = validateEmail(contact.email);
        let ph = validatePhone(contact.phone_number);
        if (contact.email == "" && contact.phone_number == "") {
          if (em) {
            contact["emailError"] = em;
            flag = false;
          } else {
            contact["emailError"] = null;
          }
          if (ph) {
            contact["phoneError"] = ph;
            flag = false;
          } else {
            contact["phoneError"] = null;
          }
        } else if (contact.email != "" && contact.phone_number != "") {
          if (em) {
            contact["emailError"] = em;
            flag = false;
          } else {
            contact["emailError"] = null;
          }
          if (ph) {
            contact["phoneError"] = ph;
            flag = false;
          } else {
            contact["phoneError"] = null;
          }
        } else if (contact.email != "" || contact.phone_number != "") {
          if (contact.email != "" && em) {
            contact["emailError"] = em;
            flag = false;
          } else {
            contact["emailError"] = null;
          }
          if (contact.phone_number != "" && ph) {
            contact["phoneError"] = ph;
            flag = false;
          } else {
            contact["phoneError"] = null;
          }
        }
        return contact;
      });
    this.setState({
      [state]: contacts
    });
    return flag;
  };

  handleContactChangeInput = (e, idx, state) => {
    const { name, value } = e.target;
    var contacts = this.state[state];
    let contact = contacts.find((contact, index) => idx === index);
    contact[name] = value;
    this.setState({
      [state]: contacts
    });
  };

  addContactsRow = () => {
    var contacts = this.state.editNewCommnets;
    contacts.push({
      name: "",
      email: "",
      phone_number: "",
      title: "add"
    });
    this.setState({
      editNewCommnets: contacts
    });
  };

  removeContactsRow = idx => {
    let contacts = this.state.contacts.filter((contact, index) => idx != index);
    this.setState({
      contacts: contacts
    });
  };

  removeEditNewContactsRow = idx => {
    let contacts = this.state.editNewCommnets.filter(
      (contact, index) => idx != index
    );
    this.setState({
      editNewCommnets: contacts
    });
  };

  render() {
    var userRole = localStorage.getItem("userRole");

    return (
      <>
        <MenuBar
          onSelectSort={this.onSelectSort}
          workspaceId={this.state.workspaceId}
          classNameRoute={this.classNameRoute}
          handleLoad={this.handleLoad}
          manageProjectListing={this.manageProjectListing}
          state={this.state}
        />
        {this.state.projects.length > 0 ? (
          <div className="show-projects padding-top-60px">
            <div className="views">
              <Tabs>
                <div className="row no-margin">
                  <div className="select col-md-2 d-inline-block">
                    {userRole == "admin" ? (
                      <>
                        <input
                          className="styled-checkbox"
                          id={`styled-checkbox`}
                          type="checkbox"
                          name="chk[]"
                          onChange={e =>
                            this.handleCheckAll(e, this.state.projects)
                          }
                        />
                        <label htmlFor={`styled-checkbox`}>
                          {this.state.isAllChecked ? (
                            <span>All Selected</span>
                          ) : (
                            <span>Select All</span>
                          )}
                        </label>
                      </>
                    ) : null}
                  </div>

                  <div className="select col-md-4 d-inline-block no-padding">
                    {this.state.selectProjectArr.length > 0 &&
                    userRole == "admin" ? (
                      <>
                        <button
                          className="btn btn-primary delete-button"
                          onClick={this.confirmDeleteProject}
                        >
                          Delete
                        </button>
                        <div className="d-inline-block select-project-text">
                          {this.state.selectProjectArr.length +
                            " Project Selected"}
                        </div>
                      </>
                    ) : null}
                  </div>
                  <div className="col-md-6 tab">
                    <TabList>
                      <Tab>
                        <i className="fas fa-th"></i>
                      </Tab>
                      <Tab>
                        <i className="fa fa-bars"></i>
                      </Tab>
                    </TabList>
                  </div>
                </div>
                <div className="project-view">
                  <TabPanel>
                    <div>
                      <div className="row grid-view no-margin">
                        {this.state.projects.map((project, index) => {
                          return (
                            <GridBlock
                              key={index}
                              project={project}
                              index={index}
                              projectUser={this.projectUser}
                              monthDiff={this.monthDiff}
                              getDate={this.getDate}
                              countIncrese={this.countIncrese}
                              handleCheck={this.handleCheck}
                              handleEditShow={this.handleEditShow}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </TabPanel>
                  <TabPanel>
                    <table className="table">
                      <thead>
                        <tr>
                          <th scope="col" style={{ paddingLeft: "60px" }}>
                            Project ID{" "}
                            <i className="fa fa-sort" aria-hidden="true"></i>
                          </th>
                          <th scope="col" style={{ width: "195px" }}>
                            Project Name{" "}
                            <i className="fa fa-sort" aria-hidden="true"></i>
                          </th>
                          <th scope="col">
                            Colour{" "}
                            <i className="fa fa-sort" aria-hidden="true"></i>
                          </th>
                          <th scope="col">
                            Project Owner{" "}
                            <i className="fa fa-sort" aria-hidden="true"></i>
                          </th>
                          <th scope="col">
                            Start Date{" "}
                            <i className="fa fa-sort" aria-hidden="true"></i>
                          </th>
                          <th scope="col">
                            End Date{" "}
                            <i className="fa fa-sort" aria-hidden="true"></i>
                          </th>
                          <th scope="col">
                            Duration{" "}
                            <i className="fa fa-sort" aria-hidden="true"></i>
                          </th>
                          <th scope="col">
                            Created Date{" "}
                            <i className="fa fa-sort" aria-hidden="true"></i>
                          </th>
                          <th scope="col">
                            Project Members{" "}
                            <i className="fa fa-sort" aria-hidden="true"></i>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="text-titlize list-view">
                        {this.state.projects.map((project, index) => {
                          return (
                            <tr key={index}>
                              <td style={{ paddingLeft: "60px" }}>
                                <input
                                  className="styled-checkbox"
                                  id={`styled-checkbox-${index}`}
                                  type="checkbox"
                                  name="isChecked"
                                  onChange={e => this.handleCheck(e, project)}
                                />
                                <label
                                  htmlFor={`styled-checkbox-${index}`}
                                ></label>
                                {`${"P-00"}${index + 1}`}
                              </td>
                              <td>{project.name}</td>
                              <td>
                                <div
                                  className="color-block"
                                  style={{
                                    backgroundColor: `${project.color_code}`
                                  }}
                                ></div>
                              </td>
                              <td>{project.owner ? project.owner.name : ""}</td>
                              <td>
                                {moment(project.start_date).format("DD MMM YY")}
                              </td>
                              <td>
                                {project.end_date
                                  ? moment(project.end_date).format("DD MMM YY")
                                  : "---"}
                              </td>
                              <td>
                                {this.monthDiff(
                                  this.getDate(project.start_date),
                                  this.getDate(project.end_date)
                                )}
                              </td>
                              <td>
                                {moment(project.created_at).format("DD MMM YY")}
                              </td>{" "}
                              <td>
                                <span>
                                  {project.members
                                    .slice(0, 4)
                                    .map((user, index) => {
                                      return (
                                        <div
                                          key={index}
                                          className="user-block"
                                          title={textTitlize(user.name)}
                                        >
                                          <span>
                                            {firstTwoLetter(user.name)}
                                          </span>
                                        </div>
                                      );
                                    })}
                                </span>
                                <span
                                  onMouseMove={e =>
                                    this.countProjectView(e, project.id)
                                  }
                                >
                                  {this.countIncrese(
                                    project.members.map(user => user.name)
                                  )}
                                </span>
                                {this.state.showMemberList &&
                                this.state.showMemberProjectId ===
                                  project.id ? (
                                  <div
                                    className="project-count-list-show"
                                    style={{ right: "70px" }}
                                  >
                                    <div className="close-div">
                                      <a onClick={this.countMemberViewClose}>
                                        <i
                                          className="fa fa-times"
                                          aria-hidden="true"
                                        ></i>
                                      </a>
                                    </div>
                                    <div className="project-body-box">
                                      {project.members.map(member => (
                                        <div className="project-body-text">
                                          {member.name}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ) : null}
                              </td>
                              <td
                                className={
                                  userRole === "member" ? "d-none" : null
                                }
                              >
                                <button
                                  className="btn btn-link edit-btn"
                                  onClick={() => this.handleEditShow(project)}
                                >
                                  <i className="fas fa-pencil-alt"></i>
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </TabPanel>
                </div>
              </Tabs>
            </div>
          </div>
        ) : (
          this.renderMessage()
        )}
        {this.state.showConfirm ? (
          <ConfirmModal
            title="Delete Project"
            message={`Are you sure you want to Delete ${
              this.state.selectProjectArr.length == 1
                ? " this project"
                : "these projects"
            }?`}
            onClick={this.deleteProjects}
            closeModal={this.closeModal}
            buttonText="Delete"
            show={this.state.showConfirm}
          />
        ) : null}
        {this.state.show && this.state.projectId ? (
          <AddProjectModal
            state={this.state}
            handleClose={this.handleEditClose}
            btnText={"Save"}
            headText={this.state.projectName}
            ownerClassName={""}
            handleChangeInput={this.handleChangeInput}
            handleDateFrom={this.handleDateFrom}
            handleDateTo={this.handleDateTo}
            handleUndefinedToDate={this.handleUndefinedToDate}
            workspaceId={this.state.workspaceId}
            handleChangeColor={this.handleChangeColor}
            handleChangeComplete={this.handleChangeComplete}
            colors={this.colors}
            handleChangeMember={this.handleChangeMember}
            emailOptions={this.state.isLogedInUserEmailArr}
            addProject={this.editProject}
            handleContactChangeInput={this.handleContactChangeInput}
            addContactsRow={this.addContactsRow}
            removeContactsRow={this.removeContactsRow}
            deleteContact={this.deleteContact}
            updateContact={this.updateContact}
            makeEditContact={this.makeEditContact}
            backToList={this.backToList}
            removeEditNewContactsRow={this.removeEditNewContactsRow}
            addNewContact={this.addNewContact}
          />
        ) : null}
      </>
    );
  }
}

export default withRouter(ShowProjects);
