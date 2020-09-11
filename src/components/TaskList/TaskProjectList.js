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
      isProjectListShow: false,
      projectShowMemberId: null,
      showInfo: false,
      isAllChecked: false,
      showConfirm: false,
      showDeleteConfirm: false,
      editTaskId: -1,
      projects: [],
      categories: [],
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
    };
  }

  roleType = localStorage.getItem("userRole");

  async componentDidMount() {
    this.props.handleLoading(true);
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
    this.setState ({
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

  handleSaveTaskData = async () => {
    let loggedInUser = localStorage.getItem("logedInId");
    try {
      let params = {
        name: this.state.Name,
        start_date: this.state.dateFrom,
        end_date: this.state.dateTo,
        creator_id: loggedInUser,
        task_status_id: this.state.statusTask.id
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
        Project.push({
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

  getRoadmapStatus = async (statusId, taskListId) => {
    try {
      let params = {
        task_status_id: statusId
      };
        const { data } = await put(
          params,
            `workspaces/${this.state.workspaceId}/projects/${this.state.projectId}/task_lists/${taskListId}`
          );
          this.setState({
            statusTask : data.task_status
          })
    } catch (e) { }
}

  handleSaveTask = async (saveTaskParams, isMove) => {
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
            `workspaces/${this.state.workspaceId}/projects/${this.state.projectId}/task_lists/${this.state.list_id}/task_list_tasks`
          )
          : await put(
            params,
            `workspaces/${this.state.workspaceId}/projects/${
            this.state.projectId
            }/task_lists/${this.state.list_id}/task_list_tasks/${
            saveTaskParams.tltId
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

  displayList = async (taskListId, ID, type) => {
    if (this.state.list_id != taskListId || ID != null) {
      let params;
      if(type === this.state.MEMBER)
      {
        params = { member_ids:ID }
      }
      else
      if(type === this.state.STATUS)
      {
        params = { status_ids:ID }
      }
      else
      {
        params = ""
      }
      let taslListTask = [];

      try {
        const { data } = await get(
          `workspaces/${this.state.workspaceId}/projects/${this.state.projectId}/task_lists/${taskListId}/task_list_tasks`,
          params
        );
        taslListTask =
          data.entries && data.entries.length > 0
            ? data.entries.map((eachEntry) => {
              return {
                name: eachEntry.name,
                estimation: eachEntry.estimation,
                list_id: eachEntry.task_lists_id,
                priority: eachEntry.priority,
                status: eachEntry.task_status,
                description: eachEntry.description,
                assigne_id: eachEntry.owner_id,
                id: eachEntry.id,
                task_id: eachEntry.task_id,
              };
            })
            : [];
        this.setState({ list_id: taskListId, task_lists: taslListTask });
      } catch (e) {
        this.handleErroMsg(e);
      }
    } else this.setState({ list_id: -1 });
  };

  handleOpenTaskData = async (id) => {
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
              roadmap_status: data.task_status
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
          return { id: status.id, statusName: name, color: "#53a4f0" };
        });
      }
      console.log("data", taskStatusArray);
    } catch (e) {
      this.handleErroMsg(e);
    }
    this.setState({
      projectId: id,
      showbutton: false,
      showAddTaskButton: true,
      project_task_lists: taskListEntries,
      taskStatus: taskStatusArray,
      projectMembers: project && project.members ? project.members : []
    });
  };

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

  deleteTlt = async (tltId) => {

    // localStorage.setItem("isTLTDelete", true);
    try {
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
          <DailyPloyToast message="Something went wrong" status="error" />,
          {
            autoClose: 2000,
            position: toast.POSITION.TOP_CENTER,
          }
        );
      }
    }
  };

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
          </div>
          <div className="add-task-card-box">
            <div className="container2">
              {this.state.showAddTaskButton ? (
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
                        projects={this.state.projects}
                        task_lists={this.state.task_lists}
                        handleSaveTask={this.handleSaveTask}
                        getRoadmapStatus={this.getRoadmapStatus}
                        displayAddTask={this.displayAddTask}
                        displayList={this.displayList}
                        isChecklistOpen={this.isChecklistOpen}
                        isFilterOpen={this.isFilterOpen}
                        isSummaryOpen={this.isSummaryOpen}
                        closeFilter={this.closeFilter}
                        closeSummary={this.closeSummary}
                        closeChecklist={this.closeChecklist}
                        TaskShow={this.state.TaskShow}
                        list_id={this.state.list_id}
                        deleteTaskList={this.deleteTaskList}
                        editTaskList={this.editTaskList}
                        deleteTlt={this.deleteTlt}
                        projectTaskList={this.state.project_task_lists}
                        switchTask={this.switchTask}
                        EditTlt={this.editTlt}
                        editTltId={this.state.editTltId}
                        moveToDashBoard={this.moveToDashBoard}
                        worksapceMembers={this.state.worksapceUsers}
                        taskStatus={this.state.taskStatus}
                        categories={this.state.categories}
                        memeberSelected={this.memeberSelected}
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
          </div>
        </div>
      </>
    );
  }
}

export default withRouter(TaskProjectList);
