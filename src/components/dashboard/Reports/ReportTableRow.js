import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import moment from "moment";
import {
  DATE_FORMAT2,
  PRIORITIES_MAP,
  DATE_FORMAT1
} from "./../../../utils/Constants";
import { convertUTCToLocalDate } from "./../../../utils/function";
import EditableSelect from "./../../EditableSelect";

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

  renderLog = task => {
    let trackLogs = task.time_tracked
      .sort((a, b) => b.id - a.id)
      .map(time => {
        return {
          id: time.id,
          name: `${moment(time.start_time).format("HH:mm A")} - ${moment(
            time.end_time
          ).format("HH:mm A")}`,
          start: time.start_time,
          end: time.end_time
        };
      });
    let first = trackLogs[0];
    return (
      <div className="reports-track-logs">
        {trackLogs.length > 0 ? (
          <EditableSelect
            options={trackLogs.slice(1)}
            value={first}
            getOptionValue={option => option.id}
            getOptionLabel={option => option.name}
            action={false}
            onChange={() => {}}
            saveInputEditable={() => {}}
            state={this.state.trackSaved}
          />
        ) : (
          <span>No tracked Time</span>
        )}
      </div>
    );
  };

  getDiffOfTwoDate = (startDateTime, endDateTime) => {
    let endTime = moment(endDateTime).format("HH:mm:ss");
    let startTime = moment(startDateTime).format("HH:mm:ss");
    if (endTime != "00:00:00") {
      var start =
        moment(this.props.date).format("YYYY-MM-DD") +
        " " +
        moment(startDateTime).format("HH:mm:ss");
      var end = moment(this.props.date).format("YYYY-MM-DD") + " " + endTime;
      let totalMilSeconds = new Date(end) - new Date(start);
      var totalSeconds = totalMilSeconds / 1000;
      return Number(totalSeconds);
    }
    return 0;
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

  getEstimateTimeOfTask = task => {
    let start = moment(convertUTCToLocalDate(task.start_datetime)).format(
      DATE_FORMAT1
    );
    let end = moment(convertUTCToLocalDate(task.end_datetime)).format(
      DATE_FORMAT1
    );
    var startTime = moment(convertUTCToLocalDate(task.start_datetime)).format(
      "HH:mm:ss"
    );
    var endTime = moment(convertUTCToLocalDate(task.end_datetime)).format(
      "HH:mm:ss"
    );
    if (this.props.date == start && start == end) {
      return this.getDiffOfTwoDate(
        new Date(start + " " + startTime),
        new Date(end + " " + endTime)
      );
    } else {
      let dates = this.getMiddleDates(start, end);
      let datesMap = new Map();
      dates.map((date, idx) => {
        if (idx == 0 && date == start) {
          datesMap.set(date, {
            start: date + " " + startTime,
            end:
              date +
              " " +
              `${startTime == "00:00:00" ? "00:00:00" : "23:59:59"}`
          });
        } else if (idx == dates.length - 1 && date == end) {
          datesMap.set(date, {
            start: date + " " + "00:00:00",
            end: date + " " + `${endTime != "00:00:00" ? endTime : "00:00:00"}`
          });
        } else {
          datesMap.set(date, {
            start: date + " " + "00:00:00",
            end:
              date +
              " " +
              `${
                startTime == "00:00:00" && endTime == "00:00:00"
                  ? "00:00:00"
                  : "23:59:59"
              }`
          });
        }
      });
      let dateMap = datesMap.get(this.props.date);
      return dateMap
        ? this.getDiffOfTwoDate(new Date(dateMap.start), new Date(dateMap.end))
        : 0;
    }
  };

  getMiddleDates = (start, end) => {
    var startDate = new Date(start);
    var endDate = new Date(end);
    var daysArr = new Array();
    var currentDate = startDate;
    while (currentDate <= endDate) {
      daysArr.push(moment(currentDate).format(DATE_FORMAT1));
      var date = moment(currentDate, DATE_FORMAT1)
        .add(1, "days")
        .format(DATE_FORMAT1);
      currentDate = new Date(date);
    }
    return daysArr;
  };

  renderTableRow = tasks => {
    return tasks.map((task, index) => {
      return (
        <tr key={index} className="report-table-row">
          <td className="td-1">
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
          {/* <td>{this.calculateTime(task.start_datetime, task.end_datetime)}</td> */}
          <td className="td-2" style={{ width: "170px" }}>
            {this.renderLog(task)}
          </td>
          <td className="td-3 text-titlize">{task.name}</td>
          <td className="td-4 text-titlize">{task.project.name}</td>
          <td className="td-5 text-titlize">
            {task.category ? task.category.name : "---"}
          </td>
          <td className="td-6 text-titlize">
            {this.showCategory(task.priority)}
          </td>
          <td className="td-7">
            {this.dateFormater(this.getEstimateTimeOfTask(task))}
          </td>
          <td
            className="td-8"
            style={
              this.getEstimateTimeOfTask(task) <
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
