import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import Header from "./Header";
import { get, post, logout, mockPost } from "../../utils/API";
import MenuBar from "./MenuBar";

class Analysis extends Component {
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
        <br />
        <h1>Analysis</h1>
      </>
    );
  }
}

export default withRouter(Analysis);
