import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { get, post, put, del } from "../../utils/API";
import { firstTwoLetter } from "../../utils/function";
import { PRIORITIES } from "../../utils/Constants";
import MenuBar from "./MenuBar";
import moment from "moment";
import ConfirmModal from "./../ConfirmModal";
import cookie from "react-cookies";
import EditMemberModal from "./Member/EditMemberModal";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import DailyPloyToast from "../DailyPloyToast";
import RecurringTaskModal from "./RecurringTaskModal";
import "./../../../src/assets/css/taskList.scss";

class TaskList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      workspaces: [],
      workspaceId: "",
      members: [],
      isLogedInUserEmailArr: [],
      projects: [],
      userId: "",
      users: [],
      searchOptions: [],
      worksapceUsers: "",
      worksapceUser: [],
      isLoading: false,
      isProjectListShow: false,
      projectShowMemberId: null,
      show: false,
      setShow: false,
      memberName: null,
      memberEmail: null,
      memberAccess: null,
      memberRole: null,
      memberHours: "",
      selectedProjects: [],
      memberProjects: [],
      isDeleteShow: false,
      selectTaskArr: [],
      isAllChecked: false,
      showConfirm: false,
      memberSearchOptions: [],
      editableTask: null,
      taskButton: "Edit",
      comments: "",
      taskCategories: [],
      taskCategorie: null,
      projectShowTaskId: null,
      isProjectListShow: false,
      taskList: []
    };
  }

  async componentDidMount() {
    this.props.handleLoading(true);
    var loggedInData = cookie.load("loggedInUser");
    if (!loggedInData) {
      try {
        const { data } = await get("logged_in_user");
        var loggedInData = data;
      } catch (e) {
        console.log("err", e);
      }
    }

    // workspace Listing
    try {
      const { data } = await get("workspaces");
      var workspacesData = data.workspaces;
    } catch (e) {
      console.log("err", e);
    }

    this.getWorkspaceParams();

    // worksapce project Listing
    try {
      var userIds =
        this.props.searchUserDetails.length > 0
          ? this.props.searchUserDetails.map(member => member.member_id)
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
      // this.props.handleLoading(false);
    } catch (e) {
      console.log("err", e);
    }

    // workspace Member Listing
    try {
      const { data } = await get(
        `workspaces/${this.state.workspaceId}/members`
      );
      var worksapceUsers = data.members;
      var userArr = data.members.map(user => user.email);
      var emailArr = data.members;
    } catch (e) {
      console.log("users Error", e);
    }

    try {
      const { data } = await get(
        `workspaces/${this.state.workspaceId}/recurring_task`
      );
      var taskList = data.recurring_task;
      this.props.handleLoading(false);
    } catch (e) {}

    // Category Listing
    try {
      const { data } = await get(
        `workspaces/${this.state.workspaceId}/task_category`
      );
      var taskCategories = data.task_categories;
    } catch (e) {}

    this.setState({
      userId: loggedInData.id,
      userName: loggedInData.name,
      userEmail: loggedInData.email,
      workspaces: workspacesData,
      taskCategories: taskCategories,
      taskList: taskList,
      projects: projectsData
      // userRole: worksapceUser ? worksapceUser.role : null,
      // worksapceUsers: worksapceUsers,
      // worksapceUser: worksapceUser,
    });
    this.createUserProjectList();
  }

  async componentDidUpdate(prevProps, prevState) {}

  getWorkspaceParams = () => {
    const { workspaceId } = this.props.match.params;
    this.setState({ workspaceId: workspaceId });
  };

  classNameRoute = () => {
    let route = this.props.history.location.pathname;
    let routeName = route.split("/")[3];
    if (routeName === "task_list") {
      return "taskListTrue";
    } else {
      return false;
    }
  };

  // handleSearchFilterResult = data => {
  //   var searchUserDetails = [];
  //   var projectIds = [];
  //   {
  //     data.map((item, i) => {
  //       if (item.type === "member") {
  //         searchUserDetails.push(item);
  //       } else if (item.type === "project") {
  //         projectIds.push(item.project_id);
  //       }
  //     });
  //   }
  //   this.setState({
  //     searchProjectIds: projectIds,
  //     searchUserDetails: searchUserDetails
  //   });
  // };

  createUserProjectList = () => {
    let projectList = [];
    let memberList = [];
    // if (this.state.projects) {
    //   {
    //     this.state.projects.map((project, index) => {
    //       projectList.push({
    //         value: project.name,
    //         project_id: project.id,
    //         type: "project",
    //         id: (index += 1)
    //       });
    //     });
    //   }
    // }
    // if (this.state.members) {
    //   this.state.members.map((member, idx) => {
    //     memberList.push({
    //       value: member.name,
    //       member_id: member.id,
    //       email: member.email,
    //       type: "member",
    //       role: member.role
    //     });
    //   });
    // }
    var searchOptions = {
      members: memberList,
      projects: projectList
    };
    this.props.setSearchOptions(searchOptions);
  };

  memberProjects = userId => {
    return this.state.projects.filter(project =>
      project.members.map(m => m.id).includes(userId)
    );
  };

  handleLoad = value => {
    this.setState({ isLoading: value });
  };

  handleCheckAll = (e, tasks) => {
    const allCheckboxChecked = e.target.checked;
    let tasksLength = tasks.length;
    var taskArray;
    if (allCheckboxChecked === true) {
      taskArray = tasks;
    } else {
      taskArray = [];
    }
    var checkboxes = document.getElementsByName("isChecked");
    if (allCheckboxChecked) {
      for (let i in checkboxes) {
        if (checkboxes[i].checked === false) {
          checkboxes[i].checked = true;
        }
      }
    } else {
      for (let i in checkboxes) {
        if (checkboxes[i].checked === true) {
          checkboxes[i].checked = false;
        }
      }
    }
    this.setState({
      selectTaskArr: taskArray,
      isAllChecked: allCheckboxChecked
    });
  };

  handleCheck = (e, task) => {
    let checked = e.target.checked;
    let taskArr = [];
    if (checked) {
      taskArr = [...this.state.selectTaskArr, ...[task]];
    } else {
      let filterTaskArr = this.state.selectTaskArr.filter(
        item => item.id !== task.id
      );
      taskArr = filterTaskArr;
    }
    this.setState({ selectTaskArr: taskArr });
  };

  toggleShowConfirm = () => {
    this.setState({ showConfirm: true });
  };

  deleteTasks = async e => {
    let taskIds = this.state.selectTaskArr.map(m => m.id).join(",");
    if (taskIds != "") {
      try {
        const { data } = await del(
          // `workspaces/${this.state.workspaceId}/recurring_task/${taskIds}`
          `workspaces/${this.state.workspaceId}/recurring_task?ids=${taskIds}`
        );
        let tasks = this.state.taskList.filter(
          m => !this.state.selectTaskArr.includes(m)
        );
        toast(
          <DailyPloyToast
            message="Recurring Task Deleted Succesfully"
            status="success"
          />,
          { autoClose: 2000, position: toast.POSITION.TOP_CENTER }
        );
        this.setState({
          showConfirm: false,
          taskList: tasks,
          selectTaskArr: []
        });
      } catch (e) {
        toast(
          <DailyPloyToast message="Something went wrong" status="error" />,
          { autoClose: 2000, position: toast.POSITION.TOP_CENTER }
        );
      }
    }
  };

  taskSuspend = async task => {
    if (task) {
      try {
        let flag = task.schedule ? false : true;
        const { data } = await put(
          { schedule: flag },
          `workspaces/${this.state.workspaceId}/recurring_task/${task.id}`
        );
        var tasks = this.state.taskList;
        var task = tasks.find(t => t.id == task.id);
        task["schedule"] = flag;
        this.setState({
          taskList: tasks
        });
      } catch (e) {
        toast(
          <DailyPloyToast message="Something went wrong" status="error" />,
          { autoClose: 2000, position: toast.POSITION.TOP_CENTER }
        );
      }
    }
  };

  closeModal = () => {
    this.setState({ showConfirm: false });
  };

  closeTaskModal = () => {
    this.setState({
      show: false,
      editableTask: null,
      comments: "",
      taskName: null,
      taskCategorie: null,
      taskPrioritie: null,
      memberSearchOptions: [],
      selectedProjects: [],
      memberProjects: [],
      selectedMembers: [],
      taskUser: []
    });
  };

  onClickTaskEdit = task => {
    let priority = PRIORITIES.find(p => p.name == task.priority);
    let projects = this.state.projects.filter(p =>
      task.project_ids.includes(p.id)
    );
    this.setState({
      show: true,
      editableTask: task,
      taskName: task.name,
      comments: task.comments,
      taskCategorie: task.category,
      taskPrioritie: priority,
      memberSearchOptions: this.projectCommonMembers(projects),
      selectedProjects: projects,
      memberProjects: this.memberProjects(task.members[0].id),
      selectedMembers: task.members,
      taskUser: task.members[0] ? [task.members[0].id] : []
    });
  };

  handleCategoryChange = option => {
    this.setState({ taskCategorie: option });
  };

  addCategory = async categoryName => {
    if (categoryName != "") {
      try {
        const { data } = await post(
          { name: categoryName },
          `workspaces/${this.state.workspaceId}/task_category`
        );
        var taskCategory = data;
        toast(<DailyPloyToast message="Category Added" status="success" />, {
          autoClose: 2000,
          position: toast.POSITION.TOP_CENTER
        });
        var newTaskCategories = [...this.state.taskCategories, taskCategory];
        this.setState({
          taskCategories: newTaskCategories,
          taskCategorie: taskCategory
        });
      } catch (e) {
        if (e.response && e.response.status === 400) {
          if (
            e.response.data &&
            e.response.data.errors &&
            e.response.data.errors.workspace_task_category_uniqueness
          ) {
            toast(
              <DailyPloyToast
                message={
                  e.response.data.errors.workspace_task_category_uniqueness
                }
                status="error"
              />,
              {
                autoClose: 2000,
                position: toast.POSITION.TOP_CENTER
              }
            );
          }
        }
      }
    }
  };

  loadTask = async () => {
    try {
      const { data } = await get(
        `workspaces/${this.state.workspaceId}/recurring_task`
      );
      var taskList = data.recurring_task;
      this.setState({ taskList: taskList });
    } catch (e) {}
  };

  handlePrioritiesChange = option => {
    this.setState({ taskPrioritie: option });
  };

  handleInputChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  displayProjects = projects => {
    let arr = projects.map(project => project.name);
    let projectShow = arr.length > 1 ? arr[0] + ", " + arr[1] : arr[0];
    return projectShow;
  };

  countProject = projects => {
    let projectLength = projects.length;
    let count;
    if (projectLength > 2) {
      count = projectLength - 2;
    }
    let concatCount = "+" + count;
    if (!count) {
      return null;
    } else {
      return concatCount;
    }
  };

  countProjectView = (e, id) => {
    this.setState({ isProjectListShow: true, projectShowTaskId: id });
  };

  countProjectViewClose = () => {
    this.setState({ isProjectListShow: false });
  };

  handleMemberSelect = member => {
    var errors = this.state.errors;
    // errors["memberError"] = "";
    if (member) {
      this.setState({
        taskUser: [member.id],
        selectedMembers: [member],
        errors: errors
      });
    } else {
      this.setState({
        taskUser: [],
        selectedMembers: [],
        errors: errors
      });
    }
  };

  projectCommonMembers = projects => {
    if (projects.length > 0) {
      var members = projects.map(p => p.members).flat();
      var newMembers = [];
      members.forEach(m => {
        if (!newMembers.map(mm => mm.id).includes(m.id)) {
          newMembers.push(m);
        }
      });
      let memberIdArray = projects.map(p => p.members.map(m => m.id));
      let commonIds = this.getCommonElements(memberIdArray);
      let filterMembers = newMembers.filter(m => commonIds.includes(m.id));
      return filterMembers;
    } else {
      return [];
    }
  };

  getCommonElements = arrays => {
    var min = 1000;
    var arg = 0;
    var index = 0;
    var common = [];
    for (var i = 0; i < arrays.length; i++) {
      if (arrays[i].length < min) {
        min = arrays[i].length;
        arg = i;
      }
    }
    for (var i = 0; i < arrays[arg].length; i++) {
      for (var j = 0; j < arrays.length; j++) {
        if (j != arg && arrays[j].indexOf(arrays[arg][i]) != -1) {
          index++;
        }
      }
      if (index == arrays.length - 1) {
        common.push(arrays[arg][i]);
      }
      index = 0;
    }
    return common;
  };

  render() {
    var userRole = localStorage.getItem("userRole");
    return (
      <>
        <MenuBar
          onSelectSort={this.onSelectSort}
          workspaceId={this.state.workspaceId}
          classNameRoute={this.classNameRoute}
          handleLoad={this.handleLoad}
          state={this.state}
        />
        <div className="show-task-list padding-top-60px">
          <div className={`${userRole == "admin" ? "members" : ""}`}>
            <div className="row no-margin">
              <div
                className="col-md-2 d-inline-block no-padding"
                style={{ marginTop: "10px" }}
              >
                {userRole == "admin" ? (
                  <>
                    <input
                      className="styled-checkbox"
                      id={`styled-checkbox`}
                      type="checkbox"
                      name="chk[]"
                      onChange={e =>
                        this.handleCheckAll(e, this.state.taskList)
                      }
                    />
                    <label htmlFor={`styled-checkbox`}>
                      {this.state.isAllChecked ? (
                        <span>All Selected</span>
                      ) : (
                        <span>Select All</span>
                      )}
                    </label>
                  </>
                ) : null}
              </div>
              <div className="col-md-4 d-inline-block no-margin no-padding">
                {this.state.selectTaskArr.length > 0 && userRole == "admin" ? (
                  <>
                    <div className="d-inline-block">
                      <button
                        className="btn btn-primary delete-button"
                        onClick={e => this.toggleShowConfirm()}
                      >
                        Delete
                      </button>
                    </div>
                    <div className="d-inline-block select-project-text">
                      {this.state.selectTaskArr.length + " Task Selected"}
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th scope="col" style={{ paddingLeft: "60px" }}>
                  Task Name <i className="fa fa-sort" aria-hidden="true"></i>
                </th>
                <th scope="col">Frequency</th>
                <th scope="col">
                  Project Name <i className="fa fa-sort" aria-hidden="true"></i>
                </th>
                <th scope="col">Category</th>
                <th scope="col">Priority</th>
                <th scope="col">Members</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody className="list-view">
              {this.state.taskList.map((task, index) => {
                return (
                  <tr key={index}>
                    <td
                      className="text-titlize"
                      style={{ paddingLeft: "60px" }}
                    >
                      <input
                        className="styled-checkbox"
                        id={`styled-checkbox-${index}`}
                        type="checkbox"
                        name="isChecked"
                        onChange={e => this.handleCheck(e, task)}
                      />
                      <label htmlFor={`styled-checkbox-${index}`}></label>
                      {task.name}
                    </td>
                    <td className="text-titlize">{task.frequency}</td>
                    <td className="text-titlize">
                      {/* <span>{task.projects[0].name}</span> */}
                      <span>{this.displayProjects(task.projects)}</span>
                      <span
                        className="project-count"
                        style={{ pointer: "cursor" }}
                        onMouseMove={e => this.countProjectView(e, task.id)}
                      >
                        {this.countProject(task.projects)}
                      </span>
                      {this.state.isProjectListShow &&
                      this.state.projectShowTaskId === task.id ? (
                        <div className="project-count-list-show">
                          <div className="close-div">
                            <a onClick={this.countProjectViewClose}>
                              <i className="fa fa-times" aria-hidden="true"></i>
                            </a>
                          </div>
                          <div className="project-body-box">
                            {task.projects.map(project => (
                              <div className="project-body-text">
                                {project.name}
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </td>
                    <td className="text-titlize">
                      <span>{task.category.name}</span>
                    </td>
                    <td className={"text-titlize"} title={task.priority}>
                      <div className={`${task.priority}-priority`}></div>
                    </td>
                    <td>
                      <div className="task-action">
                        <div
                          title={task.members[0].name}
                          className="member-icon"
                        >
                          {firstTwoLetter(task.members[0].name)}
                        </div>
                        {/* <div>
                          <i class="fas fa-plus-circle"></i>
                        </div> */}
                        {/* <div className="v-3-dot">
                          <i class="fa fa-ellipsis-v"></i>
                        </div> */}
                      </div>
                    </td>
                    <td className="text-titlize">
                      <div className="task-action">
                        <div
                          title={"Edit"}
                          className="action"
                          onClick={() => this.onClickTaskEdit(task)}
                        >
                          <a className="fa fa-pencil"></a>
                        </div>
                        <div
                          className="custom-control action custom-switch"
                          title="Suspend Task"
                        >
                          <input
                            type="checkbox"
                            className="custom-control-input"
                            checked={task.schedule}
                            id={`suspend-${task.id}`}
                            onChange={() => this.taskSuspend(task)}
                          />
                          <label
                            className="custom-control-label"
                            htmlFor={`suspend-${task.id}`}
                          ></label>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {this.state.showConfirm ? (
          <ConfirmModal
            title="Delete Task"
            message={`Are you sure you want to Delete ${
              this.state.selectTaskArr.length == 1
                ? " this task"
                : "these tasks"
            }?`}
            onClick={this.deleteTasks}
            closeModal={this.closeModal}
            buttonText="Delete"
            show={this.state.showConfirm}
          />
        ) : null}
        {this.state.editableTask ? (
          <Modal
            className="task-modal"
            show={this.state.show}
            onHide={this.closeTaskModal}
          >
            <div className="row no-margin">
              <div className="col-md-12 d-inline-block header text-titlize">
                <div className="d-inline-block" style={{ width: "60%" }}>
                  <span>{"Edit Recurring Task"}</span>
                </div>
                <button
                  className="d-inline-block btn btn-link float-right"
                  onClick={this.closeTaskModal}
                >
                  <i className="fa fa-close"></i>
                </button>
              </div>
              <RecurringTaskModal
                show={this.state.show}
                loadTask={this.loadTask}
                state={this.state}
                backToTaskInfoModal={this.closeTaskModal}
                handleInputChange={this.handleInputChange}
                projects={this.state.projects}
                users={this.state.users}
                handleMemberSelect={this.handleMemberSelect}
                handleProjectSelect={this.handleProjectSelect}
                modalMemberSearchOptions={this.state.memberSearchOptions}
                confirmModal={this.confirmModal}
                handleCategoryChange={this.handleCategoryChange}
                handlePrioritiesChange={this.handlePrioritiesChange}
                handleTaskNameChange={this.handleTaskNameChange}
                saveComments={this.saveComments}
                toggleTaskStartState={this.toggleTaskStartState}
                confirm={true}
                editableTask={this.state.editableTask}
              />
            </div>
          </Modal>
        ) : null}
      </>
    );
  }
}

export default withRouter(TaskList);
