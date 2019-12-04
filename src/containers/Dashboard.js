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
import { DATE_FORMAT1 } from "../utils/Constants";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.format = "h:mm";
    this.now = moment()
      .hour(0)
      .minute(0);
    this.viewType = {
      weekly: "week",
      daily: "day",
      monthly: "month",
    };
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
      calenderTaskModal: false,
      newTask: {},
      project: {},
      taskId: "",
      selectedMembers: [],
      user: "",
      modalMemberSearchOptions: [],
      taskButton: "Add",
      border: "solid 1px #ffffff",
      isBorder: false,
      editProjectId: "",
      timeDateTo: null,
      timeDateFrom: null,
      worksapceUsers: [],
      selectedTaskMember: [],
      memberProjects: [],
      errors: {
        taskNameError: "",
        projectError: "",
        memberError: "",
        dateFromError: "",
        dateToError: "",
        timeFromError: "",
        timeToError: "",
      }
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
  };

  async componentDidUpdate(prevProps, prevState) {
    if (
      prevState.taskStartDate !== this.state.taskStartDate ||
      prevState.taskFrequency !== this.state.taskFrequency ||
      prevState.newTask !== this.state.newTask ||
      prevProps.searchProjectIds !== this.props.searchProjectIds ||
      prevProps.searchUserDetails !== this.props.searchUserDetails
    ) {
      try {
        var userIds = this.props.searchUserDetails.length > 0
          ? this.props.searchUserDetails.map(member => member.member_id)
          : []
        var searchData = {
          user_ids: JSON.stringify(userIds),
          project_ids: JSON.stringify(this.props.searchProjectIds),
        };
        const { data } = await get(
          `workspaces/${this.state.workspaceId}/user_tasks?frequency=${
          this.state.taskFrequency
          }&start_date=${getFisrtDate(
            this.state.taskStartDate,
            this.viewType[this.state.taskFrequency],
          )}`,
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
              var startDateTime =
                moment(dateWiseTasks.date).format("YYYY-MM-DD") +
                " " +
                moment(task.start_datetime).format("HH:mm");
              var endDateTime =
                moment(dateWiseTasks.date).format("YYYY-MM-DD") +
                " " +
                moment(task.end_datetime).format("HH:mm");
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
        var tasksResources = tasksUser.map(user => user.usersObj);
        var taskEvents = tasksUser.map(user => user.tasks).flat(2);
        // tasksResources.sort(function(x, y) {
        //   return x.id === this.state.userId
        //     ? -1
        //     : y.id === this.state.userId
        //     ? 1
        //     : 0;
        // });
        this.setState({
          resources: tasksResources,
          events: taskEvents,
        });
      } catch (e) { }
    }

    if (prevState.timeFrom !== this.state.timeFrom) {
      var startDateTime = null
      if (this.state.timeFrom !== null) {
        startDateTime = moment().format("YYYY-MM-DD") + " " + this.state.timeFrom;
        startDateTime = moment(startDateTime)
      }
      this.setState({ timeDateFrom: startDateTime })
    }

    if (prevState.timeTo !== this.state.timeTo) {
      var endDateTime = null
      if (this.state.timeTo !== null) {
        endDateTime = moment().format("YYYY-MM-DD") + " " + this.state.timeTo;
        endDateTime = moment(endDateTime)
      }
      this.setState({ timeDateTo: endDateTime })
    }
  }

  async componentDidMount() {
    this.props.handleLoading(true);
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
      const { data } = await get(
        `workspaces/${this.state.workspaceId}/members/${loggedInData.id}`,
      );
      var user = data;
    } catch (e) { }

    // workspace Member Listing
    try {
      const { data } = await get(
        `workspaces/${this.state.workspaceId}/members`,
      );
      var worksapceUsers = data.members
      var userArr = data.members.map(user => user);
      var emailArr = data.members.filter(
        user => user.email !== loggedInData.email,
      );
    } catch (e) {
      console.log("users Error", e);
    }

    // workspace Tasks Listing
    try {
      var userIds = this.props.searchUserDetails.length > 0
        ? this.props.searchUserDetails.map(member => member.member_id)
        : []
      var searchData = {
        user_ids: JSON.stringify(userIds),
        project_ids: JSON.stringify(this.props.searchProjectIds),
      };
      const { data } = await get(
        `workspaces/${this.state.workspaceId}/user_tasks?frequency=${
        this.state.taskFrequency
        }&start_date=${getWeekFisrtDate(this.state.taskStartDate)}`,
      );
      var tasksUser = data.users.map(user => {
        var usersObj = {
          id: user.id,
          name:
            user.email === loggedInData.email ? user.name + " (Me)" : user.name,
        };
        var tasks = user.date_formatted_tasks.map((dateWiseTasks, index) => {
          var task = dateWiseTasks.tasks.map(task => {
            var startDateTime =
              moment(dateWiseTasks.date).format("YYYY-MM-DD") +
              " " +
              moment(task.start_datetime).format("HH:mm");
            var endDateTime =
              moment(dateWiseTasks.date).format("YYYY-MM-DD") +
              " " +
              moment(task.end_datetime).format("HH:mm");
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
      var tasksResources = tasksUser.map(user => user.usersObj);
      var taskEvents = tasksUser.map(user => user.tasks).flat(2);
      this.props.handleLoading(false);
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
      worksapceUsers: worksapceUsers
    });
    this.createUserProjectList();
  }

  createUserProjectList = () => {
    var searchOptions = [];
    if (this.state.projects) {
      this.state.projects.map((project, index) => {
        searchOptions.push({
          value: project.name,
          project_id: project.id,
          type: "project",
          id: (index += 1),
        });
      });
    }

    var index = searchOptions.length;
    if (this.state.worksapceUsers) {
      this.state.worksapceUsers.map((member, idx) => {
        searchOptions.push({
          value: member.name,
          id: (index += 1),
          member_id: member.id,
          email: member.email,
          type: "member",
          role: member.role,
        });
      });
    }
    this.props.setSearchOptions(searchOptions);
  };

  getWorkspaceParams = () => {
    const { workspaceId } = this.props.match.params;
    this.setState({ workspaceId: workspaceId });
  };

  auth = () => {
    const token = cookie.load("authToken");
    if (token !== "undefined") {
      return this.props.history.push(`/workspace/${this.state.workspaceId}/dashboard`);
    } else {
      return this.props.history.push("/login");
    }
  };

  addTask = async () => {
    if (this.validateTaskModal()) {
      const taskData = this.taskDetails();
      try {
        const { data } = await post(
          taskData,
          `workspaces/${this.state.workspaceId}/projects/${this.state.projectId}/tasks`,
        );
        var task = data.task;
        toast(
          <DailyPloyToast
            message="Task Created successfully!"
            status="success"
          />,
          { autoClose: 2000, position: toast.POSITION.TOP_CENTER },
        );
        this.setState({ show: false, newTask: task, border: "solid 1px #ffffff" });
      } catch (e) {
        this.setState({ show: false, border: "solid 1px #ffffff" });
      }
    }
  };

  editTask = async () => {
    if (this.validateTaskModal()) {
      const taskData = this.taskDetails();
      try {
        const { data } = await put(
          taskData,
          `workspaces/${this.state.workspaceId}/projects/${this.state.editProjectId}/tasks/${this.state.taskId}`,
        );
        var task = data.task;
        toast(
          <DailyPloyToast
            message="Task Updated successfully!"
            status="success"
          />,
          { autoClose: 2000, position: toast.POSITION.TOP_CENTER },
        );
        this.setState({ show: false, newTask: task, border: "solid 1px #ffffff" });
      } catch (e) {
        this.setState({ show: false, border: "solid 1px #ffffff" });
      }
    }
  };

  taskDetails = () => {
    var startDateTime =
      moment(this.state.dateFrom).format(DATE_FORMAT1) +
      " " +
      this.state.timeFrom;
    var endDateTime =
      moment(this.state.dateTo ? this.state.dateTo : new Date()).format(DATE_FORMAT1) + " " + this.state.timeTo;
    var taskData = {
      task: {
        name: this.state.taskName,
        member_ids: this.state.taskUser,
        start_datetime: new Date(startDateTime),
        end_datetime: new Date(endDateTime),
        comments: this.state.comments,
        project_id: this.state.project.id
      },
    };
    return taskData;
  };

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
    let members = this.memberSearchOptions(this.state.userId);
    this.setState({
      setShow: true,
      show: true,
      modalMemberSearchOptions: members,
      project: "",
      memberProjects: this.state.projects
    });
  };

  closeTaskModal = () => {
    this.setState({
      show: false,
      taskUser: [],
      taskButton: "Add",
      modalMemberSearchOptions: [],
      memberProjects: [],
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
    var errors = this.state.errors
    errors["dateFromError"] = ""
    if (date > new Date()) {
      errors["dateToError"] = ""
      this.setState({
        dateFrom: date, dateTo: null, errors: errors,
      });
    } else {
      this.setState({ dateFrom: date, errors: errors });
    }
  };
  handleDateTo = date => {
    var errors = this.state.errors
    errors["dateToError"] = ""
    this.setState({ dateTo: date, errors: errors });
  };

  handleTimeFrom = value => {
    var errors = this.state.errors
    errors["timeFromError"] = ""
    this.setState({
      timeFrom: value != null ? value.format("HH:mm:ss") : null,
      errors: errors
    });
  };

  handleTimeTo = value => {
    var errors = this.state.errors
    errors["timeToError"] = ""
    this.setState({
      timeTo: value != null ? value.format("HH:mm:ss") : null,
      errors: errors
    });
  };

  handleUserSelect = e => {
    const { name, value } = e.target;
    let userIdArr = [];
    userIdArr.push(value);
    this.setState({ [name]: userIdArr });
  };

  handleMemberSelect = members => {
    var errors = this.state.errors
    errors["memberError"] = ""
    var memberIds = members.map(member => member.id);
    this.setState({
      taskUser: memberIds,
      selectedMembers: members,
      errors: errors
    });
  };

  handleInputChange = e => {
    const { name, value } = e.target;
    var errors = this.state.errors
    errors[`${name}Error`] = ""
    this.setState({ [name]: value, errors: errors });
  };

  // handleProjectSelect = option => {
  //   let options = []
  //   var memberIds = []
  //   if (this.state.user.role === 'admin') {
  //     options = option.members
  //   } else {
  //     options = option.members.filter(member => member.id === this.state.userId)
  //   }
  //   options = Array.from(new Set(options.map(JSON.stringify))).map(JSON.parse);
  //   console.log("options", options)
  //   memberIds = this.state.selectedTaskMember.map(member => member.id)
  //   var m = memberIds.length === 0 ? memberIds.push(this.state.userId) : memberIds
  //   // memberIds = Array.from(new Set(memberIds));
  //   console.log("memberIds", memberIds)
  //   // var removedMembers = this.state.selectedMembers.filter(selecteMember => memberIds.includes(selecteMember.id))
  //   var removedMembers = options.filter(member => memberIds.includes(member.id))
  //   console.log("removedMembers", removedMembers)
  //   var taskUsers = removedMembers.map(m => m.id)
  //   var errors = this.state.errors
  //   errors["projectError"] = ""
  //   this.setState({
  //     projectId: option.id,
  //     selectedMembers: removedMembers,
  //     project: option,
  //     taskUser: taskUsers,
  //     modalMemberSearchOptions: options,
  //     border: "solid 1px #9b9b9b",
  //     isBorder: false,
  //     errors: errors,
  //   })
  // }

  handleProjectSelect = option => {
    let options = []
    var memberIds = []
    if (this.state.user.role === 'admin') {
      options = option.members
      options.push({ email: this.state.userEmail, id: this.state.userId, name: this.state.userName })
    } else {
      options = option.members.filter(member => member.id === this.state.userId)
    }
    options = Array.from(new Set(options.map(JSON.stringify))).map(JSON.parse);
    memberIds = options.map(member => member.id)
    memberIds = Array.from(new Set(memberIds));
    var removedMembers = this.state.selectedMembers.filter(selecteMember => memberIds.includes(selecteMember.id))
    var taskUsers = removedMembers.map(m => m.id)
    var errors = this.state.errors
    errors["projectError"] = ""
    this.setState({
      projectId: option.id,
      selectedMembers: removedMembers,
      project: option,
      taskUser: taskUsers,
      modalMemberSearchOptions: options,
      border: "solid 1px #9b9b9b",
      isBorder: false,
      errors: errors,
    })
  }

  handleProjectBackspace = () => {
    this.setState({
      projectId: "",
      project: "",
      border: "solid 1px #ffffff",
    })
  }

  classNameRoute = () => {
    let route = this.props.history.location.pathname;
    let routeName = route.split("/")[3];
    if (routeName === "dashboard") {
      return "dashboardTrue";
    } else {
      return false;
    }
  };

  memberSearchOptions = (userId, projectId) => {
    var projects = this.state.projects.filter(project => project.id === projectId)
    var members = projects.length > 0 ? projects[0].members : []
    if (this.state.user.role === 'member') {
      members = members.filter(member => member.id === userId)
    }
    return members
  }

  setAddTaskDetails = (memberId, startDate, endDate) => {
    let members = this.memberSearchOptions(memberId)
    var selectedMembers = this.state.users.filter(member => memberId === member.id)

    var memberProjects = this.state.projects.filter(project => project.members.map(member => member.id).includes(memberId))
    var selecteMember = selectedMembers.map(member => {
      return { email: member.email, id: member.id, name: member.name }
    })
    if (this.state.user.role === 'admin' || this.state.userId == memberId) {
      this.setState({
        taskUser: [memberId],
        selectedMembers: selecteMember,
        show: true,
        calenderTaskModal: true,
        project: "",
        projectId: "",
        taskId: "",
        modalMemberSearchOptions: members,
        dateFrom: new Date(startDate),
        dateTo: new Date(endDate),
        border: "solid 1px #ffffff",
        timeDateTo: null,
        timeDateFrom: null,
        memberProjects: memberProjects,
      });
    }
  };

  renderSelectedProject = () => {
    var project = this.state.project;
    let border = this.state.border
    if (project != "") {
      return (
        <span style={{ display: `${this.state.project ? "block" : "none"}` }}>
          <span className="d-inline-block selected-project-color-code" style={{ backgroundColor: `${project.color_code}`, border: `${border}` }}></span>
          <span className="d-inline-block right-left-space-5 text-titlize">{project.name}</span>
        </span>
      )
    }
    return null
  }

  validateTaskModal = () => {
    var errors = {}
    var flag = true
    errors['taskNameError'] = this.state.taskName ? "" : "please enter task name"
    errors['projectError'] = this.state.projectId ? "" : "please select project"
    errors['memberError'] = this.state.taskUser.length > 0 ? "" : "please select members"
    errors['dateFromError'] = this.state.dateFrom ? "" : "please select date from"
    if (!this.state.dateTo && this.state.dateFrom) {
      if (moment(this.state.dateFrom).format(DATE_FORMAT1) === moment().format(DATE_FORMAT1)) {
        errors['dateToError'] = ""
      } else {
        errors['dateToError'] = "please select date to"
        flag = false
      }
    }
    errors['timeFromError'] = this.state.timeFrom ? "" : "please select time from"
    errors['timeToError'] = this.state.timeTo ? "" : "please select time to"
    this.setState({ errors: errors })
    return (
      this.state.taskName && this.state.projectId &&
      this.state.taskUser.length > 0 && this.state.timeTo &&
      this.state.timeFrom && this.state.dateFrom && flag
    )
  }

  editAddTaskDetails = async (taskId, event) => {
    let members = this.memberSearchOptions(event.resourceId, event.projectId)
    var memberProjects = this.state.projects.filter(project => project.members.map(member => member.id).includes(event.resourceId))
    var project = this.state.projects.filter(project => project.id === event.projectId)
    var eventTasks = this.state.events.filter(taskEvent => taskEvent.id === event.id)
    // var memberIds = this.state.user.role === 'admin' ? eventTasks.map(filterEvent => filterEvent.resourceId) : [event.resourceId]
    var memberIds = eventTasks.map(filterEvent => filterEvent.resourceId)
    var selectedMembers = this.state.users.filter(member => memberIds.includes(member.id))
    try {
      const { data } = await get(
        `workspaces/${this.state.workspaceId}/projects/${event.projectId}/tasks/${taskId}`,
      );
      var startDate = new Date(data.start_datetime);
      var endDate = new Date(data.end_datetime);
      var startTime = moment(data.start_datetime).format("HH:mm:ss");
      var endTime = moment(data.end_datetime).format("HH:mm:ss");
    } catch (e) { }
    if (
      this.state.user.role === "admin" ||
      this.state.userId == event.resourceId
    ) {
      this.setState({
        taskButton: "Save",
        taskUser: memberIds,
        calenderTaskModal: true,
        modalMemberSearchOptions: members,
        dateFrom: startDate,
        dateTo: endDate,
        timeFrom: startTime,
        timeTo: endTime,
        taskId: taskId,
        selectedMembers: selectedMembers,
        taskName: event.title,
        editProjectId: event.projectId,
        projectId: event.projectId,
        project: project[0],
        comments: event.comments,
        show: true,
        selectedTaskMember: selectedMembers,
        memberProjects: memberProjects,
      })
    }
  };

  managesuggestionBorder = () => {
    this.setState({ isBorder: true })
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
          handleTaskBottomPopup={this.props.handleTaskBottomPopup}
          onGoingTask={this.props.state.onGoingTask}
        />
        <div>
          <button className="btn menubar-task-btn" onClick={this.showTaskModal}>
            <i className="fas fa-plus" />
          </button>
          <AddTaskModal
            show={this.state.show}
            state={this.state}
            closeTaskModal={this.closeTaskModal}
            handleInputChange={this.handleInputChange}
            projects={this.state.memberProjects}
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
            renderSelectedProject={this.renderSelectedProject}
            managesuggestionBorder={this.managesuggestionBorder}
            handleProjectBackspace={this.handleProjectBackspace}
          />
        </div>
        {/* <Footer />  */}
      </>
    );
  }
}

export default withRouter(Dashboard);
