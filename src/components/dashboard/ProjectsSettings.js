import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Header from "./Header";
import AddProjectModal from "./AddProjectModal";
import { get, post, logout, mockPost } from "../../utils/API";
import UpdateProjectModal from "./UpdateProjectModal";

class ProjectsSettings extends Component {
  constructor(props) {
    super(props);
    this.colors = [
      "#FF6900",
      "#FCB900",
      "#7BDCB5",
      "#00D084",
      "#8ED1FC",
      "#0693E3",
      "#ABB8C3",
      "#EB144C",
      "#F78DA7",
      "#9900EF",
    ];
    this.state = {
      workspaces: [],
      workspaceId: "",
      projects: [],
      show: false,
      setShow: false,
      projectId: "",
    };
  }
  logout = async () => {
    await logout();
    this.props.history.push("/login");
  };
  async componentDidMount() {
    try {
      const { data } = await get("workspaces");
      console.log("WorkSpace", data.workspaces);
      this.setState({ workspaces: data.workspaces });
    } catch (e) {
      console.log("err", e);
    }

    this.getWorkspaceParams();

    try {
      const { data } = await get(
        `workspaces/${this.state.workspaceId}/projects`
      );
      //   console.log("projects list", data.projects);
      this.setState({ projects: data.projects });
    } catch (e) {
      console.log("err", e);
    }
  }

  getWorkspaceParams = () => {
    const { workspaceId } = this.props.match.params;
    this.setState({ workspaceId: workspaceId });
  };

  handleClose = () => {
    this.setState({
      show: false,
    });
  };

  handleShow = projectId => {
    this.setState({
      setShow: true,
      show: true,
      projectId: projectId,
    });
  };

  render() {
    return (
      <div>
        <Header
          logout={this.logout}
          workspaces={this.state.workspaces}
          workspaceId={this.state.workspaceId}
        />
        <table class="table">
          <thead>
            <tr>
              <th scope="col" />
              <th scope="col">Project Name</th>
              <th scope="col">Edit</th>
            </tr>
          </thead>
          <tbody>
            {this.state.projects.map((project, index) => {
              return (
                <tr>
                  <th scope="row">{index + 1}</th>
                  <td>{project.name}</td>
                  <td>
                    <button
                      className="btn btn-link"
                      onClick={() => this.handleShow(project.id)}
                    >
                      <i className="fa fa-pencil" aria-hidden="true" />
                    </button>
                    {/* <UpdateProjectModal
                      state={this.state}
                      handleClose={this.handleClose}
                      projectId={project.id}
                      workspaceId={this.state.workspaceId}
                    /> */}
                  </td>
                </tr>
              );
            })}
            <UpdateProjectModal
              state={this.state}
              handleClose={this.handleClose}
              projectId={this.state.projectId}
              workspaceId={this.state.workspaceId}
            />
          </tbody>
        </table>
      </div>
    );
  }
}

export default withRouter(ProjectsSettings);
