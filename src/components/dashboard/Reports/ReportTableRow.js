import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import moment from "moment";
import { DATE_FORMAT2, PRIORITIES_MAP } from "./../../../utils/Constants";
import { convertUTCToLocalDate } from "./../../../utils/function";

class ReportTableRow extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  calculateTime = (startDateTime, endDateTime) => {
    var sTime = moment(convertUTCToLocalDate(startDateTime)).format("HH:mm");
    var eTime = moment(convertUTCToLocalDate(endDateTime)).format("HH:mm");
    return sTime + "- " + eTime;
  };

  // renderLog = task => {
  //   <EditableSelect
  //     options={ligTimes}
  //     // value={this.state.selected}
  //     getOptionValue={option => option.id}
  //     getOptionLabel={option => option.name}
  //     action={false}
  //     createOption={text => {
  //       return { id: 1, name: text };
  //     }}
  //     onChange={this.selectedOption}
  //     saveInputEditable={this.saveInputEditable}
  //     state={this.state.trackSaved}
  //   />;
  // };

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
    return Number(totalSeconds);
    // var h = Math.floor(totalSeconds / 3600);
    // var m = Math.floor((totalSeconds % 3600) / 60);
    // return ("0" + h).slice(-2) + "h" + " " + ("0" + m).slice(-2) + "m";
  };

  dateFormater = totalSeconds => {
    var h = Math.floor(totalSeconds / 3600);
    var m = Math.floor((totalSeconds % 3600) / 60);
    return ("0" + h).slice(-2) + "h" + " " + ("0" + m).slice(-2) + "m";
  };

  getTotalHours = tasks => {
    if (tasks !== undefined) {
      var totalSec = 0;
      tasks.map((task, idx) => {
        totalSec += this.addTotalDuration(task.time_tracked);
      });
      return this.secondsToHours(totalSec);
    }
    return "0 h";
  };

  getTaskTotalDuration = timeTracked => {
    return this.addTotalDuration(timeTracked);
  };

  addTotalDuration = timeTracked => {
    return timeTracked
      .map(log => log.duration)
      .flat()
      .reduce((a, b) => a + b, 0);
  };

  secondsToHours = seconds => {
    let totalSeconds = Number(seconds);
    let h = Math.floor(totalSeconds / 3600);
    let m = Math.floor((totalSeconds % 3600) / 60);
    let s = Math.floor((totalSeconds % 3600) % 60);
    return ("0" + h).slice(-2) + "h" + " " + ("0" + m).slice(-2) + "m";
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
        <td></td>
      </tr>
    );
  };

  showCategory = priority => {
    let priorities = PRIORITIES_MAP.get(priority);
    return (
      <>
        <span
          className="d-inline-block priority"
          style={{ backgroundColor: priorities.color_code }}
        ></span>
        <span className="d-inline-block">{priorities.label}</span>
      </>
    );
  };

  renderTableRow = tasks => {
    return tasks.map((task, index) => {
      return (
        <tr key={index}>
          <td>
            {task.status == "running" ? (
              <div className="progress-btn">In progress</div>
            ) : null}
            {task.status == "completed" ? (
              <div className="complete-btn">Completed</div>
            ) : null}
            {task.status == "not_started" ? (
              <div className="not-start-btn">Not started</div>
            ) : null}
          </td>
          <td>{this.calculateTime(task.start_datetime, task.end_datetime)}</td>
          {/* <td>{this.renderLog(task)}</td> */}
          <td className="text-titlize">{task.name}</td>
          <td className="text-titlize">{task.project.name}</td>
          <td className="text-titlize">
            {task.category ? task.category.name : "---"}
          </td>
          <td className="text-titlize">{this.showCategory(task.priority)}</td>
          <td>
            {this.dateFormater(
              this.getDiffOfTwoDate(task.start_datetime, task.end_datetime)
            )}
          </td>
          <td
            style={
              this.getDiffOfTwoDate(task.start_datetime, task.end_datetime) <
              this.getTaskTotalDuration(task.time_tracked)
                ? { color: "#964B00" }
                : { color: "#33a1ff" }
            }
          >
            {this.dateFormater(this.getTaskTotalDuration(task.time_tracked))}
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
