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
    };
  }
  logout = async () => {
    await logout();
    this.props.history.push("/login");
  };
  async componentDidMount() {
    try {
      const { data } = await get("workspaces");
      this.setState({ workspaces: data.workspaces });
    } catch (e) {
      console.log("err", e);
    }

    this.getWorkspaceParams();

    try {
      const { data } = await mockGet("members");
      // console.log(data);
      this.setState({ members: data });
    } catch (e) {
      console.log("err", e);
    }
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
            />
            <div className="show-projects">
              <div className="members"></div>
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">
                      <div className="checkbox">
                        <input type="checkbox" id="checkbox" name="" value="" />
                        <label htmlFor="checkbox"></label>
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
                      <tr>
                        <td>
                          <div className="checkbox">
                            <input
                              type="checkbox"
                              id={`checkbox${index}`}
                              name=""
                              value=""
                            />
                            <label htmlFor={`checkbox${index}`}></label>
                          </div>
                        </td>
                        <td>{index + 1}</td>
                        <td>{member.member.member_name}</td>
                        <td>{member.member.member_email}</td>
                        <td>Edit</td>
                        <td>{member.member.member_role}</td>
                        <td>{member.member.member_workingHours} hours</td>
                        <td>{member.member.member_project}</td>
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
