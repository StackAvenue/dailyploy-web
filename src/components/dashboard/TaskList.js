import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { get, logout, put, del } from "../../utils/API";
import { firstTwoLetter } from "../../utils/function";
import MenuBar from "./MenuBar";
import moment from "moment";
import ConfirmModal from "./../ConfirmModal";
import cookie from "react-cookies";
import EditMemberModal from "./Member/EditMemberModal";
import { toast } from "react-toastify";
import DailyPloyToast from "../DailyPloyToast";
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
      selectMemberArr: [],
      isAllChecked: false,
      showConfirm: false
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
      const { data } = await get(
        `workspaces/${this.state.workspaceId}/projects`
      );
      var projectsData = data.projects;
    } catch (e) {
      console.log("err", e);
    }

    try {
      const { data } = await get(
        `workspaces/${this.state.workspaceId}/members`
      );
      var userArr = data.members.map(user => user.email);
      var worksapceUsers = data.members;
      var worksapceUser = data.members.find(
        user => user.email === loggedInData.email
      );
      var memberArr = data.members.filter(
        user => user.email !== loggedInData.email
      );
      var emailArr = data.members.filter(
        user => user.email !== loggedInData.email
      );
      this.props.handleLoading(false);
    } catch (e) {
      console.log("users Error", e);
    }

    this.setState({
      userId: loggedInData.id,
      userName: loggedInData.name,
      userEmail: loggedInData.email,
      workspaces: workspacesData,
      projects: projectsData,
      users: userArr,
      isLogedInUserEmailArr: emailArr,
      userRole: worksapceUser ? worksapceUser.role : null,
      worksapceUsers: worksapceUsers,
      worksapceUser: worksapceUser,
      members: memberArr
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

  handleSearchFilterResult = data => {
    var searchUserDetails = [];
    var projectIds = [];
    {
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

  createUserProjectList = () => {
    let projectList = [];
    let memberList = [];
    if (this.state.projects) {
      {
        this.state.projects.map((project, index) => {
          projectList.push({
            value: project.name,
            project_id: project.id,
            type: "project",
            id: (index += 1)
          });
        });
      }
    }
    if (this.state.members) {
      this.state.members.map((member, idx) => {
        memberList.push({
          value: member.name,
          member_id: member.id,
          email: member.email,
          type: "member",
          role: member.role
        });
      });
    }
    var searchOptions = {
      members: memberList,
      projects: projectList
    };
    console.log("searchOptions", searchOptions);
    this.setState({ searchOptions: searchOptions });
    this.props.setSearchOptions(searchOptions);
  };

  handleLoad = value => {
    this.setState({ isLoading: value });
  };

  handleCheckAll = (e, projects) => {
    const allCheckboxChecked = e.target.checked;
    let projectsLength = projects.length;
    var arrProject;
    if (allCheckboxChecked === true) {
      arrProject = projects;
    } else {
      arrProject = [];
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
      selectMemberArr: arrProject,
      isAllChecked: allCheckboxChecked
    });
  };

  handleCheck = (e, project) => {
    let checked = e.target.checked;
    let arrProject = [];
    if (checked) {
      arrProject = [...this.state.selectMemberArr, ...[project]];
    } else {
      let filterProjectArr = this.state.selectMemberArr.filter(
        item => item.id !== project.id
      );
      arrProject = filterProjectArr;
    }
    this.setState({ selectMemberArr: arrProject });
  };

  toggleShowConfirm = () => {
    this.setState({ showConfirm: true });
  };

  deleteMembers = async e => {
    let memberIds = this.state.selectMemberArr.map(m => m.id).join(",");
    if (memberIds != "") {
      try {
        const { data } = await del(
          `workspaces/${this.state.workspaceId}/members?ids=${memberIds}`
        );
        let members = this.state.members.filter(
          m => !this.state.selectMemberArr.includes(m)
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
          members: members,
          selectMemberArr: []
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
                      onChange={e => this.handleCheckAll(e, this.state.members)}
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
                {this.state.selectMemberArr.length > 0 &&
                userRole == "admin" ? (
                  <>
                    <div className="d-inline-block">
                      <button
                        className="btn btn-primary delete-button"
                        // onClick={e => this.toggleShowConfirm()}
                      >
                        Delete
                      </button>
                    </div>
                    <div className="d-inline-block select-project-text">
                      {this.state.selectMemberArr.length + " Task Selected"}
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: "50px" }}></th>
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
              </tr>
            </thead>
            <tbody className="list-view">
              {this.state.members.map((member, index) => {
                return (
                  <tr key={index}>
                    <td style={{ width: "50px", paddingLeft: "60px" }}>
                      <input
                        className="styled-checkbox"
                        id={`styled-checkbox-${index}`}
                        type="checkbox"
                        name="isChecked"
                        onChange={e => this.handleCheck(e, member)}
                      />
                      <label htmlFor={`styled-checkbox-${index}`}></label>
                    </td>
                    <td
                      className="text-titlize"
                      style={{ paddingLeft: "60px" }}
                    >
                      {member.name}
                    </td>
                    <td>Weekly</td>
                    <td className="text-titlize">
                      <span>Dailyploy</span>
                    </td>
                    <td className="text-titlize">
                      <span>Metting</span>
                    </td>
                    <td className={"text-titlize"}>
                      <div
                        className={`${member.priority}-priority medium-priority`}
                      ></div>
                    </td>
                    <td>
                      <div className="member-action">
                        <div title={member.name} className="member-icon">
                          {firstTwoLetter(member.name)}
                        </div>
                        {/* <div>
                          <i class="fas fa-plus-circle"></i>
                        </div> */}
                        <div className="v-3-dot">
                          <i class="fa fa-ellipsis-v"></i>
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
            title="Delete Member"
            message={`Are you sure you want to Delete ${
              this.state.selectMemberArr.length == 1
                ? " this member"
                : "these members"
            }?`}
            onClick={this.deleteMembers}
            closeModal={this.closeModal}
            buttonText="Delete"
            show={this.state.showConfirm}
          />
        ) : null}
      </>
    );
  }
}

export default withRouter(TaskList);
