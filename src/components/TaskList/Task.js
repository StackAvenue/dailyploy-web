import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Modal, Button, NavDropdown, DropdownButton, Dropdown } from "react-bootstrap";
import { select } from "react-cookies";
import {
  PRIORITIES,
  DATE_FORMAT3,
  DATE_FORMAT1,
} from "./../../utils/Constants";
class Task extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      taskName: "",
      description: "",
      estimation: "",
      status: {
        color: "#53a4f0",
        status: "Not Started"
      },
      estimationtime: "",
      priorities: {
        name: "no_priority",
        color_code: "#9B9B9B",
        label: "no priority"
      },
      prioritie: "",
      member: "",
      searchOptions: [],
      searchProjectIds: [],
      searchUserDetails: [],


    };
  }

  handleSearchFilterResult = data => {
    var searchUserDetails = [];
    var projectIds = [];
    if (data) {
      data.map((item, i) => {
        if (item.type === "member") {
          searchUserDetails.push(item);
        } else if (item.type === "project") {
          projectIds.push(item.project_id);
        }
      });
    }
    this.setState({
      searchProjectIds: projectIds,
      searchUserDetails: searchUserDetails
    });
  };

  isReports = () => {
    let routeName = this.props.pathname;
    if (routeName === "reports") {
      return true;
    }
    return false;
  };

  toggleSearchBy = (text) => {
    this.setState({
      searchFlag: text,
    });
  };
  handleDropdownInputChange = (e) => {
    console.log(e)
  }

  handleInputChange = (e) => {
    const { name, value } = e.target;

    this.setState({ [name]: value });
    console.log(value)
  };
  render() {

    return (
      <>

        <div className="InnershowCardDetails">
          <div className="task">
            <div className="taskNo">
              <input type={Text} value={this.state.taskName} placeholder="Task Name" onChange={e => this.handleInputChange(e)} name="taskName" className="form-control" />
            </div>
            <div className="Description">
              <input type={Text} name="description" placeholder="Description" value={this.state.description} onChange={e => this.handleInputChange(e)} className="form-control" />
            </div>
            <div className="Estimation">
              <input type={Text} name="estimation" placeholder="Estimation" value={this.state.estimation} onChange={e => this.handleInputChange(e)} className="form-control" />
              {/* <p className="text-Estimation">1hr=1pt</p> */}
            </div>
            <div className="status" >
              <input type={Text} name="status" disabled="disabled" value={this.state.status.status} onChange={e => this.handleInputChange(e)} style={{ backgroundColor: `${this.state.status.color}` }} className="form-control" />
            </div>
            <div className="time" >
              <div className="disc" style={{ backgroundColor: `${this.state.priorities.color_code}` }}></div>
                &nbsp;&nbsp;<select name="prioritie" onChange={e => this.handleInputChange(e)} className="form-control" placeholder="Priorities">
                <option value="no priority">Priorities</option>
                {PRIORITIES.map((Priorities, id) => (<option value={Priorities.name}>{Priorities.label}</option>))}

              </select>
            </div>
            <div className="member" >


              <div className="navDiv">
                <select name="member" onChange={e => this.handleInputChange(e)} className="form-control" >

                  <option value="">Member</option>
                  {this.props.projects.map((project, inde) => {
                    return (
                      <> {project.members.map((member, id) => (<option value={member.name}>&nbsp;&nbsp;{member.name}</option>))}</>
                    )
                  })}
                </select>
              </div>
            </div>
            <div className="option" >
              <div className="navDiv">
                <DropdownButton title={<i class="fas fa-ellipsis-h" />} id="basic-nav-dropdown" className="btn btn-color">
                  <Dropdown.Item eventKey="">Start Task</Dropdown.Item>
                  <Dropdown.Item eventKey="">Move To</Dropdown.Item>
                  <Dropdown.Item eventKey="">Priorities</Dropdown.Item>
                  <Dropdown.Item eventKey="">Delete</Dropdown.Item>
                </DropdownButton>
              </div>

            </div>


          </div>
        </div>
      </>
    );
  }

}
export default withRouter(Task);