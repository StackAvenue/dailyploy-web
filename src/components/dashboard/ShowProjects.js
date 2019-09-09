import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Header from "./Header";
import { get, post, logout, mockPost } from "../../utils/API";
import MenuBar from "./MenuBar";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import GridBlock from "./ProjectViews/GridBlock";
import Sidebar from "./Sidebar";
import { Router } from "react-router";

class ShowProjects extends Component {
  constructor(props) {
    super(props);
    this.projectUser = [
      "Arpit Jain",
      "Ankit Jain",
      "Vikram Jadon",
      "Alam Khan",
      "Kiran Chaudahry",
      "Kiran Chaudahry",
      "Kiran Chaudahry",
      "Kiran Chaudahry",
    ];
    this.state = {
      workspaces: [],
      workspaceId: "",
      projectNames: [],
      sort: "week",
      projects: [],
      isChecked: true,
      isLoading: false,
    };
  }
  countIncrese = projectUser => {
    let arr = projectUser;
    let count;
    if (arr.length >= 4) {
      count = arr.length - 4;
    }
    return count;
  };
  logout = async () => {
    await logout();
    this.props.history.push("/login");
  };
  async componentDidMount() {
    this.setState({ isLoading: true });
    try {
      const { data } = await get("workspaces");
      this.setState({ workspaces: data.workspaces });
    } catch (e) {
      console.log("err", e);
    }

    this.getWorkspaceParams();

    try {
      const { data } = await get(
        `workspaces/${this.state.workspaceId}/projects`
      );
      this.setState({ projects: data.projects, isLoading: false });
    } catch (e) {
      console.log("err", e);
    }
  }

  getWorkspaceParams = () => {
    const { workspaceId } = this.props.match.params;
    this.setState({ workspaceId: workspaceId });
  };

  onSelectSort = value => {
    console.log("selected value ", value);
    this.setState({ sort: value });
  };

  getDate = date => {
    var d = date.split("-");
    var date1 = new Date(d[0], d[1], d[2]);
    return date1;
  };

  monthDiff = (d1, d2) => {
    var months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth() + 1;
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
  };

  classNameRoute = () => {
    let route = this.props.history.location.pathname;
    let routeName = route.split("/")[1];
    if (routeName === "projects") {
      return "projectsTrue";
    } else {
      return false;
    }
  };

  checkAll = e => {
    const allCheckboxChecked = e.target.checked;
    var checkboxes = document.getElementsByName("isChecked");
    if (allCheckboxChecked) {
      for (var i in checkboxes) {
        if (checkboxes[i].checked == false) {
          checkboxes[i].checked = true;
        }
      }
    } else {
      for (var i in checkboxes) {
        if (checkboxes[i].checked == true) {
          checkboxes[i].checked = false;
        }
      }
    }
  };

  handleCheck = e => {
    const value = e.target.checked;
    console.log("value", value);
  };

  handleLoad = value => {
    window.location.reload();
    this.setState({ isLoading: value });
  };

  render() {
    var x = "2024-08-04";
    var y = x.split("-");

    return (
      <div>
        <div className="row no-margin">
          <Sidebar workspaces={this.state.workspaces} />
          <div className="dashboard-main no-padding">
            <Header
              logout={this.logout}
              workspaces={this.state.workspaces}
              workspaceId={this.state.workspaceId}
            />
            <MenuBar
              onSelectSort={this.onSelectSort}
              workspaceId={this.state.workspaceId}
              classNameRoute={this.classNameRoute}
              handleLoad={this.handleLoad}
            />
            <div className="show-projects">
              <div className="views">
                <Tabs>
                  <div className="col-md-12 text-center">
                    <div
                      className="col-md-2 offset-5"
                      style={{ position: "relative", top: "-74px" }}
                    >
                      <TabList>
                        <Tab>
                          <i className="fa fa-bars"></i>
                        </Tab>
                        <Tab>
                          <i className="fas fa-th"></i>
                        </Tab>
                      </TabList>
                    </div>
                  </div>
                  {/* <div className="col-md-12 no-padding hr"></div> */}

                  <TabPanel>
                    <table className="table">
                      <thead>
                        <tr>
                          <th scope="col">
                            <div className="custom-control custom-checkbox">
                              <input
                                type="checkbox"
                                className="custom-control-input"
                                id={`customCheck`}
                                onChange={this.checkAll}
                                name="chk[]"
                              />
                              <label
                                className="custom-control-label"
                                htmlFor={`customCheck`}
                              ></label>
                            </div>
                          </th>
                          <th scope="col">Project ID</th>
                          <th scope="col">Project Name</th>
                          <th scope="col">Colour</th>
                          <th scope="col">Project Owner</th>
                          <th scope="col">Start Date</th>
                          <th scope="col">End Date</th>
                          <th scope="col">Duration</th>
                          <th scope="col">Project Members</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.projects.map((project, index) => {
                          return (
                            <tr key={index}>
                              <td>
                                {/* <div className="checkbox">
                                  <input
                                    type="checkbox"
                                    id={`checkbox${index}`}
                                    name=""
                                    value=""
                                  />
                                  <label for={`checkbox${index}`}></label>
                                </div> */}
                                <div className="custom-control custom-checkbox">
                                  <input
                                    type="checkbox"
                                    className="custom-control-input"
                                    id={`customCheck${index}`}
                                    name="isChecked"
                                    onChange={this.handleCheck}
                                  />
                                  <label
                                    className="custom-control-label"
                                    htmlFor={`customCheck${index}`}
                                  ></label>
                                </div>
                              </td>
                              <td>{index + 1}</td>
                              <td>{project.name}</td>
                              <td>
                                <div
                                  className="color-block"
                                  style={{
                                    backgroundColor: `${project.color_code}`,
                                  }}
                                ></div>
                              </td>
                              <td>{project.name}</td>
                              <td>{project.start_date}</td>
                              <td>2024-08-04</td>
                              <td>
                                {this.monthDiff(
                                  this.getDate(project.start_date),
                                  this.getDate("2024-08-04")
                                )}
                                &nbsp; months
                              </td>
                              <td>
                                <span>
                                  {this.projectUser
                                    .slice(0, 4)
                                    .map((user, index) => {
                                      return (
                                        <div key={index} className="user-block">
                                          <span>
                                            {user
                                              .split(" ")
                                              .map(x => x[0])
                                              .join("")}
                                          </span>
                                        </div>
                                      );
                                    })}
                                </span>
                                <span>
                                  <div
                                    key={index}
                                    className="user-block"
                                    style={{ backgroundColor: "#33a1ff" }}
                                  >
                                    <span>
                                      +{this.countIncrese(this.projectUser)}
                                    </span>
                                  </div>
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </TabPanel>
                  <TabPanel>
                    <div className="row grid-view no-margin">
                      {this.state.projects.map((project, index) => {
                        return (
                          <GridBlock
                            key={index}
                            project={project}
                            index={index}
                            projectUser={this.projectUser}
                            monthDiff={this.monthDiff}
                            getDate={this.getDate}
                            countIncrese={this.countIncrese}
                          />
                        );
                      })}
                    </div>
                  </TabPanel>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(ShowProjects);
