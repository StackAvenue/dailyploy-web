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
import { get, put, logout } from "./utils/API";
import Sidebar from "./components/dashboard/Sidebar";
import MenuBar from "./components/dashboard/MenuBar";
import Header from "./components/dashboard/Header";
import { ToastContainer } from "react-toastify";
import TaskBottomPopup from "./components/dashboard/TaskBottomPopup";
import { WORKSPACE_ID, DATE_FORMAT1, HHMMSS } from "./utils/Constants";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { workspaceNameSplit } from "./utils/function";
import moment from "moment";

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
      isLoading: false,
      startOn: "",
      colorCode: "",
      taskId: "",
      taskTitle: "",
      icon: "",
      showPopup: false,
      runningTime: 0,
      isStart: false,
      onGoingTask: false,
      isLoading: false,
      workspaceName: "",
      loggedInUserName: "",
      timeTracked: [],
      event: null
    };
  }

  async componentDidMount() {
    //Logged In User
    try {
      const { data } = await get("logged_in_user");
      cookie.save("loggedInUser", data);
      var userData = data;
    } catch (e) {
      console.log("err", e);
    }

    var workspaceId = this.props.match.params.workspaceId;

    // workspace Listing
    try {
      const { data } = await get("workspaces");
      var workspacesData = data.workspaces;
      this.setState({ isLoading: true });
      var workspace = workspacesData.filter(ws => ws.id == workspaceId);
      if (workspace.length > 0 && workspace[0]) {
        cookie.save("workspaceName", workspaceNameSplit(workspace[0].name), {
          path: "/"
        });
      }
    } catch (e) {
      console.log("err", e);
    }

    this.setState({
      workspaces: workspacesData,
      loggedInUserInfo: userData,
      isLoading: false,
      workspaceId: workspaceId,
      workspaceName:
        workspace.length > 0 && workspace[0]
          ? workspaceNameSplit(workspace[0].name)
          : "",
      loggedInUserName: userData.name
    });
  }

  handleReset = () => {
    localStorage.setItem(`startOn-${this.state.workspaceId}`, "");
    localStorage.setItem(`taskId-${this.state.workspaceId}`, "");
    localStorage.setItem(`colorCode-${this.state.workspaceId}`, "");
    localStorage.setItem(`taskTitle-${this.state.workspaceId}`, "");
  };

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

  workspaceNameUpdate = (name, value) => {
    this.setState({ [name]: value });
  };

  isAllowed = (props, RouteComponent, title) => {
    var props1 = {
      setSearchOptions: this.setSearchOptions,
      handleSearchFilterResult: this.handleSearchFilterResult,
      searchProjectIds: this.state.searchProjectIds,
      searchUserDetails: this.state.searchUserDetails,
      handleTaskBottomPopup: this.handleTaskBottomPopup,
      handleLoading: this.handleLoad,
      workspaceNameUpdate: this.workspaceNameUpdate,
      state: this.state
    };
    var newProps = { ...props, ...props1 };
    if (
      title !== "login" &&
      title !== "signup" &&
      title !== "landing" &&
      title !== "pageNotFound"
    ) {
      return <RouteComponent {...newProps} />;
    }
    return <Redirect to={`/workspace/${WORKSPACE_ID}/dashboard`} />;
  };

  handleTaskBottomPopup = (startOn, event, trackStatus) => {
    if (trackStatus === "start") {
      this.setState({
        event: event
      });
    } else if (trackStatus === "stop") {
      this.setState({
        event: null
      });
    }
  };

  isBottomPopup = () => {
    return (
      this.state.taskTitle != "" &&
      this.state.startOn != "" &&
      this.state.taskId != "" &&
      this.state.colorCode != ""
    );
  };

  stopOnGoingTask = async () => {
    if (this.state.event) {
      let d = moment(this.state.event.start).format(DATE_FORMAT1);
      let t = moment().format(HHMMSS);
      let newDateTime = moment(d + " " + t);
      var taskDate = {
        end_time: new Date(newDateTime),
        status: "stopped"
      };
      var taskId = this.state.event.id.split("-")[0];
      try {
        const { data } = await put(taskDate, `tasks/${taskId}/stop-tracking`);
      } catch (e) {}
      this.handleReset();
      this.setState({
        event: null
      });
    }
  };

  render() {
    return (
      <div>
        <ToastContainer />
        <div className="row no-margin">
          <Sidebar
            workspaces={this.state.workspaces}
            workspaceId={this.state.workspaceId}
            workspaceName={this.state.workspaceName}
          />
          <div className="dashboard-main no-padding">
            <Header
              logout={this.logout}
              workspaces={this.state.workspaces}
              workspaceId={this.state.workspaceId}
              userData={this.state.loggedInUserInfo}
              searchOptions={this.state.searchOptions}
              pathname={this.classNameRoute()}
              workspaceName={this.state.workspaceName}
              loggedInUserName={this.state.loggedInUserName}
              handleSearchFilterResult={this.handleSearchFilterResult}
            />

            {this.state.isLoading ? (
              <Loader
                type="Oval"
                color="#1f8354"
                height={50}
                width={50}
                className="d-inline-block dailyploy-loader"
              />
            ) : null}
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
        {this.state.event ? (
          <>
            <TaskBottomPopup
              event={this.state.event}
              stopOnGoingTask={this.stopOnGoingTask}
            />
          </>
        ) : null}
      </div>
    );
  }
}

export default withRouter(Workspace);
