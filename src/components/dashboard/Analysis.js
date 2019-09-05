import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import Header from "./Header";
import { get, post, logout, mockPost } from "../../utils/API";
import MenuBar from "./MenuBar";
import Sidebar from "./Sidebar";

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

  classNameRoute = () => {
    let route = this.props.history.location.pathname;
    let routeName = route.split("/")[1];
    if (routeName === "analysis") {
      return "analysisTrue";
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
            <br />
            <h1>Analysis</h1>
          </div>
        </div>
      </>
    );
  }
}

export default withRouter(Analysis);
