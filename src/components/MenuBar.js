import React, { Component } from "react";
import "../assets/css/dashboard.css";

export default class MenuBar extends Component {
  render() {
    return (
      <div className="row menubar-container">
        <div className="col-md-1">
          <button className="btn menubar-task-btn">
            <i class="fas fa-plus" />
          </button>
        </div>
        <div className="col-md-9">
          <input
            type="text"
            className="form-control menubar-filter"
            placeholder="Filter by Project/Member"
          />
        </div>
        <div className="col-md-2">
          <select class="form-control menubar-filter">
            <option>Weekly</option>
            <option>1 months</option>
            <option>3 months</option>
            <option>Yearly</option>
          </select>
        </div>
      </div>
    );
  }
}
