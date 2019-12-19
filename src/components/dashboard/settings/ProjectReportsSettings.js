import React, { Component } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

class ProjectReportsSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectDate: new Date()
    };
  }

  handleSelectDate = date => {
    this.setState({ selectDate: date });
  };
  render() {
    return (
      <div className="employee-project-settings">
        <div className="email-heading">Email Project Reports</div>
        <div className="row">
          <div className="col-md-4 report-box">
            <div className="col-md-12 no-padding day-text">Daily Reports</div>
            <div className="col-md-8 no-padding day-select">
              <select>
                <option>8</option>
                <option>9</option>
                <option>10</option>
                <option>11</option>
                <option>12</option>
              </select>
              <select>
                <option>00</option>
                <option>00</option>
                <option>00</option>
                <option>00</option>
                <option>00</option>
              </select>
            </div>
            <div className="col-md-12 no-padding day-desc">
              Report for Projects below will be mailed daily at time above.
            </div>
          </div>
          <div
            className="col-md-4 report-box"
            // style={{ margin: "0px 15px 0px 15px" }}
          >
            <div className="col-md-12 no-padding day-text">Weekly Reports</div>
            <div className="col-md-8 no-padding week-select">
              <select>
                <option>Sunday</option>
                <option>Monday</option>
                <option>Tuesday</option>
                <option>Wednesday</option>
                <option>Thrusday</option>
                <option>Friday</option>
                <option>Saturday</option>
              </select>
            </div>
            <div className="col-md-12 no-padding day-desc">
              Report for Projects below will be mailed weekly on day above.
            </div>
          </div>
          <div className="col-md-4 report-box">
            <div className="col-md-12 no-padding day-text">Monthly Reports</div>
            <div className="col-md-8 no-padding month-select">
              <DatePicker
                className="form-control"
                selected={this.state.selectDate}
                onChange={this.handleSelectDate}
                placeholderText="Select Date"
                value={moment(this.state.selectDate).format(
                  "ddd | YYYY, MMM DD"
                )}
              />
            </div>
            <div className="col-md-12 no-padding day-desc">
              Report for Projects below will be mailed monthly on date above.
            </div>
          </div>
        </div>
        <div className="employee-project-box">
          <div className="col-md-12 no-padding">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col" style={{ width: "40%" }}>
                    Employee Name{" "}
                    <i className="fa fa-sort" aria-hidden="true"></i>
                  </th>
                  <th scope="col">
                    Frequency <i className="fa fa-sort" aria-hidden="true"></i>
                  </th>
                  <th scope="col">
                    Date Created{" "}
                    <i className="fa fa-sort" aria-hidden="true"></i>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td scope="row">Elise Jane (elise@globex.com)</td>
                  <td>Daily</td>
                  <td>15 Jun 2019</td>
                  <td>
                    <button className="btn btn-link">
                      <i className="fas fa-pencil-alt"></i>
                    </button>
                  </td>
                </tr>
                <tr>
                  <td scope="row">Elise Jane (elise@globex.com)</td>
                  <td>Daily</td>
                  <td>15 Jun 2019</td>
                  <td>
                    <button className="btn btn-link">
                      <i className="fas fa-pencil-alt"></i>
                    </button>
                  </td>
                </tr>
                <tr>
                  <td scope="row">Elise Jane (elise@globex.com)</td>
                  <td>Daily</td>
                  <td>15 Jun 2019</td>
                  <td>
                    <button className="btn btn-link">
                      <i className="fas fa-pencil-alt"></i>
                    </button>
                  </td>
                </tr>
                <tr>
                  <td scope="row">Elise Jane (elise@globex.com)</td>
                  <td>Daily</td>
                  <td>15 Jun 2019</td>
                  <td>
                    <button className="btn btn-link">
                      <i className="fas fa-pencil-alt"></i>
                    </button>
                  </td>
                </tr>
                <tr>
                  <td scope="row">Elise Jane (elise@globex.com)</td>
                  <td>Daily</td>
                  <td>15 Jun 2019</td>
                  <td>
                    <button className="btn btn-link">
                      <i className="fas fa-pencil-alt"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default ProjectReportsSettings;
