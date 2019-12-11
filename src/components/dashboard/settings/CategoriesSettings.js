import React, { Component } from "react";
import moment from "moment";
class CategoriesSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEdit: false,
      rowId: null,
      data: [
        { name: "QA/Testing", task: "11", dateCreated: "15 Jun 2019" },
        { name: "QA/Testing", task: "11", dateCreated: "15 Jun 2019" },
        { name: "QA/Testing", task: "11", dateCreated: "15 Jun 2019" },
        { name: "QA/Testing", task: "11", dateCreated: "15 Jun 2019" },
        { name: "QA/Testing", task: "11", dateCreated: "15 Jun 2019" },
        { name: "QA/Testing", task: "11", dateCreated: "15 Jun 2019" },
        { name: "QA/Testing", task: "11", dateCreated: "15 Jun 2019" }
      ]
    };
  }

  handleEditCatogries = id => {
    this.setState({ isEdit: true, rowId: id });
  };

  categoryEdit = () => {
    this.setState({ isEdit: false });
  };

  addRow = () => {
    let arr = [
      { name: null, task: "0", dateCreated: moment().format("DD MMM YYYY") }
    ];
    let newArr = [...arr, ...this.state.data];
    this.setState({ data: newArr, isEdit: true, rowId: 0 });
  };
  render() {
    return (
      <div className="categories-setting">
        <div className="row no-margin category">
          <div className="col-md-2 heading-text">Categories</div>
          <div className="col-md-1 sub">(10)</div>
          <div className="col-md-9 text-right">
            <button className="btn btn-primary btn-add" onClick={this.addRow}>
              <span>+</span> Add
            </button>
          </div>
        </div>
        <div className="category-box">
          <div className="col-md-12 no-padding">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col" style={{ width: "50%" }}>
                    Category Name{" "}
                    <i className="fa fa-sort" aria-hidden="true"></i>
                  </th>
                  <th scope="col">
                    Number of task{" "}
                    <i className="fa fa-sort" aria-hidden="true"></i>
                  </th>
                  <th scope="col">
                    Date Created{" "}
                    <i className="fa fa-sort" aria-hidden="true"></i>
                  </th>
                </tr>
              </thead>
              <tbody>
                {this.state.data.map((data, index) => {
                  return (
                    <tr>
                      <td scope="row">
                        {this.state.isEdit && this.state.rowId === index ? (
                          <input
                            className="form-control"
                            type="text"
                            value={data.name}
                            placeholder="Category Name"
                          />
                        ) : (
                          data.name
                        )}
                      </td>
                      <td>{data.task}</td>
                      <td>{data.dateCreated}</td>
                      <td>
                        {this.state.isEdit && this.state.rowId === index ? (
                          <div>
                            <button
                              className="btn btn-link"
                              onClick={this.categoryEdit}
                            >
                              <i class="fa fa-trash" aria-hidden="true"></i>
                            </button>
                            <button
                              className="btn btn-link"
                              onClick={this.categoryEdit}
                            >
                              <span>
                                <i class="fa fa-check" aria-hidden="true"></i>
                              </span>
                            </button>
                          </div>
                        ) : (
                          <button
                            className="btn btn-link"
                            onClick={() => this.handleEditCatogries(index)}
                          >
                            <i className="fas fa-pencil-alt"></i>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default CategoriesSettings;
