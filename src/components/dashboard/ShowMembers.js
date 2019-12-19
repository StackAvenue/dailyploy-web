import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Header from "./Header";
import { get, logout, mockGet, mockPost, put } from "../../utils/API";
import MenuBar from "./MenuBar";
import Sidebar from "./Sidebar";
import moment from "moment";
import AddMemberModal from "./AddMemberModal";
import cookie from "react-cookies";
import EditMemberModal from "./Member/EditMemberModal";

class ShowMembers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      workspaces: [],
      workspaceId: "",
      projectNames: [],
      sort: "week",
      members: [],
      isLogedInUserEmailArr: [],
      projects: [],
      userId: "",
      users: [],
      searchOptions: [],
      worksapceUsers: "",
      worksapceUser: [],
      isLoading: false,
      isProjectListShow: false,
      projectShowMemberId: null,
      show: false,
      setShow: false,
      memberName: null,
      memberEmail: null,
      memberAccess: null,
      memberRole: null,
      memberHours: "",
      memberProjects: null,
      isDeleteShow: false,
      selectMemberArr: [],
      isAllChecked: false
    };
  }
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
      const { data } = await get(
        `workspaces/${this.state.workspaceId}/projects`
      );
      var projectsData = data.projects;
    } catch (e) {
      console.log("err", e);
    }

    try {
      var userIds =
        this.props.searchUserDetails.length > 0
          ? this.props.searchUserDetails.map(member => member.member_id)
          : [];
      var searchData = {
        user_ids: JSON.stringify(userIds),
        project_ids: JSON.stringify(this.props.searchProjectIds)
      };
      const { data } = await get(
        `workspaces/${this.state.workspaceId}/members`
      );
      var userArr = data.members.map(user => user.email);
      var worksapceUsers = data.members;
      var worksapceUser = data.members.filter(
        user => user.email === loggedInData.email
      );
      var memberArr = data.members.filter(
        user => user.email !== loggedInData.email
      );
      var emailArr = data.members.filter(
        user => user.email !== loggedInData.email
      );
      // .map(user => user.email);
      this.props.handleLoading(false);
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
      userRole: worksapceUser[0].role,
      worksapceUsers: worksapceUsers,
      worksapceUser: worksapceUser,
      members: memberArr
    });
    this.createUserProjectList();
  }

  async componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.searchProjectIds !== this.props.searchProjectIds ||
      prevProps.searchUserDetails !== this.props.searchUserDetails ||
      prevState.isLoading !== this.state.isLoading
    ) {
      var userIds =
        this.props.searchUserDetails.length > 0
          ? this.props.searchUserDetails.map(member => member.member_id)
          : [];
      var searchData = {
        user_ids: JSON.stringify(userIds),
        project_ids: JSON.stringify(this.props.searchProjectIds)
      };
      try {
        const { data } = await get(
          `workspaces/${this.state.workspaceId}/members`
        );
        var userArr = data.members.map(user => user.email);
        var worksapceUsers = data.members;
        var memberArr = data.members.filter(
          user => user.email !== this.state.userEmail
        );
      } catch (e) {
        console.log("users Error", e);
      }

      this.setState({
        users: userArr,
        worksapceUsers: worksapceUsers,
        members: memberArr
      });
    }
  }

  getWorkspaceParams = () => {
    const { workspaceId } = this.props.match.params;
    this.setState({ workspaceId: workspaceId });
  };

  onSelectSort = value => {
    this.setState({ sort: value });
  };

  classNameRoute = () => {
    let route = this.props.history.location.pathname;
    let routeName = route.split("/")[3];
    if (routeName === "members") {
      return "membersTrue";
    } else {
      return false;
    }
  };

  // handleCheck = e => {
  //   const value = e.target.checked;
  // };

  displayProjects = projects => {
    let arr = projects.map(project => project.name);
    let projectShow = arr.length > 1 ? arr[0] + ", " + arr[1] : arr[0];
    return projectShow;
  };

  countProject = projects => {
    let arr = projects.map(project => project.name);
    let count;
    if (arr.length > 2) {
      count = arr.length - 2;
    }
    let concatCount = "+" + count;
    if (!count) {
      return null;
    } else {
      return concatCount;
    }
  };

  countProjectView = (e, id) => {
    this.setState({ isProjectListShow: true, projectShowMemberId: id });
  };

  countProjectViewClose = () => {
    this.setState({ isProjectListShow: false });
  };

  handleClose = () => {
    this.setState({
      show: false
    });
  };

  handleShow = (e, member) => {
    this.setState({
      setShow: true,
      show: true,
      projectShowMemberId: member.id,
      memberName: member.name,
      memberEmail: member.email,
      memberRole: member.role,
      memberHours: member.working_hours,
      memberProjects: member.projects
    });
  };

  editMemberHandleChange = e => {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  };

  editMember = async () => {
    var roleId = this.state.memberRole === "admin" ? 1 : 2;
    const editMemberData = {
      role_id: roleId,
      working_hours: Number(this.state.memberHours)
    };
    this.setState({ isLoading: true });
    try {
      const { data } = await put(
        editMemberData,
        `workspaces/${this.state.workspaceId}/members/${this.state.projectShowMemberId}`
      );
      this.setState({
        show: false,
        isLoading: false
      });
    } catch (e) {
      console.log("error", e);
    }
  };

  handleSearchFilterResult = data => {
    var searchUserDetails = [];
    var projectIds = [];
    {
      data.map((item, i) => {
        if (item.type === "member") {
          searchUserDetails.push(item);
        } else if (item.type === "project") {
          projectIds.push(item.project_id);
        }
      });
    }
    this.setState({
      searchProjectIds: projectIds,
      searchUserDetails: searchUserDetails
    });
  };

  createUserProjectList = () => {
    var searchOptions = [];
    if (this.state.projects) {
      {
        this.state.projects.map((project, index) => {
          searchOptions.push({
            value: project.name,
            project_id: project.id,
            type: "project",
            id: (index += 1)
          });
        });
      }
    }

    var index = searchOptions.length;
    if (this.state.worksapceUsers) {
      this.state.worksapceUsers.map((member, idx) => {
        searchOptions.push({
          value: member.name,
          id: (index += 1),
          member_id: member.id,
          email: member.email,
          type: "member",
          role: member.role
        });
      });
    }
    this.setState({ searchOptions: searchOptions });
    this.props.setSearchOptions(searchOptions);
  };

  handleLoad = value => {
    this.setState({ isLoading: value });
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
        }
      }
    } else {
      for (let i in checkboxes) {
        if (checkboxes[i].checked === true) {
          checkboxes[i].checked = false;
        }
      }
    }
    this.setState({
      selectMemberArr: arrProject,
      isAllChecked: allCheckboxChecked
    });
  };

  handleCheck = (e, project) => {
    let checked = e.target.checked;
    let arrProject = [];
    if (checked) {
      arrProject = [...this.state.selectMemberArr, ...[project]];
    } else {
      let filterProjectArr = this.state.selectMemberArr.filter(
        item => item.id !== project.id
      );
      arrProject = filterProjectArr;
    }
    this.setState({ selectMemberArr: arrProject });
  };

  deleteProject = (e, member) => {};

  render() {
    var userRole = localStorage.getItem("userRole");
    var isShowMember = this.state.members.length > 1;
    return (
      <>
        <MenuBar
          onSelectSort={this.onSelectSort}
          workspaceId={this.state.workspaceId}
          classNameRoute={this.classNameRoute}
          handleLoad={this.handleLoad}
          state={this.state}
        />
        {isShowMember ? (
          <div className="show-projects">
            <div className="members" style={{ padding: "10px 0px 10px 60px" }}>
              <div className="row no-margin">
                <div
                  className="col-md-2 d-inline-block no-padding"
                  style={{ marginTop: "10px" }}
                >
                  <input
                    className="styled-checkbox"
                    id={`styled-checkbox`}
                    type="checkbox"
                    name="chk[]"
                    onChange={e => this.handleCheckAll(e, this.state.members)}
                  />
                  <label htmlFor={`styled-checkbox`}>
                    {this.state.isAllChecked ? (
                      <span>All Selected</span>
                    ) : (
                      <span>Select All</span>
                    )}
                  </label>
                </div>
                <div className="col-md-4 d-inline-block no-margin no-padding">
                  {this.state.selectMemberArr.length > 0 ? (
                    <>
                      <div className="d-inline-block">
                        <button
                          className="btn btn-primary delete-button"
                          onClick={e =>
                            this.deleteProject(e, this.state.selectMemberArr)
                          }
                        >
                          Delete
                        </button>
                      </div>
                      <div className="d-inline-block select-project-text">
                        {this.state.selectMemberArr.length + " Member Selected"}
                      </div>
                    </>
                  ) : null}
                </div>
              </div>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col" style={{ paddingLeft: "60px" }}>
                    Name <i className="fa fa-sort" aria-hidden="true"></i>
                  </th>
                  <th scope="col">
                    Email <i className="fa fa-sort" aria-hidden="true"></i>
                  </th>
                  <th scope="col">Role</th>
                  <th scope="col">
                    Working Hours{" "}
                    <i className="fa fa-sort" aria-hidden="true"></i>
                  </th>
                  <th scope="col">Projects</th>
                  <th scope="col">Invitation</th>
                  <th scope="col">
                    Date Created{" "}
                    <i className="fa fa-sort" aria-hidden="true"></i>
                  </th>
                </tr>
              </thead>
              <tbody>
                {this.state.members.map((member, index) => {
                  return (
                    <tr key={index}>
                      <td
                        className="text-titlize"
                        style={{ paddingLeft: "60px" }}
                      >
                        <input
                          className="styled-checkbox"
                          id={`styled-checkbox-${index}`}
                          type="checkbox"
                          name="isChecked"
                          onChange={e => this.handleCheck(e, member)}
                        />
                        <label htmlFor={`styled-checkbox-${index}`}></label>
                        {member.name}
                      </td>
                      <td>{member.email}</td>
                      <td className="text-titlize">{member.role}</td>
                      <td className="text-titlize">
                        {member.working_hours ? member.working_hours : "8"}{" "}
                        hours
                      </td>
                      <td className="text-titlize">
                        <span>{this.displayProjects(member.projects)}</span>
                        <span
                          className="project-count"
                          style={{ pointer: "cursor" }}
                          onMouseMove={e => this.countProjectView(e, member.id)}
                        >
                          {this.countProject(member.projects)}
                        </span>
                        {this.state.isProjectListShow &&
                        this.state.projectShowMemberId === member.id ? (
                          <div className="project-count-list-show">
                            <div className="close-div">
                              <a onClick={this.countProjectViewClose}>
                                <i
                                  className="fa fa-times"
                                  aria-hidden="true"
                                ></i>
                              </a>
                            </div>
                            <div className="project-body-box">
                              {member.projects.map(project => (
                                <div className="project-body-text">
                                  {project.name}
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : null}
                      </td>
                      <td className={"text-titlize"}>
                        {!member.is_invited ? (
                          <p className="text-green">Accepted</p>
                        ) : (
                          <p className="text-blue">Invited</p>
                        )}
                      </td>
                      <td>{moment(member.created_at).format("DD MMM YY")}</td>
                      <td className={userRole === "member" ? "d-none" : null}>
                        <button
                          className="btn btn-link edit-btn"
                          onClick={e => this.handleShow(e, member)}
                        >
                          <i className="fas fa-pencil-alt"></i>
                        </button>
                        {this.state.show &&
                        this.state.projectShowMemberId === member.id ? (
                          <EditMemberModal
                            show={this.state.show}
                            handleClose={this.handleClose}
                            state={this.state}
                            editMemberHandleChange={this.editMemberHandleChange}
                            editMember={this.editMember}
                          />
                        ) : null}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="list-not-found">
            <span>Please Add Members</span>
          </div>
        )}
      </>
    );
  }
}

export default withRouter(ShowMembers);
