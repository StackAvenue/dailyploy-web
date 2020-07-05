import React, { Component } from "react";
import ReportTableRow from "./../Reports/ReportTableRow";
import ReportTable2Row from "./../Reports/ReportTable2Row";
import { withRouter } from "react-router-dom";
import moment from "moment";
import { DATE_FORMAT1 } from "./../../../utils/Constants";

class ReportTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      totalTime: 0
    };
  }

  calculateTime = (startDateTime, endDateTime) => {
    var s = new Date(startDateTime);
    var e = new Date(endDateTime);
    return (
      s.getHours() +
      ":" +
      s.getMinutes() +
      " - " +
      e.getHours() +
      ":" +
      e.getMinutes()
    );
  };

  getDiffOfTwoDate = (startDateTime, endDateTime) => {
    var diff = Math.abs(new Date(startDateTime) - new Date(endDateTime));
    var hours = (diff / (1000 * 60 * 60)).toFixed(1);
    return hours + " h";
  };

  getTotalHours = tasks => {
    if (tasks !== undefined) {
      var totalSec = null;
      {
        tasks.map((task, idx) => {
          totalSec += Math.abs(
            new Date(task.start_datetime) - new Date(task.end_datetime)
          );
        });
      }
      var hours = (totalSec / (1000 * 60 * 60)).toFixed(1);
      return hours + " h";
    }
    return "0 h";
  };

  renderTableData = () => {
    if (this.props.frequency != 'custom') {
      return this.props.state.selectedDays.map((date, index) => {
        var date = moment(date).format(DATE_FORMAT1);
        var tasks =
          this.props.taskDetails && this.props.taskDetails[date] !== undefined
            ? this.props.taskDetails[date]
            : [];
        return (
          <ReportTableRow
            key={index}
            tasks={tasks}
            date={date}
            frequency={this.props.frequency}
            timeTrackUpdate={this.props.timeTrackUpdate}
          />
        );
      });
    }
    else {
      let index = 0;
      let ReportTableArr = [];
      let startDate = this.props.state.dateFrom;
      let endDate = this.props.state.dateTo;
      while (moment(startDate) <= moment(endDate)) {
        let date = moment(startDate).format(DATE_FORMAT1);
        startDate = moment(startDate).add(1, 'days').format(DATE_FORMAT1);
        index++;
        var tasks =
          this.props.taskDetails && this.props.taskDetails[date] !== undefined
            ? this.props.taskDetails[date]
            : [];
        ReportTableArr.push(
          <ReportTableRow
            key={index - 1}
            tasks={tasks}
            date={date}
            frequency={this.props.frequency}
            timeTrackUpdate={this.props.timeTrackUpdate}
          />
        );
      }
      return ReportTableArr
    }

  };

  renderTable2Data = () => {
    return this.props.state.selectedDays.map((date, index) => {
      var date = moment(date).format(DATE_FORMAT1);
      var tasks =
        this.props.taskDetails[date] !== undefined
          ? this.props.taskDetails[date]
          : [];
      return (
        <ReportTable2Row
          key={index}
          tasks={tasks}
          date={date}
          userRole={this.props.state.userRole}
          frequency={this.props.frequency}
        />
      );
    });
  };

  tableHeader = () => {
    return (
      <>
        <th scope="col-md-1">Status</th>
        <th scope="col-md-2">Time</th>
        <th scope="col-md-3">Task Name</th>
        <th scope="col-md-3">Project Name</th>
        <th scope="col-md-1">Category</th>
        <th scope="col-md-1">Priority</th>
        <th scope="col">Estimate Time</th>
        <th scope="col-md-1">Duration</th>
      </>
    );
  };

  dateHeader = (tasks, date) => {
    return (
      <>
        <tr className="report-table-date">
          <th>{date}</th>
          <th></th>
          <th></th>
          <th>{this.getTotalHours(tasks)}</th>
        </tr>
      </>
    );
  };

  checkProject = () => {
    return (
      this.props.searchProjectIds.length > 0 &&
      this.props.state.userRole === "admin" &&
      this.props.searchUserDetails.length === 0
    );
  };

  table1 = () => {
    return (
      <>
        <thead>
          <tr className="r-l-space-20">{this.tableHeader()}</tr>
        </thead>
        <tbody>{this.renderTableData()}</tbody>
      </>
    );
  };

  table2 = () => {
    return (
      <>
        <thead>
          <tr className="r-l-space-20">
            <th scope="col">Employee Name</th>
            <th scope="col">Task Name</th>
            <th scope="col">Category</th>
            <th scope="col">Time</th>
            <th scope="col">Duration</th>
          </tr>
        </thead>
        <tbody>{this.renderTable2Data()}</tbody>
      </>
    );
  };

  render() {
    return (
      <>
        <div>
          <div className="report-message">{this.props.state.message} </div>
          <div className="reports-table-container">
            <div
              className="report-header"
              style={{ fontWeight: "600", color: "#000000" }}
            >
              <span className="pull-left">Capacity </span>
              <span className="pull-right">
                {"Total Time: " +
                  `${
                  this.props.state.totalTime
                    ? this.props.state.totalTime
                    : "0H 0M"
                  }`}
              </span>
            </div>
            <table className="table">
              {/* {!this.checkProject() ? this.table1() : this.table2()} */}
              {this.table1()}
            </table>
          </div>
        </div>
      </>
    );
  }
}

export default withRouter(ReportTable);
