import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import Header from "./Header";
import { get, post, logout, mockPost } from "../../utils/API";
import MenuBar from "./MenuBar";

class ShowMembers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      workspaces: [],
      workspaceId: "",
      projectNames: [],
      sort: "week",
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
  }

  getWorkspaceParams = () => {
    const { workspaceId } = this.props.match.params;
    this.setState({ workspaceId: workspaceId });
  };

  onSelectSort = value => {
    console.log("selected value ", value);
    this.setState({ sort: value });
  };

  render() {
    return (
      <>
        <Header
          logout={this.logout}
          workspaces={this.state.workspaces}
          workspaceId={this.state.workspaceId}
        />
        <MenuBar
          onSelectSort={this.onSelectSort}
          workspaceId={this.state.workspaceId}
        />
        <div className="show-projects">
          <div className="views"></div>
          <table class="table">
            <thead>
              <tr>
                <th scope="col">
                  <div class="checkbox">
                    <input type="checkbox" id="checkbox" name="" value="" />
                    <label for="checkbox"></label>
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
              <td>
                <div class="checkbox">
                  <input type="checkbox" id={`checkbox1`} name="" value="" />
                  <label for={`checkbox1`}></label>
                </div>
              </td>
              <td>1</td>
              <td>Arpit Jain</td>
              <td>jarpit1298@gmail.com</td>
              <td>View</td>
              <td>Admin</td>
              <td>8 hours</td>
              <td>Dailyploy</td>
            </tbody>
          </table>
        </div>
      </>
    );
  }
}

export default withRouter(ShowMembers);
