import React, { Component } from "react";
import ColumnChart from "./ColumnChart";
import PieChart from "./PieChart";
import { get } from "../../../utils/API";
import { MONTH_FORMAT2 } from "../../../utils/Constants";
import moment from "moment";
import axios from "axios";

class SummuryReportCharts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columnChartData: []
    };
  }

  async componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.state.barChartArray != this.props.state.barChartArray ||
      prevProps.searchProjectIds != this.props.searchProjectIds ||
      prevProps.searchUserDetails != this.props.searchUserDetails
    ) {
      var searchData = {};
      if (this.props.searchUserDetails.length > 0) {
        let userIds = this.props.searchUserDetails.map(
          member => member.member_id
        );
        searchData["user_ids"] =
          this.props.searchUserDetails.length > 0
            ? userIds.join(",")
            : this.props.state.userId;
      }
      if (this.props.searchProjectIds.length > 0) {
        searchData["project_ids"] = this.props.searchProjectIds.join(",");
      }
      this.loadMultipleApiData(searchData);
    }
  }

  loadMultipleApiData = async searchParam => {
    var results = [];
    let finalResults = new Promise(async (resolve, reject) => {
      try {
        let finalArray = this.props.state.barChartArray.dates.map(
          async (option, index) => {
            let searchData = {
              start_date: option.startDate,
              end_date: option.endDate
            };
            const searchResult = await get(
              `workspaces/${this.props.state.workspaceId}/user_summary_report`,
              { ...searchData, ...searchParam }
            );
            results.push({
              totalEstimateTime: searchResult.data.total_estimated_time,
              trackedTime: searchResult.data.total_tracked_time,
              date: searchData.start_date,
              id: index + 1,
              activeBar: this.getActive(searchData.start_date)
            });
          }
        );
        await Promise.all(finalArray).then(function(response) {});
        resolve(results);
      } catch (err) {
        reject(err);
      }
    });
    var newFinalResults = [];
    var self = this;
    await finalResults.then(function(response) {
      newFinalResults = response;
      self.setState({ columnChartData: newFinalResults });
      self.props.setColumnChartData(newFinalResults);
    });
  };

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

  render() {
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
              <button className="d-inline-block">8 hours</button>
            </div>
            <div className="sch-info-btn d-inline-block">
              <button className="d-inline-block">Scheduled</button>
              <button className="d-inline-block">7 hours</button>
            </div>
            <div className="work-info-btn d-inline-block">
              <button className="d-inline-block">Worked</button>
              <button className="d-inline-block">5 hours</button>
            </div>
          </div>
        </div>
        <div className="circle-chart d-inline-block">
          <div className="chart d-inline-block">
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
          </div>
          <div className="chart d-inline-block">
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
            />
          </div>
          <div className="chart d-inline-block">
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
            />
          </div>
        </div>
        <div className="column-chart d-inline-block">
          <ColumnChart
            data={this.props.state.barChartArray.data}
            barWidth={this.props.state.barChartArray.width}
            activeBar={this.props.state.barChartArray.activeBar}
            state={this.props.state}
            columnChartData={this.props.state.columnChartData}
          />
        </div>
        <div className="legend d-inline-block">
          <div className="d-inline-block">
            <span className="box d-inline-block"></span>
            <span className="text">Remaining Scheduled Time (hours)</span>
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

export default SummuryReportCharts;
