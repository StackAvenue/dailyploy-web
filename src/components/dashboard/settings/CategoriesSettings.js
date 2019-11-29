import React, { Component } from "react";

class CategoriesSettings extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="categories-setting">
        <div className="row no-margin category">
          <div className="col-md-2 heading-text">Categories</div>
          <div className="col-md-1 sub">(10)</div>
          <div className="col-md-9 text-right">
            <button className="btn btn-primary btn-add">
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
                <tr>
                  <td scope="row">QA/Testing</td>
                  <td>11</td>
                  <td>15 Jun 2019</td>
                  <td>
                    <button className="btn btn-link">
                      <i className="fas fa-pencil-alt"></i>
                    </button>
                  </td>
                </tr>
                <tr>
                  <td scope="row">QA/Testing</td>
                  <td>11</td>
                  <td>15 Jun 2019</td>
                  <td>
                    <button className="btn btn-link">
                      <i className="fas fa-pencil-alt"></i>
                    </button>
                  </td>
                </tr>
                <tr>
                  <td scope="row">QA/Testing</td>
                  <td>11</td>
                  <td>15 Jun 2019</td>
                  <td>
                    <button className="btn btn-link">
                      <i className="fas fa-pencil-alt"></i>
                    </button>
                  </td>
                </tr>
                <tr>
                  <td scope="row">QA/Testing</td>
                  <td>11</td>
                  <td>15 Jun 2019</td>
                  <td>
                    <button className="btn btn-link">
                      <i className="fas fa-pencil-alt"></i>
                    </button>
                  </td>
                </tr>
                <tr>
                  <td scope="row">QA/Testing</td>
                  <td>11</td>
                  <td>15 Jun 2019</td>
                  <td>
                    <button className="btn btn-link">
                      <i className="fas fa-pencil-alt"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default CategoriesSettings;
