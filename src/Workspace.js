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
import TaskList from "./components/dashboard/TaskList";
import TaskProjectList from "./components/TaskList/TaskProjectList";
import Milestone from './components/Milestone/Milestone';
import Allocation from './components/ResourceAllocation/Allocation';
import { get, put, logout } from "./utils/API";
import Sidebar from "./components/dashboard/Sidebar";
import MenuBar from "./components/dashboard/MenuBar";
import Header from "./components/dashboard/Header";
import { ToastContainer } from "react-toastify";
import TaskBottomPopup from "./components/dashboard/TaskBottomPopup";
import { WORKSPACE_ID, DATE_FORMAT1, HHMMSS } from "./utils/Constants";
import { getWorkspaceId } from "./utils/function";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { workspaceNameSplit } from "./utils/function";
import moment from "moment";
import { base } from "./../src/base";
import "../src/assets/css/loader.scss";
import VideoLoader from "./components/dashboard/VideoLoader";
class Workspace extends Component {
  constructor(props) {
    super(props);
    this.Routes = [
      {
        path: "/dashboard",
        exact: false,
        component: Dashboard,
        title: "dashboard",
      },
      {
        path: "/settings",
        exact: true,
        component: Settings,
        title: "settings",
      },
      // {
      //   path: "/analysis",
      //   exact: true,
      //   component: Analysis,
      //   title: "analysis"
      // },
      {
        path: "/projects",
        exact: true,
        component: ShowProjects,
        title: "showProjects",
      },
      {
        path: "/members",
        exact: true,
        component: ShowMembers,
        title: "showMembers",
      },
      {
        path: "/reports",
        exact: true,
        component: Reports,
        title: "reports",
      },
      {
        path: "/task_list",
        exact: true,
        component: TaskList,
        title: "taskList",
      },
      {
        path: "/TaskProjectList",
        exact: true,
        component: TaskProjectList,
        title: "TaskProjectList",
      },
      {
        path: "/milestone",
        exact: true,
        component: Milestone,
        title: "milestone",
      },
      {
        path: "/allocation",
        exact: true,
        component: Allocation,
        title: "allocation",
      },
      {
        component: NotFound,
        title: "pageNotFound",
      },
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
      event: null,
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
      var workspace = workspacesData.filter((ws) => ws.id == workspaceId);
      if (workspace.length > 0 && workspace[0]) {
        cookie.save("workspaceName", workspaceNameSplit(workspace[0].name), {
          path: "/",
        });
      }
      // let notificataionData = await get(
      //   `users/${workspaceId}/notifications`
      // );
      // this.setState({ notifications: notificataionData && notificataionData.data ? notificataionData.data.notifications : [] })
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
      loggedInUserName: userData.name,
    });
  }

  UNSAFE_componentWillMount = () => {
    var workspaceId = this.props.match.params.workspaceId;

    base
      .database()
      .ref(`task_stopped/${workspaceId}`)
      .on("child_added", (snap) => {
        if (this.state.event && this.state.event.taskId == snap.key) {
          this.setState({ event: null });
        }
      });

    base
      .database()
      .ref(`task_stopped/${workspaceId}`)
      .on("child_changed", (snap) => {
        if (this.state.event && this.state.event.taskId == snap.key) {
          this.setState({ event: null });
        }
      });
  };

  componentWillUnmount() { }

  logout = async () => {
    await logout();
    this.props.history.push("/login");
  };

  handleSearchFilterResult = (data) => {
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
      searchUserDetails: searchUserDetails,
    });
  };

  setSearchOptions = (searchOptions) => {
    this.setState({ searchOptions: searchOptions });
  };

  handleLoad = (value) => {
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
      state: this.state,
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
    return <Redirect to={`/workspace/${getWorkspaceId()}/dashboard`} />;
  };

  // handleTaskBottomPopup = (startOn, event, trackStatus) => {
  //   if (trackStatus === "start") {
  //     this.setState({
  //       event: event,
  //     });
  //   } else if (trackStatus === "stop") {
  //     this.setState({
  //       event: "STOP",
  //     });
  //   }
  // };

  handleTaskBottomPopup = (startOn, event, trackStatus) => {
    if (trackStatus === "start") {
      this.setState({
        event: event,
      });
    } else if (trackStatus === "stop") {
      this.setState({
        event: null,
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
      var taskDate = {
        end_time: new Date(),
        status: "stopped",
      };
      var taskId = this.state.event.id.split("-")[0];
      try {
        const { data } = await put(taskDate, `tasks/${taskId}/stop-tracking`);
      } catch (e) { }
      this.setState({
        event: null,
      });
    }
  };

  updateWorkspaces = (workspace) => {
    if (workspace) {
      this.setState({ workspaces: [...this.state.workspaces, workspace] });
    }
  };

  readAllNotification = async () => {
    if (this.state.notifications) {
      let notification_ids = this.state.notifications.map((data) => {
        return data.id;
      });
      let params = {
        notification_ids: notification_ids,
      };
      try {
        const { data } = await put(
          params,
          `users/${this.state.workspaceId}/notifications/mark_all_as_read`
        );
        this.setState({
          notifications: [],
        });
      } catch (e) {
        console.log("error", e);
      }
    }
  };

  render() {
    return (
      <div>
        {this.state.isLoading ? (
          <div className="loading1">
            <VideoLoader />
          </div>
        ) : null}
        <ToastContainer />
        <div
          className="row no-margin"
          style={this.state.isLoading ? { pointerEvents: "none" } : {}}
        >
          <Sidebar
            workspaces={this.state.workspaces}
            workspaceId={this.state.workspaceId}
            workspaceName={this.state.workspaceName}
            callWorkspace={this.callWorkspace}
            userInfo={this.state.loggedInUserInfo}
            updateWorkspaces={this.updateWorkspaces}
          />
          <div className="dashboard-main no-padding">
            <Header
              notification={this.state.notifications}
              logout={this.logout}
              workspaces={this.state.workspaces}
              workspaceId={this.state.workspaceId}
              userData={this.state.loggedInUserInfo}
              searchOptions={this.state.searchOptions}
              pathname={this.classNameRoute()}
              readAllNotification={this.readAllNotification}
              workspaceName={this.state.workspaceName}
              loggedInUserName={this.state.loggedInUserName}
              handleSearchFilterResult={this.handleSearchFilterResult}
            />

            {/* {this.state.isLoading ? (
              <Loader
                type="Oval"
                color="#1f8354"
                height={50}
                width={50}
                className="d-inline-block dailyploy-loader"
              />
            ) : null} */}
            <Switch>
              {this.Routes.map((route, i) => (
                <Route
                  key={i}
                  exact={route.exact}
                  path={this.props.props.match.path + route.path}
                  render={(props) =>
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
