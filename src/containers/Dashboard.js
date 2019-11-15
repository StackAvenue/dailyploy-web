import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { get, post, logout } from "../utils/API";
import moment from "moment";
import Header from "../components/dashboard/Header";
import "../assets/css/dashboard.scss";
import MenuBar from "../components/dashboard/MenuBar";
import Calendar from "../components/dashboard/Calendar";
import cookie from "react-cookies";
import { ToastContainer, toast } from "react-toastify";
import AddTaskModal from "../components/dashboard/AddTaskModal";
import Sidebar from "../components/dashboard/Sidebar";
import { getWeekFisrtDate, getFisrtDate } from "../utils/function";
import DailyPloyToast from "../components/DailyPloyToast";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.format = "h:mm a";
    this.now = moment()
      .hour(0)
      .minute(0);
    this.state = {
      taskName: "",
      projectName: "",
      taskUser: [],
      sort: "week",
      show: false,
      setShow: false,
      dateFrom: new Date(),
      dateTo: new Date(),
      timeFrom: "",
      timeTo: "",
      comments: "",
      userId: "",
      userName: "",
      workspaces: [],
      workspaceId: "",
      projects: [],
      users: [],
      resources: [],
      events: [],
      isLoading: false,
      userEmail: "",
      isLogedInUserEmailArr: [],
      taskFrequency: "weekly",
      taskStartDate: moment().format("YYYY-MM-DD"),
    };
  }

  taskView = view => {
    var viewType;
    var type;
    if (view == 0) {
      viewType = "daily";
      type = "day";
    } else if (view == 1) {
      viewType = "weekly";
      type = "week";
    } else if (view == 2) {
      viewType = "monthly";
      type = "month";
    }
    console.log("taskFrequency", viewType, view, this.state.taskStartDate);
    this.setState({
      taskFrequency: viewType,
      taskStartDate: getFisrtDate(new Date(), type),
    });
  };

  taskDate = date => {
    console.log("date", date);
    const { taskFrequency } = this.state;
    var type;
    if (taskFrequency === "daily") {
      type = "day";
    } else if (taskFrequency === "weekly") {
      type = "week";
    } else if (taskFrequency === "monthly") {
      type = "month";
    }
    console.log("type", type, date);
    this.setState({
      taskStartDate: getFisrtDate(date, type),
    });
  };

  async componentDidUpdate(prevProps, prevState) {
    if (
      prevState.taskStartDate !== this.state.taskStartDate ||
      prevState.taskFrequency !== this.state.taskFrequency ||
      prevState.isLoading !== this.state.isLoading
    ) {
      try {
        const { data } = await get(
          `workspaces/${this.state.workspaceId}/user_tasks?frequency=${this.state.taskFrequency}&start_date=${this.state.taskStartDate}`,
        );
        console.log("dta task", data.users);
        var tasksUser = data.users.map(user => {
          var usersObj = {
            id: user.id,
            name: user.name,
          };
          var tasks = user.tasks.map(task => {
            var tasksObj = {
              id: task.id,
              start: task.start_datetime,
              end: task.end_datetime,
              resourceId: user.id,
              title: task.name,
              bgColor: task.project.color_code,
            };
            return tasksObj;
          });
          return { usersObj, tasks };
        });
        var tasksResources = tasksUser.map(user => user.usersObj);
        var taskEvents = tasksUser.map(user => user.tasks).flat(2);
        this.setState({
          resources: tasksResources,
          events: taskEvents,
          isLoading: false,
        });
        console.log("taskEvents", taskEvents);
      } catch (e) {
        console.log("error", e);
      }
    }
  }

  async componentDidMount() {
    // Logged In User Info
    try {
      const { data } = await get("logged_in_user");
      var loggedInData = data;
    } catch (e) {
      console.log("err", e);
    }

    // workspace Listing
    try {
      const { data } = await get("workspaces");
      var workspacesData = data.workspaces;
    } catch (e) {
      console.log("err", e);
    }

    //get workspace Id
    this.getWorkspaceParams();
    this.auth();

    // worksapce project Listing
    try {
      const { data } = await get(
        `workspaces/${this.state.workspaceId}/projects`,
      );
      var projectsData = data.projects;
    } catch (e) {
      console.log("err", e);
    }

    // workspace Member Listing
    try {
      const { data } = await get(
        `workspaces/${this.state.workspaceId}/members`,
      );
      var userArr = data.members.map(user => user);
      var emailArr = data.members.filter(
        user => user.email !== loggedInData.email,
      );
    } catch (e) {
      console.log("users Error", e);
    }

    // workspace Tasks Listing
    console.log(
      "frequency",
      this.state.taskFrequency,
      "start_date",
      getWeekFisrtDate(this.state.taskStartDate),
    );
    try {
      const { data } = await get(
        `workspaces/${this.state.workspaceId}/user_tasks?frequency=${
          this.state.taskFrequency
        }&start_date=${getWeekFisrtDate(this.state.taskStartDate)}`,
      );
      this.props.handleLoading(true);
      console.log("dta task", data.users);
      var tasksUser = data.users.map(user => {
        var usersObj = {
          id: user.id,
          name:
            user.email === loggedInData.email ? user.name + " (Me)" : user.name,
        };
        var tasks = user.tasks.map(task => {
          var tasksObj = {
            id: task.id,
            start: task.start_datetime,
            end: task.end_datetime,
            resourceId: user.id,
            title: task.name,
            bgColor: task.project.color_code,
          };
          return tasksObj;
        });
        return { usersObj, tasks };
      });
      var tasksResources = tasksUser.map(user => user.usersObj);
      var taskEvents = tasksUser.map(user => user.tasks).flat(2);
      console.log("taskEvents", taskEvents);
    } catch (e) {
      console.log("error", e);
    }

    this.setState({
      userId: loggedInData.id,
      userName: loggedInData.name,
      userEmail: loggedInData.email,
      workspaces: workspacesData,
      projects: projectsData,
      users: userArr,
      isLogedInUserEmailArr: emailArr,
      resources: tasksResources,
      events: taskEvents,
    });

    this.props.handleLoading(false);

    // console.log("Did Mount");
  }

  getWorkspaceParams = () => {
    const { workspaceId } = this.props.match.params;
    this.setState({ workspaceId: workspaceId });
  };

  auth = () => {
    const token = cookie.load("authToken");
    if (token !== "undefined") {
      return this.props.history.push(`/dashboard/${this.state.workspaceId}`);
    } else {
      return this.props.history.push("/login");
    }
  };

  addTask = async () => {
    const taskData = {
      task: {
        name: this.state.taskName,
        member_ids: this.state.taskUser,
        start_datetime:
          moment(this.state.dateFrom).format("YYYY-MM-DD") +
          " " +
          this.state.timeFrom,
        end_datetime:
          moment(this.state.dateTo).format("YYYY-MM-DD") +
          " " +
          this.state.timeTo,
        comments: this.state.comments,
      },
    };
    try {
      const { data } = await post(
        taskData,
        `workspaces/${this.state.workspaceId}/projects/${this.state.projectName}/tasks`,
      );

      toast(
        <DailyPloyToast
          message="Task Created successfully!"
          status="success"
        />,
        { autoClose: 2000, position: toast.POSITION.TOP_CENTER },
      );
      // setTimeout(() => window.location.reload(), 3000);

      console.log("Task Data", data);
      this.setState({ show: false, isLoading: true });
    } catch (e) {
      console.log("error", e.response);
      this.setState({ show: false });
    }
  };

  onSelectSort = value => {
    console.log("selected value ", value);
    this.setState({ sort: value });
  };

  handleLoad = value => {
    this.setState({ isLoading: value });
  };

  logout = async () => {
    await logout();
    this.props.history.push("/login");
  };

  showTaskModal = () => {
    this.setState({
      setShow: true,
      show: true,
    });
  };

  closeTaskModal = () => {
    this.setState({
      show: false,
    });
  };

  handleDateFrom = date => {
    this.setState({ dateFrom: date });
  };
  handleDateTo = date => {
    this.setState({ dateTo: date });
  };

  handleTimeFrom = value => {
    this.setState({
      timeFrom: value != null ? value.format("HH:mm:ss") : null,
    });
  };

  handleTimeTo = value => {
    this.setState({
      timeTo: value != null ? value.format("HH:mm:ss") : null,
    });
  };

  handleUserSelect = e => {
    const { name, value } = e.target;
    let userIdArr = [];
    userIdArr.push(value);
    this.setState({ [name]: userIdArr });
  };

  handleInputChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  classNameRoute = () => {
    let route = this.props.history.location.pathname;
    let routeName = route.split("/")[1];
    if (routeName === "dashboard") {
      return "dashboardTrue";
    } else {
      return false;
    }
  };

  render() {
    console.log(
      "datwwwww",
      moment()
        .startOf("week")
        .format("YYYY-MM-DD"),
    );
    return (
      <>
        <MenuBar
          onSelectSort={this.onSelectSort}
          workspaceId={this.state.workspaceId}
          classNameRoute={this.classNameRoute}
          handleLoad={this.handleLoad}
          state={this.state}
        />
        <Calendar
          sortUnit={this.state.sort}
          workspaceId={this.state.workspaceId}
          resources={this.state.resources}
          events={this.state.events}
          alam={"alam"}
          taskView={this.taskView}
          taskDate={this.taskDate}
        />
        <div>
          <button className="btn menubar-task-btn" onClick={this.showTaskModal}>
            <i className="fas fa-plus" />
          </button>
          <AddTaskModal
            state={this.state}
            closeTaskModal={this.closeTaskModal}
            handleInputChange={this.handleInputChange}
            project={this.state.projects}
            handleDateFrom={this.handleDateFrom}
            handleDateTo={this.handleDateTo}
            handleTimeFrom={this.handleTimeFrom}
            handleTimeTo={this.handleTimeTo}
            user={this.state.users}
            addTask={this.addTask}
            handleUserSelect={this.handleUserSelect}
          />
        </div>

        {/* <Footer />  */}
      </>
    );
  }
}

export default withRouter(Dashboard);
