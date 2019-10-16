import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Header from "./Header";
import { get, logout, mockGet } from "../../utils/API";
import MenuBar from "./MenuBar";
import Sidebar from "./Sidebar";

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
        `workspaces/${this.state.workspaceId}/projects`
      );
      var projectsData = data.projects;
    } catch (e) {
      console.log("err", e);
    }

    // workspace Member Listing
    try {
      const { data } = await get(
        `workspaces/${this.state.workspaceId}/members`
      );
      var userArr = data.members.map(user => user.email);
      var worksapceMembersExceptLogedUser = data.members.filter(user => user.email !== loggedInData.email)
      var emailArr = worksapceMembersExceptLogedUser.map(user => user.email);
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
      members: worksapceMembersExceptLogedUser,
    });
  }

  getWorkspaceParams = () => {
    const { workspaceId } = this.props.match.params;
    this.setState({ workspaceId: workspaceId });
  };

  onSelectSort = value => {
    console.log("selected value ", value);
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

  render() {
    return (
      <>
        <div className="row no-margin">
          <Sidebar workspaces={this.state.workspaces} />
          <div className="dashboard-main no-padding">
            <Header
              logout={this.logout}
              workspaces={this.state.workspaces}
              workspaceId={this.state.workspaceId}
            />
            <MenuBar
              onSelectSort={this.onSelectSort}
              workspaceId={this.state.workspaceId}
              classNameRoute={this.classNameRoute}
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
                          htmlFor={`customCheck`}
                        ></label>
                      </div>
                    </th>
                    <th scope="col">ID</th>
                    <th scope="col">Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Access</th>
                    <th scope="col">Role</th>
                    <th scope="col">Working Hours</th>
                    <th scope="col">Projects</th>
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
                              htmlFor={`customCheck${index}`}
                            ></label>
                          </div>
                        </td>
                        <td>{index + 1}</td>
                        <td>{member.name}</td>
                        <td>{member.email}</td>
                        <td>Edit</td>
                        <td>{member.role ? member.role : "Member"}</td>
                        <td>{member.workingHours ? member.workingHours : ""} hours</td>
                        <td>{member.member_project ? member.member_project : ""}</td>
                        <td>
                          <i className="fas fa-pencil-alt"></i>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default withRouter(ShowMembers);
