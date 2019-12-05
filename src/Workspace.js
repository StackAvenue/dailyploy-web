import React, { Component } from "react";
import { Route, withRouter, Switch, Redirect } from "react-router-dom";
import Dashboard from "./containers/Dashboard";
import NotFound from "./components/NoMatch";
import Settings from "./components/dashboard/Settings";
import cookie from "react-cookies";
import Analysis from "./components/dashboard/Analysis";
import Reports from "./components/dashboard/Reports";
import ShowProjects from "./components/dashboard/ShowProjects";
import ShowMembers from "./components/dashboard/ShowMembers";
import { get, logout } from "./utils/API";
import Sidebar from "./components/dashboard/Sidebar";
import Header from "./components/dashboard/Header";
import { ToastContainer } from "react-toastify";

class Workspace extends Component {
  constructor(props) {
    super(props);
    this.Routes = [
      {
        path: "/dashboard",
        exact: false,
        component: Dashboard,
        title: "dashboard"
      },
      {
        path: "/settings",
        exact: true,
        component: Settings,
        title: "settings"
      },
      {
        path: "/analysis",
        exact: true,
        component: Analysis,
        title: "analysis"
      },
      {
        path: "/projects",
        exact: true,
        component: ShowProjects,
        title: "showProjects"
      },
      {
        path: "/members",
        exact: true,
        component: ShowMembers,
        title: "showMembers"
      },
      {
        path: "/reports",
        exact: true,
        component: Reports,
        title: "reports"
      },
      {
        component: NotFound,
        title: "pageNotFound"
      }
    ];
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

    var workspaceId = this.props.match.params.workspaceId;

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
      isLoading: false,
      workspaceId: workspaceId
    });
  }

  logout = async () => {
    await logout();
    this.props.history.push("/login");
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
    let route = this.props.props.history.location.pathname;
    return route.split("/")[3];
  };

  isAllowed = (props, RouteComponent, title) => {
    var props1 = {
      setSearchOptions: this.setSearchOptions,
      handleSearchFilterResult: this.handleSearchFilterResult,
      searchProjectIds: this.state.searchProjectIds,
      searchUserDetails: this.state.searchUserDetails,
      handleLoading: this.handleLoad
    };
    var newProps = { ...props, ...props1 };
    // if (title !== "login" && title !== "signup" && title !== "landing") {
    return <RouteComponent {...newProps} />;
    // }
    // return <Redirect to={`/workspace/${this.state.workspaceId}/dashboard`} />;
  };

  render() {
    return (
      <div>
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
            {this.state.isLoading ? <div className="loader"></div> : null}
            <Switch>
              {this.Routes.map((route, i) => (
                <Route
                  key={i}
                  exact={route.exact}
                  path={this.props.props.match.path + route.path}
                  render={props =>
                    this.isAllowed(props, route.component, route.title)
                  }
                />
              ))}
              <Route />
            </Switch>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Workspace);
