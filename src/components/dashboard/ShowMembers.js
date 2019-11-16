import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Header from "./Header";
import { get, logout, mockGet } from "../../utils/API";
import MenuBar from "./MenuBar";
import Sidebar from "./Sidebar";
import moment from "moment";

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
    };
  }
  logout = async () => {
    await logout();
    this.props.history.push("/login");
  };
  async componentDidMount() {
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
  };

  handleCheck = e => {
    const value = e.target.checked;
  };

  displayProjects = projects => {
    let arr = projects.map(project => project.name);
    var projectShow;
    let count;
    if (arr.length > 2) {
      count = arr.length - 2;
    }
    if (arr.length > 2) {
      projectShow =
        arr.length > 1 ? arr[0] + "," + arr[1] + " +" + count : arr[0];
    } else {
      projectShow = arr.length > 1 ? arr[0] + "," + arr[1] : arr[0];
    }
    return projectShow;
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
    if (this.state.userRole === "admin" && this.state.worksapceUsers) {
      var otherMembers = this.state.worksapceUsers.filter(
        user => user.email !== this.state.userEmail,
      );
      {
        otherMembers.map((member, idx) => {
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
    }
    this.setState({ searchOptions: searchOptions });
  };

  handleLoad = value => {
    this.setState({ isLoading: value });
  };

  render() {
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
                      {this.displayProjects(member.projects)}
                    </td>
                    <td className={"text-titlize"}>
                      {/* <p
                            className={
                              member.invited ? "text-blue" : "text-green"
                            }>
                            {}
                          </p> */}
                      {!member.is_invited ? (
                        <p className="text-green">Accepted</p>
                      ) : (
                          <p className="text-blue">Invited</p>
                        )}
                    </td>
                    <td>{moment(member.created_at).format("DD MMM YY")}</td>
                    <td></td>
                    <td>
                      <i className="fas fa-pencil-alt"></i>
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
