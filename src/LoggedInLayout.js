import React, { Component } from "react";
import { withRouter, Redirect } from "react-router-dom";
import cookie from "react-cookies";
import { ToastContainer } from "react-toastify";
import Sidebar from "./components/dashboard/Sidebar";
import { get, logout } from "./utils/API";
import Header from "./components/dashboard/Header";
import { WORKSPACE_ID } from "./utils/Constants";
import "./assets/css/loading.scss";
import TaskBottomPopup from "./../src/components/dashboard/TaskBottomPopup";
import { pipelineTopicExpression } from "@babel/types";

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
      isLoading: false,
      startOn: "",
      colorCode: "",
      taskId: "",
      taskTitle: "",
      showPopup: false,
      runningTime: 0,
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

    var startOn = localStorage.getItem('startOn')
    var taskId = localStorage.getItem('taskId')
    var colorCode = localStorage.getItem('colorCode')
    var taskTitle = localStorage.getItem('taskTitle')

    this.setState({
      workspaces: workspacesData,
      loggedInUserInfo: userData,
      isLoading: false,
      startOn: startOn,
      taskId: taskId,
      colorCode: colorCode,
      taskTitle: taskTitle,
    });

  }

  componentDidUpdate = (prevProps, prevState) => {
    if (prevState.startOn !== this.state.startOn) {
      var startOn = localStorage.getItem('startOn')
      var taskId = localStorage.getItem('taskId')
      var colorCode = localStorage.getItem('colorCode')
      var taskTitle = localStorage.getItem('taskTitle')

      this.setState({
        startOn: startOn,
        taskId: taskId,
        colorCode: colorCode,
        taskTitle: taskTitle,
      });
    }
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
      handleLoading: this.handleLoad,
      handleTaskBottomPopup: this.handleTaskBottomPopup,
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
      searchUserDetails: searchUserDetails,
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

  handleTaskBottomPopup = (startOn) => {
    this.setState({ startOn: startOn })
  }

  handleReset = () => {
    clearInterval(this.timer);
    this.setState({ runningTime: 0 });
  };

  formattedSeconds = (ms) => {
    var totalSeconds = (ms / 1000)
    var h = Math.floor(totalSeconds / 3600);
    var m = Math.floor((totalSeconds % 3600) / 60);
    var s = Math.floor((totalSeconds % 3600) % 60);
    return ("0" + h).slice(-2) + ":" + ("0" + m).slice(-2) + ":" + ("0" + s).slice(-2);
  }

  runningFormattedTimer = () => {
    this.setState(state => {
      const startTime = state.runningTask.startOn - this.state.runningTime;
      // this.timer = setInterval(() => {
      //   this.setState({ runningTime: Date.now() - startTime });
      // });
      return {
        showPopup: !state.showPopup,
      };
    });
  }

  isBottomPopup = () => {
    return this.state.taskTitle != "" && this.state.startOn != "" && this.state.taskId != "" && this.state.colorCode != ""
  }

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
            {console.log(this.isBottomPopup())}
            {this.state.taskTitle && this.state.startOn && this.state.taskId && this.state.colorCode ?
              <TaskBottomPopup
                bgColor={this.state.colorCode}
                taskTitle={this.state.taskTitle}
                taskId={this.state.taskId}
                startOn={this.state.startOn}
              />
              : null}
          </div>
        </div>
      </>
    );
  }
}

export default withRouter(LoggedInLayout);
