import React, { Component } from "react";
import moment from "moment";
import { get, post, put, del } from "./../../../utils/API";
import DailyPloyToast from "./../../../../src/components/DailyPloyToast";
import { ToastContainer, toast } from "react-toastify";
import Spinner from 'react-bootstrap/Spinner';
import ConfirmModal from "../../ConfirmModal";
import pencil from "../../../assets/images/pencil.png";
import delete1 from "../../../assets/images/delete.png";
import UpdateStatusModal from "./UpdateStatusModal";
class StatusSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEdit: false,
      rowId: null,
      taskCategories: [],
      categoryName: "",

      editCategoryError: false,
      categoryError: false,
      showConfirm: false,
      deleteCategory: "",
      projectError: false,
      projectName: "",
      projectId: 0,
      workspaceId: 0,
      statusError: false,
      status: "",
      project: [],
      projectSuggestions: [],
      showList: false,
      mainTaskStatus: [],
      taskStatus: [],
      showAddCategoryTr: false,
      deleteStattus: 0,
      statusId: 0,
      editId: 0,
      loading: true

    };
  }

  async componentDidMount() {
    this.setState({ workspaceId: this.props.workspaceId, projectId: this.props.projectId })
    //Status Listing
    try {
      const { data } = await get(
        `workspaces/${this.props.workspaceId}/projects/${this.props.projectId}/task_status?page_number=1&page_size=5`
      );
      var taskStatu = data.task_status;

      this.setState({ mainTaskStatus: taskStatu, taskStatus: taskStatu, loading: false })
    } catch (e) { }

    // this.setState({ taskCategories: taskCategories });


    //Project Listing
    //  try {
    //   var userIds =
    //     this.props.searchUserDetails.length > 0
    //       ? this.props.searchUserDetails.map(member => member.member_id)
    //       : [];
    //   var searchData = {};
    //   if (userIds.length > 0) {
    //     searchData["user_ids"] = userIds.join(",");
    //   }
    //   if (this.props.searchProjectIds.length > 0) {
    //     searchData["project_ids"] = this.props.searchProjectIds.join(",");
    //   }

    //   const { data } = await get(
    //     `workspaces/${this.props.workspaceId}/projects`,
    //     searchData
    //   );
    //   var projectsData = data.projects;
    //   this.setState({project:projectsData})

    // } catch (e) {
    //   console.log("err", e);
    // }
  }

  handleEditStatus = status => {
    this.setState({
      isEdit: true,
      editId: status.id,
    });
  };
  handleCloseEditStatus = () => {
    this.setState({
      isEdit: false,
      editId: 0,
    });
  };
  handleOpenDeleteStatus = (status) => {
    this.setState({
      statusId: status.id,
      showConfirm: true,
    });
  }
  handleCloseDeleteStatus = () => {
    this.setState({
      statusId: 0,
      showConfirm: false,
    });
  }
  categoryEdit = () => {
    this.setState({ isEdit: false });
  };

  toggleAddCategoryRow = () => {
    this.setState({ showAddCategoryTr: !this.state.showAddCategoryTr });
  };

  toggleEditCategoryRow = () => {
    this.setState({ isEdit: false, editId: 0, status: "" });
  };

  addCategory = async e => {
    if (this.state.status != "") {
      var data1 = {
        id: 9999,
        inserted_at: moment(),
        name: this.state.status,
        project: {
          color_code: "#b9e1ff",
          description: null,
          end_date: null,
          id: this.props.projectId,
          name: this.props.projectName,
          start_date: null
        },
        workspace: {
          id: this.props.workspaceId,
          name: " "
        }
      }
      var newTaskStatus = [...this.state.mainTaskStatus, data1];
      this.setState({
        taskStatus: newTaskStatus,
        // mainTaskStatus:newTaskStatus,
        showAddCategoryTr: false,
      });
      try {
        const { data } = await post(
          { name: this.state.status },
          `workspaces/${this.props.workspaceId}/projects/${this.state.projectId}/task_status`
        );
        var newTaskStatu = [...this.state.mainTaskStatus, data];
        this.setState({
          taskStatus: newTaskStatu,
          showAddCategoryTr: false,
        });



        toast(<DailyPloyToast message="Status Added" status="success" />, {
          autoClose: 2000,
          position: toast.POSITION.TOP_CENTER
        });

        this.setState({
          projectName: "",
          status: "",
          projectId: 0,
          statusError: false,
          projectError: false,
          showAddCategoryTr: false,
        });
      } catch (e) {
        if (e.response && e.response.status === 400) {


          toast(
            <DailyPloyToast message="Already Taken! "
              status="error" />,
            { autoClose: 2000, position: toast.POSITION.TOP_CENTER });
          this.setState({ statusError: true, showAddCategoryTr: true });
          if (
            e.response.data &&
            e.response.data.errors

          ) {


          }
        }
      }
    } else {
      this.setState({ statusError: true, showAddCategoryTr: true });
    }
  };

  editStatus = async e => {
    if (this.state.status != "" && this.state.editId !== 0) {
      var data1 = {
        id: 9999,
        inserted_at: moment(),
        name: this.state.status,
        project: {
          color_code: "#b9e1ff",
          description: null,
          end_date: null,
          id: this.props.projectId,
          name: this.props.projectName,
          start_date: null
        },
        workspace: {
          id: this.props.workspaceId,
          name: " "
        }
      }

      var filterStatus = this.state.mainTaskStatus.filter(
        c => c.id != this.state.editId
      );

      var newTaskS = [...filterStatus, data1];
      this.setState({
        taskStatus: newTaskS,
        mainTaskStatus: filterStatus,
        showAddCategoryTr: false,
      });

      try {
        const { data } = await put(
          { name: this.state.status },
          `workspaces/${this.props.workspaceId}/projects/${this.state.projectId}/task_status/${this.state.editId}`
        );
        console.log(data)
        var newTaskStatu = [...this.state.mainTaskStatus, data];
        this.setState({
          taskStatus: newTaskStatu,
          showAddCategoryTr: false,
        });
        toast(
          <DailyPloyToast message="Status Updated" status="success" />,
          {
            autoClose: 2000,
            position: toast.POSITION.TOP_CENTER
          }
        );
        this.setState({
          showAddCategoryTr: false,
          projectName: "",
          status: "",
          isEdit: false
        });
      } catch (e) {
        if (e.response && e.response.status === 400) {
          if (
            e.response.data &&
            e.response.data.errors

          ) {
            toast(
              <DailyPloyToast message="Already Taken! "
                status="error" />,
              { autoClose: 2000, position: toast.POSITION.TOP_CENTER });
            this.setState({ statusError: true, showAddCategoryTr: true });

          }
        }
      }

    } else {
      this.setState({ statusError: true });
    }
  };

  deleteCategory = async e => {
    if (this.state.statusId !== 0) {
      var filterStatus = this.state.mainTaskStatus.filter(
        c => c.id != this.state.statusId
      );
      this.setState({
        taskStatus: filterStatus,
        mainTaskStatus: filterStatus,
        showAddCategoryTr: false,
        showConfirm: false
      });

      try {
        const { data } = await del(
          `workspaces/${this.props.workspaceId}/projects/${this.props.projectId}/task_status/${this.state.statusId}`
        );
        toast(<DailyPloyToast message="Status deleted" status="success" />, {
          autoClose: 2000,
          position: toast.POSITION.TOP_CENTER
        });

        this.setState({

          showConfirm: false
        });
      } catch (e) { }
    }
  };

  //   handleEnterProjectName = e => {

  //       const { name, value } = e.target;
  //       let projectSuggestions = [];
  //         var searchOptions = this.state.project.map((user) =>user);
  //         if (value.length > 0) {
  //           const regex = new RegExp(`^${value}`, "i");
  //           projectSuggestions = searchOptions
  //             .sort()
  //             .filter((v) => regex.test(v.name));
  //         }
  //         if (value != "") {
  //             if(projectSuggestions.length>0){
  //                 this.setState({ [name]: value, projectSuggestions: projectSuggestions,showList:true,projectError: false });
  //             }else{
  //             this.setState({ [name]: value, projectSuggestions: projectSuggestions,showList:false,projectError: false });
  //             }
  //                } else {
  //                  this.setState({ projectError: true, projectName: "",showList:false });
  //                }


  //   };
  //   renderToSuggestions = () => {
  //     return (
  //       <>
  //         {this.state.projectSuggestions ? (
  //           <ul>
  //             {this.state.projectSuggestions.map((option, idx) => {
  //               return (
  //                 <li
  //                   key={idx}
  //                    onClick={() => this.handleSelectProject(option)}
  //                 >
  //                   <span className="right-left-space-5">
  //                     {/* <span className="text-titlize">{option.name}</span>( */}
  //                     {option.name}
  //                   </span>
  //                 </li>
  //               );
  //             })}
  //           </ul>
  //         ) : null}
  //       </>
  //     );
  //   };

  //   handleSelectProject = (option) => {

  // this.setState({projectName:option.name,projectId:option.id,projectSuggestions:[],showList:false,projectError: false})
  //   }
  handleEnterStatus = e => {
    var name = e.target.value;
    var statusError = e.target.name;

    if (statusError == "statusError") {
      if (name != "") {
        this.setState({ status: name, statusError: false });
      } else {
        this.setState({ statusError: true, status: "" });
      }
    } else {

    }
  };

  render() {
    return (
      <div className="statusDiv">
        {this.state.loading ? <div className="spinnerDive" >
          <Spinner animation="border" role="status" aria-hidden="true" variant="success">
          </Spinner></div> : <>
            {this.state.taskStatus ?
              <div className="row no-margin category" >

                {this.state.taskStatus.length === 0 ? <>
                  <div className="d-inline-block heading-text">
                    No task statuses configured. Please configure your first task status here.{"      "}
                  </div>
                  <div className=" text-right" style={{ marginBottom: "10px", marginLeft: "50px" }}>
                    <button
                      className="btn btn-primary btn-add"
                      onClick={this.toggleAddCategoryRow}
                    >
                      <span>+</span> Add
        </button>
                  </div></>
                  : <> <div className="d-inline-block col-md-4 heading-text">
                    {/* Task Status */}
                    <span className="d-inline-block category-cnt">
                      {/* ({ this.state.taskStatus.length}) */}


                    </span>
                  </div>
                    <div className="col-md-7 text-right">
                      <button
                        className="btn btn-primary btn-add"
                        onClick={this.toggleAddCategoryRow}
                      >
                        <span>+</span> Add
            </button>
                    </div></>}

              </div> : null}
            {this.state.taskStatus.length !== 0 ?
              <div className="category-box" style={{ borderTop: `2px solid ${this.props.color}` }}>
                <div className="col-md-12 no-padding">
                  <table className="table">

                    <thead>

                      <tr>
                        <th scope="col">
                          Status{" "}
                          <i className="fa fa-sort" aria-hidden="true"></i>
                        </th>
                        <th scope="col">
                          Date Created{" "}
                          <i className="fa fa-sort" aria-hidden="true"></i>
                        </th>
                        <th scope="col">
                          Modified Created{" "}
                          <i className="fa fa-sort" aria-hidden="true"></i>
                        </th>
                        <th></th>
                      </tr>
                    </thead>

                    <tbody>
                      {this.state.showAddCategoryTr ? (
                        <tr>
                          <td>
                            <input
                              className={`form-control ${
                                this.state.statusError ? " input-error-border" : ""
                                }`}
                              type="text"
                              value={this.state.status}
                              name="statusError"
                              onChange={e => this.handleEnterStatus(e)}
                              placeholder="Type status"
                            />

                          </td>
                          <td>{moment().format("DD MMM YYYY")}</td>
                          <td>-</td>
                          <td>
                            <div>
                              <button
                                className="btn btn-link"
                                onClick={this.toggleAddCategoryRow}
                              >
                                {/* <i class="fa fa-trash" aria-hidden="true"></i> */}
                                <img src={delete1} alt="pencil" />
                              </button>
                              <button
                                className="btn btn-link"
                                onClick={this.addCategory}
                              >
                                <span>
                                  <i class="fa fa-check" aria-hidden="true"></i>
                                </span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ) : null}
                      {this.state.taskStatus.map((object, index) => {
                        return (
                          <tr key={index}>

                            {this.state.isEdit &&
                              this.state.editId === object.id ? (
                                <td scope="row">
                                  <input
                                    className={`form-control ${
                                      this.state.statusError ? " input-error-border" : ""
                                      }`}
                                    type="text"
                                    value={this.state.status}
                                    name="statusError"
                                    onChange={e => this.handleEnterStatus(e)}
                                    placeholder="Type status"
                                  />
                                </td>) : (
                                <td><span className="text-titlize">{object.name}</span></td>
                              )}


                            <td><span className="text-titlize">{moment(object.inserted_at).format("DD MMM YYYY")}</span></td>
                            <td>-</td>
                            <td>
                              {this.state.isEdit &&
                                this.state.editId === object.id ? (
                                  <div>
                                    <button
                                      className="btn btn-link error-warning"
                                      onClick={this.toggleEditCategoryRow}
                                    >
                                      <i class="fa fa-close" aria-hidden="true"></i>
                                    </button>
                                    <button
                                      className="btn btn-link"
                                      onClick={this.editStatus}
                                    >
                                      <span>
                                        <i class="fa fa-check" aria-hidden="true"></i>
                                      </span>
                                    </button>
                                  </div>
                                ) : (
                                  <div>
                                    <button
                                      className="btn btn-link"
                                      onClick={() =>
                                        this.handleOpenDeleteStatus(object)
                                      }
                                    >
                                      {/* <i class="fa fa-trash" aria-hidden="true"></i> */}
                                      <img src={delete1} alt="pencil" />
                                    </button>
                                    <button
                                      className="btn btn-link"
                                      onClick={() => this.handleEditStatus(object)}
                                    >
                                      {/* <i className="fas fa-pencil-alt"></i> */}
                                      <img src={pencil} alt="pencil" />
                                    </button>
                                  </div>
                                )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                </div>
              </div> : <>
                {this.state.showAddCategoryTr ? (
                  <div className="category-box">
                    <div className="col-md-12 no-padding">
                      <table className="table">

                        <thead>
                          <tr>
                            <th scope="col">
                              Status{" "}
                              <i className="fa fa-sort" aria-hidden="true"></i>
                            </th>
                            <th scope="col">
                              Date Created{" "}
                              <i className="fa fa-sort" aria-hidden="true"></i>
                            </th>

                            <th> Modified Created{" "}</th>
                          </tr>
                        </thead>

                        <tbody>
                          <tr>
                            <td>
                              <input
                                className={`form-control ${
                                  this.state.statusError ? " input-error-border" : ""
                                  }`}
                                type="text"
                                value={this.state.status}
                                name="statusError"
                                onChange={e => this.handleEnterStatus(e)}
                                placeholder="Type status"
                              />
                            </td>
                            <td>{moment().format("DD MMM YYYY")}</td>
                            <td>-</td>
                            <td>
                              <div>
                                <button
                                  className="btn btn-link"
                                  onClick={this.toggleAddCategoryRow}
                                >
                                  {/* <i class="fa fa-trash" aria-hidden="true"></i> */}
                                  <img src={delete1} alt="pencil" />
                                </button>
                                <button
                                  className="btn btn-link"
                                  onClick={this.addCategory}
                                >
                                  <span>
                                    <i class="fa fa-check" aria-hidden="true"></i>
                                  </span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>) : null}
              </>}
            {this.state.showConfirm ? (
              <ConfirmModal
                show={this.state.showConfirm}
                message="Are you sure to Delete The Status?"
                buttonText="delete"
                onClick={this.deleteCategory}
                closeModal={this.handleCloseDeleteStatus}
              />
            ) : null}
            {/* {this.state.isEdit ? (
              // <UpdateStatusModal
              // isEdit={this.state.isEdit}
              // state={this.state}
              // handleEnterProjectName={this.handleEnterProjectName}
              // renderToSuggestions={this.renderToSuggestions}
              // handleSelectProject={this.handleSelectProject}
              // handleEnterStatus={this.handleEnterStatus}
              // handleCloseEditStatus={this.handleCloseEditStatus}
              // editStatus={this.editStatus}
              // projectId={this.props.projectId}
              // projectName={this.props.projectName}
              //>
            ) : null} */}
          </>}
      </div>
    );
  }
}

export default StatusSettings;
