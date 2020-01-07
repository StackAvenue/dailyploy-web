import React, { Component } from "react";
import ColumnChart from "./ColumnChart";
import PieChart from "./PieChart";
import moment from "moment";

class SummuryReportCharts extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="summary-reports">
        <div className="col-md-12 heading">
          <div className="d-inline-block col-md-3">
            <span className="d-inline-block report-heading">
              Summary Report
            </span>
            <i className="fa fa-info-circle tooltip d-inline-block">
              <span className="tooltiptext">
                Min 8 characters at least 1 number and 1 special character
              </span>
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
              data={this.props.projects}
            />
          </div>
          <div className="chart d-inline-block">
            <PieChart
              id="categoryPieChart"
              type="Categories"
              data={this.props.state.taskCategories}
            />
          </div>
          <div className="chart d-inline-block">
            <PieChart
              id="priorityPieChart"
              type="Priorities"
              data={this.props.priorities}
            />
          </div>
        </div>
        <div className="column-chart d-inline-block">
          <ColumnChart
            data={this.props.state.barChartArray.data}
            barWidth={this.props.state.barChartArray.width}
            state={this.props.state}
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
