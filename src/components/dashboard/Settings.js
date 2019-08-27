import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import Header from "./Header";
import { get, post, logout, mockPost } from "../../utils/API";

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      workspaces: [],
      workspaceId: "",
      projectNames: [],
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
  }

  render() {
    return (
      <div>
        <Header
          logout={this.logout}
          workspaces={this.state.workspaces}
          workspaceId={this.state.workspaceId}
        />
        <table class="table">
          <thead>
            <tr>
              <th scope="col" />
              <th scope="col">Workspace Name</th>
              <th scope="col">Settings</th>
            </tr>
          </thead>
          <tbody>
            {this.state.workspaces.map((workspace, index) => {
              return (
                <tr>
                  <th scope="row">{index + 1}</th>
                  <td>{workspace.name}</td>
                  <td>
                    <Link to={`settings/${workspace.id}`}>
                      <i className="fa fa-cog" aria-hidden="true" />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default withRouter(Settings);
