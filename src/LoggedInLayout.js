import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import cookie from "react-cookies";
import { ToastContainer } from "react-toastify";
import Sidebar from "./components/dashboard/Sidebar";
import { get, logout } from "./utils/API";
import Header from "./components/dashboard/Header";

class LoggedInLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      workspaceId: null,
      workspaces: [],
      loggedInUserInfo: {},
    };
  }

  async componentDidMount() {
    //Logged In User
    try {
      const { data } = await get("logged_in_user");
      var userData = data;
      cookie.save("loggedInUser", data);
    } catch (e) {
      console.log("err", e);
    }

    this.getWorkspaceParams();
    // workspace Listing
    try {
      const { data } = await get("workspaces");
      var workspacesData = data.workspaces;
    } catch (e) {
      console.log("err", e);
    }

    this.setState({
      workspaces: workspacesData,
      loggedInUserInfo: userData,
    });
  }

  getWorkspaceParams = () => {
    const { workspaceId } = this.props.match.params;
    this.setState({ workspaceId: workspaceId });
  };

  logout = async () => {
    await logout();
    this.props.history.push("/login");
  };

  mainComponent = () => {
    const { props, RouteComponent, title } = this.props;
    if (title !== "login" && title !== "signup" && title !== "landing") {
      return <RouteComponent {...props} />;
    }
  };
  render() {
    return (
      <>
        <ToastContainer />
        <div className="row no-margin">
          <Sidebar
            workspaces={this.state.workspaces}
            workspaceId={this.state.workspaceId}
          />
          {/* <div className="dashboard-main no-padding">
            <Header
              logout={this.logout}
              workspaces={this.state.workspaces}
              workspaceId={this.state.workspaceId}
              userData={this.state.loggedInUserInfo}
            /> */}

          {this.mainComponent()}
          {/* </div> */}
        </div>
      </>
    );
  }
}

export default withRouter(LoggedInLayout);
