import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import moment from "moment";
import { DATE_FORMAT2 } from "./../../../utils/Constants"

class ReportTable2Row extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  calculateTime = (startDateTime, endDateTime) => {
    var s = new Date(startDateTime);
    var e = new Date(endDateTime);
    return (
      ("0" + s.getHours()).slice(-2) +
      ":" +
      ("0" + s.getMinutes()).slice(-2) +
      " - " +
      ("0" + e.getMinutes()).slice(-2) +
      ":" +
      ("0" + e.getMinutes()).slice(-2)
    );
  };

  getDiffOfTwoDate = (startDateTime, endDateTime) => {
    var start = moment(this.props.date).format("YYYY-MM-DD") + " " + moment(startDateTime).format("HH:mm")
    var end = moment(this.props.date).format("YYYY-MM-DD") + " " + moment(endDateTime).format("HH:mm")
    let totalMilSeconds = new Date(end) - new Date(start)
    var totalSeconds = (totalMilSeconds / 1000)
    totalSeconds = Number(totalSeconds);
    var h = Math.floor(totalSeconds / 3600);
    var m = Math.floor(totalSeconds % 3600 / 60);
    return ("0" + h).slice(-2) + ":" + ("0" + m).slice(-2) + " h";
  };

  getTotalHours = tasks => {
    if (tasks !== undefined) {
      var totalSec = null;
      {
        tasks.map((task, idx) => {
          var start = moment(this.props.date).format("YYYY-MM-DD") + " " + moment(task.start_datetime).format("HH:mm")
          var end = moment(this.props.date).format("YYYY-MM-DD") + " " + moment(task.end_datetime).format("HH:mm")
          let totalMilSeconds = new Date(end) - new Date(start)
          var totalSeconds = (totalMilSeconds / 1000)
          totalSec += totalSeconds
        });
      }
      totalSec = Number(totalSec);
      var h = Math.floor(totalSec / 3600);
      var m = Math.floor(totalSec % 3600 / 60);

      return ("0" + h).slice(-2) + ":" + ("0" + m).slice(-2) + " h";
    }
    return "0 h";
  };

  displayDate = (date) => {
    if (this.props.frequency !== 'daily') {
      return moment(date).format(DATE_FORMAT2)
    }
    return ""
  }

  displayMembers = members => {
    if (members) {
      let arr = members.map(project => project.name);
      var memberShow;
      let count;
      if (arr.length > 2) {
        count = arr.length - 2;
      }
      if (arr.length > 2) {
        memberShow =
          arr.length > 1 ? arr[0] + "," + arr[1] + " +" + count : arr[0];
      } else {
        memberShow = arr.length > 1 ? arr[0] + "," + arr[1] : arr[0];
      }
      return memberShow;
    }
    return ""
  };

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
          <td className="text-titlize">{this.displayMembers(task.project.members)}</td>
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