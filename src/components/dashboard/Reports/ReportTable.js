import React, { Component } from "react";
import { withRouter } from "react-router-dom";

class ReportTable extends Component {
  constructor(props) {
    super(props);
  }


  render() {
    const TableRow = props => {
      return (
        <>
          <tr className="report-table-date">
            <th>{props.state.date}</th>
            <th></th>
            <th></th>
            <th>{props.state.date}</th>
          </tr>
          {props.state.tasks.map((task, idx) => {
            return (
              <tr key={idx}>
                <td>{task.start_time}</td>
                <td>{task.task_name}</td>
                <td>{task.project_name}</td>
                <td className="text-titlize">{task.end_time}</td>
              </tr>
            );
          })}
        </>
      );
    }

    return (
      <>
        <div className="reports-table-container">
          <div className="report-header">
            <span className="pull-left">Capacity </span>
            <span className="pull-right">Total Time: 200.00 h</span>
          </div>
          <table className="table">
            <thead>
              <tr className="r-l-space-20">
                <th scope="col">Time</th>
                <th scope="col">Task Name</th>
                <th scope="col">Project Name</th>
                <th scope="col">Duration</th>
              </tr>
            </thead>
            <tbody>
              {this.props.taskDetails.map((tasks, index) => {
                return <TableRow state={tasks} />
              })}
            </tbody>
          </table>
        </div>
      </>
    );
  }
}

export default withRouter(ReportTable)