import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Header from "./Header";
import { get, logout, mockGet } from "../../utils/API";
import MenuBar from "./MenuBar";
import Sidebar from "./Sidebar";
import moment from "moment";
import AddMemberModal from "./AddMemberModal";
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
      searchUserDetail: "",
      searchProjectIds: [],
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
      memberHours: null,
      memberProjects: null,
      isDeleteShow: false,
    };
  }
  logout = async () => {
    await logout();
    this.props.history.push("/login");
  };
  async componentDidMount() {
    this.props.handleLoading(true);
    try {
      const { data } = await get("logged_in_user");
      var loggedInData = data;
    } catch (e) {
      console.log("err", e);
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
        `workspaces/${this.state.workspaceId}/projects`,
      );
      var projectsData = data.projects;
    } catch (e) {
      console.log("err", e);
    }

    try {
      const { data } = await get(
        `workspaces/${this.state.workspaceId}/members`,
      );
      var userArr = data.members.map(user => user.email);
      var worksapceUsers = data.members;
      var worksapceUser = data.members.filter(
        user => user.email === loggedInData.email,
      );
      var worksapceMembersExceptLogedUser = data.members.filter(
        user => user.email !== loggedInData.email,
      );
      var emailArr = data.members.filter(
        user => user.email !== loggedInData.email,
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
      members: worksapceMembersExceptLogedUser,
    });
    this.createUserProjectList();
  }

  async componentDidUpdate(prevProps, prevState) {
    if (
      prevState.searchProjectIds !== this.state.searchProjectIds ||
      prevState.searchUserDetail !== this.state.searchUserDetail ||
      prevState.isLoading !== this.state.isLoading
    ) {
      var searchData = {
        user_id: this.state.searchUserDetail
          ? this.state.searchUserDetail.member_id
          : this.state.userId,
        project_ids: JSON.stringify(this.state.searchProjectIds),
      };

      try {
        const { data } = await get(
          `workspaces/${this.state.workspaceId}/members`,
        );
        var userArr = data.members.map(user => user.email);
        var worksapceUsers = data.members;
        var worksapceMembersExceptLogedUser = data.members.filter(
          user => user.email !== this.state.userEmail,
        );
      } catch (e) {
        console.log("users Error", e);
      }

      this.setState({
        users: userArr,
        worksapceUsers: worksapceUsers,
        members: worksapceMembersExceptLogedUser,
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
    let routeName = route.split("/")[1];
    if (routeName === "members") {
      return "membersTrue";
    } else {
      return false;
    }
  };

  checkAll = e => {
    const allCheckboxChecked = e.target.checked;
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
    this.setState({ isDeleteShow: true });
  };

  handleCheck = e => {
    const value = e.target.checked;
  };

  displayProjects = projects => {
    let arr = projects.map(project => project.name);
    // let arr = ["jskjs", "sjsks", "jsksks", "skskksk"];
    let projectShow = arr.length > 1 ? arr[0] + "," + arr[1] : arr[0];
    return projectShow;
  };

  countProject = projects => {
    let arr = projects.map(project => project.name);
    // let arr = ["jskjs", "sjsks", "jsksks", "skskksk"];

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
    console.log("member id", id);
    this.setState({ isProjectListShow: true, projectShowMemberId: id });
  };

  countProjectViewClose = () => {
    this.setState({ isProjectListShow: false });
  };

  handleClose = () => {
    this.setState({
      show: false,
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
      memberProjects: member.projects,
    });
  };

  editMemberHandleChange = e => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  };

  handleSearchFilterResult = data => {
    var searchUserDetail = "";
    var projectIds = [];
    {
      data.map((item, i) => {
        if (item.type === "member") {
          searchUserDetail = item;
        } else if (item.type === "project") {
          projectIds.push(item.project_id);
        }
      });
    }
    this.setState({
      searchProjectIds: projectIds,
      searchUserDetail: searchUserDetail,
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
            id: (index += 1),
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
          role: member.role,
        });
      });
    }
    this.setState({ searchOptions: searchOptions });
    this.props.setSearchOptions(searchOptions);
  };

  handleLoad = value => {
    this.setState({ isLoading: value });
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
          state={this.state}
        />
        <div className="show-projects">
          <div className="members"></div>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">
                  <div className="custom-control custom-checkbox">
                    <input
                      type="checkbox"
                      className="custom-control-input"
                      id={`customCheck`}
                      onChange={this.checkAll}
                      name="chk[]"
                    />
                    <label
                      className="custom-control-label"
                      htmlFor={`customCheck`}></label>
                  </div>
                </th>
                <th scope="col">ID</th>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Role</th>
                <th scope="col">Working Hours</th>
                <th scope="col">Projects</th>
                <th scope="col">Invitation</th>
                <th scope="col">Created Date</th>
              </tr>
            </thead>
            <tbody>
              {this.state.members.map((member, index) => {
                return (
                  <tr key={index}>
                    <td>
                      <div className="custom-control custom-checkbox">
                        <input
                          type="checkbox"
                          className="custom-control-input"
                          id={`customCheck${index}`}
                          name="isChecked"
                          onChange={this.handleCheck}
                        />
                        <label
                          className="custom-control-label"
                          htmlFor={`customCheck${index}`}></label>
                      </div>
                    </td>
                    <td>{index + 1}</td>
                    <td className="text-titlize">{member.name}</td>
                    <td>{member.email}</td>
                    <td className="text-titlize">{member.role}</td>
                    <td className="text-titlize">
                      {member.workingHours ? member.workingHours : "8"} hours
                    </td>
                    <td className="text-titlize">
                      <span>{this.displayProjects(member.projects)}</span>
                      <span
                        className="project-count"
                        style={{ pointer: "cursor" }}
                        onMouseMove={e => this.countProjectView(e, member.id)}>
                        {this.countProject(member.projects)}
                      </span>
                      {this.state.isProjectListShow &&
                        this.state.projectShowMemberId === member.id ? (
                          <div className="project-count-list-show">
                            <div className="close-div">
                              <a onClick={this.countProjectViewClose}>
                                <i class="fa fa-times" aria-hidden="true"></i>
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
                        onClick={e => this.handleShow(e, member)}>
                        <i className="fas fa-pencil-alt"></i>
                      </button>
                      {this.state.show &&
                        this.state.projectShowMemberId === member.id ? (
                          <EditMemberModal
                            show={this.state.show}
                            handleClose={this.handleClose}
                            state={this.state}
                            editMemberHandleChange={this.editMemberHandleChange}
                          />
                        ) : null}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </>
    );
  }
}

export default withRouter(ShowMembers);
