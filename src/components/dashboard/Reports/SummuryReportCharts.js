import React, { Component } from "react";
import ColumnChart from "./ColumnChart";
import PieChart from "./PieChart";
import { get } from "../../../utils/API";
import { MONTH_FORMAT2 } from "../../../utils/Constants";
import moment from "moment";
import axios from "axios";
import PropTypes from 'prop-types';
import ErrorBoundary from '../../../ErrorBoundary';

class SummuryReportCharts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columnChartData: []
    };
  }

  getActive = date => {
    if (this.props.state.frequency == "weekly") {
      let md = moment(date);
      return `Week ${md.week()} ${md.year()}`;
    } else if (this.props.state.frequency == "monthly") {
      return moment(date).format(MONTH_FORMAT2);
    } else {
      return date;
    }
  };

  infoMessage = () => {
    if (
      this.props.searchProjectIds &&
      this.props.searchProjectIds.length > 0 &&
      !this.props.state.selectedPriority &&
      !this.props.state.selectedCategory
    ) {
      return "Showing results for searched project in all categories and in all priorities.";
    } else if (
      this.props.searchProjectIds &&
      this.props.searchProjectIds.length == 0 &&
      !this.props.state.selectedPriority &&
      this.props.state.selectedCategory
    ) {
      return "Showing results for all project in selected category and in all priorities.";
    } else if (
      this.props.searchProjectIds &&
      this.props.searchProjectIds.length == 0 &&
      this.props.state.selectedPriority &&
      !this.props.state.selectedCategory
    ) {
      return "Showing results for all project in all categories and in selected priority.";
    } else if (
      this.props.searchProjectIds &&
      this.props.searchProjectIds.length == 0 &&
      this.props.state.selectedPriority &&
      this.props.state.selectedCategory
    ) {
      return "Showing results for all project in selected category and in selected priority.";
    } else if (
      this.props.searchProjectIds &&
      this.props.searchProjectIds.length > 0 &&
      this.props.state.selectedPriority &&
      !this.props.state.selectedCategory
    ) {
      return "Showing results for searched project in all categories and in selected priority.";
    } else if (
      this.props.searchProjectIds &&
      this.props.searchProjectIds.length > 0 &&
      this.props.state.selectedPriority &&
      this.props.state.selectedCategory
    ) {
      return "Showing results for searched project in selected category and in selected priority.";
    } else {
      return "Showing results for all projects in all categories and in all priorities.";
    }
  };

  addTotalDuration = totalTracks => {
    return totalTracks
      .map(log => log.tracked_time)
      .flat()
      .reduce((a, b) => a + b, 0);
  };

  secondsToHours = seconds => {
    let totalSeconds = Number(seconds);
    let h = Math.floor(totalSeconds / 3600);
    let m = Math.floor((totalSeconds % 3600) / 60);
    let s = Math.floor((totalSeconds % 3600) % 60);
    return h + "H" + " " + m + "M";
  };

  calculateCapacity = () => {
    if (this.props.state.frequency == "daily") {
      return this.props.state.projectReports &&
        this.props.state.projectReports.capacity
        ? `${this.props.state.projectReports.capacity} H`
        : "0 H";
    } else if (this.props.state.frequency == "weekly") {
      return this.props.state.projectReports &&
        this.props.state.projectReports.capacity
        ? `${this.props.state.projectReports.capacity * 5} H`
        : "0 H";
    } else if (this.props.state.frequency == "monthly") {
      return this.props.state.projectReports &&
        this.props.state.projectReports.capacity
        ? `${this.props.state.projectReports.capacity * 20} H`
        : "0 H";
    } else {
      return "0 H";
    }
  };

  render() {
    let totalEstimate =
      this.props.state.projectReports &&
      this.props.state.projectReports.estimateTime
        ? this.props.state.projectReports.estimateTime
        : 0;
    let totalWorked =
      this.props.state.projectReports && this.props.state.projectReports.data
        ? this.addTotalDuration(this.props.state.projectReports.data)
        : 0;

    return (
      <div className="summary-reports">
        <div className="col-md-12 heading">
          <div className="d-inline-block col-md-3">
            <span className="d-inline-block report-heading">
              Summary Report
            </span>
            <i className="fa fa-info-circle tooltip d-inline-block">
              <span className="tooltiptext">{this.infoMessage()}</span>
            </i>
          </div>

          <div className="col-md-9 summury-info-btn d-inline-block">
            <div className="cap-info-btn d-inline-block">
              <button className="d-inline-block">Capacity</button>
              <button className="d-inline-block">
                {this.calculateCapacity()}
              </button>
            </div>
            <div className="sch-info-btn d-inline-block">
              {/* <button className="d-inline-block">Scheduled</button>
              <button className="d-inline-block">
                {this.secondsToHours(totalEstimate)}
              </button> */}
            </div>
            <div className="work-info-btn d-inline-block">
              <button className="d-inline-block">Worked</button>
              <button className="d-inline-block">
                {this.secondsToHours(totalWorked)}
              </button>
            </div>
          </div>
        </div>
        <div
          className="circle-chart d-inline-block"
          style={{ verticalAlign: "top" }}
        >
          <div className="chart d-inline-block">
            <ErrorBoundary>
              <PieChart
                id="projectPieChart"
                type="Projects"
                data={
                  this.props.state.projectReports
                    ? this.props.state.projectReports.data
                    : []
                }
                estimateTime={
                  this.props.state.projectReports
                    ? this.props.state.projectReports.estimateTime
                    : []
                }
              />
            </ErrorBoundary>
          </div>
          <div className="chart d-inline-block">
            <ErrorBoundary>
              <PieChart
                id="categoryPieChart"
                type="Categories"
                data={
                  this.props.state.categoryReports
                    ? this.props.state.categoryReports.data
                    : []
                }
                estimateTime={
                  this.props.state.categoryReports
                    ? this.props.state.categoryReports.estimateTime
                    : []
                }
                handleLoading={this.props.handleLoading}
              />
            </ErrorBoundary>
          </div>
          <div className="chart d-inline-block">
            <ErrorBoundary>
              <PieChart
                id="priorityPieChart"
                type="Priorities"
                data={
                  this.props.state.priorityReports
                    ? this.props.state.priorityReports.data
                    : []
                }
                estimateTime={
                  this.props.state.priorityReports
                    ? this.props.state.priorityReports.estimateTime
                    : []
                }
                handleLoading={this.props.handleLoading}
              />
            </ErrorBoundary>
          </div>
        </div>
        <div className="column-chart d-inline-block">
          <ErrorBoundary>
            <ColumnChart
              data={this.props.state.barChartArray.data}
              barWidth={this.props.state.barChartArray.width}
              activeBar={this.props.state.barChartArray.activeBar}
              state={this.props.state}
              columnChartData={this.props.state.columnChartData}
              handleLoading={this.props.handleLoading}
            />
          </ErrorBoundary>
        </div>
        <div className="legend d-inline-block">
          <div className="d-inline-block">
            <span className="box d-inline-block"></span>
            <span className="text">Remaining Capacity (hours)</span>
          </div>
          <div className="d-inline-block">
            <span className="box stripe-2 d-inline-block"></span>
            <span className="text">
              All other colours for Projects/ Categories/ Priorities
            </span>
          </div>
        </div>
      </div>
    );
  }
}

SummuryReportCharts.propTypes = {
  searchUserDetails: PropTypes.array.isRequired,
  searchProjectIds: PropTypes.array.isRequired,
  handleLoading: PropTypes.func.isRequired,
  priorities: PropTypes.array.isRequired,
  projects: PropTypes.array.isRequired,
  state: PropTypes.object.isRequired,
  setColumnChartData: PropTypes.func.isRequired
}

export default SummuryReportCharts;
