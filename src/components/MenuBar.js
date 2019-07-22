import React, { Component } from "react";
import "../assets/css/dashboard.css";

export default class MenuBar extends Component {
  constructor(props) {
    super(props);
    this.sortValues = [
      {
        content: "Daily",
        value: "hour"
      },
      {
        content: "Weekly",
        value: "day"
      },
      {
        content: "Monthly",
        value: "week"
      }
    ];
    this.state = {
      sort: ""
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
      <div className="row menubar-container">
        <div className="col-md-1" />
        <div className="col-md-9">
          <input
            type="text"
            className="form-control menubar-filter"
            placeholder="Filter by Project/Member"
          />
        </div>
        <div className="col-md-2 menubar-day-sort">
          <select
            name="sort"
            class="form-control menubar-filter"
            value={sort}
            onChange={this.sortHandler}
          >
            {this.sortValues.map(item => {
              return <option value={item.value}>{item.content}</option>;
            })}
          </select>
        </div>
      </div>
    );
  }
}
