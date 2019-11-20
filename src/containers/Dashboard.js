import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { get, post, put, logout } from "../utils/API";
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
    this.format = "h:mm";
    this.now = moment()
      .hour(0)
      .minute(0);
    this.viewType = {
      "weekly": "week",
      "daily": "day",
      "monthly": "month"
    }
    this.state = {
      taskName: "",
      projectId: "",
      taskUser: [],
      sort: "week",
      show: false,
      setShow: false,
      dateFrom: new Date(),
      dateTo: null,
      timeFrom: "",
      timeTo: "",
      comments: null,
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
      calenderTaskModal: false,
      newTask: {},
      project: {},
      taskId: "",
      selectedMembers: [],
      user: "",
      modalMemberSearchOptions: [],
      taskButton: "Add",
      hourArr: [],
      minArr: [],
      border: "solid 1px #ffffff"
    };
  }

  updateTaskDateView = (view, date) => {
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
    this.setState({
      taskFrequency: viewType,
      taskStartDate: getFisrtDate(date, type),
    });
  }

  async componentDidUpdate(prevProps, prevState) {
    if (
      prevState.taskStartDate !== this.state.taskStartDate ||
      prevState.taskFrequency !== this.state.taskFrequency ||
      prevState.newTask !== this.state.newTask
    ) {
      try {
        const { data } = await get(
          `workspaces/${this.state.workspaceId}/user_tasks?frequency=${
          this.state.taskFrequency
          }&start_date=${getFisrtDate(this.state.taskStartDate, this.viewType[this.state.taskFrequency])}`,
        );

        var tasksUser = data.users.map(user => {
          var usersObj = {
            id: user.id,
            name:
              user.email === this.state.userEmail
                ? user.name + " (Me)"
                : user.name,
          };
          var tasks = user.date_formatted_tasks.map((dateWiseTasks, index) => {
            var task = dateWiseTasks.tasks.map(task => {
              var startDateTime = moment(dateWiseTasks.date).format("YYYY-MM-DD") + " " + moment(task.start_datetime).format("HH:mm")
              var endDateTime = moment(dateWiseTasks.date).format("YYYY-MM-DD") + " " + moment(task.end_datetime).format("HH:mm")
              var tasksObj = {
                id: task.id + "-" + index,
                start: moment(startDateTime).format("YYYY-MM-DD HH:mm"),
                end: moment(endDateTime).format("YYYY-MM-DD HH:mm"),
                resourceId: user.id,
                title: task.name,
                bgColor: task.project.color_code,
                projectName: task.project.name,
                comments: task.comments,
                projectId: task.project.id,
              };
              return tasksObj;
            });
            return task;
          });
          return { usersObj, tasks };
        });
        var tasksResources = tasksUser.map(user => user.usersObj)
        var taskEvents = tasksUser.map(user => user.tasks).flat(2);
        // tasksResources.sort(function (x, y) { return x.id === this.state.userId ? -1 : y.id === this.state.userId ? 1 : 0; });
        this.setState({
          resources: tasksResources,
          events: taskEvents
        });
      } catch (e) {
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
    // role api
    try {
      const { data } = await get(`workspaces/${this.state.workspaceId}/members/${loggedInData.id}`);
      var user = data
    } catch (e) {
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
    try {
      const { data } = await get(
        `workspaces/${this.state.workspaceId}/user_tasks?frequency=${
        this.state.taskFrequency
        }&start_date=${getWeekFisrtDate(this.state.taskStartDate)}`,
      );
      var tasksUser = data.users.map(user => {
        var usersObj = {
          id: user.id,
          name:
            user.email === loggedInData.email
              ? user.name + " (Me)"
              : user.name,
        };
        var tasks = user.date_formatted_tasks.map((dateWiseTasks, index) => {
          var task = dateWiseTasks.tasks.map(task => {
            var startDateTime = moment(dateWiseTasks.date).format("YYYY-MM-DD") + " " + moment(task.start_datetime).format("HH:mm")
            var endDateTime = moment(dateWiseTasks.date).format("YYYY-MM-DD") + " " + moment(task.end_datetime).format("HH:mm")
            var tasksObj = {
              id: task.id + "-" + index,
              start: moment(startDateTime).format("YYYY-MM-DD HH:mm"),
              end: moment(endDateTime).format("YYYY-MM-DD HH:mm"),
              resourceId: user.id,
              title: task.name,
              bgColor: task.project.color_code,
              projectName: task.project.name,
              comments: task.comments,
              projectId: task.project.id,
            };
            return tasksObj;
          });
          return task;
        });
        return { usersObj, tasks };
      });
      var tasksResources = tasksUser.map(user => user.usersObj)
      // tasksResources.sort(function (x, y) { return x.id == loggedInData.id ? -1 : y.id == loggedInData.id ? 1 : 0; });
      var taskEvents = tasksUser.map(user => user.tasks).flat(2);
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
      user: user,
      selectedMembers: [loggedInData],
      taskUser: [loggedInData.id],
    });

    this.props.handleLoading(false);
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
    const taskData = this.taskDetails()
    try {
      const { data } = await post(
        taskData,
        `workspaces/${this.state.workspaceId}/projects/${this.state.projectId}/tasks`,
      );
      var task = data.task
      toast(
        <DailyPloyToast
          message="Task Created successfully!"
          status="success"
        />,
        { autoClose: 2000, position: toast.POSITION.TOP_CENTER },
      );
      this.setState({ show: false, newTask: task });
    } catch (e) {
      this.setState({ show: false });
    }
  };

  editTask = async () => {
    const taskData = this.taskDetails()
    try {
      const { data } = await put(
        taskData,
        `workspaces/${this.state.workspaceId}/projects/${this.state.projectId}/tasks/${this.state.taskId}`,
      );
      var task = data.task
      toast(
        <DailyPloyToast
          message="Task Updated successfully!"
          status="success"
        />,
        { autoClose: 2000, position: toast.POSITION.TOP_CENTER },
      );
      this.setState({ show: false, newTask: task });
    } catch (e) {
      this.setState({ show: false });
    }
  };

  taskDetails = () => {
    var startDateTime = moment(this.state.dateFrom).format("YYYY-MM-DD") + " " + this.state.timeFrom
    var endDateTime = moment(this.state.dateTo).format("YYYY-MM-DD") + " " + this.state.timeTo
    var taskData = {
      task: {
        name: this.state.taskName,
        member_ids: this.state.taskUser,
        start_datetime: new Date(startDateTime),
        end_datetime: new Date(endDateTime),
        comments: this.state.comments,
      },
    };
    return taskData;
  }


  onSelectSort = value => {
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
    let members = this.memberSearchOptions(this.state.userId)
    this.setState({
      setShow: true,
      show: true,
      modalMemberSearchOptions: members,
    });
  };

  closeTaskModal = () => {
    this.setState({
      show: false,
      taskUser: [],
      taskButton: "Add",
      modalMemberSearchOptions: [],
      dateFrom: new Date(),
      dateTo: new Date(),
      timeFrom: "",
      timeTo: "",
      taskId: "",
      selectedMembers: [],
      taskName: "",
      projectId: "",
      project: {},
      comments: "",
      border: "solid 1px #ffffff",
    });
  };

  handleDateFrom = date => {
    if (date > new Date()) {
      this.setState({ dateFrom: date, dateTo: null });
    } else {
      this.setState({ dateFrom: date });
    }
  };
  handleDateTo = date => {
    this.setState({ dateTo: date });
  };

  handleTimeFrom = value => {
    if (value != null) {
      var time = value.format("HH:mm:ss")
      var hr = time.split(':')[0]
      hr = Number(hr)
      var hoursArr = Array.from({ length: `${hr}` }, (v, k) => k)
      var min = time.split(':')[1]
      min = Number(min) + 1
      var minArr = Array.from({ length: `${min}` }, (v, k) => k)
      this.setState({
        timeFrom: time,
        hourArr: hoursArr,
        minArr: minArr
      });
    } else {
      this.setState({
        timeFrom: null,
        hourArr: [],
        minArr: []
      });
    }
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

  handleMemberSelect = members => {
    var memberIds = members.map(member => member.id)
    this.setState({
      taskUser: memberIds,
      selectedMembers: members
    });
  };

  handleInputChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleProjectSelect = option => {
    if (this.state.user.role === 'admin') {
      var options = option.members
    } else {
      var options = option.members.filter(member => member.id === this.state.userId)
    }
    var memberIds = options.map(member => member.id)
    var removedMembers = this.state.selectedMembers.filter(selecteMember => memberIds.includes(selecteMember.id))
    this.setState({
      projectId: option.id,
      selectedMembers: removedMembers,
      project: option,
      modalMemberSearchOptions: options,
      border: "solid 1px #9b9b9b"
    })
  }

  classNameRoute = () => {
    let route = this.props.history.location.pathname;
    let routeName = route.split("/")[1];
    if (routeName === "dashboard") {
      return "dashboardTrue";
    } else {
      return false;
    }
  };

  memberSearchOptions = (userId) => {
    if (this.state.user.role === 'admin') {
      return this.state.users
    } else {
      return this.state.users.filter(member => member.id === userId)
    }
  }

  setAddTaskDetails = (memberId, startDate, endDate) => {
    let members = this.memberSearchOptions(memberId)
    var selectedMembers = this.state.users.filter(member => memberId === member.id)
    if (this.state.user.role === 'admin' || this.state.userId == memberId) {
      this.setState({
        taskUser: [memberId],
        selectedMembers: selectedMembers,
        show: true,
        calenderTaskModal: true,
        project: {},
        projectId: "",
        taskId: "",
        modalMemberSearchOptions: members,
        dateFrom: new Date(startDate), dateTo: new Date(endDate),
      })
    }
  }

  editAddTaskDetails = async (taskId, event) => {
    let members = this.memberSearchOptions(event.resourceId)
    var project = this.state.projects.filter(project => project.id === event.projectId)
    var eventTasks = this.state.events.filter(taskEvent => taskEvent.id === event.id)
    var memberIds = this.state.user.role === 'admin' ? eventTasks.map(filterEvent => filterEvent.resourceId) : [event.resourceId]
    var selectedMembers = this.state.users.filter(member => memberIds.includes(member.id))
    try {
      const { data } = await get(
        `workspaces/${this.state.workspaceId}/projects/${event.projectId}/tasks/${taskId}`,
      );
      var startDate = new Date(data.start_datetime)
      var endDate = new Date(data.end_datetime)
      var startTime = moment(data.start_datetime).format("HH:mm:ss")
      var endTime = moment(data.end_datetime).format("HH:mm:ss")
    } catch (e) {
    }
    if (this.state.user.role === 'admin' || this.state.userId == event.resourceId) {
      this.setState({
        taskButton: "Save",
        taskUser: memberIds,
        show: true,
        calenderTaskModal: true,
        modalMemberSearchOptions: members,
        dateFrom: startDate,
        dateTo: endDate,
        timeFrom: startTime,
        timeTo: endTime,
        taskId: taskId,
        selectedMembers: selectedMembers,
        taskName: event.title,
        projectId: event.projectId,
        project: project[0],
        comments: event.comments
      })
    }
  }

  render() {
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
          state={this.state}
          sortUnit={this.state.sort}
          workspaceId={this.state.workspaceId}
          resources={this.state.resources}
          events={this.state.events}
          updateTaskDateView={this.updateTaskDateView}
          setAddTaskDetails={this.setAddTaskDetails}
          editAddTaskDetails={this.editAddTaskDetails}
          show={this.state.calenderTaskModal}
          closeTaskModal={this.closeTaskModal}
          handleProjectSelect={this.handleProjectSelect}
        />
        <div>
          <button
            className="btn menubar-task-btn"
            onClick={this.showTaskModal}>
            <i className="fas fa-plus" />
          </button>
          <AddTaskModal
            show={this.state.show}
            state={this.state}
            closeTaskModal={this.closeTaskModal}
            handleInputChange={this.handleInputChange}
            projects={this.state.projects}
            handleDateFrom={this.handleDateFrom}
            handleDateTo={this.handleDateTo}
            handleTimeFrom={this.handleTimeFrom}
            handleTimeTo={this.handleTimeTo}
            users={this.state.users}
            addTask={this.addTask}
            editTask={this.editTask}
            handleMemberSelect={this.handleMemberSelect}
            handleProjectSelect={this.handleProjectSelect}
            modalMemberSearchOptions={this.state.modalMemberSearchOptions}
          />
        </div>
        {/* <Footer />  */}
      </>
    );
  }
}

export default withRouter(Dashboard);
