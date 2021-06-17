import React, { Component } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import rd3 from "react-d3-library";
import node from "./data";
const BarChart = rd3.BarChart;

class MemberAnalysis extends Component {
  constructor(props) {
    super(props);
    this.state = { d3: "" };
  }

  componentDidMount() {
    this.setState({ d3: node });
  }
  render() {
    return (
      <>
        <div className="col-md-12 no-padding head-box">
          <div className="head-main">
            <div className="head-div">
              <div className="hours">
                <span className="active">230</span>
                <span className="span">hrs</span>
              </div>
              <div className="text">Total Capacity</div>
            </div>
            <div className="head-div">
              <div className="hours">
                <span>149</span>
                <span className="span">hrs</span>
              </div>
              <div className="text">Scheduled</div>
            </div>
            <div className="head-div">
              <div className="hours">
                <span>81</span>
                <span className="span">hrs</span>
              </div>
              <div className="text">Unscheduled</div>
            </div>
            <div className="head-div">
              <div className="hours">
                <span>04</span>
                <span className="span">hrs</span>
              </div>
              <div className="text">Overtime</div>
            </div>
          </div>
        </div>
        <div className="col-md-9 head-date">
          <div className="col-md-1 d-inline-block no-padding text">Custom</div>
          <div className="col-md-3 d-inline-block">
            <DatePicker
              className="form-control"
              selected={this.props.state.dateFrom}
              onChange={this.props.handleDateFrom}
            />
          </div>
          <div className="col-md-3 d-inline-block">
            <DatePicker
              className="form-control"
              selected={this.props.state.dateTo}
              onChange={this.props.handleDateTo}
            />
          </div>
        </div>

        <div>
          <BarChart data={this.state.d3} />
        </div>
      </>
    );
  }
}

export default MemberAnalysis;
