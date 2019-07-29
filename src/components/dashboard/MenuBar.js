import React, { Component } from "react";
import "../../assets/css/dashboard.scss";

export default class MenuBar extends Component {
  constructor(props) {
    super(props);
    this.sortValues = [
      {
        content: "Daily",
        value: "week"
      },
      {
        content: "Weekly",
        value: "month"
      },
      {
        content: "Monthly",
        value: "month"
      }
    ];
    this.state = {
      sort: "week"
    };
  }

  sortHandler = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value }, console.log(this.state.sort));
    this.props.onSelectSort(value);
  };

  render() {
    const { sort } = this.state;
    console.log("Child render", this.state.sort);
    return (
      <>
        <div className="container-fluid">
          <div className="dashboard-container">
            <div className="row no-margin dashboard-menubar-container">
              <div className="col-md-1 home">Home</div>
              <div className="col-md-1 analysis">Analysis</div>
              <div className="col-md-7 no-padding ml-auto">
                <div className="col-md-10 d-inline-block sort-bar no-padding">
                  <div className="col-md-2 no-padding d-inline-block">
                    <select class="form-control select-bar">
                      <option value="project">Project</option>
                      <option value="user">User</option>
                    </select>
                  </div>
                  <div className="col-md-9 no-padding d-inline-block">
                    <input
                      type="text"
                      placeholder="Search Here"
                      className="form-control"
                    />
                  </div>
                </div>
                <div className="col-md-2 d-inline-block weekly-sort">
                  <select
                    name="sort"
                    class="form-control"
                    value={sort}
                    onChange={this.sortHandler}
                  >
                    {this.sortValues.map(item => {
                      return <option value={item.value}>{item.content}</option>;
                    })}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
