import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { NavDropdown, DropdownButton, Dropdown } from "react-bootstrap";


class DisplayTask extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true,
      taskName: "",
      description: "",
      estimation: "",
      status: {
        color: "#53a4f0",
        status: "Not Started",
      },
      estimationtime: "",
      priorities: {
        name: "no_priority",
        color_code: "#9B9B9B",
        label: "no priority",
      },
      prioritie: "",
      member: "",
      task_lists: [],
      count: 0,
    };
  }
  render() {
    var count = 0;
    return (
      <>
        {this.props.task_lists
          ? this.props.task_lists.map((task, id) => {
            if (task.list_id === this.props.list_id) {
              count = count + 1;
              return (
                <>
                  {count === 1 ? (
                    <div className="filterAndGroup">
                      <div className="filterby">
                        <div className="navDiv">
                          <NavDropdown
                            title="Filter By"
                            id="basic-nav-dropdown"
                            className="btn btn-color"
                          >
                            filter by
                            <NavDropdown.Item>Status</NavDropdown.Item>
                            <NavDropdown.Item>
                              <input type="checkbox" id="" name="" value="" />
                                &nbsp;&nbsp;Completed
                              </NavDropdown.Item>
                            <NavDropdown.Item>
                              <input type="checkbox" id="" name="" value="" />
                                &nbsp;&nbsp;Not Started
                              </NavDropdown.Item>
                            <NavDropdown.Item>
                              <input type="checkbox" id="" name="" value="" />
                                &nbsp;&nbsp;In Progress
                              </NavDropdown.Item>
                            <NavDropdown.Item>Member</NavDropdown.Item>
                            {this.props.projects.map((project, inde) => {
                              return (
                                <div key={inde}>
                                  {" "}
                                  {project.members.map((member, id) => (
                                    <NavDropdown.Item>
                                      <input
                                        type="checkbox"
                                        id={id}
                                        name=""
                                        value=""
                                      />
                                        &nbsp;&nbsp;{member.name}
                                    </NavDropdown.Item>
                                  ))}
                                </div>
                              );
                            })}
                          </NavDropdown>
                        </div>
                      </div>
                      <div className="groupby">
                        <div className="navDiv">
                          <NavDropdown
                            title="Group By"
                            id="basic-nav-dropdown"
                            className="btn btn-color"
                          >
                            group by
                            <NavDropdown.Item>Status</NavDropdown.Item>
                            <NavDropdown.Item>Mamber</NavDropdown.Item>
                          </NavDropdown>
                        </div>
                      </div>
                    </div>
                  ) : null}
                  <div className="InnershowCardDetails">
                    <div className="task">
                      <div className="taskNo">
                        <input
                          type={Text}
                          value={task.name}
                          placeholder="Task Name"
                          onChange={(e) => this.handleInputChange(e)}
                          name="taskName"
                          className="form-control"
                        />
                      </div>
                      {/* <div className="Description">
                        <input
                          type={Text}
                          name="description"
                          placeholder="Description"
                          value={task.description}
                          onChange={(e) => this.handleInputChange(e)}
                          className="form-control"
                        />
                      </div> */}
                      <div className="Estimation">
                        <input
                          type={Text}
                          name="estimation"
                          placeholder="Estimation"
                          value={task.estimation}
                          onChange={(e) => this.handleInputChange(e)}
                          className="form-control"
                        />
                      </div>
                      <div className="status">
                        <input
                          type={Text}
                          name="status"
                          disabled="disabled"
                          value={task.status}
                          onChange={(e) => this.handleInputChange(e)}
                          style={{
                            backgroundColor: `${this.state.status.color}`,
                          }}
                          className="form-control"
                        />
                      </div>
                      <div className="time">
                        <div
                          className="disc"
                          style={{
                            backgroundColor: `${this.state.priorities.color_code}`,
                          }}
                        ></div>
                          &nbsp;&nbsp;
                          <span>{task.priority}</span>
                      </div>
                      <div className="member">
                        <div className="navDiv">
                          <select
                            name="member"
                            onChange={(e) => this.handleInputChange(e)}
                            className="form-control"
                          >
                            <option value="">Member</option>
                            {this.props.projects.map((project, inde) => {
                              return (
                                <>
                                  {" "}
                                  {project.members.map((member, id) => (
                                    <option value={member.name}>
                                      &nbsp;&nbsp;{member.name}
                                    </option>
                                  ))}
                                </>
                              );
                            })}
                          </select>
                        </div>
                      </div>
                      <div className="option">
                        <div className="navDiv">
                          <DropdownButton
                            title={<i class="fas fa-ellipsis-h" />}
                            id="basic-nav-dropdown"
                            className="btn btn-color"
                          >
                            <Dropdown.Item eventKey="">
                              {/* <div className="icons">
                                <i class="fas fa-hourglass-start"></i>
                              </div> */}
                              Start Task
                              </Dropdown.Item>
                            <Dropdown.Item eventKey="">
                              {/* <div className="icons">
                                <img src={moveto} alt="move to" className="moveto-icon"></img>
                              </div> */}
                                  Move To

                              </Dropdown.Item>
                            <Dropdown.Item eventKey="">
                              Priorities
                              </Dropdown.Item>
                            <Dropdown.Item eventKey="">Delete</Dropdown.Item>
                          </DropdownButton>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              );
            } else {
              return null;
            }
          })
          : null}
      </>
    );
  }
}
export default withRouter(DisplayTask);
