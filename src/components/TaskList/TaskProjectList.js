import React, { Component } from "react";
import moment from "moment";
import { withRouter } from "react-router-dom";
import { get, post, logout, put, del } from "../../utils/API";
import { HRMIN } from "../../utils/Constants";
import MenuBar from "../dashboard/MenuBar";
import ProjectList from "./ProjectList";
import "../../assets/css/TaskProjectList.scss";
import cookie from "react-cookies";
import AddProjectTaskModel from "./AddProjectTaskModel";
import { Button } from "react-bootstrap";
import DisplayTaskList from "./DisplayTaskList";
import { toast } from "react-toastify";
import DailyPloyToast from "./../DailyPloyToast";
import VideoLoader from "../dashboard/VideoLoader";
import Loader from 'react-loader-spinner'

class TaskProjectList extends Component {
  constructor(props) {
    super(props);
    let projectId = (localStorage.getItem('selProject') != '') ? localStorage.getItem('selProject') : '';
    this.state = {
      projectMembers: [],
      show: false,
      showChecklist: false,
      checklistID: null,
      showFilter: false,
      showSummary: false,
      summaryID: null,
      memberID: null,
      statusID: null,
      isEdit: false,
      taskName: "",
      Name: "",
      dateFrom1: "",
      dateTo1: "",
      dateFrom: "",
      dateTo: "",
      backFromTaskEvent: true,
      workspaces: [],
      workspaceId: "",
      projectNames: [],
      sort: "week",
      MEMBER: "member",
      STATUS: "status",
      members: [],
      isLogedInUserEmailArr: [],
      projects: [],
      userId: "",
      users: [],
      searchOptions: [],
      worksapceUsers: "",
      worksapceUser: [],
      project_task_lists: [],
      taskStatus: [],
      isLoading: false,
      isTaskListLoading: false,
      isFilterLoading: false,
      isTaskListTasksLoading: false,
      taskListTasksLoadingID: null,
      isProjectListShow: false,
      isTaskListLoaded: false,
      projectShowMemberId: null,
      showInfo: false,
      isAllChecked: false,
      showConfirm: false,
      showDeleteConfirm: false,
      editTaskId: -1,
      projects: [],
      categories: [],
      userStories: [],
      currentUserstory: null,
      taskDescription: null,
      storyDescription: null,
      detailsModal: false,
      updatedData: false,
      updatedTask: false,
      userstoryUpdateTask: false,
      showUserstoryTasklist: false,
      currentUserstoryTask: [],
      checklistItem: null,
      newChecklist: false,
      action: null,
      errors: {
        taskNameError: "",
        dateFromError: "",
        dateToError: "",
      },
      TaskShow: false,
      list_id: -1,
      projectId: projectId,
      statusTask: {
        color: "#53a4f0",
        statusName: "Not Started",
        id: 1,
      },
      showbutton: true,
      showAddTaskButton: false,
      Projecttask: {
        name: "a",
        start_date: "a",
        end_date: "a",
        projectId: projectId,
      },
      task_lists: [],
      editTltId: -1,
      isCheckVisible: false,
      isUserStoryLoading: false,
      selectedUserStoryId: null,
      isChecklistLoading: false,
      progressPercent: 0,
      progressPercentUTD: 0,
      task_edit: false,
      isRoadmapCreateLoading: false,
      userStory_checklists: [], 
      userStoryDetails_checklists: [],
      userStroyTaskDetails: null,
      filterWithSummary: false,
      filterWithSummaryId : null,
      filterWithSummaryType: null,
      filterWithSummarySId: null,
      loadingNewUserStory: false,
      editedUserStoryloading: false,
      editedUserStoryloadingId: null,
      markUserStory: false,
      filterParams: {},
      isDeleteDisabled: false
    };
  }

  roleType = localStorage.getItem("userRole");

  async componentDidMount() {
    this.props.handleLoading(true);
    this.handleTaskLoad(true)
    this.handleTaskListLoad(true)
    var loggedInData = cookie.load("loggedInUser");
    if (!loggedInData) {
      try {
        const { data } = await get("logged_in_user");
        var loggedInData = data;
      } catch (e) { }
    }

    // get  projet selected state
    const projectId = (localStorage.getItem('selProject') != '') ? parseInt(localStorage.getItem('selProject')) : '';

    // workspace Listing
    try {
      const { data } = await get("workspaces");
      var workspacesData = data.workspaces;
    } catch (e) { }

    //get workspace Id
    this.getWorkspaceParams();

    // worksapce project Listing
    try {
      var userIds =
        this.props.searchUserDetails.length > 0
          ? this.props.searchUserDetails.map((member) => member.member_id)
          : [];
      var searchData = {};
      if (userIds.length > 0) {
        searchData["user_ids"] = userIds.join(",");
      }
      if (this.props.searchProjectIds.length > 0) {
        searchData["project_ids"] = this.props.searchProjectIds.join(",");
      }
      const { data } = await get(
        `workspaces/${this.state.workspaceId}/projects`,
        searchData
      );
      var projectsData = data.projects;
      this.props.handleLoading(false);
    } catch (e) { }

    // workspace Member Listing
    try {
      const { data } = await get(
        `workspaces/${this.state.workspaceId}/members`
      );
      var worksapceUsers = data.members;
      var userArr = data.members.map((user) => user.email);
      var emailArr = data.members;
    } catch (e) { }

    try {
      const { data } = await get(
        `workspaces/${this.state.workspaceId}/task_category`
      );
      var taskCategories = data.task_categories;
    } catch (e) { }
    this.setState({
      userId: loggedInData.id,
      userName: loggedInData.name,
      userEmail: loggedInData.email,
      workspaces: workspacesData,
      projects: projectsData,
      users: userArr,
      isLogedInUserEmailArr: emailArr,
      worksapceUsers: worksapceUsers,
      categories: taskCategories,
    });
    if (projectsData && projectsData.length > 0) {
      this.handleOpenTaskData(projectId != '' ? projectId : projectsData[0].id);
    }
    this.createUserProjectList();
  }

