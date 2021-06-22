import React, { Component } from "react";
import moment from "moment";
import { get, post, put, del } from "./../../../utils/API";
import DailyPloyToast from "./../../../../src/components/DailyPloyToast";
import { ToastContainer, toast } from "react-toastify";
import ConfirmModal from "../../ConfirmModal";
import Loader from 'react-loader-spinner';
import PropTypes from 'prop-types';
import ErrorBoundary from '../../../ErrorBoundary';

class CategoriesSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEdit: false,
      rowId: null,
      taskCategories: [],
      categoryName: "",
      showAddCategoryTr: false,
      editCategoryError: false,
      categoryError: false,
      showConfirm: false,
      deleteCategory: "",
      isLoader: false,
    };

  }

  async componentDidMount() {
    // Category Listing
    this.setState({ isLoader: true })
    try {
      const { data } = await get(
        `workspaces/${this.props.workspaceId}/task_category`
      );
      var taskCategories = data.task_categories;
    } catch (e) { }

    this.setState({ taskCategories: taskCategories, isLoader: false });

  }

  handleEditCatogries = category => {
    this.setState({
      isEdit: true,
      categoryId: category.task_category_id,
      editCategoryName: category.name
    });
  };

  categoryEdit = () => {
    this.setState({ isEdit: false });
  };

  toggleAddCategoryRow = () => {
    this.setState({ showAddCategoryTr: !this.state.showAddCategoryTr });
  };

  toggleEditCategoryRow = () => {
    this.setState({ isEdit: false, categoryId: "", categoryName: "" });
  };

  addCategory = async e => {
    if (this.state.categoryName != "") {
      try {
        const { data } = await post(
          { name: this.state.categoryName },
          `workspaces/${this.props.workspaceId}/task_category`
        );
        var taskCategory = data;
        toast(
          <ErrorBoundary>
            <DailyPloyToast message="Category Added" status="success" />
          </ErrorBoundary>, {
          autoClose: 2000,
          position: toast.POSITION.TOP_CENTER
        });
        var newTaskCategories = [...this.state.taskCategories, taskCategory];
        this.setState({
          taskCategories: newTaskCategories,
          showAddCategoryTr: false,
          categoryName: ""
        });
      } catch (e) {
        if (e.response && e.response.status === 400) {
          if (
            e.response.data &&
            e.response.data.errors &&
            e.response.data.errors.workspace_task_category_uniqueness
          ) {
            toast(
              <ErrorBoundary>
                <DailyPloyToast
                  message={
                    e.response.data.errors.workspace_task_category_uniqueness
                  }
                  status="error"
                />
              </ErrorBoundary>,
              {
                autoClose: 2000,
                position: toast.POSITION.TOP_CENTER
              }
            );
          }
        }
      }
    } else {
      this.setState({ categoryError: true });
    }
  };

  editCategory = async e => {
    if (this.state.editCategoryName != "") {
      try {
        const { data } = await put(
          { name: this.state.editCategoryName },
          `workspaces/${this.props.workspaceId}/task_category/${this.state.categoryId}`
        );
        var taskCategory = data;
        toast(
          <ErrorBoundary>
            <DailyPloyToast message="Category Name Updated" status="success" />
          </ErrorBoundary>,
          {
            autoClose: 2000,
            position: toast.POSITION.TOP_CENTER
          }
        );
      } catch (e) { }
      var newTaskCategories = this.state.taskCategories.filter(
        c => c.task_category_id != this.state.categoryId
      );
      var newTaskCategories = [...newTaskCategories, taskCategory];
      this.setState({
        taskCategories: newTaskCategories,
        editCategoryName: "",
        categoryId: "",
        isEdit: false
      });
    } else {
      this.setState({ editCategoryError: true });
    }
  };

  deleteCategory = async e => {
    if (this.state.deleteCategory) {
      try {
        const { data } = await del(
          `workspaces/${this.props.workspaceId}/task_category/${this.state.deleteCategory.task_category_id}`
        );
        toast(
          <ErrorBoundary>
            <DailyPloyToast message="Category deleted" status="success" />
          </ErrorBoundary>, {
          autoClose: 2000,
          position: toast.POSITION.TOP_CENTER
        });
        var categories = this.state.taskCategories.filter(
          c => c.task_category_id != this.state.deleteCategory.task_category_id
        );
        this.setState({
          taskCategories: categories,
          showConfirm: false
        });
      } catch (e) { }
    }
  };

  handleDeleteCategory = category => {
    this.setState({ deleteCategory: category, showConfirm: true });
  };

  closeConfirmModal = () => {
    this.setState({ showConfirm: false, deleteCategory: "" });
  };

  handleEnterName = e => {
    var name = e.target.value;
    var categoryError = e.target.name;
    console.log("handleEnterName", name, categoryError);
    if (categoryError == "categoryError") {
      if (name != "") {
        this.setState({ categoryName: name, categoryError: false });
      } else {
        this.setState({ categoryError: true, categoryName: "" });
      }
    } else {
      if (name != "") {
        this.setState({ editCategoryName: name, editCategoryError: false });
      } else {
        this.setState({ editCategoryError: true, editCategoryName: "" });
      }
    }
  };

  render() {
    return (
      <div className="categories-setting">
        {this.state && this.state.taskCategories && this.state.taskCategories.length === 0 && this.state.isLoader ?
          <div className="spinnerDive" >
            <ErrorBoundary>
              <Loader
                type="Puff"
                color="rgb(82 180 89)"
                height={65}
                width={65}
                style={{
                  // marginLeft: "46pc",
                  marginTop: "4pc",

                }}
              />
            </ErrorBoundary>
          </div> :
          <>
            {/* {this.state.taskCategories.map((data, i) => {
              return (
                <> */}
            <div className="row no-margin category" style={{ marginTop: "50px" }}>
              <div className="d-inline-block col-md-4 heading-text">
                Task Categories
            <span className="d-inline-block category-cnt">
                  (
              {this.state.taskCategories
                    ? this.state.taskCategories.length
                    : null}
              )
            </span>
              </div>
              <div className="col-md-8 text-right">
                <button
                  className="btn btn-primary btn-add"
                  onClick={this.toggleAddCategoryRow}
                >
                  <span>+</span> Add
            </button>
              </div>
            </div>
            <div className="category-box">
              <div className="col-md-12 no-padding">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col" style={{ width: "45%" }}>
                        Category Name{" "}
                        <i className="fa fa-sort" aria-hidden="true"></i>
                      </th>
                      {/* <th scope="col">
                        Number of task{" "}
                        <i className="fa fa-sort" aria-hidden="true"></i>
                      </th> */}
                      <th scope="col">
                        Date Created{" "}
                        <i className="fa fa-sort" aria-hidden="true"></i>
                      </th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.showAddCategoryTr ? (
                      <tr>
                        <td scope="row" className="center-height">
                          <input
                            className={`form-control ${this.state.categoryError ? " input-error-border" : ""
                              }`}
                            type="text"
                            value={this.state.categoryName}
                            name="categoryError"
                            onChange={e => this.handleEnterName(e)}
                            placeholder="Category Name"
                          />
                        </td>
                        {/* <td>{"0"}</td> */}
                        <td className="center-height">{moment().format("DD MMM YYYY")}</td>
                        <td>
                          <div>
                            <button
                              className="btn btn-link"
                              onClick={this.toggleAddCategoryRow}
                            >
                              <i class="fa fa-trash" aria-hidden="true"></i>
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
                    {this.state.taskCategories.map((category, index) => {
                      return (
                        <tr key={category.task_category_id}>
                          <td scope="row" className="center-height">
                            {this.state.isEdit &&
                              this.state.categoryId === category.task_category_id ? (
                                <input
                                  className={`form-control ${this.state.editCategoryError
                                    ? " input-error-border"
                                    : ""
                                    }`}
                                  type="text"
                                  name="editCategoryError"
                                  value={this.state.editCategoryName}
                                  onChange={this.handleEnterName}
                                  placeholder="Category Name"
                                />
                              ) : (
                                <span className="text-titlize">{category.name}</span>
                              )}
                          </td>
                          {/* <td>{"2"}</td> */}
                          <td className="center-height">{moment(category.inserted_at).format("DD MMM YYYY")}</td>
                          <td>
                            {this.state.isEdit &&
                              this.state.categoryId === category.task_category_id ? (
                                <div>
                                  <button
                                    className="btn btn-link"
                                    onClick={this.toggleEditCategoryRow}
                                  >
                                    <i class="fa fa-times" aria-hidden="true"></i>
                                  </button>
                                  <button
                                    className="btn btn-link"
                                    onClick={this.editCategory}
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
                                      this.handleDeleteCategory(category)
                                    }
                                  >
                                    <i class="fa fa-trash" aria-hidden="true"></i>
                                  </button>
                                  <button
                                    className="btn btn-link"
                                    onClick={() => this.handleEditCatogries(category)}
                                  >
                                    <i className="fas fa-pencil-alt"></i>
                                  </button>
                                </div>
                              )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {this.state.showConfirm ? (
                  <ErrorBoundary>
                    <ConfirmModal
                      show={this.state.showConfirm}
                      message="Are you sure to Delete The Category?"
                      buttonText="delete"
                      onClick={this.deleteCategory}
                      closeModal={this.closeConfirmModal}
                    />
                  </ErrorBoundary>
                ) : null}
              </div>
            </div>
            {/* </>) */}
          </>}
      </div>
    );
  }
}

CategoriesSettings.propTypes = {
  workspaceId: PropTypes.string.isRequired
}

export default CategoriesSettings;
