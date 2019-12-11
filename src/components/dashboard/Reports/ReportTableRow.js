import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import moment from "moment";
import { DATE_FORMAT2 } from "./../../../utils/Constants";

class ReportTableRow extends Component {
  constructor(props) {
    super(props);
    this.state = {};
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
    var start =
      moment(this.props.date).format("YYYY-MM-DD") +
      " " +
      moment(startDateTime).format("HH:mm");
    var end =
      moment(this.props.date).format("YYYY-MM-DD") +
      " " +
      moment(endDateTime).format("HH:mm");
    let totalMilSeconds = new Date(end) - new Date(start);
    var totalSeconds = totalMilSeconds / 1000;
    totalSeconds = Number(totalSeconds);
    var h = Math.floor(totalSeconds / 3600);
    var m = Math.floor((totalSeconds % 3600) / 60);
    return ("0" + h).slice(-2) + ":" + ("0" + m).slice(-2) + " h";
  };

  getTotalHours = tasks => {
    if (tasks !== undefined) {
      var totalSec = null;
      {
        tasks.map((task, idx) => {
          var start =
            moment(this.props.date).format("YYYY-MM-DD") +
            " " +
            moment(task.start_datetime).format("HH:mm");
          var end =
            moment(this.props.date).format("YYYY-MM-DD") +
            " " +
            moment(task.end_datetime).format("HH:mm");
          let totalMilSeconds = new Date(end) - new Date(start);
          var totalSeconds = totalMilSeconds / 1000;
          totalSec += totalSeconds;
        });
      }
      totalSec = Number(totalSec);
      var h = Math.floor(totalSec / 3600);
      var m = Math.floor((totalSec % 3600) / 60);

      return ("0" + h).slice(-2) + ":" + ("0" + m).slice(-2) + " h";
    }
    return "0 h";
  };

  displayDate = date => {
    if (this.props.frequency !== "daily") {
      return moment(date).format(DATE_FORMAT2);
    }
    return "";
  };

  taskNotFound = () => {
    return (
      <tr className="manage-error-tr">
        <td>No Tasks for this day</td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
    );
  };

  showCategory = () => {
    return (
      <>
        <span className="d-inline-block priority-medium"></span>
        <span className="d-inline-block">{"medium"}</span>
      </>
    );
  };

  renderTableRow = tasks => {
    return tasks.map((task, index) => {
      return (
        <tr key={index}>
          <td>
            {true ? <div className="progress-btn">In progress</div> : null}
            {false ? <div className="complete-btn">Completed</div> : null}
            {false ? <div className="not-start-btn">Not started</div> : null}
          </td>
          <td>{this.calculateTime(task.start_datetime, task.end_datetime)}</td>
          <td className="text-titlize">{task.name}</td>
          <td className="text-titlize">{task.project.name}</td>
          <td className="text-titlize">{"Category 1"}</td>
          <td className="text-titlize">{this.showCategory()}</td>
          <td>
            {this.getDiffOfTwoDate(task.start_datetime, task.end_datetime)}
          </td>
        </tr>
      );
    });
  };

  render() {
    return (
      <>
        <tr className="report-table-date">
          <th>{this.displayDate(this.props.date)}</th>
          <th></th>
          <th></th>
          <th></th>
          <th></th>
          <th></th>
          <th>{this.getTotalHours(this.props.tasks)}</th>
        </tr>
        {this.props.tasks.length !== 0
          ? this.renderTableRow(this.props.tasks)
          : this.taskNotFound()}
      </>
    );
  }
}

export default withRouter(ReportTableRow);
