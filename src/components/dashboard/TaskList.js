import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { get, logout, put, del } from "../../utils/API";
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
      memberProjects: null,
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
      taskList: [
        {
          category: {
            name: "integration",
            task_category_id: 2
          },
          category_id: 2,
          comments: null,
          frequency: "weekly",
          id: 1,
          members: [
            {
              id: 1,
              name: "ravi karale",
              email: "ravi@gmail.com"
            }
          ],
          name: "Task 12",
          number: 1,
          priority: "high",
          projects: [
            {
              id: 12,
              name: "dailyploy",
              color_code: "#dsfdsf"
            }
          ],
          schedule: true,
          start_datetime: "2020-03-23T00:00:00Z",
          end_datetime: null,
          status: "not_started",
          week_numbers: [
            {
              id: 0,
              name: "monday"
            }
          ],
          month_numbers: [0, 5]
        },
        {
          category: {
            name: "integration",
            task_category_id: 2
          },
          category_id: 2,
          comments: "testing testing",
          frequency: "weekly",
          id: 2,
          members: [
            {
              id: 1,
              name: "ravi karale",
              email: "ravi@gmail.com"
            }
          ],
          name: "Task 13",
          number: 1,
          priority: "medium",
          projects: [
            {
              id: 12,
              name: "dailyploy",
              color_code: "#dsfdsf"
            }
          ],
          schedule: false,
          start_datetime: "2020-03-23T00:00:00Z",
          end_datetime: null,
          status: "not_started",
          week_numbers: {
            id: 0,
            name: "monday"
          },
          month_numbers: [0, 5]
        }
      ]
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

    try {
      const { data } = await get(
        `workspaces/${this.state.workspaceId}/task_list`
      );
      var taskList = data.tasks.this.props.handleLoading(false);
    } catch (e) {
      console.log("users Error", e);
    }

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
      taskCategories: taskCategories
      // userRole: worksapceUser ? worksapceUser.role : null,
      // worksapceUsers: worksapceUsers,
      // worksapceUser: worksapceUser,
      // taskList: taskList
    });
    // this.createUserProjectList();
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

  // createUserProjectList = () => {
  //   let projectList = [];
  //   let memberList = [];
  //   if (this.state.projects) {
  //     {
  //       this.state.projects.map((project, index) => {
  //         projectList.push({
  //           value: project.name,
  //           project_id: project.id,
  //           type: "project",
  //           id: (index += 1)
  //         });
  //       });
  //     }
  //   }
  //   if (this.state.members) {
  //     this.state.members.map((member, idx) => {
  //       memberList.push({
  //         value: member.name,
  //         member_id: member.id,
  //         email: member.email,
  //         type: "member",
  //         role: member.role
  //       });
  //     });
  //   }
  //   var searchOptions = {
  //     members: memberList,
  //     projects: projectList
  //   };
  //   console.log("searchOptions", searchOptions);
  //   this.setState({ searchOptions: searchOptions });
  //   this.props.setSearchOptions(searchOptions);
  // };

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
          `workspaces/${this.state.workspaceId}/members?ids=${taskIds}`
        );
        let tasks = this.state.taskList.filter(
          m => !this.state.selectTaskArr.includes(m)
        );
        toast(
          <DailyPloyToast
            message="member Deleted Succesfully"
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
        // const { data } = await put(
        //   { schedule: !task.schedule },
        //   `workspaces/${this.state.workspaceId}/task_list/${task.id}`
        // );
        var tasks = this.state.taskList;
        var task = tasks.find(t => t.id == task.id);
        task["schedule"] = !task.schedule;
        // task["schedule"] = data.schedule ? data.schedule : !task.schedule;
        // toast(
        //   <DailyPloyToast
        //     message="member Deleted Succesfully"
        //     status="success"
        //   />,
        //   { autoClose: 2000, position: toast.POSITION.TOP_CENTER }
        // );
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
      taskPrioritie: null
    });
  };

  onClickTaskEdit = task => {
    let priority = PRIORITIES.find(p => p.name == task.priority);
    this.setState({
      show: true,
      editableTask: task,
      taskName: task.name,
      comments: task.comments,
      taskCategorie: task.category,
      taskPrioritie: priority
    });
  };

  handleInputChange = e => {
    const { name, value } = e.target;
    var errors = this.state.errors;
    errors[`${name}Error`] = "";
    this.setState({ [name]: value, errors: errors });
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
                {this.state.worksapceUser &&
                this.state.worksapceUser.role == "admin" ? (
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
                      <span>{task.projects[0].name}</span>
                    </td>
                    <td className="text-titlize">
                      <span>{task.category.name}</span>
                    </td>
                    <td className={"text-titlize"}>
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
                          className="action"
                          onClick={() => this.onClickTaskEdit(task)}
                        >
                          <a className="fa fa-pencil"></a>
                        </div>
                        <div className="custom-control action custom-switch">
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
              />
            </div>
          </Modal>
        ) : null}
      </>
    );
  }
}

export default withRouter(TaskList);