  async componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.searchProjectIds !== this.props.searchProjectIds ||
      prevProps.searchUserDetails !== this.props.searchUserDetails
    ) {
      try {
        var userIds =
          this.props.searchUserDetails.length > 0
            ? this.props.searchUserDetails.map((member) => member.member_id)
            : [];
        var searchData = {};
        if (userIds.length > 0) {
          searchData["user_ids"] = userIds.join(",");
        }
        if (this.props.searchProjectIds.length > 0) {
          searchData["project_ids"] = this.props.searchProjectIds.join(",");
        }
        const { data } = await get(
          `workspaces/${this.state.workspaceId}/projects`,
          searchData
        );
        var projectsData = data.projects;
        this.setState({
          projects: projectsData,
        });
      } catch (e) { }
    }
  }

  createUserProjectList = () => {
    let memberList = [];
    let projectList = [];
    if (this.state.projects) {
      this.state.projects.map((project, index) => {
        projectList.push({
          value: project.name,
          project_id: project.id,
          type: "project",
          id: (index += 1),
        });
      });
    }
    if (this.state.worksapceUsers) {
      this.state.worksapceUsers.map((member, idx) => {
        memberList.push({
          value: member.name,
          member_id: member.id,
          email: member.email,
          type: "member",
          role: member.role,
        });
      });
    }
    let searchOptions = {
      members: memberList,
      projects: projectList,
    };
    this.props.setSearchOptions(searchOptions);
  };

  getWorkspaceParams = () => {
    const { workspaceId } = this.props.match.params;
    this.setState({ workspaceId: workspaceId });
  };

  onSelectSort = (value) => {
    this.setState({ sort: value });
  };

  classNameRoute = () => {
    let route = this.props.history.location.pathname;
    let routeName = route.split("/")[3];
    if (routeName === "TaskProjectList") {
      return "TaskProjectListTrue";
    } else {
      return false;
    }
  };
  handleLoad = (value) => {
    this.setState({ isLoading: value });
  };

  handleTaskLoad = (value) => {
    this.setState({ isTaskListLoading: value });
  }

  handleTaskListLoad = (value) => {
    this.setState({ isTaskListLoaded: value });
  }

  closeOnlyTaskModal = () => {
    this.setState({
      show: false,
      showInfo: true,
      Name: "",
      taskName: "",
      taskConfirmModal: false,
      backFromTaskEvent: true,
      dateFrom: "",
      dateTo: "",
    });
  };

  displayAddTask = () => {
    if (!this.state.TaskShow) this.setState({ TaskShow: true });
    else {
      this.setState({ TaskShow: false });
    }
  };

  closeAddTask = () => {
    this.setState({ TaskShow : false })
  }

  handleDateFrom = (date) => {
    let fromMoment = moment(date);
    var fromDateTime = fromMoment.format("DD MMM YYYY");
    this.setState({ dateFrom1: fromDateTime });
    this.setState({ dateFrom: date });
  };

  handleDateTo = (date) => {
    this.setState({ dateTo: date });
    let fromMoment = moment(date);
    var fromDateTime = fromMoment.format("DD MMM YYYY");
    this.setState({ dateTo1: fromDateTime });
  };

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({ taskName: value });
    this.setState({ Name: value });
  };

  handleTaskNameChange = async (name, value) => {
    this.setState({ [name]: value });
  };

  openAddProjectTaskModal = () => {
    if (this.roleType != "admin") {
      return;
    }
    this.setState({
      show: true,
      isEdit: false,
    });
  };

  isChecklistOpen = (ID) => {
    this.setState({
      showChecklist: !this.state.showChecklist,
      checklistID: ID
    })
  }

  closeChecklist = () => {
    this.setState({
      showChecklist: false
    })
  }

  isFilterOpen = () => {
    this.setState({
      showFilter: !this.state.showFilter
    });
  }

  closeFilter = () => {
    this.setState({
      showFilter: false
    })
  }

  isSummaryOpen = (taskID) => {
    this.setState({
      showSummary: !this.state.showSummary,
      summaryID: taskID
    });
  }

  closeSummary = () => {
    this.setState({
      showSummary: false
    })
  }

  editTlt = (tltID) => {
    this.setState({
      editTltId: tltID,
    });
  };

  handleDescription = (e) => {
    const { name, value } = e.target;
    if (name === "user-story") {
      this.setState({ storyDescription: value })
    } else {
      this.setState({ taskDescription: value })
    }

  }

  editDescription = (e, id) => {
    const { name, value } = e.target;
    if (this.state.storyDescription !== "" || this.state.taskDescription !== "") {
      const params = {
        description: name === "user-story" ? this.state.storyDescription : this.state.taskDescription
      }
      name === "user-story" ? this.editUserstory(params, id) : this.editUserstory(params, id)
    }
  }

  setConjuction = (value, type, id, sId) => {
    this.setState({
      filterWithSummary: value,
      filterWithSummaryId : id,
      filterWithSummaryType: type,
      filterWithSummarySId : sId ? sId : null
    })
  }

  addTaskChecklist = async (params, roadMapTask) => {
    try {
      this.checklistLoading(true)
      const { data } = await post(
        params,
        `workspaces/${this.state.workspaceId}/projects/${this.state.projectId}/roadmap_task/${roadMapTask.id}/checklists`)
      //this.displayList(roadMapTask.list_id)
      this.setState({ checklistItem: data, newChecklist: true, userStoryDetails_checklists: [...this.state.userStoryDetails_checklists, data] })
      this.checklistLoading(false)
    } catch (error) {
      console.log("sa", error)
    }
  }

  updateTaskChecklist = async (id, params, roadMapTask) => {
    try {
      this.checklistLoading(true)
        const { data } = await put(
          params,
          `workspaces/${this.state.workspaceId}/projects/${this.state.projectId}/roadmap_task/${roadMapTask.id}/checklists/${id}`)
          //this.displayList(roadMapTask.list_id)
      let updated_data = this.state.userStoryDetails_checklists.map(x => x.id == data.id ? data : x)
      this.checklistProgress3(updated_data)
      this.setState({ checklistItem: data, action: "update", newChecklist: true })
      this.checklistLoading(false)
      
    } catch (error) {
      
    }
  }

  checklistProgress3 = (checklist_data) => {
    let progressBar = checklist_data.filter((checklist) => checklist.is_completed == true);
    let progress_percentage =
    Math.round((progressBar.length / checklist_data.length) * 100 * 10) / 10;
    if(progress_percentage == NaN)
    {
      this.setState({progressPercentUTD: 0})
    }
    else
    {
      this.setState({ progressPercentUTD : progress_percentage})
    }
  }

  deleteTaskChecklist = async (id, roadMapTask) => {
  try {
    this.checklistLoading(true)
      const { data } = await del(
        `workspaces/${this.state.workspaceId}/projects/${this.state.projectId}/roadmap_task/${roadMapTask.id}/checklists/${id}`)
        //this.displayList(roadMapTask.list_id)
    this.setState({ checklistItem: data, action: "delete", newChecklist: true })
    this.checklistLoading(false)
  } catch (error) {
    
  }
  }

  createRoadmapLoading = (value) => {
    this.setState({ isRoadmapCreateLoading: value })
  }

  handleSaveTaskData = async () => {
    let loggedInUser = localStorage.getItem("logedInId");
    this.createRoadmapLoading(true)
    try {
      let params = {
        name: this.state.Name,
        start_date: this.state.dateFrom,
        end_date: this.state.dateTo,
        creator_id: loggedInUser
        // task_status_id: this.state.statusTask.id
      };
      const { data } = !this.state.isEdit
        ? await post(
          params,
          `workspaces/${this.state.workspaceId}/projects/${this.state.projectId}/task_lists`
        )
        : await put(
          params,
          `workspaces/${this.state.workspaceId}/projects/${this.state.projectId}/task_lists/${this.state.editTaskId}`
        );

      let Project = [...this.state.project_task_lists];
      if (this.state.isEdit) {
        const projectIndex = Project.findIndex(
          (x) => x.id == this.state.editTaskId
        );
        Project[projectIndex].name = data.name;
        Project[projectIndex].start_date = data.start_date;
        Project[projectIndex].end_date = data.end_date;
      } else {
        Project.unshift({
          id: data.id,
          name: data.name,
          start_date: data.start_date,
          end_date: data.end_date,
          projectId: data.project_id,
        });
      }
      this.setState({ show: false, project_task_lists: Project });
      this.setState({
        show: false,
        showInfo: true,
        Name: "",
        taskConfirmModal: false,
        backFromTaskEvent: true,
        dateFrom: "",
        dateTo: "",
      });
      this.createRoadmapLoading(false)
    } catch (e) {
      if (
        e &&
        e.response.data &&
        e.response.data.errors &&
        e.response.data.errors.message &&
        e.response.data.errors.message.project &&
        e.response.data.errors.message.project[0] == "has already been taken"
      ) {
        toast(
          <DailyPloyToast
            message="This roadmap is already present, Please create a different roadmap "
            status="error"
          />,
          {
            autoClose: 2000,
            position: toast.POSITION.TOP_CENTER,
          }
        );
      } else {
        toast(
          <DailyPloyToast message="Something went wrong" status="error" />,
          {
            autoClose: 2000,
            position: toast.POSITION.TOP_CENTER,
          }
        );
      }
    }
  };

  getRoadmapStatus = async (statusName, taskListId) => {
    try {
      let params = {
        status: statusName
      };
      const { data } = await put(
        params,
        `workspaces/${this.state.workspaceId}/projects/${this.state.projectId}/task_lists/${taskListId}`
      );
      this.setState({
        statusTask: data.task_status
      })
    } catch (e) { }
  }

  addTaskLoading = (value) => {
    this.setState({
      isCheckVisible: value
    })
  }

  handleSaveTask = async (saveTaskParams, isMove) => {
    this.addTaskLoading(true)
    try {
      let params = {
        name: saveTaskParams.name,
        estimation: saveTaskParams.estimation,
        description: saveTaskParams.description,
        priority: saveTaskParams.priority,
        owner_id: saveTaskParams.assigne_id,
        task_status_id: saveTaskParams.status ? saveTaskParams.status.id : "",
        tracked_time: saveTaskParams.tracked_time,
        category_id: saveTaskParams.category_id
      };
      const { data } =
        this.state.editTltId == -1
          ? await post(
            params,
            `workspaces/${this.state.workspaceId}/projects/${this.state.projectId}/task_lists/${this.state.list_id}/task_list_tasks`
          )
          : await put(
            params,
            `workspaces/${this.state.workspaceId}/projects/${this.state.projectId
            }/task_lists/${this.state.list_id}/task_list_tasks/${saveTaskParams.tltId
              ? saveTaskParams.tltId
              : this.state.editTltId
            }`
          );
      var tasks = [...this.state.task_lists];

      if (this.state.editTltId != -1) {
        const tltIndex = tasks.findIndex((x) => x.id == this.state.editTltId);
        tasks[tltIndex].name = saveTaskParams.name;
        tasks[tltIndex].estimation = saveTaskParams.estimation;
        tasks[tltIndex].priority = saveTaskParams.priority;
        tasks[tltIndex].description = saveTaskParams.description;
        tasks[tltIndex].assigne_id = saveTaskParams.assigne_id;
        tasks[tltIndex].list_id = saveTaskParams.list_id;
        tasks[tltIndex].status = saveTaskParams.status;
        tasks[tltIndex].tracked_time = saveTaskParams.tracked_time;
        tasks[tltIndex].category_id = saveTaskParams.category_id;
        tasks[tltIndex].checklist = saveTaskParams.checklist;
      } else {
        tasks.push({
          name: saveTaskParams.name,
          estimation: saveTaskParams.estimation,
          list_id: saveTaskParams.list_id,
          priority: saveTaskParams.priority,
          status: saveTaskParams.status,
          description: saveTaskParams.description,
          assigne_id: saveTaskParams.assigne_id,
          id: data.id,
          // assigne_name: saveTaskParams.assigne_name
        });
      }
      console.log("tasks", tasks);
      this.addTaskLoading(false)
      this.setState({
        show: false,
        task_lists: tasks,
        editTltId: -1,
        TaskShow: false,
      });
    } catch (e) {
      if (e.message) {
        console.log("tasks", e.message);
        if (!isMove) {
          toast(
            <DailyPloyToast message="Something went wrong" status="error" />,
            {
              autoClose: 2000,
              position: toast.POSITION.TOP_CENTER,
            }
          );
        }
      }
    }
  };

  handleErroMsg = (e) => {
    if (
      e &&
      e.response.data &&
      e.response.data.errors &&
      e.response.data.errors.message
    ) {
      toast(
        <DailyPloyToast
          message={e.response.data.errors.message}
          status="error"
        />,
        {
          autoClose: 2000,
          position: toast.POSITION.TOP_CENTER,
        }
      );
    } else {
      toast(<DailyPloyToast message="Something went wrong" status="error" />, {
        autoClose: 2000,
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };

  loadFilteredData = (value) => {
    this.setState({ isFilterLoading: value })
  }

  loadTaskListTaskData = (value, ID) => {
    this.setState({
      isTaskListTasksLoading: value,
      taskListTasksLoadingID: ID
    })
  }

  setUserStoryDetails = (task) => {
    this.setState ({
      userStoryDetails_checklists: task.checklist
    })
  }

  displayList = async (taskListId, ID, type, idd) => {
    if (this.state.list_id != taskListId || ID != null) {
      let params;
      if (type === this.state.MEMBER) {
        params = { member_ids: ID }
      }
      else
        if (type === this.state.STATUS) {
          params = { status_ids: ID }
        }
        else
        if (type === "both") {
          params = { member_ids: ID, status_ids: idd }
        }
        else {
          params = ""
        }
      let taslListTask = [];
      let stories = [];
      try {
        const { data } = await get(
          `workspaces/${this.state.workspaceId}/projects/${this.state.projectId}/task_lists/${taskListId}`,
          params
        );

        stories = data.user_stories && data.user_stories.length > 0
        ? data.user_stories.map((entry) => {
          return entry
        }) : [];

        taslListTask =
          data.task_list_tasks && data.task_list_tasks.length > 0
            ? data.task_list_tasks.map((eachEntry) => {
              return {
                name: eachEntry.name,
                estimation: eachEntry.estimation,
                list_id: eachEntry.task_lists_id,
                priority: eachEntry.priority,
                status: eachEntry.task_status,
                description: eachEntry.description,
                checklist: eachEntry.checklist,
                comments: eachEntry.comments,
                // category: eachEntry.category,
                category_id: eachEntry.category_id,
                tracked_time: eachEntry.tracked_time,
                assigne_id: eachEntry.owner_id,
                assigne: eachEntry.owner,
                start_date: eachEntry.task ? eachEntry.task.start_datetime : null,
                end_date: eachEntry.task ? eachEntry.task.end_datetime : null,
                is_complete: eachEntry.task ? eachEntry.task.is_complete : null,
                id: eachEntry.id,
                task_id: eachEntry.task_id,
                owner: eachEntry.owner,
                owner_id: eachEntry.owner_id
              };
            })
            : [];
        this.setState({ list_id: taskListId, task_lists: taslListTask, isFilterLoading: false, isTaskListTasksLoading: false,
        userStories: stories });
      } catch (e) {
        this.handleErroMsg(e);
      }
    } else this.setState({ list_id: -1 });
  };


  displayFiteredList = async (taskListId, ID, type, idd) => {
    if (this.state.list_id != taskListId || ID != null) {
      let params;
      if (type === this.state.MEMBER) {
        params = { member_ids: ID }
      }
      else
        if (type === this.state.STATUS) {
          params = { status_ids: ID }
        }
        else
        if (type === "both") {
          params = { member_ids: ID, status_ids: idd }
        }
        else {
          params = ""
        }
      let taslListTask = [];
      try {
        const { data } = await get(
          `workspaces/${this.state.workspaceId}/projects/${this.state.projectId}/task_lists/${taskListId}`,
          params
        );

        let filteredStories = data.user_stories && data.user_stories.length > 0
        ? data.user_stories.map((entry) => {
            return entry
          }) : [];
          
        taslListTask =
          data && data.task_list_tasks.length > 0
            ? data.task_list_tasks.map((eachEntry) => {
              return {
                name: eachEntry.name,
                estimation: eachEntry.estimation,
                list_id: eachEntry.task_lists_id,
                priority: eachEntry.priority,
                status: eachEntry.task_status,
                description: eachEntry.description,
                checklist: eachEntry.checklist,
                comments: eachEntry.comments,
                // category: eachEntry.category,
                category_id: eachEntry.category_id,
                tracked_time: eachEntry.tracked_time,
                assigne_id: eachEntry.owner_id,
                assigne: eachEntry.owner,
                start_date: eachEntry.task ? eachEntry.task.start_datetime : null,
                end_date: eachEntry.task ? eachEntry.task.end_datetime : null,
                is_complete: eachEntry.task ? eachEntry.task.is_complete : null,
                id: eachEntry.id,
                task_id: eachEntry.task_id,
                owner: eachEntry.owner,
                owner_id: eachEntry.owner_id
              };
            })
            : [];
        this.setState({ list_id: taskListId, task_lists: taslListTask, isFilterLoading: false, isTaskListTasksLoading: false,
          userStories: filteredStories, filterParams: params });
      } catch (e) {
        this.handleErroMsg(e);
      }
    } else this.setState({ list_id: -1 });
  };

  handleOpenTaskData = async (id) => {
    this.handleTaskListLoad(true)
    let taskListEntries = [];
    let taskStatusArray = [];
    let project = this.state.projects.find(project => project.id == id)
    try {
      const { data } = await get(
        `workspaces/${this.state.workspaceId}/projects/${id}/task_lists`
      );
      taskListEntries =
        data.entries && data.entries.length > 0
          ? data.entries.map((data) => {
            return {
              id: data.id,
              name: data.name,
              start_date: data.start_date,
              end_date: data.end_date,
              projectId: data.project_id,
              roadmap_status: data.status,
              userStories: data.user_stories
            };
          })
          : [];
    } catch (e) {
      this.handleErroMsg(e);
    }

    try {
      const { data } = await get(
        `workspaces/${this.state.workspaceId}/projects/${id}/task_status`
      );

      if (data && data.task_status) {
        taskStatusArray = data.task_status.map((status) => {
          let name = "";
          switch (status.name) {
            case "not_started":
              name = "Not Started";
              break;
            default:
              name = status.name;
              break;
          }
          return { id: status.id, isDefault: status.is_default, statusName: name, color: "#53a4f0" };
        });
      }
      console.log("data", taskStatusArray);
    } catch (e) {
      this.handleErroMsg(e);
    }
    this.handleTaskLoad(false)
    let taskStatuses = this.getIsDefault(taskStatusArray)
    this.handleTaskListLoad(false)
    this.setState({
      projectId: id,
      showbutton: false,
      showAddTaskButton: true,
      project_task_lists: taskListEntries,
      taskStatus: taskStatuses,
      projectMembers: project && project.members ? project.members : []
    });
  };

  getIsDefault = (taskStatuses) => {
    let taskStatus1 = [];
    let taskStatus2 = [];
    let taskStatus = [];
    taskStatus1 = taskStatuses.filter(status => status.isDefault == !true)
    taskStatus2 = taskStatuses.find(status => status.isDefault == true)
    taskStatus = [taskStatus2, ...taskStatus1]
    return taskStatus
  }

  deleteTaskList = async (taskId) => {
    try {
      const { data } = await del(
        `workspaces/${this.state.workspaceId}/projects/${this.state.projectId}/task_lists/${taskId}`
      );

      this.handleOpenTaskData(this.state.projectId, true);
    } catch (e) {
      if (e.message) {
        toast(
          <DailyPloyToast message="Something went wrong" status="error" />,
          {
            autoClose: 2000,
            position: toast.POSITION.TOP_CENTER,
          }
        );
      }
    }
  };

  editTaskList = (projectTask) => {
    this.handleDateTo(new Date(projectTask.end_date));
    this.handleDateFrom(new Date(projectTask.start_date));
    this.handleInputChange({ target: { value: projectTask.name } });
    this.setState({
      show: true,
      isEdit: true,
      editTaskId: projectTask.id,
    });
  };

  disableDeletebutton = (value) => {
    this.setState({
      isDeleteDisabled : value
    })
  }

  deleteTlt = async (tltId) => {

    // localStorage.setItem("isTLTDelete", true);
    try {
      this.disableDeletebutton(true)
      const { data } = await del(
        `workspaces/${this.state.workspaceId}/projects/${this.state.projectId}/task_lists/${this.state.list_id}/task_list_tasks/${tltId}`
      );
      // localStorage.removeItem("isTLTDelete");
      let task_lists = this.state.task_lists.filter((eachTlt) => {
        return tltId != eachTlt.id;
      });
      this.setState({
        task_lists: task_lists,
      });
      this.disableDeletebutton(false)
    } catch (e) {
      if (e.message) {
        toast(
          <DailyPloyToast message="Something went wrong" status="error" />,
          {
            autoClose: 2000,
            position: toast.POSITION.TOP_CENTER,
          }
        );
      }
    }
  };

  switchTask = async (taskId, tltId) => {
    try {
      const { data } = await put(
        {},
        `workspaces/${this.state.workspaceId}/projects/${this.state.projectId}/task_lists/${taskId}/task_list_tasks/${tltId}`
      );
      let task_lists = this.state.task_lists.filter((eachTlt) => {
        return tltId != eachTlt.id;
      });
      this.setState({
        task_lists: task_lists,
      });
      toast(
        <DailyPloyToast
          message="Task is successfully moved"
          status="success"
        />,
        {
          autoClose: 2000,
          position: toast.POSITION.TOP_CENTER,
        }
      );
    } catch (e) {
      if (e.message) {
        toast(
          <DailyPloyToast message="Something went wrong" status="error" />,
          {
            autoClose: 2000,
            position: toast.POSITION.TOP_CENTER,
          }
        );
      }
    }
  };

  userTaskDetails = async (tltId) =>{
    try {
      const { data } = await get(
        `workspaces/${this.state.workspaceId}/projects/${this.state.projectId}/task_lists/${this.state.list_id}/task_list_tasks/${tltId}`
      )
      this.checklistProgress4(data)
      this.setState({
        userStroyTaskDetails: data,
        userStoryDetails_checklists: data.checklist
      })
    }
    catch (e) {

    }
  }

  checklistProgress4 = (currentUserstory) => {
    let progressBar = currentUserstory.checklist.filter((checklist) => checklist.is_completed == true);
    let progress_percentage =
    Math.round((progressBar.length / currentUserstory.checklist.length) * 100 * 10) / 10;
    if(progress_percentage == NaN)
    {
      this.setState({progressPercentUTD: 0})
    }
    else
    {
      this.setState({ progressPercentUTD : progress_percentage})
    }
    
  }

  moveToDashBoard = async (saveTaskParams) => {
    try {
      const { data } = await post(
        {
          start_datetime: saveTaskParams.startDate,
          end_datetime: saveTaskParams.endDate,
          owner_id: saveTaskParams.assigne_id,
          category_id: saveTaskParams.categoryId,
          task_status_id: saveTaskParams.status.id,
        },
        `workspaces/${this.state.workspaceId}/projects/${this.state.projectId}/task_lists/${this.state.list_id}/move/${saveTaskParams.tltId}`
      );

      var tasks = [...this.state.task_lists];

      if (saveTaskParams.tltId != -1) {
        const tltIndex = tasks.findIndex((x) => x.id == saveTaskParams.tltId);
        tasks[tltIndex].name = saveTaskParams.name;
        tasks[tltIndex].estimation = saveTaskParams.estimation;
        tasks[tltIndex].priority = saveTaskParams.priority;
        tasks[tltIndex].description = saveTaskParams.description;
        tasks[tltIndex].assigne_id = saveTaskParams.assigne_id;
        tasks[tltIndex].list_id = saveTaskParams.list_id;
        tasks[tltIndex].task_id = data.task_id ? data.task_id : 1;
        tasks[tltIndex].status = saveTaskParams.status.statusName;
      }
      console.log("tasks", tasks);
      this.setState({
        task_lists: tasks,
      });

      toast(
        <DailyPloyToast
          message="Task is successfully moved to dashboard"
          status="success"
        />,
        {
          autoClose: 2000,
          position: toast.POSITION.TOP_CENTER,
        }
      );
    } catch (e) {
      if (e.message) {
        toast(
          <DailyPloyToast message="Please select a member" status="error" />,
          {
            autoClose: 2000,
            position: toast.POSITION.TOP_CENTER,
          }
        );
      }
    }
  };

  showUserstoryTasks = (value) => {
    this.setState({ showUserstoryTasklist: value })
  }

  loadingNewUserStoryfunc = (value) => {
    this.setState({ loadingNewUserStory: value })
  }

  loadingeditedUserStory = (value, id) => {
    this.setState({ 
      editedUserStoryloading : value,
      editedUserStoryloadingId : id
     })
  }

  addUserStory = async (params) => {
    this.loadingNewUserStoryfunc(true)
    try {
      const { data } = await post(
        params,
        `workspaces/${this.state.workspaceId}/projects/${this.state.projectId}/task_lists/${this.state.list_id}/user_stories`)
      this.setState({ userStories: [...this.state.userStories, data] })
      this.loadingNewUserStoryfunc(false)
    } catch (error) {
      console.log(error)
    }
  }

  deleteUserStory = async (id) => {
    this.loadingeditedUserStory(true, id)
    try {
      const { data } = await del(
        `workspaces/${this.state.workspaceId}/projects/${this.state.projectId}/task_lists/${this.state.list_id}/user_stories/${id}`)
        this.closeUserStoryModal()
        //this.handleOpenTaskData(this.state.projectId)
        let filteredData = this.state.userStories.filter((x) => x.id != data.id)
        this.setState({ userStories: filteredData })
        this.loadingeditedUserStory(false, id)
    }
    catch (e) {}
  }

  UserStoryMarked = (value) => {
    this.setState ({
      markUserStory: value
    })
  }

  editUserstory = async (params, id) => {
    //this.loadingeditedUserStory(true, id)
    this.UserStoryMarked(true)
    try {
      const { data } = await put(
        params,
        `workspaces/${this.state.workspaceId}/projects/${this.state.projectId}/task_lists/${this.state.list_id}/user_stories/${id}`)
      let updated_data = this.state.userStories.map(x => x.id == data.id ? data : x)
      this.setState({ userStories: updated_data })
      this.fetchUserstory(id)
      //this.loadingeditedUserStory(false, id)
    } catch (error) {
      console.log(error)
    }
  }

  saveUserstoryTask = async (saveTaskParams, id) => {
    this.addTaskLoading(true)
    try {
      let params = {
        name: saveTaskParams.name,
        estimation: saveTaskParams.estimation,
        description: saveTaskParams.description,
        priority: saveTaskParams.priority,
        owner_id: saveTaskParams.assigne_id,
        task_status_id: saveTaskParams.status ? saveTaskParams.status.id : "",
      };

      const { data } = 
      this.state.editTltId == -1 
      ? await post(
        params,
        `workspaces/${this.state.workspaceId}/projects/${this.state.projectId}/user_stories/${id}/task_list_tasks`
      ): await put(
        params,
        `workspaces/${this.state.workspaceId}/projects/${this.state.projectId}/user_stories/${id}/task_list_tasks/${this.state.editTltId}`
      )
      if(this.state.editTltId != -1){ 
        const updatedTask =  this.state.currentUserstoryTask.filter(task => {
          return task.id !== data.id
        })
        this.setState({ 
          currentUserstoryTask: [...updatedTask, data],
          show: false,
          editTltId: -1,
          TaskShow: false, })
        this.fetchUserstory(id); 
        this.addTaskLoading(false) 
      } else {
        this.setState({ 
          currentUserstoryTask: [...this.state.currentUserstoryTask, data],
          show: false,
          editTltId: -1,
          TaskShow: false, })
        this.fetchUserstory(id);  
        this.addTaskLoading(false)
      }
     
    } catch (error) {
      console.log(error)
    }
  }

  deleteUserstoryTask = async (userstoryId, tltId) => {
    try {
      this.disableDeletebutton(true)
      const { data } = await del(
        `workspaces/${this.state.workspaceId}/projects/${this.state.projectId}/user_stories/${userstoryId}/task_list_tasks/${tltId}`);
      // this.setState({ userstoryUpdateTask: true })
      const newTaskList = this.state.currentUserstoryTask.filter(task => {
        return task.id !== data.id
      })
      this.setState({ currentUserstoryTask: newTaskList })
      this.disableDeletebutton(false)
      // this.fetchUserstory(userstoryId);
    } catch (error) {
      console.log("error", error)
    }
  }

  checklistLoading = (value) => {
    this.setState({
      isChecklistLoading: value
    })
  }

  addUserstoryChecklist = async (checklist, userstory) => {
    this.checklistLoading(true)
    try {
      const { data } = await post(
        checklist,
        `workspaces/${this.state.workspaceId}/projects/${this.state.projectId}/user_stories/${userstory.id}/checklists`)
        this.setState({
          userStory_checklists: [...this.state.userStory_checklists, data]
        })
        this.checklistProgress2([...this.state.userStory_checklists, data])
        this.checklistLoading(false)
      //this.fetchUserstory(userstory.id);
    } catch (error) {
      console.log("sa", error)
    }
  }

  updateUserstoryChecklist = async (id, params, userstory) => {
    try {
      this.checklistLoading(true)
      const { data } = await put(
        params,
        `workspaces/${this.state.workspaceId}/projects/${this.state.projectId}/user_stories/${userstory.id}/checklists/${id}`)
        let updated_data = this.state.userStory_checklists.map(x => x.id == data.id ? data : x)
        this.checklistProgress2(updated_data)
        this.setState({
          userStory_checklists: updated_data
        })
        this.checklistLoading(false)
        //this.fetchUserstory(userstory.id);
    } catch (error) {
      
    }
  }

  checklistProgress2 = (checklist_data) => {
    let progressBar = checklist_data.filter((checklist) => checklist.is_completed == true);
    let progress_percentage =
    Math.round((progressBar.length / checklist_data.length) * 100 * 10) / 10;
    if(progress_percentage == NaN)
    {
      this.setState({progressPercent: 0})
    }
    else
    {
      this.setState({ progressPercent : progress_percentage})
    }
  }

  deleteUserstoryChecklist = async (id, userstory) => {
    try {
      
      this.checklistLoading(true)
      const { data } = await del(
        `workspaces/${this.state.workspaceId}/projects/${this.state.projectId}/user_stories/${userstory.id}/checklists/${id}`)
        let filteredData = this.state.userStory_checklists.filter((checklist) => checklist.id != data.id)
        
        this.setState({
          userStory_checklists: filteredData
        })
        this.checklistLoading(false)
        //this.fetchUserstory(userstory.id);
    } catch (error) {
      
    }
  }



  usestoryMoveToDashboard = async (saveTaskParams, userstoryId) => {
    console.log("dnjsd", saveTaskParams)
    try {
      const { data } = await post(
        {
          start_datetime: saveTaskParams.startDate,
          end_datetime: saveTaskParams.endDate,
          owner_id: saveTaskParams.assigne_id,
          category_id: saveTaskParams.categoryId,
          task_status_id: saveTaskParams.status.id,
        },
        `workspaces/${this.state.workspaceId}/projects/${this.state.projectId}/user_stories/${userstoryId}/move/${saveTaskParams.tltId}`
      );
      this.fetchUserstory(userstoryId)
    } catch (error) {
      console.log("djsndjns")
    }
  }

  userStoryLoading = (value, id) => {
    this.setState({ 
      isUserStoryLoading: value,
      selectedUserStoryId : id
    })
  }

  fetchUserstory = async (id) => {
    this.userStoryLoading(true, id)
    try {
      var datafetched;
      if (this.state.filterWithSummary) {
        let params;
        if (this.state.filterWithSummaryType === "member") {
          params = { member_ids: this.state.filterWithSummaryId }
        } else if (this.state.filterWithSummaryType === "both") {
          params = { member_ids: this.state.filterWithSummaryId, status_ids: this.state.filterWithSummarySId }
        } else {
          params = { status_ids: this.state.filterWithSummaryId }
        }
        const { data } = await get(`workspaces/${this.state.workspaceId}/projects/${this.state.projectId}/task_lists/${this.state.list_id}/user_stories/${id}`,
        params );
        datafetched = data;
      } else {
        const { data } = await get(`workspaces/${this.state.workspaceId}/projects/${this.state.projectId}/task_lists/${this.state.list_id}/user_stories/${id}`)
        datafetched = data;
      }
      this.checklistProgress(datafetched)
      this.setState({
        currentUserstory: datafetched,
        userStory_checklists: datafetched.checklist,
        detailsModal: this.state.showUserstoryTasklist ? false : true,
        currentUserstoryTask: datafetched.task_lists,
        updatedData: this.state.detailsModal ? true : false,
      })
      this.userStoryLoading(false, id)
      this.checklistLoading(false)
      this.UserStoryMarked(false)
     
    } catch (error) {
      console.log(error)
      this.userStoryLoading(false, id)
    }
  }

  switchTask2 = async (taskId, tltId) => {
    try {
      const { data } = await put(
        { user_stories_id: null },
        `workspaces/${this.state.workspaceId}/projects/${this.state.projectId}/task_lists/${taskId}/task_list_tasks/${tltId}`
      );
      let tasks = this.state.currentUserstoryTask.filter((eachTlt) => {
        return tltId != eachTlt.id;
      });
      this.setState({
        currentUserstoryTask: tasks,
      });
      toast(
        <DailyPloyToast
          message="Task is successfully moved"
          status="success"
        />,
        {
          autoClose: 2000,
          position: toast.POSITION.TOP_CENTER,
        }
      );
    } catch (e) {
      if (e.message) {
        toast(
          <DailyPloyToast message="Something went wrong" status="error" />,
          {
            autoClose: 2000,
            position: toast.POSITION.TOP_CENTER,
          }
        );
      }
    }
  };

  checklistProgress = (currentUserstory) => {
    let progressBar = currentUserstory.checklist.filter((checklist) => checklist.is_completed == true);
    let progress_percentage =
    Math.round((progressBar.length / currentUserstory.checklist.length) * 100 * 10) / 10;
    if(progress_percentage == NaN)
    {
      this.setState({progressPercent: 0})
    }
    else
    {
      this.setState({ progressPercent : progress_percentage})
    }
  }

  showDetailsModal = () => {
    // detailsModal: this.state.showUserstoryTasklist ? false : true,
    this.setState({ detailsModal: !this.state.detailsModal })
  }

  closeUserStoryModal = () => {
    this.setState({ detailsModal: false })
  }

  handleUpdatedTask = () => {
    this.setState({ userstoryUpdateTask: false })
  }

  handleUpdatedData = () => {
    this.setState({ updatedData: false })
  }

  handleTaskC = () => {
    this.setState({ newChecklist: false })
  }

  taskEdit = (value) => {
    this.setState({ task_edit : value })
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
        <div className="task-body-box">
          {this.state.isTaskListLoading ? null :
          <div className="search-project-list">
            <div className="project-heading">Projects</div>
            <div className="container1">
              {this.state.projects.map((project, index) => {
                return (
                  <ProjectList
                    id={project.id}
                    name={project.name}
                    handleOpenTaskData={this.handleOpenTaskData}
                    bgcolor={project.color_code}
                    showbutton={
                      project.id === this.state.projectId ? true : false
                    }
                  />
                );
              })}
            </div>
          </div>}
          {this.state.isTaskListLoading ? <VideoLoader/> :
          (this.state.isTaskListLoaded ?  
          <Loader
          type="Puff"
          color="rgb(82 180 89)"
          height={65}
          width={65}
          style={{marginLeft:"46pc",
          marginTop:"13pc"}}
          /> :
          this.state.isRoadmapCreateLoading ? 
          <Loader
          type="Puff"
          color="rgb(82 180 89)"
          height={65}
          width={65}
          style={{marginLeft:"46pc",
          marginTop:"13pc"}}
          /> :
          <div className="add-task-card-box">
            <div className="container2">
              {this.state.showAddTaskButton && this.roleType == "admin" ? (
                <div
                  className="container2OpenModal"
                  onClick={this.openAddProjectTaskModal}
                >
                  <Button variant="primary" className="add-tasklist-btn">
                    <i class="fa fa-plus" /> Create Road Map
                  </Button>
                  </div>
                ) : null}
                <AddProjectTaskModel
                  show={this.state.show}
                  state={this.state}
                  closeTaskModal={this.closeOnlyTaskModal}
                  handleDateFrom={this.handleDateFrom}
                  handleDateTo={this.handleDateTo}
                  handleInputChange={this.handleInputChange}
                  handleTaskNameChange={this.handleTaskNameChange}
                  handleSaveTaskData={this.handleSaveTaskData}
                />
              </div>
              <div className="container3">
                {this.state.project_task_lists.taskName !== ""
                  ? this.state.project_task_lists.map((project, index) => {
                    if (this.state.projectId === project.projectId) {
                      return (
                        <DisplayTaskList
                          showChecklist={this.state.showChecklist}
                          checklistID={this.state.checklistID}
                          state={this.state}
                          showFilter={this.state.showFilter}
                          showSummary={this.state.showSummary}
                          id={project.id}
                          state={this.state}
                          projectMembers={this.state.projectMembers}
                          ProjectTask={project}
                          //Userstories={project.userStories}
                          Userstories={this.state.userStories}
                          projects={this.state.projects}
                          task_lists={this.state.task_lists}
                          taskEdit={this.taskEdit}
                          handleSaveTask={this.handleSaveTask}
                          getRoadmapStatus={this.getRoadmapStatus}
                          displayAddTask={this.displayAddTask}
                          closeAddTask={this.closeAddTask}
                          displayList={this.displayList}
                          displayFiteredList={this.displayFiteredList}
                          setUserStoryDetails={this.setUserStoryDetails}
                          isChecklistOpen={this.isChecklistOpen}
                          isFilterOpen={this.isFilterOpen}
                          isSummaryOpen={this.isSummaryOpen}
                          closeFilter={this.closeFilter}
                          closeSummary={this.closeSummary}
                          addUserStory={this.addUserStory}
                          deleteUserStory={this.deleteUserStory}
                          saveUserstoryTask={this.saveUserstoryTask}
                          closeChecklist={this.closeChecklist}
                          TaskShow={this.state.TaskShow}
                          list_id={this.state.list_id}
                          deleteTaskList={this.deleteTaskList}
                          editTaskList={this.editTaskList}
                          deleteTlt={this.deleteTlt}
                          projectTaskList={this.state.project_task_lists}
                          switchTask={this.switchTask}
                          switchTask2={this.switchTask2}
                          userTaskDetails={this.userTaskDetails}
                          EditTlt={this.editTlt}
                          editTltId={this.state.editTltId}
                          moveToDashBoard={this.moveToDashBoard}
                          loadFilteredData={this.loadFilteredData}
                          isFilterLoading={this.state.isFilterLoading}
                          loadTaskListTaskData={this.loadTaskListTaskData}
                          isTaskListTasksLoading={this.state.isTaskListTasksLoading}
                          worksapceMembers={this.state.worksapceUsers}
                          taskStatus={this.state.taskStatus}
                          categories={this.state.categories}
                          memeberSelected={this.memeberSelected}
                          handleDescription={this.handleDescription}
                          editUserstory={this.editUserstory}
                          setConjuction={this.setConjuction}
                          editDescription={this.editDescription}
                          addTaskChecklist={this.addTaskChecklist}
                          updateTaskChecklist={this.updateTaskChecklist}
                          deleteTaskChecklist={this.deleteTaskChecklist}
                          deleteUserstoryTask={this.deleteUserstoryTask}
                          fetchUserstory={this.fetchUserstory}
                          isUserStoryLoading={this.state.isUserStoryLoading}
                          selectedUserStoryId={this.state.selectedUserStoryId}
                          showDetailsModal={this.showDetailsModal}
                          currentUserstory={this.state.currentUserstory}
                          userStory_checklists={this.state.userStory_checklists}
                          detailsModal={this.state.detailsModal}
                          updatedData={this.state.updatedData}
                          userstoryUpdateTask={this.state.userstoryUpdateTask}
                          addUserstoryChecklist={this.addUserstoryChecklist}
                          updateUserstoryChecklist={this.updateUserstoryChecklist}
                          deleteUserstoryChecklist={this.deleteUserstoryChecklist}
                          handleUpdatedTask={this.handleUpdatedTask}
                          showUserstoryTasks={this.showUserstoryTasks}
                          currentUserstoryTask={this.state.currentUserstoryTask}
                          handleUpdatedData={this.handleUpdatedData}
                          checklistItem={this.state.checklistItem}
                          handleTaskC={this.handleTaskC}
                          newChecklist={this.state.newChecklist}
                          action={this.state.action}
                          usestoryMoveToDashboard={this.usestoryMoveToDashboard}
                          addTaskLoading={this.addTaskLoading}
                        />
                      );
                    } else {
                      return null;
                    }
                  })
                  : null}
              </div>

              <div className="container4">
                {this.state.project_task_lists.taskName !== ""
                  ? this.state.project_task_lists.map((project, index) => {
                    if (this.state.projectId === project.projectId) {
                      return (
                        <AddProjectTaskModel
                          show={this.state.show}
                          state={this.state}
                          closeTaskModal={this.closeOnlyTaskModal}
                          handleDateFrom={this.handleDateFrom}
                          handleDateTo={this.handleDateTo}
                          handleInputChange={this.handleInputChange}
                          handleTaskNameChange={this.handleTaskNameChange}
                          handleSaveTaskData={this.handleSaveTaskData}
                          isEdit={this.state.isEdit}
                        />
                      );
                    } else {
                      return null;
                    }
                  })
                  : null}
              </div>


              {/* ) : null} */}
              <AddProjectTaskModel
                show={this.state.show}
                state={this.state}
                closeTaskModal={this.closeOnlyTaskModal}
                handleDateFrom={this.handleDateFrom}
                handleDateTo={this.handleDateTo}
                handleInputChange={this.handleInputChange}
                handleTaskNameChange={this.handleTaskNameChange}
                handleSaveTaskData={this.handleSaveTaskData}
                isEdit={this.state.isEdit}
              />
            </div>)}
        </div>
      </>
    );
  }
}

export default withRouter(TaskProjectList);
