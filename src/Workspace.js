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
import Header from "./components/dashboard/Header";
import { ToastContainer } from "react-toastify";
import TaskBottomPopup from "./components/dashboard/TaskBottomPopup";
import { WORKSPACE_ID } from "./utils/Constants";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { workspaceNameSplit } from "./utils/function";

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
      showPopup: false,
      runningTime: 0,
      isStart: false,
      onGoingTask: false,
      isLoading: false,
      workspaceName: "",
      loggedInUserName: "",
      timeTracked: []
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

    var startOn = localStorage.getItem(`startOn-${workspaceId}`);
    var taskId = localStorage.getItem(`taskId-${workspaceId}`);
    var colorCode = localStorage.getItem(`colorCode-${workspaceId}`);
    var taskTitle = localStorage.getItem(`taskTitle-${workspaceId}`);
    var timeTracked = [];
    if (taskId) {
      taskId = taskId.split("-")[0];
      try {
        const { data } = await get(`tasks/${taskId}`);
        timeTracked = data.time_tracked;
      } catch (e) {}
    }

    this.setState({
      workspaces: workspacesData,
      loggedInUserInfo: userData,
      isLoading: false,
      startOn: startOn,
      taskId: taskId,
      colorCode: colorCode,
      taskTitle: taskTitle,
      workspaceId: workspaceId,
      isStart: taskTitle && startOn && taskId && colorCode,
      workspaceName:
        workspace.length > 0 && workspace[0]
          ? workspaceNameSplit(workspace[0].name)
          : "",
      loggedInUserName: userData.name,
      timeTracked: timeTracked
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

  handleTaskBottomPopup = (startOn, timeTracked) => {
    var startOn = localStorage.getItem(`startOn-${this.state.workspaceId}`);
    var taskId = localStorage.getItem(`taskId-${this.state.workspaceId}`);
    var colorCode = localStorage.getItem(`colorCode-${this.state.workspaceId}`);
    var taskTitle = localStorage.getItem(`taskTitle-${this.state.workspaceId}`);

    this.setState({
      startOn: startOn,
      taskId: taskId,
      colorCode: colorCode,
      taskTitle: taskTitle,
      timeTracked:
        startOn != "" && timeTracked && timeTracked.length > 0
          ? timeTracked
          : [],
      isStart:
        taskTitle != "" && startOn != "" && taskId != "" && colorCode != ""
    });
  };

  isBottomPopup = () => {
    return (
      this.state.taskTitle &&
      this.state.startOn &&
      this.state.taskId &&
      this.state.colorCode
    );
  };

  stopOnGoingTask = async () => {
    if (this.state.isStart) {
      var localTaskId = localStorage.getItem(
        `taskId-${this.state.workspaceId}`
      );
      localTaskId = localTaskId.split("-")[0];
      if (localTaskId == this.state.taskId) {
        var taskDate = {
          end_time: new Date(),
          status: "stopped"
        };
        var taskId = this.state.taskId.split("-")[0];
        try {
          const { data } = await put(taskDate, `tasks/${taskId}/stop-tracking`);
        } catch (e) {}
        localStorage.setItem(`startOn-${this.state.workspaceId}`, "");
        localStorage.setItem(`taskId-${this.state.workspaceId}`, "");
        localStorage.setItem(`colorCode-${this.state.workspaceId}`, "");
        localStorage.setItem(`taskTitle-${this.state.workspaceId}`, "");

        this.setState({
          startOn: "",
          taskId: "",
          colorCode: "",
          taskTitle: "",
          isStart: false
        });
      }
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
        {this.state.isStart ? (
          <TaskBottomPopup
            bgColor={this.state.colorCode}
            taskTitle={this.state.taskTitle}
            taskId={this.state.taskId}
            startOn={this.state.startOn}
            isStart={this.state.isStart}
            timeTracked={this.state.timeTracked}
            stopOnGoingTask={this.stopOnGoingTask}
          />
        ) : null}
      </div>
    );
  }
}

export default withRouter(Workspace);
