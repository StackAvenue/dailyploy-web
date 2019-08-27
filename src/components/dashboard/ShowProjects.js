import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import Header from "./Header";
import { get, post, logout, mockPost } from "../../utils/API";
import MenuBar from "./MenuBar";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

class ShowProjects extends Component {
  constructor(props) {
    super(props);
    this.projectUser = [
      "Arpit Jain",
      "Ankit Jain",
      "Vikram Jadon",
      "Alam Khan",
      "Kiran Chaudahry",
      "Akshay Malta",
    ];
    this.state = {
      workspaces: [],
      workspaceId: "",
      projectNames: [],
      sort: "week",
      projects: [],
    };
  }
  logout = async () => {
    await logout();
    this.props.history.push("/login");
  };
  async componentDidMount() {
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
      console.log("projects list", data.projects);
      this.setState({ projects: data.projects });
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

  projectView = view => {
    console.log("view", view);
  };

  render() {
    var x = "2024-08-04";
    var y = x.split("-");
    console.log("date projects", y);

    return (
      <div>
        <Header
          logout={this.logout}
          workspaces={this.state.workspaces}
          workspaceId={this.state.workspaceId}
        />
        <MenuBar
          onSelectSort={this.onSelectSort}
          workspaceId={this.state.workspaceId}
        />
        <div className="show-projects">
          <div className="views">
            {/* <div className="col-md-2 ml-auto">
              <button
                className="btn btn-link"
                onClick={this.projectView("list")}
              >
                <i class="fa fa-bars"></i>
              </button>
              <button
                className="btn btn-link"
                onClick={this.projectView("grid")}
              >
                <i class="fas fa-th"></i>
              </button>
            </div> */}
            <Tabs>
              <div className="col-md-2 ml-auto">
                <TabList>
                  <Tab>
                    <i class="fa fa-bars"></i>
                  </Tab>
                  <Tab>
                    <i class="fas fa-th"></i>
                  </Tab>
                </TabList>
              </div>

              <TabPanel>
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">
                        <div class="checkbox">
                          <input
                            type="checkbox"
                            id="checkbox"
                            name=""
                            value=""
                          />
                          <label for="checkbox"></label>
                        </div>
                      </th>
                      <th scope="col">ID</th>
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
                        <tr>
                          <td>
                            <div class="checkbox">
                              <input
                                type="checkbox"
                                id={`checkbox${index}`}
                                name=""
                                value=""
                              />
                              <label for={`checkbox${index}`}></label>
                            </div>
                          </td>
                          <td>{index + 1}</td>
                          <td>{project.name}</td>
                          <td>
                            <div
                              className="color-block"
                              style={{
                                "background-color": `${project.color_code}`,
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
                            {this.projectUser.map((user, index) => {
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
                      <div className="col-md-2 grid-div">
                        <div className="col-md-12 id">1</div>
                        <div className="col-md-12 name">Project Name</div>
                        <div className="col-md-12 no-padding">
                          <div className="col-md-2 d-inline-block no-padding">
                            <div className="user-block">AJ</div>
                          </div>
                          <div className="col-md-8 d-inline-block no-padding">
                            <div className="user-block">AJ</div>
                          </div>
                          <div className="col-md-2 d-inline-block no-padding">
                            <div className="grid-color"></div>
                          </div>
                        </div>
                        <div className="col-md-12 no-padding">
                          <div className="col-md-8 d-inline-block date">
                            25 Jul 2019 - Undefined
                          </div>
                          <div className="col-md-4 d-inline-block duration">
                            10 Months
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </TabPanel>
            </Tabs>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(ShowProjects);
