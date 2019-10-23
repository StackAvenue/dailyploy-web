import React, { Component } from "react";
import { withRouter } from "react-router-dom";

class ReportTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: ""
    }
  }

  displayMessage = () => {
    if (this.props.state.searchUserId == "" && this.props.state.searchProjectIds.length == 0) {
      return ""
    }
  }

  calculateTime = (startDateTime, endDateTime) => {
    var s = new Date(startDateTime)
    var e = new Date(endDateTime)
    return s.getHours() + ":" + s.getMinutes() + " - " + e.getHours() + ":" + e.getMinutes()
  }

  getDiffOfTwoDate = (startDateTime, endDateTime) => {
    var diff = Math.abs(new Date(startDateTime) - new Date(endDateTime));
    var hours = (diff / (1000 * 60 * 60)).toFixed(1);
    return hours + " h"
  }

  getTotalHours = (tasks) => {
    var totalSec = ""
    {
      tasks.map((task, idx) => {
        totalSec += Math.abs(new Date(task.start_datetime) - new Date(task.end_datetime));
      })
    }
    var hours = (totalSec / (1000 * 60 * 60)).toFixed(1);
    return hours + " h"
  }

  render() {
    const TableRow = props => {
      return (
        <>
          <tr className="report-table-date">
            <th>{props.state.date}</th>
            <th></th>
            <th></th>
            <th>{this.getTotalHours(props.state.tasks)}</th>
          </tr>
          {props.state.tasks.map((task, idx) => {
            return (
              <tr className="text-titlize" key={idx}>
                <td>{this.calculateTime(task.start_datetime, task.end_datetime)}</td>
                <td>{task.name}</td>
                <td>{task.project.name}</td>
                <td >{this.getDiffOfTwoDate(task.start_datetime, task.end_datetime)}</td>
              </tr>
            );
          })}
        </>
      );
    }

    const TaskNotFound = () => {
      return (
        <>
          <div className="task-error">Task Not Found</div>
        </>
      )
    }

    return (
      <>
        {this.props.taskDetails.length > 0 ?
          <div className="reports-table-container">
            <div className="report-header">
              <span className="pull-left">Capacity </span>
              <span className="pull-right">Total Time: 200.00 h</span>
            </div>
            <table className="table">
              <thead>
                <tr className="r-l-space-20">
                  <th scope="col">Time</th>
                  <th scope="col">Task Name</th>
                  <th scope="col">Project Name</th>
                  <th scope="col">Duration</th>
                </tr>
              </thead>
              <tbody>
                {this.props.taskDetails.map((tasks, index) => {
                  return (<TableRow key={index} state={tasks} />)
                })}
              </tbody>
            </table>
          </div>
          : <TaskNotFound />}
      </>
    );
  }
}

export default withRouter(ReportTable)