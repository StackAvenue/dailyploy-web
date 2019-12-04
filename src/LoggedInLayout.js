import React, { Component } from "react";
import { withRouter, Redirect } from "react-router-dom";
import cookie from "react-cookies";
import { ToastContainer } from "react-toastify";
import Sidebar from "./components/dashboard/Sidebar";
import { get, logout } from "./utils/API";
import Header from "./components/dashboard/Header";
import { WORKSPACE_ID } from "./utils/Constants";
import "./assets/css/loading.scss";

class LoggedInLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      workspaceId: null,
      workspaces: [],
      loggedInUserInfo: {},
      userRole: "",
      searchOptions: [],
      searchProjectIds: [],
      searchUserDetails: [],
      isLoading: false
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
      this.setState({ isLoading: true });
    } catch (e) {
      console.log("err", e);
    }

    this.setState({
      workspaces: workspacesData,
      loggedInUserInfo: userData,
      isLoading: false
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
    var props1 = {
      setSearchOptions: this.setSearchOptions,
      handleSearchFilterResult: this.handleSearchFilterResult,
      searchProjectIds: this.state.searchProjectIds,
      searchUserDetails: this.state.searchUserDetails,
      handleLoading: this.handleLoad
    };
    var newProps = { ...props, ...props1 };
    if (title !== "login" && title !== "signup" && title !== "landing") {
      return <RouteComponent {...newProps} />;
    }
    return <Redirect to={`/dashboard/${WORKSPACE_ID}`} />;
  };

  handleSearchFilterResult = data => {
    var searchUserDetails = [];
    var projectIds = [];
    if (data) {
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

  setSearchOptions = searchOptions => {
    this.setState({ searchOptions: searchOptions });
  };

  handleLoad = value => {
    this.setState({ isLoading: value });
  };

  classNameRoute = () => {
    let route = this.props.history.location.pathname;
    return route.split("/")[1];
  };

  render() {
    return (
      <>
        {this.state.isLoading ? (
          <div className="loading">Loading&#8230;</div>
        ) : null}

        <ToastContainer />
        <div className="row no-margin">
          <Sidebar
            workspaces={this.state.workspaces}
            workspaceId={this.state.workspaceId}
          />

          <div className="dashboard-main no-padding">
            <Header
              logout={this.logout}
              workspaces={this.state.workspaces}
              workspaceId={this.state.workspaceId}
              userData={this.state.loggedInUserInfo}
              searchOptions={this.state.searchOptions}
              pathname={this.classNameRoute()}
              handleSearchFilterResult={this.handleSearchFilterResult}
            />

            {this.mainComponent()}
          </div>
        </div>
      </>
    );
  }
}

export default withRouter(LoggedInLayout);
