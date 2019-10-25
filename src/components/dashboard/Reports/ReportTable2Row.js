import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import moment from "moment";


class ReportTable2Row extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
    if (tasks !== undefined) {
      var totalSec = ""
      {
        tasks.map((task, idx) => {
          totalSec += Math.abs(new Date(task.start_datetime) - new Date(task.end_datetime));
        })
      }
      var hours = (totalSec / (1000 * 60 * 60)).toFixed(1);
      return hours + " h"
    }
    return "0 h"
  }

  displayDate = (date) => {
    if (this.props.frequency !== 'daily') {
      return moment(date).format("DD MMM YYYY")
    }
    return ""
  }

  taskNotFound = () => {
    return (
      <tr className="manage-error-tr">
        <td>No Tasks for this day</td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
    )
  }

  renderTableRow = (tasks) => {
    return tasks.map((task, index) => {
      return (
        <tr key={index}>
          <td>{}</td>
          <td className="text-titlize">{task.name}</td>
          <td className={"text-titlize catergory2 " + task.category} >{"category 2"}</td>
          <td>{this.calculateTime(task.start_datetime, task.end_datetime)}</td>
          <td >{this.getDiffOfTwoDate(task.start_datetime, task.end_datetime)}</td>
        </tr>
      )
    })
  }

  render() {

    return (
      <>
        <tr className="report-table-date">
          <th>{this.displayDate(this.props.date)}</th>
          <th></th>
          <th></th>
          <th></th>
          <th>{this.getTotalHours(this.props.tasks)}</th>
        </tr>
        {this.props.tasks.length !== 0 ? this.renderTableRow(this.props.tasks) : this.taskNotFound()}
      </>
    )
  }
}

export default withRouter(ReportTable2Row)